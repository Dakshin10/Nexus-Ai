import React from 'react';
import { 
  Circle, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  Plus
} from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';
import { motion, AnimatePresence } from 'framer-motion';

const TaskItem = ({ title, time, priority }: any) => (
  <div className="group flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
    <div className="flex items-center gap-4">
      <button className="text-slate-600 group-hover:text-indigo-500 transition-colors">
        <Circle className="w-5 h-5" />
      </button>
      <div>
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="w-3 h-3 text-slate-600" />
          <span className="text-[10px] text-slate-600 font-medium uppercase tracking-wider">{time}</span>
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div className={`w-1.5 h-1.5 rounded-full ${
        priority === 'high' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' :
        priority === 'medium' ? 'bg-amber-500' : 'bg-slate-700'
      }`} />
      <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
        <MoreHorizontal className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  </div>
);

const Section = ({ title, children, color }: any) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${color}`} />
        <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{title}</h4>
      </div>
      <button className="p-1 hover:bg-white/5 rounded text-slate-600 hover:text-slate-400">
        <Plus className="w-3 h-3" />
      </button>
    </div>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

export const ActionPanel: React.FC = () => {
  const { tasks } = useNexusStore();

  const doNow = tasks.filter(t => t.priority === 'high');
  const doNext = tasks.filter(t => t.priority === 'medium');
  const later = tasks.filter(t => t.priority === 'low');

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">
          <Clock className="w-6 h-6 text-slate-700" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No Actionable Tasks</p>
          <p className="text-xs text-slate-600 mt-1">Ingest data to populate intelligence.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <AnimatePresence>
        {doNow.length > 0 && (
          <Section title="Do Now" color="bg-rose-500">
            {doNow.map((task, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <TaskItem title={task.task} time={task.deadline || 'ASAP'} priority="high" />
              </motion.div>
            ))}
          </Section>
        )}

        {doNext.length > 0 && (
          <Section title="Do Next" color="bg-amber-500">
            {doNext.map((task, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <TaskItem title={task.task} time={task.deadline || 'TBD'} priority="medium" />
              </motion.div>
            ))}
          </Section>
        )}

        {later.length > 0 && (
          <Section title="Later" color="bg-slate-700">
            {later.map((task, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                <TaskItem title={task.task} time={task.deadline || 'Scheduled'} priority="low" />
              </motion.div>
            ))}
          </Section>
        )}
      </AnimatePresence>
    </div>
  );
};
