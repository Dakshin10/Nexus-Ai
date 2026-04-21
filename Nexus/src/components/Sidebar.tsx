import React from 'react';
import { 
  Brain, 
  Globe, 
  Target, 
  Zap, 
  Bot, 
  Network, 
  Settings 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNexusStore } from '../store/nexusStore';

const NavItem = ({ icon: Icon, label, active = false, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "group relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-300",
      active 
        ? "bg-indigo-500/20 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]" 
        : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
    )}
  >
    <Icon className="w-6 h-6" />
    <span className="absolute left-16 px-2 py-1 rounded bg-slate-800 text-slate-100 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest border border-white/5">
      {label}
    </span>
    {active && (
      <div className="absolute -left-3 w-1.5 h-6 bg-indigo-500 rounded-r-full" />
    )}
  </button>
);

export const Sidebar: React.FC = () => {
  const { isGraphVisible, toggleGraph, toggleExternalPanel } = useNexusStore();

  return (
    <nav className="w-20 border-r border-white/5 bg-black/40 backdrop-blur-xl flex flex-col items-center py-8 gap-8 z-20">
      <div className="flex flex-col gap-4">
        <NavItem icon={Brain} label="Stream" active={true} />
        <NavItem icon={Globe} label="External" onClick={toggleExternalPanel} />
        <NavItem icon={Target} label="Decision" />
        <NavItem icon={Zap} label="Prediction" />
        <NavItem icon={Bot} label="Agent" />
      </div>

      <div className="mt-auto flex flex-col gap-4">
        <NavItem 
          icon={Network} 
          label="Graph" 
          active={isGraphVisible} 
          onClick={toggleGraph}
        />
        <NavItem icon={Settings} label="Settings" />
      </div>
    </nav>
  );
};
