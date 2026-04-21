import React, { useCallback, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { motion } from "framer-motion";
import { 
  Network, 
  Search, 
  Filter, 
  Maximize2,
  RefreshCcw,
  Info
} from "lucide-react";
import { Button } from "./ui/button";

const mockData = {
  nodes: [
    { id: "Nexus Core", type: "core", val: 20 },
    { id: "Stream Engine", type: "engine", val: 12 },
    { id: "External Hub", type: "engine", val: 12 },
    { id: "Decision Engine", type: "engine", val: 12 },
    { id: "Prediction Engine", type: "engine", val: 12 },
    { id: "Agent Engine", type: "engine", val: 12 },
    { id: "Gmail API", type: "source", val: 8 },
    { id: "Notion", type: "source", val: 8 },
    { id: "User Input", type: "source", val: 10 },
    { id: "Cognitive Load", type: "metric", val: 6 },
    { id: "Memory Store", type: "core", val: 15 },
  ],
  links: [
    { source: "Nexus Core", target: "Stream Engine" },
    { source: "Nexus Core", target: "External Hub" },
    { source: "Nexus Core", target: "Decision Engine" },
    { source: "Nexus Core", target: "Prediction Engine" },
    { source: "Nexus Core", target: "Agent Engine" },
    { source: "Nexus Core", target: "Memory Store" },
    { source: "Stream Engine", target: "User Input" },
    { source: "External Hub", target: "Gmail API" },
    { source: "External Hub", target: "Notion" },
    { source: "Decision Engine", target: "Stream Engine" },
    { source: "Prediction Engine", target: "External Hub" },
    { source: "Agent Engine", target: "Decision Engine" },
    { source: "Memory Store", target: "Stream Engine" },
  ]
};

const colors: Record<string, string> = {
  core: "#8b5cf6", // Violet
  engine: "#3b82f6", // Blue
  source: "#10b981", // Emerald
  metric: "#f59e0b", // Amber
};

export const GraphView: React.FC = () => {
  const fgRef = useRef<any>();

  const paintNode = useCallback((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
    const label = node.id;
    const fontSize = 12 / globalScale;
    ctx.font = `${fontSize}px Inter, sans-serif`;
    const textWidth = ctx.measureText(label).width;
    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding

    const color = colors[node.type] || "#ffffff";
    
    // Glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = color;
    
    // Draw circle
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, node.val / 2, 0, 2 * Math.PI, false);
    ctx.fill();

    // Reset shadow for text
    ctx.shadowBlur = 0;

    // Draw Label
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.fillText(label, node.x, node.y + (node.val / 2) + 5);
  }, []);

  return (
    <div className="h-screen w-full relative bg-background overflow-hidden">
      {/* HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 p-10">
        <header className="flex justify-between items-start">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2"
            >
              <Network className="w-3 h-3" /> Cognitive Graph
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-black tracking-tighter"
            >
              Nexus Topology
            </motion.h1>
          </div>

          <div className="flex gap-3 pointer-events-auto">
            <Button variant="outline" className="rounded-full glass border-white/5 h-12 w-12 p-0">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="outline" className="rounded-full glass border-white/5 h-12 w-12 p-0">
              <Filter className="w-5 h-5" />
            </Button>
            <Button 
              onClick={() => fgRef.current?.zoomToFit(400)}
              variant="outline" 
              className="rounded-full glass border-white/5 h-12 w-12 p-0"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
          </div>
        </header>

        <footer className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
          <div className="glass rounded-2xl p-6 border-white/5 space-y-4 pointer-events-auto max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold uppercase tracking-widest">Graph Legend</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(colors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{type}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-4 pointer-events-auto">
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Active Connections</p>
                <p className="text-4xl font-black tabular-nums">1,242</p>
             </div>
             <Button className="rounded-full px-8 py-6 font-bold glow-primary">
                <RefreshCcw className="w-4 h-4 mr-2" /> Re-index Graph
             </Button>
          </div>
        </footer>
      </div>

      <ForceGraph2D
        ref={fgRef}
        graphData={mockData}
        backgroundColor="rgba(0,0,0,0)"
        nodeCanvasObject={paintNode}
        linkColor={() => "rgba(255, 255, 255, 0.08)"}
        linkWidth={1}
        nodeRelSize={6}
        autoPauseRedraw={false}
      />
    </div>
  );
};
