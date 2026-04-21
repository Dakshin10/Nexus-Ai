window.Nexus = window.Nexus || {};

// Engine 5: Graph Relationship Engine
Nexus.generateRelations = function(nodesData) {
  const nodes = nodesData.nodes || [];
  const links = [];
  const connCount = {};
  nodes.forEach(n => { connCount[n.id] = 0; });

  function canConnect(a, b) {
    return a.id !== b.id && connCount[a.id] < 2 && connCount[b.id] < 2;
  }

  function linkExists(a, b) {
    return links.some(l => (l.source === a.id && l.target === b.id) || (l.source === b.id && l.target === a.id));
  }

  function addLink(a, b, type) {
    if (!canConnect(a, b) || linkExists(a, b)) return false;
    links.push({ source: a.id, target: b.id, type });
    connCount[a.id]++;
    connCount[b.id]++;
    return true;
  }

  function shareKeywords(a, b) {
    const stop = new Set(['the','and','for','this','that','with','from','have','will','they','been','were','your','when','what','which']);
    const aWords = new Set(a.id.toLowerCase().split(/\s+/).filter(w => w.length > 3 && !stop.has(w)));
    return b.id.toLowerCase().split(/\s+/).some(w => w.length > 3 && !stop.has(w) && aWords.has(w));
  }

  const byType = type => nodes.filter(n => n.type === type);
  const tasks = byType('task'), questions = byType('question');
  const decisions = byType('decision'), emotions = byType('emotion'), ideas = byType('idea');

  // decisions → tasks / questions
  decisions.forEach(dec => {
    const t = tasks.find(n => canConnect(dec, n));
    if (t) addLink(dec, t, 'leads_to');
    const q = questions.find(n => canConnect(dec, n));
    if (q) addLink(dec, q, 'relates_to');
  });

  // tasks → emotions
  tasks.forEach(task => {
    const e = emotions.find(n => canConnect(task, n) && shareKeywords(task, n));
    if (e) addLink(task, e, 'causes');
  });

  // ideas → tasks
  ideas.forEach(idea => {
    const t = tasks.find(n => canConnect(idea, n) && shareKeywords(idea, n));
    if (t) addLink(idea, t, 'leads_to');
  });

  // Sequential same-type links
  for (let i = 0; i < nodes.length - 1; i++) {
    const a = nodes[i], b = nodes[i + 1];
    if (a.type === b.type && canConnect(a, b)) addLink(a, b, 'relates_to');
  }

  // Connect any isolated nodes
  nodes.forEach(node => {
    if (connCount[node.id] === 0) {
      const candidate = nodes.find(n => n.id !== node.id && canConnect(node, n));
      if (candidate) addLink(node, candidate, 'relates_to');
    }
  });

  return { nodes, links };
};
