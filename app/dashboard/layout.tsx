// app/finance/layout.tsx
// or app/(finance)/layout.tsx — depending on your Next.js app structure

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FinanceSidebar from "@/components/FinaceSidebar";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext"; // adjust path if needed

export default function FinanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auth protection + role check
  useEffect(() => {
    if (!loading) {
      setIsChecking(false);

      if (!user) {
        router.replace("/login");
        return;
      }

      // Adjust role name if it's different in your system
      if (userRole !== "union") {
        router.replace("/unauthorized");
        // You can also do: router.replace("/login?error=access_denied")
      }
    }
  }, [loading, user, userRole, router]);

  // Show loading screen while checking auth
  if (loading || isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-5">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Checking access...
          </p>
        </div>
      </div>
    );
  }

  // ────────────────────────────────────────────────
  // Main layout (authenticated + correct role)
  // ────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar – left fixed */}
      <FinanceSidebar
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
        isMobileMenu={false}
        mobileMenuOpen={false}
        setMobileMenuOpen={() => {}}
      />

      {/* Mobile Menu – right slide-in */}
      <FinanceSidebar
        isCollapsed={false}
        setIsCollapsed={() => {}}
        isMobileMenu={true}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main content area – shifts right on desktop when sidebar is open */}
      <div
        className={`
          flex flex-1 flex-col transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}
        `}
      >
        {/* Navbar (contains logo on mobile left + hamburger + user menu) */}
        <Navbar
          onMobileMenuToggle={() => setMobileMenuOpen((prev) => !prev)}
          isMobileMenuOpen={mobileMenuOpen}
        />

        {/* Page content with nice fade/enter animation */}
        <main className="flex-1 overflow-y-auto bg-white dark:bg-gray-900">
          <div className="p-4 sm:p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={typeof children === "object" ? JSON.stringify(children) : children?.toString()}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Prevent content overlap with mobile bottom nav (if you add one later) */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}