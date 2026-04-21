/**
 * Source Prompt
 */
const SYSTEM_PROMPT = `
You are a source awareness engine.
Input: raw data and extracted context.
Assign metadata: source_type (email|note|manual|system), reliability_score (1-5).
Return JSON: { "source_metadata": { "type": "...", "reliability": 1-5 } }
`;

module.exports = { SYSTEM_PROMPT };
