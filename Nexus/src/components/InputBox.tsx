import React, { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface InputBoxProps {
  onProcess: (text: string) => void;
  isLoading: boolean;
}

export const InputBox: React.FC<InputBoxProps> = ({ onProcess, isLoading }) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onProcess(text);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-4"
    >
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-blue-500 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type everything on your mind..."
            className="min-h-[240px] text-lg bg-card/50 backdrop-blur-sm border-white/10 rounded-xl p-6 resize-none transition-all duration-300 focus:ring-0 focus:border-primary/50"
          />
          <div className="absolute bottom-4 right-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md border border-white/5">
              {text.length} characters
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading || !text.trim()}
          size="lg"
          className="rounded-full px-8 py-6 text-lg font-semibold glow-primary transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mr-2"
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          ) : (
            <ArrowRight className="mr-2 w-5 h-5" />
          )}
          {isLoading ? "Processing..." : "Process"}
        </Button>
      </div>
    </motion.div>
  );
};
