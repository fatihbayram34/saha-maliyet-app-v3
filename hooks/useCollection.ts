'use client'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'

export function useCollection<T=any>(path:string, q?:{field:string; op:any; value:any}){
  const [data, setData] = useState<T[]>([])
  useEffect(()=>{
    const ref = q ? query(collection(db, path), where(q.field, q.op, q.value)) : collection(db, path)
    const unsub = onSnapshot(ref, snap => {
      setData(snap.docs.map(d=>({ id:d.id, ...(d.data() as any) })))
    })
    return ()=>unsub()
  }, [path, q?.field, q?.op, q?.value])
  return data
}
