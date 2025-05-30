'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useLocale } from 'next-intl';

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
      title: 'Our Services'
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
        title: getSafeTranslation(tServices, 'title', defaultTranslations.services.title)
      }
    };
  } catch (error) {
    console.error('Error loading translations:', error);
    // Already using fallbacks from defaultTranslations
  }

  const { hero, nav, cta, services } = translations;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-lg mb-12">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            {hero.title}
          </h1>
          <p className="text-xl mb-8">
            {hero.subtitle}
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
            {cta.contact}
          </button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12">{services.title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceCard 
            title={nav.ebikes} 
            description={cta.learnMore} 
            href={`/${locale}/bikes`} 
          />
          <ServiceCard 
            title={nav.conversion} 
            description={cta.learnMore} 
            href={`/${locale}/conversions`} 
          />
          <ServiceCard 
            title={nav.rental} 
            description={cta.learnMore} 
            href={`/${locale}/rentals`} 
          />
          <ServiceCard 
            title={nav.tours} 
            description={cta.learnMore} 
            href={`/${locale}/tours`} 
          />
        </div>
      </section>
    </div>
  );
}

// Componente de tarjeta de servicio
function ServiceCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <Link href={href}>
      <div className="group bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-6 h-full">
        <h3 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600">
          {title}
        </h3>
        <p className="text-gray-600">
          {description}
        </p>
      </div>
    </Link>
  );
} 