'use client';

import React, { useState } from 'react';
import { Tool, UserPreferences, GodStack } from '@/types';
import { generateGodStack } from '@/lib/godStackEngine';

interface GodStackGeneratorPanelProps {
  tools: Tool[];
  initialQuery?: string;
  onSelectTool?: (tool: Tool) => void;
}

export default function GodStackGeneratorPanel({ tools, initialQuery = '', onSelectTool }: GodStackGeneratorPanelProps) {
  const [goalInput, setGoalInput] = useState(initialQuery);
  const [preferences, setPreferences] = useState<UserPreferences>({
    openSourceOnly: false,
    selfHostedOnly: false,
    apiRequired: false,
  });
  const [godStack, setGodStack] = useState<GodStack | null>(null);

  React.useEffect(() => {
    if (initialQuery) {
      setGoalInput(initialQuery);
      const stack = generateGodStack(initialQuery.trim(), tools, preferences);
      setGodStack(stack);
    }
  }, [initialQuery, tools]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;

    const stack = generateGodStack(goalInput.trim(), tools, preferences);
    setGodStack(stack);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      
      {/* 1. BUILD A STACK HEADER & INPUT FORM */}
      <div className="space-y-4 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            BUILD A STACK
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Specify your technical objective. The orchestrator will decompose it into slots & assemble optimal tools.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="text"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              placeholder="e.g. Build an automated lead generation & technical SEO crawler..."
              className="flex-1 bg-[#12141c] border border-[#1e2230] hover:border-slate-700 rounded-lg px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
            />
            <button
              type="submit"
              disabled={!goalInput.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-mono text-xs font-bold rounded cursor-pointer transition-colors shrink-0"
            >
              Generate Stack
            </button>
          </div>

          {/* User Preferences Checkboxes */}
          <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preferences.openSourceOnly}
                onChange={(e) => setPreferences({ ...preferences, openSourceOnly: e.target.checked })}
                className="accent-blue-600 rounded"
              />
              <span>Open Source Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preferences.selfHostedOnly}
                onChange={(e) => setPreferences({ ...preferences, selfHostedOnly: e.target.checked })}
                className="accent-blue-600 rounded"
              />
              <span>Self-Hosted Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={preferences.apiRequired}
                onChange={(e) => setPreferences({ ...preferences, apiRequired: e.target.checked })}
                className="accent-blue-600 rounded"
              />
              <span>API Required</span>
            </label>
          </div>
        </form>
      </div>

      {/* 2. STACK RECOMMENDATION REPORT */}
      {godStack && (
        <div className="space-y-6 pt-4 border-t border-[#161a26]">
          
          {/* Coverage Summary Header */}
          <div className="p-4 rounded-lg bg-[#12141c] border border-[#1e2230] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-bold">Goal Objective</div>
              <div className="text-sm font-bold text-white font-sans mt-0.5">{godStack.goal}</div>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <div className="px-3 py-1 rounded bg-[#171b26] border border-[#1e2230] text-blue-400 font-bold">
                Coverage: {godStack.coveragePercentage}%
              </div>
              <div className="text-slate-400">
                {godStack.slots.length} Slots Selected
              </div>
            </div>
          </div>

          {/* Numbered Technical Steps */}
          <div className="space-y-4 font-mono text-xs">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recommended Stack Architecture
            </h2>

            {godStack.slots.map((slot, idx) => {
              const stepNumber = String(idx + 1).padStart(2, '0');
              return (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-[#12141c] border border-[#1e2230] space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-[#161a26] pb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-blue-500 font-bold text-sm">{stepNumber}</span>
                      <span className="text-white font-bold text-sm font-sans">{slot.subCapability}</span>
                    </div>

                    <span className="text-amber-400 font-bold text-[11px]">
                      {slot.tool.rating}/10 Match
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-[11px]">Selected Tool:</span>
                      <button
                        onClick={() => onSelectTool && onSelectTool(slot.tool)}
                        className="font-bold text-blue-400 hover:underline cursor-pointer font-sans text-sm"
                      >
                        {slot.tool.title}
                      </button>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Strongest Match
                      </span>
                    </div>

                    <p className="text-slate-300 text-xs font-sans leading-relaxed">
                      {slot.reasoning}
                    </p>
                  </div>

                  {slot.alternatives && slot.alternatives.length > 0 && (
                    <div className="pt-2 border-t border-[#161a26] text-[11px] flex items-center gap-2">
                      <span className="text-slate-500">Also considered:</span>
                      <span className="text-slate-300">
                        {slot.alternatives.map((alt) => alt.title).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Knowledge Gaps Warning */}
          {godStack.knowledgeGaps.length > 0 && (
            <div className="p-4 rounded-lg bg-[#12141c] border border-amber-900/40 space-y-2 font-mono text-xs">
              <div className="font-bold text-amber-400 uppercase text-[11px]">
                ⚠️ Identified Knowledge Gaps
              </div>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {godStack.knowledgeGaps.map((gap, idx) => (
                  <li key={idx}>Missing coverage for: <span className="font-bold text-white">{gap}</span></li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
