import React from 'react';
import { Send, Bot, Loader2 } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useStreamMutation, useAgentMutation } from '../services/api';

export const InputBox: React.FC = () => {
  const { userInput, setUserInput, updateAgent } = useNexusStore();
  const stream = useStreamMutation();
  const agent = useAgentMutation();

  const handleProcess = async () => {
    if (!userInput) return;
    stream.mutate(userInput);
  };

  const handleRunAgent = async () => {
    if (!userInput) return;
    updateAgent({ status: 'running', currentStep: 'Initializing Agent...', progress: 5 });
    agent.mutate(userInput);
  };

  return (
    <div className="relative group">
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
      
      <div className="relative bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="What do you want to achieve?"
          className="w-full bg-transparent border-none focus:ring-0 text-xl font-light placeholder:text-slate-600 resize-none h-32"
        />
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            <button
              onClick={handleProcess}
              disabled={stream.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 transition-all border border-white/5 active:scale-95 disabled:opacity-50"
            >
              {stream.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="text-sm font-medium">Process</span>
            </button>

            <button
              onClick={handleRunAgent}
              disabled={agent.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50"
            >
              {agent.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
              <span className="text-sm font-medium">Run Agent</span>
            </button>
          </div>
          
          <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest hidden sm:block">
            Press CMD+Enter to quick process
          </div>
        </div>
      </div>
    </div>
  );
};
