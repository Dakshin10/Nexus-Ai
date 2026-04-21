/**
 * Notion AI Engine
 * Intelligence layer for transforming unstructured Notion content into actionable tasks.
 */
const { runAI } = require('../../services/aiService');
const logger = require('../../utils/logger');

class NotionAIEngine {
  async process(page) {
    const { title, content } = page;
    if (!content) return [];

    const prompt = `
      You are a productivity intelligence system.
      Extract actionable tasks from the following notes.

      Rules:
      - Ignore junk / passive text
      - Focus on actionable intent
      - Infer urgency
      - Group similar tasks
      - Max 5 tasks per note

      Classify:
      DO_NOW → urgent / blocking
      DO_NEXT → important but not urgent
      LATER → optional / low priority

      OUTPUT FORMAT (JSON ONLY):
      [
        {
          "task": "short descriptive task",
          "priority": "DO_NOW" | "DO_NEXT" | "LATER",
          "reasoning": "brief explanation for this classification",
          "deadline": "ISO date or null",
          "source": "notion"
        }
      ]
    `;

    try {
      logger.log('notion-ai-engine', `Processing page: ${title}`);

      const results = await runAI({
        stage: 'notion-extraction',
        input: { title, content },
        prompt
      });

      // Ensure output is always an array
      return Array.isArray(results) ? results : [];
    } catch (error) {
      logger.error('notion-ai-engine', `AI Processing failed: ${error.message}`);
      return [];
    }
  }
}

module.exports = new NotionAIEngine();
