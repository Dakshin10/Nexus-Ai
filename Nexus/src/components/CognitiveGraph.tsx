import React, { useCallback, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNexusStore } from '../store/nexusStore';

interface CognitiveGraphProps {
  onNodeClick: (node: any) => void;
  isSyncing: boolean;
}

export const CognitiveGraph: React.FC<CognitiveGraphProps> = ({ onNodeClick, isSyncing }) => {
  const { bucketedTasks, autoMode } = useNexusStore();

  const graphData = useMemo(() => {
    const nodes: any[] = [
      // Input Layer
      { id: 'gmail', label: 'Gmail Stream', type: 'input', color: '#fb7185', val: 15 },
      { id: 'notion', label: 'Notion Hub', type: 'input', color: '#34d399', val: 15 },
      { id: 'user', label: 'User Context', type: 'input', color: '#818cf8', val: 15 },

      // Core Layer
      { id: 'ai-core', label: 'AI Synthesis', type: 'core', color: '#6366f1', val: 25 },
      { id: 'decision', label: 'Decision Engine', type: 'core', color: '#4f46e5', val: 20 },

      // Output Layer
      { id: 'doNow', label: 'DO NOW', type: 'output', color: '#f43f5e', val: 18 },
      { id: 'doNext', label: 'DO NEXT', type: 'output', color: '#f59e0b', val: 18 },
      { id: 'later', label: 'LATER', type: 'output', color: '#64748b', val: 18 },
    ];

    const links: any[] = [
      { source: 'gmail', target: 'ai-core' },
      { source: 'notion', target: 'ai-core' },
      { source: 'user', target: 'ai-core' },
      { source: 'ai-core', target: 'decision' },
      { source: 'decision', target: 'doNow' },
      { source: 'decision', target: 'doNext' },
      { source: 'decision', target: 'later' },
    ];

    // Dynamic Task Nodes
    const addTaskNodes = (tasks: any[], parentId: string) => {
      tasks.forEach((task, i) => {
        const taskId = `task-${parentId}-${i}`;
        nodes.push({
          id: taskId,
          label: task.task,
          type: 'task',
          priority: parentId,
          source: task.source,
          reasoning: task.reasoning,
          color: nodes.find(n => n.id === parentId)?.color + '99',
          val: 8
        });
        links.push({ source: parentId, target: taskId });
      });
    };

    addTaskNodes(bucketedTasks.doNow, 'doNow');
    addTaskNodes(bucketedTasks.doNext, 'doNext');
    addTaskNodes(bucketedTasks.later, 'later');

    return { nodes, links };
  }, [bucketedTasks]);

  const drawNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.label;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2);

    // Glow Effect
    ctx.shadowColor = node.color;
    ctx.shadowBlur = 10 / globalScale;

    // Node Circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = node.color;
    ctx.fill();

    // Node Label (if zoomed in enough)
    if (globalScale > 1.5 || node.type !== 'task') {
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, node.x, node.y + (node.val / 2) + fontSize);
    }
    
    ctx.shadowBlur = 0; // Reset for performance
  }, []);

  return (
    <div className="w-full h-full">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="label"
        nodeColor={n => n.color as string}
        nodeCanvasObject={drawNode}
        onNodeClick={onNodeClick}
        linkLabel={''}
        linkDirectionalParticles={isSyncing ? 4 : 0}
        linkDirectionalParticleSpeed={0.01}
        linkDirectionalParticleWidth={2}
        linkDirectionalParticleColor={() => '#818cf8'}
        linkWidth={1}
        linkColor={() => 'rgba(255, 255, 255, 0.05)'}
        backgroundColor="rgba(0,0,0,0)"
        cooldownTicks={100}
        d3VelocityDecay={0.3}
      />
    </div>
  );
};
