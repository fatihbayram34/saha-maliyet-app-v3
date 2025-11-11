'use client'
import { useState } from 'react'

export default function Tabs({ tabs, children }:{tabs:string[]; children:any}){
  const [i, setI] = useState(0)
  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {tabs.map((t,idx)=>(
          <button key={t} className={"btn "+(i===idx?'btn-primary':'btn-ghost')} onClick={()=>setI(idx)}>{t}</button>
        ))}
      </div>
      <div>{Array.isArray(children)? children[i] : children}</div>
    </div>
  )
}
