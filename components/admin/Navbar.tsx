'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  FiHome, 
  FiBarChart2, 
  FiMapPin, 
  FiTruck, 
  FiUser, 
  FiUsers,
  FiLogOut, 
  FiBell,
  FiMessageSquare,
  FiSearch,
  FiHelpCircle,
  FiSettings,
  FiDollarSign,
  FiFileText,
  FiShield
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ThemeLanguageToggle from '../ThemeLanguageToggle';

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

export default function Navbar() {
  const { user, logout, userRole, userData } = useAuth();
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(2);

  // Don't show navbar on auth pages only
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/reset-password';
  
  // Show navbar on ALL pages except auth pages
  const shouldShowNavbar = !isAuthPage;

  // If shouldn't show navbar, return null
  if (!shouldShowNavbar) {
    return null;
  }

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
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  // Update nav items based on user role and current page
  const getNavItems = (): NavItem[] => {
    const baseItems: NavItem[] = [
      { href: '/', label: t('nav.home'), icon: <FiHome /> }
    ];

    // Check if user is on an admin page
    const isOnAdminPage = pathname.startsWith('/main') || pathname.startsWith('/admin');
    
    if (userRole === 'admin' && isOnAdminPage) {
      // Admin dashboard navigation
      return [
        { href: '/admin/users', label: t('admin.users'), icon: <FiUsers /> },
        { href: '/admin/stations', label: t('admin.stations'), icon: <FiMapPin /> },
        { href: '/admin/vehicles', label: t('admin.vehicles'), icon: <FiTruck /> },
        { href: '/admin/transactions', label: t('admin.transactions'), icon: <FiDollarSign /> },
        { href: '/admin/reports', label: t('admin.reports'), icon: <FiFileText /> },
        { href: '/admin/analytics', label: t('admin.analytics'), icon: <FiBarChart2 /> },
        { href: '/admin/settings', label: t('admin.settings'), icon: <FiSettings /> },
        { href: '/admin/security', label: t('admin.security'), icon: <FiShield /> },
      ];
    } else if (userRole === 'union' && pathname.startsWith('/dashboard')) {
      // Union dashboard navigation
      return [
        { href: '/dashboard', label: t('union.dashboard'), icon: <FiHome /> },
        { href: '/dashboard/vehicles', label: t('union.vehicles'), icon: <FiTruck /> },
        { href: '/dashboard/stations', label: t('union.stations'), icon: <FiMapPin /> },
        { href: '/dashboard/reports', label: t('union.reports'), icon: <FiBarChart2 /> },
      ];
    } else {
      // Public navigation or when user is logged in but on public pages
      const publicItems = [
        ...baseItems,
        { href: '/features', label: t('nav.features') },
        { href: '/pricing', label: t('nav.pricing') },
        { href: '/about', label: t('nav.about') },
        { href: '/contact', label: t('nav.contact') },
      ];

      // If user is admin but on public pages, add admin link
      if (userRole === 'admin' && !isOnAdminPage) {
        return [
          ...publicItems,
          { href: '/admin', label: t('nav.adminPanel'), icon: <FiSettings /> }
        ];
      }

      // If user is union but on public pages, add dashboard link
      if (userRole === 'union' && !pathname.startsWith('/dashboard')) {
        return [
          ...publicItems,
          { href: '/dashboard', label: t('nav.dashboard'), icon: <FiHome /> }
        ];
      }

      return publicItems;
    }
  };

  const navItems = getNavItems();

  // Determine logo link based on user role and current page
  const getLogoLink = () => {
    if (userRole === 'admin') {
      return '/admin';
    } else if (userRole === 'union') {
      return '/dashboard';
    }
    return '/';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={getLogoLink()} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <FiTruck className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('common.appName')}
            </span>
            {userRole === 'admin' && (
              <span className="ml-2 px-2 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full">
                Admin
              </span>
            )}
          </Link>

          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            {/* Search Bar - Desktop */}
            <div className="hidden md:block relative">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('common.searchPlaceholder')}
                    className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>

            {/* Theme and Language Toggle */}
            <ThemeLanguageToggle />

            {/* Auth Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="relative group">
                    <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition">
                      <FiSettings className="text-lg" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {t('common.profileSettings')}
                      </Link>
                      {userRole === 'admin' && (
                        <Link
                          href="/admin/settings"
                          className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          {t('common.systemSettings')}
                        </Link>
                      )}
                      <Link
                        href="/help"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <FiHelpCircle className="inline mr-2" />
                        {t('common.helpSupport')}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
                      >
                        <FiLogOut className="inline mr-2" />
                        {t('common.logout')}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition"
                  >
                    {t('common.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}