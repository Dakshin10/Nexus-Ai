import { create } from 'zustand';

interface AgentState {
  currentStep: string;
  nextAction: string;
  progress: number;
  status: 'idle' | 'running' | 'paused' | 'waiting';
}

interface NexusState {
  // User Input
  userInput: string;
  setUserInput: (input: string) => void;

  // Agent State
  agent: AgentState;
  setAgentStatus: (status: AgentState['status']) => void;
  updateAgent: (update: Partial<AgentState>) => void;

  // Stream / Insights
  streamOutput: any[];
  cognitiveLoad: number;
  topPriority: string;
  setInsights: (summary: any) => void;

  // Tasks / Actions
  tasks: any[];
  setTasks: (tasks: any[]) => void;

  // External Data
  isGmailConnected: boolean;
  setGmailConnected: (connected: boolean) => void;
  isNotionConnected: boolean;
  setNotionConnected: (connected: boolean) => void;
  externalData: {
    emails: any[];
    documents: any[];
    notes: any[];
  };
  setExternalData: (data: Partial<NexusState['externalData']>) => void;

  // UI State
  isGraphVisible: boolean;
  isExternalPanelOpen: boolean;
  toggleGraph: () => void;
  toggleExternalPanel: () => void;
}

export const useNexusStore = create<NexusState>((set) => ({
  userInput: '',
  setUserInput: (userInput) => set({ userInput }),

  agent: {
    currentStep: 'Waiting for input...',
    nextAction: 'Analyze objective',
    progress: 0,
    status: 'idle',
  },
  setAgentStatus: (status) => set((state) => ({ agent: { ...state.agent, status } })),
  updateAgent: (update) => set((state) => ({ agent: { ...state.agent, ...update } })),

  streamOutput: [],
  cognitiveLoad: 0,
  topPriority: 'System Ready',
  setInsights: (insights) => set({ 
    cognitiveLoad: insights.cognitiveLoad || 0,
    topPriority: insights.topPriority || 'Analyzing...',
  }),

  tasks: [],
  setTasks: (tasks) => set({ tasks }),

  isGmailConnected: false,
  setGmailConnected: (isGmailConnected) => set({ isGmailConnected }),
  isNotionConnected: false,
  setNotionConnected: (isNotionConnected) => set({ isNotionConnected }),
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
  toggleGraph: () => set((state) => ({ isGraphVisible: !state.isGraphVisible })),
  toggleExternalPanel: () => set((state) => ({ isExternalPanelOpen: !state.isExternalPanelOpen })),
}));
