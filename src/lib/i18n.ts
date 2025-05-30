import { useRouter } from 'next/router';
import { useCallback } from 'react';

// Type for supported locales
export type Locale = 'en' | 'es';

// Helper to get the current locale from the router
export const useLocale = () => {
  const router = useRouter();
  const locale = router.locale as Locale;
  return locale;
};

// Hook for switching languages
export const useLanguageSwitch = () => {
  const router = useRouter();
  
  const switchLanguage = useCallback((newLocale: Locale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: newLocale });
  }, [router]);

  return {
    currentLocale: router.locale as Locale,
    switchLanguage,
  };
};

// Helper to load translations
export const loadTranslations = async (locale: Locale, namespace: string) => {
  try {
    const translations = await import(`../locales/${locale}/${namespace}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${locale}/${namespace}:`, error);
    return {};
  }
};

// Helper to generate SEO-friendly URLs
export const getLocalizedUrl = (path: string, locale: Locale) => {
  // Remove leading and trailing slashes
  const cleanPath = path.replace(/^\/+|\/+$/g, '');
  
  // Split the path to check if it already contains a locale
  const segments = cleanPath.split('/');
  const hasLocale = ['en', 'es'].includes(segments[0]);
  
  // Remove the locale if it exists
  const pathWithoutLocale = hasLocale ? segments.slice(1).join('/') : cleanPath;
  
  // Construct the new URL with the desired locale
  return `/${locale}/${pathWithoutLocale}`.replace(/\/+$/, '') + '/';
};

// Helper to get alternate URLs for SEO
export const getAlternateUrls = (path: string) => {
  return {
    en: getLocalizedUrl(path, 'en'),
    es: getLocalizedUrl(path, 'es'),
  };
}; 