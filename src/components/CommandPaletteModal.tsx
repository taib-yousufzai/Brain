'use client';

import React, { useState, useEffect } from 'react';
import { Tool, CustomNote } from '@/types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  tools: Tool[];
  customNotes: CustomNote[];
  onSelectTab: (tab: 'generator' | 'library' | 'notes' | 'graph' | 'skills') => void;
  onSelectTool?: (tool: Tool) => void;
}

export default function CommandPaletteModal({
  isOpen,
  onClose,
  tools,
  customNotes,
  onSelectTab,
  onSelectTool,
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

  // Static navigation actions
  const navActions = [
    { type: 'nav' as const, label: 'Go to God-Stack Generator', tab: 'generator' as const, category: 'Navigation' },
    { type: 'nav' as const, label: 'Go to Tool Library Catalog', tab: 'library' as const, category: 'Navigation' },
    { type: 'nav' as const, label: 'Go to Notes & Knowledge Vault', tab: 'notes' as const, category: 'Navigation' },
    { type: 'nav' as const, label: 'Go to Interactive Graph View', tab: 'graph' as const, category: 'Navigation' },
    { type: 'nav' as const, label: 'Go to AI Skills & Repos Vault', tab: 'skills' as const, category: 'Navigation' },
  ];

  // Filter tools matching query
  const filteredTools = query.trim()
    ? tools
        .filter(
          (t) =>
            t.title.toLowerCase().includes(query.toLowerCase()) ||
            t.domain.toLowerCase().includes(query.toLowerCase()) ||
            t.subCapability.toLowerCase().includes(query.toLowerCase()) ||
            t.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        )
        .slice(0, 8)
        .map((t) => ({
          type: 'tool' as const,
          label: `${t.title} (${t.domain})`,
          sub: t.subCapability,
          tool: t,
          category: 'Tools & Capabilities',
        }))
    : [];

  // Filter notes matching query
  const filteredNotes = query.trim()
    ? customNotes
        .filter(
          (n) =>
            n.title.toLowerCase().includes(query.toLowerCase()) ||
            n.content.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 4)
        .map((n) => ({
          type: 'note' as const,
          label: `Note: ${n.title}`,
          sub: n.content.substring(0, 60) + '...',
          category: 'Custom Notes',
        }))
    : [];

  const combinedResults = query.trim()
    ? [...filteredTools, ...filteredNotes]
    : navActions;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, combinedResults.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + combinedResults.length) % Math.max(1, combinedResults.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = combinedResults[selectedIndex];
      if (item) {
        executeItem(item);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeItem = (item: (typeof combinedResults)[number]) => {
    if (item.type === 'nav') {
      onSelectTab(item.tab);
    } else if (item.type === 'tool' && item.tool) {
      if (onSelectTool) {
        onSelectTool(item.tool);
      } else {
        onSelectTab('library');
      }
    } else if (item.type === 'note') {
      onSelectTab('notes');
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm font-sans"
      onClick={onClose}
    >
      <div
        className="bg-[#131823] border border-[#1e2638] max-w-xl w-full rounded-lg shadow-2xl overflow-hidden space-y-0"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Input Bar */}
        <div className="flex items-center px-4 border-b border-[#1e2638] bg-[#0b0f17]">
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
            placeholder="Type a command or search tools, notes, skills (e.g., 'humanizer', 'mcp', 'graph')..."
            className="w-full py-3.5 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {combinedResults.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No matching tools or actions found for "{query}".
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={idx}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2.5 rounded text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected ? 'bg-blue-600/20 text-blue-200 border border-blue-500/40' : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-medium text-white flex items-center gap-2">
                      <span>{item.label}</span>
                    </div>
                    {'sub' in item && item.sub && (
                      <div className="text-[11px] text-slate-400 font-mono truncate max-w-md">{item.sub}</div>
                    )}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 shrink-0">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2 bg-[#0b0f17] border-t border-[#1e2638] text-[10px] font-mono text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 bg-slate-800 rounded">↑↓</kbd> Navigate</span>
            <span><kbd className="px-1 bg-slate-800 rounded">↵</kbd> Select</span>
          </div>
          <span>Brain Power Utility v6</span>
        </div>
      </div>
    </div>
  );
}
