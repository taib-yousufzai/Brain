'use client';

import React, { useState } from 'react';

interface HeaderProps {
  toolCount: number;
  domainCount: number;
  activeTab: 'generator' | 'graph' | 'library' | 'ingest';
  setActiveTab: (tab: 'generator' | 'graph' | 'library' | 'ingest') => void;
  onOpenInstall?: () => void;
  onOpenTOS?: () => void;
  onOpenPrivacy?: () => void;
}

export default function Header({
  toolCount,
  activeTab,
  setActiveTab,
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

        {/* Action Controls & Mobile Menu Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="px-2.5 sm:px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap"
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

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden px-2.5 py-1.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-xs cursor-pointer"
          >
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1e2638] bg-[#0b0f17] px-4 py-3 space-y-2 font-mono text-xs">
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
