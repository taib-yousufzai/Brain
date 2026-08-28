'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import GodStackGeneratorPanel from '@/components/GodStackGeneratorPanel';
import ToolLibraryPanel from '@/components/ToolLibraryPanel';
import QuickIngestPanel from '@/components/QuickIngestPanel';
import NotesPanel from '@/components/NotesPanel';
import SkillsPanel from '@/components/SkillsPanel';
import InstallPrompt from '@/components/InstallPrompt';
import { getStoredTools, saveStoredTools } from '@/lib/storage';
import { Tool } from '@/types';

// Dynamically import graph view with SSR disabled
const ObsidianGraphView = dynamic(() => import('@/components/ObsidianGraphView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] flex items-center justify-center bg-[#131823] border border-[#1e2638] rounded-lg font-mono text-xs text-slate-400">
      Loading Force-Directed Knowledge Engine...
    </div>
  ),
});

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'graph' | 'library' | 'skills' | 'notes' | 'ingest'>('generator');
  const [isLoaded, setIsLoaded] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  // Legal Modals State
  const [activeLegalModal, setActiveLegalModal] = useState<'tos' | 'privacy' | null>(null);

  useEffect(() => {
    const loaded = getStoredTools();
    setTools(loaded);
    setIsLoaded(true);
  }, []);

  const handleAddTool = (newTool: Tool) => {
    const updated = [newTool, ...tools];
    setTools(updated);
    saveStoredTools(updated);
  };

  const handleDeleteTool = (id: string) => {
    const updated = tools.filter((t) => t.id !== id);
    setTools(updated);
    saveStoredTools(updated);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0f17] text-slate-400 font-mono text-xs space-y-2 flex-col">
        <div className="w-48 h-3 skeleton-box" />
        <div className="w-32 h-3 skeleton-box" />
      </div>
    );
  }

  const domainCount = new Set(tools.map((t) => t.domain)).size;

  return (
    <main className="min-h-screen pb-16 bg-[#0b0f17] text-slate-200">
      <Header
        toolCount={tools.length}
        domainCount={domainCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenInstall={() => setShowInstallPrompt(true)}
        onOpenTOS={() => setActiveLegalModal('tos')}
        onOpenPrivacy={() => setActiveLegalModal('privacy')}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {activeTab === 'generator' && (
          <GodStackGeneratorPanel
            tools={tools}
            onOpenLibrary={() => setActiveTab('library')}
          />
        )}

        {activeTab === 'graph' && <ObsidianGraphView tools={tools} />}

        {activeTab === 'library' && (
          <ToolLibraryPanel tools={tools} onDeleteTool={handleDeleteTool} />
        )}

        {activeTab === 'skills' && <SkillsPanel tools={tools} />}

        {activeTab === 'notes' && <NotesPanel />}

        {activeTab === 'ingest' && (
          <QuickIngestPanel
            onAddTool={handleAddTool}
            onDone={() => setActiveTab('graph')}
          />
        )}
      </div>

      {/* Enterprise Site Footer with TOS & Privacy Policy */}
      <footer className="mt-16 border-t border-[#1e2638] pt-8 pb-12 max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between text-xs font-mono text-slate-500">
        <div>
          &copy; {new Date().getFullYear()} Brain Capability Engine. All rights reserved.
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <button
            onClick={() => setActiveLegalModal('tos')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveLegalModal('privacy')}
            className="hover:text-slate-300 transition-colors cursor-pointer"
          >
            Privacy Policy
          </button>
        </div>
      </footer>

      {/* Legal Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-sans">
          <div className="bg-[#131823] border border-[#1e2638] max-w-lg w-full p-6 rounded-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                {activeLegalModal === 'tos' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer font-mono"
              >
                Close
              </button>
            </div>

            {activeLegalModal === 'tos' ? (
              <div className="space-y-2 text-slate-300 leading-relaxed font-sans text-xs max-h-60 overflow-y-auto pr-2">
                <p><strong>1. Usage Agreement</strong></p>
                <p>Brain is a deterministic knowledge engineering engine designed for local and enterprise tool orchestration.</p>
                <p><strong>2. Data Isolation</strong></p>
                <p>All tool indexes, notes, and generated God Stacks remain entirely client-side unless explicitly exported.</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-300 leading-relaxed font-sans text-xs max-h-60 overflow-y-auto pr-2">
                <p><strong>1. Local Storage Privacy</strong></p>
                <p>Brain does not transmit telemetry or user index data to external servers. Data persistence relies on browser localStorage and offline service workers.</p>
                <p><strong>2. Security Policy</strong></p>
                <p>No third-party trackers or cookies are utilized.</p>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono rounded cursor-pointer text-xs"
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}

      <InstallPrompt
        forceShowManualModal={showInstallPrompt}
        onCloseManualModal={() => setShowInstallPrompt(false)}
      />
    </main>
  );
}
