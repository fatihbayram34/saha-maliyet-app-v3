'use client'
import { useParams } from 'next/navigation'
import { useCollection } from '@/hooks/useCollection'
import type { Customer, Project, Receipt } from '@/types'
import { tl } from '@/lib/money'
import { toCSV } from '@/lib/csv'

function download(name:string, text:string, mime='text/csv;charset=utf-8'){
  const blob = new Blob([text], {type:mime})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(()=> URL.revokeObjectURL(url), 1500)
}

export default function MusteriDetay(){
  const { id } = useParams<{id:string}>()
  const customers = useCollection<Customer>('customers')
  const projects = useCollection<Project>('projects')
  const receipts = useCollection<Receipt>('receipts')
  const c = customers.find(x=>x.id===id)
  const myProjects = projects.filter(p=>p.musteri_id===id)
  const myReceipts = receipts.filter(r=>r.musteri_id===id)

  const toplamAnlasma = myProjects.reduce((a,b)=>a+(b.anlasma_brut||0),0)
  const toplamTahsilat = myReceipts.reduce((a,b)=>a+(b.tutar_brut||0),0)
  const bakiye = +(toplamAnlasma - toplamTahsilat).toFixed(2)

  const exportCSV = ()=>{
    const pr = myProjects.map(p=>({ tur:'Proje', ad:p.ad, anlasma_brut:p.anlasma_brut }))
    const rc = myReceipts.map(r=>({ tur:'Tahsilat', tarih:r.tarih, tutar_brut:r.tutar_brut, yontem:r.yontem }))
    download(`ekstre_${c?.unvan||id}.csv`, toCSV([...pr, ...rc]))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{c?.unvan||'Müşteri'}</h1>
        <div className="flex gap-2">
          <button className="btn btn-ghost" onClick={()=>window.print()}>PDF (Yazdır)</button>
          <button className="btn btn-primary" onClick={exportCSV}>CSV</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="card-header">Toplam Anlaşma (Brüt)</div><div className="card-body text-2xl">{tl(toplamAnlasma)}</div></div>
        <div className="card"><div className="card-header">Toplam Tahsilat (Brüt)</div><div className="card-body text-2xl">{tl(toplamTahsilat)}</div></div>
        <div className="card"><div className="card-header">Bakiye (Brüt)</div><div className={"card-body text-2xl "+(bakiye<0?'text-green-600':bakiye>0?'text-red-600':'')}>{tl(bakiye)}</div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="card-header">Projeler</div>
          <div className="card-body">
            <table className="table"><thead><tr><th>Ad</th><th>Durum</th><th>Anlaşma (Brüt)</th></tr></thead>
              <tbody>{myProjects.map(p=>(<tr key={p.id}><td>{p.ad}</td><td>{p.durum}</td><td>{tl(p.anlasma_brut||0)}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-header">Tahsilatlar</div>
          <div className="card-body">
            <table className="table"><thead><tr><th>Tarih</th><th>Tutar</th><th>Yöntem</th></tr></thead>
              <tbody>{myReceipts.map(r=>(<tr key={r.id}><td>{new Date(r.tarih||Date.now()).toLocaleDateString('tr-TR')}</td><td>{tl(r.tutar_brut||0)}</td><td>{r.yontem}</td></tr>))}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
