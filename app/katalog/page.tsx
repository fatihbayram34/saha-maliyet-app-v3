'use client'
import { useCollection } from '@/hooks/useCollection'
import CatalogQuickAdd from '@/components/CatalogQuickAdd'
import type { CatalogItem } from '@/types'

export default function Katalog(){
  const items = useCollection<CatalogItem>('catalog')

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Katalog</h1>
    <CatalogQuickAdd />
      <table className="table">
        <thead><tr><th>Kod</th><th>Ad</th><th>Birim</th></tr></thead>
        <tbody>
          {items.map(i=>(
            <tr key={i.id}>
              <td>{i.kod}</td>
              <td>{i.ad}</td>
              <td>{i.birim}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
