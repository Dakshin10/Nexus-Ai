const agentStore = require('../utils/agentStore');
const agentPipeline = require('../system/agentSystemPipeline');
const gmailIngestionEngine = require('../engines/external/gmailIngestionEngine');
const emailAIEngine = require('../engines/external/emailAIEngine');
const notesService = require('../services/notesService');
const notionAIEngine = require('../engines/external/notionAIEngine');
const documentAIEngine = require('../engines/external/documentAIEngine');
const taskDecisionEngine = require('../engines/decision/taskDecisionEngine');
const parserService = require('../services/parserService');
const logger = require('../utils/logger');

/**
 * Unified Agent Synchronization Handler
 * Merges Gmail communications, Notion workspace intelligence, and Document context.
 */
exports.handleUnifiedSync = async (req, res) => {
  const startTime = logger.time();
  logger.log('agent-controller', 'Starting Global Workspace Synthesis...');

  try {
    // 1. Concurrent Fetch (Gmail + Notion + Registered Docs)
    const [emails, notionPages, registeredDocs] = await Promise.all([
      gmailIngestionEngine.ingest({ count: 10, userId: 'me' }),
      notesService.listPages(),
      Promise.resolve(parserService.getRegistryContent())
    ]);

    // 2. AI Extraction Pass (Concurrent batches)
    const emailTasksPromise = emailAIEngine.process(emails);
    
    // Process Notion pages (Limit to top 5)
    const notionTasksPromise = Promise.all(
      notionPages.slice(0, 5).map(page => notionAIEngine.process(page))
    );

    // Process Documents
    const documentTasksPromise = Promise.all(
      registeredDocs.map(doc => documentAIEngine.process(doc.text, { filename: doc.filename }))
    );

    const [emailResults, notionResults, documentResults] = await Promise.all([
      emailTasksPromise,
      notionTasksPromise,
      documentTasksPromise
    ]);

    // 3. Aggregate results
    const flatNotionTasks = notionResults.flat();
    const flatDocumentTasks = documentResults.flat();
    const allTasks = [...emailResults, ...flatNotionTasks, ...flatDocumentTasks];

    // 4. Optimization Pass (Decision Engine)
    const optimized = taskDecisionEngine.optimize(allTasks);

    const duration = logger.timeEnd(startTime);
    logger.log('agent-controller', `Global Synthesis Complete (${duration})`);

    res.json({
      success: true,
      stats: {
        emails_scanned: emails.length,
        pages_scanned: notionPages.slice(0, 5).length,
        documents_scanned: registeredDocs.length,
        total_tasks_extracted: allTasks.length
      },
      tasks: optimized.doNow.concat(optimized.doNext, optimized.later), // Backwards compat
      bucketedTasks: {
        doNow: optimized.doNow,
        doNext: optimized.doNext,
        later: optimized.later
      },
      nextAction: optimized.nextAction
    });
  } catch (error) {
    logger.error('agent-controller', `Synthesis Failed: ${error.message}`);
    res.status(500).json({ error: 'Global sync failed', message: error.message });
  }
};

exports.handleStartGoal = async (req, res) => {
  const { goal, mode } = req.body;
  if (!goal) return res.status(400).json({ error: 'Goal is required' });

  const session = agentStore.createSession(goal, mode || 'approve');
  session.steps = agentPipeline.generatePlan(goal);
  session.total_steps = session.steps.length;

  const result = await agentPipeline.runIteration(session);
  res.json(result);
};

exports.handleApproveAction = async (req, res) => {
  const { sessionId } = req.body;
  const session = agentStore.getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  session.user_approved = true;
  const result = await agentPipeline.runIteration(session);
  res.json(result);
};

exports.handleGetStatus = (req, res) => {
  const { sessionId } = req.query;
  const session = agentStore.getSession(sessionId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
};
