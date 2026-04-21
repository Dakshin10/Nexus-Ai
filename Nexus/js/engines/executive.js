window.Nexus = window.Nexus || {};

// Engine 3: Executive Reasoning Engine
Nexus.executive = function(classifiedData) {
  const thoughts = classifiedData.classified || [];
  const urgencyRe = [/\burgent\b/i, /\bdeadline\b/i, /\basap\b/i, /\bimmediately\b/i, /\bcritical\b/i, /\bemergency\b/i, /\btoday\b/i, /\btonight\b/i, /\boverdue\b/i, /\bby tomorrow\b/i];

  const isUrgent = t => urgencyRe.some(r => r.test(t));

  const tasks     = thoughts.filter(t => t.type === 'task');
  const ideas     = thoughts.filter(t => t.type === 'idea');
  const questions = thoughts.filter(t => t.type === 'question');
  const emotions  = thoughts.filter(t => t.type === 'emotion');
  const decisions = thoughts.filter(t => t.type === 'decision');
  const urgentItems = thoughts.filter(t => isUrgent(t.text)).map(t => t.text);

  let score = tasks.length * 5 + urgentItems.length * 15 + emotions.length * 8 + decisions.length * 7 + questions.length * 3 + ideas.length * 2;
  score = Math.min(score, 100);
  const status = score <= 30 ? 'green' : score <= 60 ? 'yellow' : 'red';

  const parts = [];
  if (tasks.length)     parts.push(`${tasks.length} task${tasks.length > 1 ? 's' : ''}`);
  if (decisions.length) parts.push(`${decisions.length} decision${decisions.length > 1 ? 's' : ''} to make`);
  if (questions.length) parts.push(`${questions.length} open question${questions.length > 1 ? 's' : ''}`);
  if (emotions.length)  parts.push('emotional weight present');

  let summary = parts.length
    ? `Active mental state with ${parts.join(', ')}.`
    : 'No significant cognitive load detected.';
  if (urgentItems.length)
    summary += ` ${urgentItems.length} item${urgentItems.length > 1 ? 's require' : ' requires'} immediate attention.`;

  const topPriority = urgentItems[0] || (tasks[0] && tasks[0].text) || (decisions[0] && decisions[0].text) || '';
  const recommendedAction = topPriority
    ? (isUrgent(topPriority) ? `Start immediately: "${topPriority}"` : `Begin with: "${topPriority}"`)
    : 'Clarify your goals before proceeding.';

  return {
    summary,
    urgent: urgentItems,
    top_priority: topPriority,
    recommended_action: recommendedAction,
    cognitive_load: { score, status },
    counts: { tasks: tasks.length, ideas: ideas.length, questions: questions.length, emotions: emotions.length, decisions: decisions.length }
  };
};
