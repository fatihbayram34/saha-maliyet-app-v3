'use client'
import { useCollection } from '@/hooks/useCollection'
import type { Receipt, Customer } from '@/types'
import { tl } from '@/lib/money'

import ReceiptModal from '@/components/ReceiptModal'
export default function Tahsilatlar(){
  const receipts = useCollection<Receipt>('receipts')
  const customers = useCollection<Customer>('customers')
  const nameOf = (id:string)=> customers.find(c=>c.id===id)?.unvan || id

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between"><h1 className="text-xl font-bold">Tahsilatlar</h1><ReceiptModal customers={customers as any} /></div>
      <table className="table">
        <thead><tr><th>Müşteri</th><th>Tarih</th><th>Tutar (Brüt)</th><th>Yöntem</th><th>Açıklama</th></tr></thead>
        <tbody>
          {receipts.map(r=>(
            <tr key={r.id}>
              <td>{nameOf(r.musteri_id)}</td>
              <td>{ new Date(r.tarih||Date.now()).toLocaleDateString('tr-TR') }</td>
              <td>{tl(r.tutar_brut||0)}</td>
              <td>{r.yontem}</td>
              <td>{r.aciklama||''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
