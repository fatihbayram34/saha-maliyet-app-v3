'use client'
import { useState } from 'react'
import { addExpense } from '@/lib/db'

export default function ExpenseForm({ proje_id }:{proje_id:string}){
  const [form, setForm] = useState({ tarih:'', kategori:'', tutar_net:'', kdv_oran:'0.20', kdv_maliyete_dahil:false, aciklama:'' })
  const onSubmit = async (e:any)=>{
    e.preventDefault()
    const tutar_net = parseFloat(form.tutar_net||'0')
    const kdv_oran = parseFloat(form.kdv_oran||'0')
    const tutar_kdv = +(tutar_net * kdv_oran).toFixed(2)
    const tutar_brut = +(tutar_net + tutar_kdv).toFixed(2)
    await addExpense({ proje_id, tarih: form.tarih||new Date().toISOString(), kategori: form.kategori, tutar_net, kdv_oran, tutar_kdv, tutar_brut, kdv_maliyete_dahil: !!form.kdv_maliyete_dahil, aciklama: form.aciklama })
    setForm({ tarih:'', kategori:'', tutar_net:'', kdv_oran:'0.20', kdv_maliyete_dahil:false, aciklama:'' })
  }
  return (
    <form onSubmit={onSubmit} className="grid md:grid-cols-6 gap-2">
      <input className="input md:col-span-2" placeholder="Kategori" value={form.kategori} onChange={(e)=>setForm(f=>({...f, kategori:e.target.value}))} required />
      <input className="input" type="date" value={form.tarih} onChange={(e)=>setForm(f=>({...f, tarih:e.target.value}))} />
      <input className="input" type="number" step="0.01" placeholder="Tutar (Net)" value={form.tutar_net} onChange={(e)=>setForm(f=>({...f, tutar_net:e.target.value}))} required />
      <input className="input" type="number" step="0.01" placeholder="KDV Oranı" value={form.kdv_oran} onChange={(e)=>setForm(f=>({...f, kdv_oran:e.target.value}))} />
      <label className="flex items-center gap-2"><input type="checkbox" checked={!!form.kdv_maliyete_dahil} onChange={(e)=>setForm(f=>({...f, kdv_maliyete_dahil:e.target.checked}))} /> KDV maliyete dahil</label>
      <input className="input md:col-span-6" placeholder="Açıklama" value={form.aciklama} onChange={(e)=>setForm(f=>({...f, aciklama:e.target.value}))} />
      <div className="md:col-span-6 flex justify-end"><button className="btn btn-primary" type="submit">Ekle</button></div>
    </form>
  )
}
