'use client'
import { useState } from 'react'
import { addCatalogItem } from '@/lib/db'

export default function CatalogQuickAdd(){
  const [form, setForm] = useState({ kod:'', ad:'', birim:'Adet' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string|undefined>()

  const submit = async (e:any)=>{
    e.preventDefault()
    setErr(undefined)
    if(!form.ad) { setErr('Malzeme adı zorunlu'); return }
    try{
      setBusy(true)
      await addCatalogItem({ kod: form.kod || undefined, ad: form.ad, birim: form.birim || 'Adet' })
      setForm({ kod:'', ad:'', birim:'Adet' })
    }catch(e:any){
      setErr(e?.message || 'Kayıt başarısız')
    }finally{
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid md:grid-cols-4 gap-2">
      {err && <div className="md:col-span-4 p-2 rounded-md bg-red-50 text-red-700 text-sm">{err}</div>}
      <input className="input" placeholder="Kod (ops.)" value={form.kod} onChange={(e)=>setForm(f=>({...f, kod:e.target.value}))} />
      <input className="input md:col-span-2" placeholder="Malzeme Adı *" value={form.ad} onChange={(e)=>setForm(f=>({...f, ad:e.target.value}))} required />
      <input className="input" placeholder="Birim (Metre/Adet...)" value={form.birim} onChange={(e)=>setForm(f=>({...f, birim:e.target.value}))} />
      <div className="md:col-span-4 flex justify-end">
        <button className="btn btn-primary" disabled={busy}>{busy? 'Ekleniyor…':'Ürün Ekle'}</button>
      </div>
    </form>
  )
}
