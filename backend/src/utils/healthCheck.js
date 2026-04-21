/**
 * Health Check Utility
 * Production-grade monitoring for NEXUS system status and uptime.
 */
exports.healthCheck = (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();
  
  res.status(200).json({
    status: "OK",
    system: "NEXUS Cognitive Engine",
    version: "1.0.0",
    uptime: `${Math.floor(uptime / 60)} minutes`,
    timestamp: new Date().toISOString(),
    metrics: {
      rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
    }
  });
};
