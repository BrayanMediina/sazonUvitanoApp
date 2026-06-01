import React from 'react';
import { TopBar } from './TopBar';
import { BottomNav } from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
  topBar?: React.ReactNode;
  bottomNav?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  topBar,
  bottomNav,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {topBar}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      {bottomNav}
    </div>
  );
};
