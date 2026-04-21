import { create } from "zustand";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AgentStatus = "idle" | "running" | "paused" | "done";
export type Priority = "now" | "next" | "later";
export type ImpactLevel = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  source: string;
  priority: Priority;
  isTopPriority?: boolean;
}

export interface StreamOutput {
  summary: string;
  tasks: Task[];
  ideas: string[];
  questions: string[];
  emotions: string[];
  cognitiveLoad: number;
}

export interface AgentStep {
  id: string;
  title: string;
  action: string;
}

export interface ExternalEmail {
  id: string;
  subject: string;
  sender: string;
  priority: ImpactLevel;
  timestamp: string;
}

// ─── State Shape ──────────────────────────────────────────────────────────────

interface NexusState {
  // Input
  userInput: string;
  setUserInput: (text: string) => void;

  // Active panel / view mode
  activePanel: "stream" | "agent" | "external" | "graph" | "decision";
  setActivePanel: (panel: NexusState["activePanel"]) => void;

  // Stream / Insights
  streamOutput: StreamOutput | null;
  setStreamOutput: (output: StreamOutput | null) => void;
  isStreamLoading: boolean;
  setStreamLoading: (v: boolean) => void;

  // Agent
  agentStatus: AgentStatus;
  agentSteps: AgentStep[];
  currentStepIndex: number;
  setAgentStatus: (status: AgentStatus) => void;
  setAgentSteps: (steps: AgentStep[]) => void;
  advanceAgentStep: () => void;
  resetAgent: () => void;

  // Tasks
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  completeTask: (id: string) => void;

  // External
  emails: ExternalEmail[];
  setEmails: (emails: ExternalEmail[]) => void;
  isGmailConnected: boolean;
  setGmailConnected: (v: boolean) => void;

  // UI state
  isGraphOpen: boolean;
  toggleGraph: () => void;
  isExternalOpen: boolean;
  toggleExternal: () => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useNexusStore = create<NexusState>((set) => ({
  // Input
  userInput: "",
  setUserInput: (text) => set({ userInput: text }),

  // Active panel
  activePanel: "stream",
  setActivePanel: (panel) => set({ activePanel: panel }),

  // Stream
  streamOutput: null,
  setStreamOutput: (output) => set({ streamOutput: output }),
  isStreamLoading: false,
  setStreamLoading: (v) => set({ isStreamLoading: v }),

  // Agent
  agentStatus: "idle",
  agentSteps: [],
  currentStepIndex: 0,
  setAgentStatus: (status) => set({ agentStatus: status }),
  setAgentSteps: (steps) => set({ agentSteps: steps, currentStepIndex: 0, agentStatus: "running" }),
  advanceAgentStep: () =>
    set((state) => {
      const next = state.currentStepIndex + 1;
      if (next >= state.agentSteps.length) {
        return { currentStepIndex: next, agentStatus: "done" };
      }
      return { currentStepIndex: next };
    }),
  resetAgent: () => set({ agentStatus: "idle", agentSteps: [], currentStepIndex: 0 }),

  // Tasks
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  completeTask: (id) =>
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),

  // External
  emails: [],
  setEmails: (emails) => set({ emails }),
  isGmailConnected: false,
  setGmailConnected: (v) => set({ isGmailConnected: v }),

  // UI
  isGraphOpen: false,
  toggleGraph: () => set((s) => ({ isGraphOpen: !s.isGraphOpen })),
  isExternalOpen: false,
  toggleExternal: () => set((s) => ({ isExternalOpen: !s.isExternalOpen })),
}));
