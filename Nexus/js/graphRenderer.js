window.Nexus = window.Nexus || {};

Nexus.GraphRenderer = {
  svg: null,
  simulation: null,

  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 500;

    this.svg = d3.select(`#${containerId}`)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${w} ${h}`);

    this.svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 20).attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 6).attr('markerHeight', 6)
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', 'rgba(255,255,255,0.3)');

    this.g = this.svg.append('g');

    // Zoom
    const zoom = d3.zoom().scaleExtent([0.3, 3])
      .on('zoom', e => this.g.attr('transform', e.transform));
    this.svg.call(zoom);

    return { w, h };
  },

  render(graphData) {
    const container = document.getElementById('graph-container');
    if (!container) return;
    const dims = this.init('graph-container');
    if (!dims) return;
    const { w, h } = dims;

    const nodes = graphData.nodes.map(n => ({ ...n }));
    const links = graphData.links.map(l => ({ ...l }));

    this.simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(120).strength(0.5))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(w / 2, h / 2))
      .force('collision', d3.forceCollide().radius(d => d.size * 4 + 20));

    // Links
    const link = this.g.append('g').selectAll('line')
      .data(links).join('line')
      .attr('stroke', l => {
        const colors = { causes: '#ef4444', leads_to: '#00d4ff', relates_to: 'rgba(255,255,255,0.2)', blocks: '#eab308' };
        return colors[l.type] || 'rgba(255,255,255,0.2)';
      })
      .attr('stroke-width', l => l.strength || 1)
      .attr('stroke-dasharray', l => l.type === 'relates_to' ? '4,4' : null)
      .attr('marker-end', 'url(#arrowhead)');

    // Link labels
    const linkLabel = this.g.append('g').selectAll('text')
      .data(links).join('text')
      .text(l => l.type.replace('_', ' '))
      .attr('font-size', '9px')
      .attr('fill', 'rgba(255,255,255,0.4)')
      .attr('text-anchor', 'middle');

    // Node groups
    const node = this.g.append('g').selectAll('g')
      .data(nodes).join('g')
      .attr('class', 'graph-node')
      .call(d3.drag()
        .on('start', (e, d) => {
          if (!e.active) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x; d.fy = d.y;
        })
        .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y; })
        .on('end', (e, d) => {
          if (!e.active) this.simulation.alphaTarget(0);
          d.fx = null; d.fy = null;
        })
      )
      .on('click', (e, d) => Nexus.App && Nexus.App.onNodeClick && Nexus.App.onNodeClick(d));

    // Glow circles
    node.append('circle')
      .attr('r', d => d.size * 4 + 6)
      .attr('fill', d => d.color + '15')
      .attr('filter', 'blur(4px)');

    // Main circles
    node.append('circle')
      .attr('r', d => d.size * 4)
      .attr('fill', d => d.color + '22')
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2);

    // Labels
    node.append('text')
      .text(d => d.id.length > 30 ? d.id.substring(0, 28) + '…' : d.id)
      .attr('text-anchor', 'middle')
      .attr('dy', d => d.size * 4 + 14)
      .attr('font-size', '10px')
      .attr('fill', 'rgba(255,255,255,0.75)')
      .attr('pointer-events', 'none');

    // Type badges
    node.append('text')
      .text(d => d.type.charAt(0).toUpperCase())
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('font-size', d => d.size * 3 + 'px')
      .attr('fill', d => d.color)
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none');

    this.simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
      linkLabel
        .attr('x', d => (d.source.x + d.target.x) / 2)
        .attr('y', d => (d.source.y + d.target.y) / 2);
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });
  },

  clear() {
    const container = document.getElementById('graph-container');
    if (container) container.innerHTML = '<div class="graph-empty">Enter text and run the pipeline to generate your knowledge graph</div>';
    if (this.simulation) { this.simulation.stop(); this.simulation = null; }
  }
};
