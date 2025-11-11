'use client'
import { useMemo } from 'react'
import { TR_LOCATIONS } from '@/lib/tr_locations'

export default function CityDistrictPicker({ il, ilce, setIl, setIlce }:{ il:string; ilce:string; setIl:(v:string)=>void; setIlce:(v:string)=>void }){
  const cities = useMemo(()=> Object.keys(TR_LOCATIONS), [])
  const districts = useMemo(()=> TR_LOCATIONS[il] || [], [il])
  return (
    <div className="grid md:grid-cols-2 gap-2">
      <select className="select" value={il} onChange={(e)=>{ setIl(e.target.value); setIlce('') }}>
        {cities.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      {districts.length>0 ? (
        <select className="select" value={ilce} onChange={(e)=> setIlce(e.target.value)}>
          <option value="">İlçe seç</option>
          {districts.map(d=> <option key={d} value={d}>{d}</option>)}
        </select>
      ) : (
        <input className="input" placeholder="İlçe (manuel)" value={ilce} onChange={(e)=> setIlce(e.target.value)} />
      )}
    </div>
  )
}
