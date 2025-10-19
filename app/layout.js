import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'EnCivar - Türkiye\'nin Yerel Rehberi',
  description: 'Yakınınızdaki en iyi işletmeleri keşfedin. Restoranlar, hizmetler, mağazalar ve daha fazlası.',
  keywords: 'yerel rehber, işletme, restoran, hizmet, Türkiye',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
