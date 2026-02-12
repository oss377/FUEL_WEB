'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';

export default function UnionLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <DashboardNavbar />
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 pt-16 transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'} flex flex-col`}>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>   
    </div>
  );
}