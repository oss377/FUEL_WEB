// 'use client';

// import { useEffect, useState, ReactNode } from 'react';
// import { useRouter } from 'next/navigation';
// import { FiLoader, FiShield, FiLock } from 'react-icons/fi';
// import { useAuth } from '@/contexts/AuthContext';
// import GlassCard from './GlassCard';

// interface ProtectedRouteProps {
//   children: ReactNode;
//   requiredRole?: 'union' | 'manager' | 'admin';
//   fallback?: ReactNode;
//   showLoading?: boolean;
// }

// export default function ProtectedRoute({
//   children,
//   requiredRole = 'union',
//   fallback,
//   showLoading = true
// }: ProtectedRouteProps) {
//   const { user, loading, getUserRole } = useAuth();
//   const [userRole, setUserRole] = useState<string>('union');
//   const [checkingRole, setCheckingRole] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const checkAuth = async () => {
//       if (!loading) {
//         if (user) {
//           const role = await getUserRole();
//           setUserRole(role);
//           setCheckingRole(false);
//         } else {
//           setCheckingRole(false);
//           router.push('/login');
//         }
//       }
//     };

//     checkAuth();
//   }, [user, loading, router, getUserRole]);

//   // Loading state
//   if (loading || checkingRole) {
//     if (showLoading) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
//           <GlassCard className="p-8 text-center">
//             <div className="animate-spin mb-4">
//               <FiLoader className="text-4xl text-blue-400" />
//             </div>
//             <h3 className="text-xl font-semibold text-white mb-2">Verifying Access</h3>
//             <p className="text-gray-400">Checking your credentials...</p>
//           </GlassCard>
//         </div>
//       );
//     }
//     return null;
//   }

//   // Not authenticated
//   if (!user) {
//     if (fallback) {
//       return <>{fallback}</>;
//     }

//     return (
//       <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
//         <div className="container mx-auto max-w-2xl">
//           <GlassCard className="p-8 text-center">
//             <div className="w-20 h-20 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FiLock className="text-3xl text-red-400" />
//             </div>
            
//             <h1 className="text-3xl font-bold text-white mb-4">
//               Access Restricted
//             </h1>
            
//             <p className="text-gray-300 mb-6">
//               You need to be logged in to access this page.
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={() => router.push('/login')}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition"
//               >
//                 Sign In
//               </button>
//               <button
//                 onClick={() => router.push('/')}
//                 className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition"
//               >
//                 Go Home
//               </button>
//             </div>
//           </GlassCard>
//         </div>
//       </div>
//     );
//   }

//   // Check role authorization
//   const roleHierarchy = { union: 1, manager: 2, admin: 3 };
//   const userRoleLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 1;
//   const requiredRoleLevel = roleHierarchy[requiredRole];

//   if (userRoleLevel < requiredRoleLevel) {
//     return (
//       <div className="min-h-screen pt-24 pb-12 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
//         <div className="container mx-auto max-w-2xl">
//           <GlassCard className="p-8 text-center">
//             <div className="w-20 h-20 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <FiShield className="text-3xl text-yellow-400" />
//             </div>
            
//             <h1 className="text-3xl font-bold text-white mb-4">
//               Insufficient Permissions
//             </h1>
            
//             <p className="text-gray-300 mb-4">
//               Your current role: <span className="font-bold">{userRole}</span>
//             </p>
//             <p className="text-gray-300 mb-6">
//               Required role: <span className="font-bold">{requiredRole}</span>
//             </p>

//             <div className="flex flex-col sm:flex-row gap-4 justify-center">
//               <button
//                 onClick={() => router.push('/dashboard')}
//                 className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition"
//               >
//                 Go to Dashboard
//               </button>
//               <button
//                 onClick={() => router.back()}
//                 className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition"
//               >
//                 Go Back
//               </button>
//             </div>
//           </GlassCard>
//         </div>
//       </div>
//     );
//   }

//   // Authenticated and authorized
//   return <>{children}</>;
// }