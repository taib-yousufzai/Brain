import { Domain } from '@/types';
import { classifyQueryIntent } from './queryIntent';
import { CANONICAL_CAPABILITIES } from './capabilityModel';

export interface RequiredCapabilitySlot {
  canonicalId: string;
  capabilityName: string;
  whyRequired: string;
  confidence: number;
}

export interface DecomposedGoal {
  rawGoal: string;
  isGoalRequest: boolean;
  inferredDomain: Domain;
  requiredSlots: RequiredCapabilitySlot[];
}

export function decomposeGoal(goalPrompt: string): DecomposedGoal {
  const intent = classifyQueryIntent(goalPrompt);

  // Requirement #10: Do NOT decompose informational queries!
  if (intent.intentType !== 'goal_request') {
    return {
      rawGoal: goalPrompt,
      isGoalRequest: false,
      inferredDomain: 'General',
      requiredSlots: [],
    };
  }

  const normGoal = goalPrompt.toLowerCase().trim();
  let inferredDomain: Domain = 'General';
  const slots: RequiredCapabilitySlot[] = [];

  // 1. SEO Goal Stack
  if (/seo|search engine|rank/i.test(normGoal)) {
    inferredDomain = 'SEO';
    slots.push(
      {
        canonicalId: 'keyword_research',
        capabilityName: 'Keyword Research',
        whyRequired: 'Essential for discovering high-intent search queries, volume, and ranking difficulty.',
        confidence: 0.98,
      },
      {
        canonicalId: 'technical_seo',
        capabilityName: 'Technical SEO',
        whyRequired: 'Necessary for site crawlability, indexation health, and schema markup.',
        confidence: 0.95,
      },
      {
        canonicalId: 'competitor_analysis',
        capabilityName: 'Competitor Analysis',
        whyRequired: 'Required for SERP gap analysis and benchmarking against ranking competitors.',
        confidence: 0.92,
      },
      {
        canonicalId: 'content_optimization',
        capabilityName: 'Content Optimization',
        whyRequired: 'Needed for on-page SEO polish, E-E-A-T signals, and semantic content scoring.',
        confidence: 0.90,
      },
      {
        canonicalId: 'backlink_analysis',
        capabilityName: 'Backlink Analysis',
        whyRequired: 'Crucial for authority tracking and domain link building opportunities.',
        confidence: 0.88,
      }
    );
  }
  // 2. Lead Generation Goal Stack
  else if (/lead|outreach|prospect/i.test(normGoal)) {
    inferredDomain = 'Marketing';
    slots.push(
      {
        canonicalId: 'lead_generation',
        capabilityName: 'Lead Generation & Prospecting',
        whyRequired: 'Core workflow requirement for identifying B2B contact lists and targets.',
        confidence: 0.95,
      },
      {
        canonicalId: 'browser_automation',
        capabilityName: 'Browser Automation',
        whyRequired: 'Required for automated profile data scraping and list collection.',
        confidence: 0.90,
      },
      {
        canonicalId: 'copywriting',
        capabilityName: 'Copywriting & Landing Copy',
        whyRequired: 'Needed for personalized email templates and high-converting outreach scripts.',
        confidence: 0.85,
      }
    );
  }
  // 3. AI Agent Goal Stack
  else if (/agent|autonomous|multi-agent/i.test(normGoal)) {
    inferredDomain = 'AI & Prompting';
    slots.push(
      {
        canonicalId: 'ai_agent_framework',
        capabilityName: 'AI Agent Framework',
        whyRequired: 'Core orchestration engine for multi-agent loops and tool-calling execution.',
        confidence: 0.98,
      },
      {
        canonicalId: 'web_crawling',
        capabilityName: 'Web Crawling',
        whyRequired: 'Provides live web context and markdown extraction for agent RAG pipelines.',
        confidence: 0.92,
      }
    );
  }
  // 4. Web Scraping / Automation Goal Stack
  else if (/scrape|crawl|browser/i.test(normGoal)) {
    inferredDomain = 'Development';
    slots.push(
      {
        canonicalId: 'web_crawling',
        capabilityName: 'Web Crawling',
        whyRequired: 'Direct execution of website extractions and html parsing.',
        confidence: 0.95,
      },
      {
        canonicalId: 'browser_automation',
        capabilityName: 'Browser Automation',
        whyRequired: 'Handles Javascript-rendered pages and complex login flows.',
        confidence: 0.95,
      }
    );
  }
  // Fallback Dynamic Verbal Extraction
  else {
    slots.push({
      canonicalId: 'general_execution',
      capabilityName: 'Core Workflow Execution',
      whyRequired: 'Baseline capability for goal execution.',
      confidence: 0.70,
    });
  }

  return {
    rawGoal: goalPrompt,
    isGoalRequest: true,
    inferredDomain,
    requiredSlots: slots,
  };
}
