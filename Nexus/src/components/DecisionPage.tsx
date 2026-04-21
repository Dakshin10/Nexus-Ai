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
  ArrowRight
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useNotionSync } from '../services/api';
import { cn } from '../lib/utils';
import { CognitiveGraph } from './CognitiveGraph';

// --- Sub-Components ---

const NodeIcon = ({ source }: { source: string }) => {
  switch (source?.toLowerCase()) {
    case 'gmail': return <Mail className="w-4 h-4 text-rose-400" />;
    case 'notion': return <StickyNote className="w-4 h-4 text-emerald-400" />;
    default: return <Database className="w-4 h-4 text-indigo-400" />;
  }
};

const InputNode = ({ icon: Icon, label, status, color }: any) => (
  <div className="flex items-center gap-4 group">
    <div className={cn(
      "w-10 h-10 rounded-xl border border-white/5 bg-white/[0.02] flex items-center justify-center transition-all group-hover:border-white/20 group-hover:bg-white/5",
      status === 'active' && `border-${color}-500/30 bg-${color}-500/10`
    )}>
      <Icon className={cn("w-5 h-5", status === 'active' ? `text-${color}-400` : "text-slate-600")} />
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">{label}</p>
      <div className="flex items-center gap-1.5">
        <div className={cn("w-1 h-1 rounded-full", status === 'active' ? `bg-${color}-400 shadow-[0_0_4px]` : "bg-slate-700")} />
        <span className="text-[8px] font-medium text-slate-600 uppercase tracking-tighter">{status}</span>
      </div>
    </div>
  </div>
);

// --- Main Page ---

