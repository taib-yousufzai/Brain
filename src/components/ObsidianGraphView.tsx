'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Tool } from '@/types';
import ForceGraph from 'force-graph';
import { Sparkles, ExternalLink, Star, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

interface GraphNode {
  id: string;
  name: string;
  type: 'domain' | 'tool';
  domain: string;
  val: number;
  color: string;
  tool?: Tool;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  color: string;
}

const DOMAIN_COLORS: Record<string, string> = {
  SEO: '#ec4899', // Pink
  Development: '#6366f1', // Indigo
  Design: '#06b6d4', // Cyan
  Marketing: '#f59e0b', // Amber
  Copywriting: '#10b981', // Emerald
  DevOps: '#8b5cf6', // Violet
  'AI & Prompting': '#d946ef', // Magenta
  Productivity: '#3b82f6', // Blue
};

interface ObsidianGraphViewProps {
  tools: Tool[];
}

export default function ObsidianGraphView({ tools }: ObsidianGraphViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphInstanceRef = useRef<any>(null);

  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>('All');
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // 1. Build Graph Dataset
    const domainSet = new Set<string>();
    tools.forEach((t) => domainSet.add(t.domain));
    const domainList = Array.from(domainSet);

    const nodes: GraphNode[] = [];
    const links: GraphLink[] = [];

    // Add Domain Cluster Nodes
    domainList.forEach((dName) => {
      const color = DOMAIN_COLORS[dName] || '#6366f1';
      nodes.push({
        id: `domain-${dName}`,
        name: dName,
        type: 'domain',
        domain: dName,
        val: 32,
        color,
      });
    });

    // Add Tool Nodes & Edges
    tools.forEach((tool) => {
      const color = DOMAIN_COLORS[tool.domain] || '#a5b4fc';
      const nodeId = `tool-${tool.id}`;
      nodes.push({
        id: nodeId,
        name: tool.title,
        type: 'tool',
        domain: tool.domain,
        val: tool.rating >= 9.8 ? 10 : 5,
        color,
        tool,
      });

      links.push({
        source: `domain-${tool.domain}`,
        target: nodeId,
        color,
      });
    });

    // Add inter-domain connective links to draw clusters closer together
    for (let i = 0; i < domainList.length - 1; i++) {
      links.push({
        source: `domain-${domainList[i]}`,
        target: `domain-${domainList[i + 1]}`,
        color: 'rgba(255, 255, 255, 0.03)',
      });
    }

    // Filter nodes if domain selected
    const activeNodes = filterDomain === 'All'
      ? nodes
      : nodes.filter((n) => n.domain === filterDomain);
    const activeNodeIds = new Set(activeNodes.map((n) => n.id));
    const activeLinks = links.filter(
      (l) => activeNodeIds.has(l.source as string) && activeNodeIds.has(l.target as string)
    );

    // 2. Initialize Force Graph Engine
    const container = containerRef.current;
    container.innerHTML = ''; // Clear container

    const graph = (ForceGraph as any)()(container)
      .graphData({ nodes: activeNodes, links: activeLinks })
      .backgroundColor('#06070a')
      .width(container.clientWidth)
      .height(680)
      .nodeId('id')
      .nodeVal('val')
      .nodeColor((node: any) => node.color)
      .nodeLabel('')
      .linkWidth(0.8)
      .linkColor((link: any) => link.color || 'rgba(255, 255, 255, 0.1)')
      .linkDirectionalParticles(1)
      .linkDirectionalParticleWidth(1.8)
      .linkDirectionalParticleSpeed(0.006)
      .linkDirectionalParticleColor((link: any) => link.color)
      .d3VelocityDecay(0.25)
      .d3AlphaDecay(0.02)

      // Custom Canvas Node Painting
      .nodeCanvasObject((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const isDomain = node.type === 'domain';
        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedTool?.id === node.tool?.id;

        const radius = Math.max(2.5, Math.sqrt(node.val) * (isDomain ? 2.2 : 1.4));
        const fontSize = isDomain ? 14 / globalScale : 8.5 / globalScale;

        // Glowing Halo
        if (isDomain || isHovered || isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + (isHovered ? 5 : 3), 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color + (isDomain ? '40' : '60');
          ctx.fill();
        }

        // Node Circle Body
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = isDomain ? node.color : '#0f121d';
        ctx.strokeStyle = isSelected ? '#ffffff' : node.color;
        ctx.lineWidth = (isHovered || isSelected ? 2.2 : 1) / globalScale;
        ctx.fill();
        ctx.stroke();

        // Text Labels (Always show domain labels & hovered/selected tools)
        if (isDomain || globalScale > 1.1 || isHovered) {
          ctx.font = `${isDomain ? 'bold' : 'normal'} ${fontSize}px "Plus Jakarta Sans", sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = isDomain ? '#ffffff' : '#d1d5db';
          ctx.fillText(node.name, node.x, node.y + radius + (isDomain ? 12 : 8) / globalScale);
        }
      })
      .onNodeHover((node: any) => {
        setHoveredNode(node || null);
        container.style.cursor = node ? 'pointer' : 'default';
      })
      .onNodeClick((node: any) => {
        if (node.tool) {
          setSelectedTool(node.tool);
          graph.centerAt(node.x, node.y, 600);
          graph.zoom(2.8, 600);
        }
      });

    // Tighten physics attraction forces to bring clusters closer
    if (graph.d3Force('charge')) {
      graph.d3Force('charge').strength(-45); // Tighter repulsion keeps clusters closer
    }
    if (graph.d3Force('link')) {
      graph.d3Force('link').distance(40); // Tighter link distance
    }

    // Auto zoom closer to central graph
    setTimeout(() => {
      if (graphInstanceRef.current) {
        graphInstanceRef.current.zoomToFit(500, 180); // Higher padding zooms closer to graph core
      }
    }, 450);

    graphInstanceRef.current = graph;

    const handleResize = () => {
      if (containerRef.current && graphInstanceRef.current) {
        graphInstanceRef.current.width(containerRef.current.clientWidth);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (graphInstanceRef.current) {
        graphInstanceRef.current._destructor();
      }
    };
  }, [tools, filterDomain]);

  const handleZoomIn = () => {
    if (graphInstanceRef.current) {
      graphInstanceRef.current.zoom(graphInstanceRef.current.zoom() * 1.4, 300);
    }
  };

  const handleZoomOut = () => {
    if (graphInstanceRef.current) {
      graphInstanceRef.current.zoom(graphInstanceRef.current.zoom() / 1.4, 300);
    }
  };

  const handleZoomToFit = () => {
    if (graphInstanceRef.current) {
      graphInstanceRef.current.zoomToFit(400, 180);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.03] border border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
              Obsidian Knowledge Graph
            </h2>
          </div>
          <p className="text-xs text-gray-400 font-mono mt-0.5">
            {tools.length} active nodes indexed across {Object.keys(DOMAIN_COLORS).length} capability clusters
          </p>
        </div>

        {/* Filter & Camera Controls */}
        <div className="flex items-center gap-2">
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value)}
            className="bg-black/60 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono cursor-pointer"
          >
            <option value="All">All Domains Cluster ({tools.length} nodes)</option>
            {Object.keys(DOMAIN_COLORS).map((d) => {
              const count = tools.filter((t) => t.domain === d).length;
              return (
                <option key={d} value={d} className="bg-gray-900 text-white">
                  {d} Cluster ({count} nodes)
                </option>
              );
            })}
          </select>

          <div className="flex items-center gap-1 bg-black/40 border border-white/15 rounded-xl p-1">
            <button
              onClick={handleZoomIn}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomToFit}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Zoom To Fit"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Graph Area & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-[#06070a] overflow-hidden relative min-h-[680px]">
          <div ref={containerRef} className="w-full h-full block" />

          {/* Floating Tooltip */}
          {hoveredNode && (
            <div className="absolute top-4 left-4 p-3 rounded-xl bg-black/90 backdrop-blur-md border border-white/20 text-xs font-mono shadow-2xl pointer-events-none space-y-1 z-10">
              <div className="text-white font-bold flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: hoveredNode.color }}
                ></span>
                <span>{hoveredNode.name}</span>
              </div>
              <div className="text-gray-400 text-[11px]">
                Domain: <span className="text-indigo-300">{hoveredNode.domain}</span>
              </div>
              {hoveredNode.tool && (
                <div className="text-amber-400 text-[11px] font-bold">
                  Rating: {hoveredNode.tool.rating}/10
                </div>
              )}
            </div>
          )}
        </div>

        {/* Selected Tool Inspector Sidebar */}
        <div className="lg:col-span-1 p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Node Inspector</span>
              {selectedTool && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 text-[10px]">
                  {selectedTool.domain}
                </span>
              )}
            </div>

            {selectedTool ? (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                    {selectedTool.title}
                  </h3>
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{selectedTool.rating}/10</span>
                  </div>
                </div>

                <div className="text-xs text-cyan-300 font-mono">
                  Sub-Capability: <strong>{selectedTool.subCapability}</strong>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed font-sans">
                  {selectedTool.description}
                </p>

                {selectedTool.notes && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-gray-300 font-mono space-y-1">
                    <div className="text-indigo-400 font-semibold">Notes / Source:</div>
                    <div>{selectedTool.notes}</div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedTool.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded-md bg-white/5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-20 text-center space-y-2">
                <Sparkles className="w-8 h-8 text-gray-600 mx-auto" />
                <p className="text-xs text-gray-400 font-mono">
                  Click any node in the graph to inspect its details & link.
                </p>
              </div>
            )}
          </div>

          {selectedTool?.url && (
            <a
              href={selectedTool.url}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
            >
              <span>Visit Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
