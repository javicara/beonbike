'use client';

import React, { useState } from 'react';
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

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locale = useLocale();
  
  // Define navigation items with fallbacks
  const navItems = [
    { key: 'ebikes', fallback: 'Electric Bikes', href: `/${locale}/bikes` },
    { key: 'conversion', fallback: 'Conversions', href: `/${locale}/conversions` },
    { key: 'rental', fallback: 'Rentals', href: `/${locale}/rentals` },
    { key: 'tours', fallback: 'Tours', href: `/${locale}/tours` },
    { key: 'contact', fallback: 'Contact', href: `/${locale}/contact` },
  ];
  
  // Initialize with fallbacks
  let navigation = navItems.map(item => ({
    name: item.fallback,
    href: item.href
  }));
  
  try {
    // Try to get navigation translations
    const t = useTranslations('navigation');
    
    // Update with actual translations
    navigation = navItems.map(item => ({
      name: getSafeTranslation(t, item.key, item.fallback),
      href: item.href
    }));
  } catch (error) {
    console.error('Error loading navigation translations:', error);
    // Already using fallbacks
  }

  // Function to change language
  const changeLanguage = (newLocale: string) => {
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(`/${locale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <header className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <nav className="flex flex-wrap items-center justify-between py-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2 text-xl font-bold">
            <span className="text-blue-400">Beonbike</span>
            <span className="text-white">.pro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Language Selector & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={locale}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 text-white py-1 px-3 pr-8 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </nav>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block py-2 text-base text-gray-300 hover:text-white"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}; 