import React from "react";
import { motion } from "framer-motion";
import { Zap, ArrowRight, Clock, MoreHorizontal, CheckCircle2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

interface ActionItem {
  id: string;
  title: string;
  source: string;
}

interface ActionPanelProps {
  doNow: ActionItem[];
  doNext: ActionItem[];
  later: ActionItem[];
}

const TaskCard = ({ item, color }: { item: ActionItem, color: string }) => (
  <div className="group flex items-center justify-between p-3 glass rounded-xl border-white/5 hover:border-white/20 transition-all">
    <div className="flex items-center gap-3">
      <div className={cn("w-1.5 h-8 rounded-full", color)} />
      <div>
        <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.title}</p>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{item.source}</p>
      </div>
    </div>
    <button className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/10 rounded-lg transition-all">
      <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
    </button>
  </div>
);

export const ActionPanel: React.FC<ActionPanelProps> = ({ doNow, doNext, later }) => {
  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-rose-500/10 text-rose-500">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tighter">Do Now</h3>
          </div>
          <Badge variant="outline" className="bg-rose-500/5 text-rose-500 border-rose-500/20 text-[10px]">
            {doNow.length}/2 SLOTS
          </Badge>
        </div>
        <div className="space-y-3">
          {doNow.length > 0 ? (
            doNow.map(item => <TaskCard key={item.id} item={item} color="bg-rose-500" />)
          ) : (
            <div className="p-6 border border-dashed border-white/10 rounded-xl text-center text-xs text-muted-foreground italic">
              No immediate actions. High bandwidth available.
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-500">
              <ArrowRight className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tighter">Do Next</h3>
          </div>
          <Badge variant="outline" className="bg-amber-500/5 text-amber-500 border-amber-500/20 text-[10px]">
            {doNext.length}/3 SLOTS
          </Badge>
        </div>
        <div className="space-y-3">
          {doNext.map(item => <TaskCard key={item.id} item={item} color="bg-amber-500" />)}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-500">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-tighter text-muted-foreground">Later</h3>
          </div>
          <MoreHorizontal className="w-4 h-4 text-muted-foreground/40" />
        </div>
        <div className="space-y-3 opacity-60">
          {later.map(item => <TaskCard key={item.id} item={item} color="bg-blue-500" />)}
        </div>
      </section>
    </div>
  );
};
