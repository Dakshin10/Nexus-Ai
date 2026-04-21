import React, { useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence 
} from 'framer-motion';
import { 
  Zap, 
  Clock, 
  Terminal, 
  Cpu,
  Inbox,
  TrendingUp,
  Brain,
  RotateCw
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { cn } from '../lib/utils';
import { AgentPanel } from './AgentPanel';

// --- Sub-Components ---

const TaskCard = ({ task, priority }: { task: any, priority: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className={cn(
      "p-5 rounded-2xl border transition-all hover:border-white/20 relative group overflow-hidden bg-zinc-900/50",
      priority === 'DO_NOW' ? "border-rose-500/10" : 
      priority === 'DO_NEXT' ? "border-amber-500/10" : 
      "border-white/5"
    )}
  >
    <div className="flex items-start justify-between mb-3">
       <h4 className="text-sm font-bold text-slate-100 leading-relaxed group-hover:text-indigo-400 transition-colors line-clamp-2">
         {task.task}
       </h4>
    </div>
    
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
        <div className={cn(
          "w-1 h-1 rounded-full",
          task.source === 'gmail' ? "bg-red-400" : "bg-blue-400"
        )} />
        <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">
          {task.source}
        </span>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
         <Brain className="w-3.5 h-3.5 text-slate-700" title={task.reasoning} />
      </div>
    </div>
  </motion.div>
);

const TaskColumn = ({ title, tasks, priority, icon: Icon }: any) => (
  <div className="flex-1 flex flex-col min-w-[300px]">
    <div className="flex items-center gap-3 mb-6 px-2">
      <div className={cn(
        "w-8 h-8 rounded-lg flex items-center justify-center bg-white/5",
        priority === 'DO_NOW' ? "text-rose-500" : priority === 'DO_NEXT' ? "text-amber-500" : "text-slate-500"
      )}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">{title}</h3>
      <span className="ml-auto text-[10px] font-bold text-slate-600 bg-white/5 px-2 py-0.5 rounded-lg">
        {tasks?.length || 0}
      </span>
    </div>
    
    <div className="space-y-4">
      {tasks && tasks.length > 0 ? (
        tasks.map((task: any, i: number) => (
          <TaskCard key={i} task={task} priority={priority} />
        ))
      ) : (
        <div className="h-40 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/5 bg-white/[0.01] opacity-20 group">
           <Inbox className="w-5 h-5 text-slate-700 mb-2 group-hover:bg-indigo-500 transition-colors" />
           <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Awaiting Decision</p>
        </div>
      )}
    </div>
  </div>
);

// --- Main Page ---

export const DecisionPage: React.FC = () => {
  const { 
    agent, 
    runAgent, 
    bucketedTasks, 
    logs,
    systemHealth
  } = useNexusStore();

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-screen pt-16 flex flex-col bg-[#020202] text-slate-300 overflow-hidden relative font-inter">
      {/* 🧩 Header - Unified Dashboard Control */}
      <header className="h-28 border-b border-white/5 flex items-center justify-between px-12 bg-black/40 backdrop-blur-3xl shrink-0 z-20">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <Cpu className="w-3.5 h-3.5 text-white" />
            </div>
            <h2 className="text-lg font-black text-white uppercase tracking-[.4em]">Decision Engine</h2>
          </div>
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-1">
            {systemHealth} Workspace Synchronization
          </p>
        </div>

        <button 
          onClick={() => runAgent()}
          disabled={agent.status === 'running'}
          className="group relative px-10 py-4 rounded-full bg-white text-black hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.1)]"
        >
          <div className="relative flex items-center gap-3">
            {agent.status === 'running' ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 fill-black" />
            )}
            <span className="text-xs font-black uppercase tracking-[0.2em]">Run Agent</span>
          </div>
        </button>
      </header>

      {/* 🧩 Agent Execution View */}
      <div className="shrink-0 transition-all duration-500 overflow-hidden px-12 pt-8">
         <AgentPanel />
      </div>

      {/* 🧩 3-Column Decision Grid */}
      <main className="flex-1 px-12 pb-12 overflow-y-auto custom-scrollbar">
        {agent.status === 'completed' && (!bucketedTasks.doNow.length && !bucketedTasks.doNext.length && !bucketedTasks.later.length) ? (
          <div className="h-full flex flex-col items-center justify-center opacity-30">
             <Inbox className="w-12 h-12 mb-4" />
             <p className="text-xs font-black uppercase tracking-widest text-center">No actionable tasks found in this cycle.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <TaskColumn 
              title="Do Now" 
              priority="DO_NOW" 
              tasks={bucketedTasks.doNow} 
              icon={Zap} 
            />
            <TaskColumn 
              title="Do Next" 
              priority="DO_NEXT" 
              tasks={bucketedTasks.doNext} 
              icon={TrendingUp} 
            />
            <TaskColumn 
              title="Later" 
              priority="LATER" 
              tasks={bucketedTasks.later} 
              icon={Clock} 
            />
          </div>
        )}
      </main>

      {/* 🧩 Footer - Logs */}
      <footer className="h-32 border-t border-white/5 flex flex-col bg-[#050505] shrink-0 font-mono z-20">
        <div className="px-12 h-8 border-b border-white/5 flex items-center bg-black/40">
           <Terminal className="w-3 h-3 text-indigo-500 mr-2" />
           <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">System Pipeline Logs</span>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar bg-black/10">
           <AnimatePresence mode="popLayout">
             {logs.slice(-15).map((log) => (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 key={log.id} 
                 className="flex items-center gap-3 text-[10px]"
               >
                 <span className="text-slate-800 font-black">❯</span>
                 <span className={cn(
                   "font-medium",
                   log.type === 'success' ? "text-emerald-500" : 
                   log.type === 'agent' ? "text-indigo-400" : 
                   "text-slate-500"
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
