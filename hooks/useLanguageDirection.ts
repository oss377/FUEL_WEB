'use client';

import { useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export function useLanguageDirection() {
  const { language } = useLanguage();

  useEffect(() => {
    // Set HTML direction based on language
    document.documentElement.dir = language === 'am' ? 'ltr' : 'ltr';
    // Amharic is LTR but you can change to RTL for other languages
    // document.documentElement.dir = language === 'am' ? 'ltr' : 'ltr';
  }, [language]);

  return language === 'am' ? 'ltr' : 'ltr';
}