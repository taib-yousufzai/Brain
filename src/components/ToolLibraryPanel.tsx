'use client';

import React, { useState } from 'react';
import { Tool, Domain } from '@/types';
import { Search, Filter, ExternalLink, Trash2, Award, Star, Tag, Sparkles } from 'lucide-react';

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

export default function ToolLibraryPanel({ tools, onDeleteTool }: ToolLibraryPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'All'>('All');

  const filteredTools = tools.filter((tool) => {
    const matchesDomain = selectedDomain === 'All' || tool.domain === selectedDomain;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      tool.title.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.subCapability.toLowerCase().includes(q) ||
      tool.tags.some((t) => t.toLowerCase().includes(q));

    return matchesDomain && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Search & Domain Filter Bar */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills, tools, slop-killer, keywords..."
            className="w-full bg-black/50 border border-white/15 rounded-2xl pl-11 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner transition-all"
          />
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {ALL_DOMAINS.map((domain) => (
            <button
              key={domain}
              onClick={() => setSelectedDomain(domain)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedDomain === domain
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Count Header */}
      <div className="flex items-center justify-between px-2">
        <div className="text-xs font-mono text-gray-400">
          Showing <strong className="text-white">{filteredTools.length}</strong> indexed tools
        </div>
      </div>

      {/* Bento Grid Tools Display */}
      {filteredTools.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
          <p className="text-sm text-gray-400 font-mono">No matching skills or tools found.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('All');
            }}
            className="px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 transition-all"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const isGoldTier = tool.rating >= 9.8;

            return (
              <div
                key={tool.id}
                className={`p-6 rounded-3xl relative flex flex-col justify-between group transition-all duration-300 ${
                  isGoldTier ? 'glass-panel-gold' : 'glass-panel'
                }`}
              >
                {/* Header Row */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 font-medium">
                      {tool.domain}
                    </span>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{tool.rating}/10</span>
                    </div>
                  </div>

                  {/* Sub-Capability Tag */}
                  <div className="text-[11px] font-mono text-cyan-400 mb-1 flex items-center gap-1">
                    <span>Sub-Slot:</span>
                    <strong className="text-cyan-300 font-semibold">{tool.subCapability}</strong>
                  </div>

                  {/* Tool Title */}
                  <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans'] mb-2 flex items-center gap-2">
                    <span>{tool.title}</span>
                    {isGoldTier && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/40">
                        TOP-TIER
                      </span>
                    )}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-300 line-clamp-3 mb-4 leading-relaxed font-sans">
                    {tool.description}
                  </p>

                  {/* Personal Notes */}
                  {tool.notes && (
                    <div className="p-3 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-gray-400 font-mono mb-4 leading-normal">
                      <strong className="text-indigo-400 font-semibold">Note:</strong> {tool.notes}
                    </div>
                  )}
                </div>

                {/* Footer Controls & Tags */}
                <div>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded-md bg-white/5 border border-white/5"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/10">
                    {tool.url ? (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        <span>Visit Tool</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-[11px] font-mono text-gray-500">Local Skill</span>
                    )}

                    <button
                      onClick={() => onDeleteTool(tool.id)}
                      className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Remove tool from Brain"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
