/**
 * Weekly Controller
 */
const { processWeekly } = require('../engines/weekly/weeklyPipeline');
const logger = require('../utils/logger');

async function handleWeeklyReport(req, res) {
  const { data } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({
      error: 'Invalid request',
      message: 'Weekly data array is required in the request body.'
    });
  }

  try {
    const result = await processWeekly(data);
    return res.status(200).json(result);
  } catch (error) {
    logger.error('weekly-controller', `Weekly report failed: ${error.message}`);
    return res.status(500).json({
      error: 'Weekly report generation failed',
      message: error.message
    });
  }
}

module.exports = { handleWeeklyReport };
