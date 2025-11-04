// /src/services/productsService.js
import { app, db } from '@/services/firebase'
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject
} from 'firebase/storage'
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore'
import imageCompression from 'browser-image-compression'

const storage = getStorage(app)

/**
 * Sube un producto dentro de su categoría (imagen .webp + JSON + registro en Firestore)
 */
/**
 * Sube un producto según categoría
 * - Si la categoría es salud, belleza o accesorios → solo imagen, título y valor
 * - Si es alimentos → guarda todo (empaquetado, kilo, etc.)
 */
export async function createProduct(category, form) {
  if (!form.file) throw new Error('Imagen requerida')

  // 1️⃣ Comprimir imagen
  const compressed = await imageCompression(form.file, {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1280,
    useWebWorker: true
  })

  // 2️⃣ Determinar ruta base en storage
  const basePath = `products/${category}/${Date.now()}-${form.file.name.replace(/\.[^/.]+$/, '')}`

  // 3️⃣ Subir imagen comprimida
  const imgRef = sRef(storage, `${basePath}.webp`)
  await uploadBytes(imgRef, compressed)
  const imageUrl = await getDownloadURL(imgRef)

  // 4️⃣ Crear metadatos
  const normalizedCategory = category.toLowerCase()
  const baseData = {
    title: form.titulo?.trim() || '',
    imageUrl,
    createdAt: new Date().toISOString(),
  }

  // 🔸 Si es belleza, salud o accesorios → solo guarda título, valor, imagen
  let metadata = {}
  if (['Salud', 'Belleza', 'Accesorios'].includes(normalizedCategory)) {
    metadata = {
      ...baseData,
      valor: form.valor || 0,
       disponible: !!form.disponible
    }
  } else {
    // 🔸 Categoría alimentos → guarda todo
    metadata = {
      ...baseData,
      valor: form.valor || 0,
      empaquetado: !!form.empaquetado,
      kilo: !!form.kilo,
      disponible: !!form.disponible
    }
  }

  // 5️⃣ Subir JSON de metadatos
  const jsonRef = sRef(storage, `${basePath}.json`)
  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  await uploadBytes(jsonRef, blob)
  const jsonUrl = await getDownloadURL(jsonRef)

  // 6️⃣ Registrar referencia en Firestore
  await addDoc(collection(db, `products_${category}`), {
    path: `${basePath}.json`,
    createdAt: serverTimestamp()
  })

  return { ...metadata, jsonUrl }
}
/**
 * Obtiene todos los productos de una categoría leyendo JSON desde Storage
 */
export async function getProducts(category) {
  const folder = sRef(storage, `products/${category}`)
  const result = await listAll(folder)
  const jsonFiles = result.items.filter(i => i.name.endsWith('.json'))

  const items = []
  for (const file of jsonFiles) {
    const url = await getDownloadURL(file)
    const res = await fetch(url)
    const meta = await res.json()
    items.push({ ...meta, path: file.fullPath, jsonUrl: url })
  }

  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return items
}

/**
 * Elimina producto de Storage y Firestore
 */
export async function deleteProduct(category, pathOrJsonUrl) {
  const jsonRef = sRef(storage, pathOrJsonUrl)
  await deleteObject(jsonRef).catch(() => {})

  const imgPath = pathOrJsonUrl.replace(/\.json$/, '.webp')
  const imgRef = sRef(storage, imgPath)
  await deleteObject(imgRef).catch(() => {})

  const q = query(collection(db, `products_${category}`), where('path', '==', pathOrJsonUrl))
  const snap = await getDocs(q)
  for (const d of snap.docs) {
    await deleteDoc(doc(db, `productos_${category}`, d.id))
  }
}
  
/**
 * Actualiza un producto existente (metadatos y opcionalmente imagen)
 * path: ruta al .json en Storage (p.ej. products/cat/1234.json)
 */
export async function updateProduct(path, { titulo, valor, empaquetado, kilo, disponible, file }) {
  try {
    const jsonRef = sRef(storage, path)

    // Leer existente
    let existing = {}
    try {
      const url = await getDownloadURL(jsonRef)
      const res = await fetch(url)
      existing = await res.json()
    } catch (err) {
      console.warn('No se pudo leer JSON existente al actualizar producto:', path, err)
    }

    // Si viene archivo nuevo, reemplazamos la imagen (.webp)
    if (file) {
      const imgPath = path.replace(/\.json$/, '.webp')
      const imgRef = sRef(storage, imgPath)
      // Comprimir si es imagen
      const compressed = await imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 1280, useWebWorker: true })
      await uploadBytes(imgRef, compressed)
      existing.imageUrl = await getDownloadURL(imgRef)
    }

    const newMeta = {
      ...existing,
      titulo: titulo ?? existing.titulo ?? '',
      valor: typeof valor !== 'undefined' ? valor : existing.valor,
      empaquetado: typeof empaquetado !== 'undefined' ? !!empaquetado : existing.empaquetado,
      kilo: typeof kilo !== 'undefined' ? !!kilo : existing.kilo,
      disponible: typeof disponible !== 'undefined' ? !!disponible : existing.disponible,
      updatedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(newMeta)], { type: 'application/json' })
    await uploadBytes(jsonRef, blob)

    // Actualizar flag en Firestore si aplica (buscar doc con path).
    // Extraemos la categoría desde la ruta del path: products/<category>/<file>.json
    const parts = String(path || '').split('/')
    const categoryFromPath = parts[1] || 'general'
    const q = query(collection(db, `products_${categoryFromPath}`), where('path', '==', path))
    const snap = await getDocs(q)
    for (const d of snap.docs) {
      await updateDoc(doc(db, `products_${categoryFromPath}`, d.id), { available: newMeta.disponible })
    }

    return newMeta
  } catch (err) {
    console.error('Error actualizando producto', err)
    throw err
  }
}
