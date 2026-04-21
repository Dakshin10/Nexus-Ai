import React from 'react';
import { StickyNote, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useNotionAuth } from '../hooks/useNotionAuth';
import { cn } from '../lib/utils';

export const NotionConnectButton: React.FC = () => {
  const { isNotionConnected } = useNexusStore();
  const { isConnected, isConnecting, error, connect } = useNotionAuth();

  const handleConnect = async () => {
    connect();
  };

  const isLoading = isConnecting;

  return (
    <div className="space-y-3">
      <button
        onClick={handleConnect}
        disabled={isLoading || isConnected}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]",
          isConnected 
            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
            : isLoading
              ? "bg-white/5 text-slate-500 border border-white/10 cursor-wait"
              : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 shadow-[0_0_15px_rgba(251,191,36,0.05)]"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isConnected ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <StickyNote className="w-5 h-5 text-amber-500" />
        )}
        
        <span className="uppercase tracking-widest text-xs">
          {isConnecting ? "Authenticating..." : isConnected ? "Notion Active" : "Connect Notion Node"}
        </span>
      </button>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-[10px] font-medium animate-in fade-in slide-in-from-top-1">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