export const DecisionPage: React.FC = () => {
  const { 
    bucketedTasks, 
    logs, 
    addLog, 
    autoMode, 
    toggleAutoMode, 
    updateAgent, 
    setBucketedTasks,
    setNextAction,
    systemHealth,
    setSystemHealth
  } = useNexusStore();

  const { mutateAsync: syncWorkspace, isPending: isSyncing } = useNotionSync();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleRunAgent = async () => {
    try {
      addLog('Initiating workspace synthesis...', 'info');
      setSystemHealth('optimizing');
      updateAgent({ status: 'running', currentStep: 'Thinking...' });
      
      addLog('Fetching Gmail priority stream...', 'agent');
      addLog('Accessing Notion workspace nodes...', 'agent');
      
      const result = await syncWorkspace();
      
      if (result.success && result.bucketedTasks) {
        addLog('AI extraction complete. Context mapped.', 'success');
        addLog(`Processed ${result.stats.total_tasks_extracted} tasks across ${result.stats.emails_scanned + result.stats.pages_scanned} nodes.`, 'info');
        
        setBucketedTasks(result.bucketedTasks);
        setNextAction(result.nextAction || null);
        updateAgent({ status: 'idle', currentStep: 'Synthesis Complete' });
        setSystemHealth('active');
        addLog('Decision Engine pipeline updated.', 'success');
      }
    } catch (error) {
      addLog('Orchestration failed. Check connectivity.', 'info');
      setSystemHealth('nominal');
    }
  };

  return (
    <div className="h-screen pt-16 flex flex-col bg-[#020202] text-slate-300 overflow-hidden relative">
      {/* 🧩 Header - Control Panel */}
      <header className="h-20 border-b border-white/5 flex items-center justify-between px-8 bg-black/40 backdrop-blur-3xl shrink-0 z-20">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-500" />
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Decision Engine</h2>
            </div>
            <p className="text-[10px] text-slate-500 font-medium uppercase tracking-[0.1em] mt-0.5">Cognitive Operating System v1.1.0</p>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Autonomous Mode</span>
              <button 
                onClick={toggleAutoMode}
                className={cn(
                  "w-10 h-5 rounded-full transition-all relative p-1",
                  autoMode ? "bg-indigo-600 shadow-[0_0_12px_rgba(79,70,229,0.5)]" : "bg-white/10"
                )}
              >
                <motion.div 
                  animate={{ x: autoMode ? 20 : 0 }}
                  className="w-3 h-3 rounded-full bg-white shadow-sm" 
                />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Core Status</span>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  systemHealth === 'active' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
                  systemHealth === 'optimizing' ? "bg-indigo-500 animate-pulse shadow-[0_0_8px_#6366f1]" :
                  "bg-slate-700"
                )} />
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-tighter">{systemHealth}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleRunAgent}
          disabled={isSyncing}
          className="group relative px-8 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
          <div className="relative flex items-center gap-2.5">
            {isSyncing ? <RotateCw className="w-4 h-4 animate-spin text-white" /> : <Zap className="w-4 h-4 text-white fill-white" />}
            <span className="text-xs font-black text-white uppercase tracking-[0.2em]">Run Agent</span>
          </div>
        </button>
      </header>

      {/* 🧩 Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left: Input Stream */}
        <aside className="w-72 border-r border-white/5 p-6 flex flex-col shrink-0 z-10 bg-[#020202]">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Knowledge Hubs</h4>
            <Shield className="w-3.5 h-3.5 text-slate-700" />
          </div>
          
          <div className="space-y-8">
            <InputNode icon={Cloud} label="Gmail Priority" status="active" color="rose" />
            <InputNode icon={Layers} label="Notion Workspace" status="active" color="emerald" />
            <InputNode icon={Terminal} label="NEXUS Local Cli" status="active" color="indigo" />
          </div>

          <div className="mt-auto p-4 rounded-2xl border border-dashed border-white/5 bg-white/[0.01]">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2 text-center">Sync Matrix</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-1 bg-indigo-500/20 rounded-full overflow-hidden">
                <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="w-1/2 h-full bg-indigo-500" />
              </div>
              <div className="h-1 bg-rose-500/20 rounded-full overflow-hidden">
                <motion.div animate={{ x: ['100%', '-100%'] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1/2 h-full bg-rose-500" />
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Cognitive Graph Engine */}
        <section className="flex-1 relative overflow-hidden bg-black">
          <CognitiveGraph 
            isSyncing={isSyncing} 
            onNodeClick={(node) => {
              setSelectedNode(node);
              addLog(`Inspecting node: ${node.label}`, 'info');
            }} 
          />
          
          {/* Side Detail Panel (Framer Motion) */}
          <AnimatePresence>
            {selectedNode && (
              <motion.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                className="absolute top-4 right-4 bottom-4 w-96 glass-dark border border-white/10 rounded-3xl shadow-2xl z-30 p-8 flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center p-2" style={{ backgroundColor: `${selectedNode.color}22`, border: `1px solid ${selectedNode.color}44` }}>
                      <NodeIcon source={selectedNode.source || selectedNode.id} />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-sm uppercase tracking-widest">{selectedNode.label}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{selectedNode.type} Node</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedNode(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X className="w-4 h-4 text-slate-500" />
                  </button>
                </div>

                <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-2">
                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Metadata</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System ID</span>
                        <span className="text-[10px] font-mono text-slate-300">{selectedNode.id}</span>
                      </div>
                      {selectedNode.source && (
                        <div className="flex justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Source Origin</span>
                          <span className="text-[10px] font-bold text-indigo-400 uppercase">{selectedNode.source}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedNode.reasoning && (
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">AI Reasoning Transcript</h4>
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 italic">
                        <p className="text-xs text-slate-400 leading-relaxed">
                           "{selectedNode.reasoning}"
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Action Controls</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all group">
                         <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                         <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest whitespace-nowrap">Mark Complete</span>
                      </button>
                      <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                         <ArrowRight className="w-5 h-5 text-slate-400 group-hover:scale-110 transition-transform" />
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Move Priority</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                   <button className="w-full py-4 rounded-2xl bg-indigo-600 text-xs font-black text-white uppercase tracking-[0.2em] hover:bg-indigo-500 transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] flex items-center justify-center gap-3">
                     Open Primary Source <ExternalLink className="w-4 h-4" />
                   </button>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Graph Legend Overlay */}
          <div className="absolute bottom-6 left-6 p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl space-y-2 pointer-events-none">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e]" />
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Critical Path</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b]" />
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Secondary Flow</span>
             </div>
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]" />
               <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">AI Core Hub</span>
             </div>
          </div>
        </section>

        {/* Right: Condensed Action Pipeline (Mini-mode) */}
        {!selectedNode && (
          <aside className="w-96 border-l border-white/5 flex flex-col overflow-hidden shrink-0 z-10 bg-[#020202]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-black/20">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Target Pipeline</h4>
              </div>
              <div className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-bold text-emerald-400 uppercase">Live</div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-10 custom-scrollbar">
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em]">Do Now</span>
                  <span className="text-[10px] text-slate-700 font-bold">{bucketedTasks.doNow.length}</span>
                </div>
                <div className="space-y-4">
                  {bucketedTasks.doNow.slice(0, 3).map((task, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-xl bg-rose-500/[0.03] border border-rose-500/10 hover:border-rose-500/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] font-black text-rose-400 tracking-tighter uppercase">{task.source}</span>
                        <Clock className="w-3 h-3 text-slate-600" />
                      </div>
                      <p className="text-xs font-bold text-slate-200 line-clamp-1 mb-1 group-hover:text-white">{task.task}</p>
                      <p className="text-[10px] text-slate-600 line-clamp-1">{task.reasoning}</p>
                    </motion.div>
                  ))}
                </div>
              </section>

              <section className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.2em]">Do Next</span>
                  <span className="text-[10px] text-slate-700 font-bold">{bucketedTasks.doNext.length}</span>
                </div>
                <div className="space-y-4">
                  {bucketedTasks.doNext.slice(0, 3).map((task, i) => (
                    <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
                      <NodeIcon source={task.source} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-slate-300 line-clamp-1 leading-tight">{task.task}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            
            <div className="p-6 bg-black/40 border-t border-white/5">
              <button className="w-full py-3 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                Explore Full Pipeline <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </aside>
        )}
      </main>

      {/* 🧩 Footer - Reasoning Log */}
      <footer className="h-44 border-t border-white/5 flex flex-col bg-[#080808] shrink-0 font-mono z-20">
        <div className="px-6 h-8 border-b border-white/5 flex items-center justify-between bg-black/40">
           <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-slate-600" />
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">System Reasoning Log</span>
           </div>
           <div className="flex gap-4">
             <div className="flex items-center gap-1.5 grayscale opacity-50">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[8px] font-bold text-slate-500 uppercase">Input Node OK</span>
             </div>
             <div className="flex items-center gap-1.5 grayscale opacity-50">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
               <span className="text-[8px] font-bold text-slate-500 uppercase">AI Core OK</span>
             </div>
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1.5 custom-scrollbar bg-black/40">
           <AnimatePresence mode="popLayout">
             {logs.map((log) => (
               <motion.div 
                 initial={{ opacity: 0, x: -10 }}
                 animate={{ opacity: 1, x: 0 }}
                 key={log.id} 
                 className="flex items-start gap-4 text-[10px] leading-relaxed group"
               >
                 <span className="text-slate-700 select-none">[{log.timestamp}]</span>
                 <span className={cn(
                   "font-medium",
                   log.type === 'success' ? "text-emerald-500/80" : 
                   log.type === 'agent' ? "text-indigo-400/80" : 
                   "text-slate-500"
                 )}>
                   {log.type === 'agent' && <span className="mr-2">⚡</span>}
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
