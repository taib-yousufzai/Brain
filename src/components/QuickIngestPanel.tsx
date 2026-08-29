'use client';

import React, { useState } from 'react';
import { Tool, Domain } from '@/types';

interface QuickIngestPanelProps {
  onAddTool: (tool: Tool) => void;
  onDone: () => void;
  recentTools?: Tool[];
}

export default function QuickIngestPanel({ onAddTool, onDone, recentTools = [] }: QuickIngestPanelProps) {
  const [rawDump, setRawDump] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      executeDump();
    }
  };

  const executeDump = () => {
    if (!rawDump.trim()) return;

    const text = rawDump.trim();
    let url: string | undefined = undefined;
    let title = text.slice(0, 40);
    let domain: Domain = 'Development';
    let subCapability = 'General Capability';

    // Auto extract URL
    const urlMatch = text.match(/https?:\/\/[^\s]+/i);
    if (urlMatch) {
      url = urlMatch[0];
    }

    // Auto title extraction
    if (text.includes('github.com/')) {
      const parts = text.split('/');
      const repoName = parts[parts.length - 1] || parts[parts.length - 2];
      if (repoName) title = repoName.replace(/[^a-zA-Z0-9_-]/g, '');
    } else {
      title = text.split('\n')[0].slice(0, 50);
    }

    // Auto domain classification
    const lower = text.toLowerCase();
    if (lower.includes('seo') || lower.includes('crawl') || lower.includes('keyword') || lower.includes('backlink')) {
      domain = 'SEO';
      subCapability = lower.includes('crawl') ? 'Web Crawling & Extraction' : 'SEO Audit & Keyword Research';
    } else if (lower.includes('ai') || lower.includes('agent') || lower.includes('mcp') || lower.includes('prompt')) {
      domain = 'AI & Prompting';
      subCapability = 'AI Agent & Tool Harness';
    } else if (lower.includes('design') || lower.includes('ui') || lower.includes('css')) {
      domain = 'Design';
      subCapability = 'UI/UX Canvas & Styling';
    } else if (lower.includes('copy') || lower.includes('write')) {
      domain = 'Copywriting';
      subCapability = 'Content Strategy';
    }

    const newTool: Tool = {
      id: 'dump-' + Date.now(),
      title: title || 'Untitled Dump',
      url,
      description: text,
      domain,
      subCapability,
      rating: 9.0,
      tags: ['raw-dump', 'inbox'],
      isOpenSource: true,
      hasApi: true,
      rawInput: text,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sourceOrigin: 'dump_inbox',
    };

    onAddTool(newTool);
    setIsSuccess(true);
    setRawDump('');

    setTimeout(() => {
      setIsSuccess(false);
      onDone();
    }, 800);
  };

  const dumpsList = recentTools.slice(0, 5);

  return (
    <div className="max-w-2xl mx-auto space-y-8 font-sans pt-4 pb-12">
      
      {/* 1. DUMP HEADER & SINGLE INPUT BOX */}
      <div className="space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            DUMP INTO YOUR BRAIN
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Paste anything. The system will figure out what it is.
          </p>
        </div>

        {/* Single Paste Textarea Box */}
        <div className="space-y-3">
          <textarea
            rows={5}
            value={rawDump}
            onChange={(e) => setRawDump(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Paste URL, note, thought, tool, skill, GitHub repo, or anything else..."
            className="w-full bg-[#12141c] border border-[#1e2230] hover:border-slate-700 rounded-lg p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono leading-relaxed transition-colors shadow-inner"
          />

          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[11px] text-slate-500">
              Press <kbd className="px-1.5 py-0.5 bg-[#161a26] border border-[#1e2230] rounded text-slate-400">⌘↵</kbd> to dump
            </span>

            <button
              onClick={executeDump}
              disabled={!rawDump.trim() || isSuccess}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded transition-colors cursor-pointer"
            >
              {isSuccess ? 'Dumped ✓' : 'Dump'}
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-[#161a26]" />

      {/* 2. RECENT DUMPS LIST */}
      <div className="space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <h2 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
            Recent Dumps
          </h2>
          <span className="text-slate-500 text-[11px]">Last 5 items</span>
        </div>

        {dumpsList.length === 0 ? (
          <div className="p-4 text-center text-xs font-mono text-slate-500 bg-[#12141c] border border-[#1e2230] rounded-lg">
            No recent dumps. Paste anything above to add to your brain.
          </div>
        ) : (
          <div className="space-y-2 font-mono text-xs">
            {dumpsList.map((tool) => (
              <div
                key={tool.id}
                className="p-3 rounded bg-[#12141c] border border-[#1e2230] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">{tool.title}</span>
                  <span className="text-[10px] text-slate-500">{tool.domain}</span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
