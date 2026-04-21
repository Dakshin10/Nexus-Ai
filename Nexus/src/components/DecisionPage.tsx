import React, { useEffect, useRef, useState } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'framer-motion';
import { 
  Zap, 
  Brain, 
  RotateCw, 
  Mail, 
  StickyNote, 
  Terminal, 
  Clock, 
  Shield, 
  Activity,
  ChevronRight,
  ExternalLink,
  Cpu,
  Cloud,
  Layers,
  Inbox,
  AlertCircle,
  X,
  Database,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  LayoutDashboard
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useIntelligenceMutation } from '../services/api';
import { cn } from '../lib/utils';
import { CognitiveGraph } from './CognitiveGraph';

// --- Sub-Components ---

const NodeIcon = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'DO_NOW': return <Zap className="w-4 h-4 text-rose-400" />;
    case 'DO_NEXT': return <TrendingUp className="w-4 h-4 text-amber-400" />;
    default: return <Clock className="w-4 h-4 text-slate-400" />;
  }
};

const TaskCard = ({ task, priority }: { task: any, priority: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "p-5 rounded-3xl border transition-all hover:scale-[1.02] cursor-pointer group relative overflow-hidden",
      priority === 'DO_NOW' 
        ? "bg-rose-500/[0.03] border-rose-500/20 hover:border-rose-500/40" 
        : priority === 'DO_NEXT'
          ? "bg-amber-500/[0.03] border-amber-500/20 hover:border-amber-500/40"
          : "bg-white/[0.02] border-white/5 hover:border-white/20"
    )}
  >
    <div className="flex items-start justify-between mb-3">
      <div className={cn(
        "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
        priority === 'DO_NOW' ? "bg-rose-500/10 text-rose-500" :
        priority === 'DO_NEXT' ? "bg-amber-500/10 text-amber-500" :
        "bg-white/5 text-slate-500"
      )}>
        {priority.replace('_', ' ')}
      </div>
      <NodeIcon priority={priority} />
    </div>
    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2 leading-relaxed group-hover:text-indigo-400 transition-colors">
      {task.task}
    </h4>
    <div className="flex items-center gap-2 mt-4 p-2 rounded-xl bg-black/40 border border-white/5">
      <Brain className="w-3 h-3 text-indigo-400 shrink-0" />
      <p className="text-[10px] text-slate-400 italic font-medium leading-tight line-clamp-2">
        {task.reasoning}
      </p>
    </div>
  </motion.div>
);

const TaskColumn = ({ title, tasks, priority, icon: Icon }: any) => (
  <div className="flex-1 flex flex-col min-w-[320px] max-w-sm">
    <div className="flex items-center justify-between mb-6 px-2">
      <div className="flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-white/5")}>
          <Icon className={cn("w-4 h-4", priority === 'DO_NOW' ? "text-rose-500" : priority === 'DO_NEXT' ? "text-amber-500" : "text-slate-500")} />
        </div>
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{title}</h3>
      </div>
      <span className="text-[10px] font-black text-slate-600 bg-white/5 px-2 py-0.5 rounded-lg">{tasks.length}</span>
    </div>
    
    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
      {tasks.length > 0 ? (
        tasks.slice(0, 5).map((task: any, i: number) => (
          <TaskCard key={i} task={task} priority={priority} />
        ))
      ) : (
        <div className="h-32 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/5 bg-white/[0.01] opacity-40">
           <Inbox className="w-6 h-6 text-slate-700 mb-2" />
           <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-center px-8">
             No tasks found.<br/>Try running intelligence.
           </p>
        </div>
      )}
    </div>
  </div>
);

// --- Main Page ---

