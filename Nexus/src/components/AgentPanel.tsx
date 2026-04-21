import { 
  Brain,
  Database,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const stepLabels = {
  idle: "Awaiting objective...",
  fetching: "Harvesting data from Gmail & Notion...",
  processing: "Synthesizing tasks with GPT-4o-mini...",
  deciding: "Categorizing into Nexus Decision Grid...",
  done: "Decision Engine Synced Successfully"
};

export const AgentPanel: React.FC = () => {
  const { agent } = useNexusStore();

  if (agent.status === 'idle') return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="max-w-2xl mx-auto w-full mb-12"
    >
      <div className="relative p-1 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent border border-white/5">
        <div className="bg-[#0a0a0a]/80 rounded-[2.4rem] p-10 backdrop-blur-3xl overflow-hidden relative">
          {/* Animated Background Pulse */}
          {agent.status === 'running' && (
            <motion.div 
              animate={{ opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-indigo-500/10" 
            />
          )}

          <div className="flex items-center justify-between mb-10 relative z-10">
            <div className="flex items-center gap-5">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500",
                agent.status === 'running' ? "bg-indigo-500/10 border-indigo-500/30 glow-indigo" : "bg-emerald-500/10 border-emerald-500/30"
              )}>
                {agent.status === 'running' ? (
                  <Cpu className="w-7 h-7 text-indigo-400 animate-pulse" />
                ) : (
                  <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">Cognitive Agent</h3>
                <div className="flex items-center gap-2 mt-1">
                   <div className={cn(
                     "w-1.5 h-1.5 rounded-full",
                     agent.status === 'running' ? "bg-indigo-500 animate-pulse" : "bg-emerald-500"
                   )} />
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                     {agent.status === 'running' ? 'Active Synthesis' : 'State: Synchronized'}
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 relative z-10">
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Pipeline Step</p>
                  <p className="text-sm text-slate-200 font-bold">{stepLabels[agent.step]}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-white">{agent.progress}%</span>
                </div>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${agent.progress}%` }}
                  className="h-full bg-indigo-600 rounded-full shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                />
              </div>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-4 gap-4">
               {[
                 { id: 'fetching', icon: Database, label: 'Harvest' },
                 { id: 'processing', icon: Brain, label: 'Think' },
                 { id: 'deciding', icon: Cpu, label: 'Decide' },
                 { id: 'done', icon: CheckCircle2, label: 'Output' }
               ].map((s, idx) => {
                  const isActive = agent.step === s.id;
                  const isPast = (idx === 0 && (agent.step === 'processing' || agent.step === 'deciding' || agent.step === 'done')) ||
                                (idx === 1 && (agent.step === 'deciding' || agent.step === 'done')) ||
                                (idx === 2 && (agent.step === 'done'));
                  
                  return (
                    <div key={s.id} className="flex flex-col items-center gap-2 opacity-100">
                       <div className={cn(
                         "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300",
                         isActive ? "bg-indigo-600 border-indigo-400 text-white" :
                         isPast ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                         "bg-white/5 border-white/10 text-slate-600"
                       )}>
                         <s.icon className="w-5 h-5" />
                       </div>
                       <span className={cn(
                         "text-[9px] font-black uppercase tracking-widest",
                         isActive ? "text-indigo-400" : isPast ? "text-emerald-500" : "text-slate-700"
                       )}>
                         {s.label}
                       </span>
                    </div>
                  );
               })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
