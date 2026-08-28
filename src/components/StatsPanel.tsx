'use client';

import React from 'react';
import { Tool } from '@/types';
import { Layers, ShieldCheck, Star, Award, Zap, Sparkles } from 'lucide-react';

interface StatsPanelProps {
  tools: Tool[];
}

export default function StatsPanel({ tools }: StatsPanelProps) {
  const domainsCount = new Set(tools.map((t) => t.domain)).size;
  const capabilitiesCount = new Set(tools.map((t) => t.subCapability)).size;
  const topTierCount = tools.filter((t) => t.rating >= 9.8).length;
  const avgRating = tools.length
    ? (tools.reduce((acc, t) => acc + t.rating, 0) / tools.length).toFixed(1)
    : '0';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Metric 1: Total Indexed Tools */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between group">
        <div>
          <div className="text-[11px] text-gray-400 font-mono uppercase tracking-wider mb-1">
            Indexed Skills & Tools
          </div>
          <div className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] flex items-baseline gap-2">
            <span>{tools.length}</span>
            <span className="text-xs text-indigo-400 font-mono font-normal">Active</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 2: Distinct Capability Slots */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between group">
        <div>
          <div className="text-[11px] text-gray-400 font-mono uppercase tracking-wider mb-1">
            Sub-Capability Slots
          </div>
          <div className="text-2xl font-extrabold text-white font-['Plus_Jakarta_Sans'] flex items-baseline gap-2">
            <span>{capabilitiesCount}</span>
            <span className="text-xs text-cyan-400 font-mono font-normal">Mapped</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
          <Award className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 3: Top-Tier Champions (10/10 & 9.8+) */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between group">
        <div>
          <div className="text-[11px] text-gray-400 font-mono uppercase tracking-wider mb-1">
            God-Tier Champions
          </div>
          <div className="text-2xl font-extrabold text-amber-300 font-['Plus_Jakarta_Sans'] flex items-baseline gap-2">
            <span>{topTierCount}</span>
            <span className="text-xs text-amber-400/80 font-mono font-normal">Rated 9.8+</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>

      {/* Metric 4: Average Quality Score */}
      <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center justify-between group">
        <div>
          <div className="text-[11px] text-gray-400 font-mono uppercase tracking-wider mb-1">
            Avg Utility Score
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-['Plus_Jakarta_Sans'] flex items-baseline gap-2">
            <span>{avgRating}</span>
            <span className="text-xs text-emerald-400/70 font-mono font-normal">/ 10</span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
          <Star className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
