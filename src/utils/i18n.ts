// Importamos correctamente los mensajes de traducción
import enMessages from '@/locales/en/common.json';
import esMessages from '@/locales/es/common.json';

// Mapa de mensajes por locale
const messagesMap: Record<string, any> = {
  en: enMessages,
  es: esMessages,
};

/**
 * Obtiene los mensajes de traducción para un idioma específico
 * @param locale - Código de idioma (ej: 'en', 'es')
 * @returns Mensajes de traducción
 */
export function getMessages(locale: string) {
  // Devolvemos los mensajes para el locale especificado o los de inglés como fallback
  return messagesMap[locale] || messagesMap.en;
} 