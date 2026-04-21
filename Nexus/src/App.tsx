import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './layouts/DashboardLayout';
import { InputBox } from './components/InputBox';
import { AgentPanel } from './components/AgentPanel';
import { InsightCard } from './components/InsightCard';
import { ActionPanel } from './components/ActionPanel';
import { ExternalPanel } from './components/ExternalPanel';
import { GraphView } from './components/GraphView';
import { useIntegrationStatus, useEmails } from './services/api';
import { useNexusStore } from './store/nexusStore';
import { motion } from 'framer-motion';

const queryClient = new QueryClient();

function AppContent() {
  const { data: status } = useIntegrationStatus();
  const { data: emailData } = useEmails(true); // Always analyze for this demo
  const { setGmailConnected, setNotionConnected, setTasks } = useNexusStore();

  React.useEffect(() => {
    if (status) {
      setGmailConnected(status.gmail);
      setNotionConnected(status.notion);
    }
  }, [status, setGmailConnected, setNotionConnected]);

  React.useEffect(() => {
    if (emailData?.insights) {
      setTasks(emailData.insights);
    }
  }, [emailData, setTasks]);

  return (
    <DashboardLayout>
        <div className="space-y-12 pb-20">
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Hello, Operator.
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl leading-relaxed">
              System is primed. Stream your thoughts or define a goal to begin autonomous execution.
            </p>
          </motion.div>

          {/* Core Interaction */}
          <InputBox />

          {/* Dynamic Insight Layer */}
          <InsightCard />

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Agent & Insights (Main Focus) */}
            <div className="lg:col-span-7 space-y-12">
              <AgentPanel />
              
              <div className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                    <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-indigo-500 animate-spin" />
                  </div>
                  <p className="text-sm text-slate-600 font-bold uppercase tracking-[0.3em]">Monitoring Stream...</p>
                </div>
              </div>
            </div>

            {/* Right: Actions & Priorities */}
            <div className="lg:col-span-5">
              <div className="sticky top-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Action Pipeline</h3>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[10px] font-bold text-slate-500 border border-white/10 uppercase">6 Active</span>
                </div>
                <ActionPanel />
              </div>
            </div>
          </div>
        </div>

        {/* Global Overlays */}
        <ExternalPanel />
        <GraphView />
      </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
