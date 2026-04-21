import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, 
  HelpCircle, 
  BarChart3, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Trophy
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, title: "Context", icon: Target, description: "Define the decision" },
  { id: 2, title: "Refinement", icon: HelpCircle, description: "Answer key questions" },
  { id: 3, title: "Synthesis", icon: BarChart3, description: "Final recommendation" },
];

export const DecisionPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [decision, setDecision] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const nextStep = () => {
    if (currentStep === 2) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setCurrentStep(3);
      }, 2000);
    } else {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen pt-20 px-6 max-w-5xl mx-auto pb-32">
      {/* Stepper Header */}
      <div className="flex justify-between items-center mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/5 -z-10" />
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center gap-3">
              <motion.div
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive ? "hsl(var(--primary))" : isCompleted ? "hsl(var(--primary)/0.2)" : "hsl(var(--muted)/0.2)",
                  borderColor: isActive || isCompleted ? "hsl(var(--primary))" : "hsl(var(--border))",
                }}
                className={cn(
                  "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors duration-500 bg-background z-10",
                  isActive && "glow-primary"
                )}
              >
                {isCompleted ? <Check className="w-6 h-6 text-primary" /> : <Icon className={cn("w-6 h-6", isActive ? "text-white" : "text-muted-foreground")} />}
              </motion.div>
              <div className="text-center">
                <p className={cn("text-xs font-black uppercase tracking-widest", isActive ? "text-primary" : "text-muted-foreground")}>{step.title}</p>
                <p className="text-[10px] text-muted-foreground/60 hidden md:block">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl font-black tracking-tight">What's the decision?</h2>
              <p className="text-muted-foreground">Provide the core conflict or goal you're trying to resolve.</p>
              <div className="relative">
                <Input
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  placeholder="Should I migrate the entire backend to a microservices architecture?"
                  className="h-16 text-xl bg-white/5 border-white/10 rounded-xl focus:ring-primary focus:border-primary pl-6"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 glass rounded-2xl border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                <Plus className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold">Add Option A</h3>
                <p className="text-sm text-muted-foreground">Migrate to microservices</p>
              </div>
              <div className="p-6 glass rounded-2xl border-white/5 hover:border-white/10 transition-all cursor-pointer group">
                <Plus className="w-6 h-6 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold">Add Option B</h3>
                <p className="text-sm text-muted-foreground">Optimize existing monolith</p>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-black tracking-tight">Dynamic Refinement</h2>
            <div className="space-y-6">
              {[
                "What is the primary technical debt constraint right now?",
                "How many engineers will be maintaining this in 2 years?",
                "What is the cost of failure for this migration?"
              ].map((q, i) => (
                <div key={i} className="p-6 glass rounded-2xl border-white/5 space-y-4">
                  <p className="font-bold text-lg flex items-start gap-3">
                    <span className="text-primary opacity-50">0{i+1}</span> {q}
                  </p>
                  <Input className="bg-background/50 border-white/5 rounded-lg" placeholder="Type your answer..." />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-black uppercase tracking-widest">
                <Trophy className="w-4 h-4" /> Recommendation Engine Result
              </div>
              <h2 className="text-5xl font-black tracking-tighter">Optimize Monolith</h2>
              <p className="text-muted-foreground max-w-xl mx-auto italic">
                "Based on your constraints, the risk of migration outweighs the scalability benefits at your current team size."
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Pros/Cons for Best Option */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="text-emerald-500 w-5 h-5" /> Pros
                </h3>
                <ul className="space-y-3">
                  {["Zero downtime risk", "Leverages existing expertise", "Cost-effective scaling"].map((pro, i) => (
                    <li key={i} className="flex items-center gap-3 p-4 glass rounded-xl border-emerald-500/10 text-emerald-500 font-medium">
                      <Check className="w-4 h-4" /> {pro}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingDown className="text-rose-500 w-5 h-5" /> Cons
                </h3>
                <ul className="space-y-3">
                  {["Increased build times", "Potential for code coupling", "Hardware limits"].map((con, i) => (
                    <li key={i} className="flex items-center gap-3 p-4 glass rounded-xl border-rose-500/10 text-rose-500 font-medium">
                      <div className="w-4 h-0.5 bg-rose-500" /> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-8 glass rounded-3xl border-primary/20 bg-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BarChart3 className="w-32 h-32" />
              </div>
              <h3 className="text-2xl font-black mb-6">Cognitive Scorecard</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { label: "Scalability", score: 68 },
                  { label: "Reliability", score: 92 },
                  { label: "Velocity", score: 85 },
                ].map((stat, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
                      <span>{stat.label}</span>
                      <span>{stat.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.score}%` }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="h-full bg-primary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 flex justify-between items-center">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1 || isProcessing}
          className="rounded-full px-8 border-white/10 hover:bg-white/5 disabled:opacity-0 transition-opacity"
        >
          <ArrowLeft className="mr-2 w-4 h-4" /> Back
        </Button>
        
        {currentStep < 3 && (
          <Button
            onClick={nextStep}
            disabled={isProcessing || (currentStep === 1 && !decision)}
            className="rounded-full px-12 py-6 text-lg font-bold glow-primary transition-all hover:scale-105"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>Next <ArrowRight className="ml-2 w-5 h-5" /></>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn("animate-spin", className)}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
