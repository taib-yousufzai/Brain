'use client';

import React, { useState } from 'react';
import { Tool } from '@/types';

interface ContextPanelProps {
  tools: Tool[];
  activeContextName: string;
  setActiveContextName: (name: string) => void;
  onSelectTool: (tool: Tool) => void;
}

const CONTEXT_PRESETS = [
  'Building automated lead generation',
  'SEO Technical Audit & Scaling',
  'SaaS Core Product Architecture',
  'AI Agent Orchestration & Harness',
];

export default function ContextPanel({
  tools,
  activeContextName,
  setActiveContextName,
  onSelectTool,
}: ContextPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [contextInput, setContextInput] = useState(activeContextName);

  const handleSaveContext = (name: string) => {
    if (!name.trim()) return;
    setActiveContextName(name.trim());
    setIsEditing(false);
  };

  // Filter tools relevant to current context
  const relevantResources = tools.filter((t) => {
    const q = activeContextName.toLowerCase();
    return (
      t.domain === 'SEO' ||
      t.domain === 'Development' ||
      t.title.toLowerCase().includes('lead') ||
      t.description.toLowerCase().includes('crawl') ||
      t.subCapability.toLowerCase().includes('automation') ||
      q.includes(t.domain.toLowerCase())
    );
  });

  const relevantSkills = tools.filter((t) => t.category === 'skill' || t.domain === 'AI & Prompting');
  const knowledgeGaps = [
    { title: 'Link Acquisition & Outreach Automation', severity: 'high', status: 'missing' },
    { title: 'Real-time Webhook Ingestion', severity: 'medium', status: 'weak' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-12">
      
      {/* Active Context Header Banner */}
      <div className="p-5 sm:p-6 rounded-lg bg-[#12141c] border border-[#1e2230] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#161a26] pb-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>CURRENT CONTEXT (ACTIVE)</span>
            </div>

            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveContext(contextInput);
                }}
                className="flex items-center gap-2 mt-1"
              >
                <input
                  type="text"
                  value={contextInput}
                  onChange={(e) => setContextInput(e.target.value)}
                  className="bg-[#090a0f] border border-blue-500 rounded px-3 py-1.5 text-sm font-bold text-white focus:outline-none font-sans"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs rounded cursor-pointer"
                >
                  Save
                </button>
              </form>
            ) : (
              <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
                {activeContextName}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3 py-1.5 rounded bg-[#161a26] hover:bg-[#1f2434] border border-[#1e2230] text-slate-300 text-xs font-mono transition-colors cursor-pointer"
            >
              {isEditing ? 'Cancel' : 'Switch Context'}
            </button>
          </div>
        </div>

        {/* Preset Context Switchers */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
          <span className="text-slate-500 text-[11px]">Presets:</span>
          {CONTEXT_PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleSaveContext(preset)}
              className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                activeContextName === preset
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-[#171b26] text-slate-400 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Context Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded bg-[#12141c] border border-[#1e2230] space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Relevant Resources</div>
          <div className="text-xl font-bold text-white">{relevantResources.length}</div>
        </div>

        <div className="p-3.5 rounded bg-[#12141c] border border-[#1e2230] space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Useful Skills</div>
          <div className="text-xl font-bold text-white">{relevantSkills.length}</div>
        </div>

        <div className="p-3.5 rounded bg-[#12141c] border border-[#1e2230] space-y-1">
          <div className="text-[10px] text-slate-500 uppercase">Workflows</div>
          <div className="text-xl font-bold text-white">3</div>
        </div>

        <div className="p-3.5 rounded bg-[#12141c] border border-[#1e2230] space-y-1">
          <div className="text-[10px] text-amber-400/90 uppercase">Knowledge Gaps</div>
          <div className="text-xl font-bold text-amber-400">{knowledgeGaps.length}</div>
        </div>
      </div>

      {/* Recommended Context Resources */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#161a26] pb-2 font-mono">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Context Resources ({relevantResources.length})
          </h2>
          <span className="text-[11px] text-slate-500">Filtered for active focus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
          {relevantResources.slice(0, 6).map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool)}
              className="p-3.5 rounded bg-[#12141c] border border-[#1e2230] hover:border-slate-700 cursor-pointer space-y-2 group transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white group-hover:text-blue-400 font-sans text-sm">
                  {tool.title}
                </span>
                <span className="text-amber-400 font-bold text-[11px]">{tool.rating}/10</span>
              </div>
              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                {tool.description}
              </p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-[#161a26]">
                <span>Slot: {tool.subCapability}</span>
                <span>{tool.domain}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identified Knowledge Gaps */}
      <div className="space-y-3 pt-2">
        <div className="border-b border-[#161a26] pb-2 font-mono">
          <h2 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Context Knowledge Gaps
          </h2>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {knowledgeGaps.map((gap, idx) => (
            <div
              key={idx}
              className="p-3 rounded bg-[#12141c] border border-amber-900/40 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-amber-400">⚠️</span>
                <span className="text-slate-200 font-bold">{gap.title}</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px] uppercase">
                {gap.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
