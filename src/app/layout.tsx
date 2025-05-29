import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import type { Metadata } from 'next';
import { ResponsiveIndicator } from '@/components/ui/ResponsiveIndicator';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Beonbike.pro | Tu movilidad eléctrica en Australia',
  description: 'Electric bike sales, conversions, rentals, and guided tours in Sunshine Coast, Australia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} font-sans`}>
      <body>
        <main className="min-h-screen flex flex-col">
          {children}
        </main>
        <ResponsiveIndicator />
      </body>
    </html>
  );
}
