import React from "react";
import { motion } from "framer-motion";
import { Mail, User, Clock, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface GmailCardProps {
  subject: string;
  sender: string;
  priority: "high" | "medium" | "low";
  timestamp: string;
  delay?: number;
}

export const GmailCard: React.FC<GmailCardProps> = ({ 
  subject, 
  sender, 
  priority, 
  timestamp,
  delay = 0 
}) => {
  const priorityConfig = {
    high: { color: "text-rose-500 bg-rose-500/10 border-rose-500/20", label: "Urgent" },
    medium: { color: "text-amber-500 bg-amber-500/10 border-amber-500/20", label: "Attention" },
    low: { color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", label: "Routine" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="group relative glass rounded-xl p-5 border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
            <Mail className="w-4 h-4" />
          </div>
          <Badge variant="outline" className={cn("text-[10px] uppercase font-black px-2 py-0", priorityConfig[priority].color)}>
            {priorityConfig[priority].label}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 font-medium">
          <Clock className="w-3 h-3" />
          {timestamp}
        </div>
      </div>

      <h3 className="text-base font-bold mb-1 line-clamp-1 group-hover:text-white transition-colors">
        {subject}
      </h3>
      
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <User className="w-3.5 h-3.5" />
        <span className="truncate">{sender}</span>
      </div>

      <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-1 hover:underline">
          Process in Stream <AlertCircle className="w-3 h-3" />
        </button>
      </div>
    </motion.div>
  );
};
