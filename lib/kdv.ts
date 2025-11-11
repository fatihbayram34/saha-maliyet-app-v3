export function calcAnlasma(net:number, kdv_oran:number=0.20){
  const kdv = +(net * kdv_oran).toFixed(2)
  const brut = +(net + kdv).toFixed(2)
  return { net, kdv, brut }
}
