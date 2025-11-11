'use client'
import { db, storage } from '@/lib/firebase'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function addReceipt(data: any){
  return await addDoc(collection(db, 'receipts'), { ...data, createdAt: serverTimestamp() })
}
export async function addLedgerDoc(data: any){
  return await addDoc(collection(db, 'inventoryLedger'), { ...data, createdAt: serverTimestamp() })
}
export async function addExpense(data: any){
  return await addDoc(collection(db, 'expenses'), { ...data, createdAt: serverTimestamp() })
}
export async function addLabor(data: any){
  return await addDoc(collection(db, 'labors'), { ...data, createdAt: serverTimestamp() })
}
export async function addProject(data: any){
  return await addDoc(collection(db, 'projects'), { ...data, createdAt: serverTimestamp() })
}
export async function addCatalogItem(data: any){
  return await addDoc(collection(db, 'catalog'), { ...data, createdAt: serverTimestamp() })
}

export async function uploadFile(file: File, pathPrefix='uploads'){
  const fileRef = ref(storage, `${pathPrefix}/${Date.now()}-${file.name}`)
  const snap = await uploadBytes(fileRef, file)
  const url = await getDownloadURL(snap.ref)
  return url
}


export async function addFile(data: any){
  return await addDoc(collection(db, 'files'), { ...data, createdAt: serverTimestamp() })
}


export async function addCustomer(data: any){
  return await addDoc(collection(db, 'customers'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
}
