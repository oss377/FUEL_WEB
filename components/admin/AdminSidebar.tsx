'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiUsers,
  FiMapPin,
  FiTruck,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiShield,
  FiFileText,
  FiDatabase,
  FiGlobe,
  FiBell,
  FiHelpCircle,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiMenu
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface AdminSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function AdminSidebar({ isCollapsed, setIsCollapsed }: AdminSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    await logout();
  };

  const adminNavItems = [
    {
      href: '/admin',
      label: t('admin.dashboard'),
      icon: <FiHome />,
    },
    {
      href: '/admin/users',
      label: t('admin.users'),
      icon: <FiUsers />,
    },
    {
      href: '/admin/stations',
      label: t('admin.stations'),
      icon: <FiMapPin />,
    },
    {
      href: '/admin/vehicles',
      label: t('admin.vehicles'),
      icon: <FiTruck />,
    },
    {
      href: '/admin/transactions',
      label: t('admin.transactions'),
      icon: <FiDollarSign />,
    },
    {
      href: '/admin/reports',
      label: t('admin.reports'),
      icon: <FiFileText />,
    },
    {
      href: '/admin/analytics',
      label: t('admin.analytics'),
      icon: <FiBarChart2 />,
    },
    {
      href: '/admin/settings',
      label: t('admin.settings'),
      icon: <FiSettings />,
    },
    {
      href: '/admin/security',
      label: t('admin.security'),
      icon: <FiShield />,
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <FiMenu className="text-xl" />
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-64px)] z-30 transition-all duration-300
        ${isCollapsed ? 'w-16' : 'w-64'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700
        shadow-lg
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed ? (
              <>
                <Link href="/admin" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FiHome className="text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('admin.panel')}
                  </span>
                </Link>
                <button
                  onClick={() => setIsCollapsed(true)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiChevronLeft className="text-gray-500 dark:text-gray-400" />
                </button>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <FiHome className="text-white" />
                </div>
                <button
                  onClick={() => setIsCollapsed(false)}
                  className="absolute -right-3 top-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1 shadow-lg"
                >
                  <FiChevronRight className="text-gray-500 dark:text-gray-400" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* User Info */}
        {!isCollapsed && user && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.displayName || t('admin.adminUser')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{t('admin.administrator')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-4">
          <nav className="space-y-1">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <div className="text-lg">{item.icon}</div>
                {!isCollapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            ))}
          </nav>

          {/* Logout button */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleLogout}
              className={`flex items-center w-full p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <FiLogOut className="text-lg" />
              {!isCollapsed && <span className="ml-3">{t('common.logout')}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}