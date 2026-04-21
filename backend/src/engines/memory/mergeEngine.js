/**
 * Merge Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/memory/mergePrompt');
const { validateMemory } = require('../../utils/memoryValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: { new: input, existing: context.pastMemory },
    stage: 'memory-merge'
  });

  validateMemory(result, 'merge');
  return result;
}

module.exports = { run };
