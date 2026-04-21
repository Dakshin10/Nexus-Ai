import React from 'react';
import { 
  StickyNote, 
  Clock, 
  RotateCw, 
  ChevronRight, 
  Loader2,
  Sparkles,
  Search
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useNotionPages, useNotionImport } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export const NotionList: React.FC = () => {
  const { 
    notionPages, 
    setNotionPages, 
    isLoadingNotion, 
    setLoadingNotion, 
    updateAgent, 
    addTasks 
  } = useNexusStore();
  const { refetch: fetchPages, isFetching } = useNotionPages();
  const { mutateAsync: importPage, isPending: isImporting } = useNotionImport();

  const handleSync = async () => {
    setLoadingNotion(true);
    const { data } = await fetchPages();
    if (data) setNotionPages(data);
    setLoadingNotion(false);
  };

  const handleImport = async (pageId: string, title: string) => {
    try {
      updateAgent({ status: 'running', currentStep: `AI Ingestion: ${title}` });
      const result = await importPage(pageId);
      
      if (result.success && result.tasks) {
        addTasks(result.tasks);
        updateAgent({ 
          status: 'idle', 
          currentStep: `Extracted ${result.tasks.length} tasks from ${title}` 
        });
      }
    } catch (error) {
      console.error('Import failed:', error);
      updateAgent({ status: 'idle', currentStep: 'Extraction Failed' });
    }
  };

  if (!notionPages || notionPages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
        <Search className="w-10 h-10 text-slate-700 mb-4" />
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">No Pages Indexed</p>
        <p className="text-[10px] text-slate-600 mt-2 max-w-[200px]">
          Synchronize your Notion workspace to begin ingestion.
        </p>
        <button 
          onClick={handleSync}
          className="mt-6 flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest hover:text-amber-400 transition-colors"
        >
          <RotateCw className={cn("w-3.5 h-3.5", (isFetching || isLoadingNotion) && "animate-spin")} />
          Sync Workspace
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active Nodes</h4>
        </div>
        <button 
          onClick={handleSync}
          disabled={isFetching || isLoadingNotion}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-500 hover:text-slate-300 transition-all border border-white/5"
          title="Manual Refresh"
        >
          <RotateCw className={cn("w-3.5 h-3.5", (isFetching || isLoadingNotion) && "animate-spin")} />
        </button>
      </div>

      <div className="space-y-3">
        {notionPages.map((page: any) => (
          <motion.div
            key={page.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ x: 4 }}
            onClick={() => handleImport(page.id, page.title)}
            className="group p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 hover:bg-amber-500/[0.02] transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1.5 min-w-0">
                <h5 className="text-[13px] font-semibold text-slate-200 group-hover:text-amber-500 transition-colors truncate">
                  {page.title}
                </h5>
                <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed italic">
                  {page.preview || "No content preview available."}
                </p>
                
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-tighter">
                    <Clock className="w-3 h-3" />
                    <span>Edited {new Date(page.lastEdited).toLocaleDateString()}</span>
                  </div>
                  {isImporting && (
                    <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-400 uppercase">
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      <span>Ingesting...</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-4 h-4 text-amber-500" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
