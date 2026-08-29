'use client';

import React, { useState, useEffect } from 'react';
import { CustomNote } from '@/types';
import { getStoredNotes, saveStoredNotes } from '@/lib/storage';

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
  const [activeSection, setActiveSection] = useState<'custom' | 'agentic' | 'bestpractices' | 'vibecode'>('custom');
  const [customNotes, setCustomNotes] = useState<CustomNote[]>([]);
  
  // Note Form Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CustomNote | null>(null);
  const [titleInput, setTitleInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<'agentic' | 'bestpractices' | 'vibecode' | 'general'>('general');
  const [contentInput, setContentInput] = useState('');

  useEffect(() => {
    setCustomNotes(getStoredNotes());
  }, []);

  const handleOpenAddModal = () => {
    setEditingNote(null);
    setTitleInput('');
    setCategoryInput('general');
    setContentInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note: CustomNote) => {
    setEditingNote(note);
    setTitleInput(note.title);
    setCategoryInput(note.category);
    setContentInput(note.content);
    setIsModalOpen(true);
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim() || !contentInput.trim()) return;

    if (editingNote) {
      // Update existing note
      const updated = customNotes.map((n) =>
        n.id === editingNote.id
          ? {
              ...n,
              title: titleInput.trim(),
              category: categoryInput,
              content: contentInput.trim(),
            }
          : n
      );
      setCustomNotes(updated);
      saveStoredNotes(updated);
    } else {
      // Add new note
      const newNote: CustomNote = {
        id: `note-${Date.now()}`,
        title: titleInput.trim(),
        category: categoryInput,
        content: contentInput.trim(),
        createdAt: new Date().toLocaleDateString(),
      };
      const updated = [newNote, ...customNotes];
      setCustomNotes(updated);
      saveStoredNotes(updated);
    }

    setIsModalOpen(false);
  };

  const handleDeleteNote = (id: string) => {
    const updated = customNotes.filter((n) => n.id !== id);
    setCustomNotes(updated);
    saveStoredNotes(updated);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      
      {/* Section Header */}
      <div className="bg-[#12141c] border border-[#1e2230] p-5 sm:p-6 rounded-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white font-sans">
              Notes & Knowledge Vault
            </h1>
            <p className="text-xs text-slate-400 font-sans mt-1">
              Create, edit, and organize custom notes alongside system architecture standards.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-mono font-medium text-xs rounded-md transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            + Add New Note
          </button>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-[#1e2638] pt-4 font-mono text-xs overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveSection('custom')}
            className={`px-3 py-1.5 rounded transition-colors cursor-pointer whitespace-nowrap ${
              activeSection === 'custom'
                ? 'bg-blue-600 text-white font-bold'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            My Custom Notes ({customNotes.length})
          </button>

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

      {/* Custom User Notes Section */}
      {activeSection === 'custom' && (
        <div className="space-y-4">
          {customNotes.length === 0 ? (
            <div className="bg-[#131823] border border-[#1e2638] p-8 sm:p-10 rounded-lg text-center space-y-3">
              <p className="text-xs text-slate-400 font-mono">No custom notes added yet.</p>
              <button
                onClick={handleOpenAddModal}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-mono rounded cursor-pointer transition-colors"
              >
                Create Your First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-[#131823] border border-[#1e2638] p-4 sm:p-5 rounded-lg space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800 text-[10px] uppercase">
                        {note.category}
                      </span>
                      <span className="text-slate-500 text-[10px]">{note.createdAt}</span>
                    </div>

                    <h3 className="text-base font-bold text-white font-['Plus_Jakarta_Sans']">
                      {note.title}
                    </h3>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                      {note.content}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3 font-mono text-xs">
                    <button
                      onClick={() => handleOpenEditModal(note)}
                      className="text-blue-400 hover:underline cursor-pointer"
                    >
                      Edit Note
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-rose-400 hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Built-in System Reference Notes */}
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

      {/* Add / Edit Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 font-sans">
          <form
            onSubmit={handleSaveNote}
            className="bg-[#131823] border border-[#1e2638] max-w-lg w-full p-6 rounded-lg space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-[#1e2638] pb-3">
              <h3 className="text-sm font-bold text-white font-['Plus_Jakarta_Sans']">
                {editingNote ? 'Edit Note' : 'Add New Custom Note'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer font-mono"
              >
                Cancel
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">
                  Note Title
                </label>
                <input
                  type="text"
                  required
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Enter note title..."
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">
                  Category
                </label>
                <select
                  value={categoryInput}
                  onChange={(e) =>
                    setCategoryInput(e.target.value as 'agentic' | 'bestpractices' | 'vibecode' | 'general')
                  }
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded px-3 py-2 text-xs text-white font-mono"
                >
                  <option value="general">General Note</option>
                  <option value="agentic">Agentic Architecture</option>
                  <option value="bestpractices">Best Practices</option>
                  <option value="vibecode">UI & Design Rules</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-mono text-[11px] mb-1">
                  Note Content
                </label>
                <textarea
                  required
                  rows={5}
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Enter your detailed notes, code snippets, or rules..."
                  className="w-full bg-[#0b0f17] border border-slate-700 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 font-mono">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded cursor-pointer text-xs font-bold"
              >
                {editingNote ? 'Save Changes' : 'Create Note'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
