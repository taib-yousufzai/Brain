'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import ForceGraph from 'force-graph';
import { Tool, Domain } from '@/types';

interface GraphNode {
  id: string;
  name: string;
  type: 'tool' | 'capability' | 'domain';
  domain?: Domain;
  rating?: number;
  val: number;
  color: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
  type: 'capability' | 'domain';
}

interface ObsidianGraphViewProps {
  tools: Tool[];
}

const DOMAIN_COLORS: Record<Domain, string> = {
  SEO: '#3b82f6',
  Development: '#10b981',
  Design: '#f59e0b',
  Marketing: '#ec4899',
  Copywriting: '#8b5cf6',
  DevOps: '#06b6d4',
  'AI & Prompting': '#6366f1',
  Productivity: '#64748b',
};

export default function ObsidianGraphView({ tools }: ObsidianGraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphInstanceRef = useRef<any>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterDomain, setFilterDomain] = useState<Domain | 'All'>('All');

  const graphData = useMemo(() => {
    const nodesMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];

    const activeTools = filterDomain === 'All'
      ? tools
      : tools.filter((t) => t.domain === filterDomain);

    activeTools.forEach((tool) => {
      const domainId = `domain-${tool.domain}`;
      if (!nodesMap.has(domainId)) {
        nodesMap.set(domainId, {
          id: domainId,
          name: tool.domain,
          type: 'domain',
          val: 18,
          color: DOMAIN_COLORS[tool.domain] || '#94a3b8',
        });
      }

      const capId = `cap-${tool.domain}-${tool.subCapability}`;
      if (!nodesMap.has(capId)) {
        nodesMap.set(capId, {
          id: capId,
          name: tool.subCapability,
          type: 'capability',
          domain: tool.domain,
          val: 11,
          color: DOMAIN_COLORS[tool.domain] || '#94a3b8',
        });

        links.push({
          source: capId,
          target: domainId,
          type: 'domain',
        });
      }

      const toolNodeId = tool.id;
      nodesMap.set(toolNodeId, {
        id: toolNodeId,
        name: tool.title,
        type: 'tool',
        domain: tool.domain,
        rating: tool.rating,
        val: 6,
        color: tool.rating >= 9.8 ? '#f59e0b' : DOMAIN_COLORS[tool.domain] || '#94a3b8',
      });

      links.push({
        source: toolNodeId,
        target: capId,
        type: 'capability',
      });
    });

    return {
      nodes: Array.from(nodesMap.values()),
      links,
    };
  }, [tools, filterDomain]);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = Math.min(550, Math.max(350, window.innerHeight * 0.55));
    const isMobile = window.innerWidth < 640;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createGraph = ForceGraph as any;
    const graph = createGraph()(containerRef.current)
      .width(width)
      .height(height)
      .backgroundColor('#0b0f17')
      .graphData(graphData)
      .linkColor(() => '#1e2638')
      .linkWidth(1.2)
      // Custom Node & Label Renderer with Font Cap to prevent mobile text overlap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .nodeCanvasObject((node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
        const label = node.name || '';
        // Cap font size between 3px and 12px relative to scale to prevent huge text overlap on mobile
        const fontSize = Math.min(12, Math.max(9 / globalScale, 3));
        const radius = Math.sqrt(node.val || 6) * 1.5;

        // Draw node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.color || '#3b82f6';
        ctx.fill();
        ctx.strokeStyle = '#1e2638';
        ctx.lineWidth = 1 / globalScale;
        ctx.stroke();

        // On small mobile viewports, show domain/capability labels always, and tool labels when zoomed or on desktop
        const shouldShowLabel = node.type !== 'tool' || globalScale >= 1.3 || !isMobile;

        if (shouldShowLabel) {
          ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = node.type === 'domain' ? '#ffffff' : node.type === 'capability' ? '#cbd5e1' : '#94a3b8';

          const displayLabel = isMobile && label.length > 18 ? label.slice(0, 16) + '..' : label;
          ctx.fillText(displayLabel, node.x + radius + 3, node.y);
        }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .onNodeClick((node: any) => setSelectedNode(node as GraphNode));

    // Increase node repulsion force to spread graph out cleanly
    if (graph.d3Force('charge')) {
      graph.d3Force('charge').strength(-140);
    }

    // Auto fit viewport after initialization
    setTimeout(() => {
      if (graphInstanceRef.current) {
        graphInstanceRef.current.zoomToFit(400, isMobile ? 40 : 20);
      }
    }, 500);

    graphInstanceRef.current = graph;

    const handleResize = () => {
      if (containerRef.current && graphInstanceRef.current) {
        const newWidth = containerRef.current.clientWidth || 800;
        const newHeight = Math.min(550, Math.max(350, window.innerHeight * 0.55));
        graphInstanceRef.current.width(newWidth).height(newHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [graphData]);

  const handleResetZoom = () => {
    if (graphInstanceRef.current) {
      const isMobile = window.innerWidth < 640;
      graphInstanceRef.current.zoomToFit(400, isMobile ? 40 : 20);
    }
  };

  return (
    <div className="bg-[#131823] border border-[#1e2638] rounded-lg p-4 sm:p-5 space-y-3 sm:space-y-4 font-sans">
      
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#1e2638] pb-3 sm:pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
            Force-Directed Knowledge Graph
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Interactive topology mapping domains, capabilities, and individual tools with visible labels.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-start">
          <select
            value={filterDomain}
            onChange={(e) => setFilterDomain(e.target.value as Domain | 'All')}
            className="bg-[#0b0f17] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white font-mono cursor-pointer"
          >
            <option value="All">All Domains</option>
            {Object.keys(DOMAIN_COLORS).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            onClick={handleResetZoom}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer active:scale-[0.98]"
          >
            Reset View
          </button>
        </div>
      </div>

      {/* Canvas Viewport Container */}
      <div className="relative min-h-[350px] sm:min-h-[450px] h-[400px] sm:h-[550px] bg-[#0b0f17] border border-[#1e2638] rounded overflow-hidden">
        <div ref={containerRef} className="w-full h-full" />

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 left-3 sm:left-auto bg-[#131823] border border-[#1e2638] p-3.5 rounded sm:max-w-xs text-xs font-mono space-y-2 text-slate-300 shadow-xl z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white uppercase text-[10px]">
                {selectedNode.type} Node
              </span>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-white cursor-pointer px-1"
              >
                x
              </button>
            </div>

            <div className="font-bold text-sm text-white">{selectedNode.name}</div>

            {selectedNode.domain && (
              <div>Domain: <span className="text-blue-400">{selectedNode.domain}</span></div>
            )}
            {selectedNode.rating !== undefined && (
              <div>Rating: <span className="text-amber-400">{selectedNode.rating}/10</span></div>
            )}
          </div>
        )}
      </div>

      {/* Graph Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono text-slate-400 pt-2 border-t border-[#1e2638]">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
          <span>Domain</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
          <span>Capability</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
          <span>Gold Tool (9.8+)</span>
        </div>
      </div>

    </div>
  );
}
