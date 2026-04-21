/**
 * Routing Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/orchestrator/routingPrompt');
const { validateOrchestration } = require('../../utils/orchestratorValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'orchestrator-routing'
  });

  validateOrchestration(result, 'routing');
  return result;
}

module.exports = { run };
