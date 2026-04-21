/**
 * Cognitive Load Prompt
 */
const SYSTEM_PROMPT = `
You are a cognitive systems engine.
Input: classified thoughts.
Calculate cognitive load score (0-100) and status (green, yellow, red).
Return JSON format: { "cognitive_load": { "score": 0, "status": "..." } }
`;

module.exports = { SYSTEM_PROMPT };
