'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';

// Helper function to safely get translations with fallbacks
function getSafeTranslation(translationFunc: any, key: string, fallback: string): string {
  try {
    return translationFunc(key);
  } catch (error) {
    return fallback;
  }
}

export default function Home() {
  const locale = useLocale();
  
  // Define fallback default translations
  const defaultTranslations = {
    hero: {
      title: 'Welcome to Beonbike.pro',
      subtitle: 'Your Electric Mobility Solution in Sunshine Coast'
    },
    nav: {
      ebikes: 'Electric Bikes',
      conversion: 'Conversion Services',
      rental: 'Rentals',
      tours: 'Guided Tours'
    },
    cta: {
      learnMore: 'Learn more about our services',
      contact: 'Contact Us'
    },
    services: {
      title: 'Our Services',
      ebikesDesc: 'Explore our range of electric bikes for all terrains and preferences.',
      conversionDesc: 'Convert your regular bike into an electric powerhouse.',
      rentalDesc: 'Rent electric bikes for your adventures in Sunshine Coast.',
      toursDesc: 'Join our guided tours to explore beautiful routes and landscapes.'
    }
  };
  
  // Start with fallback translations
  let translations = { ...defaultTranslations };
  
  try {
    // Try to get translation functions
    const tHero = useTranslations('hero');
    const tNav = useTranslations('navigation');
    const tCta = useTranslations('cta');
    const tServices = useTranslations('services');
    
    // Update with actual translations, using safe translation function
    translations = {
      hero: {
        title: getSafeTranslation(tHero, 'title', defaultTranslations.hero.title),
        subtitle: getSafeTranslation(tHero, 'subtitle', defaultTranslations.hero.subtitle)
      },
      nav: {
        ebikes: getSafeTranslation(tNav, 'ebikes', defaultTranslations.nav.ebikes),
        conversion: getSafeTranslation(tNav, 'conversion', defaultTranslations.nav.conversion),
        rental: getSafeTranslation(tNav, 'rental', defaultTranslations.nav.rental),
        tours: getSafeTranslation(tNav, 'tours', defaultTranslations.nav.tours)
      },
      cta: {
        learnMore: getSafeTranslation(tCta, 'learnMore', defaultTranslations.cta.learnMore),
        contact: getSafeTranslation(tCta, 'contact', defaultTranslations.cta.contact)
      },
      services: {
        title: getSafeTranslation(tServices, 'title', defaultTranslations.services.title),
        ebikesDesc: getSafeTranslation(tServices, 'ebikesDesc', defaultTranslations.services.ebikesDesc),
        conversionDesc: getSafeTranslation(tServices, 'conversionDesc', defaultTranslations.services.conversionDesc),
        rentalDesc: getSafeTranslation(tServices, 'rentalDesc', defaultTranslations.services.rentalDesc),
        toursDesc: getSafeTranslation(tServices, 'toursDesc', defaultTranslations.services.toursDesc)
      }
    };
  } catch (error) {
    console.error('Error loading translations:', error);
    // Already using fallbacks from defaultTranslations
  }

  const { hero, nav, cta, services } = translations;

  return (
    <div id="home-content">
      {/* Hero Section */}
      <section id="hero" className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-70 z-10"></div>
        <div className="relative z-20 container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white"
          >
            {hero.title}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 max-w-2xl"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href={`/${locale}/contact`}>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                {cta.contact}
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{services.title}</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              title={nav.ebikes} 
              description={services.ebikesDesc}
              href={`/${locale}/bikes`} 
              icon={
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17l2.939-6.585-1.476-.661M17 17h-2.758l-1.286-3.214M17 17l-4.389-3.135M16.298 9.755c.404.357.867.63 1.366.8m-1.366-.8a3 3 0 00-2.05-.8h-6.298c-.453 0-.9.064-1.328.186m7.676 1.414a3 3 0 00-2.05-.8h-2.05m4.1 0h-4.1" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              }
            />
            <ServiceCard 
              title={nav.conversion} 
              description={services.conversionDesc}
              href={`/${locale}/conversions`} 
              icon={
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
            />
            <ServiceCard 
              title={nav.rental} 
              description={services.rentalDesc}
              href={`/${locale}/rentals`} 
              icon={
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <ServiceCard 
              title={nav.tours} 
              description={services.toursDesc}
              href={`/${locale}/tours`} 
              icon={
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// Componente de tarjeta de servicio mejorado
function ServiceCard({ title, description, href, icon }: { 
  title: string; 
  description: string; 
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <Link href={href} className="block h-full">
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 h-full flex flex-col items-center text-center">
          <div className="mb-4">
            {icon}
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">
            {title}
          </h3>
          <p className="text-gray-600 flex-grow">
            {description}
          </p>
          <div className="mt-4 text-blue-500 font-medium hover:text-blue-700 transition-colors">
            Más información →
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 