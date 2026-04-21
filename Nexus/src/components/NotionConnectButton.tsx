import React, { useState, useEffect } from 'react';
import { StickyNote, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useNotionConnect, useNotionPages } from '../services/api';
import { cn } from '../lib/utils';

export const NotionConnectButton: React.FC = () => {
  const { isNotionConnected, setNotionConnected, setNotionPages, setLoadingNotion } = useNexusStore();
  const { mutateAsync: connect, isPending: isConnecting } = useNotionConnect();
  const { refetch: fetchPages, isFetching: isFetchingPages } = useNotionPages();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    try {
      const result = await connect();
      if (result.connected) {
        setNotionConnected(true);
        // Immediately fetch pages
        setLoadingNotion(true);
        const { data } = await fetchPages();
        if (data) setNotionPages(data);
        setLoadingNotion(false);
      } else {
        setError(result.error || "Failed to connect to Notion.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    }
  };

  const isLoading = isConnecting || isFetchingPages;

  return (
    <div className="space-y-3">
      <button
        onClick={handleConnect}
        disabled={isLoading || isNotionConnected}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]",
          isNotionConnected 
            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default"
            : isLoading
              ? "bg-white/5 text-slate-500 border border-white/10 cursor-wait"
              : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 shadow-[0_0_15px_rgba(251,191,36,0.05)]"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isNotionConnected ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <StickyNote className="w-5 h-5 text-amber-500" />
        )}
        
        <span className="uppercase tracking-widest text-xs">
          {isConnecting ? "Authenticating..." : isFetchingPages ? "Syncing..." : isNotionConnected ? "Notion Active" : "Connect Notion Node"}
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
