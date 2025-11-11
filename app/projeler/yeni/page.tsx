'use client'
import { useState } from 'react'
import { addProject } from '@/lib/db'
import { calcAnlasma } from '@/lib/kdv'
import { useCollection } from '@/hooks/useCollection'
import type { Customer } from '@/types'
import CityDistrictPicker from '@/components/CityDistrictPicker'

export default function ProjeYeni(){
  const customers = useCollection<Customer>('customers')
  const [musteri, setMusteri] = useState('')
  const [ad, setAd] = useState('')
  const [il, setIl] = useState('İstanbul')
  const [ilce, setIlce] = useState('')
  const [durum, setDurum] = useState('Teklif')
  const [net, setNet] = useState('0')
  const [kdv, setKdv] = useState('0.20')

  const submit = async (e:any)=>{
    e.preventDefault()
    const anlasma_net = parseFloat(net||'0')
    const kdv_oran = parseFloat(kdv||'0.20')
    const { kdv:anlasma_kdv, brut:anlasma_brut } = calcAnlasma(anlasma_net, kdv_oran)
    await addProject({ musteri_id: musteri, ad, il, ilce, durum, anlasma_net, kdv_oran, anlasma_kdv, anlasma_brut, baslangic: new Date().toISOString() })
    location.href='/projeler'
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Yeni Proje</h1>
      <form onSubmit={submit} className="space-y-3">
        <select className="select w-full" value={musteri} onChange={(e)=>setMusteri(e.target.value)} required>
          <option value="">Müşteri seç</option>
          {customers.map(c=> <option key={c.id} value={c.id}>{c.unvan}</option>)}
        </select>
        <input className="input w-full" placeholder="Proje adı" value={ad} onChange={(e)=>setAd(e.target.value)} required />
        <CityDistrictPicker il={il} ilce={ilce} setIl={setIl} setIlce={setIlce} />
        <div className="grid md:grid-cols-3 gap-2">
          <select className="select" value={durum} onChange={(e)=>setDurum(e.target.value)}>
            {['Teklif','Devam','Beklemede','Tamamlandı','İptal'].map(x=> <option key={x} value={x}>{x}</option>)}
          </select>
          <input className="input" type="number" step="0.01" placeholder="Anlaşma (Net)" value={net} onChange={(e)=>setNet(e.target.value)} required />
          <input className="input" type="number" step="0.01" placeholder="KDV Oranı" value={kdv} onChange={(e)=>setKdv(e.target.value)} />
        </div>
        <div className="flex justify-end"><button className="btn btn-primary">Oluştur</button></div>
      </form>
    </div>
  )
}
