// 'use client';

// import { usePathname } from 'next/navigation';
// import Navbar from './Navbar';
// import Footer from './Footer';
// import { useAuth } from '@/contexts/AuthContext';

// export default function LayoutClient({ children }: { children: React.ReactNode }) {
//   const pathname = usePathname();
//   const { user, loading } = useAuth();
  
//   // Check if current page is a dashboard page
//   const isDashboardPage = pathname.startsWith('/dashboard');
//   const isHomePage = pathname === '/';
//   const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/reset-password';
  
//   // For dashboard pages, we don't use the regular LayoutClient layout
//   if (isDashboardPage) {
//     return <>{children}</>;
//   }
  
//   const showNavbar = !isAuthPage;
//   const showFooter = !isAuthPage;

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* Show navbar except on auth pages */}
//       {showNavbar && <Navbar />}
      
//       {/* Main content area */}
//       <main className="flex-1">
//         {children}
//       </main>
      
//       {/* Show footer except on auth pages */}
//       {showFooter && <Footer />}
//     </div>
//   );
// }