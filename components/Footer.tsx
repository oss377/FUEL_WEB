'use client';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-t from-gray-100 to-white dark:from-gray-900 dark:to-black text-gray-800 dark:text-white py-12 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="font-bold">FM</span>
              </div>
              <span className="text-xl font-bold">{t('common.appName')}</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {t('footer.companyDescription')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><a href="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">{t('nav.dashboard')}</a></li>
              <li><a href="/dashboard/reports" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">{t('nav.reports')}</a></li>
              <li><a href="/dashboard/stations" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">{t('nav.stations')}</a></li>
              <li><a href="/dashboard/vehicles" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">{t('nav.vehicles')}</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.support')}</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">{t('footer.helpCenter')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">{t('footer.documentation')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">{t('footer.contactUs')}</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">{t('footer.privacyPolicy')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <FiMail className="text-blue-400" />
                <span className="text-gray-600 dark:text-gray-400">support@ETFUEL.com</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <FiGithub className="text-xl" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <FiTwitter className="text-xl" />
                </a>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
                  <FiLinkedin className="text-xl" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 dark:border-gray-800 mt-8 pt-8 text-center text-gray-500 dark:text-gray-500">
          <p>&copy; {new Date().getFullYear()} {t('common.appName')}. {t('footer.rightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
}