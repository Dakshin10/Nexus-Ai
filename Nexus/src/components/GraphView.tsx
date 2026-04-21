import React, { useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useNexusStore } from '../store/nexusStore';
import { motion, AnimatePresence } from 'framer-motion';

export const GraphView: React.FC = () => {
  const { isGraphVisible } = useNexusStore();

  const data = useMemo(() => {
    const nodes = [
      { id: 'Nexus', group: 1, size: 20 },
      { id: 'Stream', group: 2, size: 10 },
      { id: 'Agent', group: 2, size: 12 },
      { id: 'Email', group: 3, size: 8 },
      { id: 'Docs', group: 3, size: 8 },
      { id: 'Task A', group: 4, size: 6 },
      { id: 'Task B', group: 4, size: 6 },
    ];
    const links = [
      { source: 'Nexus', target: 'Stream' },
      { source: 'Nexus', target: 'Agent' },
      { source: 'Stream', target: 'Email' },
      { source: 'Stream', target: 'Docs' },
      { source: 'Agent', target: 'Task A' },
      { source: 'Agent', target: 'Task B' },
    ];
    return { nodes, links };
  }, []);

  return (
    <AnimatePresence>
      {isGraphVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xl flex items-center justify-center p-20"
        >
          <div className="w-full h-full rounded-[3rem] border border-white/10 bg-black/40 overflow-hidden relative shadow-[0_0_100px_rgba(99,102,241,0.1)]">
            <ForceGraph2D
              graphData={data}
              nodeLabel="id"
              nodeAutoColorBy="group"
              backgroundColor="rgba(0,0,0,0)"
              linkColor={() => 'rgba(255,255,255,0.1)'}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.id;
                const fontSize = 12 / globalScale;
                ctx.font = `${fontSize}px Inter`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = node.color;
                ctx.beginPath();
                ctx.arc(node.x, node.y, node.size || 5, 0, 2 * Math.PI, false);
                ctx.fill();
                
                ctx.fillStyle = 'rgba(255,255,255,0.8)';
                ctx.fillText(label, node.x, node.y + (node.size || 5) + 5);
              }}
            />
            
            <div className="absolute top-10 left-10 space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">Cognitive Map</h2>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-widest">Real-time dependency graph</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
