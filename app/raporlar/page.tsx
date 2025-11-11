'use client'
import { useCollection } from '@/hooks/useCollection'
import type { Customer, Project, Receipt, LedgerDoc } from '@/types'
import { toCSV } from '@/lib/csv'

function download(name:string, text:string, mime='text/csv;charset=utf-8'){
  const blob = new Blob([text], {type:mime})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = name; a.click()
  setTimeout(()=> URL.revokeObjectURL(url), 1500)
}

export default function Raporlar(){
  const customers = useCollection<Customer>('customers')
  const projects = useCollection<Project>('projects')
  const receipts = useCollection<Receipt>('receipts')
  const ledger = useCollection<LedgerDoc>('inventoryLedger')

  const exportCari = ()=>{
    const rows = customers.map(c=> ({
      musteri: c.unvan, musteri_id: c.id,
      toplam_anlasma_brut: projects.filter(p=>p.musteri_id===c.id).reduce((a,b)=>a+(b.anlasma_brut||0),0).toFixed(2),
      toplam_tahsilat_brut: receipts.filter(r=>r.musteri_id===c.id).reduce((a,b)=>a+(b.tutar_brut||0),0).toFixed(2),
    }))
    download('cari_ozet.csv', toCSV(rows))
  }

  const exportStok = ()=>{
    const rows = ledger.flatMap(d=> d.satirlar.map(s=> ({
      tarih: d.tarih, tip: d.tip, konum: d.konum, owner_musteri_id: d.owner_musteri_id, proje_id: d.proje_id||'',
      katalog_id: s.katalog_id, miktar: s.miktar, birim: s.birim
    })))
    download('stok_hareketleri.csv', toCSV(rows))
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Raporlar</h1>
      <div className="card">
        <div className="card-header">Dışa Aktarım (CSV)</div>
        <div className="card-body flex gap-2 flex-wrap">
          <button className="btn btn-primary" onClick={exportCari}>Cari Özet CSV</button>
          <button className="btn btn-primary" onClick={exportStok}>Stok Hareketleri CSV</button>
        </div>
      </div>
    </div>
  )
}
