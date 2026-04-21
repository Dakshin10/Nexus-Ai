window.Nexus = window.Nexus || {};

// Engine 6: Graph Optimizer
Nexus.optimizeGraph = function(graphData) {
  const nodes = [...(graphData.nodes || [])];
  let links = [...(graphData.links || [])];

  // Remove self-links
  links = links.filter(l => l.source !== l.target);

  // Remove duplicates
  const seen = new Set();
  links = links.filter(l => {
    const k1 = `${l.source}--${l.target}`, k2 = `${l.target}--${l.source}`;
    if (seen.has(k1) || seen.has(k2)) return false;
    seen.add(k1);
    return true;
  });

  // Enforce max 2 connections per node
  const cnt = {};
  nodes.forEach(n => { cnt[n.id] = 0; });
  const finalLinks = [];
  links.forEach(l => {
    if (cnt[l.source] < 2 && cnt[l.target] < 2) {
      finalLinks.push(l);
      cnt[l.source]++;
      cnt[l.target]++;
    }
  });

  return { nodes, links: finalLinks };
};

// Engine 7: Graph Visualizer
Nexus.visualizeGraph = function(graphData) {
  const colorMap = { task: '#00d4ff', idea: '#a855f7', question: '#eab308', emotion: '#ef4444', decision: '#22c55e' };
  const strengthMap = { causes: 3, blocks: 3, leads_to: 2, relates_to: 1 };

  const nodes = (graphData.nodes || []).map(n => ({
    ...n,
    color: colorMap[n.type] || '#888',
    group: n.type,
    size: Math.max(2, n.weight * 2)
  }));

  const links = (graphData.links || []).map(l => ({
    ...l,
    strength: strengthMap[l.type] || 1
  }));

  return { nodes, links };
};
