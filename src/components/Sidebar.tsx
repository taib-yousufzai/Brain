'use client';

import React from 'react';
import { Domain } from '@/types';

export type MainTabType =
  | 'home'
  | 'ingest'
  | 'search'
  | 'ask'
  | 'generator'
  | 'graph'
  | 'library'
  | 'skills'
  | 'notes'
  | 'clusters'
  | 'context';

interface SidebarProps {
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  toolCount: number;
  domainCounts: Record<Domain, number>;
  activeDomain: Domain | 'All';
  setActiveDomain: (domain: Domain | 'All') => void;
  activeContextName: string;
  onOpenCommandPalette: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  toolCount,
  domainCounts,
  activeDomain,
  setActiveDomain,
  activeContextName,
  onOpenCommandPalette,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarProps) {
  const navItems: { id: MainTabType; label: string; shortcut?: string; badge?: string }[] = [
    { id: 'home', label: 'Home', shortcut: 'H' },
    { id: 'ingest', label: 'Inbox (Dump)', shortcut: 'N' },
    { id: 'search', label: 'Search', shortcut: '⌘K' },
    { id: 'ask', label: 'Ask Brain' },
    { id: 'generator', label: 'God Stack' },
    { id: 'graph', label: 'Graph View' },
    { id: 'library', label: 'Library', badge: String(toolCount) },
    { id: 'skills', label: 'AI Skills' },
    { id: 'notes', label: 'Notes' },
    { id: 'clusters', label: 'Overlaps & Gaps' },
  ];

  const handleSelectNav = (tab: MainTabType) => {
    setActiveTab(tab);
    setIsMobileOpen(false);
  };

  const handleSelectArea = (domain: Domain) => {
    setActiveDomain(domain);
    setActiveTab('library');
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-60 bg-[#0d0f17] border-r border-[#1e2230] flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          
          {/* Header Brand */}
          <div className="p-4 border-b border-[#161a26] flex items-center justify-between">
            <div
              onClick={() => handleSelectNav('home')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center font-mono text-[11px] font-bold text-white tracking-tighter">
                B
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs tracking-wider text-slate-100 group-hover:text-white">
                  BRAIN
                </span>
                <span className="text-[10px] font-mono text-slate-500">v3.0</span>
              </div>
            </div>

            <button
              onClick={onOpenCommandPalette}
              title="Search (⌘K)"
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#161a26] font-mono text-[11px] cursor-pointer transition-colors"
            >
              <span className="px-1.5 py-0.5 rounded bg-[#131622] border border-[#1e2230] text-[10px] text-slate-400">
                ⌘K
              </span>
            </button>
          </div>

          {/* Quick Search Trigger Input */}
          <div className="px-3 pt-3">
            <button
              onClick={onOpenCommandPalette}
              className="w-full text-left px-3 py-1.5 rounded bg-[#12141c] border border-[#1e2230] hover:border-slate-700 text-slate-400 hover:text-slate-200 font-mono text-[11px] flex items-center justify-between transition-colors cursor-pointer"
            >
              <span className="truncate">Search brain...</span>
              <span className="text-[10px] text-slate-500">⌘K</span>
            </button>
          </div>

          {/* Main Navigation Links */}
          <div className="px-2 py-3 space-y-0.5 font-mono text-xs">
            <div className="px-2 py-1 text-[10px] uppercase text-slate-500 tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 font-semibold border-l-2 border-blue-500 pl-2'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#131622]'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#161a26] text-slate-400">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="my-1 border-t border-[#161a26]" />

          {/* Current Context Module */}
          <div className="px-3 py-2 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase text-slate-500 tracking-wider px-1">
              <span>Current Context</span>
              <button
                onClick={() => handleSelectNav('context')}
                className="text-blue-400 hover:underline cursor-pointer lowercase"
              >
                view
              </button>
            </div>
            <div
              onClick={() => handleSelectNav('context')}
              className="p-2.5 rounded bg-[#12141c] border border-[#1e2230] hover:border-blue-500/50 cursor-pointer transition-colors space-y-1"
            >
              <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                {activeContextName}
              </div>
              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>Active Context</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              </div>
            </div>
          </div>

          <div className="my-1 border-t border-[#161a26]" />

          {/* Areas (Domains) List */}
          <div className="px-2 py-2 space-y-0.5 font-mono text-xs">
            <div className="px-2 py-1 text-[10px] uppercase text-slate-500 tracking-wider flex items-center justify-between">
              <span>Areas</span>
              {activeDomain !== 'All' && (
                <button
                  onClick={() => setActiveDomain('All')}
                  className="text-blue-400 hover:underline cursor-pointer lowercase text-[10px]"
                >
                  clear
                </button>
              )}
            </div>
            {Object.entries(domainCounts).map(([domain, count]) => {
              const isSelected = activeDomain === domain;
              return (
                <button
                  key={domain}
                  onClick={() => handleSelectArea(domain as Domain)}
                  className={`w-full text-left px-2.5 py-1 rounded transition-colors flex items-center justify-between text-[11px] cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600/10 text-blue-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#131622]'
                  }`}
                >
                  <span className="truncate">{domain}</span>
                  <span className="text-[10px] text-slate-500">{count}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer Status */}
        <div className="p-3 border-t border-[#161a26] text-[11px] font-mono text-slate-500 flex items-center justify-between bg-[#0b0d14]">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-400">{toolCount} resources</span>
          </div>
          <span className="text-[10px]">Local Vault</span>
        </div>
      </aside>
    </>
  );
}
