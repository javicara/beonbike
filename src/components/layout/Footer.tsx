'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube, 
  FaWhatsapp, 
  FaPhone, 
  FaSms, 
  FaEnvelope, 
  FaMapMarkerAlt 
} from 'react-icons/fa';

// Helper function to safely get translations with fallbacks
function getSafeTranslation(translationFunc: any, key: string, fallback: string): string {
  try {
    return translationFunc(key);
  } catch (error) {
    console.warn(`Translation key not found: ${key}, using fallback`, error);
    return fallback;
  }
}

export const Footer = () => {
  const locale = useLocale();
  const currentYear = new Date().getFullYear();
  
  // Define default data as fallbacks
  const defaultData = {
    footer: {
      contact: 'Contact Us',
      rights: 'All rights reserved.',
      followUs: 'Follow Us',
      newsletter: 'Subscribe to our newsletter',
      subscribeButton: 'Subscribe',
      emailPlaceholder: 'Your email',
      address: 'Sunshine Coast, QLD, Australia'
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
        rights: getSafeTranslation(tFooter, 'rights', defaultData.footer.rights),
        followUs: getSafeTranslation(tFooter, 'followUs', defaultData.footer.followUs),
        newsletter: getSafeTranslation(tFooter, 'newsletter', defaultData.footer.newsletter),
        subscribeButton: getSafeTranslation(tFooter, 'subscribeButton', defaultData.footer.subscribeButton),
        emailPlaceholder: getSafeTranslation(tFooter, 'emailPlaceholder', defaultData.footer.emailPlaceholder),
        address: getSafeTranslation(tFooter, 'address', defaultData.footer.address)
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

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    console.log('Newsletter subscription submitted');
    // In a real implementation, this would call an API to handle the subscription
  };

  return (
    <footer className="bg-gray-900 text-white py-12" itemScope itemType="http://schema.org/Organization">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400" itemProp="name">
              {company.name}
            </h3>
            <p className="text-gray-300 mb-4" itemProp="description">
              {company.slogan}
            </p>
            
            {/* Social Media Links */}
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-3 text-gray-200">
                {footer.followUs}
              </h4>
              <div className="flex space-x-4">
                <a 
                  href="https://facebook.com/beonbike" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Facebook" 
                  className="text-gray-300 hover:text-blue-500 transition duration-200"
                >
                  <FaFacebook size={20} />
                </a>
                <a 
                  href="https://instagram.com/beonbike.pro" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Instagram" 
                  className="text-gray-300 hover:text-pink-500 transition duration-200"
                >
                  <FaInstagram size={20} />
                </a>
                <a 
                  href="https://twitter.com/beonbike" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Twitter" 
                  className="text-gray-300 hover:text-blue-400 transition duration-200"
                >
                  <FaTwitter size={20} />
                </a>
                <a 
                  href="https://youtube.com/beonbike" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="YouTube" 
                  className="text-gray-300 hover:text-red-600 transition duration-200"
                >
                  <FaYoutube size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              {services.title}
            </h3>
            <nav aria-label="Footer Services Navigation">
              <ul className="space-y-2">
                <li>
                  <Link 
                    href={`/${locale}/bikes`} 
                    className="text-gray-300 hover:text-white hover:underline transition duration-200 flex items-center"
                  >
                    <span className="hover:pl-1 transition-all duration-200">{services.ebikes}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/conversions`} 
                    className="text-gray-300 hover:text-white hover:underline transition duration-200 flex items-center"
                  >
                    <span className="hover:pl-1 transition-all duration-200">{services.conversions}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/rentals`} 
                    className="text-gray-300 hover:text-white hover:underline transition duration-200 flex items-center"
                  >
                    <span className="hover:pl-1 transition-all duration-200">{services.rentals}</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href={`/${locale}/tours`} 
                    className="text-gray-300 hover:text-white hover:underline transition duration-200 flex items-center"
                  >
                    <span className="hover:pl-1 transition-all duration-200">{services.tours}</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Contact Info */}
          <div itemProp="address" itemScope itemType="http://schema.org/PostalAddress">
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              {footer.contact}
            </h3>
            <address className="not-italic">
              <ul className="space-y-3 text-gray-300">
                <li>
                  <a 
                    href="tel:+61403460777" 
                    className="flex items-center group hover:text-white transition duration-200"
                    itemProp="telephone"
                  >
                    <FaPhone className="w-4 h-4 mr-3 text-blue-400 group-hover:text-blue-300" />
                    <span>+61 403 460 777</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:info@beonbike.pro" 
                    className="flex items-center group hover:text-white transition duration-200"
                    itemProp="email"
                  >
                    <FaEnvelope className="w-4 h-4 mr-3 text-blue-400 group-hover:text-blue-300" />
                    <span>info@beonbike.pro</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="sms:+61403460777" 
                    className="flex items-center group hover:text-white transition duration-200"
                  >
                    <FaSms className="w-4 h-4 mr-3 text-blue-400 group-hover:text-blue-300" />
                    <span>SMS</span>
                  </a>
                </li>
                <li>
                  <a 
                    href="https://wa.me/61403460777" 
                    className="flex items-center group hover:text-white transition duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="w-4 h-4 mr-3 text-blue-400 group-hover:text-blue-300" />
                    <span>{legal.whatsapp}</span>
                  </a>
                </li>
                <li>
                  <div className="flex items-center text-gray-300" itemProp="streetAddress">
                    <FaMapMarkerAlt className="w-4 h-4 mr-3 text-blue-400" />
                    <span>{footer.address}</span>
                  </div>
                </li>
              </ul>
            </address>
          </div>

          {/* Newsletter Form */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-blue-400">
              {footer.newsletter}
            </h3>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  placeholder={footer.emailPlaceholder}
                  required 
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
              </div>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 w-full"
              >
                {footer.subscribeButton}
              </button>
            </form>
          </div>
        </div>

        {/* Copyright & Legal Links */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-center md:text-left mb-4 md:mb-0">
            &copy; {currentYear} {company.name}. {footer.rights}
          </p>
          <ul className="flex flex-wrap justify-center space-x-4 text-sm text-gray-400">
            <li>
              <Link 
                href={`/${locale}/privacy`} 
                className="hover:text-white hover:underline transition duration-200"
              >
                {legal.privacy}
              </Link>
            </li>
            <li>
              <Link 
                href={`/${locale}/terms`} 
                className="hover:text-white hover:underline transition duration-200"
              >
                {legal.terms}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}; 