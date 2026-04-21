import React, { useState, useRef } from 'react';
import { useNexusStore } from '../store/nexusStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CognitiveGraph, CognitiveGraphRef } from './CognitiveGraph';
import { 
  ArrowLeft, 
  X, 
  Share2, 
  Database,
  Zap,
  Info,
  RotateCcw,
  ZoomIn
} from 'lucide-react';
import { cn } from '../lib/utils';

export const GraphView: React.FC = () => {
  const { isGraphVisible, toggleGraph, agent, bucketedTasks } = useNexusStore();
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const graphRef = useRef<CognitiveGraphRef>(null);

  const handleBack = () => {
    setSelectedNode(null);
    toggleGraph();
  };

  const handleReset = () => {
    graphRef.current?.resetView();
  };

  return (
    <AnimatePresence>
      {isGraphVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-[#020202] flex items-center justify-center font-inter"
        >
          {/* 🧩 Header / Navigation Controls */}
          <header className="absolute top-0 left-0 w-full h-24 px-12 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-3xl z-40">
            <div className="flex items-center gap-6">
              <button 
                onClick={handleBack}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white group-hover:-translate-x-1 transition-all" />
              </button>
              <div>
                <h2 className="text-xl font-black text-white uppercase tracking-[0.3em]">Cognitive Core Map</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Sync Source: Dynamic Workspace Synthesis</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
               <button 
                onClick={handleReset}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white"
              >
                <RotateCcw className="w-4 h-4" />
                Reset View
              </button>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Active Hub</span>
              </div>
            </div>
          </header>

          {/* 🧩 Main Graph Area */}
          <div className="w-full h-full relative overflow-hidden">
             {agent.status === 'completed' && (!bucketedTasks.doNow.length && !bucketedTasks.doNext.length && !bucketedTasks.later.length) ? (
               <div className="absolute inset-0 flex flex-col items-center justify-center opacity-30 z-20 pointer-events-none">
                  <Database className="w-12 h-12 mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-center">No cognitive graph available</p>
                  <p className="text-[10px] uppercase tracking-widest mt-2">Sync workspace to generate nexus points</p>
               </div>
             ) : (
               <CognitiveGraph 
                  ref={graphRef}
                  onNodeClick={(node) => setSelectedNode(node)}
                  isSyncing={agent.status === 'running'}
               />
             )}
          </div>

          {/* 🧩 Detail Side Panel */}
          <AnimatePresence>
            {selectedNode && (
              <motion.div 
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-[450px] bg-black/90 backdrop-blur-3xl border-l border-white/10 p-12 z-50 flex flex-col shadow-[-50px_0_100px_rgba(0,0,0,0.5)]"
              >
                <div className="flex items-center justify-between mb-12">
                   <div className={cn(
                     "w-12 h-12 rounded-2xl flex items-center justify-center border",
                     selectedNode.type === 'task' ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" :
                     selectedNode.type === 'core' ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400" :
                     "bg-purple-500/10 border-purple-500/30 text-purple-400"
                   )}>
                      {selectedNode.type === 'task' ? <Zap className="w-6 h-6" /> : <Database className="w-6 h-6" />}
                   </div>
                   <button 
                     onClick={() => setSelectedNode(null)}
                     className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-slate-500 hover:text-white"
                   >
                     <X className="w-5 h-5" />
                   </button>
                </div>

                <div className="flex-1 space-y-10 overflow-y-auto custom-scrollbar pr-4">
                  <header>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 border border-white/5">
                        {selectedNode.type}
                      </span>
                      {selectedNode.priority && (
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border",
                          selectedNode.priority === 'high' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-amber-500/10 border-amber-500/20 text-amber-500"
                        )}>
                          {selectedNode.priority} Priority
                        </span>
                      )}
                    </div>
                    <h1 className="text-3xl font-black text-white leading-tight uppercase tracking-tight">
                      {selectedNode.name}
                    </h1>
                  </header>

                  <section className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Info className="w-4 h-4" />
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Cognitive Context</h4>
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium bg-white/[0.02] p-6 rounded-[1.5rem] border border-white/5 italic">
                      "{selectedNode.description || 'Integrating real-time workspace signals for decision support.'}"
                    </p>
                  </section>

                  {selectedNode.source && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Share2 className="w-4 h-4" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest">Origin Discovery</h4>
                      </div>
                      <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
                         <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                         </div>
                         <span className="text-xs font-bold text-white uppercase tracking-widest">{selectedNode.source}</span>
                      </div>
                    </section>
                  )}
                </div>

                <footer className="pt-10 border-t border-white/5">
                  <button 
                    className="w-full py-5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(79,70,229,0.2)] active:scale-95 flex items-center justify-center gap-3"
                    onClick={() => {
                       handleReset();
                       setSelectedNode(null);
                    }}
                  >
                    <ZoomIn className="w-4 h-4" />
                    Reset Perspectives
                  </button>
                </footer>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 🧩 Global Orientation Indicator */}
          <div className="absolute bottom-12 left-12 flex flex-col gap-4">
             <div className="flex items-center gap-4 px-6 py-3 rounded-full bg-black border border-white/10 backdrop-blur-3xl">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-indigo-500" />)}
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Nexus Synchronization Active</span>
             </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
