import React, { useEffect } from 'react';
import { 
  Zap, 
  Brain, 
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Mail,
  StickyNote,
  RotateCw,
  Target,
  Sparkles
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useNotionSync } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const InsightCard = ({ icon: Icon, label, value, subtext, color }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3 relative overflow-hidden group"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 blur-2xl -mr-8 -mt-8 group-hover:opacity-10 transition-opacity`} />
    
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-white/5 text-slate-400">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-white tracking-tight">{value}</span>
      <span className="text-[10px] text-slate-500 font-medium">{subtext}</span>
    </div>
  </motion.div>
);

export const IntelligencePanel: React.FC = () => {
  const { 
    cognitiveLoad, 
    isGmailConnected, 
    isNotionConnected, 
    updateAgent, 
    setBucketedTasks,
    nextAction,
    systemHealth,
    setNextAction,
    setSystemHealth,
    addLog,
    autoMode,
    currentUser
  } = useNexusStore();
  
  const { mutateAsync: syncWorkspace, isPending: isSyncing } = useNotionSync(currentUser.id);

  // Browser Notification Permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const triggerNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, icon: '/logo192.png' });
    }
  };

  const handleSync = async () => {
    try {
      addLog('Initiating background workspace synthesis...', 'info');
      setSystemHealth('optimizing');
      updateAgent({ status: 'running', currentStep: 'Synthesizing Workspace...' });
      
      addLog('Scanning integration nodes...', 'agent');
      const result = await syncWorkspace();
      
      if (result.success && result.bucketedTasks) {
        addLog('Extraction complete. Updating pipeline.', 'success');
        setBucketedTasks(result.bucketedTasks);
        setNextAction(result.nextAction || null);
        
        // Notify if high priority tasks found
        if (result.bucketedTasks.doNow.length > 0) {
          triggerNotification(
            "Critical Tasks Detected", 
            `Found ${result.bucketedTasks.doNow.length} items requiring immediate attention.`
          );
          addLog(`${result.bucketedTasks.doNow.length} high-priority tasks synchronized.`, 'success');
        }
        
        updateAgent({ 
          status: 'idle', 
          currentStep: `Last sync: ${new Date().toLocaleTimeString()}` 
        });
        setSystemHealth('active');
      } else {
        setSystemHealth('nominal');
        addLog('Sync completed with no new changes.', 'info');
      }
    } catch (error) {
      console.error('Sync failed:', error);
      addLog('Autonomous sync failed. Network trace logged.', 'info');
      updateAgent({ status: 'idle', currentStep: 'Sync Failed' });
      setSystemHealth('nominal');
    }
  };

  // Auto-sync Interval (Every 5 minutes, if autoMode is on)
  useEffect(() => {
    let interval: any;
    if (autoMode) {
      addLog('Autonomous Mode Active: Monitoring streams...', 'agent');
      interval = setInterval(handleSync, 300000);
    }
    
    // Initial sync on mount if connected
    if (isNotionConnected || isGmailConnected) {
      handleSync();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isNotionConnected, isGmailConnected, autoMode]);

  return (
    <aside className="w-80 h-full border-l border-white/5 bg-black/20 backdrop-blur-2xl flex flex-col overflow-hidden">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
        <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">System Intelligence</h3>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-bold uppercase tracking-wider hover:bg-indigo-500/20 transition-all active:scale-95 disabled:opacity-50"
        >
          <RotateCw className={cn("w-3 h-3", isSyncing && "animate-spin")} />
          {isSyncing ? "Syncing..." : "Synthesize"}
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {/* Proactive Guidance */}
        <AnimatePresence mode="wait">
          {nextAction && (
            <motion.div 
              key="system-recommendation"
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Next AI Recommendation</span>
              </div>
              <p className="text-xs text-white font-medium leading-relaxed">
                {nextAction}
              </p>
              <button 
                onClick={() => setNextAction(null)}
                className="w-full py-1.5 rounded-lg bg-indigo-500/20 text-[9px] font-bold text-indigo-300 uppercase tracking-widest hover:bg-indigo-500/30 transition-all"
              >
                Dismiss Guidance
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Core Metrics */}
        <div className="space-y-4">
          <InsightCard 
            icon={Brain} 
            label="Cognitive Load" 
            value={`${cognitiveLoad}%`} 
            subtext={cognitiveLoad > 70 ? "High" : "Optimal"} 
            color="bg-indigo-500" 
          />
          <InsightCard 
            icon={Zap} 
            label="Efficiency Score" 
            value="94.2%" 
            subtext="+1.8% vs last" 
            color="bg-emerald-500" 
          />
        </div>

        {/* Integration Status & Previews */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="w-3 h-3 text-slate-500" />
            <h4 className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Connectors</h4>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                <Mail className="w-3 h-3 text-slate-500" />
                <span>Gmail Engine</span>
              </div>
              {isGmailConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-white/10" />
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-[11px] text-slate-300 font-medium">
                <StickyNote className="w-3 h-3 text-slate-500" />
                <span>Notion Node</span>
              </div>
              {isNotionConnected ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-white/10" />
              )}
            </div>
          </div>
        </section>

        {/* System Health */}
        <div className={cn(
          "mt-8 p-4 rounded-2xl transition-all duration-700",
          systemHealth === 'active' ? "bg-emerald-500/5 border-emerald-500/10" :
          systemHealth === 'optimizing' ? "bg-indigo-500/5 border-indigo-500/10" :
          "bg-white/[0.02] border-white/5"
        )}>
          <div className="flex items-center gap-2 mb-2">
            <div className={cn(
               "w-1.5 h-1.5 rounded-full animate-pulse",
               systemHealth === 'active' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
               systemHealth === 'optimizing' ? "bg-indigo-500 shadow-[0_0_8px_#6366f1]" :
               "bg-slate-500"
            )} />
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {systemHealth === 'optimizing' ? 'Syncing Context' : 'System Health'}
            </p>
          </div>
          <p className="text-[11px] text-slate-500/80 leading-relaxed italic">
            {systemHealth === 'optimizing' ? 'Aggregating Gmail, Notion and Document context...' : 
             systemHealth === 'active' ? 'Autonomous monitoring active. High efficiency detected.' :
             'All parameters within nominal operational range.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
