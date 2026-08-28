'use client';

import React, { useState } from 'react';
import { Tool, Domain } from '@/types';
import confetti from 'canvas-confetti';

interface QuickIngestPanelProps {
  onAddTool: (tool: Tool) => void;
  onDone: () => void;
}

const DOMAIN_OPTIONS: Domain[] = [
  'SEO',
  'Development',
  'Design',
  'Marketing',
  'Copywriting',
  'DevOps',
  'AI & Prompting',
  'Productivity',
];

export default function QuickIngestPanel({ onAddTool, onDone }: QuickIngestPanelProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState<Domain>('SEO');
  const [subCapability, setSubCapability] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState(9.5);
  const [tagsInput, setTagsInput] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAutoExtract = () => {
    if (!title.trim() && !url.trim()) return;
    const lower = (title + ' ' + url + ' ' + description).toLowerCase();

    if (lower.includes('seo') || lower.includes('keyword') || lower.includes('backlink')) {
      setDomain('SEO');
      if (lower.includes('keyword')) setSubCapability('Keyword Research');
      else if (lower.includes('backlink')) setSubCapability('Backlink Analysis');
      else setSubCapability('Technical Audit');
    } else if (lower.includes('copy') || lower.includes('human') || lower.includes('write')) {
      setDomain('Copywriting');
      setSubCapability('AI Slop Deletion');
    } else if (lower.includes('react') || lower.includes('next') || lower.includes('code')) {
      setDomain('Development');
      setSubCapability('Fullstack Framework');
    }

    if (!tagsInput) {
      setTagsInput('useful, core-stack');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subCapability.trim()) return;

    const newTool: Tool = {
      id: 'tool-' + Date.now(),
      title: title.trim(),
      url: url.trim() || undefined,
      description: description.trim() || 'No description provided.',
      domain,
      subCapability: subCapability.trim(),
      rating: Number(rating),
      notes: notes.trim() || undefined,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
      createdAt: new Date().toISOString(),
    };

    onAddTool(newTool);
    setIsSuccess(true);

    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.5 },
      colors: ['#3b82f6', '#10b981'],
    });

    setTimeout(() => {
      onDone();
    }, 900);
  };

  return (
    <div className="bg-[#131823] border border-[#1e2638] max-w-2xl mx-auto rounded-lg p-6 space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#1e2638] pb-4">
        <div>
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
            Ingest Tool & Capability Note
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Index custom tools or capabilities into Brain's deterministic workflow engine.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAutoExtract}
          className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer"
        >
          Auto Tag
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-slate-300 mb-1">
              Tool Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Screaming Frog"
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-mono text-slate-300 mb-1">
              URL (Optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-mono text-slate-300 mb-1">Domain *</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as Domain)}
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {DOMAIN_OPTIONS.map((d) => (
                <option key={d} value={d} className="bg-slate-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-mono text-slate-300 mb-1">
              Sub-Capability Slot *
            </label>
            <input
              type="text"
              required
              value={subCapability}
              onChange={(e) => setSubCapability(e.target.value)}
              placeholder="e.g. Keyword Research"
              className="w-full bg-[#0b0f17] border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block font-mono text-slate-300 mb-1 flex items-center justify-between">
              <span>Utility Rating</span>
              <span className="text-amber-400 font-bold">{rating}/10</span>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full accent-blue-500 mt-2 cursor-pointer"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-slate-300 mb-1">Description</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief summary of capabilities..."
            className="w-full bg-[#0b0f17] border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-mono text-slate-300 mb-1">Personal Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Best practices and use cases..."
            className="w-full bg-[#0b0f17] border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block font-mono text-slate-300 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="seo, crawling, audit"
            className="w-full bg-[#0b0f17] border border-slate-700 rounded-md px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSuccess}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-mono font-medium text-xs rounded-md transition-colors cursor-pointer"
          >
            {isSuccess ? 'Saved to Index' : 'Save Tool'}
          </button>
        </div>
      </form>
    </div>
  );
}
