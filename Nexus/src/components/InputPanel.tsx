import { Sparkles, Command, ArrowRight, Bot, RotateCw } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { useNotionSync } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

type InputPanelProps = {
  onProcess?: (text: string) => Promise<void>;
};

export const InputPanel: React.FC<InputPanelProps> = ({ onProcess }) => {
  const { userInput, setUserInput, setBucketedTasks, updateAgent } = useNexusStore();
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { mutateAsync: syncWorkspace, isPending: isSyncing } = useNotionSync();

  const handleRunAgent = async () => {
    try {
      updateAgent({ status: 'running', currentStep: 'Orchestrating Workspace Sync...' });
      const result = await syncWorkspace();
      if (result.success && result.tasks) {
        setBucketedTasks(result.tasks);
        updateAgent({ status: 'idle', currentStep: 'Workspace Unified' });
        setUserInput(''); // Clear input on success
      }
    } catch (error) {
      console.error('Agent execution failed:', error);
      updateAgent({ status: 'idle', currentStep: 'Agent Failed' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (userInput.toLowerCase().trim() === 'run agent') {
        handleRunAgent();
      } else {
        console.log('Processing:', userInput);
      }
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  return (
    <section className="relative max-w-4xl mx-auto pt-10 pb-16">
      <div className={`relative group transition-all duration-700 ${isFocused ? 'scale-[1.01]' : 'scale-100'}`}>
        {/* Animated Gradient Border */}
        <div className={`absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 transition-opacity duration-700 ${isFocused ? 'opacity-100 blur-[2px]' : 'group-hover:opacity-40'}`} />
        
        {/* Input Container */}
        <div className="relative rounded-[2.5rem] bg-[#0c0c0c] border border-white/5 p-8 shadow-2xl">
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <textarea
                ref={textareaRef}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your situation, goal, or thought..."
                className="w-full bg-transparent text-xl font-medium text-white placeholder-slate-600 border-none focus:ring-0 resize-none min-h-[120px] leading-relaxed selection:bg-indigo-500/30"
              />
              
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-500">
                  <Command className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">+ ENTER TO STREAM</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <button className="px-6 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 group/btn">
                    <span>Process</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                  <button 
                    onClick={handleRunAgent}
                    disabled={isSyncing}
                    className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2 group/btn disabled:opacity-50"
                  >
                    {isSyncing ? (
                      <RotateCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                    <span>{isSyncing ? 'Running...' : 'Run Agent'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Focus Glow Overlay */}
        <AnimatePresence>
          {isFocused && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-20 bg-indigo-500/5 blur-[120px] pointer-events-none -z-10"
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
