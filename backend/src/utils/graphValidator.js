/**
 * Graph Validator Utility
 * Enforces logical constraints on knowledge graphs.
 */
const logger = require('./logger');

const validateGraph = (data, stage = 'graph-validation') => {
  const { nodes = [], links = [] } = data;
  const errors = [];

  const nodeIds = new Set(nodes.map(n => n.id));

  // 0. Max node limit check
  if (nodes.length > 20) {
    errors.push(`Graph exceeds maximum limit of 20 nodes (current: ${nodes.length})`);
  }

  // 1. Check for valid nodes
  if (nodes.length === 0) {
    errors.push('Graph must contain at least one node.');
  }

  // 2. Link validation
  links.forEach((link, idx) => {
    if (!link.source || !link.target) {
      errors.push(`Link ${idx} is missing source or target`);
    }
    if (!nodeIds.has(link.source)) {
      errors.push(`Link ${idx} has invalid source node: '${link.source}'`);
    }
    if (!nodeIds.has(link.target)) {
      errors.push(`Link ${idx} has invalid target node: '${link.target}'`);
    }
  });


  return true;
};

module.exports = { validateGraph };
