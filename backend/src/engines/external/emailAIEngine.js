/**
 * Email AI Engine
 * Intelligence layer for extracting actionable data from raw email streams.
 */
const { extractTasksFromEmails } = require('../../services/aiService');

class EmailAIEngine {
  /**
   * Process a list of emails to extract actionable insights
   * @param {Array} emails 
   */
  async process(emails) {
    if (!emails || emails.length === 0) {
      return [];
    }

    try {
      // Prepare simplified data for AI to save tokens and focus context
      const simplifiedEmails = emails.map(email => ({
        subject: email.title,
        from: email.author,
        snippet: email.body_preview
      }));

      // Call the specialized extraction logic in aiService (Phase 2)
      const tasks = await extractTasksFromEmails(simplifiedEmails);

      return tasks;
    } catch (error) {
      console.error('[EmailAIEngine] Processing failed:', error.message);
      return [];
    }
  }
}

module.exports = new EmailAIEngine();
