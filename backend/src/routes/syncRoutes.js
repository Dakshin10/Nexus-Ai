const express = require('express');
const router = express.Router();
const gmailIngestionEngine = require('../engines/external/gmailIngestionEngine');
const emailAIEngine = require('../engines/external/emailAIEngine');
const notesService = require('../services/notesService');

/**
 * @route   POST /api/integrations/sync
 * @desc    Full pipeline: Gmail -> AI -> Notion
 */
router.post('/sync', async (req, res) => {
  const results = {
    total_emails: 0,
    tasks_extracted: 0,
    notion_synced: 0,
    errors: []
  };

  try {
    console.log('[SyncEngine] Starting Full Orchestration...');

    // 1. Ingest from Gmail
    const emails = await gmailIngestionEngine.ingest({ count: 10, userId: 'me' });
    results.total_emails = emails.length;

    if (emails.length === 0) {
      return res.json({ message: 'No new emails to sync', results });
    }

    // 2. AI Processing (Extract Tasks)
    const insights = await emailAIEngine.process(emails);
    results.tasks_extracted = insights.length;

    if (insights.length === 0) {
      return res.json({ message: 'No actionable tasks found', results });
    }

    // 3. Sync to Notion
    const syncPromises = insights.map(async (insight) => {
      try {
        const page = await notesService.createTaskPage({
          task: insight.task,
          priority: insight.priority,
          source: insight.source,
          context: insight.context
        });
        if (page && !page.cached) {
          results.notion_synced++;
        }
      } catch (err) {
        console.error(`[SyncEngine] Failed to sync task: ${insight.task}`, err.message);
        results.errors.push({ task: insight.task, error: err.message });
      }
    });

    await Promise.all(syncPromises);

    res.json({
      message: 'Sync completed successfully',
      results
    });

  } catch (error) {
    console.error('[SyncEngine] Critical Error:', error.message);
    res.status(500).json({ error: 'Sync pipeline failed', details: error.message });
  }
});

module.exports = router;
