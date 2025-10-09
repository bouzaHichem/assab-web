import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';

// Import messages directly
import enMessages from './messages/en.json';
import frMessages from './messages/fr.json';
import arMessages from './messages/ar.json';

// Can be imported from a shared config
const locales = ['en', 'fr', 'ar'];

const messages = {
  en: enMessages,
  fr: frMessages,
  ar: arMessages
};
 
export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  const validLocale = locale && locales.includes(locale as any) ? locale : 'en';
 
  return {
    locale: validLocale,
    messages: messages[validLocale as keyof typeof messages]
  };
});
