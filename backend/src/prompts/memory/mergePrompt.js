/**
 * Merge Prompt
 */
const SYSTEM_PROMPT = `
You are a memory consolidation engine.
Input: new extracted memory and existing past memory.
Combine them, remove duplicates, and maintain consistency.
Prune low-importance items if memory exceeds 20 items.
Return JSON: { "memory_items": [...] }
`;

module.exports = { SYSTEM_PROMPT };
