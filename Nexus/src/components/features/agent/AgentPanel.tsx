import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, SkipForward, Pause, BrainCircuit, Play, Trophy } from "lucide-react";
import { useNexusStore } from "../../../store/nexusStore";
import { cn } from "@/lib/utils";

export const AgentPanel: React.FC = () => {
  const { agentStatus, agentSteps, currentStepIndex, advanceAgentStep, resetAgent, setAgentStatus } = useNexusStore();

  if (agentStatus === "idle") return null;

  const current = agentSteps[currentStepIndex];
  const progress = ((currentStepIndex) / agentSteps.length) * 100;
  const isDone = agentStatus === "done";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl border-primary/20 border overflow-hidden"
    >
      {/* Progress strip */}
      <div className="h-0.5 w-full bg-white/5">
        <motion.div
          animate={{ width: isDone ? "100%" : `${progress}%` }}
          transition={{ type: "spring", stiffness: 60 }}
          className={cn("h-full", isDone ? "bg-emerald-500" : "bg-primary")}
        />
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            <BrainCircuit className="w-3.5 h-3.5 text-primary" />
            Agent Engine
            <span className={cn(
              "px-2 py-0.5 rounded-full text-[9px] font-black",
              agentStatus === "running" ? "bg-primary/20 text-primary" :
              agentStatus === "paused" ? "bg-amber-500/20 text-amber-500" :
              "bg-emerald-500/20 text-emerald-500"
            )}>
              {agentStatus.toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-muted-foreground/40 tabular-nums">
            {isDone ? agentSteps.length : currentStepIndex + 1} / {agentSteps.length}
          </span>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-6 gap-3 text-center"
            >
              <Trophy className="w-10 h-10 text-emerald-500" />
              <p className="font-black text-lg">Mission Complete</p>
              <p className="text-sm text-muted-foreground">All steps executed successfully.</p>
              <button
                onClick={resetAgent}
                className="mt-2 px-6 py-2 rounded-full bg-white/10 text-sm font-bold hover:bg-white/20 transition-colors"
              >
                Reset Agent
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentStepIndex}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="space-y-4"
            >
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Current Step</p>
                <h3 className="text-xl font-black">{current?.title}</h3>
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/5 italic text-muted-foreground text-sm leading-relaxed">
                "{current?.action}"
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        {!isDone && (
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setAgentStatus(agentStatus === "paused" ? "running" : "paused")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors"
            >
              {agentStatus === "paused" ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              {agentStatus === "paused" ? "Resume" : "Pause"}
            </button>
            <button
              onClick={advanceAgentStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass border border-white/10 text-xs font-bold hover:bg-white/10 transition-colors"
            >
              <SkipForward className="w-3.5 h-3.5" /> Skip
            </button>
            <button
              onClick={advanceAgentStep}
              disabled={agentStatus === "paused"}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-xs font-bold disabled:opacity-40 hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              {currentStepIndex === agentSteps.length - 1 ? "Complete" : "Approve"}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};
