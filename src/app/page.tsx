'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar, { MainTabType } from '@/components/Sidebar';
import Header from '@/components/Header';
import HomeScreen from '@/components/HomeScreen';
import SearchScreen from '@/components/SearchScreen';
import ContextPanel from '@/components/ContextPanel';
import ResourceDetailModal from '@/components/ResourceDetailModal';
import QuickIngestPanel from '@/components/QuickIngestPanel';
import GodStackGeneratorPanel from '@/components/GodStackGeneratorPanel';
import AskSynthesisPanel from '@/components/AskSynthesisPanel';
import ClustersAndGapsPanel from '@/components/ClustersAndGapsPanel';
import ToolLibraryPanel from '@/components/ToolLibraryPanel';
import SkillsPanel from '@/components/SkillsPanel';
import NotesPanel from '@/components/NotesPanel';
import InstallPrompt from '@/components/InstallPrompt';
import CommandPaletteModal from '@/components/CommandPaletteModal';
import { getStoredTools, saveStoredTools, getStoredNotes } from '@/lib/storage';
import { Tool, CustomNote, Domain } from '@/types';

// Dynamically import graph view with SSR disabled
const ObsidianGraphView = dynamic(() => import('@/components/ObsidianGraphView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[450px] flex items-center justify-center bg-[#12141c] border border-[#1e2230] rounded-lg font-mono text-xs text-slate-400">
      Loading Force-Directed Topology Graph...
    </div>
  ),
});

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [customNotes, setCustomNotes] = useState<CustomNote[]>([]);
  const [activeTab, setActiveTab] = useState<MainTabType>('home');
  const [activeDomain, setActiveDomain] = useState<Domain | 'All'>('All');
  const [activeContextName, setActiveContextName] = useState<string>('Building automated lead generation');
  const [selectedToolModal, setSelectedToolModal] = useState<Tool | null>(null);

  // Queries for cross-panel transitions
  const [searchQuery, setSearchQuery] = useState('');
  const [askQuery, setAskQuery] = useState('');
  const [stackQuery, setStackQuery] = useState('');

  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Legal Modals State
  const [activeLegalModal, setActiveLegalModal] = useState<'tos' | 'privacy' | null>(null);

  useEffect(() => {
    const loadedTools = getStoredTools();
    const loadedNotes = getStoredNotes();
    setTools(loadedTools);
    setCustomNotes(loadedNotes);
    setIsLoaded(true);
  }, []);

  // Global Keyboard Listeners (⌘K for Command Palette, / for Search, N for Ingest, H for Home)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      } else if (e.key === '/') {
        e.preventDefault();
        setActiveTab('search');
      } else if (e.key.toLowerCase() === 'n' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setActiveTab('ingest');
      } else if (e.key.toLowerCase() === 'h' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setActiveTab('home');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  const handleTriggerSearch = (query?: string) => {
    if (query) setSearchQuery(query);
    setActiveTab('search');
  };

  const handleTriggerAskBrain = (query?: string) => {
    if (query) setAskQuery(query);
    setActiveTab('ask');
  };

  const handleTriggerBuildStack = (query?: string) => {
    if (query) setStackQuery(query);
    setActiveTab('generator');
  };

  // Domain Counts computation
  const domainCounts = tools.reduce((acc, t) => {
    acc[t.domain] = (acc[t.domain] || 0) + 1;
    return acc;
  }, {} as Record<Domain, number>);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#090a0f] text-slate-400 font-mono text-xs space-y-2 flex-col">
        <div className="w-48 h-3 skeleton-box" />
        <div className="w-32 h-3 skeleton-box" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-200 font-sans flex">
      
      {/* 1. Persistent Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        toolCount={tools.length}
        domainCounts={domainCounts}
        activeDomain={activeDomain}
        setActiveDomain={setActiveDomain}
        activeContextName={activeContextName}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* 2. Main Content Viewport */}
      <div className="flex-1 lg:pl-60 flex flex-col min-h-screen min-w-0">
        
        {/* Minimalist Header Bar */}
        <Header
          activeTab={activeTab}
          toolCount={tools.length}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenInstall={() => setShowInstallPrompt(true)}
          onOpenTOS={() => setActiveLegalModal('tos')}
          onOpenPrivacy={() => setActiveLegalModal('privacy')}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl w-full mx-auto">
          
          {activeTab === 'home' && (
            <HomeScreen
              tools={tools}
              onOpenSearch={handleTriggerSearch}
              onOpenAskBrain={handleTriggerAskBrain}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              onSelectTab={(tab) => setActiveTab(tab)}
              onSelectDomain={(domain) => {
                setActiveDomain(domain);
                setActiveTab('library');
              }}
              onSelectTool={(tool) => setSelectedToolModal(tool)}
              activeContextName={activeContextName}
            />
          )}

          {activeTab === 'search' && (
            <SearchScreen
              tools={tools}
              customNotes={customNotes}
              initialQuery={searchQuery}
              onSelectTool={(tool) => setSelectedToolModal(tool)}
              onSelectNote={() => setActiveTab('notes')}
              onAskBrain={handleTriggerAskBrain}
              onBuildStack={handleTriggerBuildStack}
              onSelectDomain={(domain) => {
                setActiveDomain(domain);
                setActiveTab('library');
              }}
            />
          )}

          {activeTab === 'context' && (
            <ContextPanel
              tools={tools}
              activeContextName={activeContextName}
              setActiveContextName={setActiveContextName}
              onSelectTool={(tool) => setSelectedToolModal(tool)}
            />
          )}

          {activeTab === 'ingest' && (
            <QuickIngestPanel
              onAddTool={handleAddTool}
              onDone={() => setActiveTab('home')}
              recentTools={tools}
            />
          )}

          {activeTab === 'generator' && (
            <GodStackGeneratorPanel
              tools={tools}
              initialQuery={stackQuery}
              onSelectTool={(tool) => setSelectedToolModal(tool)}
            />
          )}

          {activeTab === 'ask' && (
            <AskSynthesisPanel
              tools={tools}
              customNotes={customNotes}
              initialQuery={askQuery}
              onSelectTool={(tool) => setSelectedToolModal(tool)}
            />
          )}

          {activeTab === 'clusters' && <ClustersAndGapsPanel tools={tools} />}

          {activeTab === 'graph' && <ObsidianGraphView tools={tools} />}

          {activeTab === 'library' && (
            <ToolLibraryPanel tools={tools} onDeleteTool={handleDeleteTool} />
          )}

          {activeTab === 'skills' && <SkillsPanel tools={tools} />}

          {activeTab === 'notes' && <NotesPanel />}

        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-[#161a26] py-6 px-4 sm:px-6 lg:px-8 text-xs font-mono text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Brain Knowledge Engine v3.0 · Local-first & Quiet
          </div>
          <div className="flex items-center gap-4 text-[11px]">
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

      </div>

      {/* 3. Global Resource Detail Modal */}
      <ResourceDetailModal
        tool={selectedToolModal}
        onClose={() => setSelectedToolModal(null)}
        onDeleteTool={handleDeleteTool}
      />

      {/* 4. Global Command Palette Modal Overlay */}
      <CommandPaletteModal
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => setActiveTab(tab)}
        onTriggerSearch={handleTriggerSearch}
        onSelectDomain={(domain) => {
          setActiveDomain(domain);
          setActiveTab('library');
        }}
      />

      {/* Legal Modals */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-sans">
          <div className="bg-[#0d0f17] border border-[#1e2230] max-w-lg w-full p-6 rounded-lg space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#161a26] pb-3">
              <h3 className="text-sm font-bold text-white font-sans">
                {activeLegalModal === 'tos' ? 'Terms of Service' : 'Privacy Policy'}
              </h3>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="text-slate-400 hover:text-white cursor-pointer font-mono"
              >
                ✕
              </button>
            </div>

            {activeLegalModal === 'tos' ? (
              <div className="space-y-2 text-slate-300 leading-relaxed font-sans text-xs max-h-60 overflow-y-auto pr-2">
                <p><strong>1. Deterministic Knowledge Architecture</strong></p>
                <p>Brain operates as a personal local knowledge graph and capability orchestrator.</p>
                <p><strong>2. Local Privacy</strong></p>
                <p>All tool indexes, custom notes, and stack data remain stored in your local browser environment.</p>
              </div>
            ) : (
              <div className="space-y-2 text-slate-300 leading-relaxed font-sans text-xs max-h-60 overflow-y-auto pr-2">
                <p><strong>1. Zero Analytics & Tracking</strong></p>
                <p>Brain collects zero personal data, analytics, telemetry, or external tracking metrics.</p>
                <p><strong>2. Client Storage</strong></p>
                <p>Persistence uses standard local browser storage without third-party cookies.</p>
              </div>
            )}

            <div className="pt-2 flex justify-end font-mono">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <InstallPrompt
        forceShowManualModal={showInstallPrompt}
        onCloseManualModal={() => setShowInstallPrompt(false)}
      />

    </div>
  );
}
