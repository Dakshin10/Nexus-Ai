import React from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Pause, 
  Play, 
  RotateCcw,
  Bot
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Progress } from './ui/progress';

export const AgentPanel: React.FC = () => {
  const { agent, setAgentStatus } = useNexusStore();

  if (agent.status === 'idle' && agent.progress === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-12 max-w-2xl mx-auto"
    >
      <div className="relative p-1 rounded-[2rem] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20">
        <div className="bg-[#0f0f0f] rounded-[1.9rem] p-8 backdrop-blur-3xl overflow-hidden relative">
          {/* Animated Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Bot className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight">Agent Nexus</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">{agent.status}</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setAgentStatus(agent.status === 'paused' ? 'running' : 'paused')}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all active:scale-90"
              >
                {agent.status === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              </button>
              <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 transition-all active:scale-90">
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-400 font-medium">Mission Progress</span>
                <span className="text-indigo-400 font-bold">{agent.progress}%</span>
              </div>
              <Progress value={agent.progress} className="h-1.5 bg-white/5" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-1">
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Current Step</p>
                <p className="text-sm text-slate-200 font-medium line-clamp-1">{agent.currentStep}</p>
              </div>
              
              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-1">
                <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-wider">Next Action</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-indigo-100 font-medium line-clamp-1">{agent.nextAction}</p>
                  <ArrowRight className="w-3 h-3 text-indigo-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
              Approve Execution
            </button>
            <button className="px-6 py-3 rounded-xl bg-white/5 text-slate-300 font-semibold text-sm hover:bg-white/10 transition-all active:scale-95">
              Skip
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
