import React from "react";
import { PredictionCard } from "./PredictionCard";
import { motion } from "framer-motion";
import { Telescope, RefreshCcw, Filter } from "lucide-react";
import { Button } from "./ui/button";

export const PredictionPage: React.FC = () => {
  const predictions = [
    {
      title: "Dependency Conflict in Production",
      probability: 85,
      impact: "high" as const,
      difficulty: "complex" as const,
      nextStep: "Roll back the last deployment and isolate the version mismatch in the peer dependency tree.",
      isRisk: true,
    },
    {
      title: "API Rate Limit Exhaustion",
      probability: 42,
      impact: "medium" as const,
      difficulty: "moderate" as const,
      nextStep: "Implement the exponential backoff strategy in the request orchestrator to prevent 429 errors.",
    },
    {
      title: "New User Influx",
      probability: 92,
      impact: "high" as const,
      difficulty: "easy" as const,
      nextStep: "Provision 2 additional worker nodes to handle the projected traffic spike from the social campaign.",
    }
  ];

  return (
    <div className="min-h-screen pt-20 px-6 max-w-7xl mx-auto pb-24">
      <header className="mb-12">
        <div className="flex justify-between items-end">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2"
            >
              <Telescope className="w-3 h-3" /> Predictive Intelligence
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-tighter"
            >
              Predictions
            </motion.h1>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" className="rounded-full border-white/10 hover:bg-white/5">
              <RefreshCcw className="w-4 h-4 mr-2" /> Recalculate
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {predictions.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <PredictionCard {...p} />
          </motion.div>
        ))}

        <button className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-3xl hover:border-primary/20 hover:bg-primary/5 transition-all group min-h-[300px]">
          <div className="p-4 rounded-full bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
            <Telescope className="w-8 h-8" />
          </div>
          <p className="mt-4 font-bold text-muted-foreground group-hover:text-white transition-colors">Monitor New Variable</p>
          <p className="text-xs text-muted-foreground/60 text-center mt-2 max-w-[200px]">
            Add a custom data stream to feed the predictive engine.
          </p>
        </button>
      </div>
    </div>
  );
};
