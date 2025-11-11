'use client'
import { useCollection } from '@/hooks/useCollection'
import type { Project, Customer } from '@/types'
import Link from 'next/link'
import { tl } from '@/lib/money'

export default function Projeler(){
  const projects = useCollection<Project>('projects')
  const customers = useCollection<Customer>('customers')

  const custName = (id?:string)=> customers.find(c=>c.id===id)?.unvan || id || '-'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Projeler</h1></div>
        <Link href="/projeler/yeni" className="btn btn-primary">Yeni Proje</Link>
      </div>
      <table className="table">
        <thead><tr><th>Proje</th><th>Müşteri</th><th>Durum</th><th>Anlaşma (Net/Brüt)</th><th>İl/İlçe</th></tr></thead>
        <tbody>
          {projects.map(p=>(
            <tr key={p.id}>
              <td><Link className="text-blue-600 underline" href={`/projeler/${p.id}`}>{p.ad}</Link></td>
              <td>{custName(p.musteri_id)}</td>
              <td>{p.durum}</td>
              <td>{tl(p.anlasma_net)} / {tl(p.anlasma_brut)}</td>
              <td>{p.il || '-'} / {p.ilce || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
