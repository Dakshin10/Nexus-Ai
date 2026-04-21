/**
 * Planning Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/orchestrator/planningPrompt');
const { validateOrchestration } = require('../../utils/orchestratorValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'orchestrator-planning'
  });

  validateOrchestration(result, 'planning');
  return result;
}

module.exports = { run };
