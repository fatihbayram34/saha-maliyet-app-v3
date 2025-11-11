import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Saha & Maliyet Yönetimi',
  description: 'Genel Proje ve Maliyet Yönetimi (TR)'
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen">
        <div className="flex min-h-screen">
          <aside className="w-64 hidden md:block border-r bg-white">
            <div className="p-4 text-lg font-bold">Saha & Maliyet</div>
            <nav className="px-2 space-y-1">
              <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/dashboard">Ana Sayfa</Link>
              <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/musteriler">Müşteriler</Link>
              <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/projeler">Projeler</Link>
              <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/katalog">Katalog</Link>
              <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/stok">Stok</Link>
              <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/tahsilatlar">Tahsilatlar</Link>
              <Link className="block px-3 py-2 rounded-lg hover:bg-gray-100" href="/raporlar">Raporlar</Link>
            </nav>
          </aside>
          <main className="flex-1">
            <header className="md:hidden border-b bg-white sticky top-0 z-10">
              <div className="p-3 font-semibold">Saha & Maliyet</div>
              <div className="flex overflow-x-auto gap-2 px-3 pb-3">
                {['dashboard','musteriler','projeler','katalog','stok','tahsilatlar','raporlar'].map((p)=>(
                  <Link key={p} href={`/${p}`} className="btn btn-ghost">{p}</Link>
                ))}
              </div>
            </header>
            <div className="p-4">{children}</div>
          </main>
        </div>
      </body>
    </html>
  )
}
