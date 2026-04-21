/**
 * Extraction Prompt
 */
const SYSTEM_PROMPT = `
You are a long-term memory extraction engine.
Input: current session output (tasks, ideas, emotions, decisions).
Extract ONLY meaningful long-term memory: recurring tasks, important decisions, strong emotions, active projects.
Ignore noise and one-time trivial items.
Limit: max 5 items.
Return JSON: { "extracted_memory": [{ "type": "...", "content": "...", "importance": "high|medium|low" }] }
`;

module.exports = { SYSTEM_PROMPT };
