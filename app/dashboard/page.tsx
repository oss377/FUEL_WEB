'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardContent from '@/components/union/DashboardContent';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/');
      } else if (user.role === 'admin') {
        // If admin, redirect to admin dashboard
        router.push('/admin');
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user || user.role === 'admin') {
    return null;
  }

  return (
    <DashboardContent />
  );

}