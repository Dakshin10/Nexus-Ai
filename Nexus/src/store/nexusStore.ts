import { create } from 'zustand';

interface AgentState {
  status: "idle" | "running" | "completed";
  step: "idle" | "fetching" | "processing" | "deciding" | "done";
  progress: number;
  result: any | null;
}

interface NexusState {
  // User Input
  userInput: string;
  setUserInput: (input: string) => void;

  // User Identity
  currentUser: { id: string; name: string };
  setCurrentUser: (user: { id: string; name: string }) => void;

  // Agent State
  agent: AgentState;
  setAgentStatus: (status: AgentState['status']) => void;
  updateAgent: (update: Partial<AgentState>) => void;
  runAgent: () => Promise<void>;

  // Stream / Insights
  streamOutput: any[];
  cognitiveLoad: number;
  topPriority: string;
  nextAction: string | null;
  systemHealth: 'nominal' | 'optimizing' | 'active';
  setInsights: (summary: any) => void;
  setNextAction: (action: string | null) => void;
  setSystemHealth: (health: NexusState['systemHealth']) => void;

  // Tasks / Actions
  tasks: any[];
  bucketedTasks: {
    doNow: any[];
    doNext: any[];
    later: any[];
  };
  setTasks: (tasks: any[]) => void;
  addTasks: (newTasks: any[]) => void;
  setBucketedTasks: (bucketed: NexusState['bucketedTasks']) => void;

  // External Data
  isGmailConnected: boolean;
  setGmailConnected: (connected: boolean) => void;
  isNotionConnected: boolean;
  setNotionConnected: (connected: boolean) => void;
  notionPages: any[];
  setNotionPages: (pages: any[]) => void;
  isLoadingNotion: boolean;
  setLoadingNotion: (loading: boolean) => void;
  externalData: {
    emails: any[];
    documents: any[];
    notes: any[];
  };
  setExternalData: (data: Partial<NexusState['externalData']>) => void;

  // UI State
  isGraphVisible: boolean;
  isExternalPanelOpen: boolean;
  isSidebarOpen: boolean;
  autoMode: boolean;
  logs: { text: string; type: 'info' | 'agent' | 'success'; timestamp: string; id: string }[];
  toggleGraph: () => void;
  toggleExternalPanel: () => void;
  toggleSidebar: () => void;
  toggleAutoMode: () => void;
  addLog: (text: string, type: 'info' | 'agent' | 'success') => void;
  clearLogs: () => void;
}

export const useNexusStore = create<NexusState>((set, get) => ({
  userInput: '',
  setUserInput: (userInput) => set({ userInput }),

  currentUser: { id: 'user_nexus_1', name: 'Nexus User' },
  setCurrentUser: (currentUser) => set({ currentUser }),

  agent: {
    status: 'idle',
    step: 'idle',
    progress: 0,
    result: null,
  },
  setAgentStatus: (status) => set((state) => ({ agent: { ...state.agent, status } })),
  updateAgent: (update) => set((state) => ({ agent: { ...state.agent, ...update } })),

  runAgent: async () => {
    const { currentUser, setBucketedTasks, addLog } = get();
    
    set({ agent: { status: "running", step: "fetching", progress: 10, result: null } });
    addLog('Initiating data harvest from Gmail & Notion...', 'agent');

    try {
      const response = await fetch('http://localhost:3001/api/system/run-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });

      set({ agent: { ...get().agent, step: "processing", progress: 50 } });
      addLog('Synthesizing task context via GPT-4o-mini...', 'agent');

      const result = await response.json();
      
      set({ agent: { ...get().agent, step: "deciding", progress: 85 } });
      addLog('Prioritizing actions into Nexus Decision Grid...', 'agent');

      if (result.success && result.data) {
        setBucketedTasks(result.data);
        set({ 
          agent: { 
            status: "completed", 
            step: "done", 
            progress: 100, 
            result: result.data 
          },
          systemHealth: 'active'
        });
        addLog('Global Intelligence Sync Complete.', 'success');
      } else {
        throw new Error(result.error || 'Failed to extract tasks');
      }
    } catch (error: any) {
      console.error('Agent run failed:', error);
      set({ agent: { status: "idle", step: "idle", progress: 0, result: null } });
      addLog(`Orchestration failed: ${error.message}`, 'info');
    }
  },

  streamOutput: [],
  cognitiveLoad: 0,
  topPriority: 'System Ready',
  nextAction: null,
  systemHealth: 'nominal',
  setInsights: (insights) => set({ 
    cognitiveLoad: insights.cognitiveLoad || 0,
    topPriority: insights.topPriority || 'Analyzing...',
  }),
  setNextAction: (nextAction) => set({ nextAction }),
  setSystemHealth: (systemHealth) => set({ systemHealth }),

  tasks: [],
  bucketedTasks: {
    doNow: [],
    doNext: [],
    later: [],
  },
  setTasks: (tasks) => set({ tasks }),
  addTasks: (newTasks) => set((state) => ({ 
    tasks: [...newTasks, ...state.tasks] 
  })),
  setBucketedTasks: (bucketedTasks) => set({ bucketedTasks }),

  isGmailConnected: localStorage.getItem('gmail_connected') === 'true',
  setGmailConnected: (isGmailConnected) => set({ isGmailConnected }),
  isNotionConnected: localStorage.getItem('notion_connected') === 'true',
  setNotionConnected: (isNotionConnected) => set({ isNotionConnected }),
  notionPages: [],
  setNotionPages: (notionPages) => set({ notionPages }),
  isLoadingNotion: false,
  setLoadingNotion: (isLoadingNotion) => set({ isLoadingNotion }),
  externalData: {
    emails: [],
    documents: [],
    notes: [],
  },
  setExternalData: (data) => set((state) => ({ 
    externalData: { ...state.externalData, ...data } 
  })),

  isGraphVisible: false,
  isExternalPanelOpen: false,
  isSidebarOpen: true,
  autoMode: false,
  logs: [
    { id: '1', text: 'NEXUS Cognitive Core Initialized', type: 'info', timestamp: new Date().toLocaleTimeString() },
    { id: '2', text: 'Monitoring workspace hubs...', type: 'agent', timestamp: new Date().toLocaleTimeString() }
  ],
  toggleGraph: () => set((state) => ({ isGraphVisible: !state.isGraphVisible })),
  toggleExternalPanel: () => set((state) => ({ isExternalPanelOpen: !state.isExternalPanelOpen })),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleAutoMode: () => set((state) => ({ autoMode: !state.autoMode })),
  addLog: (text, type) => set((state) => ({ 
    logs: [
      ...state.logs.slice(-49), // Keep last 50 logs
      { id: Date.now().toString(), text, type, timestamp: new Date().toLocaleTimeString() }
    ] 
  })),
  clearLogs: () => set({ logs: [] }),
}));
