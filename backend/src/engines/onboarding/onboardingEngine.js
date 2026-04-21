/**
 * Onboarding Engine
 * Defines the core steps for new user onboarding.
 */
const logger = require('../../utils/logger');

async function getSteps() {
  return [
    { id: 1, label: 'Input Thoughts', instruction: 'Type everything on your mind in the input field.' },
    { id: 2, label: 'Structured Output', instruction: 'NEXUS automatically decomposes your thoughts into cognitive units.' },
    { id: 3, label: 'Action Plan', instruction: 'Review your personalized task list and priorities.' },
    { id: 4, label: 'Advanced Features', instruction: 'Explore the Knowledge Graph and Decision Strategist.' }
  ];
}

module.exports = { getSteps };
