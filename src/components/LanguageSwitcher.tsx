'use client'

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Languages, Globe } from 'lucide-react';
import { locales } from '@/lib/i18n';

const languages = {
  en: { name: 'English', flag: '🇺🇸', nativeName: 'English' },
  fr: { name: 'Français', flag: '🇫🇷', nativeName: 'Français' },
  ar: { name: 'العربية', flag: '🇩🇿', nativeName: 'العربية' }
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const switchLanguage = (newLocale: string) => {
    // Remove the current locale from the pathname and add the new one
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    const newPath = `/${newLocale}${pathWithoutLocale}`;
    router.push(newPath);
    setIsOpen(false);
  };

  const currentLanguage = languages[locale as keyof typeof languages];

  return (
    <div className="relative">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-primary-300 bg-white hover:bg-gray-50 transition-all duration-200"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Globe size={16} className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage?.flag} {currentLanguage?.nativeName}
        </span>
        <ChevronDown 
          size={14} 
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50"
            >
              {locales.map((lang) => {
                const langInfo = languages[lang as keyof typeof languages];
                const isActive = locale === lang;
                
                return (
                  <motion.button
                    key={lang}
                    onClick={() => switchLanguage(lang)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors duration-150 ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-500' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <span className="text-lg">{langInfo.flag}</span>
                    <div>
                      <div className="font-medium text-sm">{langInfo.nativeName}</div>
                      <div className="text-xs text-gray-500">{langInfo.name}</div>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto w-2 h-2 bg-primary-500 rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}