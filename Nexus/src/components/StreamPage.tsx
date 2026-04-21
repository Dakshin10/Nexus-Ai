import React, { useState } from "react";
import { InputBox } from "./InputBox";
import { OutputPanel } from "./OutputPanel";
import { CognitiveLoadBar } from "./CognitiveLoadBar";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

export const StreamPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [cognitiveLoad, setCognitiveLoad] = useState(24);

  const handleProcess = async (text: string) => {
    setIsLoading(true);
    setResults(null);
    
    // Simulate API call to /stream
    try {
      // In a real app: await fetch('/stream', { method: 'POST', body: JSON.stringify({ text }) })
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResponse = {
        summary: "You're feeling overwhelmed by the upcoming Nexus launch, primarily focused on the frontend implementation and integration with external data sources like Gmail and Notion.",
        tasks: [
          "Implement the Stream Engine UI components",
          "Connect to the /stream API endpoint",
          "Design the cognitive load visualization",
          "Set up Framer Motion for progressive reveal"
        ],
        ideas: [
          "Use glassmorphism for the output sections to maintain a premium feel",
          "Implement a 'Focus Mode' that hides everything but the textarea",
          "Add haptic feedback simulation on button press"
        ],
        questions: [
          "How will we handle real-time streaming of text from the LLM?",
          "What's the optimal color palette for long-term cognitive focus?"
        ],
        emotions: ["Focused", "Determined", "Slightly Anxious", "Ambitious"],
        priorityItem: "Finalize the premium design tokens in index.css"
      };

      setResults(mockResponse);
      setCognitiveLoad(prev => Math.min(prev + Math.floor(Math.random() * 30), 100));
    } catch (error) {
      console.error("Failed to process stream:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-6 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4 border border-primary/20"
        >
          <Sparkles className="w-3 h-3" />
          Engine Active
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black tracking-tighter mb-4 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent"
        >
          Stream Engine
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-lg max-w-2xl mx-auto"
        >
          Offload your thoughts. Nexus will decompose, categorize, and prioritize your mental stream in real-time.
        </motion.p>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-8">
          <InputBox onProcess={handleProcess} isLoading={isLoading} />
          
          <AnimatePresence>
            {(results || isLoading) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <OutputPanel data={results} isLoading={isLoading} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="lg:col-span-4 sticky top-24">
          <div className="space-y-6">
            <CognitiveLoadBar value={cognitiveLoad} />
            
            <div className="glass rounded-2xl p-6 border-white/5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Session Stats</h4>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-muted-foreground/60">Thoughts Captured</span>
                  <span className="text-xl font-bold">{results ? "12" : "0"}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm text-muted-foreground/60">Active Agents</span>
                  <span className="text-xl font-bold text-primary">04</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-sm text-muted-foreground/60">Processing Latency</span>
                  <span className="text-xl font-bold text-emerald-500">240ms</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
