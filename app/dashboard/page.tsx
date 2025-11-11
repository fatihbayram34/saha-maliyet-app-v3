'use client'
import { useCollection } from '@/hooks/useCollection'
import type { Receipt, Project, Expense, Labor, LedgerDoc } from '@/types'
import { tl } from '@/lib/money'
import { calcAnlasma } from '@/lib/kdv'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

export default function Dashboard(){
  const receipts = useCollection<Receipt>('receipts')
  const projects = useCollection<Project>('projects')
  const expenses = useCollection<Expense>('expenses')
  const labors = useCollection<Labor>('labors')
  const ledger = useCollection<LedgerDoc>('inventoryLedger')

  const toplamTahsilat = receipts.reduce((a,b)=>a+(b.tutar_brut||0),0)
  const toplamAnlasmaBrut = projects.reduce((a,b)=>a+(b.anlasma_brut||0),0)

  // Basit durum dağılımı
  const durumCounts = ['Teklif','Devam','Beklemede','Tamamlandı','İptal'].map(d=>({name:d, value: projects.filter(p=>p.durum===d).length}))

  const colors = ['#2563eb','#16a34a','#f59e0b','#ef4444','#64748b']

  function projCostNet(pid:string){
    const e = expenses.filter(x=>x.proje_id===pid).reduce((a,b)=>a+(b.tutar_net||0),0)
    const l = labors.filter(x=>x.proje_id===pid).reduce((a,b)=>a+(b.tutar_net||0),0)
    const s = ledger.filter(x=>x.proje_id===pid && x.tip==='cikis').reduce((a,b)=> a + (b.satirlar||[]).reduce((aa,bb)=> aa + (bb.toplam_net||0), 0), 0)
    return +(e+l+s).toFixed(2)
  }
  const withProfit = projects.map(p=>({ id:p.id, ad:p.ad, net:p.anlasma_net, cost: projCostNet(p.id), profit: +(p.anlasma_net - projCostNet(p.id)).toFixed(2) }))
  const enKarlilar = [...withProfit].sort((a,b)=> b.profit - a.profit).slice(0,5)
  const enPahalilar = [...withProfit].sort((a,b)=> b.cost - a.cost).slice(0,5)


  const grup = new Map<string, {tahsilat:number, masraf:number}>();
  for(const r of receipts){ const d = new Date(r.tarih||Date.now()); const k = d.getFullYear()+"-"+(d.getMonth()+1).toString().padStart(2,'0'); const x = grup.get(k)||{tahsilat:0,masraf:0}; x.tahsilat += r.tutar_brut||0; grup.set(k,x); }
  const keys = Array.from(grup.keys()).sort();
  const seri = keys.map(k=> ({ ay:k, tahsilat: +(grup.get(k)!.tahsilat.toFixed(2)), masraf: 0 }))

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Özet</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card"><div className="card-header">Toplam Tahsilat (Brüt)</div><div className="card-body text-2xl">{tl(toplamTahsilat)}</div></div>
        <div className="card"><div className="card-header">Toplam Anlaşma (Brüt)</div><div className="card-body text-2xl">{tl(toplamAnlasmaBrut)}</div></div>
        <div className="card"><div className="card-header">En Kârlı 5 (Net)"></div><div className="card-body text-sm"><ul className="list-disc pl-4">{enKarlilar.map(x=> (<li key={x.id}>{x.ad}: {tl(x.profit)}</li>))}</ul></div></div>
        <div className="card"><div className="card-header">En Pahalı 5 (Net Maliyet)"></div><div className="card-body text-sm"><ul className="list-disc pl-4">{enPahalilar.map(x=> (<li key={x.id}>{x.ad}: {tl(x.cost)}</li>))}</ul></div></div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <div className="card-header">Aylık Tahsilat (Brüt) vs Masraf (Net)</div>
          <div className="card-body h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={seri}>
                <XAxis dataKey="ay" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="tahsilat" fillOpacity={0.3} />
                <Area type="monotone" dataKey="masraf" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header">Proje Durum Dağılımı</div>
          <div className="card-body h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={durumCounts} dataKey="value" nameKey="name" outerRadius={100}>
                  {durumCounts.map((_,i)=>(<Cell key={i} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
