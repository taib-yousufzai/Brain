'use client';

import React, { useState } from 'react';
import { Tool, Domain } from '@/types';

interface ToolLibraryPanelProps {
  tools: Tool[];
  onDeleteTool: (id: string) => void;
}

const ALL_DOMAINS: (Domain | 'All')[] = [
  'All',
  'SEO',
  'Development',
  'Design',
  'Marketing',
  'Copywriting',
  'DevOps',
  'AI & Prompting',
  'Productivity',
];

const POPULAR_TAGS = [
  'gold-tier',
  'ai-slop-killer',
  'mcp',
  'seo',
  'copywriter-killer',
  'humanizer',
  'conversion',
  'yagni',
  'micro-interactions',
];

export default function ToolLibraryPanel({ tools, onDeleteTool }: ToolLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const filteredTools = tools.filter((tool) => {
    const matchesDomain = selectedDomain === 'All' || tool.domain === selectedDomain;
    const matchesTag = !selectedTag || tool.tags.some((t) => t.toLowerCase() === selectedTag.toLowerCase());

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.subCapability.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q));

    return matchesDomain && matchesTag && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 font-sans">
      
      {/* Search & Domain Filter Control Bar */}
      <div className="bg-[#12141c] border border-[#1e2230] p-4 sm:p-5 rounded-lg space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tools by keyword, slot, or domain..."
            className="w-full sm:w-80 md:w-96 bg-[#090a0f] border border-[#1e2230] rounded px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
          />

          <div className="text-xs font-mono text-slate-400 self-end sm:self-auto">
            Showing <strong className="text-white">{filteredTools.length}</strong> of {tools.length} Indexed Items
          </div>
        </div>

        {/* Domain Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {ALL_DOMAINS.map((domain) => {
            const isActive = selectedDomain === domain;
            const count = domain === 'All' ? tools.length : tools.filter((t) => t.domain === domain).length;

            return (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-md text-xs font-mono transition-colors cursor-pointer whitespace-nowrap active:scale-[0.98] ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {domain} ({count})
              </button>
            );
          })}
        </div>

        {/* Tag Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800 text-[11px] font-mono">
          <span className="text-slate-500 mr-1">Tags:</span>
          {POPULAR_TAGS.map((tag) => {
            const isTagActive = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isTagActive ? null : tag)}
                className={`px-2 py-0.5 rounded transition-colors cursor-pointer active:scale-[0.98] ${
                  isTagActive
                    ? 'bg-blue-950 text-blue-300 border border-blue-600 font-bold'
                    : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                #{tag}
              </button>
            );
          })}
          {selectedTag && (
            <button
              onClick={() => setSelectedTag(null)}
              className="text-rose-400 hover:underline cursor-pointer ml-2"
            >
              Clear Tag
            </button>
          )}
        </div>
      </div>

      {/* View Options: Mobile Cards vs Desktop Table */}
      {filteredTools.length === 0 ? (
        <div className="bg-[#131823] border border-[#1e2638] p-8 sm:p-10 rounded-lg text-center space-y-3">
          <p className="text-xs text-slate-400 font-mono">No matching tools found for current query.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('All');
              setSelectedTag(null);
            }}
            className="px-3.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer active:scale-[0.98]"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          
          {/* Mobile Card List (Screen < md) */}
          <div className="block md:hidden space-y-3">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className="bg-[#131823] border border-[#1e2638] p-4 rounded-lg space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono text-[10px] font-bold uppercase">
                      TOOL
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                      {tool.domain}
                    </span>
                  </div>

                  <span className="font-mono font-bold text-amber-400">
                    {tool.rating}/10
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-white text-sm font-['Plus_Jakarta_Sans']">{tool.title}</h4>
                  <div className="text-blue-400 font-mono text-[11px] mt-0.5">Slot: {tool.subCapability}</div>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {tool.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-[11px]">
                  {tool.url ? (
                    <a href={tool.url} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                      Link &rarr;
                    </a>
                  ) : (
                    <span className="text-slate-500">Local Tool</span>
                  )}
                  <button
                    onClick={() => onDeleteTool(tool.id)}
                    className="text-rose-400 hover:underline cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Screen >= md) */}
          <div className="hidden md:block bg-[#131823] border border-[#1e2638] rounded-lg overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-[#0b0f17] border-b border-[#1e2638] text-[11px] font-mono text-slate-400">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Tool Name</th>
                  <th className="py-3 px-4">Domain</th>
                  <th className="py-3 px-4">Sub-Capability Slot</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2638] text-xs">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="hover:bg-[#182030] transition-colors">
                    <td className="py-3 px-4 font-mono">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold uppercase">
                        TOOL
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white font-['Plus_Jakarta_Sans']">{tool.title}</div>
                      <div className="text-slate-400 text-[11px] font-sans line-clamp-1 mt-0.5">{tool.description}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px]">
                        {tool.domain}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-400 font-medium">
                      {tool.subCapability}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {tool.rating}/10
                    </td>
                    <td className="py-3 px-4 text-right space-x-3 font-mono text-[11px]">
                      {tool.url ? (
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          Link
                        </a>
                      ) : (
                        <span className="text-slate-500">Local</span>
                      )}
                      <button
                        onClick={() => onDeleteTool(tool.id)}
                        className="text-rose-400 hover:underline cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
