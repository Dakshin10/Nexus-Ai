import { create } from 'zustand';

interface ConnectorState {
  connections: Record<string, boolean>;
  isPolling: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchStatus: () => Promise<void>;
  startPolling: (interval?: number) => void;
  stopPolling: () => void;
  connect: (providerId: string) => void;
}

export const useConnectorStore = create<ConnectorState>((set, get) => {
  let pollInterval: any = null;

  return {
    connections: {
      gmail: false,
      notion: false,
    },
    isPolling: false,
    isLoading: false,
    error: null,

    fetchStatus: async () => {
      try {
        const response = await fetch('http://localhost:3001/api/connectors/status');
        if (!response.ok) throw new Error('Status fetch failed');
        const data = await response.json();
        set({ connections: data, error: null });
      } catch (err) {
        console.error('Failed to fetch connector status', err);
        set({ error: 'Failed to sync connection status' });
      }
    },

    startPolling: (interval = 3000) => {
      if (pollInterval) clearInterval(pollInterval);
      set({ isPolling: true });
      
      // Immediate fetch then interval
      get().fetchStatus();
      pollInterval = setInterval(() => {
        get().fetchStatus();
      }, interval);
    },

    stopPolling: () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
      }
      set({ isPolling: false });
    },

    connect: (providerId: string) => {
      const authUrl = `http://localhost:3001/auth/${providerId}`;
      window.open(authUrl, '_blank', 'width=600,height=700,status=yes,toolbar=no,menubar=no,location=yes');
      
      // Start polling after opening to catch the "Success"
      get().startPolling(2000);
      
      // Auto-stop polling after a timeout (e.g., 2 minutes) to save resources
      setTimeout(() => {
        get().stopPolling();
      }, 120000);
    }
  };
});
