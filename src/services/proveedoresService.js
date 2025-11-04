import { app, db } from '@/services/firebase'
import {
  getStorage,
  ref as sRef,
  uploadBytes,
  getDownloadURL,
  listAll
} from 'firebase/storage'
import { deleteObject } from 'firebase/storage'
import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore'
import { query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import imageCompression from 'browser-image-compression'

const storage = getStorage(app)

/**
 * Crea un patrocinador (logo comprimido + JSON en Storage + referencia en Firestore)
 */
export async function createPatrocinador({ file, nombre, published = true }) {
  if (!file) throw new Error('Logo requerido')

  // 1️⃣ Comprimir logo
  const compressed = await imageCompression(file, {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 800,
    useWebWorker: true
  })

  const baseName = `proveedores/${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`

  // 2️⃣ Subir logo
  const imgRef = sRef(storage, `${baseName}.webp`)
  await uploadBytes(imgRef, compressed)
  const imageUrl = await getDownloadURL(imgRef)

  // 3️⃣ Crear JSON con metadatos
  const metadata = {
    nombre: nombre?.trim() || '',
    imageUrl,
    published: !!published,
    createdAt: new Date().toISOString()
  }

  const jsonRef = sRef(storage, `${baseName}.json`)
  const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
  await uploadBytes(jsonRef, blob)
  const jsonUrl = await getDownloadURL(jsonRef)

  // 4️⃣ Registrar referencia ligera en Firestore
  await addDoc(collection(db, 'proveedores'), {
    path: `${baseName}.json`,
    published,
    createdAt: serverTimestamp()
  })

  return { imageUrl, jsonUrl }
}

/**
 * Lista todos los proveedores publicados
 */
export async function getproveedores() {
  const folder = sRef(storage, 'proveedores')
  const result = await listAll(folder)
  const jsonFiles = result.items.filter(i => i.name.endsWith('.json'))

  const list = []
  for (const file of jsonFiles) {
    const url = await getDownloadURL(file)
    const res = await fetch(url)
    const meta = await res.json()
    if (meta.published !== false) {
      list.push({
        ...meta,
        path: file.fullPath,
        jsonUrl: url
      })
    }
  }

  list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return list
}

/**
 * Actualiza un proveedor existente (metadatos y opcionalmente logo)
 */
export async function updateProveedor(path, { nombre, published = true, file }) {
  try {
    const jsonRef = sRef(storage, path)
    let existing = {}
    try {
      const url = await getDownloadURL(jsonRef)
      const res = await fetch(url)
      existing = await res.json()
    } catch (err) {
      console.warn('No se pudo leer JSON existente al actualizar proveedor:', path, err)
    }

    // Si viene nuevo logo
    if (file) {
      const imgPath = path.replace(/\.json$/, '.webp')
      const imgRef = sRef(storage, imgPath)
      const compressed = await imageCompression(file, { maxSizeMB: 0.3, maxWidthOrHeight: 800, useWebWorker: true })
      await uploadBytes(imgRef, compressed)
      existing.imageUrl = await getDownloadURL(imgRef)
    }

    const newMeta = {
      ...existing,
      nombre: nombre ?? existing.nombre ?? '',
      published: typeof published === 'boolean' ? published : existing.published,
      updatedAt: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(newMeta)], { type: 'application/json' })
    await uploadBytes(jsonRef, blob)

    // Actualizar firestore doc
    const q = query(collection(db, 'proveedores'), where('path', '==', path))
    const snap = await getDocs(q)
    for (const d of snap.docs) {
      await updateDoc(doc(db, 'proveedores', d.id), { published: newMeta.published })
    }

    return newMeta
  } catch (err) {
    console.error('Error actualizando proveedor', err)
    throw err
  }
}

/**
 * Elimina proveedor (json + webp + firestore)
 */
export async function deleteProveedor(path) {
  try {
    const jsonRef = sRef(storage, path)
    await deleteObject(jsonRef).catch(() => {})
    const imgPath = path.replace(/\.json$/, '.webp')
    const imgRef = sRef(storage, imgPath)
    await deleteObject(imgRef).catch(() => {})

    const q = query(collection(db, 'proveedores'), where('path', '==', path))
    const snap = await getDocs(q)
    for (const d of snap.docs) {
      await deleteDoc(doc(db, 'proveedores', d.id))
    }
  } catch (err) {
    console.error('Error eliminando proveedor', err)
    throw err
  }
}
