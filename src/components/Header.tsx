'use client';

import React from 'react';
import { MainTabType } from './Sidebar';

interface HeaderProps {
  activeTab: MainTabType;
  toolCount: number;
  onOpenCommandPalette: () => void;
  onToggleMobileSidebar: () => void;
  onOpenInstall?: () => void;
  onOpenTOS?: () => void;
  onOpenPrivacy?: () => void;
}

const TAB_TITLES: Record<MainTabType, { title: string; subtitle: string }> = {
  home: { title: 'Brain', subtitle: 'Personal knowledge index & context hub' },
  ingest: { title: 'Inbox / Dump', subtitle: 'Paste raw URLs, repos, thoughts, or notes' },
  search: { title: 'Knowledge Search', subtitle: 'Semantic retrieval across resources, skills, notes, capabilities, and domains' },
  ask: { title: 'Ask Brain', subtitle: 'Synthesis engine for natural language queries' },
  generator: { title: 'God Stack Orchestrator', subtitle: 'Capability slot decomposition & tool stack assembly' },
  graph: { title: 'Knowledge Graph', subtitle: 'Force-directed node topology & relationships' },
  library: { title: 'Resource Library', subtitle: 'Dense catalog of indexed tools and resources' },
  skills: { title: 'AI Skills & Repos', subtitle: 'Open-source skillsets and agent frameworks' },
  notes: { title: 'Notes Vault', subtitle: 'Custom notes and system architecture standards' },
  clusters: { title: 'Overlaps & Gaps', subtitle: 'Redundant tool clusters and capability matrix' },
  context: { title: 'Current Context', subtitle: 'Active project focus & resource alignment' },
};

export default function Header({
  activeTab,
  onOpenCommandPalette,
  onToggleMobileSidebar,
  onOpenInstall,
  onOpenTOS,
  onOpenPrivacy,
}: HeaderProps) {
  const currentInfo = TAB_TITLES[activeTab] || { title: 'Brain', subtitle: '' };

  return (
    <header className="sticky top-0 z-30 bg-[#090a0f]/90 backdrop-blur border-b border-[#1e2230] px-4 sm:px-6 py-3 flex items-center justify-between">
      
      {/* Mobile Hamburger + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 rounded bg-[#12141c] border border-[#1e2230] text-slate-300 hover:text-white cursor-pointer"
          aria-label="Open Sidebar Menu"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-100 font-mono tracking-tight flex items-center gap-2">
            <span>{currentInfo.title}</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-sans hidden sm:block">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 font-mono text-xs">
        
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#12141c] border border-[#1e2230] hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer text-[11px]"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="hidden sm:inline">Search</span>
          <kbd className="px-1 py-0.2 text-[10px] text-slate-500 bg-[#171b26] border border-[#1e2230] rounded">
            ⌘K
          </kbd>
        </button>

        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="px-2.5 py-1 rounded bg-[#161a26] hover:bg-[#1f2434] border border-[#1e2230] text-slate-300 text-[11px] transition-colors cursor-pointer"
          >
            Install
          </button>
        )}

        <div className="hidden md:flex items-center gap-3 text-[10px] text-slate-500 border-l border-[#1e2230] pl-3">
          {onOpenTOS && (
            <button onClick={onOpenTOS} className="hover:text-slate-300 cursor-pointer">
              Terms
            </button>
          )}
          {onOpenPrivacy && (
            <button onClick={onOpenPrivacy} className="hover:text-slate-300 cursor-pointer">
              Privacy
            </button>
          )}
        </div>

      </div>

    </header>
  );
}
