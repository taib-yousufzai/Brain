'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tool, GodStack } from '@/types';
import { generateGodStack } from '@/lib/godStackEngine';
import { ArrowRight, Copy, Check, ExternalLink, Award, ShieldCheck, Zap, Sparkles, Cpu, Layers, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GodStackGeneratorPanelProps {
  tools: Tool[];
  onOpenLibrary: () => void;
}

const QUICK_CHIPS = [
  { goal: 'SEO Audit Engine', icon: Sparkles, color: 'from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/30' },
  { goal: 'SaaS Product Launch', icon: Flame, color: 'from-amber-500/20 to-orange-500/20 text-amber-300 border-amber-500/30' },
  { goal: 'AI Copy & Slop-Killer', icon: Cpu, color: 'from-emerald-500/20 to-teal-500/20 text-emerald-300 border-emerald-500/30' },
  { goal: 'Full-Stack Dev System', icon: Layers, color: 'from-indigo-500/20 to-cyan-500/20 text-indigo-300 border-indigo-500/30' },
];

export default function GodStackGeneratorPanel({ tools, onOpenLibrary }: GodStackGeneratorPanelProps) {
  const [goal, setGoal] = useState('');
  const [stack, setStack] = useState<GodStack | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const capabilityCount = new Set(tools.map((t) => t.subCapability)).size;
  const domainCount = new Set(tools.map((t) => t.domain)).size;
  const topTierCount = tools.filter((t) => t.rating >= 9.8).length;

  const handleRunWorkflow = (workflowGoal: string) => {
    setGoal(workflowGoal);
    executeAssembly(workflowGoal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    executeAssembly(goal);
  };

  const executeAssembly = (promptText: string) => {
    setIsGenerating(true);

    setTimeout(() => {
      const result = generateGodStack(promptText, tools);
      setStack(result);
      setIsGenerating(false);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b'],
      });
    }, 450);
  };

  const handleCopyMarkdown = () => {
    if (!stack) return;

    let md = `# God Stack: ${stack.goal}\n\n`;
    md += `*Assembled by Brain (Zero Redundancy Engine)*\n\n`;

    stack.slots.forEach((slot, idx) => {
      md += `### ${idx + 1}. ${slot.subCapability}: **${slot.tool.title}** (${slot.tool.rating}/10)\n`;
      md += `- **Domain**: ${slot.tool.domain}\n`;
      md += `- **Description**: ${slot.tool.description}\n`;
      if (slot.tool.url) md += `- **Link**: ${slot.tool.url}\n`;
      md += `- **Why Selected**: ${slot.reasoning}\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      
      {/* Hero Header Banner */}
      <div className="text-center space-y-4 pt-2 pb-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-mono font-medium shadow-inner"
        >
          <Zap className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
          <span>Zero-Redundancy Capability Engine</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] leading-tight"
        >
          Assemble Your <span className="gradient-text-hero">God Stack</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm sm:text-base text-gray-400 max-w-xl mx-auto font-sans leading-relaxed"
        >
          Specify your goal. Brain orchestrates your indexed tools into a non-redundant, maximum-power workflow.
        </motion.p>
      </div>

      {/* Main Command Input Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.25 }}
        className="glass-panel p-3 sm:p-4 rounded-3xl border border-indigo-500/30 shadow-[0_20px_50px_rgba(99,102,241,0.15)] relative overflow-hidden"
      >
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Enter workflow goal (e.g., SEO audit, SaaS launch, AI copy)..."
              className="w-full bg-black/60 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 font-sans shadow-inner transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !goal.trim()}
            className="cursor-pointer px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0 disabled:opacity-40 active:scale-95"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Orchestrate</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Action Preset Chips */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider shrink-0">Preset:</span>
          {QUICK_CHIPS.map((chip) => {
            const Icon = chip.icon;
            return (
              <button
                key={chip.goal}
                onClick={() => handleRunWorkflow(chip.goal)}
                className={`cursor-pointer px-3 py-1 rounded-xl text-xs font-mono flex items-center gap-1.5 bg-gradient-to-r ${chip.color} border transition-all hover:scale-105 shrink-0`}
              >
                <Icon className="w-3 h-3" />
                <span>{chip.goal}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Live Index Stats Bar */}
      <div
        onClick={onOpenLibrary}
        className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer group hover:border-indigo-500/40 transition-all"
      >
        <div className="flex items-center gap-6 text-xs font-mono">
          <div>
            <span className="text-gray-400">Indexed Tools</span>
            <div className="text-lg font-bold text-white">{tools.length}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-gray-400">Capabilities</span>
            <div className="text-lg font-bold text-cyan-300">{capabilityCount}</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div>
            <span className="text-gray-400">Top-Tier (10/10)</span>
            <div className="text-lg font-bold text-amber-400">{topTierCount}</div>
          </div>
        </div>

        <div className="text-xs font-mono text-indigo-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
          <span>Explore Knowledge Base</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* God Stack Assembly Results Output */}
      <AnimatePresence>
        {stack && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 pt-4"
          >
            {/* Header Result Card */}
            <div className="glass-panel p-6 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
                    Assembled God Stack
                  </h3>
                </div>
                <p className="text-xs font-mono text-gray-300 mt-1">
                  Goal: <strong className="text-white">{stack.goal}</strong> · {stack.slots.length} Unique Capability Slots ({stack.redundancyFiltered} Redundant Excluded)
                </p>
              </div>

              <button
                onClick={handleCopyMarkdown}
                className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono transition-all shrink-0 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-300 font-semibold">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>

            {/* Slots Cards */}
            <div className="space-y-4">
              {stack.slots.map((slot, index) => {
                const isTopTier = slot.tool.rating >= 9.8;

                return (
                  <motion.div
                    key={slot.tool.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.08 }}
                    className={`p-6 rounded-3xl border transition-all ${
                      isTopTier ? 'glass-panel-gold' : 'glass-panel'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-mono text-xs font-bold border border-indigo-500/30">
                          {index + 1}
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-semibold">
                          {slot.subCapability}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{slot.tool.rating}/10</span>
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between mb-2">
                      <h4 className="text-lg font-extrabold text-white font-['Plus_Jakarta_Sans']">
                        {slot.tool.title}
                      </h4>

                      {slot.tool.url && (
                        <a
                          href={slot.tool.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
                        >
                          <span>Open Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    <p className="text-xs text-gray-300 mb-4 leading-relaxed font-sans">
                      {slot.tool.description}
                    </p>

                    <div className="text-[11px] font-mono text-gray-300 bg-black/50 p-3 rounded-xl border border-white/5 flex items-center gap-2">
                      <Zap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{slot.reasoning}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
