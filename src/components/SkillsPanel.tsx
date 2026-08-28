'use client';

import React, { useState } from 'react';
import { Tool } from '@/types';

interface SkillsPanelProps {
  tools: Tool[];
  onDeleteSkill?: (id: string) => void;
}

const AI_AGENT_SKILLS_VAULT: { title: string; category: string; url: string; description: string; rating: number }[] = [
  {
    title: 'Composio Tooling & Workbench',
    category: 'Skill Toolkit',
    url: 'https://github.com/composiohq/composio',
    description: 'Powers 1000+ toolkits, tool search, context management, authentication, and sandboxed workbenches for agentic workflows.',
    rating: 9.9,
  },
  {
    title: 'CrewAI Orchestration Framework',
    category: 'Agent Skill',
    url: 'https://github.com/crewaiinc/crewai',
    description: 'Framework for orchestrating role-playing autonomous AI agents with collaborative task delegation.',
    rating: 9.8,
  },
  {
    title: 'LibreChat MCP & Skills Engine',
    category: 'Agent Interface',
    url: 'https://github.com/danny-avila/librechat',
    description: 'Self-hosted ChatGPT alternative supporting Model Context Protocol (MCP), Skills, DeepSeek, and multi-model switching.',
    rating: 9.9,
  },
  {
    title: 'OpenHands Developer Control Center',
    category: 'Coding Agent',
    url: 'https://github.com/OpenHands/openhands',
    description: 'Self-hosted control center for autonomous coding agents, shell operations, and software engineering automations.',
    rating: 9.7,
  },
  {
    title: 'Dify Agent & RAG Pipeline Engine',
    category: 'Workflow Platform',
    url: 'https://github.com/langgenius/dify',
    description: 'Open-source LLM app development platform combining AI workflow visualizers, RAG pipelines, and model observability.',
    rating: 9.8,
  },
  {
    title: 'Open WebUI Local Engine',
    category: 'Local AI Platform',
    url: 'https://github.com/open-webui/open-webui',
    description: 'Extensible self-hosted AI deployment platform operating offline with Ollama, RAG, and OpenAI-compatible runners.',
    rating: 9.9,
  },
  {
    title: 'AnythingLLM Desktop Agent',
    category: 'Local Agent',
    url: 'https://github.com/mintplex-labs/anything-llm',
    description: 'Local-first zero-setup agent experience for document context vectorization and private LLM execution.',
    rating: 9.6,
  },
  {
    title: 'RAGFlow Context & RAG Engine',
    category: 'RAG Skill',
    url: 'https://github.com/infiniflow/ragflow',
    description: 'Deep document comprehension RAG engine with agent capabilities for high-precision knowledge retrieval.',
    rating: 9.7,
  },
  {
    title: 'Google Maps Lead Scraper Skill',
    category: 'Scraping Skill',
    url: 'https://github.com/gosom/google-maps-scraper',
    description: 'Extracts names, addresses, phone numbers, website URLs, and rating metrics from Google Maps for customer discovery.',
    rating: 9.5,
  },
  {
    title: 'Python Reddit API Skill (PRAW)',
    category: 'Scraping Skill',
    url: 'https://github.com/praw-dev/praw',
    description: 'Python Reddit API Wrapper for social monitoring, lead research, and thread sentiment analysis.',
    rating: 9.4,
  },
];

export default function SkillsPanel({ tools }: SkillsPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Combine static skill vault with user ingested tools tagged as skill/repo or in AI domain
  const userSkills = tools.filter(
    (t) => t.category === 'skill' || t.category === 'repo' || t.domain === 'AI & Prompting'
  );

  const filteredVault = AI_AGENT_SKILLS_VAULT.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6 font-sans">
      
      {/* Header Panel */}
      <div className="bg-[#131823] border border-[#1e2638] p-4 sm:p-6 rounded-lg space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
              AI Skills & Open-Source Repositories
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Dedicated catalog of AI agent skill sets, MCP integrations, scrapers, and open-source frameworks.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 self-start sm:self-auto">
            Category: <span className="text-blue-400 font-bold">AI Skills & Repos</span>
          </div>
        </div>

        {/* Filter Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter skills by keyword, protocol, or framework (e.g. MCP, RAG, Scraper)..."
          className="w-full bg-[#0b0f17] border border-slate-700 rounded-md px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
        />
      </div>

      {/* Main Grid Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredVault.map((skill, index) => (
          <div
            key={index}
            className="bg-[#131823] border border-[#1e2638] p-4 sm:p-5 rounded-lg space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px]">
                  {skill.category}
                </span>
                <span className="text-amber-400 font-bold text-[11px]">
                  Rating: {skill.rating}/10
                </span>
              </div>

              <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                {skill.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {skill.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between font-mono text-xs">
              <span className="text-slate-500 text-[11px]">Category: Skill / Repo</span>
              <a
                href={skill.url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                GitHub Repository &rarr;
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* User Custom Ingested AI Skills Section */}
      {userSkills.length > 0 && (
        <div className="bg-[#131823] border border-[#1e2638] p-5 rounded-lg space-y-3">
          <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans'] font-mono">
            User Ingested AI Skills ({userSkills.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userSkills.map((tool) => (
              <div key={tool.id} className="bg-[#0b0f17] border border-slate-800 p-3.5 rounded text-xs space-y-2">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-blue-400">{tool.subCapability}</span>
                  <span className="text-amber-400">{tool.rating}/10</span>
                </div>
                <div className="font-bold text-white text-sm">{tool.title}</div>
                <p className="text-slate-300 text-[11px]">{tool.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
