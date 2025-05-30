import { NextRequest, NextResponse } from 'next/server';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

// Define locales disponibles y el predeterminado
const locales = ['en', 'es'];
const defaultLocale = 'en';

// Esta función obtiene el idioma preferido del navegador del usuario
function getLocale(request: NextRequest) {
  // Intenta obtener el locale de las cookies primero
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Si no hay cookie, usa el accept-language header
  let headers = new Headers(request.headers);
  let acceptLanguage = headers.get('accept-language') || '';
  
  // Si no hay accept-language, devuelve el locale predeterminado
  if (!acceptLanguage) {
    return defaultLocale;
  }

  // Utiliza negotiator para determinar el idioma preferido
  const languages = new Negotiator({ headers: { 'accept-language': acceptLanguage } }).languages();
  try {
    return matchLocale(languages, locales, defaultLocale);
  } catch (e) {
    return defaultLocale;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Ignora archivos estáticos y API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Comprueba si la URL ya incluye un locale
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Si falta el locale, redirecciona añadiéndolo
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === '/' ? '' : pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 