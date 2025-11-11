import type { Receipt, Project, LedgerDoc, Expense, Labor } from '@/types'

export function sumReceiptsBrut(receipts: Receipt[], customerId?: string){
  const arr = customerId ? receipts.filter(r=>r.musteri_id===customerId) : receipts
  return +arr.reduce((a,b)=>a+(b.tutar_brut||0),0).toFixed(2)
}

export function sumProjectsBrut(projects: Project[], customerId?: string){
  const arr = customerId ? projects.filter(p=>p.musteri_id===customerId) : projects
  return +arr.reduce((a,b)=>a+(b.anlasma_brut||0),0).toFixed(2)
}

export function customerBalanceBrut(projects: Project[], receipts: Receipt[], customerId: string){
  return +(sumProjectsBrut(projects, customerId) - sumReceiptsBrut(receipts, customerId)).toFixed(2)
}

export function stockBalances(ledger: LedgerDoc[]){
  // returns map: materialId -> { toplam, owners: { [owner]: number } }
  const res: Record<string, { toplam:number; owners:Record<string,number>}> = {}
  for(const d of ledger){
    const sign = (d.tip==='giris' || d.tip==='iade') ? 1 : -1
    for(const s of d.satirlar){
      if(!res[s.katalog_id]) res[s.katalog_id] = { toplam:0, owners:{} }
      res[s.katalog_id].toplam += sign * s.miktar
      const owner = d.owner_musteri_id || 'genel'
      res[s.katalog_id].owners[owner] = (res[s.katalog_id].owners[owner]||0) + sign * s.miktar
    }
  }
  return res
}

export function projectCostNet(expenses: Expense[], labors: Labor[], stockOutNet:number){
  const e = +expenses.reduce((a,b)=>a+(b.tutar_net||0),0).toFixed(2)
  const l = +labors.reduce((a,b)=>a+(b.tutar_net||0),0).toFixed(2)
  return +(e + l + (stockOutNet||0)).toFixed(2)
}
