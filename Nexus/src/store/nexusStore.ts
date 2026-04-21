import { create } from 'zustand';

export type AgentStatus = "idle" | "running" | "completed" | "paused";

export interface AgentState {
  status: AgentStatus;
  step: "idle" | "fetching" | "processing" | "deciding" | "done";
  steps: string[];      
  currentStep: string;  
  progress: number;
  result: any | null;
}

interface NexusState {
  // User Identity
  currentUser: { id: string; name: string };
  setCurrentUser: (user: { id: string; name: string }) => void;

  // User Input
  userInput: string;
  setUserInput: (input: string) => void;

  // Agent State (Object)
  agent: AgentState;
  setAgentStatus: (status: AgentState['status']) => void;
  updateAgent: (update: Partial<AgentState>) => void;
  runAgent: () => Promise<void>;

  // Agent State (Flattened)
  agentStatus: AgentStatus;
  agentSteps: string[];
  currentStepIndex: number;
  advanceAgentStep: () => void;
  resetAgent: () => void;

  // Stream & Loading
  streamOutput: any[];
  isStreamLoading: boolean;
  setStreamOutput: (data: any[]) => void;
  setStreamLoading: (val: boolean) => void;

  // Insights / Metadata
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
  addTasks: (newTasks: any[]) => void; // RESTORED
  setBucketedTasks: (bucketed: NexusState['bucketedTasks']) => void;

  // Connectivity & Notion Data (RESTORED)
  isGmailConnected: boolean;
  setGmailConnected: (connected: boolean) => void;
  isNotionConnected: boolean;
  setNotionConnected: (connected: boolean) => void;
  notionPages: any[];
  setNotionPages: (pages: any[]) => void;
  isLoadingNotion: boolean;
  setLoadingNotion: (loading: boolean) => void;
  logs: { text: string; type: 'info' | 'agent' | 'success'; timestamp: string; id: string }[];
  
  // UI Actions (RESTORED)
  isGraphVisible: boolean;
  isExternalPanelOpen: boolean;
  toggleGraph: () => void;
  toggleExternalPanel: () => void;
  addLog: (text: string, type: 'info' | 'agent' | 'success') => void;
  clearLogs: () => void;
}

export const useNexusStore = create<NexusState>((set, get) => ({
  currentUser: { id: 'user_nexus_1', name: 'Nexus User' },
  setCurrentUser: (currentUser) => set({ currentUser }),

  userInput: '',
  setUserInput: (userInput) => set({ userInput }),

  // Agent Implementation
  agent: {
    status: 'idle',
    step: 'idle',
    steps: ["Analyzing Source", "Extracting Tasks", "Scoring Priority", "Finalizing Grid"],
    currentStep: 'Initializing...',
    progress: 0,
    result: null,
  },
  agentStatus: 'idle',
  agentSteps: ["Initializing", "Harvesting", "Synthesizing", "Routing"],
  currentStepIndex: 0,

  setAgentStatus: (status) => set((state) => ({ 
    agent: { ...state.agent, status },
    agentStatus: status 
  })),
  
  updateAgent: (update) => set((state) => ({ 
    agent: { ...state.agent, ...update } 
  })),

  advanceAgentStep: () => set((state) => ({
    currentStepIndex: Math.min(state.currentStepIndex + 1, state.agentSteps.length - 1)
  })),

  resetAgent: () => set({
    agentStatus: 'idle',
    currentStepIndex: 0,
    agent: {
      ...get().agent,
      status: 'idle',
      step: 'idle',
      progress: 0
    }
  }),

  runAgent: async () => {
    const { setBucketedTasks, addLog, currentUser } = get();
    
    set((state) => ({ 
      agent: { ...state.agent, status: "running", step: "fetching", progress: 10, currentStep: "Data Harvest" },
      agentStatus: "running"
    }));
    
    addLog('Initiating workspace sync cycle...', 'agent');

    try {
      const response = await fetch('http://localhost:3001/api/system/run-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUser.id })
      });

      set((state) => ({ 
        agent: { ...state.agent, step: "processing", progress: 50, currentStep: "Context Synthesis" } 
      }));
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setBucketedTasks(result.data);
        set((state) => ({ 
          agent: { 
            ...get().agent,
            status: "completed", 
            step: "done", 
            progress: 100, 
            result: result.data,
            currentStep: "Sync Complete" 
          },
          agentStatus: "completed",
          systemHealth: 'active'
        }));
        addLog('Workspace synchronization successful.', 'success');
      } else {
        throw new Error(result.error || 'Extraction failed');
      }
    } catch (error: any) {
      set((state) => ({ 
        agent: { ...state.agent, status: "idle", progress: 0 },
        agentStatus: "idle"
      }));
      addLog(`Sync error: ${error.message}`, 'info');
    }
  },

  streamOutput: [],
  isStreamLoading: false,
  setStreamOutput: (streamOutput) => set({ streamOutput }),
  setStreamLoading: (isStreamLoading) => set({ isStreamLoading }),

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
  addTasks: (newTasks) => set((state) => ({ tasks: [...state.tasks, ...newTasks] })),
  setBucketedTasks: (bucketedTasks) => set({ bucketedTasks }),

  isGmailConnected: false,
  setGmailConnected: (isGmailConnected) => set({ isGmailConnected }),
  isNotionConnected: false,
  setNotionConnected: (isNotionConnected) => set({ isNotionConnected }),
  notionPages: [],
  setNotionPages: (notionPages) => set({ notionPages }),
  isLoadingNotion: false,
  setLoadingNotion: (isLoadingNotion) => set({ isLoadingNotion }),

  isGraphVisible: false,
  isExternalPanelOpen: false,
  toggleGraph: () => set((state) => ({ isGraphVisible: !state.isGraphVisible })),
  toggleExternalPanel: () => set((state) => ({ isExternalPanelOpen: !state.isExternalPanelOpen })),
  
  logs: [],
  addLog: (text, type) => set((state) => ({ 
    logs: [
      ...state.logs.slice(-49),
      { id: Date.now().toString(), text, type, timestamp: new Date().toLocaleTimeString() }
    ] 
  })),
  clearLogs: () => set({ logs: [] }),
}));
