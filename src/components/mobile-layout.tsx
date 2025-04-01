
import React from 'react';
import { NavBar } from './nav-bar';

interface MobileLayoutProps {
  children: React.ReactNode;
  currentTab: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  currentTab 
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-solo-dark">
      <main className="flex-1 px-4 pt-6 pb-20 overflow-y-auto">
        {children}
      </main>
      <NavBar currentTab={currentTab} />
    </div>
  );
};
