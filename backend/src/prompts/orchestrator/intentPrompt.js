/**
 * Intent Prompt
 */
const SYSTEM_PROMPT = `
You are a cognitive intent engine.
Analyze user input and detect: messy thoughts, decision requests, visualization intent, overload signals, or context switching.
Return JSON: { "intent": "...", "context_signals": [] }
`;

module.exports = { SYSTEM_PROMPT };
