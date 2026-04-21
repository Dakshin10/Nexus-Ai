import React from "react";
import { Progress } from "./ui/progress";
import { cn } from "@/lib/utils";
import { Brain, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CognitiveLoadBarProps {
  value: number;
}

export const CognitiveLoadBar: React.FC<CognitiveLoadBarProps> = ({ value }) => {
  const getColorClass = (val: number) => {
    if (val < 40) return "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]";
    if (val < 75) return "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    return "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]";
  };

  const getLabel = (val: number) => {
    if (val < 40) return "Optimal";
    if (val < 75) return "Demanding";
    return "Critical";
  };

  return (
    <div className="w-full space-y-3 p-6 glass rounded-2xl overflow-hidden relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("p-2 rounded-lg transition-colors duration-500", 
            value < 40 ? "bg-emerald-500/10 text-emerald-500" : 
            value < 75 ? "bg-amber-500/10 text-amber-500" : 
            "bg-rose-500/10 text-rose-500"
          )}>
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Cognitive Load</h3>
            <p className="text-xs text-muted-foreground/60">Mental bandwidth monitoring</p>
          </div>
        </div>
        <div className="text-right">
          <AnimatePresence mode="wait">
            <motion.span
              key={getLabel(value)}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={cn("text-sm font-bold", 
                value < 40 ? "text-emerald-500" : 
                value < 75 ? "text-amber-500" : 
                "text-rose-500"
              )}
            >
              {getLabel(value)}
            </motion.span>
          </AnimatePresence>
          <div className="text-2xl font-black tracking-tighter tabular-nums">
            {value}%
          </div>
        </div>
      </div>

      <div className="relative h-3 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
          className={cn("h-full transition-colors duration-500", getColorClass(value))}
        />
      </div>
      
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground/40 font-bold pt-1">
        <span>Resting</span>
        <Activity className="w-3 h-3 animate-pulse" />
        <span>Peak</span>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
    </div>
  );
};
