'use client'
import { useCollection } from '@/hooks/useCollection'
import type { LedgerDoc, CatalogItem } from '@/types'

import StockDocForm from '@/components/StockDocForm'
import type { Customer, Project} from '@/types'

export default function Stok(){
  const ledger = useCollection<LedgerDoc>('inventoryLedger')
  const customers = useCollection<Customer>('customers')
  const projects = useCollection<Project>('projects')
  const catalog = useCollection<CatalogItem>('catalog')

  // basit konsolide
  const map: Record<string, { toplam:number }> = {}
  for(const d of ledger){
    const sign = (d.tip==='giris' || d.tip==='iade') ? 1 : -1
    for(const s of d.satirlar){
      map[s.katalog_id] = map[s.katalog_id] || { toplam: 0 }
      map[s.katalog_id].toplam += sign * s.miktar
    }
  }
  const rows = Object.entries(map).map(([mid, v])=>{
    const m = catalog.find(c=>c.id===mid)
    return { kod: m?.kod||'-', ad: m?.ad||mid, birim: m?.birim||'-', toplam: v.toplam }
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Stok (Konsolide)</h1></div>
      <div className="card"><div className="card-header">Stok Belgesi</div><div className="card-body"><StockDocForm catalog={catalog as any} customers={customers as any} projects={projects as any} /></div></div>
      <table className="table">
        <thead><tr><th>Kod</th><th>Ad</th><th>Toplam</th><th>Birim</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td>{r.kod}</td>
              <td>{r.ad}</td>
              <td>{r.toplam}</td>
              <td>{r.birim}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
