'use client';

import { FiSun, FiMoon, FiGlobe } from 'react-icons/fi';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ThemeLanguageToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      {/* Language Toggle */}
      <button
        onClick={toggleLanguage}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group relative"
        aria-label={t('common.language')}
        title={`${t('common.language')}: ${t(`common.${language === 'en' ? 'amharic' : 'english'}`)}`}
      >
        <FiGlobe className="text-lg" />
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {t(`common.${language === 'en' ? 'amharic' : 'english'}`)}
        </span>
      </button>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group relative"
        aria-label={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
        title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
      >
        {theme === 'dark' ? (
          <FiSun className="text-yellow-400 text-lg" />
        ) : (
          <FiMoon className="text-gray-700 text-lg" />
        )}
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          {theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
        </span>
      </button>
    </div>
  );
}