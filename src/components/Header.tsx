'use client';

import React, { useState } from 'react';

interface HeaderProps {
  toolCount: number;
  domainCount: number;
  activeTab: 'generator' | 'graph' | 'library' | 'skills' | 'notes' | 'ingest';
  setActiveTab: (tab: 'generator' | 'graph' | 'library' | 'skills' | 'notes' | 'ingest') => void;
  onOpenCommandPalette?: () => void;
  onOpenInstall?: () => void;
  onOpenTOS?: () => void;
  onOpenPrivacy?: () => void;
}

export default function Header({
  toolCount,
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  onOpenInstall,
  onOpenTOS,
  onOpenPrivacy,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#131823] border-b border-[#1e2638] mb-6 sm:mb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        
        {/* Brand Header */}
        <div
          onClick={() => setActiveTab('generator')}
          className="cursor-pointer flex items-center gap-2 sm:gap-3 shrink-0"
        >
          <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-mono font-bold text-white text-xs">
            B
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm sm:text-base font-bold font-['Plus_Jakarta_Sans'] text-white tracking-wide">
              BRAIN
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
              v2.5
            </span>
          </div>
        </div>

        {/* Desktop Search Command Bar Trigger */}
        {onOpenCommandPalette && (
          <button
            onClick={onOpenCommandPalette}
            className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-md bg-[#0b0f17] border border-[#1e2638] hover:border-blue-500/50 text-slate-400 hover:text-white font-mono text-xs transition-all cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span>Search or command...</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-300 bg-slate-800 border border-slate-700 rounded">
              ⌘K
            </kbd>
          </button>
        )}

        {/* Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'generator'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Stack Builder
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'graph'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Graph View
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'library'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Library ({toolCount})
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'skills'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            AI Skills & Repos
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Notes Vault
          </button>

          <button
            onClick={() => setActiveTab('ingest')}
            className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeTab === 'ingest'
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Ingest
          </button>
        </nav>

        {/* Action Controls & Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="px-2.5 sm:px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap active:scale-[0.98]"
            >
              Install App
            </button>
          )}

          <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-400 border-l border-slate-800 pl-3">
            {onOpenTOS && (
              <button onClick={onOpenTOS} className="hover:text-slate-200 cursor-pointer">
                Terms
              </button>
            )}
            {onOpenPrivacy && (
              <button onClick={onOpenPrivacy} className="hover:text-slate-200 cursor-pointer">
                Privacy
              </button>
            )}
          </div>

          {/* Classic 3-Line Hamburger Menu Icon */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer active:scale-[0.98]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1e2638] bg-[#0b0f17] px-4 py-3 space-y-2 font-mono text-xs">
          {onOpenCommandPalette && (
            <button
              onClick={() => {
                onOpenCommandPalette();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded bg-slate-900 border border-slate-800 text-blue-400 font-bold flex items-center justify-between"
            >
              <span>🔍 Search / Command Palette</span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-300 rounded">⌘K</kbd>
            </button>
          )}

          <button
            onClick={() => {
              setActiveTab('generator');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === 'generator' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Stack Builder
          </button>
          <button
            onClick={() => {
              setActiveTab('graph');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === 'graph' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Graph View
          </button>
          <button
            onClick={() => {
              setActiveTab('library');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === 'library' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Library ({toolCount})
          </button>
          <button
            onClick={() => {
              setActiveTab('skills');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === 'skills' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            AI Skills & Repos
          </button>
          <button
            onClick={() => {
              setActiveTab('notes');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === 'notes' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Notes Vault
          </button>
          <button
            onClick={() => {
              setActiveTab('ingest');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === 'ingest' ? 'bg-blue-600 text-white font-bold' : 'text-slate-300'
            }`}
          >
            Ingest
          </button>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            {onOpenTOS && (
              <button onClick={() => { onOpenTOS(); setMobileMenuOpen(false); }}>Terms</button>
            )}
            {onOpenPrivacy && (
              <button onClick={() => { onOpenPrivacy(); setMobileMenuOpen(false); }}>Privacy</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
