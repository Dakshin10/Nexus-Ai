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

  getIntegrationStatus: async (userId: string) => {
    const res = await fetch(`${API_BASE}/integrations/status?userId=${userId}`);
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

  triggerSync: async (userId: string = 'user_nexus_1') => {
    const res = await fetch(`${API_BASE}/integrations/sync`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  },

  // Notion
  connectNotion: async (userId: string) => {
    const res = await fetch(`${API_BASE}/external/notion/connect?userId=${userId}`, { method: 'POST' });
    return res.json();
  },

  getNotionPages: async (userId: string) => {
    const res = await fetch(`${API_BASE}/external/notion/pages?userId=${userId}`);
    return res.json();
  },

  importNotionPage: async (pageId: string, userId: string) => {
    const res = await fetch(`${API_BASE}/external/notion/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page_id: pageId, userId }),
    });
    return res.json();
  },
  
  syncNotionWorkspace: async (userId: string) => {
    try {
      const res = await fetch(`${API_BASE}/orchestrate/unified-sync?userId=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const text = await res.text();
      if (!res.ok) {
        throw new Error(`Sync failed [${res.status}]: ${text}`);
      }

      try {
        return JSON.parse(text);
      } catch (parseError) {
        console.error('Invalid JSON Response from unified-sync:', text);
        throw new Error('Server returned malformed data');
      }
    } catch (error: any) {
      console.error('[API] Unified Sync Error:', error.message);
      throw error;
    }
  },

  runIntelligence: async (userId: string = 'user_nexus_1') => {
    const res = await fetch(`${API_BASE}/system/run-intelligence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return res.json();
  }
};

// Hooks
export const useIntelligenceMutation = (userId: string = 'user_nexus_1') => {
  return useMutation({
    mutationFn: () => api.runIntelligence(userId),
  });
};

// Hooks
export const useEmails = (analyze = false) => {
  return useQuery({
    queryKey: ['emails', analyze],
    queryFn: () => api.getEmails(analyze),
    refetchInterval: 60000, // Refresh every minute
  });
};

export const useNotionSync = (userId: string) => {
  return useMutation({
    mutationFn: () => api.syncNotionWorkspace(userId),
  });
};

export const useIntegrationStatus = (userId: string) => {
  return useQuery({
    queryKey: ['integration-status', userId],
    queryFn: () => api.getIntegrationStatus(userId),
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

export const useSyncMutation = (userId: string = 'user_nexus_1') => {
  return useMutation({
    mutationFn: () => api.triggerSync(userId),
  });
};

export const useNotionConnect = () => {
  return useMutation({
    mutationFn: () => api.connectNotion('user_nexus_1'),
  });
};

export const useNotionPages = () => {
  return useQuery({
    queryKey: ['notion-pages'],
    queryFn: () => api.getNotionPages('user_nexus_1'),
    enabled: false,
  });
};
