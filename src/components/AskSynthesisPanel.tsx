'use client';

import React, { useState } from 'react';
import { Tool, CustomNote, SynthesisResult } from '@/types';
import { synthesizeQuery } from '@/lib/synthesisEngine';

interface AskSynthesisPanelProps {
  tools: Tool[];
  customNotes: CustomNote[];
  initialQuery?: string;
  onSelectTool?: (tool: Tool) => void;
}

const SAMPLE_QUERIES = [
  'What is our best stack for web crawling and SERP extraction?',
  'How do we handle local LLM deployment and privacy?',
  'What tools do we have for lead generation automation?',
];

export default function AskSynthesisPanel({
  tools,
  customNotes,
  initialQuery = '',
  onSelectTool,
}: AskSynthesisPanelProps) {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [result, setResult] = useState<SynthesisResult | null>(null);

  React.useEffect(() => {
    if (initialQuery) {
      setQueryInput(initialQuery);
      const synthResult = synthesizeQuery(initialQuery, tools, customNotes);
      setResult(synthResult);
    }
  }, [initialQuery, tools, customNotes]);

  const handleAsk = (queryStr: string) => {
    if (!queryStr.trim()) return;
    setQueryInput(queryStr);
    const synthResult = synthesizeQuery(queryStr, tools, customNotes);
    setResult(synthResult);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans pb-12">
      
      {/* 1. ASK BRAIN HEADER & INPUT */}
      <div className="space-y-4 pt-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            ASK YOUR BRAIN
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Synthesize facts, AI inferences, and capabilities from your indexed library and notes.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAsk(queryInput);
          }}
          className="space-y-3"
        >
          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="Ask a question about your tools, skills, or knowledge..."
              className="flex-1 bg-[#12141c] border border-[#1e2230] hover:border-slate-700 rounded-lg px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
            />
            <button
              type="submit"
              disabled={!queryInput.trim()}
              className="px-5 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-mono text-xs font-bold rounded cursor-pointer transition-colors shrink-0"
            >
              Synthesize
            </button>
          </div>

          {/* Sample Queries */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs pt-1">
            <span className="text-slate-500 text-[11px]">Suggested:</span>
            {SAMPLE_QUERIES.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleAsk(sq)}
                className="px-2.5 py-1 rounded bg-[#131622] hover:bg-[#181c2b] border border-[#1e2230] text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] truncate max-w-xs"
              >
                {sq}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* 2. STRUCTURED KNOWLEDGE REPORT */}
      {result && (
        <div className="space-y-6 pt-4 border-t border-[#161a26]">
          
          {/* Report Summary */}
          <div className="p-4 rounded-lg bg-[#12141c] border border-[#1e2230] space-y-2">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-blue-400 font-bold uppercase text-[10px]">Synthesis Report</span>
              <span className="text-slate-500">{result.relevantTools.length} tools evaluated</span>
            </div>
            <h2 className="text-lg font-bold text-white font-sans">{result.topic}</h2>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Sections Grid / Categorized Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
            {result.sections.map((section, idx) => {
              const categoryColor =
                section.category === 'source_fact'
                  ? 'text-emerald-400 border-emerald-900/40'
                  : section.category === 'ai_inference'
                  ? 'text-blue-400 border-blue-900/40'
                  : 'text-amber-400 border-amber-900/40';

              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg bg-[#12141c] border ${categoryColor} space-y-2`}
                >
                  <div className="font-bold text-xs uppercase tracking-wider">
                    {section.title}
                  </div>
                  <ul className="list-disc list-inside text-slate-300 font-sans text-xs space-y-1.5 leading-relaxed">
                    {section.items.map((item, itemIdx) => (
                      <li key={itemIdx}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Matching Library Tools */}
          {result.relevantTools.length > 0 && (
            <div className="space-y-3 font-mono text-xs pt-2">
              <div className="border-b border-[#161a26] pb-2">
                <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                  Matching Knowledge Tools ({result.relevantTools.length})
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.relevantTools.map((tool) => (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool && onSelectTool(tool)}
                    className="p-3 rounded bg-[#12141c] border border-[#1e2230] hover:border-slate-700 cursor-pointer space-y-1 transition-colors"
                  >
                    <div className="flex items-center justify-between font-sans font-bold text-slate-200">
                      <span>{tool.title}</span>
                      <span className="text-amber-400 text-xs font-mono">{tool.rating}/10</span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-sans line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
