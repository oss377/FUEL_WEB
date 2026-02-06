'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiHome, 
  FiBarChart2, 
  FiMapPin, 
  FiTruck, 
  FiUser, 
  FiSettings,
  FiBell,
  FiCalendar,
  FiDollarSign,
  FiUsers,
  FiShield,
  FiHelpCircle,
  FiChevronLeft,
  FiChevronRight,
  FiMenu
} from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navItems = [
    {
      id: 'dashboard',
      href: '/dashboard',
      label: t('union.dashboard'),
      icon: <FiHome />,
    },
    {
      id: 'vehicles',
      href: '/dashboard/vehicles',
      label: t('union.vehicles'),
      icon: <FiTruck />,
    },
    {
      id: 'stations',
      href: '/dashboard/stations',
      label: t('union.stations'),
      icon: <FiMapPin />,
    },
    {
      id: 'reports',
      href: '/dashboard/reports',
      label: t('union.reports'),
      icon: <FiBarChart2 />,
    },
    {
      id: 'scheduling',
      href: '/dashboard/scheduling',
      label: t('union.scheduling'),
      icon: <FiCalendar />,
    },
    {
      id: 'billing',
      href: '/dashboard/billing',
      label: t('union.billing'),
      icon: <FiDollarSign />,
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
        border-r border-gray-200 dark:border-gray-800
      `}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!isCollapsed ? (
              <>
                <Link href="/dashboard" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <FiHome className="text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {t('union.panel')}
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

        {/* Scrollable Content */}
        <div className="h-[calc(100vh-120px)] overflow-y-auto p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
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
        </div>
      </aside>
    </>
  );
}