import React from 'react';
import { TopBar } from './TopBar';
import { InputPanel } from './InputPanel';
import { ActionPipeline } from './ActionPipeline';
import { motion } from 'framer-motion';

export const MainContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#050505] relative overflow-hidden">
      <TopBar />
      
      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-6xl mx-auto px-8">
          <InputPanel />
          <ActionPipeline />
          {children}
        </div>
      </main>

      {/* Decorative background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent pointer-events-none" />
    </div>
  );
};
