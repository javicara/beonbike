'use client';

import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';

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
            <h3 className="text-xl font-bold mb-4">
              {company.name}
            </h3>
            <p className="text-gray-300 mb-4">
              {company.slogan}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {services.title}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/bikes`} className="text-gray-300 hover:text-white transition">
                  {services.ebikes}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/conversions`} className="text-gray-300 hover:text-white transition">
                  {services.conversions}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/rentals`} className="text-gray-300 hover:text-white transition">
                  {services.rentals}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/tours`} className="text-gray-300 hover:text-white transition">
                  {services.tours}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {footer.contact}
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center">
                <span className="mr-2">📞</span> 
                <span>+61 0403 460 777</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📱</span> 
                <span>+61 403 460 777</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📍</span> 
                <span>Sunshine Coast, QLD</span>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {legal.legal}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${locale}/privacy`} className="text-gray-300 hover:text-white transition">
                  {legal.privacy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-gray-300 hover:text-white transition">
                  {legal.terms}
                </Link>
              </li>
              <li>
                <a href="https://wa.me/61403460777" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">
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