// components/FinanceSidebar.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,    // ← better for Overview / Dashboard
  Car,                // ← clear for Vehicles
  EvCharger,          // ← perfect for charging Stations
  BarChart,           // ← strong match for Reports / Analytics / Finance
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import logo from "@/assets/13124.jpg"; // adjust path if needed

const NAVY_BLUE = "#003087";
const SAFETY_YELLOW = "#FFC300";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vehicles", href: "/dashboard/vehicles", icon: Car },
  { name: "Stations", href: "/dashboard/stations", icon: EvCharger },
  { name: "Reports",  href: "/dashboard/reports",  icon: BarChart },
];

interface FinanceSidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isMobileMenu: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function FinanceSidebar({
  isCollapsed,
  setIsCollapsed,
  isMobileMenu,
  mobileMenuOpen,
  setMobileMenuOpen,
}: FinanceSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/";
    }
    return pathname.startsWith(`${href}/`) || pathname === href;
  };

  // Shared sidebar content (used by both desktop and mobile versions)
  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Header / Logo */}
      <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex items-center gap-4">
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
          <Image
            src={logo}
            alt="Genety Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {(!isCollapsed || isMobileMenu) && (
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap">
            Union <span style={{ color: SAFETY_YELLOW }}>Panel</span>
          </h1>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-5 sm:py-8 space-y-2 sm:space-y-3 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => isMobileMenu && setMobileMenuOpen(false)}
              className={`
                group relative flex items-center rounded-xl transition-all duration-200
                ${isCollapsed && !isMobileMenu 
                  ? "justify-center p-3.5" 
                  : "px-4 sm:px-5 py-3.5 sm:py-4 gap-3 sm:gap-4"}
                ${active
                  ? "bg-[#003087] text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }
              `}
            >
              <Icon
                className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0"
                style={{ color: active ? SAFETY_YELLOW : undefined }}
              />

              {(isMobileMenu || !isCollapsed) && (
                <span className="text-sm sm:text-base font-medium">{item.name}</span>
              )}

              {/* Tooltip when collapsed (desktop only) */}
              {isCollapsed && !isMobileMenu && (
                <div
                  className="
                    pointer-events-none absolute left-full ml-4 px-4 py-2.5 
                    bg-gray-900 text-white text-sm font-medium rounded-lg 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    shadow-xl z-50 whitespace-nowrap
                  "
                >
                  {item.name}
                  <div className="absolute left-0 top-1/2 -translate-x-1.5 -translate-y-1/2 w-3 h-3 bg-gray-900 rotate-45" />
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop collapse button */}
      {!isMobileMenu && (
        <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-gray-800 mt-auto">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`
              w-full flex items-center justify-center gap-2.5 
              py-3 rounded-xl bg-gray-100 dark:bg-gray-800 
              hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors
            `}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Collapse
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );

  // ────────────────────────────────────────────────
  // MOBILE VERSION - Right slide-in drawer
  // ────────────────────────────────────────────────
  if (isMobileMenu) {
    return (
      <>
        {/* Backdrop overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Right drawer */}
        <div
          className={`
            fixed top-0 right-0 z-50 h-full w-4/5 max-w-sm bg-white dark:bg-gray-900 
            border-l border-gray-200 dark:border-gray-800 shadow-2xl 
            transition-transform duration-300 ease-in-out lg:hidden
            ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}
          `}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // ────────────────────────────────────────────────
  // DESKTOP VERSION - Left fixed sidebar
  // ────────────────────────────────────────────────
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-800 
        transition-all duration-300 hidden lg:flex flex-col
        ${isCollapsed ? "w-20" : "w-72"}
      `}
    >
      {sidebarContent}
    </aside>
  );
}