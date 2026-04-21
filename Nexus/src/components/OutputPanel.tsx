import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  CheckCircle2, 
  Lightbulb, 
  HelpCircle, 
  Heart,
  ChevronRight,
  Star
} from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface OutputData {
  summary: string;
  tasks: string[];
  ideas: string[];
  questions: string[];
  emotions: string[];
  priorityItem?: string;
}

interface OutputPanelProps {
  data: OutputData | null;
  isLoading: boolean;
}

const Section = ({ title, icon: Icon, children, delay = 0, isOpen = true }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="space-y-4"
  >
    <div className="flex items-center gap-2 mb-2">
      <div className="p-2 rounded-lg bg-primary/10 text-primary">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{title}</h3>
    </div>
    <div className="glass rounded-xl p-5 border-white/5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-20 transition-opacity">
        <Icon className="w-12 h-12" />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  </motion.div>
);

export const OutputPanel: React.FC<OutputPanelProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-8 mt-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-20 mt-12">
      <Section title="Summary" icon={FileText} delay={0.1}>
        <p className="text-lg leading-relaxed text-foreground/90 font-medium">
          {data.summary}
        </p>
      </Section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Section title="High Priority" icon={Star} delay={0.2}>
          <div className="flex items-start gap-3 p-3 bg-primary/20 rounded-lg border border-primary/30 glow-primary">
            <Badge className="bg-primary text-white shrink-0 mt-1">TOP</Badge>
            <p className="text-base font-bold">{data.priorityItem || data.tasks[0]}</p>
          </div>
        </Section>

        <Section title="Emotions" icon={Heart} delay={0.3}>
          <div className="flex flex-wrap gap-2">
            {data.emotions.map((emotion, i) => (
              <Badge key={i} variant="secondary" className="px-3 py-1 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                {emotion}
              </Badge>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Section title="Tasks" icon={CheckCircle2} delay={0.4}>
          <ul className="space-y-3">
            {data.tasks.map((task, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <ChevronRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Ideas" icon={Lightbulb} delay={0.5}>
          <ul className="space-y-3">
            {data.ideas.map((idea, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Questions" icon={HelpCircle} delay={0.6}>
          <ul className="space-y-3">
            {data.questions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground italic">
                <span>"{q}"</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
};
