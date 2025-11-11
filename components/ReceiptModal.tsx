'use client'
import { useState } from 'react'
import { addReceipt } from '@/lib/db'

export default function ReceiptModal({ customers }:{customers:{id:string;unvan:string}[]}){
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ musteri_id:'', tarih:'', tutar_brut:'', yontem:'Havale/EFT', aciklama:'' })
  const onSubmit = async (e: any)=>{
    e.preventDefault()
    const tutar = parseFloat(form.tutar_brut || '0')
    if(!form.musteri_id || !tutar) return
    await addReceipt({
      musteri_id: form.musteri_id,
      tarih: form.tarih || new Date().toISOString(),
      tutar_brut: tutar,
      yontem: form.yontem,
      aciklama: form.aciklama
    })
    setOpen(false); setForm({ musteri_id:'', tarih:'', tutar_brut:'', yontem:'Havale/EFT', aciklama:'' })
  }
  return (
    <div>
      <button className="btn btn-primary" onClick={()=>setOpen(true)}>Tahsilat Ekle</button>
      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg p-4 space-y-3">
            <div className="text-lg font-semibold">Tahsilat Ekle (Brüt)</div>
            <form onSubmit={onSubmit} className="space-y-3">
              <select className="select" value={form.musteri_id} onChange={(e)=>setForm(f=>({...f, musteri_id:e.target.value}))} required>
                <option value="">Müşteri seç</option>
                {customers.map(c=> <option key={c.id} value={c.id}>{c.unvan}</option>)}
              </select>
              <input className="input" type="date" value={form.tarih} onChange={(e)=>setForm(f=>({...f, tarih:e.target.value}))} />
              <input className="input" type="number" step="0.01" placeholder="Tutar (KDV dahil)" value={form.tutar_brut} onChange={(e)=>setForm(f=>({...f, tutar_brut:e.target.value}))} required />
              <select className="select" value={form.yontem} onChange={(e)=>setForm(f=>({...f, yontem:e.target.value}))}>
                {['Havale/EFT','Nakit','POS','Çek/Senet','Diğer'].map(x=><option key={x} value={x}>{x}</option>)}
              </select>
              <input className="input" placeholder="Açıklama" value={form.aciklama} onChange={(e)=>setForm(f=>({...f, aciklama:e.target.value}))} />
              <div className="flex gap-2 justify-end">
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
