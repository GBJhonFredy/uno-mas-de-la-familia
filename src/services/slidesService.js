import { app, db } from '@/services/firebase'
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  listAll
} from 'firebase/storage'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore'
import {
  onSnapshot,
  orderBy,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore'
import { deleteObject } from 'firebase/storage'
import imageCompression from 'browser-image-compression'

const storage = getStorage(app)

/**
 * Sube un slide: imagen comprimida + JSON + registro en Firestore
 */
export async function createSlide({ file, title, text, published = true }) {
  if (!file) throw new Error('Archivo requerido')

  // ---- 1️⃣ Comprimir imagen ----
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1280,
    useWebWorker: true
  })

  const baseName = `slides/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`

  // ---- 2️⃣ Subir imagen comprimida ----
  const imgRef = sRef(storage, `${baseName}.webp`)
  await uploadBytes(imgRef, compressed)
  const imageUrl = await getDownloadURL(imgRef)

  // ---- 3️⃣ Crear JSON de metadatos ----
  const metadata = {
    title: title?.trim() || '',
    text: text?.trim() || '',
    imageUrl,
    published: !!published,
    createdAt: new Date().toISOString()
  }

  const jsonRef = sRef(storage, `${baseName}.json`)
  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  await uploadBytes(jsonRef, blob)
  const jsonUrl = await getDownloadURL(jsonRef)

  // ---- 4️⃣ Registrar referencia ligera en Firestore ----
  await addDoc(collection(db, 'slides'), {
    path: `${baseName}.json`,
    published,
    createdAt: serverTimestamp()
  })

  return { imageUrl, jsonUrl }
}

/**
 * Obtiene todos los slides publicados leyendo los JSON desde Storage
 */
export async function getSlides() {
  const slidesFolder = sRef(storage, 'slides')
  const result = await listAll(slidesFolder)
  const jsonFiles = result.items.filter(i => i.name.endsWith('.json'))

  const slides = []
  for (const file of jsonFiles) {
    const url = await getDownloadURL(file)
    const res = await fetch(url)
    const meta = await res.json()
    // Por defecto filtramos los no publicados para el uso público.
    if (meta.published !== false) {
      slides.push({
        ...meta,
        path: file.fullPath, // 🔹 guardamos la ruta para identificarlo
        jsonUrl: url
      })
    }
  }

  slides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return slides
}

/**
 * Elimina un slide tanto de Firestore como del Storage (imagen + JSON)
 */
export async function deleteSlideById(pathOrJsonUrl) {
  try {
    // 1️⃣ Borrar el archivo JSON
    const jsonRef = sRef(storage, pathOrJsonUrl)
    await deleteObject(jsonRef).catch(() => {})

    // 2️⃣ Borrar también la imagen asociada (.webp)
    const imgPath = pathOrJsonUrl.replace(/\.json$/, '.webp')
    const imgRef = sRef(storage, imgPath)
    await deleteObject(imgRef).catch(() => {})

    // 3️⃣ Borrar referencia en Firestore si existe
    const q = query(collection(db, 'slides'), where('path', '==', pathOrJsonUrl))
    const snap = await getDocs(q)
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'slides', d.id))
    }

    console.log('✅ Slide eliminado:', pathOrJsonUrl)
  } catch (err) {
    console.error('Error eliminando slide', err)
    throw err
  }
}

/**
 * Actualiza un slide existente (solo metadatos)
 */
export async function updateSlide(path, { title, text, published }) {
  const jsonRef = sRef(storage, path)
  try {
    // Intentamos leer el JSON existente para no perder campos como imageUrl o createdAt
    let existing = {}
    try {
      const url = await getDownloadURL(jsonRef)
      const res = await fetch(url)
      existing = await res.json()
    } catch (err) {
      console.warn('No se pudo leer JSON existente al actualizar slide:', path, err)
    }

    // Si el JSON no tiene imageUrl, intentamos reconstruirla a partir del .webp
    if (!existing.imageUrl) {
      try {
        const imgPath = path.replace(/\.json$/, '.webp')
        const imgUrl = await getDownloadURL(sRef(storage, imgPath))
        existing.imageUrl = imgUrl
      } catch (err) {
        // si falla, no bloqueamos la actualización
        console.warn('No se pudo obtener imageUrl desde .webp para', path, err)
      }
    }

    const newMeta = {
      ...existing,
      title: title ?? existing.title ?? '',
      text: text ?? existing.text ?? '',
      published: typeof published === 'boolean' ? published : existing.published,
      updatedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(newMeta)], { type: 'application/json' })
    await uploadBytes(jsonRef, blob)
  } catch (err) {
    console.error('Error actualizando JSON del slide', path, err)
    throw err
  }

  // Actualiza en Firestore
  const q = query(collection(db, 'slides'), where('path', '==', path))
  const snap = await getDocs(q)
  for (const d of snap.docs) {
    await updateDoc(doc(db, 'slides', d.id), { published })
  }
}

/**
 * Escucha la colección `slides` en Firestore y notifica los slides en tiempo real.
 * callback recibe un arreglo de slides ({ title, text, imageUrl, published, path, jsonUrl })
 * options: { includeUnpublished: boolean }
 */
export function listenSlides(callback, options = { includeUnpublished: false }) {
  const q = query(collection(db, 'slides'), orderBy('createdAt', 'desc'))
  const unsub = onSnapshot(q, async snapshot => {
    const slides = []
    // Recolectar promesas para leer cada JSON desde Storage
    const promises = snapshot.docs.map(async d => {
      const data = d.data()
      const path = data.path
      try {
        const ref = sRef(storage, path)
        const url = await getDownloadURL(ref)
        const res = await fetch(url)
        let meta = await res.json()
        // Si el JSON no contiene imageUrl (posible si se sobrescribió), intentamos reconstruirla
        if (!meta.imageUrl) {
          try {
            const imgPath = path.replace(/\.json$/, '.webp')
            const imgUrl = await getDownloadURL(sRef(storage, imgPath))
            meta.imageUrl = imgUrl
          } catch (err) {
            // no crítico
            console.warn('No se pudo obtener imageUrl para', path, err)
          }
        }
        // Si no incluimos no publicados, filtramos aquí
        if (!options.includeUnpublished && meta.published === false) return null
        return { ...meta, path, jsonUrl: url }
      } catch (err) {
        // Si falla la lectura del JSON, ignorar pero loguear
        console.error('Error leyendo JSON de slide', path, err)
        return null
      }
    })

    const results = await Promise.all(promises)
    for (const r of results) if (r) slides.push(r)
    callback(slides)
  })

  return unsub
}