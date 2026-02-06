'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/AuthForm';

export default function HomePage() {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Only redirect when loading is complete
    if (!loading && user) {
      console.log('Home page redirect check:', { userRole, user });
      
      // Add a small delay to ensure everything is loaded
      const timer = setTimeout(() => {
        if (userRole === 'admin') {
          router.push('/admin');
        } else if (userRole === 'union') {
          router.push('/dashboard');
        }
        // If no role or other role, stay on login page
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [user, userRole, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Show login form only if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <AuthForm type="login" />
      </div>
    );
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}