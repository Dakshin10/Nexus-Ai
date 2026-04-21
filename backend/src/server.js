/**
 * NEXUS Backend Server
 * Entry point for the Cognitive Stream Engine.
 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const streamRoutes = require('./routes/streamRoutes');
const graphRoutes = require('./routes/graphRoutes');
const uiRoutes = require('./routes/uiRoutes');
const decisionRoutes = require('./routes/decisionRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const orchestratorRoutes = require('./routes/orchestratorRoutes');
const predictionRoutes = require('./routes/predictionRoutes');
const weeklyRoutes = require('./routes/weeklyRoutes');
const externalRoutes = require('./routes/externalRoutes');
const onboardingRoutes = require('./routes/onboardingRoutes');
const agentRoutes = require('./routes/agentRoutes');
const evaluationRoutes = require('./routes/evaluationRoutes');

const systemRoutes = require('./routes/systemRoutes');
const gmailRoutes = require('./routes/gmailRoutes');
const integrationsRoutes = require('./routes/integrationsRoutes');
const syncRoutes = require('./routes/syncRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
const proactiveRoutes = require('./routes/proactiveRoutes');
const proactiveService = require('./proactiveService');

app.use('/api', streamRoutes);
app.use('/api', graphRoutes);
app.use('/api', decisionRoutes);
app.use('/api/memory', memoryRoutes);
app.use('/api/ui', uiRoutes);
app.use('/api/orchestrate', orchestratorRoutes);
app.use('/api/predict', predictionRoutes);
app.use('/api/weekly', weeklyRoutes);
app.use('/api/external', externalRoutes);
app.use('/api/evaluate', evaluationRoutes);
app.use('/api/system', systemRoutes);
app.use('/api/proactive', proactiveRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/integrations/gmail', gmailRoutes);
app.use('/api/integrations', integrationsRoutes);
app.use('/api/integrations', syncRoutes);
app.use('/api', uploadRoutes);

// Start Proactive Intelligence Loop (Every 60s)
proactiveService.start(60000);

// Validate Integrations
const notesService = require('./services/notesService');
notesService.validateConnection();

// Health Check
app.get('/health', (req, res) => res.status(200).send('OK'));

app.listen(PORT, () => {
  logger.log('server', `NEXUS Stream Engine active on port ${PORT}`);
});
