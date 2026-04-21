import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  ArrowRight, 
  ShieldAlert,
  Gauge
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface PredictionCardProps {
  title: string;
  probability: number;
  impact: "high" | "medium" | "low";
  difficulty: "easy" | "moderate" | "complex";
  nextStep: string;
  isRisk?: boolean;
}

export const PredictionCard: React.FC<PredictionCardProps> = ({
  title,
  probability,
  impact,
  difficulty,
  nextStep,
  isRisk = false,
}) => {
  const impactConfig = {
    high: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  };

  const difficultyConfig = {
    easy: "text-emerald-500",
    moderate: "text-amber-500",
    complex: "text-rose-500",
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "glass rounded-2xl p-6 border-white/5 relative overflow-hidden group transition-all duration-300",
        isRisk && "border-rose-500/30 bg-rose-500/5"
      )}
    >
      {isRisk && (
        <div className="absolute top-0 right-0 p-4">
          <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <div className="flex gap-2">
            <Badge variant="outline" className={cn("text-[10px] uppercase font-black", impactConfig[impact])}>
              {impact} IMPACT
            </Badge>
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Gauge className="w-3 h-3" />
              <span className={difficultyConfig[difficulty]}>{difficulty}</span>
            </div>
          </div>
        </div>

        {/* Probability Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-end text-xs font-bold uppercase tracking-widest">
            <span className="text-muted-foreground/60 flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3" /> Probability
            </span>
            <span className={cn(probability > 80 ? "text-emerald-500" : "text-primary")}>
              {probability}%
            </span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${probability}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn(
                "h-full transition-all duration-1000",
                isRisk ? "bg-rose-500" : "bg-primary"
              )}
            />
          </div>
        </div>

        {/* Next Step Card */}
        <div className={cn(
          "p-4 rounded-xl border border-white/5 space-y-3",
          isRisk ? "bg-rose-500/10" : "bg-white/5"
        )}>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-tighter text-muted-foreground">
            <Zap className="w-3 h-3 fill-current" /> Recommended Action
          </div>
          <p className="text-sm font-medium leading-relaxed">
            {nextStep}
          </p>
          <Button 
            className={cn(
              "w-full rounded-lg font-bold text-xs uppercase tracking-widest py-5",
              isRisk ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20" : "bg-primary shadow-primary/20",
              "shadow-lg"
            )}
          >
            Execute Action <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className={cn(
        "absolute -bottom-12 -left-12 w-32 h-32 blur-[60px] opacity-20 pointer-events-none",
        isRisk ? "bg-rose-500" : "bg-primary"
      )} />
    </motion.div>
  );
};
