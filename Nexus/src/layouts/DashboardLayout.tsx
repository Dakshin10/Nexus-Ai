import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { MainContent } from '../components/MainContent';
import { IntelligencePanel } from '../components/IntelligencePanel';
import { useNexusStore } from '../store/nexusStore';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

export const DashboardLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isExternalPanelOpen } = useNexusStore();

  return (
    <div className="h-screen w-screen flex bg-black text-white overflow-hidden font-sans antialiased">
      {/* 1. Sidebar (Fixed) */}
      <Sidebar />

      {/* 2. Main Content (Center, Flexible) */}
      <MainContent>
        {children}
      </MainContent>

      {/* 3. Intelligence Panel (Right, Fixed) */}
      <IntelligencePanel />
    </div>
  );
};
