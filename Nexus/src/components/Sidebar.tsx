import React from 'react';
import { 
  Brain, 
  Globe, 
  Target, 
  Zap, 
  Bot, 
  Network, 
  Settings,
  Circle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNexusStore } from '../store/nexusStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const NavItem = ({ icon: Icon, label, path, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "group relative flex items-center justify-center w-12 h-12 rounded-2xl transition-all duration-500",
      active 
        ? "bg-indigo-500/20 text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.2)]" 
        : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
    )}
  >
    <Icon className={cn("w-5 h-5 transition-transform duration-500 group-hover:scale-110", active && "scale-105")} />
    
    {/* Tooltip */}
    <span className="absolute left-16 px-3 py-1.5 rounded-lg bg-[#111] text-slate-200 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0 whitespace-nowrap z-50 pointer-events-none uppercase tracking-widest border border-white/5 shadow-2xl">
      {label}
    </span>
    
    {/* Active Indicator */}
    {active && (
      <motion.div 
        layoutId="activeSide"
        className="absolute -left-4 w-1 h-6 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]" 
      />
    )}
  </button>
);

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGraphVisible, toggleGraph } = useNexusStore();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="w-[80px] h-full border-r border-white/5 bg-black/40 backdrop-blur-2xl flex flex-col items-center py-8 z-30 shrink-0">
      {/* Logo */}
      <div onClick={() => navigate('/')} className="mb-12 relative group cursor-pointer">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.3)] group-hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-500">
          <div className="w-4 h-4 bg-white rounded-full animate-pulse shadow-inner" />
        </div>
      </div>

      {/* Core Modules */}
      <div className="flex flex-col gap-5">
        <NavItem icon={Brain} label="Stream Engine" active={isActive('/')} onClick={() => navigate('/')} />
        <NavItem icon={Globe} label="External Hub" active={isActive('/external')} onClick={() => navigate('/external')} />
        <NavItem icon={Target} label="Decision Engine" active={isActive('/decision')} onClick={() => navigate('/decision')} />
        <NavItem icon={Bot} label="Agent Engine" />
        <NavItem 
          icon={Network} 
          label="Graph Core" 
          active={isGraphVisible} 
          onClick={toggleGraph}
        />
      </div>

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col gap-5">
        <NavItem icon={Zap} label="Memory Optimization" />
        <NavItem icon={Settings} label="System Config" />
        
        <div className="pt-6 border-t border-white/5 w-8 flex justify-center">
          <div className="w-8 h-8 rounded-full border border-white/10 bg-white/5 overflow-hidden hover:border-indigo-500/50 transition-colors cursor-pointer">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Operator" alt="Profile" />
          </div>
        </div>
      </div>
    </nav>
  );
};

