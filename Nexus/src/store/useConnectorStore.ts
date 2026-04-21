import { create } from 'zustand';
import { useNexusStore } from './nexusStore';

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
      const { currentUser } = useNexusStore.getState();
      try {
        const response = await fetch(`http://localhost:3001/api/connectors/status?userId=${currentUser.id}`);
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
      const { currentUser } = useNexusStore.getState();
      const authUrl = `http://localhost:3001/auth/${providerId}?userId=${currentUser.id}`;
      const popup = window.open(authUrl, '_blank', 'width=600,height=700,status=yes,toolbar=no,menubar=no,location=yes');
      
      const handleMessage = (event: MessageEvent) => {
        // Only trust our own origin
        if (event.origin !== 'http://localhost:3001' && event.origin !== window.location.origin) return;

        if (event.data.type === `${providerId}_connected`) {
          console.log(`[ConnectorStore] ${providerId} connected successfully`);
          get().fetchStatus();
          window.removeEventListener('message', handleMessage);
        }
      };

      window.addEventListener('message', handleMessage);

      // Backup: Start polling momentarily to ensure sync
      get().startPolling(2000);
      
      // Auto-stop polling after a timeout (e.g., 1 minute)
      setTimeout(() => {
        get().stopPolling();
        window.removeEventListener('message', handleMessage);
      }, 60000);
    }
  };
});
