'use client';

import React, { useState } from 'react';
import { Tool, GodStack } from '@/types';
import { generateGodStack } from '@/lib/godStackEngine';
import confetti from 'canvas-confetti';

interface GodStackGeneratorPanelProps {
  tools: Tool[];
  onOpenLibrary: () => void;
}

const PRESET_WORKFLOWS = [
  'SEO Technical Audit',
  'SaaS Product Architecture',
  'AI Copywriting & Filtering',
  'Fullstack Web Application',
];

export default function GodStackGeneratorPanel({ tools, onOpenLibrary }: GodStackGeneratorPanelProps) {
  const [goal, setGoal] = useState('');
  const [stack, setStack] = useState<GodStack | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const capabilityCount = new Set(tools.map((t) => t.subCapability)).size;

  const handleRunPreset = (presetGoal: string) => {
    setGoal(presetGoal);
    executeAssembly(presetGoal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    executeAssembly(goal);
  };

  const executeAssembly = (promptText: string) => {
    setIsGenerating(true);
    setStack(null);

    setTimeout(() => {
      const result = generateGodStack(promptText, tools);
      setStack(result);
      setIsGenerating(false);

      confetti({
        particleCount: 30,
        spread: 40,
        origin: { y: 0.5 },
        colors: ['#3b82f6', '#10b981', '#64748b'],
      });
    }, 500);
  };

  const handleCopyMarkdown = () => {
    if (!stack) return;

    let md = `# God Stack: ${stack.goal}\n\n`;
    md += `Assembled by Brain Capability Engine\n\n`;

    stack.slots.forEach((slot, idx) => {
      md += `### ${idx + 1}. ${slot.subCapability}: ${slot.tool.title} (${slot.tool.rating}/10)\n`;
      md += `- Domain: ${slot.tool.domain}\n`;
      md += `- Description: ${slot.tool.description}\n`;
      if (slot.tool.url) md += `- Link: ${slot.tool.url}\n`;
      md += `- Reasoning: ${slot.reasoning}\n\n`;
    });

    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopySystemPrompt = () => {
    if (!stack) return;

    let prompt = `<system_prompt>\n`;
    prompt += `You are an elite AI orchestrator tasked with achieving the goal: "${stack.goal}".\n`;
    prompt += `Operate under the following mandatory tool & capability stack:\n\n`;

    stack.slots.forEach((slot, idx) => {
      prompt += `${idx + 1}. [${slot.subCapability}] ${slot.tool.title}\n`;
      prompt += `   - Guideline: ${slot.tool.description}\n`;
      if (slot.tool.notes) prompt += `   - Notes: ${slot.tool.notes}\n`;
    });

    prompt += `\nStrictly follow Ponytail YAGNI principles, minimum viable diff, and zero hallucinated APIs.\n`;
    prompt += `</system_prompt>`;

    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 font-sans">
      
      {/* Header Panel */}
      <div className="bg-[#131823] border border-[#1e2638] p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
            God Stack Orchestrator
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Construct deterministic workflows from indexed tool capabilities with zero redundancy.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Enter workflow objective (e.g. SEO audit, SaaS launch)..."
            className="flex-1 bg-[#0b0f17] border border-slate-700 rounded-md px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
          />

          <button
            type="submit"
            disabled={isGenerating || !goal.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono font-medium text-xs rounded-md transition-colors cursor-pointer shrink-0 active:scale-[0.98]"
          >
            {isGenerating ? 'Assembling...' : 'Assemble Stack'}
          </button>
        </form>

        {/* Preset Workflow Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
          <span className="text-[11px] font-mono text-slate-500 w-full sm:w-auto">Presets:</span>
          {PRESET_WORKFLOWS.map((preset) => (
            <button
              key={preset}
              onClick={() => handleRunPreset(preset)}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors cursor-pointer active:scale-[0.98]"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Metadata Bar */}
      <div 
        onClick={onOpenLibrary}
        className="bg-[#131823] border border-[#1e2638] p-3.5 sm:p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono cursor-pointer hover:border-slate-700 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-3 text-slate-300">
          <span>Total Tools: <strong className="text-white">{tools.length}</strong></span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span>Capabilities: <strong className="text-white">{capabilityCount}</strong></span>
        </div>
        <span className="text-blue-400 hover:underline text-[11px]">View Index &rarr;</span>
      </div>

      {/* Skeleton Loading State */}
      {isGenerating && (
        <div className="bg-[#131823] border border-[#1e2638] p-4 sm:p-6 rounded-lg space-y-4">
          <div className="h-5 w-48 skeleton-box" />
          <div className="space-y-3 pt-2">
            <div className="h-20 w-full skeleton-box" />
            <div className="h-20 w-full skeleton-box" />
            <div className="h-20 w-full skeleton-box" />
          </div>
        </div>
      )}

      {/* Stack Results */}
      {stack && !isGenerating && (
        <div className="bg-[#131823] border border-[#1e2638] p-4 sm:p-6 rounded-lg space-y-4 sm:space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Plus_Jakarta_Sans']">
                Assembled Stack: {stack.goal}
              </h2>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                {stack.slots.length} Capability Slots ({stack.redundancyFiltered} Redundant Excluded)
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <button
                onClick={handleCopySystemPrompt}
                className="px-3 py-1.5 rounded bg-blue-950 hover:bg-blue-900 border border-blue-800 text-blue-200 text-xs font-mono transition-colors cursor-pointer active:scale-[0.98]"
              >
                {copiedPrompt ? 'Copied Prompt ✓' : 'Copy System Prompt'}
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors cursor-pointer active:scale-[0.98]"
              >
                {copiedMd ? 'Copied Markdown ✓' : 'Copy Markdown'}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {stack.slots.map((slot, index) => (
              <div
                key={slot.tool.id}
                className="bg-[#0b0f17] border border-slate-800 p-3.5 sm:p-4 rounded-md space-y-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 font-semibold text-[11px]">
                      Slot {index + 1}: {slot.subCapability}
                    </span>
                    <span className="text-slate-400 text-[11px]">{slot.tool.domain}</span>
                  </div>

                  <span className="text-amber-400 font-bold text-[11px]">
                    Rating: {slot.tool.rating}/10
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-1 pt-1">
                  <h3 className="text-sm sm:text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                    {slot.tool.title}
                  </h3>

                  {slot.tool.url && (
                    <a
                      href={slot.tool.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-mono text-blue-400 hover:underline"
                    >
                      Visit Link &rarr;
                    </a>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {slot.tool.description}
                </p>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-900/60 p-2.5 rounded border border-slate-800">
                  Selection Reason: {slot.reasoning}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
