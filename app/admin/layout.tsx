'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayoutContent from '@/components/admin/AdminLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      console.log('AdminLayout auth check:', { user, userRole, loading });
      
      if (!user) {
        console.log('No user found, redirecting to login');
        router.push('/');
      } else if (userRole !== 'admin') {
        console.log(`User role is ${userRole}, redirecting to appropriate page`);
        
        if (userRole === 'union') {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      } else {
        console.log('Admin user authenticated');
      }
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayoutContent>
      <div className="p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </AdminLayoutContent>
  );
}