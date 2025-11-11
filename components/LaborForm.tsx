'use client'
import { useState } from 'react'
import { addLabor } from '@/lib/db'

export default function LaborForm({ proje_id }:{proje_id:string}){
  const [form, setForm] = useState({ tarih:'', personel:'', saat:'', gun:'', tutar_net:'', aciklama:'' })
  const onSubmit = async (e:any)=>{
    e.preventDefault()
    const tutar_net = parseFloat(form.tutar_net||'0')
    await addLabor({ proje_id, tarih: form.tarih||new Date().toISOString(), personel: form.personel, saat: form.saat? +form.saat: undefined, gun: form.gun? +form.gun: undefined, tutar_net, aciklama: form.aciklama })
    setForm({ tarih:'', personel:'', saat:'', gun:'', tutar_net:'', aciklama:'' })
  }
  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-6 gap-2">
      <input className="input" placeholder="Personel" value={form.personel} onChange={(e)=>setForm(f=>({...f, personel:e.target.value}))} required />
      <input className="input" type="date" value={form.tarih} onChange={(e)=>setForm(f=>({...f, tarih:e.target.value}))} />
      <input className="input" type="number" step="0.1" placeholder="Saat" value={form.saat} onChange={(e)=>setForm(f=>({...f, saat:e.target.value}))} />
      <input className="input" type="number" step="0.5" placeholder="Gün" value={form.gun} onChange={(e)=>setForm(f=>({...f, gun:e.target.value}))} />
      <input className="input" type="number" step="0.01" placeholder="Tutar (Net)" value={form.tutar_net} onChange={(e)=>setForm(f=>({...f, tutar_net:e.target.value}))} required />
      <input className="input md:col-span-6" placeholder="Açıklama" value={form.aciklama} onChange={(e)=>setForm(f=>({...f, aciklama:e.target.value}))} />
      <div className="md:col-span-6 flex justify-end"><button className="btn btn-primary" type="submit">Ekle</button></div>
    </form>
  )
}
