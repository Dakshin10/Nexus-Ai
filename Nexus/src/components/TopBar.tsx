import React from 'react';
import { SyncAllButton } from './SyncAllButton';
import { motion } from 'framer-motion';

export const TopBar: React.FC = () => {
  return (
    <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md z-10">
      <div className="flex items-center gap-3">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Phase 01 // Nexus Core</div>
      </div>
      
      <div className="flex items-center gap-6">
        <SyncAllButton />

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          <span className="text-[10px] font-bold text-emerald-500/80 uppercase tracking-widest">Active</span>
        </div>
        
        <div className="w-px h-4 bg-white/10" />
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[11px] font-bold text-white uppercase tracking-wider">Operator 01</p>
            <p className="text-[9px] text-slate-500 uppercase font-medium">Root Access</p>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Nexus" alt="Profile" />
          </div>
        </div>
      </div>
    </header>
  );
};
