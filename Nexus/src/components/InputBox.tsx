import React from 'react';
import { Send, Bot, Loader2, Zap } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';

interface InputBoxProps {
  onProcess?: (text: string) => Promise<void>;
  isLoading?: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onProcess, isLoading: externalLoading }) => {
  const { userInput, setUserInput, runAgent, agent } = useNexusStore();
  const isLoading = externalLoading || agent.status === 'running';

  const handleRunAgent = async () => {
    if (!userInput) return;
    await runAgent();
  };

  return (
    <div className="relative group max-w-4xl mx-auto w-full">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-[2rem] blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
      
      <div className="relative bg-[#0a0a0a]/60 border border-white/5 rounded-[1.9rem] p-6 backdrop-blur-3xl shadow-2xl">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="State your objective... (e.g. 'Optimize my morning pipeline')"
          className="w-full bg-transparent border-none focus:ring-0 text-2xl font-black placeholder:text-slate-800 text-white resize-none h-40 custom-scrollbar"
        />
        
        <div className="flex items-center justify-between mt-6">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Cognitive Core Active</span>
             </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleRunAgent}
              disabled={agent.status === 'running' || !userInput}
              className="group relative flex items-center gap-3 px-10 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_40px_rgba(79,70,229,0.2)] active:scale-95 disabled:opacity-30 disabled:grayscale overflow-hidden"
            >
              <div className="relative flex items-center gap-3 z-10">
                {agent.status === 'running' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-white" />}
                <span className="text-xs font-black uppercase tracking-[0.3em]">Run Agent</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
