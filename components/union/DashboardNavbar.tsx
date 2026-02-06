'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  FiTruck,
  FiSearch, 
  FiBell, 
  FiSun, 
  FiMoon, 
  FiGlobe,
  FiChevronDown,
  FiUser,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function DashboardNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Dashboard Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-2 mr-8">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <FiTruck className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden md:block">
                ETFUEL
              </span>
            </Link>

            {/* Left side - Search */}
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('common.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </form>
            </div>

            {/* Right side - Controls */}
            <div className="flex items-center space-x-3 ml-4">
              {/* Notifications */}
              <button className="p-2 relative text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition">
                <FiBell className="text-lg" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-2 h-2 rounded-full"></span>
              </button>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                title={`${t('common.language')}: ${language === 'en' ? t('common.amharic') : t('common.english')}`}
              >
                <FiGlobe className="text-lg" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/30 rounded-lg transition"
                title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
              >
                {theme === 'dark' ? <FiSun className="text-lg" /> : <FiMoon className="text-lg" />}
              </button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role || 'union'}
                    </p>
                  </div>
                  <FiChevronDown className="text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                      <div className="mt-1">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded">
                          {user?.role || 'union'}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        router.push('/dashboard/profile');
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiUser />
                      <span>{t('nav.profile')}</span>
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        router.push('/dashboard/settings');
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <FiSettings />
                      <span>{t('common.settings')}</span>
                    </button>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <FiLogOut />
                        <span>{t('common.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Close dropdown when clicking outside */}
      {showUserDropdown && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </>
  );
}