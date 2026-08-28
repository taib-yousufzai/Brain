'use client';

import React, { useState } from 'react';

const AGENTIC_PATTERNS = [
  { id: 1, title: 'Tool Use / Function Calling', desc: 'Execute explicit functions and external APIs deterministically.' },
  { id: 2, title: 'Reflection', desc: 'Agent evaluates its own output, runs test verification, and auto-corrects code errors.' },
  { id: 3, title: 'Plan & Execution', desc: 'Decompose complex requests into explicit sub-tasks and execute sequentially.' },
  { id: 4, title: 'Orchestrator / Worker Pattern', desc: 'Multi-agent architecture delegating sub-tasks to specialized sub-agents.' },
  { id: 5, title: 'Memory & Context Management', desc: 'Distill state into persistent KIs, memory graphs, and structured context buffers.' },
];

const AI_AGENT_BEST_PRACTICES = [
  'One Root folder structure',
  'Brain persistent directory',
  'Claude.md / AGENTS.md documentation',
  'Model routing (fast vs complex models)',
  'Multi-file context loading',
  'Memory folder & state persistence',
  'Index & Tool catalog files',
  'Dedicated project sub-folders',
  'Obsidian vault integration',
  'GitHub repo synchronization',
  'now.md active task tracker',
  'Notion / External Knowledge sync',
  'rules.md / system prompt rules',
  'Skills folder for reusable behaviors',
  'Workflow folder for automation scripts',
  'Python scripts to save token context',
  'Environment variable isolation (.env)',
  'Automated regression verification',
  'Token budget management',
  'Deterministic output validation',
];

const ANTI_VIBECODE_RULES = [
  '1. No harsh gradients',
  '2. No Lucide icons (use inline SVG)',
  '3. No pure white backgrounds',
  '4. No rainbow coloring',
  '5. No drop shadows',
  '6. No 3 feature cards in a row',
  '7. No emojis',
  '8. No liquid glass / heavy backdrop blurs',
  '9. No em-dashes',
  '10. No Inter / Geist / Space Grotesk',
  '11. No colored left border stripes',
  '12. No fake testimonials',
  '13. No bento grids',
  '14. No decorative terminal windows',
  '15. No "it\'s not x, it\'s y" copy',
  '16. No checkmark bullets',
  '17. No 3 pricing tiers',
  '18. No fake/placeholder product demos',
  '19. No soft corner radius (use rounded-md)',
  '20. No purple and black palette',
  '21. Mandatory real skeleton loaders',
  '22. No radial background orbs',
  '23. No dot grids',
  '24. No sparkle icons',
  '25. No animated arrows',
  '26. Mandatory Terms of Service',
  '27. Mandatory Privacy Policy',
  '28. No hover animations for everything',
  '29. No neon colors',
  '30. No basic pastel colors',
];

export default function NotesPanel() {
  const [activeSection, setActiveSection] = useState<'agentic' | 'bestpractices' | 'vibecode'>('agentic');

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Section Header */}
      <div className="bg-[#131823] border border-[#1e2638] p-5 sm:p-6 rounded-lg space-y-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">
            Engineering Notes & Standards Vault
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-1">
            Organized reference notes for agentic architecture, memory management, and enterprise standards.
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-[#1e2638] pt-4 font-mono text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('agentic')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'agentic'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            5 Agentic Patterns
          </button>

          <button
            onClick={() => setActiveSection('bestpractices')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'bestpractices'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            20 AI Agent Rules
          </button>

          <button
            onClick={() => setActiveSection('vibecode')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'vibecode'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            30 Anti-VibeCode Rules
          </button>
        </div>
      </div>

      {/* Content Display */}
      {activeSection === 'agentic' && (
        <div className="bg-[#131823] border border-[#1e2638] p-5 sm:p-6 rounded-lg space-y-4">
          <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] border-b border-slate-800 pb-2">
            5 Core Agentic Design Patterns for Enterprise Agents
          </h2>
          <div className="space-y-3">
            {AGENTIC_PATTERNS.map((pattern) => (
              <div key={pattern.id} className="bg-[#0b0f17] border border-slate-800 p-4 rounded space-y-1">
                <div className="text-xs font-mono font-bold text-blue-400">
                  Pattern {pattern.id}: {pattern.title}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {pattern.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'bestpractices' && (
        <div className="bg-[#131823] border border-[#1e2638] p-5 sm:p-6 rounded-lg space-y-4">
          <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] border-b border-slate-800 pb-2">
            20 Common Things People Forget While Working With AI Agents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            {AI_AGENT_BEST_PRACTICES.map((item, idx) => (
              <div key={idx} className="bg-[#0b0f17] border border-slate-800 p-3 rounded text-slate-300 flex items-center gap-2">
                <span className="text-blue-400 font-bold">{idx + 1}.</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSection === 'vibecode' && (
        <div className="bg-[#131823] border border-[#1e2638] p-5 sm:p-6 rounded-lg space-y-4">
          <h2 className="text-base font-bold text-white font-['Plus_Jakarta_Sans'] border-b border-slate-800 pb-2">
            30 Anti-VibeCode Design Rules
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
            {ANTI_VIBECODE_RULES.map((rule, idx) => (
              <div key={idx} className="bg-[#0b0f17] border border-slate-800 p-2.5 rounded text-slate-300">
                {rule}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
