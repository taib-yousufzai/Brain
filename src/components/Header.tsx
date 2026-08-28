'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles, Layers, Network, Library, PlusCircle } from 'lucide-react';

interface HeaderProps {
  toolCount: number;
  domainCount: number;
  activeTab: 'generator' | 'graph' | 'library' | 'ingest';
  setActiveTab: (tab: 'generator' | 'graph' | 'library' | 'ingest') => void;
  onOpenInstall?: () => void;
}

const TABS = [
  { id: 'generator', label: 'Stack Builder', icon: Layers },
  { id: 'graph', label: 'Graph Engine', icon: Network },
  { id: 'library', label: 'Library', icon: Library },
  { id: 'ingest', label: 'Ingest', icon: PlusCircle },
] as const;

export default function Header({
  toolCount,
  activeTab,
  setActiveTab,
  onOpenInstall,
}: HeaderProps) {
  return (
    <header className="sticky top-4 z-40 max-w-5xl mx-auto px-4 mb-8">
      <div className="p-3 rounded-2xl bg-[#090b14]/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] flex items-center justify-between gap-4">
        
        {/* Brand Badge */}
        <div
          onClick={() => setActiveTab('generator')}
          className="cursor-pointer group flex items-center gap-3 pl-2"
        >
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-black tracking-widest font-['Plus_Jakarta_Sans'] text-white group-hover:text-indigo-400 transition-colors">
                BRAIN
              </span>
              <span className="text-[9px] font-mono font-semibold px-2 py-0.2 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                v2.5
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>{toolCount} Tools Active</span>
            </div>
          </div>
        </div>

        {/* Navigation Floating Tabs */}
        <nav className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`relative px-3.5 py-2 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isActive ? 'text-white font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBg"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md shadow-indigo-600/30"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">
                  <Icon className="w-3.5 h-3.5 inline mr-1" />
                  {tab.label}
                  {tab.id === 'library' && (
                    <span className="ml-1 text-[10px] opacity-70 font-mono">({toolCount})</span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Action Button: Install */}
        {onOpenInstall && (
          <button
            onClick={onOpenInstall}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-500/30 hover:to-purple-500/30 border border-indigo-500/40 text-indigo-200 hover:text-white transition-all cursor-pointer font-sans font-semibold text-xs shadow-md shadow-indigo-500/10 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        )}

      </div>
    </header>
  );
}
