import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Be On Bikes - Alquiler de E-Bikes en Sunshine Coast',
  description: 'Alquila tu bicicleta electrica en Sunshine Coast. Ideal para backpackers y latinos. Entrega a domicilio, desde $70/semana.',
  keywords: 'alquiler bicicletas electricas, e-bikes Sunshine Coast, backpackers Australia, renta bici electrica',
  openGraph: {
    title: 'Be On Bikes - E-Bikes para Backpackers',
    description: 'Alquiler de bicicletas electricas en Sunshine Coast. Rapido, facil y economico.',
    url: 'https://beonbikes.com',
    siteName: 'Be On Bikes',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}