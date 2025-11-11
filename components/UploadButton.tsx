'use client'
import { uploadFile } from '@/lib/db'
import { useState } from 'react'

export default function UploadButton({ label='Belge Yükle', onUploaded }:{label?:string; onUploaded?:(url:string)=>void}){
  const [busy, setBusy] = useState(false)
  return (
    <label className="btn btn-ghost cursor-pointer">
      {busy? 'Yükleniyor…' : label}
      <input type="file" className="hidden" onChange={async (e)=>{
        const f = e.target.files?.[0]
        if(!f) return
        setBusy(true)
        try {
          const url = await uploadFile(f as any)
          onUploaded && onUploaded(url)
        } finally {
          setBusy(false)
        }
      }} />
    </label>
  )
}
