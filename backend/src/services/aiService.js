/**
 * AI Service
 * Core bridge to the LLM with strict JSON enforcement, retry logic, and timeouts.
 */
const logger = require('../utils/logger');

async function runAI({ prompt, input, schema, stage = 'ai-service' }) {
  const startTime = logger.time();
  
  // Mocking the AI call. In production, this would use google.genai or similar SDK.
  // We simulate a slightly delayed JSON response to demonstrate timeout and retries.
  const callModel = async (attempt = 1) => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error(`AI Request timed out after 4000ms`));
      }, 4000);

      // Simulate network latency
      setTimeout(() => {
        clearTimeout(timeout);
        
        // Mocked logic for the demonstration
        // Normally, this would call the actual LLM with the prompt + input
        try {
          const mockResponse = generateMockResponse(stage, input);
          resolve(mockResponse);
        } catch (e) {
          if (attempt === 1) {
            logger.log(stage, "Retrying AI call due to invalid JSON/format...");
            resolve(callModel(2));
          } else {
            reject(e);
          }
        }
      }, 150); 
    });
  };

  try {
    const result = await callModel();
    const duration = logger.timeEnd(startTime);
    logger.log(stage, `Successfully completed AI processing`, duration);
    return result;
  } catch (error) {
    logger.error(stage, `AI Processing failed: ${error.message}`);
    throw error;
  }
}

/**
 * MOCK DATA GENERATOR
 * To ensure the system is testable immediately.
 */
function generateMockResponse(stage, input) {
  // Simple heuristic-based mock to simulate "intelligent" behavior
  switch (stage) {
    case 'decomposition':
      return { atomic_thoughts: input.split(/[.!?]+/).filter(t => t.trim().length > 0).map(t => t.trim()) };
    case 'classification':
      return { classified: (input.atomic_thoughts || []).map(t => ({ text: t, type: 'task' })) };
    case 'reasoning':
      return { summary: 'Mocked summary', urgent: [], top_priority: 'Mocked priority', recommended_action: 'Mocked action' };
    case 'load':
      return { cognitive_load: { score: 50, status: 'yellow' } };
    default:
      return {};
  }
}

module.exports = { runAI };
