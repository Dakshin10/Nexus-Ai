import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = 'http://localhost:3001/api';

export const api = {
  // Stream & Decision
  processStream: async (input: string) => {
    const res = await fetch(`${API_BASE}/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
    });
    return res.json();
  },

  runAgent: async (goal: string) => {
    const res = await fetch(`${API_BASE}/system/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal }),
    });
    return res.json();
  },

  // Predictions
  getPredictions: async () => {
    const res = await fetch(`${API_BASE}/predict`);
    return res.json();
  },

  // External
  getEmails: async (analyze: boolean = false) => {
    const res = await fetch(`${API_BASE}/integrations/gmail?analyze=${analyze}`);
    return res.json();
  },

  getIntegrationStatus: async () => {
    const res = await fetch(`${API_BASE}/integrations/status`);
    return res.json();
  },

  processExternal: async (data: any) => {
    const res = await fetch(`${API_BASE}/external/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  triggerSync: async () => {
    const res = await fetch(`${API_BASE}/integrations/sync`, { method: 'POST' });
    return res.json();
  },
};

// Hooks
export const useEmails = (analyze = false) => {
  return useQuery({
    queryKey: ['emails', analyze],
    queryFn: () => api.getEmails(analyze),
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useIntegrationStatus = () => {
  return useQuery({
    queryKey: ['integration-status'],
    queryFn: () => api.getIntegrationStatus(),
    refetchInterval: 30000, // Poll every 30 seconds
  });
};

export const useStreamMutation = () => {
  return useMutation({
    mutationFn: (input: string) => api.processStream(input),
  });
};

export const useAgentMutation = () => {
  return useMutation({
    mutationFn: (goal: string) => api.runAgent(goal),
  });
};

export const useSyncMutation = () => {
  return useMutation({
    mutationFn: () => api.triggerSync(),
  });
};
