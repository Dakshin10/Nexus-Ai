import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCw } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ConnectorIcon } from './ConnectorIcon';

interface ConnectorCardProps {
  id: string;
  name: string;
  icon: any;
  description: string;
  isConnected: boolean;
  isReady: boolean;
  color: string;
  onConnect: () => void;
}

export const ConnectorCard: React.FC<ConnectorCardProps> = ({
  id,
  name,
  icon,
  description,
  isConnected,
  isReady,
  color,
  onConnect
}) => {
  // Safe color mapping for Tailwind JIT
  const colorStyles: Record<string, any> = {
    rose: {
      bg: 'bg-rose-500/5',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      glow: 'bg-rose-500',
      activeBg: 'bg-rose-500/10',
      btn: 'bg-rose-600 shadow-[0_0_20px_rgba(225,29,72,0.3)]',
      iconBg: 'bg-rose-500/20',
      iconBorder: 'border-rose-500/30'
    },
    emerald: {
      bg: 'bg-emerald-500/5',
      border: 'border-emerald-500/20',
      text: 'text-emerald-400',
      glow: 'bg-emerald-500',
      activeBg: 'bg-emerald-500/10',
      btn: 'bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      iconBg: 'bg-emerald-500/20',
      iconBorder: 'border-emerald-500/30'
    },
    purple: {
      bg: 'bg-purple-500/5',
      border: 'border-purple-500/20',
      text: 'text-purple-400',
      glow: 'bg-purple-500',
      activeBg: 'bg-purple-500/10',
      btn: 'bg-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.3)]',
      iconBg: 'bg-purple-500/20',
      iconBorder: 'border-purple-500/30'
    },
    amber: {
      bg: 'bg-amber-500/5',
      border: 'border-amber-500/20',
      text: 'text-amber-400',
      glow: 'bg-amber-500',
      activeBg: 'bg-amber-500/10',
      btn: 'bg-amber-600 shadow-[0_0_20px_rgba(217,119,6,0.3)]',
      iconBg: 'bg-amber-500/20',
      iconBorder: 'border-amber-500/30'
    },
    blue: {
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/20',
      text: 'text-blue-400',
      glow: 'bg-blue-500',
      activeBg: 'bg-blue-500/10',
      btn: 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]',
      iconBg: 'bg-blue-500/20',
      iconBorder: 'border-blue-500/30'
    }
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={cn(
        "relative rounded-3xl p-6 border transition-all duration-500 overflow-hidden group",
        isConnected 
          ? `${style.bg} ${style.border}` 
          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10",
        !isReady && "opacity-60 grayscale cursor-not-allowed"
      )}
    >
      {/* Background Glow */}
      {isConnected && (
        <div className={cn(
          "absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 opacity-20",
          style.glow
        )} />
      )}

      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div className={cn(
            "p-3 rounded-2xl border transition-all duration-500",
            isConnected 
              ? `${style.iconBg} ${style.iconBorder} ${style.text}` 
              : "bg-white/5 border-white/5 text-slate-500 group-hover:border-white/20"
          )}>
            <ConnectorIcon icon={icon} className="w-6 h-6" />
          </div>
          
          {isReady ? (
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              isConnected 
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                : "bg-white/5 text-slate-500 border border-white/5"
            )}>
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  Connected
                </>
              ) : (
                "Disconnected"
              )}
            </div>
          ) : (
            <div className="px-3 py-1 rounded-full bg-white/5 text-slate-600 border border-white/5 text-[9px] font-bold uppercase tracking-widest">
              Available Soon
            </div>
          )}
        </div>

        <div className="space-y-2 mb-8">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">{name}</h3>
          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
            {description}
          </p>
        </div>

        <div className="mt-auto">
          {isReady ? (
            <button
              onClick={onConnect}
              disabled={isConnected}
              className={cn(
                "w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-2",
                isConnected 
                  ? "bg-white/5 text-slate-500 border border-white/5 cursor-default" 
                  : `${style.btn} text-white hover:brightness-110 active:scale-95`
              )}
            >
              {isConnected ? (
                "Connector Active"
              ) : (
                <>
                  Connect <RotateCw className="w-3 h-3" />
                </>
              )}
            </button>
          ) : (
            <button disabled className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-slate-700 uppercase tracking-[0.2em] cursor-not-allowed">
              Locked
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
