import { Tool, CustomNote } from '@/types';
import { PARSED_PUBLIC_TOOLS } from './fileParser';
import { enrichToolCapabilities } from './semanticCapabilityEngine';

const STORAGE_KEY = 'brain_tools_dataset_v7';
const NOTES_STORAGE_KEY = 'brain_custom_notes_v1';

export const INITIAL_SEED_TOOLS: Tool[] = [
  {
    id: 'seed-blader-humanizer',
    title: 'Blader Humanizer (AI Slop Killer)',
    domain: 'Copywriting',
    subCapability: 'AI Slop Elimination & Humanizer',
    url: 'https://github.com/blader/humanizer',
    description: 'Deletes 25+ generic AI writing tropes, synthetic buzzwords, and passive phrasing. Replaces AI slop with direct human copy.',
    rating: 10.0,
    capabilities: ['ai slop elimination', 'humanizer', 'copywriting', 'content polish'],
    tags: ['ai-slop-killer', 'copywriting', 'humanizer', 'gold-tier'],
    notes: 'God-Stack Champion for AI Copy writing.',
  },
  {
    id: 'seed-coreyhaines-marketing',
    title: 'Corey Haines Marketing Skills',
    domain: 'Marketing',
    subCapability: 'High-Converting Copywriting & Funnels',
    url: 'https://github.com/coreyhaines31/marketingskills',
    description: 'Production-ready framework for landing page copy, value proposition formulas, and email conversion sequences.',
    rating: 10.0,
    capabilities: ['copywriting', 'value proposition', 'landing page copy', 'email marketing', 'conversion optimization'],
    tags: ['copywriter-killer', 'marketing', 'conversion', 'gold-tier'],
    notes: 'God-Stack Champion for Marketing Funnels.',
  },
  {
    id: 'seed-emil-kowalski-design',
    title: 'Emil Kowalski Design System',
    domain: 'Design',
    subCapability: 'Modern UI Taste & Micro-Interactions',
    url: 'https://github.com/emilkowalski/design',
    description: 'Elite micro-interaction rules, smooth state transitions, layout spacing, and visual polish standards.',
    rating: 9.9,
    capabilities: ['ui design', 'micro-interactions', 'design system', 'frontend taste'],
    tags: ['design-taste', 'ui-ux', 'micro-interactions', 'gold-tier'],
    notes: 'God-Stack Champion for Frontend Design Taste.',
  },
  {
    id: 'seed-ponytail-lazy-senior',
    title: 'Ponytail (Lazy Senior Dev Mode)',
    domain: 'Development',
    subCapability: 'Minimal Viable Code & YAGNI',
    url: '',
    description: 'Enforces YAGNI ladder, deletion over addition, and surgical code changes. Prevents over-engineering.',
    rating: 9.8,
    capabilities: ['yagni ladder', 'minimal viable code', 'code refactoring', 'senior dev mode'],
    tags: ['senior-dev', 'clean-code', 'yagni'],
    notes: 'Core development rule set.',
  },
  {
    id: 'seed-fable-method',
    title: 'The Fable Method (Think-Act-Prove)',
    domain: 'Development',
    subCapability: 'Systematic Debugging & Execution',
    url: 'https://github.com/sahir619/fable-method',
    description: '7-step operational framework: Classify -> Define Done -> Evidence -> Surgical Act -> Verify -> Report.',
    rating: 9.9,
    capabilities: ['systematic debugging', 'verification', 'fable method', 'testing'],
    tags: ['systematic-debugging', 'fable-method', 'testing'],
    notes: 'Core operational skill.',
  },
  {
    id: 'seed-context7',
    title: 'Context7 Package Verification',
    domain: 'Development',
    subCapability: 'API & Dependency Signature Audit',
    url: '',
    description: 'Audit installed node_modules / package versions before writing code to prevent hallucinated APIs.',
    rating: 9.7,
    capabilities: ['api verification', 'type safety', 'package auditing', 'context7'],
    tags: ['api-audit', 'type-safety', 'context7'],
    notes: 'Dependency safety check.',
  },
  {
    id: 'seed-task-observer',
    title: 'Task Observer Engine',
    domain: 'Productivity',
    subCapability: 'Sub-task Numbering & Audit Log',
    url: '',
    description: 'Tracks sub-tasks with explicit state numbering, strike-through progress, and final outcome reporting.',
    rating: 9.6,
    capabilities: ['task tracking', 'subtask numbering', 'audit log', 'progress observer'],
    tags: ['task-observer', 'progress-tracker'],
    notes: 'Task execution tracker.',
  },
];

// Helper to deduplicate array of tools by ID or title
function deduplicateTools(list: Tool[]): Tool[] {
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const result: Tool[] = [];

  for (const t of list) {
    if (!t || !t.title) continue;
    const normTitle = t.title.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
    if (!seenIds.has(t.id) && !seenTitles.has(normTitle)) {
      seenIds.add(t.id);
      seenTitles.add(normTitle);
      result.push(enrichToolCapabilities(t));
    }
  }

  return result;
}

export function getStoredTools(): Tool[] {
  const allMerged = [...INITIAL_SEED_TOOLS, ...PARSED_PUBLIC_TOOLS];
  const deduplicated = deduplicateTools(allMerged);

  if (typeof window === 'undefined') return deduplicated;

  try {
    const storedStr = localStorage.getItem(STORAGE_KEY);
    if (!storedStr) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(deduplicated));
      return deduplicated;
    }
    const storedTools: Tool[] = JSON.parse(storedStr);
    const combined = deduplicateTools([...deduplicated, ...storedTools]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combined));
    return combined;
  } catch (error) {
    console.error('Error reading/saving tools in storage:', error);
    return deduplicated;
  }
}

export function saveStoredTools(tools: Tool[]): void {
  if (typeof window === 'undefined') return;
  try {
    const clean = deduplicateTools(tools);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
  } catch (error) {
    console.error('Error saving tools to storage:', error);
  }
}

const FEEDBACK_STORAGE_KEY = 'brain_user_feedback_v1';

export function getStoredNotes(): CustomNote[] {
  if (typeof window === 'undefined') return [];
  try {
    const storedStr = localStorage.getItem(NOTES_STORAGE_KEY);
    return storedStr ? JSON.parse(storedStr) : [];
  } catch (error) {
    console.error('Error reading notes from storage:', error);
    return [];
  }
}

export function saveStoredNotes(notes: CustomNote[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error('Error saving notes to storage:', error);
  }
}

export function getStoredFeedback(): import('@/types').UserFeedback[] {
  if (typeof window === 'undefined') return [];
  try {
    const storedStr = localStorage.getItem(FEEDBACK_STORAGE_KEY);
    return storedStr ? JSON.parse(storedStr) : [];
  } catch (error) {
    console.error('Error reading feedback from storage:', error);
    return [];
  }
}

export function saveStoredFeedback(feedbackList: import('@/types').UserFeedback[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedbackList));
  } catch (error) {
    console.error('Error saving feedback to storage:', error);
  }
}

