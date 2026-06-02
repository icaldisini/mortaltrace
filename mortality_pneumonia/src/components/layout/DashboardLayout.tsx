import React from 'react';
import { Sidebar } from './Sidebar';
import { useSidebar } from '../SidebarProvider';
import { cn } from '../../lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { isOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300">
      {/* Subtle top bar decorative line */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-indigo-600 z-50 shadow-sm" />
      
      <Sidebar />
      
      <main className={cn(
        "relative z-10 transition-all duration-300 ease-in-out min-h-screen",
        isOpen ? "pl-64" : "pl-20"
      )}>
        <div className="container mx-auto max-w-[1400px] px-10 py-12">
          {children}
        </div>
      </main>
    </div>
  );
};
