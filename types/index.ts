export type ID = string

export type Customer = {
  id: ID
  unvan: string
  vergi_no?: string
  iletisim?: { tel?: string; eposta?: string; kisi?: string }
  adres?: string
  etiketler?: string[]
  createdAt?: any
  updatedAt?: any
}

export type Project = {
  id: ID
  musteri_id: ID
  ad: string
  il?: string
  ilce?: string
  konum?: string
  baslangic?: any
  bitis?: any
  durum: 'Teklif'|'Devam'|'Beklemede'|'Tamamlandı'|'İptal'
  anlasma_net: number
  kdv_oran: number
  anlasma_kdv: number
  anlasma_brut: number
  aciklama?: string
  etiketler?: string[]
  createdAt?: any
  updatedAt?: any
  // türev
  toplam_maliyet_net?: number
  brut_kar_net?: number
}

export type Receipt = {
  id: ID
  musteri_id: ID
  tarih: any
  tutar_brut: number
  yontem: string
  aciklama?: string
  allocations?: { proje_id: ID; tutar_brut: number }[]
  createdAt?: any
}

export type Expense = {
  id: ID
  proje_id: ID
  tarih: any
  kategori: string
  tutar_net: number
  kdv_oran?: number
  tutar_kdv?: number
  tutar_brut?: number
  kdv_maliyete_dahil?: boolean
  fatura_no?: string
  aciklama?: string
  belge_url?: string
}

export type Labor = {
  id: ID
  proje_id: ID
  tarih: any
  personel: string
  saat?: number
  gun?: number
  tutar_net: number
  aciklama?: string
}

export type CatalogItem = {
  id: ID
  kod: string
  ad: string
  birim: 'Adet'|'Metre'|'Kg'|'Rulo'|'Set'|'Diğer'
  kategoriler?: string[]
  tanim?: string
  son_birim_maliyet_net?: number
  ortalama_maliyet_net?: number
  createdAt?: any
  updatedAt?: any
}

export type LedgerDoc = {
  id: ID
  tarih: any
  tip: 'giris'|'cikis'|'iade'|'transfer'
  konum: 'depo'|'santiye'
  owner_musteri_id: ID
  proje_id?: ID
  satirlar: { katalog_id: ID; miktar: number; birim: string; birim_maliyet_net?: number; toplam_net?: number }[]
  aciklama?: string
  createdAt?: any
}
