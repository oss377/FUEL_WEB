'use client';

import { usePathname } from 'next/navigation';
import Navbar from './admin/Navbar';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, userRole } = useAuth();
  
  // Don't show navbar/footer on auth pages
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/reset-password';
  
  // Don't show Footer on admin/dashboard pages
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/admin');
  const isDashboardPage = pathname.startsWith('/dashboard');
  
  // Don't show navbar/footer on auth pages only
  if (isAuthPage) {
    return <div className="min-h-screen">{children}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Show Navbar on ALL pages except auth pages */}
      <Navbar />
      
      <main className="flex-1">
        {children}
      </main>
      
      {/* Show Footer only on public pages (not admin/dashboard pages) */}
      {!isAdminPage && !isDashboardPage && <Footer />}
    </div>
  );
}