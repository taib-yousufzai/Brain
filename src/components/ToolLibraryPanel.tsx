'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool, Domain } from '@/types';
import { Search, ExternalLink, Trash2, Star, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';

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
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Search & Domain Filter Dock */}
      <div className="glass-panel p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, tools, slop-killer, keywords..."
              className="w-full bg-black/60 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Stat Pill */}
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>Showing <strong className="text-white">{filteredTools.length}</strong> of {tools.length} Tools</span>
          </div>

        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {ALL_DOMAINS.map((domain) => {
            const isActive = selectedDomain === domain;
            const count = domain === 'All' ? tools.length : tools.filter((t) => t.domain === domain).length;

            return (
              <button
                key={domain}
                onClick={() => setSelectedDomain(domain)}
                className={`cursor-pointer px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{domain}</span>
                <span className={`text-[10px] font-mono ${isActive ? 'text-indigo-200' : 'text-gray-500'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid Tools Display */}
      {filteredTools.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-white/10 text-center space-y-3">
          <Sparkles className="w-8 h-8 text-gray-600 mx-auto" />
          <p className="text-sm text-gray-400 font-mono">No matching skills or tools found in knowledge base.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDomain('All');
            }}
            className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-500/20 text-indigo-300 text-xs font-semibold hover:bg-indigo-500/30 transition-all"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <AnimatePresence>
            {filteredTools.map((tool, index) => {
              const isGoldTier = tool.rating >= 9.8;

              return (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className={`p-6 rounded-3xl relative flex flex-col justify-between group transition-all duration-300 ${
                    isGoldTier ? 'glass-panel-gold' : 'glass-panel'
                  }`}
                >
                  {/* Top Metadata */}
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-[11px] font-mono text-indigo-300 font-semibold">
                        {tool.domain}
                      </span>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{tool.rating}/10</span>
                      </div>
                    </div>

                    {/* Sub-Capability Tag */}
                    <div className="text-[11px] font-mono text-cyan-400 mb-1 flex items-center gap-1">
                      <span>Slot:</span>
                      <strong className="text-cyan-300 font-semibold">{tool.subCapability}</strong>
                    </div>

                    {/* Tool Title */}
                    <h3 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans'] mb-2 flex items-center justify-between">
                      <span className="group-hover:text-indigo-300 transition-colors">{tool.title}</span>
                      {isGoldTier && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold border border-amber-500/40 shrink-0">
                          GOLD TIER
                        </span>
                      )}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-300 line-clamp-3 mb-4 leading-relaxed font-sans">
                      {tool.description}
                    </p>

                    {/* Personal Notes */}
                    {tool.notes && (
                      <div className="p-3 rounded-2xl bg-black/50 border border-white/10 text-[11px] text-gray-400 font-mono mb-4 leading-normal">
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
                        <span className="text-[11px] font-mono text-gray-500">Internal Skill</span>
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
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
