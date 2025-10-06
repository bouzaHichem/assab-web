import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale,

  // Always redirect to a locale prefix
  localePrefix: 'always'
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/', '/(ar|en|fr)/:path*']
};