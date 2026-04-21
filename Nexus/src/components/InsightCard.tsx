import React from 'react';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';
import { useNexusStore } from '../store/nexusStore';

const InsightItem = ({ icon: Icon, label, value, color }: any) => (
  <div className="flex-1 p-6 rounded-3xl bg-white/[0.03] border border-white/5 relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 blur-[40px] -mr-16 -mt-16 group-hover:opacity-10 transition-opacity`} />
    
    <div className="flex items-center gap-4 mb-4">
      <div className="p-2.5 rounded-xl bg-white/5 text-slate-400">
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
    </div>
    
    <div className="text-2xl font-bold text-white tracking-tight">
      {value}
    </div>
  </div>
);

export const InsightCard: React.FC = () => {
  const { cognitiveLoad, topPriority } = useNexusStore();

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <InsightItem 
        icon={Brain} 
        label="Cognitive Load" 
        value={`${cognitiveLoad}%`} 
        color="bg-indigo-500" 
      />
      <InsightItem 
        icon={TrendingUp} 
        label="Efficiency" 
        value="94.2%" 
        color="bg-emerald-500" 
      />
      <InsightItem 
        icon={AlertTriangle} 
        label="Top Priority" 
        value={topPriority} 
        color="bg-amber-500" 
      />
    </div>
  );
};
