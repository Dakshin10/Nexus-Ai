import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bot, 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle2, 
  Loader2,
  ArrowRight,
  BrainCircuit
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export const AgentPage: React.FC = () => {
  const [goal, setGoal] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { title: "Initialize Environment", action: "Setting up secure sandbox for autonomous execution." },
    { title: "Research Domain", action: "Scanning knowledge base for relevant architectural patterns." },
    { title: "Draft Proposal", action: "Generating a technical implementation plan for the microservices migration." },
    { title: "Verify Compliance", action: "Checking proposal against system constraints and security protocols." },
  ];

  const handleStart = () => {
    if (goal) {
      setIsActive(true);
      setIsProcessing(true);
      setTimeout(() => setIsProcessing(false), 1500);
    }
  };

  const handleNext = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsActive(false);
        setCurrentStep(0);
        setGoal("");
      }
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="w-full max-w-2xl z-10">
        <AnimatePresence mode="wait">
          {!isActive ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-8 text-center"
            >
              <div className="inline-flex p-4 rounded-3xl bg-primary/10 text-primary mb-2">
                <Bot className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h1 className="text-4xl font-black tracking-tight">Autonomous Agent</h1>
                <p className="text-muted-foreground">What goal should I execute today?</p>
              </div>
              <div className="relative group">
                <Input
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  placeholder="e.g. Deploy a new staging environment for Nexus"
                  className="h-20 text-xl text-center bg-white/5 border-white/10 rounded-2xl focus:ring-primary focus:border-primary px-12 transition-all group-focus-within:bg-white/10"
                />
              </div>
              <Button 
                onClick={handleStart}
                disabled={!goal}
                className="rounded-full px-12 py-8 text-xl font-bold glow-primary transition-all hover:scale-105 active:scale-95"
              >
                Launch Task <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="process"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass rounded-[40px] p-12 border-white/10 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  className="h-full bg-primary glow-primary"
                />
              </div>

              <div className="mb-10 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                <span>Step {currentStep + 1} of {steps.length}</span>
                <div className="flex items-center gap-1">
                  <BrainCircuit className="w-3 h-3 text-primary" />
                  Agent Thinking
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-black tracking-tight">{steps[currentStep].title}</h2>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 italic text-muted-foreground min-h-[100px] flex items-center justify-center">
                    {isProcessing ? (
                      <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <span className="text-xs uppercase tracking-widest font-bold animate-pulse">Executing Action...</span>
                      </div>
                    ) : (
                      <p>"{steps[currentStep].action}"</p>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-12 flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 border-white/10 text-muted-foreground hover:bg-white/5"
                >
                  <Pause className="w-4 h-4 mr-2" /> Pause
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-full px-8 border-white/10 text-muted-foreground hover:bg-white/5"
                >
                  <SkipForward className="w-4 h-4 mr-2" /> Skip
                </Button>
                <Button 
                  onClick={handleNext}
                  disabled={isProcessing}
                  size="lg" 
                  className="rounded-full px-12 font-bold bg-primary hover:bg-primary/90 glow-primary"
                >
                  {currentStep === steps.length - 1 ? (
                    <>Finish <CheckCircle2 className="ml-2 w-5 h-5" /></>
                  ) : (
                    <>Approve <CheckCircle2 className="ml-2 w-5 h-5" /></>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
