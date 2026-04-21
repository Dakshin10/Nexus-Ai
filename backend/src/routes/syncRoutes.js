const express = require('express');
const router = express.Router();
const gmailIngestionEngine = require('../engines/external/gmailIngestionEngine');
const emailAIEngine = require('../engines/external/emailAIEngine');
const notesService = require('../services/notesService');

/**
 * @route   POST /api/integrations/sync
 * @desc    Full pipeline: Gmail -> AI -> Nexus Decision Engine
 */
router.post('/sync', async (req, res) => {
  const userId = req.body.userId || req.query.userId || 'user_1';
  
  const results = {
    total_emails: 0,
    tasks_extracted: 0,
    notion_synced: 0,
    bucketedTasks: {
      doNow: [],
      doNext: [],
      later: []
    },
    errors: []
  };

  try {
    console.log(`[SyncEngine] Starting Full Orchestration for user: ${userId}`);

    // 1. Ingest from Gmail
    const emails = await gmailIngestionEngine.ingest({ count: 10, userId });
    results.total_emails = emails.length;

    if (emails.length === 0) {
      return res.json({ 
        message: 'No new emails to sync', 
        results 
      });
    }

    // 2. AI Processing (Extract Bucketed Tasks)
    const bucketedTasks = await emailAIEngine.process(emails);
    results.bucketedTasks = bucketedTasks;
    
    const allTasks = [
      ...bucketedTasks.doNow,
      ...bucketedTasks.doNext,
      ...bucketedTasks.later
    ];
    results.tasks_extracted = allTasks.length;

    if (allTasks.length === 0) {
      return res.json({ 
        message: 'No actionable tasks found', 
        results 
      });
    }

    // 3. Sync to Notion (Optional/Secondary)
    // We sync all extracted tasks to Notion for persistence
    const syncPromises = allTasks.map(async (insight) => {
      try {
        const page = await notesService.createTaskPage({
          task: insight.task,
          priority: insight.priority || 'medium',
          source: 'gmail',
          context: insight.reasoning,
          userId // Pass userId to ensure correct Notion integration is used
        });
        if (page && !page.cached) {
          results.notion_synced++;
        }
      } catch (err) {
        console.error(`[SyncEngine] Failed to sync task to Notion: ${insight.task}`, err.message);
        results.errors.push({ task: insight.task, error: err.message });
      }
    });

    // Execute Notion sync in background-ish or wait for it
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
