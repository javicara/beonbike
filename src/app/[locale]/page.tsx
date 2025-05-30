'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { FaPhone, FaWhatsapp, FaSms } from 'react-icons/fa';

// Helper function to safely get translations with fallbacks
function getSafeTranslation(translationFunc: any, key: string, fallback: string): string {
  try {
    return translationFunc(key);
  } catch (error) {
    console.warn(`Translation key not found: ${key}, using fallback`, error);
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
      contact: 'Contact Us',
      call: 'Call Us',
      whatsapp: 'WhatsApp',
      sms: 'Send SMS'
    },
    services: {
      title: 'Our Services',
      ebikesDesc: 'Explore our range of electric bikes for all terrains and preferences.',
      conversionDesc: 'Convert your regular bike into an electric powerhouse.',
      rentalDesc: 'Rent electric bikes for your adventures in Sunshine Coast.',
      toursDesc: 'Join our guided tours to explore beautiful routes and landscapes.'
    },
    about: {
      title: 'About Us',
      subtitle: 'Electric Mobility Experts in Sunshine Coast',
      description: 'Beonbike.pro is dedicated to providing sustainable electric mobility solutions in Sunshine Coast. With our expertise in electric bikes, conversions, rentals, and guided tours, we offer comprehensive services for all your electric mobility needs.',
      learnMore: 'Learn More About Us'
    }
  };
  
  try {
    // Try to get translation functions
    const tHero = useTranslations('hero');
    const tNav = useTranslations('navigation');
    const tCta = useTranslations('cta');
    const tServices = useTranslations('services');
    const tAbout = useTranslations('about');
    
    // Update with actual translations, using safe translation function
    defaultTranslations.hero.title = getSafeTranslation(tHero, 'title', defaultTranslations.hero.title);
    defaultTranslations.hero.subtitle = getSafeTranslation(tHero, 'subtitle', defaultTranslations.hero.subtitle);
    
    defaultTranslations.nav.ebikes = getSafeTranslation(tNav, 'ebikes', defaultTranslations.nav.ebikes);
    defaultTranslations.nav.conversion = getSafeTranslation(tNav, 'conversion', defaultTranslations.nav.conversion);
    defaultTranslations.nav.rental = getSafeTranslation(tNav, 'rental', defaultTranslations.nav.rental);
    defaultTranslations.nav.tours = getSafeTranslation(tNav, 'tours', defaultTranslations.nav.tours);
    
    defaultTranslations.cta.learnMore = getSafeTranslation(tCta, 'learnMore', defaultTranslations.cta.learnMore);
    defaultTranslations.cta.contact = getSafeTranslation(tCta, 'contact', defaultTranslations.cta.contact);
    defaultTranslations.cta.call = getSafeTranslation(tCta, 'call', defaultTranslations.cta.call);
    defaultTranslations.cta.whatsapp = getSafeTranslation(tCta, 'whatsapp', defaultTranslations.cta.whatsapp);
    defaultTranslations.cta.sms = getSafeTranslation(tCta, 'sms', defaultTranslations.cta.sms);
    
    defaultTranslations.services.title = getSafeTranslation(tServices, 'title', defaultTranslations.services.title);
    defaultTranslations.services.ebikesDesc = getSafeTranslation(tServices, 'ebikesDesc', defaultTranslations.services.ebikesDesc);
    defaultTranslations.services.conversionDesc = getSafeTranslation(tServices, 'conversionDesc', defaultTranslations.services.conversionDesc);
    defaultTranslations.services.rentalDesc = getSafeTranslation(tServices, 'rentalDesc', defaultTranslations.services.rentalDesc);
    defaultTranslations.services.toursDesc = getSafeTranslation(tServices, 'toursDesc', defaultTranslations.services.toursDesc);
    
    // Try to get about translations if they exist
    try {
      defaultTranslations.about.title = getSafeTranslation(tAbout, 'title', defaultTranslations.about.title);
      defaultTranslations.about.subtitle = getSafeTranslation(tAbout, 'subtitle', defaultTranslations.about.subtitle);
      defaultTranslations.about.description = getSafeTranslation(tAbout, 'description', defaultTranslations.about.description);
      defaultTranslations.about.learnMore = getSafeTranslation(tAbout, 'learnMore', defaultTranslations.about.learnMore);
    } catch (error) {
      console.warn('About translations not available, using defaults');
    }
  } catch (error) {
    console.error('Error loading translations:', error);
    // Already using fallbacks from defaultTranslations
  }

  const { hero, nav, cta, services, about } = defaultTranslations;

  return (
    <div id="home-content">
      {/* Hero Section */}
      <section id="hero" className="relative h-[80vh] min-h-[600px] overflow-hidden">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <Image 
            src="/images/hero-bg.svg" 
            alt="Electric Bikes in Sunshine Coast"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 z-0"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative h-full z-10 container mx-auto px-4 flex flex-col items-center justify-center text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6 text-white max-w-4xl"
          >
            {hero.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl md:text-2xl mb-10 max-w-2xl text-white/90"
          >
            {hero.subtitle}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href={`/${locale}/contact`}>
              <Button variant="primary" size="lg" className="shadow-lg">
                {cta.contact}
              </Button>
            </Link>
            
            <Link href={`/${locale}/services`}>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-gray-900">
                {cta.learnMore}
              </Button>
            </Link>
          </motion.div>
        </div>
        
        {/* Hero Bottom Wave Pattern */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
            <path 
              fill="#f9fafb" 
              fillOpacity="1" 
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,80C672,64,768,64,864,69.3C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Business Verticals Section */}
      <section id="business-verticals" className="py-20 bg-gray-50">
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
            <BusinessVerticalCard 
              title={nav.ebikes}
              description={services.ebikesDesc}
              href={`/${locale}/bikes`}
              imgUrl="/images/placeholder-ebike.svg"
              iconSvg={
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17l2.939-6.585-1.476-.661M17 17h-2.758l-1.286-3.214M17 17l-4.389-3.135M16.298 9.755c.404.357.867.63 1.366.8m-1.366-.8a3 3 0 00-2.05-.8h-6.298c-.453 0-.9.064-1.328.186m7.676 1.414a3 3 0 00-2.05-.8h-2.05m4.1 0h-4.1" />
                  <circle cx="7" cy="17" r="2" />
                  <circle cx="17" cy="17" r="2" />
                </svg>
              }
            />
            
            <BusinessVerticalCard 
              title={nav.conversion}
              description={services.conversionDesc}
              href={`/${locale}/conversions`}
              imgUrl="/images/placeholder-conversion.svg"
              iconSvg={
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
            />
            
            <BusinessVerticalCard 
              title={nav.rental}
              description={services.rentalDesc}
              href={`/${locale}/rentals`}
              imgUrl="/images/placeholder-rental.svg"
              iconSvg={
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            
            <BusinessVerticalCard 
              title={nav.tours}
              description={services.toursDesc}
              href={`/${locale}/tours`}
              imgUrl="/images/placeholder-tours.svg"
              iconSvg={
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              }
            />
          </div>
        </div>
      </section>
      
      {/* About Us Preview Section */}
      <section id="about-preview" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2 relative h-[400px] rounded-lg overflow-hidden">
              <Image 
                src="/images/about-bg.svg" 
                alt="About Beonbike.pro"
                fill
                className="object-cover"
              />
            </div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{about.title}</h2>
              <div className="w-20 h-1 bg-blue-500 mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-4">{about.subtitle}</h3>
              <p className="text-gray-600 mb-8">{about.description}</p>
              <Link href={`/${locale}/about`}>
                <Button variant="secondary">
                  {about.learnMore}
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Contact CTAs Section */}
      <section id="contact-ctas" className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{cta.contact}</h2>
            <div className="w-20 h-1 bg-white mx-auto"></div>
          </motion.div>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 max-w-4xl mx-auto">
            <Link href="tel:+61400000000">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full md:w-auto flex items-center justify-center gap-2 text-white border-white hover:bg-white hover:text-blue-600"
              >
                <FaPhone className="w-5 h-5" />
                {cta.call}
              </Button>
            </Link>
            
            <Link href="https://wa.me/61400000000">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full md:w-auto flex items-center justify-center gap-2 text-white border-white hover:bg-white hover:text-blue-600"
              >
                <FaWhatsapp className="w-5 h-5" />
                {cta.whatsapp}
              </Button>
            </Link>
            
            <Link href="sms:+61400000000">
              <Button 
                variant="outline" 
                size="lg"
                className="w-full md:w-auto flex items-center justify-center gap-2 text-white border-white hover:bg-white hover:text-blue-600"
              >
                <FaSms className="w-5 h-5" />
                {cta.sms}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Business Vertical Card Component
function BusinessVerticalCard({ 
  title, 
  description, 
  href, 
  imgUrl,
  iconSvg 
}: { 
  title: string; 
  description: string; 
  href: string;
  imgUrl: string;
  iconSvg: React.ReactNode;
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
        <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
          <div className="relative h-48 w-full overflow-hidden">
            <Image 
              src={imgUrl} 
              alt={title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-xl font-bold text-white">
                {title}
              </h3>
            </div>
          </div>
          
          <div className="p-6 flex flex-col flex-grow">
            <div className="mb-4">
              {iconSvg}
            </div>
            
            <p className="text-gray-600 flex-grow mb-4">
              {description}
            </p>
            
            <div className="text-blue-500 font-medium hover:text-blue-700 transition-colors flex items-center">
              Learn More <span className="ml-1">→</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 