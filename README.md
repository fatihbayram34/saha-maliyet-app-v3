# Saha & Maliyet Yönetimi (TR)

Next.js (App Router) + TypeScript + Tailwind + Firebase Firestore (onSnapshot) + Recharts
- Türkçe arayüz, Europe/Istanbul, TR para birimi
- Canlı listeler: Firestore `onSnapshot()`
- Sayfalar: /dashboard, /musteriler, /projeler, /katalog, /stok, /tahsilatlar, /raporlar

## Kurulum
```bash
npm i
npm run dev
```
Öncesinde `.env.local` dosyasına Firebase bilgilerinizi girin (aşağıdaki şablona göre).

## Ortam Değişkenleri
`.env.example` dosyasını `.env.local` olarak kopyalayın:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Notlar
- Dashboard grafiklerinde demo seri yerleştirilmiştir; tarih gruplama bağlayınca otomatik dolar.
- Stok sayfası konsolide toplam gösterir; giriş/çıkış/iade formları iskelet olarak proje detayında belirtilmiştir.
- shadcn/ui yerine basit Tailwind bileşenleri eklendi; dilerseniz `shadcn` CLI ile bileşenleri ekleyebilirsiniz.
