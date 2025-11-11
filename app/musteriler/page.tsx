'use client'
import CustomerModal from '@/components/CustomerModal'
import Link from 'next/link'
import { useCollection } from '@/hooks/useCollection'
import type { Customer, Project, Receipt } from '@/types'
import { tl } from '@/lib/money'
import { customerBalanceBrut, sumProjectsBrut, sumReceiptsBrut } from '@/lib/agg'

export default function Musteriler(){
  const customers = useCollection<Customer>('customers')
  const projects = useCollection<Project>('projects')
  const receipts = useCollection<Receipt>('receipts')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Müşteriler</h1><CustomerModal /></div>
      <table className="table">
        <thead><tr><th>Ünvan</th><th>Toplam Anlaşma (Brüt)</th><th>Toplam Tahsilat (Brüt)</th><th>Bakiye (Brüt)</th></tr></thead>
        <tbody>
          {customers.map(c=>{
            const anlasma = sumProjectsBrut(projects, c.id)
            const tahsilat = sumReceiptsBrut(receipts, c.id)
            const bakiye = customerBalanceBrut(projects, receipts, c.id)
            const cls = bakiye < 0 ? 'text-green-600' : bakiye > 0 ? 'text-red-600' : 'text-gray-700'
            return (
              <tr key={c.id}>
                <td><Link className="text-blue-600 underline" href={`/musteriler/${c.id}`}>{c.unvan}</Link></td>
                <td>{tl(anlasma)}</td>
                <td>{tl(tahsilat)}</td>
                <td className={cls}>{tl(bakiye)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
