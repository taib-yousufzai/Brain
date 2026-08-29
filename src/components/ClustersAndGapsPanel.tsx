'use client';

import React, { useState, useMemo } from 'react';
import { Tool, Domain } from '@/types';
import { detectOverlapClusters, getDomainCapabilityMatrix } from '@/lib/capabilityGraph';

interface ClustersAndGapsPanelProps {
  tools: Tool[];
}

const DOMAIN_LIST: Domain[] = ['SEO', 'Development', 'Design', 'Marketing', 'Copywriting'];

export default function ClustersAndGapsPanel({ tools }: ClustersAndGapsPanelProps) {
  const [selectedDomain, setSelectedDomain] = useState<Domain>('SEO');

  const overlapClusters = useMemo(() => detectOverlapClusters(tools), [tools]);
  const domainMatrix = useMemo(
    () => getDomainCapabilityMatrix(selectedDomain, tools),
    [selectedDomain, tools]
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Overview Header */}
      <div className="bg-[#12141c] border border-[#1e2230] p-5 sm:p-6 rounded-lg space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
          Capability Overlaps & Knowledge Gap Engine
        </h1>
        <p className="text-xs text-slate-400 font-sans">
          Maps redundant tool clusters to eliminate software bloat and identifies weak or missing capabilities in your personal stack.
        </p>
      </div>

      {/* SECTION 1: OVERLAP CLUSTERS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-amber-400">⚡</span> Overlapping Capability Clusters ({overlapClusters.length})
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Auto-grouped by sub-capability slot
          </span>
        </div>

        {overlapClusters.length === 0 ? (
          <div className="bg-[#131823] border border-[#1e2638] p-6 rounded-lg text-center text-xs font-mono text-slate-400">
            No overlapping tool clusters detected. All capabilities have distinct tool allocations.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {overlapClusters.map((cluster) => (
              <div
                key={cluster.id}
                className="bg-[#131823] border border-[#1e2638] p-5 rounded-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-bold">
                      Domain: {cluster.domain}
                    </span>
                    <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] mt-1">
                      {cluster.capabilityName} Slot
                    </h3>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
                    {cluster.allMembers.length} Competing Tools
                  </span>
                </div>

                {/* Best Overall Champion */}
                <div className="bg-[#0b0f17] border border-emerald-500/40 p-3.5 rounded-md space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="text-emerald-400">★</span> BEST OVERALL CHAMPION
                    </span>
                    <span className="text-emerald-400 font-bold">{cluster.bestOverall.rating}/10</span>
                  </div>
                  <p className="text-sm font-bold text-white">{cluster.bestOverall.title}</p>
                  <p className="text-xs text-slate-300 font-sans">{cluster.bestOverall.description}</p>
                </div>

                {/* Specialized & Alternatives */}
                {(cluster.specialized.length > 0 || cluster.alternatives.length > 0) && (
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-slate-400 font-bold">
                      RECOMMENDED ALTERNATIVES & SPECIALIZED USES
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {cluster.specialized.map((spec, i) => (
                        <div
                          key={i}
                          className="bg-[#0b0f17] border border-blue-800 p-2.5 rounded text-xs space-y-1"
                        >
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-blue-300 font-bold">{spec.tool.title}</span>
                            <span className="text-slate-400">{spec.tool.rating}/10</span>
                          </div>
                          <p className="text-[11px] text-blue-400 font-mono">Use case: {spec.useCase}</p>
                        </div>
                      ))}

                      {cluster.alternatives.map((alt) => (
                        <div
                          key={alt.id}
                          className="bg-[#0b0f17] border border-slate-800 p-2.5 rounded text-xs space-y-1"
                        >
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-slate-200 font-bold">{alt.title}</span>
                            <span className="text-slate-400">{alt.rating}/10</span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{alt.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explicit Non-Recommendations */}
                {cluster.notRecommended.length > 0 && (
                  <div className="bg-[#0b0f17] border border-amber-900/50 p-3 rounded-md space-y-2">
                    <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1.5">
                      <span>⚠️</span> EXCLUDED REDUNDANT TOOLS (NON-RECOMMENDED RATIONALE)
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {cluster.notRecommended.map((nr, idx) => (
                        <li key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] font-mono border-t border-slate-800/80 pt-1">
                          <span className="text-slate-200 font-bold">{nr.tool.title} ({nr.tool.rating}/10)</span>
                          <span className="text-amber-300/90 text-right">{nr.reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: KNOWLEDGE GAP ANALYSIS */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span className="text-blue-400">📊</span> Knowledge Gap & Capability Coverage Matrix
          </h2>
          
          <div className="flex items-center gap-1">
            {DOMAIN_LIST.map((domain) => (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  selectedDomain === domain
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {domain}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#131823] border border-[#1e2638] p-5 rounded-lg space-y-4">
          <h3 className="text-xs font-mono font-bold text-white">
            {selectedDomain} Domain Capabilities Status
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {domainMatrix.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded-md space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{item.capability}</span>
                  {item.status === 'covered' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                      COVERED ({item.count})
                    </span>
                  )}
                  {item.status === 'weak' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                      SINGLE TOOL (WEAK)
                    </span>
                  )}
                  {item.status === 'missing' && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-400 border border-red-800 font-bold">
                      GAP / MISSING
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-slate-400 border-t border-slate-800/80 pt-2 space-y-1">
                  <p className="text-slate-300">Best Available: <span className="text-white font-bold">{item.bestTool.title}</span></p>
                  <p>Rating: <span className="text-amber-400 font-bold">{item.bestTool.rating}/10</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
