import { getRequestConfig } from 'next-intl/server';

// Define locales disponibles y el predeterminado
const locales = ['en', 'es'];
const defaultLocale = 'en';

export default getRequestConfig(async ({ locale }) => {
  // Validate locale or use default
  const validLocale = locale && typeof locale === 'string' && locales.includes(locale) 
    ? locale 
    : defaultLocale;

  try {
    // Cargar mensajes directamente desde la raíz de locales
    // Nota: esto carga directamente desde src/locales/{locale}.json
    const messages = (await import(`../locales/${validLocale}.json`)).default;
    
    return {
      locale: validLocale,
      messages,
      timeZone: 'Australia/Brisbane',
      now: new Date(),
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${validLocale}`, error);
    
    // Fallback to default locale if the requested one fails
    if (validLocale !== defaultLocale) {
      try {
        const fallbackMessages = (await import(`../locales/${defaultLocale}.json`)).default;
        return {
          locale: defaultLocale,
          messages: fallbackMessages,
          timeZone: 'Australia/Brisbane',
          now: new Date(),
        };
      } catch (fallbackError) {
        console.error(`Failed to load fallback messages for locale: ${defaultLocale}`, fallbackError);
      }
    }
    
    // If even the default locale fails, return empty messages
    return {
      locale: defaultLocale,
      messages: {},
      timeZone: 'Australia/Brisbane',
      now: new Date(),
    };
  }
}); 