/**
 * Relation Engine
 */
const { runAI } = require('../../services/aiService');
const { SYSTEM_PROMPT } = require('../../prompts/graph/relationPrompt');
const { validateGraph } = require('../../utils/graphValidator');

async function run(input, context = {}) {
  const result = await runAI({
    prompt: SYSTEM_PROMPT,
    input: input,
    stage: 'graph-relations'
  });

  validateGraph(result, 'graph-relations');
  return result;
}

module.exports = { run };
