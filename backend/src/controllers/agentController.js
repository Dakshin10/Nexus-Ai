/**
 * Agent Controller
 */
const agentStore = require('../utils/agentStore');
const agentPipeline = require('../system/agentSystemPipeline');

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
