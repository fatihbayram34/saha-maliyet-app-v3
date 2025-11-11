export function toCSV(rows: any[], headers?: string[]){
  if(!rows || rows.length===0) return ''
  const keys = headers || Object.keys(rows[0])
  const escape = (s:any)=> '"'+String(s??'').replace(/"/g,'""')+'"'
  const head = keys.join(',')
  const body = rows.map(r=> keys.map(k=>escape(r[k])).join(',')).join('\n')
  return head+'\n'+body
}
