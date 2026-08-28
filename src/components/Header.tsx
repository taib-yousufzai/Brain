'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface HeaderProps {
  toolCount: number;
  domainCount: number;
  activeTab: 'generator' | 'graph' | 'library' | 'ingest';
  setActiveTab: (tab: 'generator' | 'graph' | 'library' | 'ingest') => void;
  onOpenInstall?: () => void;
}

export default function Header({
  toolCount,
  activeTab,
  setActiveTab,
  onOpenInstall,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#06070a]/90 border-b border-white/10 mb-10">
      <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
        
        {/* Brand Logo - Swiss Minimalist */}
        <div
          onClick={() => setActiveTab('generator')}
          className="cursor-pointer group flex items-center gap-3"
        >
          <span className="text-xl font-black tracking-widest font-['Plus_Jakarta_Sans'] text-white group-hover:text-indigo-400 transition-colors">
            BRAIN
          </span>
          <span className="text-[10px] font-mono text-gray-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
            v2.5
          </span>
        </div>

        {/* Minimalist Text Navigation */}
        <nav className="flex items-center gap-5 text-xs font-mono">
          <button
            onClick={() => setActiveTab('generator')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'generator'
                ? 'text-white font-bold border-b-2 border-indigo-500 pb-0.5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Stack
          </button>

          <button
            onClick={() => setActiveTab('graph')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'graph'
                ? 'text-white font-bold border-b-2 border-indigo-500 pb-0.5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Graph
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
              activeTab === 'library'
                ? 'text-white font-bold border-b-2 border-indigo-500 pb-0.5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <span>Library</span>
            <span className="text-[10px] text-gray-500 font-mono">({toolCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('ingest')}
            className={`transition-all duration-200 cursor-pointer ${
              activeTab === 'ingest'
                ? 'text-white font-bold border-b-2 border-indigo-500 pb-0.5'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Ingest
          </button>

          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white transition-all cursor-pointer font-sans font-semibold text-xs ml-1"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Install</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
