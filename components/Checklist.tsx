'use client'
import { collection, addDoc, serverTimestamp, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useEffect, useState } from 'react'

export default function Checklist({ proje_id }:{proje_id:string}){
  const [items, setItems] = useState<any[]>([])
  const [text, setText] = useState('')

  useEffect(()=>{
    const q = query(collection(db,'checklists'), where('proje_id','==',proje_id))
    const unsub = onSnapshot(q, snap=> setItems(snap.docs.map(d=>({id:d.id, ...(d.data() as any)}))))
    return ()=>unsub()
  }, [proje_id])

  const addItem = async (e:any)=>{
    e.preventDefault()
    if(!text) return
    await addDoc(collection(db,'checklists'), { proje_id, baslik: text, durum:'Açık', createdAt: serverTimestamp() })
    setText('')
  }

  const toggle = async (id:string, durum:string)=>{
    // quick client update via fetch api route could be added; for now noop to keep iskelet lightweight
    alert('Durum güncelleme iskeleti: Firestore update ekleyebilirsiniz.')
  }

  return (
    <div className="space-y-3">
      <form onSubmit={addItem} className="flex gap-2">
        <input className="input flex-1" placeholder="Yeni madde" value={text} onChange={(e)=>setText(e.target.value)} />
        <button className="btn btn-primary">Ekle</button>
      </form>
      <ul className="space-y-2">
        {items.map(it=> (
          <li key={it.id} className="flex items-center justify-between p-2 rounded-xl border">
            <span>{it.baslik}</span>
            <button className="btn btn-ghost" onClick={()=>toggle(it.id,it.durum)}>{it.durum}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
