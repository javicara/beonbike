'use client';

import { NextIntlClientProvider } from 'next-intl';
import { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ResponsiveIndicator } from '@/components/ui/ResponsiveIndicator';

interface ClientLayoutProps {
  children: React.ReactNode;
  locale: string;
}

export default function ClientLayout({ children, locale }: ClientLayoutProps) {
  const [messages, setMessages] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load translations dynamically on the client side
    async function loadMessages() {
      setLoading(true);
      try {
        // Intentamos cargar las traducciones directamente del JSON
        const englishMessages = (await import('@/locales/en/common.json')).default;
        
        if (locale === 'en') {
          setMessages(englishMessages);
        } else if (locale === 'es') {
          try {
            const spanishMessages = (await import('@/locales/es/common.json')).default;
            setMessages(spanishMessages);
          } catch (error) {
            console.error('Error loading Spanish messages, falling back to English', error);
            setMessages(englishMessages);
          }
        } else {
          setMessages(englishMessages);
        }
      } catch (error) {
        console.error(`Failed to load messages:`, error);
        // Fallback a mensajes en código duro
        setMessages({
          navigation: {
            home: 'Home',
            ebikes: 'Electric Bikes',
            conversion: 'Conversion Services',
            rental: 'Rentals',
            tours: 'Guided Tours',
            contact: 'Contact'
          },
          hero: {
            title: 'Welcome to Beonbike.pro',
            subtitle: 'Your Electric Mobility Solution in Sunshine Coast'
          },
          cta: {
            learnMore: 'Learn more about our services',
            contact: 'Contact us',
            book: 'Book now'
          }
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadMessages();
  }, [locale]);
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <ResponsiveIndicator />
    </NextIntlClientProvider>
  );
} 