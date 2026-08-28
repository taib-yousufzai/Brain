'use client';

import React, { useState } from 'react';
import { Tool, GodStack } from '@/types';
import { generateGodStack } from '@/lib/godStackEngine';
import { ArrowRight, Copy, Check, ExternalLink, Award, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GodStackGeneratorPanelProps {
  tools: Tool[];
  onOpenLibrary: () => void;
}

const RECENT_WORKFLOWS = [
  { goal: 'SEO audit', count: '8 tools' },
  { goal: 'SaaS launch', count: '11 tools' },
  { goal: 'Research workflow', count: '6 tools' },
];

export default function GodStackGeneratorPanel({ tools, onOpenLibrary }: GodStackGeneratorPanelProps) {
  const [goal, setGoal] = useState('');
  const [stack, setStack] = useState<GodStack | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const capabilityCount = new Set(tools.map((t) => t.subCapability)).size;

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
        particleCount: 40,
        spread: 50,
        origin: { y: 0.5 },
        colors: ['#6366f1', '#8b5cf6', '#10b981'],
      });
    }, 300);
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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 font-sans">
      {/* Hero Stack Builder Header */}
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-white font-['Plus_Jakarta_Sans'] mb-2">
            Stack Builder
          </h2>
          <p className="text-sm text-gray-400 font-sans leading-relaxed">
            Build a workflow from capabilities, not overlapping tools.
          </p>
        </div>

        {/* Input Form matching exact wireframe */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What are you trying to accomplish?"
              className="w-full bg-black/60 border border-white/20 rounded-2xl px-6 py-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 font-sans shadow-inner transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating || !goal.trim()}
            className="w-14 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center transition-all shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-40"
            title="Assemble Stack"
          >
            {isGenerating ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      <hr className="border-white/10" />

      {/* RECENT Section */}
      <div className="space-y-4">
        <div className="text-xs font-mono tracking-widest text-gray-400 uppercase">
          RECENT
        </div>

        <div className="space-y-2">
          {RECENT_WORKFLOWS.map((item) => (
            <div
              key={item.goal}
              onClick={() => handleRunWorkflow(item.goal)}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all cursor-pointer group"
            >
              <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                {item.goal}
              </span>
              <span className="text-xs font-mono text-gray-400">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <hr className="border-white/10" />

      {/* LIBRARY Section Summary Bar */}
      <div
        onClick={onOpenLibrary}
        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 transition-all cursor-pointer group gap-2"
      >
        <div>
          <div className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-1">
            LIBRARY
          </div>
          <div className="text-sm font-medium text-gray-300">
            <strong className="text-white">{tools.length} tools</strong> · <strong className="text-white">{capabilityCount} capabilities</strong> · updated today
          </div>
        </div>

        <div className="text-xs font-mono text-indigo-400 group-hover:underline self-start sm:self-auto">
          Browse All Tools →
        </div>
      </div>

      {/* God Stack Results View */}
      {stack && (
        <div className="pt-6 space-y-6 animate-in fade-in duration-300">
          <hr className="border-white/10" />

          {/* Results Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-extrabold text-white font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Assembled Stack: {stack.goal}</span>
              </h3>
              <p className="text-xs font-mono text-gray-400 mt-1">
                {stack.slots.length} Distinct Capabilities · {stack.redundancyFiltered} Overlapping Tools Excluded (0% Redundancy)
              </p>
            </div>

            <button
              onClick={handleCopyMarkdown}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-mono transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Markdown</span>
                </>
              )}
            </button>
          </div>

          {/* Slots List */}
          <div className="space-y-4">
            {stack.slots.map((slot, index) => {
              const isTopTier = slot.tool.rating >= 9.8;

              return (
                <div
                  key={slot.tool.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isTopTier
                      ? 'bg-amber-500/[0.04] border-amber-500/30'
                      : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-indigo-400 font-bold">
                        0{index + 1}.
                      </span>
                      <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-white/10 text-cyan-300">
                        {slot.subCapability}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-amber-400 font-bold">
                      <Award className="w-3.5 h-3.5" />
                      <span>{slot.tool.rating}/10</span>
                    </div>
                  </div>

                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                      {slot.tool.title}
                    </h4>

                    {slot.tool.url && (
                      <a
                        href={slot.tool.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-mono text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <span>Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                    {slot.tool.description}
                  </p>

                  <div className="text-[11px] font-mono text-gray-400 bg-black/40 p-2.5 rounded-xl border border-white/5 flex items-center gap-1.5">
                    <Zap className="w-3 h-3 text-indigo-400 shrink-0" />
                    <span>{slot.reasoning}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
