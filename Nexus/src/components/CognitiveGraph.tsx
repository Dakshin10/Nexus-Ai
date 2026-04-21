import React, { useCallback, useMemo, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNexusStore } from '../store/nexusStore';

interface CognitiveGraphProps {
  onNodeClick?: (node: any) => void;
  isSyncing: boolean;
}

export type CognitiveGraphRef = {
  resetView: () => void;
};

const CognitiveGraph = forwardRef<CognitiveGraphRef, CognitiveGraphProps>(({ onNodeClick: parentOnNodeClick, isSyncing }, ref) => {
  const { bucketedTasks } = useNexusStore();
  const fgRef = useRef<any>();
  const [hoverNode, setHoverNode] = useState<any>(null);

  useImperativeHandle(ref, () => ({
    resetView: () => {
      if (fgRef.current) {
        fgRef.current.zoomToFit(1000);
      }
    }
  }));

  const graphData = useMemo(() => {
    // Standard Nodes as requested in Step 3
    const nodes: any[] = [
      { id: 'gmail', name: 'Gmail Stream', type: 'source', priority: 'high', color: '#a855f7', val: 20, description: 'Real-time email data stream' },
      { id: 'notion', name: 'Notion Hub', type: 'source', priority: 'high', color: '#a855f7', val: 20, description: 'Workspace documentation sink' },
      { id: 'ai-core', name: 'AI Synthesis', type: 'core', priority: 'high', color: '#6366f1', val: 28, description: 'GPT-4o-mini processing layer' },
      { id: 'doNow', name: 'DO NOW', type: 'agent', priority: 'high', color: '#3b82f6', val: 24, description: 'Immediate priority bucket' },
      { id: 'doNext', name: 'DO NEXT', type: 'agent', priority: 'medium', color: '#3b82f6', val: 24, description: 'Scheduled priority bucket' },
      { id: 'later', name: 'LATER', type: 'agent', priority: 'low', color: '#3b82f6', val: 24, description: 'Backlog bucket' },
    ];

    const links: any[] = [
      { source: 'gmail', target: 'ai-core' },
      { source: 'notion', target: 'ai-core' },
      { source: 'ai-core', target: 'doNow' },
      { source: 'ai-core', target: 'doNext' },
      { source: 'ai-core', target: 'later' },
    ];

    // Map Tasks to the graph
    const addTaskNodes = (tasks: any[], parentId: string) => {
      tasks.forEach((task, i) => {
        const taskId = `task-${parentId}-${i}`;
        nodes.push({
          id: taskId,
          name: task.task,
          type: 'task',
          priority: task.priority || 'medium',
          source: task.source,
          description: task.reasoning || 'AI-extracted task from workspace',
          color: '#22c55e', 
          val: 10 // Task nodes are smaller for hierarchy
        });
        links.push({ source: parentId, target: taskId });
      });
    };

    addTaskNodes(bucketedTasks.doNow, 'doNow');
    addTaskNodes(bucketedTasks.doNext, 'doNext');
    addTaskNodes(bucketedTasks.later, 'later');

    return { nodes, links };
  }, [bucketedTasks]);

  const handleNodeClick = useCallback((node: any) => {
    if (fgRef.current) {
      fgRef.current.centerAt(node.x, node.y, 1000);
      fgRef.current.zoom(4, 1000);
    }
    
    if (parentOnNodeClick) {
      parentOnNodeClick(node);
    }
  }, [parentOnNodeClick]);

  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const isHovered = hoverNode === node;
    const label = node.name || node.id;
    const fontSize = 12 / globalScale;
    
    ctx.fillStyle = node.color || "#6366f1";

    if (isHovered) {
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 15 / globalScale;
    }

    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
    ctx.fill();
    
    ctx.shadowBlur = 0;

    if (globalScale > 1.5 || node.type !== 'task') {
      ctx.font = `${fontSize}px Inter, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, node.x, node.y + (node.val / 2) + fontSize + 2);
    }
  }, [hoverNode]);

  return (
    <div className="w-full h-full relative">
      <ForceGraph2D
        ref={fgRef}
        graphData={graphData}
        nodeCanvasObject={drawNode}
        onNodeClick={handleNodeClick}
        onNodeHover={(node) => setHoverNode(node)}
        linkWidth={(link: any) =>
          link.source === hoverNode || link.target === hoverNode ? 3 : 1
        }
        linkColor={(link: any) => 
          link.source === hoverNode || link.target === hoverNode ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.05)'
        }
        enableZoomInteraction
        enablePanInteraction
        linkDirectionalParticles={isSyncing ? 4 : 0}
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={() => '#818cf8'}
        backgroundColor="rgba(0,0,0,0)"
        cooldownTicks={100}
        d3VelocityDecay={0.3}
      />
    </div>
  );
});

export default CognitiveGraph;