export const DecisionPage: React.FC = () => {
  const { 
    bucketedTasks, 
    logs, 
    addLog, 
    updateAgent, 
    setBucketedTasks,
    systemHealth,
    setSystemHealth,
    currentUser
  } = useNexusStore();

  const { mutateAsync: runIntelligence, isPending } = useIntelligenceMutation(currentUser.id);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunAgent = async () => {
    try {
      addLog('Initiating Cognitive Core Pipeline...', 'agent');
      setSystemHealth('optimizing');
      updateAgent({ status: 'running', currentStep: 'Thinking...' });
      
      const response = await runIntelligence();
      
      if (response.success && response.data) {
        addLog('Phase 1: Filtering complete (Removed noise)', 'success');
        addLog('Phase 2: AI extraction complete (Inferred actions)', 'success');
        addLog('Phase 3: Decision Engine finalized categories', 'success');
        
        setBucketedTasks(response.data);
        updateAgent({ status: 'idle', currentStep: 'Decisions Ready' });
        setSystemHealth('active');
      }
    } catch (error) {
      addLog('Intelligence pipeline failed. Check backend connectivity.', 'info');
      setSystemHealth('nominal');
    }
  };

  return (
    <div className="h-screen pt-16 flex flex-col bg-[#020202] text-slate-300 overflow-hidden relative font-inter">
      {/* 🧩 Header - Control Panel */}
      <header className="h-32 border-b border-white/5 flex items-center justify-between px-12 bg-black/40 backdrop-blur-3xl shrink-0 z-20">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-xl font-black text-white uppercase tracking-[.4em]">Decision Engine</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  systemHealth === 'active' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
                  systemHealth === 'optimizing' ? "bg-indigo-500 animate-pulse shadow-[0_0_8px_#6366f1]" :
                  "bg-slate-700"
                )} />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{systemHealth} Status</span>
             </div>
             <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">v2.0.0 Stable Core</p>
          </div>
        </div>

        <div className="flex gap-4">
           <button 
             onClick={handleRunAgent}
             disabled={isPending}
             className="group relative px-10 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 overflow-hidden shadow-[0_0_40px_rgba(79,70,229,0.2)]"
           >
             <div className="relative flex items-center gap-3">
               {isPending ? <RotateCw className="w-4 h-4 animate-spin text-white" /> : <Zap className="w-4 h-4 text-white fill-white" />}
               <span className="text-xs font-black text-white uppercase tracking-[0.3em]">Run Intelligence</span>
             </div>
           </button>
        </div>
      </header>

      {/* 🧩 3-Column Decision Grid */}
      <main className="flex-1 flex gap-12 px-12 py-10 overflow-hidden bg-black/20">
        <TaskColumn 
          title="Do Now" 
          priority="DO_NOW" 
          tasks={bucketedTasks.doNow} 
          icon={Zap} 
        />
        <div className="w-px h-full bg-white/5 shrink-0" />
        <TaskColumn 
          title="Do Next" 
          priority="DO_NEXT" 
          tasks={bucketedTasks.doNext} 
          icon={TrendingUp} 
        />
        <div className="w-px h-full bg-white/5 shrink-0" />
        <TaskColumn 
          title="Later" 
          priority="LATER" 
          tasks={bucketedTasks.later} 
          icon={Clock} 
        />
      </main>

      {/* 🧩 Footer - Reasoning Log */}
      <footer className="h-40 border-t border-white/5 flex flex-col bg-[#050505] shrink-0 font-mono z-20">
        <div className="px-12 h-10 border-b border-white/5 flex items-center justify-between bg-black/40">
           <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cognitive reasoning log</span>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-1.5 custom-scrollbar bg-black/20">
           <AnimatePresence mode="popLayout">
             {logs.slice(-20).map((log) => (
               <motion.div 
                 initial={{ opacity: 0, x: -5 }}
                 animate={{ opacity: 1, x: 0 }}
                 key={log.id} 
                 className="flex items-start gap-4 text-[10px] leading-relaxed group"
               >
                 <span className="text-slate-800 select-none font-bold">»</span>
                 <span className={cn(
                   "font-medium",
                   log.type === 'success' ? "text-emerald-500/80" : 
                   log.type === 'agent' ? "text-indigo-400/80" : 
                   "text-slate-600"
                 )}>
                   {log.text}
                 </span>
               </motion.div>
             ))}
           </AnimatePresence>
           <div ref={logEndRef} />
        </div>
      </footer>
    </div>
  );
};
