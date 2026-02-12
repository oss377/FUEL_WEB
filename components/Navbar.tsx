// components/Navbar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, LogOut, ChevronDown, Menu, X, Home, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/genety logo.png"; // ← adjust path

interface NavbarProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Navbar({ onMobileMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const { user, userData, userRole, logout, loading } = useAuth();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserOpen(false);
      }
    };
    if (isUserOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserOpen]);

  const handleLogout = async () => {
    setIsUserOpen(false);
    try {
      await logout();
      window.location.href = "/login";
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const displayName = userData?.name || user?.email?.split("@")[0] || "Guest";
  const displayInitial = displayName.charAt(0).toUpperCase();
  const isAuthenticated = !!user && !loading;

  return (
    <header className="h-16 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Mobile: Logo on left */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="relative w-9 h-9 rounded-lg overflow-hidden">
          <Image src={logo} alt="Genety Logo" fill className="object-contain" priority />
        </div>
        <span className="font-semibold text-lg text-gray-800 dark:text-gray-100">
          Finance
        </span>
      </div>

      {/* Desktop: empty space or brand if you want */}
      <div className="hidden lg:block" />

      {/* Right side icons */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications - hidden on mobile or keep if you want */}
        <button
          className="lg:flex hidden relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          disabled={!isAuthenticated}
        >
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {isAuthenticated && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full ring-4 ring-white dark:ring-gray-900" />
          )}
        </button>

        {/* User avatar dropdown - shown on both, but smaller on mobile */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => isAuthenticated && setIsUserOpen(!isUserOpen)}
            className={`flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 ${
              !isAuthenticated ? "opacity-60" : ""
            }`}
            disabled={loading || !isAuthenticated}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {displayInitial}
            </div>
          </button>

          <AnimatePresence>
            {isUserOpen && isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-72 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50"
              >
                {/* ... same user dropdown content as before ... */}
                <div className="p-5 bg-gradient-to-br from-gray-700 to-gray-900 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-4 border-white/30">
                      {displayInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-lg truncate">{displayName}</p>
                      <p className="text-sm opacity-90 truncate">{user?.email}</p>
                      {userRole && (
                        <p className="text-xs mt-1 opacity-80 capitalize">
                          {userRole} {userData?.emailVerified ? "• Verified" : ""}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-1">
                  <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsUserOpen(false)}>
                    <Home className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span>Home</span>
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setIsUserOpen(false)}>
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    <span>Profile / Settings</span>
                  </Link>
                  <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 text-left">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hamburger - only mobile */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Open menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-7 h-7 text-gray-700 dark:text-gray-200" />
          ) : (
            <Menu className="w-7 h-7 text-gray-700 dark:text-gray-200" />
          )}
        </button>
      </div>
    </header>
  );
}