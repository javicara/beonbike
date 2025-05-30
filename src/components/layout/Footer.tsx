'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

// Helper function to safely get translations with fallbacks
function getSafeTranslation(translationFunc: any, key: string, fallback: string): string {
  try {
    return translationFunc(key);
  } catch (error) {
    return fallback;
  }
}

export const Footer = () => {
  const locale = useLocale();
  
  // Define default data as fallbacks
  const defaultData = {
    footer: {
      contact: 'Contact Us',
      rightsReserved: 'All rights reserved.'
    },
    company: {
      name: 'Beonbike.pro',
      slogan: 'Your electric mobility solution in Sunshine Coast, Australia.'
    },
    services: {
      title: 'Services',
      ebikes: 'Electric Bikes',
      conversions: 'Conversions',
      rentals: 'Rentals',
      tours: 'Tours'
    },
    legal: {
      legal: 'Legal',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
      whatsapp: 'WhatsApp'
    }
  };
  
  // Use default data initially
  let translatedData = { ...defaultData };
  
  try {
    // Try to get translation functions
    const tFooter = useTranslations('footer');
    const tCompany = useTranslations('company');
    const tServices = useTranslations('services');
    const tLegal = useTranslations('legal');
    
    // Update with translated values, using getSafeTranslation to avoid errors
    translatedData = {
      footer: {
        contact: getSafeTranslation(tFooter, 'contact', defaultData.footer.contact),
        rightsReserved: getSafeTranslation(tFooter, 'rightsReserved', defaultData.footer.rightsReserved)
      },
      company: {
        name: getSafeTranslation(tCompany, 'name', defaultData.company.name),
        slogan: getSafeTranslation(tCompany, 'slogan', defaultData.company.slogan)
      },
      services: {
        title: getSafeTranslation(tServices, 'title', defaultData.services.title),
        ebikes: getSafeTranslation(tServices, 'ebikes', defaultData.services.ebikes),
        conversions: getSafeTranslation(tServices, 'conversions', defaultData.services.conversions),
        rentals: getSafeTranslation(tServices, 'rentals', defaultData.services.rentals),
        tours: getSafeTranslation(tServices, 'tours', defaultData.services.tours)
      },
      legal: {
        legal: getSafeTranslation(tLegal, 'legal', defaultData.legal.legal),
        privacy: getSafeTranslation(tLegal, 'privacy', defaultData.legal.privacy),
        terms: getSafeTranslation(tLegal, 'terms', defaultData.legal.terms),
        whatsapp: getSafeTranslation(tLegal, 'whatsapp', defaultData.legal.whatsapp)
      }
    };
  } catch (error) {
    console.error('Error loading footer translations:', error);
    // Already using fallbacks in defaultData
  }

  const { footer, company, services, legal } = translatedData;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              {company.name}
            </h3>
            <p className="text-gray-300 mb-4">
              {company.slogan}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              {services.title}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/bikes`} className="text-gray-300 hover:text-white hover:underline transition duration-200">
                  {services.ebikes}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/conversions`} className="text-gray-300 hover:text-white hover:underline transition duration-200">
                  {services.conversions}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/rentals`} className="text-gray-300 hover:text-white hover:underline transition duration-200">
                  {services.rentals}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tours`} className="text-gray-300 hover:text-white hover:underline transition duration-200">
                  {services.tours}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              {footer.contact}
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a 
                  href="tel:+61403460777" 
                  className="flex items-center group hover:text-white transition duration-200"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>+61 403 460 777</span>
                </a>
              </li>
              <li>
                <a 
                  href="sms:+61403460777" 
                  className="flex items-center group hover:text-white transition duration-200"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-400 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <span>SMS</span>
                </a>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Sunshine Coast, QLD</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              {legal.legal}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-300 hover:text-white hover:underline transition duration-200">
                  {legal.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-300 hover:text-white hover:underline transition duration-200">
                  {legal.terms}
                </Link>
              </li>
              <li>
                <a 
                  href="https://wa.me/61403460777" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center group text-gray-300 hover:text-white hover:underline transition duration-200"
                >
                  <svg className="w-5 h-5 mr-2 text-blue-400 group-hover:text-blue-300" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {legal.whatsapp}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Beonbike.pro. {footer.rightsReserved}
        </div>
      </div>
    </footer>
  );
}; 