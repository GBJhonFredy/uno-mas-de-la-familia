import { app, db } from '@/services/firebase'
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const storage = getStorage(app)

export async function createSlide({ file, title, text, published = true }) {
  if (!file) throw new Error('Archivo requerido')

  const path = `slides/${Date.now()}-${file.name}`
  const fileRef = sRef(storage, path)
  await uploadBytes(fileRef, file)
  const imageUrl = await getDownloadURL(fileRef)

  const payload = {
    imageUrl,
    title: title?.trim() || '',
    text: text?.trim() || '',
    published: !!published,
    order: Date.now(),
    createdAt: serverTimestamp()
  }

  console.log('payload enviado:', payload)

  const docRef = await addDoc(collection(db, 'slides'), payload)
  return { id: docRef.id, imageUrl }
}
