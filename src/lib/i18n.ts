import {getRequestConfig} from 'next-intl/server';
 
export const locales = ['en', 'fr', 'ar'] as const;
export const defaultLocale = 'en' as const;
export type Locale = (typeof locales)[number];
 
export default getRequestConfig(async ({locale}) => {
  // Validate locale
  const validLocale = locales.includes(locale as Locale) ? locale : defaultLocale;
  
  try {
    return {
      locale: validLocale,
      messages: (await import(`../messages/${validLocale}.json`)).default
    };
  } catch (error) {
    // Fallback to default locale if locale file doesn't exist
    return {
      locale: defaultLocale,
      messages: (await import(`../messages/${defaultLocale}.json`)).default
    };
  }
});
