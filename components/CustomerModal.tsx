'use client'
import { useState } from 'react'
import { addCustomer } from '@/lib/db'

export default function CustomerModal(){
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ unvan:'', vergi_no:'', tel:'', eposta:'', kisi:'', adres:'' })

  const submit = async (e:any)=>{
    e.preventDefault()
    if(!form.unvan) return
    await addCustomer({
      unvan: form.unvan,
      vergi_no: form.vergi_no || undefined,
      iletisim: { tel: form.tel || undefined, eposta: form.eposta || undefined, kisi: form.kisi || undefined },
      adres: form.adres || undefined
    })
    setOpen(false); setForm({ unvan:'', vergi_no:'', tel:'', eposta:'', kisi:'', adres:'' })
  }

  return (
    <div>
      <button className="btn btn-primary" onClick={()=>setOpen(true)}>Müşteri Ekle</button>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl w-full max-w-xl p-4 space-y-3">
            <div className="text-lg font-semibold">Yeni Müşteri</div>
            <form onSubmit={submit} className="grid md:grid-cols-2 gap-2">
              <input className="input md:col-span-2" placeholder="Unvan *" value={form.unvan} onChange={(e)=>setForm(f=>({...f, unvan:e.target.value}))} required />
              <input className="input" placeholder="Vergi No" value={form.vergi_no} onChange={(e)=>setForm(f=>({...f, vergi_no:e.target.value}))} />
              <input className="input" placeholder="Yetkili Kişi" value={form.kisi} onChange={(e)=>setForm(f=>({...f, kisi:e.target.value}))} />
              <input className="input" placeholder="Telefon" value={form.tel} onChange={(e)=>setForm(f=>({...f, tel:e.target.value}))} />
              <input className="input" placeholder="E-posta" type="email" value={form.eposta} onChange={(e)=>setForm(f=>({...f, eposta:e.target.value}))} />
              <textarea className="textarea md:col-span-2" placeholder="Adres" value={form.adres} onChange={(e)=>setForm(f=>({...f, adres:e.target.value}))} />
              <div className="md:col-span-2 flex justify-end gap-2">
                <button type="button" className="btn btn-ghost" onClick={()=>setOpen(false)}>Vazgeç</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
