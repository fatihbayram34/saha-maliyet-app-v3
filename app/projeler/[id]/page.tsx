'use client'
import { useParams } from 'next/navigation'
import { useCollection } from '@/hooks/useCollection'
import type { Project, Customer, LedgerDoc, Expense, Labor, CatalogItem } from '@/types'
import { tl } from '@/lib/money'
import Tabs from '@/components/Tabs'
import ExpenseForm from '@/components/ExpenseForm'
import LaborForm from '@/components/LaborForm'
import Checklist from '@/components/Checklist'

export default function ProjeDetay(){
  const { id } = useParams<{id:string}>()
  const projects = useCollection<Project>('projects')
  const customers = useCollection<Customer>('customers')
  const ledger = useCollection<LedgerDoc>('inventoryLedger')
  const expenses = useCollection<Expense>('expenses')
  const labors = useCollection<Labor>('labors')
  const catalog = useCollection<CatalogItem>('catalog')

  const p = projects.find(x=>x.id===id)
  const musteri = customers.find(c=>c.id===p?.musteri_id)
  if(!p) return <div>Yükleniyor…</div>

  const myExp = expenses.filter(e=>e.proje_id===id)
  const myLab = labors.filter(l=>l.proje_id===id)
  const myLed = ledger.filter(l=>l.proje_id===id)

  const stockOutNet = myLed.filter(d=>d.tip==='cikis').reduce((a,b)=> a + (b.satirlar||[]).reduce((aa,bb)=> aa + (bb.toplam_net||0), 0), 0)
  const expenseTotal = myExp.reduce((a,b)=>a+(b.tutar_net||0),0)
  const laborTotal = myLab.reduce((a,b)=>a+(b.tutar_net||0),0)
  const totalCostNet = +(expenseTotal + laborTotal + stockOutNet).toFixed(2)
  const profitNet = +(p.anlasma_net - totalCostNet).toFixed(2)

  // material breakdown
  const byTip = (t:string)=> myLed.filter(d=>d.tip===t)
  const remainingMap: Record<string, { owners: Record<string, number>, birim:string }> = {}
  for(const d of myLed){
    const sign = (d.tip==='giris'||d.tip==='iade')? 1 : -1
    for(const s of d.satirlar){
      const key = s.katalog_id+'|'+(s.birim||'')
      remainingMap[key] = remainingMap[key] || { owners:{}, birim: s.birim||'' }
      const owner = d.owner_musteri_id || 'genel'
      remainingMap[key].owners[owner] = (remainingMap[key].owners[owner]||0) + sign * (s.miktar||0)
    }
  }

  const matRow = (kid:string)=>{
    const item = catalog.find(c=>c.id===kid)
    return item ? `${item.kod? item.kod+' - ' : ''}${item.ad}` : kid
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">{p.ad}</h1>
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card"><div className="card-header">Müşteri</div><div className="card-body">{musteri?.unvan||p.musteri_id}</div></div>
        <div className="card"><div className="card-header">Anlaşma</div><div className="card-body">{tl(p.anlasma_net)} / {tl(p.anlasma_brut)}</div></div>
        <div className="card"><div className="card-header">Toplam Maliyet (Net)</div><div className="card-body">{tl(totalCostNet)}</div></div>
        <div className={"card " + (profitNet<0? 'border-red-300':'border-green-300')}><div className="card-header">Brüt Kâr (Net)</div><div className="card-body">{tl(profitNet)}</div></div>
      </div>

      <Tabs tabs={['Özet','Checklist','Masraflar','İşçilik','Malzeme','Belgeler']}>
        {/* Özet */}
        <div className="space-y-3">
          <div className="text-sm text-gray-600">İl/İlçe: {p.il||'-'} / {p.ilce||'-'}</div>
          <div className="text-sm text-gray-600">Durum: {p.durum}</div>
        </div>

        {/* Checklist */}
        <div><Checklist proje_id={p.id} /></div>

        {/* Masraflar */}
        <div className="space-y-3">
          <ExpenseForm proje_id={p.id} />
          <table className="table"><thead><tr><th>Tarih</th><th>Kategori</th><th>Tutar (Net)</th></tr></thead>
            <tbody>{myExp.map(e=>(<tr key={e.id}><td>{new Date(e.tarih||Date.now()).toLocaleDateString('tr-TR')}</td><td>{e.kategori}</td><td>{tl(e.tutar_net||0)}</td></tr>))}</tbody>
          </table>
        </div>

        {/* İşçilik */}
        <div className="space-y-3">
          <LaborForm proje_id={p.id} />
          <table className="table"><thead><tr><th>Tarih</th><th>Personel</th><th>Saat</th><th>Gün</th><th>Tutar (Net)</th></tr></thead>
            <tbody>{myLab.map(l=>(<tr key={l.id}><td>{new Date(l.tarih||Date.now()).toLocaleDateString('tr-TR')}</td><td>{l.personel}</td><td>{l.saat||'-'}</td><td>{l.gun||'-'}</td><td>{tl(l.tutar_net||0)}</td></tr>))}</tbody>
          </table>
        </div>

        {/* Malzeme */}
        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card"><div className="card-header">Gelen (giriş)</div><div className="card-body">
              <table className="table"><thead><tr><th>Malzeme</th><th>Miktar</th><th>Birim</th><th>Sahip</th></tr></thead>
                <tbody>{byTip('giris').flatMap(d=> d.satirlar.map((s,idx)=>(<tr key={d.id+idx}><td>{matRow(s.katalog_id)}</td><td>{s.miktar}</td><td>{s.birim}</td><td>{d.owner_musteri_id}</td></tr>)))}</tbody>
              </table>
            </div></div>
            <div className="card"><div className="card-header">Kullanım (çıkış)</div><div className="card-body">
              <table className="table"><thead><tr><th>Malzeme</th><th>Miktar</th><th>Birim</th><th>Sahip</th></tr></thead>
                <tbody>{byTip('cikis').flatMap(d=> d.satirlar.map((s,idx)=>(<tr key={d.id+idx}><td>{matRow(s.katalog_id)}</td><td>{s.miktar}</td><td>{s.birim}</td><td>{d.owner_musteri_id}</td></tr>)))}</tbody>
              </table>
            </div></div>
            <div className="card"><div className="card-header">İade</div><div className="card-body">
              <table className="table"><thead><tr><th>Malzeme</th><th>Miktar</th><th>Birim</th><th>Sahip</th></tr></thead>
                <tbody>{byTip('iade').flatMap(d=> d.satirlar.map((s,idx)=>(<tr key={d.id+idx}><td>{matRow(s.katalog_id)}</td><td>{s.miktar}</td><td>{s.birim}</td><td>{d.owner_musteri_id}</td></tr>)))}</tbody>
              </table>
            </div></div>
          </div>

          <div className="card">
            <div className="card-header">Kalan Özet (owner kırılımı)</div>
            <div className="card-body">
              <table className="table"><thead><tr><th>Malzeme</th><th>Sahip</th><th>Kalan</th><th>Birim</th></tr></thead>
                <tbody>
                  {Object.entries(remainingMap).flatMap(([key, val])=>{
                    const [kid, birim] = key.split('|')
                    const name = matRow(kid)
                    return Object.entries(val.owners).map(([owner, qty], idx)=> (
                      <tr key={key+owner+idx}><td>{name}</td><td>{owner}</td><td>{qty}</td><td>{birim||val.birim||''}</td></tr>
                    ))
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Belgeler */}
        <div className="text-sm text-gray-600">Belge yükleme butonu ve liste iskeleti eklenebilir (UploadButton bileşeni hazır).</div>
      </Tabs>
    </div>
  )
}
