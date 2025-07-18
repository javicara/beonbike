import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beonbike.pro - Electric Mobility Solutions in Sunshine Coast',
  description: 'Your premier electric mobility solution in Sunshine Coast, Australia. Electric bike sales, conversions, rentals, and guided tours.',
  keywords: 'electric bikes, e-bikes, bike conversion, bike rental, guided tours, Sunshine Coast, Australia',
  openGraph: {
    title: 'Beonbike.pro - Electric Mobility Solutions',
    description: 'Electric bike sales, conversions, rentals, and guided tours in Sunshine Coast, Australia',
    url: 'https://beonbike.pro',
    siteName: 'Beonbike.pro',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}