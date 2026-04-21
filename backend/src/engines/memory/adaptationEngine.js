/**
 * Adaptation Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/memory/adaptationPrompt');
const { validateMemory } = require('../../utils/memoryValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'memory-adaptation'
  });

  validateMemory(result, 'adaptation');
  return result;
}

module.exports = { run };
