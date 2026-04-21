import { StreamOutput, AgentStep, ExternalEmail } from "../store/nexusStore";

const BASE_URL = "http://localhost:3000";

const request = async <T>(path: string, options?: RequestInit): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
};

// ─── Stream Engine ────────────────────────────────────────────────────────────

export const streamProcess = (text: string): Promise<StreamOutput> =>
  request<StreamOutput>("/stream", {
    method: "POST",
    body: JSON.stringify({ text }),
  });

// ─── Decision Engine ──────────────────────────────────────────────────────────

export const processDecision = (context: string, answers: Record<string, string>) =>
  request("/decision", {
    method: "POST",
    body: JSON.stringify({ context, answers }),
  });

// ─── Prediction Engine ────────────────────────────────────────────────────────

export const runPrediction = (context: string) =>
  request("/predict", {
    method: "POST",
    body: JSON.stringify({ context }),
  });

// ─── Agent / Orchestrator ─────────────────────────────────────────────────────

export const runAgent = (goal: string): Promise<{ steps: AgentStep[] }> =>
  request<{ steps: AgentStep[] }>("/system/run", {
    method: "POST",
    body: JSON.stringify({ goal }),
  });

// ─── External Hub ─────────────────────────────────────────────────────────────

export const fetchEmails = (): Promise<ExternalEmail[]> =>
  request<ExternalEmail[]>("/external/emails");

export const processExternal = (data: unknown) =>
  request("/external/process", {
    method: "POST",
    body: JSON.stringify(data),
  });

// ─── Mock helpers (dev-only) ──────────────────────────────────────────────────

export const mockStreamResponse = (text: string): Promise<StreamOutput> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          summary: `You want to: "${text.slice(0, 80)}...". Key themes: execution, clarity, momentum.`,
          tasks: [
            { id: "t1", title: "Break down the goal into atomic steps", source: "Stream", priority: "now", isTopPriority: true },
            { id: "t2", title: "Identify blockers and dependencies", source: "Stream", priority: "next" },
            { id: "t3", title: "Schedule a review checkpoint", source: "Stream", priority: "later" },
          ],
          ideas: ["Use NEXUS agent to auto-schedule the tasks", "Link relevant documents from External Hub"],
          questions: ["What is the minimum viable outcome?", "Who else is involved in this goal?"],
          emotions: ["Focused", "Motivated", "Slightly overwhelmed"],
          cognitiveLoad: Math.min(30 + text.length / 3, 95),
        }),
      1800
    )
  );

export const mockAgentSteps = (goal: string): Promise<{ steps: AgentStep[] }> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          steps: [
            { id: "s1", title: "Initialize Environment", action: `Setting up a secure execution context for: "${goal.slice(0, 40)}..."` },
            { id: "s2", title: "Research & Gather Context", action: "Scanning memory store and external sources for relevant prior knowledge." },
            { id: "s3", title: "Draft Execution Plan", action: "Synthesizing a multi-step plan aligned with your goal and constraints." },
            { id: "s4", title: "Validate & Confirm", action: "Cross-referencing the plan against known risks and compliance rules." },
          ],
        }),
      1200
    )
  );

export const mockEmails = (): Promise<ExternalEmail[]> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          { id: "e1", subject: "Critical: Production deployment issue", sender: "devops@nexus.ai", priority: "high", timestamp: "2m ago" },
          { id: "e2", subject: "Weekly cognitive performance report", sender: "system@nexus.ai", priority: "medium", timestamp: "1h ago" },
          { id: "e3", subject: "New collaboration request from ALEX", sender: "alex@partner.io", priority: "low", timestamp: "3h ago" },
        ]),
      800
    )
  );
