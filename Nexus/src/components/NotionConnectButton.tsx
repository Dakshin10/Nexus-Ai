import React, { useState } from 'react';
import { StickyNote, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useIntegrationStatus } from '../services/api';
import { cn } from '../lib/utils';

export const NotionConnectButton: React.FC = () => {
  const { isNotionConnected, setNotionConnected } = useNexusStore();
  const { refetch, isFetching } = useIntegrationStatus();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    const { data } = await refetch();
    
    if (data?.notion) {
      setNotionConnected(true);
    } else {
      setError("Notion API Key missing in backend environment.");
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleConnect}
        disabled={isFetching || isNotionConnected}
        className={cn(
          "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98]",
          isNotionConnected 
            ? "bg-amber-500/10 text-amber-500 border border-amber-500/20 cursor-default"
            : isFetching
              ? "bg-white/5 text-slate-500 border border-white/10 cursor-wait"
              : "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10"
        )}
      >
        {isFetching ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isNotionConnected ? (
          <CheckCircle2 className="w-5 h-5" />
        ) : (
          <StickyNote className="w-5 h-5 text-amber-500" />
        )}
        
        <span>
          {isFetching ? "Verifying..." : isNotionConnected ? "Notion Connected ✅" : "Connect Notion"}
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
