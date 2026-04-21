const aiService = require('../../services/aiService');

class CognitiveEngine {
  /**
   * Process raw text to extract key ideas, tasks, and decisions
   */
  async extractIntelligence(text) {
    if (!text || text.trim().length === 0) {
      throw new Error('Input text is required for extraction');
    }

    try {
      const result = await aiService.runAI({
        stage: 'cognitive-extraction',
        input: text,
        prompt: `Analyze the following text and extract three distinct categories in a structured JSON format:
        1. Key Ideas: Transformative thoughts or observations.
        2. Tasks: Actionable items that need to be completed.
        3. Decisions: Choices made or conclusions reached.
        
        Text: ${text}`
      });

      return result;
    } catch (error) {
      console.error('[CognitiveEngine] Extraction Error:', error.message);
      throw error;
    }
  }
}

module.exports = new CognitiveEngine();
