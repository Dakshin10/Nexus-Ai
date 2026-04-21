import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Bot, Sparkles, Loader2 } from "lucide-react";
import { useNexusStore } from "../../../store/nexusStore";
import { mockStreamResponse, mockAgentSteps } from "../../../services/api";

export const InputBox: React.FC = () => {
  const { 
    userInput, setUserInput, 
    setStreamOutput, setStreamLoading, isStreamLoading,
    setAgentSteps, setActivePanel
  } = useNexusStore();
  const [isAgentLoading, setIsAgentLoading] = useState(false);

  const handleProcess = async () => {
    if (!userInput.trim()) return;
    setStreamLoading(true);
    setStreamOutput(null);
    const result = await mockStreamResponse(userInput);
    setStreamOutput(result);
    setStreamLoading(false);
    setActivePanel("stream");
  };

  const handleRunAgent = async () => {
    if (!userInput.trim()) return;
    setIsAgentLoading(true);
    const result = await mockAgentSteps(userInput);
    setAgentSteps(result.steps);
    setIsAgentLoading(false);
    setActivePanel("agent");
  };

  return (
    <div className="w-full space-y-3">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-all duration-500" />
        <div className="relative flex items-center gap-3 glass rounded-2xl px-5 py-4 border-white/10">
          <Sparkles className="w-5 h-5 text-primary shrink-0 opacity-60" />
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleProcess()}
            placeholder="What do you want to achieve?"
            className="flex-1 bg-transparent text-lg font-medium placeholder:text-muted-foreground/40 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleProcess}
          disabled={isStreamLoading || !userInput.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary font-bold text-sm text-white transition-all disabled:opacity-40 hover:brightness-110 shadow-lg shadow-primary/20"
        >
          {isStreamLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
          {isStreamLoading ? "Processing..." : "Process"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleRunAgent}
          disabled={isAgentLoading || !userInput.trim()}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl glass border border-white/10 font-bold text-sm transition-all disabled:opacity-40 hover:bg-white/10"
        >
          {isAgentLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Bot className="w-4 h-4 text-primary" />
          )}
          {isAgentLoading ? "Launching..." : "Run Agent"}
        </motion.button>
      </div>
    </div>
  );
};
