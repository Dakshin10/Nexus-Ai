import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardLayout } from './layouts/DashboardLayout';
import { InputBox } from './components/InputBox';
import { AgentPanel } from './components/AgentPanel';
import { ActionPanel } from './components/ActionPanel';
import { DecisionPage } from './components/DecisionPage';
import { ExternalHub } from './pages/ExternalHub';
import { useIntegrationStatus } from './services/api';
import { useNexusStore } from './store/nexusStore';

const queryClient = new QueryClient();

function Dashboard() {
  return (
    <div className="space-y-12 pb-20">
      <section>
        <InputBox />
      </section>
      <section>
        <AgentPanel />
      </section>
    </div>
  );
}

function AppContent() {
  const { currentUser, setGmailConnected, setNotionConnected } = useNexusStore();
  const { data: status } = useIntegrationStatus(currentUser.id);

  React.useEffect(() => {
    if (status) {
      setGmailConnected(status.gmail);
      setNotionConnected(status.notion);
      
      // Phase 8: Auto-run on startup
      const { agent, runAgent } = useNexusStore.getState();
      if (agent.status === 'idle' && (status.gmail || status.notion)) {
        runAgent();
      }
    }
  }, [status, setGmailConnected, setNotionConnected]);

  return (
    <BrowserRouter>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/external" element={<ExternalHub />} />
          <Route path="/decision" element={<DecisionPage />} />
        </Routes>
      </DashboardLayout>
    </BrowserRouter>
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
