'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Tool, CustomNote, Domain } from '@/types';
import { searchBrainKnowledge } from '@/lib/semanticCapabilityEngine';

interface SearchScreenProps {
  tools: Tool[];
  customNotes: CustomNote[];
  initialQuery?: string;
  onSelectTool?: (tool: Tool) => void;
  onSelectNote?: (note: CustomNote) => void;
  onAskBrain?: (query: string) => void;
  onBuildStack?: (query: string) => void;
  onSelectDomain?: (domain: Domain) => void;
}

export default function SearchScreen({
  tools,
  customNotes,
  initialQuery = '',
  onSelectTool,
  onSelectNote,
  onAskBrain,
  onBuildStack,
  onSelectDomain,
}: SearchScreenProps) {
  const [queryInput, setQueryInput] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialQuery) {
      setQueryInput(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const searchResults = searchBrainKnowledge(queryInput, tools, customNotes);

  const sampleQueries = [
    'What do I have for SEO?',
    'What can I use to extract data from websites?',
    'things related to RAG',
    'lead generation',
    'tools for extracting website data',
    'What do I have for virtual iPhone?',
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans pb-16">
      
      {/* 1. SEARCH INPUT BAR */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-sans">
            KNOWLEDGE SEARCH
          </h1>
          <span className="text-xs font-mono text-slate-500">Press / to focus input</span>
        </div>

        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder="Search resources, skills, notes, capabilities (e.g. 'What do I have for SEO?')..."
            className="w-full bg-[#12141c] border border-[#1e2230] hover:border-slate-700 rounded-lg px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono transition-colors"
          />
          {queryInput && (
            <button
              onClick={() => setQueryInput('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 font-mono text-xs cursor-pointer px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Suggested Queries */}
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs pt-1">
          <span className="text-slate-500 text-[11px]">Try searching:</span>
          {sampleQueries.map((sq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setQueryInput(sq)}
              className="px-2.5 py-1 rounded bg-[#131622] hover:bg-[#181c2b] border border-[#1e2230] text-slate-300 hover:text-white transition-colors cursor-pointer text-[11px] truncate max-w-xs"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* 2. SEARCH RESULTS HEADER & TRANSITION ACTIONS */}
      {queryInput.trim() && (
        <div className="space-y-6 pt-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#161a26] pb-3">
            <div className="font-mono text-xs">
              <span className="text-slate-400">
                <strong className="text-white font-bold">{searchResults.totalResults}</strong> results for &ldquo;{queryInput}&rdquo;
              </span>
            </div>

            {searchResults.totalResults > 0 && (
              <div className="flex items-center gap-2 font-mono text-xs">
                {onAskBrain && (
                  <button
                    onClick={() => onAskBrain(queryInput)}
                    className="px-3 py-1.5 rounded bg-[#12141c] hover:bg-[#181c2b] border border-[#1e2230] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <span>Ask Brain about these results</span>
                    <span>&rarr;</span>
                  </button>
                )}

                {onBuildStack && (
                  <button
                    onClick={() => onBuildStack(queryInput)}
                    className="px-3 py-1.5 rounded bg-[#12141c] hover:bg-[#181c2b] border border-[#1e2230] text-amber-400 hover:text-amber-300 transition-colors cursor-pointer text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <span>Build a stack from these</span>
                    <span>&rarr;</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* NO MATCHES FALLBACK */}
          {searchResults.totalResults === 0 && (
            <div className="p-8 rounded-lg bg-[#12141c] border border-[#1e2230] text-center space-y-2 font-mono text-xs text-slate-400">
              <p className="text-slate-300 font-bold">I couldn&apos;t find a strong match in your brain.</p>
              <p className="text-[11px]">
                Try adjusting your search terms or dumping new resources into your vault.
              </p>
            </div>
          )}

          {/* DENSE RESULT ROWS BY CATEGORY */}
          <div className="space-y-6">
            {searchResults.preferSkills ? (
              <>
                {/* 1. SKILLS (PRIMARY FOR SKILL QUERIES) */}
                {searchResults.skills.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-purple-400 font-bold px-1 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>SKILLS ({searchResults.skills.length})</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-purple-950 text-purple-300 border border-purple-900/60 font-mono">
                          PRIMARY INTENT
                        </span>
                      </span>
                      <span className="text-[10px] text-purple-400/80 font-normal">Prioritized for skill query</span>
                    </div>
                    <div className="divide-y divide-[#161a26] border border-purple-900/40 rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.skills.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => onSelectTool && onSelectTool(res.item as Tool)}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-950/80 text-purple-300 border border-purple-900/60">
                                SKILL
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
                                {Math.round(res.relevanceScore * 100)}% match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                              {res.description}
                            </p>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. CAPABILITIES */}
                {searchResults.capabilities.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1">
                      CAPABILITIES ({searchResults.capabilities.length})
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.capabilities.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-900/60">
                                CAPABILITY
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. RESOURCES */}
                {searchResults.resources.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1 flex items-center justify-between">
                      <span>RESOURCES ({searchResults.resources.length})</span>
                      <span className="text-[10px] text-slate-500 font-normal">Secondary matches</span>
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.resources.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => onSelectTool && onSelectTool(res.item as Tool)}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-950/80 text-blue-300 border border-blue-900/60">
                                RESOURCE
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
                                {Math.round(res.relevanceScore * 100)}% match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                              {res.description}
                            </p>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>

                          {res.rating !== undefined && (
                            <span className="text-amber-400 font-bold text-xs shrink-0 font-mono">
                              {res.rating}/10
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. NOTES */}
                {searchResults.notes.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1">
                      NOTES ({searchResults.notes.length})
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.notes.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => onSelectNote && onSelectNote(res.item as CustomNote)}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-900 text-slate-400 border border-slate-800">
                                NOTE
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                                {Math.round(res.relevanceScore * 100)}% match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                              {res.description}
                            </p>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. DOMAINS */}
                {searchResults.domains.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1">
                      DOMAINS ({searchResults.domains.length})
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.domains.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => onSelectDomain && res.domain && onSelectDomain(res.domain as Domain)}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-sky-950/80 text-sky-300 border border-sky-900/60">
                                DOMAIN
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* DEFAULT RENDERING ORDER: RESOURCES FIRST */}
                {/* A. RESOURCES */}
                {searchResults.resources.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1 flex items-center justify-between">
                      <span>RESOURCES ({searchResults.resources.length})</span>
                      <span className="text-[10px] text-slate-500 font-normal">Ranked by relevance</span>
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.resources.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => onSelectTool && onSelectTool(res.item as Tool)}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-950/80 text-blue-300 border border-blue-900/60">
                                RESOURCE
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
                                {Math.round(res.relevanceScore * 100)}% match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                              {res.description}
                            </p>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>

                          {res.rating !== undefined && (
                            <span className="text-amber-400 font-bold text-xs shrink-0 font-mono">
                              {res.rating}/10
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* B. SKILLS */}
                {searchResults.skills.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1">
                      SKILLS ({searchResults.skills.length})
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.skills.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => onSelectTool && onSelectTool(res.item as Tool)}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-purple-950/80 text-purple-300 border border-purple-900/60">
                                SKILL
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-900/40">
                                {Math.round(res.relevanceScore * 100)}% match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                              {res.description}
                            </p>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* C. NOTES */}
                {searchResults.notes.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1">
                      NOTES ({searchResults.notes.length})
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.notes.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => onSelectNote && onSelectNote(res.item as CustomNote)}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-900 text-slate-400 border border-slate-800">
                                NOTE
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-900 text-slate-400 border border-slate-800">
                                {Math.round(res.relevanceScore * 100)}% match
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 font-sans line-clamp-1">
                              {res.description}
                            </p>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* D. CAPABILITIES */}
                {searchResults.capabilities.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1">
                      CAPABILITIES ({searchResults.capabilities.length})
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.capabilities.map((res) => (
                        <div
                          key={res.id}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-950/80 text-amber-300 border border-amber-900/60">
                                CAPABILITY
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* E. DOMAINS */}
                {searchResults.domains.length > 0 && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold px-1">
                      DOMAINS ({searchResults.domains.length})
                    </div>
                    <div className="divide-y divide-[#161a26] border border-[#1e2230] rounded-lg bg-[#12141c] overflow-hidden">
                      {searchResults.domains.map((res) => (
                        <div
                          key={res.id}
                          onClick={() => onSelectDomain && res.domain && onSelectDomain(res.domain as Domain)}
                          className="p-3.5 hover:bg-[#181c2b] transition-colors cursor-pointer flex items-start justify-between gap-4"
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-sky-950/80 text-sky-300 border border-sky-900/60">
                                DOMAIN
                              </span>
                              <span className="font-sans font-bold text-white text-xs truncate">
                                {res.title}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              {res.subtitle}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
