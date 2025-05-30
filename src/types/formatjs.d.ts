declare module '@formatjs/intl-localematcher' {
  export function match(
    languages: string[],
    locales: string[],
    defaultLocale: string
  ): string;
} 