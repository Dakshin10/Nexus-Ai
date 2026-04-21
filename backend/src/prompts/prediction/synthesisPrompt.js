/**
 * Synthesis Prompt
 */
const SYSTEM_PROMPT = `
You are a predictive synthesis engine.
Input: prediction and intervention.
Combine into final structure. Generate a risk summary.
Return JSON: { "risk_summary": "..." }
`;

module.exports = { SYSTEM_PROMPT };
