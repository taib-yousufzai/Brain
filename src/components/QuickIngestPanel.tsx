'use client';

import React, { useState } from 'react';
import { Tool, Domain } from '@/types';
import { Plus, Sparkles, CheckCircle2, Link as LinkIcon, Star, Award } from 'lucide-react';
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
  const [rating, setRating] = useState(9.0);
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
      setSubCapability('AI Slop Deletion & Natural Voice');
    } else if (lower.includes('react') || lower.includes('next') || lower.includes('code')) {
      setDomain('Development');
      setSubCapability('Fullstack Framework');
    } else if (lower.includes('figma') || lower.includes('ui') || lower.includes('design')) {
      setDomain('Design');
      setSubCapability('UI/UX Design');
    }

    if (!tagsInput) {
      setTagsInput('useful, top-tier, workflow');
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
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
      colors: ['#10b981', '#6366f1', '#8b5cf6', '#f59e0b'],
    });

    setTimeout(() => {
      onDone();
    }, 1200);
  };

  return (
    <div className="glass-panel max-w-3xl mx-auto rounded-3xl p-6 md:p-10 border border-white/10 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Ingest New Skill / Tool Note
          </h2>
          <p className="text-xs text-gray-400 font-mono mt-1">
            Store skill links or personal notes. Brain automatically categorizes sub-capabilities.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAutoExtract}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-500/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Auto-Extract Tags</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Tool Title */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">
              Tool / Skill Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Screaming Frog, Blader Humanizer..."
              className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner"
            />
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">
              URL / Link (Optional)
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-black/50 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Domain */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">Domain *</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as Domain)}
              className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans cursor-pointer"
            >
              {DOMAIN_OPTIONS.map((d) => (
                <option key={d} value={d} className="bg-gray-900 text-white">
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Sub-Capability */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5">
              Sub-Capability Slot *
            </label>
            <input
              type="text"
              required
              value={subCapability}
              onChange={(e) => setSubCapability(e.target.value)}
              placeholder="e.g. AI Slop Deletion, Keyword Research..."
              className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner"
            />
          </div>

          {/* Rating */}
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center justify-between">
              <span>Utility Rating</span>
              <strong className="text-amber-400 font-bold">{rating}/10</strong>
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 mt-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-mono text-gray-300 mb-1.5">What does it do?</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief summary of tool capabilities..."
            className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-mono text-gray-300 mb-1.5">
            Personal Notes & Best Use Cases
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Best for 100k+ URL site crawls, use when auditing redirect chains..."
            className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-mono text-gray-300 mb-1.5">
            Tags (comma separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="keywords, backlinks, technical-audit"
            className="w-full bg-black/50 border border-white/15 rounded-2xl px-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSuccess}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold text-xs shadow-xl shadow-indigo-600/30 hover:opacity-95 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
          >
            {isSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved to Brain!</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Ingest Skill</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
