'use client';

import React, { useState } from 'react';
import { Tool, Domain } from '@/types';
import { MainTabType } from './Sidebar';

interface HomeScreenProps {
  tools: Tool[];
  onOpenSearch: (query?: string) => void;
  onOpenAskBrain: (query?: string) => void;
  onOpenCommandPalette: () => void;
  onSelectTab: (tab: MainTabType) => void;
  onSelectDomain: (domain: Domain) => void;
  onSelectTool: (tool: Tool) => void;
  activeContextName: string;
}

export default function HomeScreen({
  tools,
  onOpenSearch,
  onOpenAskBrain,
  onOpenCommandPalette,
  onSelectTab,
  onSelectDomain,
  onSelectTool,
  activeContextName,
}: HomeScreenProps) {
  const [homeQuery, setHomeQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (homeQuery.trim()) {
      onOpenSearch(homeQuery.trim());
    } else {
      onOpenSearch();
    }
  };

  // Sort tools by createdAt or take latest indexed items
  const recentTools = [...tools]
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
    .slice(0, 5);

  // Domain Counts
  const domainCounts = tools.reduce((acc, t) => {
    acc[t.domain] = (acc[t.domain] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const domainList: { name: Domain; count: number }[] = [
    { name: 'SEO', count: domainCounts['SEO'] || 0 },
    { name: 'Development', count: domainCounts['Development'] || 0 },
    { name: 'AI & Prompting', count: domainCounts['AI & Prompting'] || 0 },
    { name: 'Design', count: domainCounts['Design'] || 0 },
    { name: 'Marketing', count: domainCounts['Marketing'] || 0 },
    { name: 'Copywriting', count: domainCounts['Copywriting'] || 0 },
    { name: 'DevOps', count: domainCounts['DevOps'] || 0 },
    { name: 'Productivity', count: domainCounts['Productivity'] || 0 },
  ];

  // Context Stats calculation
  const contextToolsCount = tools.filter(
    (t) =>
      t.domain === 'SEO' ||
      t.domain === 'Development' ||
      t.subCapability.toLowerCase().includes('lead') ||
      t.subCapability.toLowerCase().includes('crawl') ||
      t.subCapability.toLowerCase().includes('automation')
  ).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      
      {/* 1. BRAIN SEARCH HEADER */}
      <div className="space-y-4 pt-2">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-slate-500 font-semibold mb-1">
            PERSONAL KNOWLEDGE BRAIN
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            What do you want to find or do?
          </h1>
        </div>

        {/* Primary Knowledge Search Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-2">
          <div className="relative">
            <input
              type="text"
              value={homeQuery}
              onChange={(e) => setHomeQuery(e.target.value)}
              placeholder="Search your brain (e.g. 'What do I have for SEO?', 'web scraping')..."
              className="w-full bg-[#12141c] border border-[#1e2230] hover:border-blue-500/60 focus:border-blue-500 px-4 py-3.5 sm:py-4 text-sm text-white placeholder-slate-500 rounded-lg focus:outline-none font-mono transition-colors shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-colors cursor-pointer"
            >
              Search Knowledge &rarr;
            </button>
          </div>

          {/* Interaction Model Hints */}
          <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-500 px-1 pt-1 gap-2">
            <div className="flex items-center gap-4">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-[#171b26] text-slate-300 border border-[#1e2230]">/</kbd> for Knowledge Search</span>
              <button
                type="button"
                onClick={() => onOpenAskBrain(homeQuery)}
                className="text-blue-400 hover:underline cursor-pointer flex items-center gap-1 font-semibold"
              >
                <span>Ask Brain for reasoning</span>
                <span>&rarr;</span>
              </button>
            </div>
            <div>
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="text-slate-400 hover:text-slate-200 cursor-pointer flex items-center gap-1"
              >
                <span>Command Palette</span>
                <kbd className="px-1 py-0.5 text-[10px] rounded bg-[#171b26] text-slate-300 border border-[#1e2230]">⌘K</kbd>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* 2. RECENTLY ADDED (Dense List) */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between border-b border-[#161a26] pb-2">
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Recently Indexed Knowledge
            </h2>
            <button
              onClick={() => onSelectTab('library')}
              className="text-[11px] font-mono text-blue-400 hover:underline cursor-pointer"
            >
              View all ({tools.length}) &rarr;
            </button>
          </div>

          <div className="space-y-1.5 font-mono text-xs">
            {recentTools.map((tool) => (
              <div
                key={tool.id}
                onClick={() => onSelectTool(tool)}
                className="p-2.5 rounded bg-[#12141c] border border-[#1e2230] hover:border-slate-700 flex items-center justify-between cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <span className="text-slate-500 text-[11px] select-none">•</span>
                  <div className="min-w-0">
                    <span className="text-slate-100 group-hover:text-blue-400 font-semibold truncate block">
                      {tool.title}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate">
                      {tool.subCapability} · {tool.domain}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-[10px] text-slate-500">
                  <span className="px-1.5 py-0.2 rounded bg-[#171b26] border border-[#1e2230] text-slate-400">
                    {tool.category || 'resource'}
                  </span>
                  <span>{tool.createdAt ? new Date(tool.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'recently'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. CURRENT CONTEXT MODULE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-[#161a26] pb-2">
            <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              Current Focus Area
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          </div>

          <div className="p-4 rounded bg-[#12141c] border border-[#1e2230] space-y-3">
            <div>
              <div className="text-[10px] font-mono uppercase text-blue-400 font-bold mb-1">
                Active Context
              </div>
              <h3 className="text-sm font-bold text-white font-sans leading-snug">
                {activeContextName}
              </h3>
            </div>

            <div className="space-y-1.5 text-xs font-mono text-slate-300 border-t border-[#161a26] pt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Indexed Resources</span>
                <span className="font-bold text-white">{Math.min(18, contextToolsCount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Domain Skills</span>
                <span className="font-bold text-white">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Knowledge gap</span>
                <span className="font-bold text-amber-400">1 missing</span>
              </div>
            </div>

            <button
              onClick={() => onSelectTab('context')}
              className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold rounded cursor-pointer transition-colors"
            >
              Open Context Mode
            </button>
          </div>
        </div>

      </div>

      {/* 4. AREAS (DOMAINS MATRIX) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#161a26] pb-2">
          <h2 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            Knowledge Areas
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {domainList.length} Active Domains
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {domainList.map((domain) => (
            <div
              key={domain.name}
              onClick={() => onSelectDomain(domain.name)}
              className="p-3.5 rounded bg-[#12141c] border border-[#1e2230] hover:border-blue-500/50 cursor-pointer transition-colors flex items-center justify-between group font-mono text-xs"
            >
              <div>
                <div className="font-semibold text-slate-200 group-hover:text-white truncate">
                  {domain.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  {domain.count} resources
                </div>
              </div>
              <span className="text-slate-600 group-hover:text-blue-400 transition-colors">
                &rarr;
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
