import React, { useState } from 'react';
import { 
  Cpu, Plus, Download, Copy, Check, 
  Trash2, RefreshCw, Server, Database, Globe, 
  ShieldCheck, Cloud, Terminal, Sparkles 
} from 'lucide-react';

const NODE_PRESETS = [
  { id: 'client', label: 'Next.js 15 Client', icon: 'Globe', type: 'Frontend', color: 'from-blue-500 to-indigo-600' },
  { id: 'gateway', label: 'Cloudflare / API Gateway', icon: 'Server', type: 'Gateway', color: 'from-orange-500 to-amber-600' },
  { id: 'service', label: 'FastAPI Agent Worker', icon: 'Terminal', type: 'Backend', color: 'from-emerald-500 to-teal-600' },
  { id: 'llm', label: 'Claude 3.5 Sonnet Engine', icon: 'Cpu', type: 'AI Model', color: 'from-purple-500 to-pink-600' },
  { id: 'vector', label: 'Pinecone Vector DB', icon: 'Database', type: 'Vector Store', color: 'from-violet-500 to-indigo-700' },
  { id: 'redis', label: 'Redis Event Stream', icon: 'Server', type: 'Cache', color: 'from-rose-500 to-red-600' },
  { id: 'db', label: 'PostgreSQL Primary DB', icon: 'Database', type: 'Storage', color: 'from-cyan-600 to-blue-700' }
];

export default function ArchitectureDiagramBuilder() {
  const [nodes, setNodes] = useState([
    { id: 'n1', label: 'React / Next.js Client', type: 'Frontend', x: 60, y: 180, color: 'from-blue-500 to-indigo-600' },
    { id: 'n2', label: 'API Gateway & Rate Limiter', type: 'Gateway', x: 280, y: 180, color: 'from-orange-500 to-amber-600' },
    { id: 'n3', label: 'FastAPI Microservice Cluster', type: 'Backend', x: 500, y: 180, color: 'from-emerald-500 to-teal-600' },
    { id: 'n4', label: 'Claude 3.5 Agent Loop', type: 'AI Engine', x: 740, y: 100, color: 'from-purple-500 to-pink-600' },
    { id: 'n5', label: 'PostgreSQL + pgvector', type: 'Database', x: 740, y: 260, color: 'from-cyan-600 to-blue-700' }
  ]);

  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [copiedMermaid, setCopiedMermaid] = useState(false);

  // Dragging node logic
  const [draggingId, setDraggingId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, node) => {
    e.stopPropagation();
    setSelectedNodeId(node.id);
    setDraggingId(node.id);
    setDragOffset({
      x: e.clientX - node.x,
      y: e.clientY - node.y
    });
  };

  const handleMouseMove = (e) => {
    if (!draggingId) return;
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const newX = Math.max(20, Math.min(840, e.clientX - dragOffset.x));
    const newY = Math.max(20, Math.min(480, e.clientY - dragOffset.y));

    setNodes(prev => prev.map(n => n.id === draggingId ? { ...n, x: newX, y: newY } : n));
  };

  const handleMouseUp = () => {
    setDraggingId(null);
  };

  const handleAddNode = (preset) => {
    const newNode = {
      id: `n-${Date.now()}`,
      label: preset.label,
      type: preset.type,
      x: 350 + Math.floor(Math.random() * 80),
      y: 150 + Math.floor(Math.random() * 80),
      color: preset.color
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleDeleteNode = (id) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  const generateMermaid = () => {
    let code = "graph LR\n";
    nodes.forEach(n => {
      code += `  ${n.id}["${n.label} (${n.type})"]\n`;
    });
    // Add default sequential flows
    for (let i = 0; i < nodes.length - 1; i++) {
      code += `  ${nodes[i].id} --> ${nodes[i+1].id}\n`;
    }
    return code;
  };

  const handleCopyMermaid = () => {
    navigator.clipboard.writeText(generateMermaid());
    setCopiedMermaid(true);
    setTimeout(() => setCopiedMermaid(false), 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col h-full overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-sm">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 font-sans">
              System Architecture Diagram Builder
            </h2>
            <p className="text-[11px] text-slate-500 font-sans">
              Drag-and-drop system components to illustrate your hackathon stack to judges.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyMermaid}
            className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
          >
            {copiedMermaid ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMermaid ? 'Copied Mermaid!' : 'Copy Mermaid Code'}</span>
          </button>
        </div>
      </div>

      {/* Preset Nodes Palettes Bar */}
      <div className="bg-slate-100/90 px-4 py-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase shrink-0">+ Add Component:</span>
        {NODE_PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleAddNode(p)}
            className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-indigo-400 text-slate-800 text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0 hover:scale-102 transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Main Canvas Area */}
      <div 
        className="flex-1 relative bg-slate-900 overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => setSelectedNodeId(null)}
      >
        {/* Background Blueprint Grid */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(#6366F1 1px, transparent 1px), linear-gradient(90deg, #6366F1 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Connection flow lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366F1" />
            </marker>
          </defs>
          {nodes.map((n, i) => {
            if (i >= nodes.length - 1) return null;
            const next = nodes[i + 1];
            return (
              <line
                key={`line-${i}`}
                x1={n.x + 85}
                y1={n.y + 35}
                x2={next.x + 85}
                y2={next.y + 35}
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeDasharray="5,5"
                markerEnd="url(#arrow)"
                className="opacity-75"
              />
            );
          })}
        </svg>

        {/* Interactive Draggable Nodes */}
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;
          return (
            <div
              key={node.id}
              onMouseDown={(e) => handleMouseDown(e, node)}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`,
                position: 'absolute'
              }}
              className={`w-44 p-3 rounded-2xl bg-slate-800 text-white border-2 shadow-xl z-20 cursor-grab active:cursor-grabbing transition-transform ${
                isSelected ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105' : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded bg-black/40 text-slate-300">
                  {node.type}
                </span>
                {isSelected && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteNode(node.id); }}
                    className="p-0.5 rounded hover:bg-red-500/20 text-red-400"
                    title="Delete Node"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>

              <input
                type="text"
                value={node.label}
                onChange={(e) => {
                  const val = e.target.value;
                  setNodes(nodes.map(n => n.id === node.id ? { ...n, label: val } : n));
                }}
                className="w-full bg-transparent font-bold text-xs border-none outline-none text-white focus:bg-slate-700/50 rounded px-1"
              />

              <div className="mt-2 pt-1 border-t border-slate-700/60 flex items-center justify-between text-[9px] font-mono text-slate-400">
                <span>Docker Container</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          );
        })}

        {/* Floating Controls Overlay */}
        <div className="absolute bottom-5 left-6 bg-slate-800/90 text-slate-300 rounded-xl border border-slate-700 px-3 py-2 text-xs font-mono backdrop-blur z-30">
          💡 Click and drag nodes to rearrange pipeline architecture.
        </div>
      </div>

    </div>
  );
}
