'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/contexts/AuthContext';
import Footer from '../Footer';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, userRole } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Check if current page is admin page
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/admin');
  
  if (!isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <Navbar />
      <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 pt-16 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} flex flex-col`}>
        <main className="flex-1">
          {children}
        </main>
        <Footer/>
      </div>   
    </div>
  );
}