'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import GodStackGeneratorPanel from '@/components/GodStackGeneratorPanel';
import ToolLibraryPanel from '@/components/ToolLibraryPanel';
import QuickIngestPanel from '@/components/QuickIngestPanel';
import { getStoredTools, saveStoredTools } from '@/lib/storage';
import { Tool } from '@/types';

// Dynamically import force-graph powered view with SSR disabled
const ObsidianGraphView = dynamic(() => import('@/components/ObsidianGraphView'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[500px] flex items-center justify-center bg-[#06070a] border border-white/10 rounded-2xl font-mono text-xs text-indigo-400">
      Loading Obsidian Physics Graph Engine...
    </div>
  ),
});

export default function Home() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'graph' | 'library' | 'ingest'>('generator');
  const [isLoaded, setIsLoaded] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-[#06070a] text-indigo-400 font-mono text-xs">
        Initializing Brain Engine & Knowledge Graph...
      </div>
    );
  }

  const domainCount = new Set(tools.map((t) => t.domain)).size;

  return (
    <main className="min-h-screen pb-16 bg-[#06070a]">
      <Header
        toolCount={tools.length}
        domainCount={domainCount}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="max-w-4xl mx-auto px-6">
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

        {activeTab === 'ingest' && (
          <QuickIngestPanel
            onAddTool={handleAddTool}
            onDone={() => setActiveTab('graph')}
          />
        )}
      </div>
    </main>
  );
}
