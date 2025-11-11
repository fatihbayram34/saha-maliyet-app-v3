'use client'
import { useState } from 'react'
import { addLedgerDoc } from '@/lib/db'

type Tip = 'giris'|'cikis'|'iade'|'transfer'
type Konum = 'depo'|'santiye'

export default function StockDocForm({ catalog, customers, projects }:{
  catalog:{id:string; kod?:string; ad:string; birim:string}[],
  customers:{id:string; unvan:string}[],
  projects?:{id:string; ad:string; musteri_id:string}[]
}){
  const [tip, setTip] = useState<Tip>('giris')
  const [konum, setKonum] = useState<Konum>('santiye')
  const [owner, setOwner] = useState('')
  const [projeId, setProjeId] = useState('')
  const [satirlar, setSatirlar] = useState<{katalog_id:string; miktar:string; birim:string}[]>([
    { katalog_id:'', miktar:'', birim:'' }
  ])

  const addRow = ()=> setSatirlar(s=>[...s, { katalog_id:'', miktar:'', birim:'' }])
  const delRow = (i:number)=> setSatirlar(s=> s.filter((_,idx)=>idx!==i))

  const onSubmit = async (e:any)=>{
    e.preventDefault()
    const rows = satirlar
      .filter(r=>r.katalog_id && parseFloat(r.miktar as any))
      .map(r=>({ katalog_id: r.katalog_id, miktar: +parseFloat(r.miktar as any).toFixed(3), birim: r.birim || (catalog.find(c=>c.id===r.katalog_id)?.birim||'Adet') }))
    if(!owner || rows.length===0) return
    await addLedgerDoc({
      tarih: new Date().toISOString(),
      tip, konum,
      owner_musteri_id: owner,
      proje_id: projeId || null,
      satirlar: rows,
      aciklama: ''
    })
    setSatirlar([{ katalog_id:'', miktar:'', birim:'' }])
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="grid md:grid-cols-4 gap-3">
        <select className="select" value={tip} onChange={(e)=>setTip(e.target.value as Tip)}>
          {['giris','cikis','iade','transfer'].map(x=><option key={x} value={x}>{x}</option>)}
        </select>
        <select className="select" value={konum} onChange={(e)=>setKonum(e.target.value as Konum)}>
          {['depo','santiye'].map(x=><option key={x} value={x}>{x}</option>)}
        </select>
        <select className="select" value={owner} onChange={(e)=>setOwner(e.target.value)} required>
          <option value="">Sahip (Müşteri)</option>
          {customers.map(c=><option key={c.id} value={c.id}>{c.unvan}</option>)}
        </select>
        <select className="select" value={projeId} onChange={(e)=>setProjeId(e.target.value)}>
          <option value="">Proje (ops.)</option>
          {(projects||[]).map(p=><option key={p.id} value={p.id}>{p.ad}</option>)}
        </select>
      </div>

      <div className="space-y-2">
        {satirlar.map((r,idx)=>(
          <div key={idx} className="grid md:grid-cols-4 gap-2">
            <select className="select" value={r.katalog_id} onChange={(e)=>{
              const v = e.target.value; 
              setSatirlar(s=> s.map((x,i)=> i===idx? {...x, katalog_id: v, birim: s[i].birim || (catalog.find(c=>c.id===v)?.birim||'')} : x))
            }} required>
              <option value="">Malzeme</option>
              {catalog.map(c=> <option key={c.id} value={c.id}>{(c.kod? c.kod+' - ' : '') + c.ad}</option>)}
            </select>
            <input className="input" placeholder="Miktar" type="number" step="0.001" value={r.miktar} onChange={(e)=>setSatirlar(s=> s.map((x,i)=> i===idx? {...x, miktar: e.target.value } : x))} required />
            <input className="input" placeholder="Birim" value={r.birim} onChange={(e)=>setSatirlar(s=> s.map((x,i)=> i===idx? {...x, birim: e.target.value } : x))} />
            <div className="flex gap-2">
              <button type="button" className="btn btn-ghost" onClick={()=>delRow(idx)}>Sil</button>
              {idx===satirlar.length-1 && <button type="button" className="btn btn-ghost" onClick={addRow}>Satır Ekle</button>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary" type="submit">Belgeyi Kaydet</button>
      </div>
    </form>
  )
}
