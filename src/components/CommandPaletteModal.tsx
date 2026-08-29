'use client';

import React, { useState, useEffect } from 'react';
import { MainTabType } from '@/components/Sidebar';
import { Domain } from '@/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: MainTabType) => void;
  onTriggerSearch?: (query: string) => void;
  onSelectDomain?: (domain: Domain) => void;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  onSelectTab,
  onTriggerSearch,
  onSelectDomain,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Application Commands
  const appCommands = [
    { type: 'nav' as const, label: 'Open Knowledge Search', tab: 'search' as const, category: 'Navigation', badge: 'SEARCH' },
    { type: 'nav' as const, label: 'Open Ask Brain (Synthesis & Reasoning)', tab: 'ask' as const, category: 'Navigation', badge: 'ASK' },
    { type: 'nav' as const, label: 'Open God-Stack Generator', tab: 'generator' as const, category: 'Navigation', badge: 'STACK' },
    { type: 'nav' as const, label: 'Open Interactive Graph View', tab: 'graph' as const, category: 'Navigation', badge: 'GRAPH' },
    { type: 'nav' as const, label: 'Open Capability Overlaps & Gaps', tab: 'clusters' as const, category: 'Navigation', badge: 'ANALYSIS' },
    { type: 'nav' as const, label: 'Open Quick Ingest (Dump)', tab: 'ingest' as const, category: 'Navigation', badge: 'INBOX' },
    { type: 'nav' as const, label: 'Open Active Context Mode', tab: 'context' as const, category: 'Navigation', badge: 'CONTEXT' },
    { type: 'nav' as const, label: 'Go to Tool Library Catalog', tab: 'library' as const, category: 'Vault', badge: 'LIBRARY' },
    { type: 'nav' as const, label: 'Go to AI Skills Vault', tab: 'skills' as const, category: 'Vault', badge: 'SKILLS' },
    { type: 'nav' as const, label: 'Go to Notes & Knowledge Vault', tab: 'notes' as const, category: 'Vault', badge: 'NOTES' },
    
    // Domain commands
    { type: 'domain' as const, label: 'Go to SEO Domain', domain: 'SEO' as Domain, category: 'Domain', badge: 'DOMAIN' },
    { type: 'domain' as const, label: 'Go to Development Domain', domain: 'Development' as Domain, category: 'Domain', badge: 'DOMAIN' },
    { type: 'domain' as const, label: 'Go to Design Domain', domain: 'Design' as Domain, category: 'Domain', badge: 'DOMAIN' },
    { type: 'domain' as const, label: 'Go to Marketing Domain', domain: 'Marketing' as Domain, category: 'Domain', badge: 'DOMAIN' },
    { type: 'domain' as const, label: 'Go to Copywriting Domain', domain: 'Copywriting' as Domain, category: 'Domain', badge: 'DOMAIN' },
    { type: 'domain' as const, label: 'Go to DevOps Domain', domain: 'DevOps' as Domain, category: 'Domain', badge: 'DOMAIN' },
    { type: 'domain' as const, label: 'Go to AI & Prompting Domain', domain: 'AI & Prompting' as Domain, category: 'Domain', badge: 'DOMAIN' },
  ];

  // Filter commands matching input
  const filteredCommands = query.trim()
    ? appCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.category.toLowerCase().includes(query.toLowerCase()) ||
          cmd.badge.toLowerCase().includes(query.toLowerCase())
      )
    : appCommands;

  // Search Fallback Item when user types natural language in Cmd+K
  const searchFallbackItem = query.trim()
    ? {
        type: 'search_fallback' as const,
        label: `Search your brain for "${query.trim()}"`,
        sub: 'Press Enter to execute natural language knowledge search',
        category: 'Knowledge Search',
        badge: 'SEARCH',
        searchQuery: query.trim(),
      }
    : null;

  // Combine items: Fallback item first if present, then filtered commands
  const combinedItems = searchFallbackItem
    ? [searchFallbackItem, ...filteredCommands]
    : filteredCommands;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedItems.length) % Math.max(1, combinedItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = combinedItems[selectedIndex];
      if (item) {
        executeItem(item);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeItem = (item: (typeof combinedItems)[number]) => {
    if (item.type === 'search_fallback') {
      if (onTriggerSearch) {
        onTriggerSearch(item.searchQuery);
      } else {
        onSelectTab('search');
      }
    } else if (item.type === 'nav') {
      onSelectTab(item.tab);
    } else if (item.type === 'domain') {
      if (onSelectDomain) {
        onSelectDomain(item.domain);
      }
      onSelectTab('library');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 font-sans"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0f17] border border-[#1e2230] max-w-xl w-full rounded-lg shadow-2xl overflow-hidden space-y-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-[#1e2230] bg-[#090a0f]">
          <svg className="w-4 h-4 text-slate-400 shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command (e.g. 'Open Search', 'Go to SEO', 'Dump')..."
            className="w-full py-3.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {combinedItems.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const isFallback = item.type === 'search_fallback';

            const badgeStyle = isFallback
              ? 'bg-blue-900 text-blue-200 border-blue-700'
              : item.badge === 'DOMAIN'
              ? 'bg-purple-950 text-purple-300 border-purple-800'
              : 'bg-slate-800 text-slate-300 border-slate-700';

            return (
              <button
                key={idx}
                onClick={() => executeItem(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`w-full text-left px-3 py-2.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? isFallback
                      ? 'bg-blue-600/30 text-blue-100 border border-blue-500'
                      : 'bg-blue-600/20 text-blue-200 border border-blue-500/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="font-medium text-white flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded border font-mono text-[9px] font-bold ${badgeStyle}`}>
                      {item.badge}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {'sub' in item && item.sub && (
                    <div className="text-[11px] text-slate-400 font-mono truncate">{item.sub}</div>
                  )}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0 ml-2">
                  {item.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-[#0b0f17] border-t border-[#1e2638] text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 bg-slate-800 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 bg-slate-800 rounded">↵</kbd> Select</span>
          </div>
          <span>Command Palette · Press / for Knowledge Search</span>
        </div>
      </div>
    </div>
  );
}
