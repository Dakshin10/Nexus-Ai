import React, { useState } from 'react';
import { RefreshCw, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useSyncMutation } from '../services/api';
import { useNexusStore } from '../store/nexusStore';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export const SyncAllButton: React.FC = () => {
  const { currentUser, setBucketedTasks, addLog } = useNexusStore();
  const syncMutation = useSyncMutation(currentUser.id);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSync = async () => {
    try {
      addLog('Initiating AI-powered synchronization...', 'agent');
      const response = await syncMutation.mutateAsync();
      
      if (response.results?.bucketedTasks) {
        setBucketedTasks(response.results.bucketedTasks);
        addLog(`Successfully extracted ${response.results.tasks_extracted} tasks using Anti-Gravity Engine.`, 'success');
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (err) {
      console.error('Sync failed:', err);
      addLog('Synchronization failed. Check backend logs.', 'info');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleSync}
        disabled={syncMutation.isPending}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all active:scale-[0.98]",
          syncMutation.isPending 
            ? "bg-white/5 text-slate-500 cursor-wait"
            : showSuccess
              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
              : syncMutation.isError
                ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
        )}
      >
        {syncMutation.isPending ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : showSuccess ? (
          <Check className="w-3 h-3" />
        ) : syncMutation.isError ? (
          <AlertCircle className="w-3 h-3" />
        ) : (
          <RefreshCw className="w-3 h-3" />
        )}
        
        <span>
          {syncMutation.isPending 
            ? "Synchronizing..." 
            : showSuccess 
              ? "Sync Complete" 
              : syncMutation.isError 
                ? "Sync Failed" 
                : "Sync All"}
        </span>
      </button>

      <AnimatePresence>
        {showSuccess && syncMutation.data?.results && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-4 w-64 p-4 rounded-2xl bg-[#121212] border border-white/5 shadow-2xl z-50 overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />
            <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Sync Summary</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Emails Ingested</span>
                <span className="font-mono text-white">{syncMutation.data.results.total_emails}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Tasks Extracted</span>
                <span className="font-mono text-white">{syncMutation.data.results.tasks_extracted}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-emerald-400 font-bold">Notion Synced</span>
                <span className="font-mono text-emerald-400 font-bold">{syncMutation.data.results.notion_synced}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
