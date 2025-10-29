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
  orderBy,
  serverTimestamp
} from 'firebase/firestore'
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

  // Solo archivos .json
  const jsonFiles = result.items.filter(i => i.name.endsWith('.json'))

  const slides = []
  for (const file of jsonFiles) {
    const url = await getDownloadURL(file)
    const res = await fetch(url)
    const meta = await res.json()
    if (meta.published) slides.push(meta)
  }

  // Ordenar por fecha descendente
  slides.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return slides
}
