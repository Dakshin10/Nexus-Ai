import React from 'react';
import { 
  Zap, 
  Activity, 
  Clock, 
  ChevronRight, 
  Circle,
  Inbox,
  Sparkles,
  RotateCw,
  Mail,
  StickyNote,
  ExternalLink
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const PriorityHeader = ({ icon: Icon, title, count, color }: any) => (
  <div className="flex items-center justify-between px-2 mb-4">
    <div className="flex items-center gap-2.5">
      <div className={cn("p-1.5 rounded-lg bg-opacity-10", color.bg, color.text)}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h4 className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", color.text)}>
        {title}
      </h4>
    </div>
    <span className="text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
      {count}
    </span>
  </div>
);

const SourceIcon = ({ source }: { source: string }) => {
  switch (source?.toLowerCase()) {
    case 'gmail': return <Mail className="w-3 h-3" />;
    case 'notion': return <StickyNote className="w-3 h-3" />;
    default: return <Circle className="w-3 h-3" />;
  }
};

const TaskItem = ({ task, isUrgent }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ x: 4 }}
    className={cn(
      "group p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all cursor-pointer relative overflow-hidden",
      isUrgent && "border-rose-500/20 bg-rose-500/[0.02]"
    )}
  >
    {isUrgent && (
      <div className="absolute inset-0 bg-rose-500/5 animate-pulse-slow pointer-events-none" />
    )}
    
    <div className="flex gap-5">
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-white/5 text-slate-500">
              <SourceIcon source={task.source} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              {task.source || 'Stream'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
            <Clock className="w-3 h-3" />
            <span>{task.deadline || 'ASAP'}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors leading-snug">
          {task.task}
        </h3>
        
        {task.reasoning && (
          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
            {task.reasoning}
          </p>
        )}
        
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
            <Activity className="w-3 h-3" />
            <span className="capitalize">{task.type || 'Action'}</span>
          </div>
          {task.author && (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-600 italic">
              <span>via {task.author}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all">
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </div>
  </motion.div>
);

export const ActionPipeline: React.FC = () => {
  const { bucketedTasks, agent } = useNexusStore();
  const isSyncing = agent.status === 'running';

  const sections = [
    {
      id: 'doNow',
      title: 'Do Now',
      tasks: bucketedTasks.doNow,
      icon: Zap,
      color: { text: 'text-rose-400', bg: 'bg-rose-400' },
      urgent: true
    },
    {
      id: 'doNext',
      title: 'Do Next',
      tasks: bucketedTasks.doNext,
      icon: Sparkles,
      color: { text: 'text-amber-400', bg: 'bg-amber-400' },
      urgent: false
    },
    {
      id: 'later',
      title: 'Later',
      tasks: bucketedTasks.later,
      icon: Clock,
      color: { text: 'text-sky-400', bg: 'bg-sky-400' },
      urgent: false
    }
  ];

  const totalTasks = sections.reduce((acc, s) => acc + s.tasks.length, 0);

  if (isSyncing && totalTasks === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <RotateCw className="w-8 h-8 text-indigo-500 animate-spin" />
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Synthesizing Actions...</p>
      </div>
    );
  }

  if (totalTasks === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6">
          <Inbox className="w-6 h-6 text-slate-700" />
        </div>
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Workspace Synthesized</h4>
        <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
          No actionable tasks detected in your current Gmail or Notion streams. 
          Use the "Synthesize" button to trigger a fresh scan.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-8 custom-scrollbar space-y-16">
      {sections.map((section) => (
        section.tasks.length > 0 && (
          <section key={section.id} className="space-y-4">
            <PriorityHeader 
              icon={section.icon} 
              title={section.title} 
              count={section.tasks.length}
              color={section.color}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {section.tasks.map((task, idx) => (
                  <TaskItem 
                    key={`${task.nexus_id || idx}-${section.id}`} 
                    task={task} 
                    isUrgent={section.urgent}
                  />
                ))}
              </AnimatePresence>
            </div>
          </section>
        )
      ))}
    </div>
  );
};
