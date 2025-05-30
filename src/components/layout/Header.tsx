'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [isScrolled, setIsScrolled] = useState(false);
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  
  // Handle scroll event for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Define navigation items with fallbacks
  const navItems = [
    { key: 'ebikes', fallback: 'Electric Bikes', href: `/${locale}/bikes` },
    { key: 'conversion', fallback: 'Conversions', href: `/${locale}/conversions` },
    { key: 'rental', fallback: 'Rentals', href: `/${locale}/rentals` },
    { key: 'tours', fallback: 'Tours', href: `/${locale}/tours` },
    { key: 'about', fallback: 'About Us', href: `/${locale}/about` },
    { key: 'contact', fallback: 'Contact', href: `/${locale}/contact` },
  ];
  
  // Initialize with fallbacks
  let navigation = navItems.map(item => ({
    name: item.fallback,
    href: item.href,
    isActive: pathname === item.href || pathname.startsWith(item.href + '/')
  }));
  
  // Phone CTA
  let phoneCta = {
    label: 'Call Us',
    number: '+61 403 460 777'
  };
  
  try {
    // Try to get navigation translations
    const t = useTranslations('navigation');
    const ctaT = useTranslations('cta');
    
    // Update with actual translations
    navigation = navItems.map(item => ({
      name: getSafeTranslation(t, item.key, item.fallback),
      href: item.href,
      isActive: pathname === item.href || pathname.startsWith(item.href + '/')
    }));
    
    // Translate phone CTA
    phoneCta = {
      label: getSafeTranslation(ctaT, 'call', 'Call Us'),
      number: '+61 403 460 777'
    };
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

  // Function to handle logo click to prevent scrolling behavior
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Use router.push instead of Link for more control
    router.push(`/${locale}`);
    // Ensure we're at the top of the page
    window.scrollTo(0, 0);
  };

  return (
    <header 
      className={`bg-gray-900 text-white w-full z-50 transition-all duration-300 ${
        isScrolled ? 'sticky top-0 shadow-xl' : 'shadow-lg'
      }`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex flex-wrap items-center justify-between py-4">
          {/* Logo - Using onClick handler instead of standard Link behavior */}
          <a 
            href={`/${locale}`} 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <span className="text-blue-400">Beonbike</span>
            <span className="text-white">.pro</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`py-2 text-sm font-medium transition-colors duration-200 ${
                  item.isActive 
                    ? 'text-white border-b-2 border-blue-400' 
                    : 'text-gray-300 hover:text-white'
                }`}
                aria-current={item.isActive ? 'page' : undefined}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Phone CTA & Language Selector & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Phone CTA (visible on desktop) */}
            <a 
              href={`tel:${phoneCta.number.replace(/\s+/g, '')}`}
              className="hidden md:inline-flex items-center bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded text-sm font-medium transition duration-300"
              aria-label={`${phoneCta.label}: ${phoneCta.number}`}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mr-1.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                />
              </svg>
              {phoneCta.number}
            </a>

            {/* Language Selector */}
            <div className="relative z-10">
              <select
                value={locale}
                onChange={(e) => changeLanguage(e.target.value)}
                className="appearance-none bg-gray-800 border border-gray-700 text-white py-1.5 px-3 pr-8 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="md:hidden p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              <span className="sr-only">{isMobileMenuOpen ? "Close menu" : "Open menu"}</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
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
        
        {/* Mobile Navigation with Animation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden border-t border-gray-700 overflow-hidden"
            >
              <div className="py-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block py-2.5 px-4 text-base rounded-md ${
                      item.isActive 
                        ? 'text-white bg-gray-800' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-current={item.isActive ? 'page' : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Phone CTA (visible on mobile) */}
                <a
                  href={`tel:${phoneCta.number.replace(/\s+/g, '')}`}
                  className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 mt-4 px-4 py-2.5 rounded text-base font-medium transition duration-300"
                  aria-label={`${phoneCta.label}: ${phoneCta.number}`}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 mr-2" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" 
                    />
                  </svg>
                  {phoneCta.label}: {phoneCta.number}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}; 