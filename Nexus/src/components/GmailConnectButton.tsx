import React from 'react';
import { Mail, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useGmailAuth } from '../hooks/useGmailAuth';
import { cn } from '../lib/utils';

export const GmailConnectButton: React.FC = () => {
  const { isConnected, isConnecting, error, connect } = useGmailAuth();

  return (
    <div className="space-y-3">
      <button
        onClick={connect}
        disabled={isConnecting || isConnected}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]",
          isConnected 
            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default"
            : isConnecting
              ? "bg-white/5 text-slate-500 border border-white/10 cursor-wait"
              : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        )}
      >
        {isConnecting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isConnected ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <Mail className="w-5 h-5" />
        )}
        
        <span>
          {isConnecting ? "Connecting..." : isConnected ? "Connected ✅" : "Connect Gmail"}
        </span>
      </button>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{error}</p>
          <button 
            onClick={connect}
            className="ml-auto font-bold underline hover:text-rose-300"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
