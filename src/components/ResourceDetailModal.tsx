'use client';

import React, { useState } from 'react';
import { Tool } from '@/types';

interface ResourceDetailModalProps {
  tool: Tool | null;
  onClose: () => void;
  onDeleteTool?: (id: string) => void;
}

export default function ResourceDetailModal({
  tool,
  onClose,
  onDeleteTool,
}: ResourceDetailModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!tool) return null;

  const handleCopyUrl = () => {
    if (tool.url) {
      navigator.clipboard.writeText(tool.url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  // Extract explicit capabilities or fallback to tags / subCapability
  const capabilities = tool.capabilities && tool.capabilities.length > 0
    ? tool.capabilities
    : [tool.subCapability, ...tool.tags];

  // Best For bullet points derived from useCases / strengths / description
  const bestForList = tool.useCases && tool.useCases.length > 0
    ? tool.useCases
    : tool.strengths && tool.strengths.length > 0
    ? tool.strengths
    : [tool.description];

  // Relationships fallback
  const complements = tool.complements || (tool.domain === 'SEO' ? ['DataForSEO', 'Ahrefs'] : ['Vercel', 'Docker']);
  const overlaps = tool.overlaps || (tool.domain === 'SEO' ? ['Firecrawl', 'Screaming Frog'] : ['Next.js']);
  const alternatives = tool.alternatives || (tool.domain === 'SEO' ? ['Scrapy', 'Puppeteer'] : ['Vite']);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-sans"
      onClick={onClose}
    >
      <div
        className="bg-[#0d0f17] border border-[#1e2230] max-w-xl w-full rounded-lg shadow-2xl p-6 space-y-6 text-xs text-slate-200 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Section */}
        <div className="space-y-2 border-b border-[#161a26] pb-4">
          <div className="flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] font-bold uppercase">
                {tool.category || tool.entityType || 'RESOURCE'}
              </span>
              <span className="text-slate-400 text-[11px]">{tool.domain}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold text-amber-400">{tool.rating}/10</span>
              <button
                onClick={onClose}
                className="text-slate-500 hover:text-white cursor-pointer font-mono text-sm px-1"
              >
                ✕
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">
            {tool.title}
          </h2>

          <p className="text-slate-400 font-mono text-xs">
            {tool.subCapability}
          </p>

          {tool.url && (
            <div className="text-blue-400 font-mono text-xs truncate pt-0.5">
              {tool.url}
            </div>
          )}

          {/* Primary Actions */}
          <div className="flex items-center gap-2 pt-2">
            {tool.url && (
              <a
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold rounded transition-colors"
              >
                Open Link ↗
              </a>
            )}

            {tool.url && (
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 bg-[#161a26] hover:bg-[#1f2434] border border-[#1e2230] text-slate-300 font-mono text-xs rounded transition-colors cursor-pointer"
              >
                {copiedUrl ? 'Copied ✓' : 'Copy URL'}
              </button>
            )}

            {onDeleteTool && (
              <button
                onClick={() => {
                  onDeleteTool(tool.id);
                  onClose();
                }}
                className="px-3 py-1.5 text-rose-400 hover:underline font-mono text-xs ml-auto cursor-pointer"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* CAPABILITIES SECTION */}
        <div className="space-y-2">
          <div className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Capabilities
          </div>
          <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
            {capabilities.map((cap, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-[#131622] border border-[#1e2230] text-slate-300"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-[#161a26]" />

        {/* BEST FOR SECTION */}
        <div className="space-y-2">
          <div className="font-mono text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Best For
          </div>
          <ul className="space-y-1 font-sans text-xs text-slate-300 list-disc list-inside">
            {bestForList.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="border-t border-[#161a26]" />

        {/* RELATIONSHIPS SECTION */}
        <div className="space-y-3 font-mono text-xs">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Relationships
          </div>

          <div className="space-y-1.5">
            <div className="flex items-start justify-between">
              <span className="text-slate-400">Complements</span>
              <span className="text-slate-200 text-right">{complements.join(', ')}</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-400">Overlaps</span>
              <span className="text-slate-200 text-right">{overlaps.join(', ')}</span>
            </div>

            <div className="flex items-start justify-between">
              <span className="text-slate-400">Alternatives</span>
              <span className="text-slate-200 text-right">{alternatives.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#161a26]" />

        {/* SOURCE METADATA */}
        <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 pt-1">
          <span>Source: {tool.sourceOrigin || tool.source || 'Local Vault'}</span>
          <span>Added: {tool.createdAt ? new Date(tool.createdAt).toLocaleDateString() : 'Aug 14'}</span>
        </div>

      </div>
    </div>
  );
}
