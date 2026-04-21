import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Zap, Search, HelpCircle, Activity } from 'lucide-react';
import { ConnectorCard } from '../components/integrations/ConnectorCard';
import { CONNECTORS } from '../config/connectors';
import { useConnectorStore } from '../store/useConnectorStore';
import { cn } from '../lib/utils';

export const ExternalHub: React.FC = () => {
  const { connections, fetchStatus, connect } = useConnectorStore();

  useEffect(() => {
    fetchStatus();
  }, []);

  const connectedCount = Object.values(connections).filter(Boolean).length;

  return (
    <div className="flex-1 flex flex-col bg-[#050505] text-slate-300 overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      {/* Header */}
      <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 shrink-0 z-10 bg-black/20 backdrop-blur-3xl">
        <div className="flex items-center gap-6">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Globe className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white uppercase tracking-[0.3em]">External Hub</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Connect and synchronize your cognitive workspace</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/5">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {connectedCount} Nodes Active
              </span>
           </div>
           <button 
             onClick={() => fetchStatus()}
             className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-slate-400"
            >
             <Zap className="w-4 h-4" />
           </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Search & Filter Bar */}
          <section className="flex items-center justify-between gap-6 p-2 rounded-3xl bg-white/[0.02] border border-white/5">
            <div className="flex-1 flex items-center gap-4 px-4 py-2">
              <Search className="w-4 h-4 text-slate-600" />
              <input 
                type="text" 
                placeholder="SEARCH CONNECTORS..." 
                className="bg-transparent border-none outline-none text-[10px] font-bold tracking-widest text-white placeholder-slate-700 w-full"
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border-l border-white/5">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Filter:</span>
              <select className="bg-transparent text-[9px] font-black text-indigo-400 uppercase tracking-widest outline-none border-none cursor-pointer">
                <option>All Systems</option>
                <option>Connected</option>
                <option>Active</option>
              </select>
            </div>
          </section>

          {/* Connectors Grid */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {CONNECTORS.map((connector) => (
                <ConnectorCard 
                  key={connector.id}
                  {...connector}
                  isConnected={connections[connector.id] || false}
                  onConnect={() => connect(connector.id)}
                />
              ))}
            </div>
          </section>

          {/* Bottom Info Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12">
            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex items-start gap-6">
               <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                 <Shield className="w-6 h-6 text-amber-500" />
               </div>
               <div>
                 <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Secure Authentication</h4>
                 <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                   All external connections use OAuth 2.0. NEXUS never stores your primary passwords. 
                   Access tokens are encrypted and handled locally within the system's cognitive core.
                 </p>
               </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 flex items-start gap-6">
               <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                 <HelpCircle className="w-6 h-6 text-blue-500" />
               </div>
               <div>
                 <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Don't see your system?</h4>
                 <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                   The NEXUS Registry is constantly expanding. Reach out to the development node to 
                   request custom API adapters for your enterprise tools.
                 </p>
               </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
