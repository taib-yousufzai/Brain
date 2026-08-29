import { Tool, ResourceCategory, CustomNote, Domain } from '@/types';
import { extractResourceCapabilities, CapabilityEvidence, CANONICAL_CAPABILITIES } from './capabilityModel';
import { classifyQueryIntent } from './queryIntent';

export interface CandidateEvaluation {
  tool: Tool;
  resourceQuality: number; // 0.0 to 10.0
  capabilityRelevance: number; // 0.0 to 1.0
  capabilityConfidence: number; // 0.0 to 1.0
  goalFit: number; // 0.0 to 1.0
  negativeEvidence: boolean;
  rejectionReason?: string;
  matchedCapabilities: string[];
  evidence: CapabilityEvidence[];
}

export interface BrainSearchResult {
  type: 'resource' | 'skill' | 'note' | 'capability' | 'domain';
  matchTier?: 'direct' | 'related' | 'contextual';
  id: string;
  title: string;
  subtitle: string;
  description: string;
  domain?: string;
  rating?: number;
  tags?: string[];
  relevanceScore: number;
  item: Tool | CustomNote | { canonicalId: string; name: string; domain: Domain } | { name: Domain; count: number };
}

const CHECKLIST_FRAGMENT_PATTERNS = [
  /^cutons 404 pages$/i,
  /^cta above the fold$/i,
  /^internal links$/i,
  /^thank you page after enquiry$/i,
  /^breadcrumbs$/i,
  /^case study section$/i,
  /^5 faq$/i,
  /^faq$/i,
  /^response time promise$/i,
  /^sticky mobile cta$/i,
  /^robots\.txt$/i,
  /^unique page titles$/i,
  /^meta descriptions$/i,
  /^social share img$/i,
  /^maps \+ directions$/i,
  /^real reviews$/i,
  /^alt text on images$/i,
  /^local schema$/i,
  /^privacy policy page$/i,
  /primary category/i,
  /secondary category/i,
  /^\s*-\s*\*\*/,
  /^\s*#+/,
  /^google analytics$/i,
  /^real photo of your team$/i,
];

export function enrichToolCapabilities(tool: Tool): Tool {
  const extractedEvidences = extractResourceCapabilities(tool);
  const capabilities = extractedEvidences.map((e) => e.capability);

  let entityType: ResourceCategory = tool.entityType || tool.category || 'tool';
  const lowerTitle = tool.title.toLowerCase().trim();
  const lowerDesc = (tool.description || '').toLowerCase().trim();
  const lowerSub = (tool.subCapability || '').toLowerCase().trim();

  // Detect note/checklist fragments parsed from vault notes
  const isFragment =
    CHECKLIST_FRAGMENT_PATTERNS.some((p) => p.test(lowerTitle)) ||
    (!tool.url && (lowerDesc === lowerTitle || lowerDesc.length < 25));

  const isExplicitSkill =
    tool.entityType === 'skill' ||
    lowerTitle.includes('skill') ||
    lowerTitle.includes('framework') ||
    lowerTitle.includes('method') ||
    lowerTitle.includes('rules') ||
    lowerTitle.includes('system') ||
    lowerTitle.includes('mode') ||
    lowerTitle.includes('humanizer') ||
    lowerTitle.includes('context7') ||
    lowerTitle.startsWith('claude-') ||
    (tool.id && tool.id.startsWith('seed-')) ||
    (tool.tags && tool.tags.some((t) => /skill|gold-tier|rules|framework|method/i.test(t))) ||
    /skill|framework|methodology|rules|standards|taste|guide/i.test(lowerSub) ||
    /skill suite|framework for|operational framework|guideline|standards|rule set/i.test(lowerDesc);

  if (isFragment) {
    entityType = 'note';
  } else if (isExplicitSkill) {
    entityType = 'skill';
  } else if (lowerTitle.includes('mcp')) {
    entityType = 'mcp';
  } else if (lowerTitle.includes('repo') || (tool.url && tool.url.includes('github.com'))) {
    entityType = 'repo';
  } else if (lowerTitle.includes('note') || lowerTitle.includes('guide')) {
    entityType = 'note';
  }

  const source = tool.source || tool.url || tool.sourceOrigin || 'Personal Vault Dump';
  const confidence = tool.confidence !== undefined ? tool.confidence : tool.url ? 0.95 : 0.85;

  return {
    ...tool,
    capabilities,
    entityType,
    category: entityType,
    source,
    confidence,
    rawInput: tool.rawInput || `${tool.title} - ${tool.description} (${tool.url || ''})`,
  };
}

export function evaluateCandidateForQuery(query: string, tool: Tool): CandidateEvaluation {
  const normQuery = query.toLowerCase().trim();
  const enrichedTool = enrichToolCapabilities(tool);
  const evidences = extractResourceCapabilities(enrichedTool);

  const resourceQuality = enrichedTool.rating || 5.0;
  let capabilityRelevance = 0.0;
  let capabilityConfidence = 0.0;
  let negativeEvidence = false;
  let rejectionReason: string | undefined = undefined;
  const matchedCaps: string[] = [];

  const title = (enrichedTool.title || '').toLowerCase().trim();
  const description = (enrichedTool.description || '').toLowerCase().trim();
  const url = (enrichedTool.url || '').toLowerCase().trim();
  const subCap = (enrichedTool.subCapability || '').toLowerCase().trim();

  // Primary evidence derived strictly from title, description, URL, subCapability
  const primaryText = `${title} ${description} ${subCap} ${url}`.trim();
  const fullContextText = `${primaryText} ${enrichedTool.domain || ''} ${(enrichedTool.tags || []).join(' ')}`.toLowerCase();

  const intent = classifyQueryIntent(query);
  const topic = intent.topicKeyword.toLowerCase();
  const coreTopic = (intent.cleanedCoreTopic || topic).toLowerCase();
  const coreTokens = intent.coreTokens || [topic];
  const preferSkills = intent.preferSkills || false;

  // 1. Negative Evidence & Isolation Checks
  // A. Mobile / Apple Virtualization tools (e.g. vphone-cli)
  if (/virtualization|virtual iphone|pcc research vm|mobile vm|kernel|vphone/i.test(primaryText)) {
    const isVirtualQuery = /virtual iphone|vphone|ios|pcc|virtualization|mobile vm/i.test(normQuery);
    if (!isVirtualQuery && /\b(seo|keyword|backlink|search console|rank|serp|link building|crawler|scrape|extraction|copywriting|lead|browser|automation|saas|dev|fullstack)\b/i.test(normQuery)) {
      negativeEvidence = true;
      rejectionReason = `Domain mismatch: '${enrichedTool.title}' is a virtual iPhone/mobile virtualization tool and is incompatible with ${query}.`;
    }
  }

  // B. Browser Automation tools (e.g. agent-browser, Playwright, Puppeteer)
  if (/agent-browser|playwright|playwrite|puppeteer|browser automation|headless browser/i.test(primaryText)) {
    const isBrowserQuery = /browser|playwright|puppeteer|automation|scrape|crawl|extract/i.test(normQuery);
    const isSeoQuery = /\bseo\b/i.test(normQuery) || /search engine optimization/i.test(normQuery);

    if (isSeoQuery && !/seo|search engine|backlink|serp|site audit/i.test(primaryText)) {
      negativeEvidence = true;
      rejectionReason = `'${enrichedTool.title}' is a browser automation utility, not an SEO tool.`;
    }
  }

  if (negativeEvidence) {
    return {
      tool: enrichedTool,
      resourceQuality,
      capabilityRelevance: 0.0,
      capabilityConfidence: 0.0,
      goalFit: 0.0,
      negativeEvidence: true,
      rejectionReason,
      matchedCapabilities: [],
      evidence: [],
    };
  }

  // 2. Direct Query Topic & Intent Matching
  const isSeoQuery = /\bseo\b/i.test(normQuery) || topic === 'seo';
  const isSaasDevQuery = /\bsaas\b/i.test(normQuery) || coreTokens.includes('saas') || (coreTokens.includes('dev') && coreTokens.includes('skills'));

  // Check if primary text (title/description/url) explicitly matches the query topic
  const primaryTopicMatch = primaryText.includes(topic) || (isSeoQuery && /\bseo\b/i.test(primaryText));
  const titleTopicMatch = title.includes(topic) || (isSeoQuery && /\bseo\b/i.test(title));

  if (titleTopicMatch) {
    capabilityRelevance = Math.max(capabilityRelevance, 0.96);
    capabilityConfidence = Math.max(capabilityConfidence, 0.95);
    matchedCaps.push('Title Exact Topic Match');
  } else if (primaryTopicMatch) {
    capabilityRelevance = Math.max(capabilityRelevance, 0.88);
    capabilityConfidence = Math.max(capabilityConfidence, 0.90);
    matchedCaps.push('Description Primary Topic Match');
  }

  // 3. SaaS / Fullstack Dev Specific Rule
  if (isSaasDevQuery) {
    const isSaasDevToolOrSkill =
      enrichedTool.domain === 'Development' ||
      enrichedTool.domain === 'Design' ||
      enrichedTool.domain === 'Copywriting' ||
      enrichedTool.domain === 'Marketing' ||
      enrichedTool.domain === 'DevOps' ||
      /saas|fullstack|senior dev|yagni|ponytail|fable method|context7|posthog|emil kowalski|corey haines|humanizer|claude-blog|next\.js|react|api|database|auth|stripe/i.test(primaryText);

    if (isSaasDevToolOrSkill) {
      if (/ponytail|fable method|context7|emil kowalski|corey haines|humanizer|claude-blog|posthog/i.test(primaryText)) {
        capabilityRelevance = Math.max(capabilityRelevance, 0.92);
        capabilityConfidence = Math.max(capabilityConfidence, 0.92);
        matchedCaps.push('Core SaaS Dev Champion Skill');
      } else if (enrichedTool.domain === 'Development' || enrichedTool.domain === 'Design') {
        capabilityRelevance = Math.max(capabilityRelevance, 0.78);
        capabilityConfidence = Math.max(capabilityConfidence, 0.80);
        matchedCaps.push('SaaS Development Stack Component');
      }
    }
  }

  // 4. Direct Capability Matching via Evidence
  for (const ev of evidences) {
    const normCapName = ev.capability.toLowerCase();
    const normId = ev.canonicalId.toLowerCase();

    const capNameReg = new RegExp(`\\b${normCapName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
    const capIdReg = new RegExp(`\\b${normId.replace(/_/g, ' ')}\\b`, 'i');

    if (capNameReg.test(normQuery) || capIdReg.test(normQuery)) {
      matchedCaps.push(ev.capability);
      capabilityRelevance = Math.max(capabilityRelevance, ev.confidence >= 0.9 ? 0.94 : 0.85);
      capabilityConfidence = Math.max(capabilityConfidence, ev.confidence);
    }
  }

  // 5. Synonym Matching with Strict Keyword Boundaries
  for (const def of Object.values(CANONICAL_CAPABILITIES)) {
    const queryMatchesDef = def.synonyms.some((syn) => {
      if (syn.length <= 3) {
        return new RegExp(`\\b${syn}\\b`, 'i').test(normQuery);
      }
      return normQuery.includes(syn);
    });

    if (queryMatchesDef) {
      const hasCap = enrichedTool.capabilities?.includes(def.name);
      const matchesKw = def.requiredKeywords.some((kw) => primaryText.includes(kw.toLowerCase()));

      if (hasCap || matchesKw) {
        matchedCaps.push(def.name);
        capabilityRelevance = Math.max(capabilityRelevance, 0.86);
        capabilityConfidence = Math.max(capabilityConfidence, 0.85);
      }
    }
  }

  // 6. Secondary Domain Match (only if no primary evidence mismatch)
  if (capabilityRelevance < 0.50 && enrichedTool.domain) {
    const dLower = enrichedTool.domain.toLowerCase();
    if (new RegExp(`\\b${dLower}\\b`, 'i').test(normQuery) || coreTokens.includes(dLower)) {
      if (primaryTopicMatch) {
        capabilityRelevance = Math.max(capabilityRelevance, 0.70);
        capabilityConfidence = Math.max(capabilityConfidence, 0.75);
        matchedCaps.push(`${enrichedTool.domain} Domain`);
      } else {
        // Contextual tag/domain match only
        capabilityRelevance = Math.max(capabilityRelevance, 0.36);
        capabilityConfidence = Math.max(capabilityConfidence, 0.40);
        matchedCaps.push(`${enrichedTool.domain} Domain (Contextual)`);
      }
    }
  }

  // 7. Prefer Skills boost
  if (preferSkills && enrichedTool.entityType === 'skill' && capabilityRelevance > 0.40) {
    capabilityRelevance = Math.min(0.98, capabilityRelevance + 0.08);
    matchedCaps.push('Requested Skill Entity Boost');
  }

  // 7. Token Overlap Fallback for Decomposed Query
  if (coreTokens.length > 0 && capabilityRelevance < 0.50) {
    let hits = 0;
    for (const tok of coreTokens) {
      if (primaryText.includes(tok)) {
        hits++;
      }
    }
    if (hits > 0) {
      const ratio = hits / coreTokens.length;
      if (ratio >= 0.5) {
        capabilityRelevance = Math.max(capabilityRelevance, 0.45 + ratio * 0.25);
        capabilityConfidence = Math.max(capabilityConfidence, 0.50);
      }
    }
  }

  // Decouple Search Relevance: goalFit is searchRelevance with a tiny tie-breaker
  const goalFit = capabilityRelevance > 0 ? capabilityRelevance + resourceQuality / 1000 : 0.0;

  return {
    tool: enrichedTool,
    resourceQuality,
    capabilityRelevance,
    capabilityConfidence,
    goalFit,
    negativeEvidence: false,
    matchedCapabilities: Array.from(new Set(matchedCaps)),
    evidence: evidences,
  };
}

export function searchToolsWithRelevanceGate(
  query: string,
  tools: Tool[],
  minRelevanceThreshold = 0.30,
  minConfidenceThreshold = 0.30
): CandidateEvaluation[] {
  const evaluations = tools.map((t) => evaluateCandidateForQuery(query, t));

  return evaluations
    .filter((ev) => {
      if (ev.negativeEvidence) return false;
      if (ev.capabilityRelevance < minRelevanceThreshold) return false;
      if (ev.capabilityConfidence < minConfidenceThreshold) return false;
      return true;
    })
    .sort((a, b) => b.goalFit - a.goalFit);
}

/**
 * Multi-Entity Global Knowledge Search Function
 * Returns categorized & precision-gated BrainSearchResult items
 */
export function searchBrainKnowledge(
  query: string,
  tools: Tool[],
  customNotes: CustomNote[] = []
): {
  totalResults: number;
  preferSkills: boolean;
  resources: BrainSearchResult[];
  skills: BrainSearchResult[];
  notes: BrainSearchResult[];
  capabilities: BrainSearchResult[];
  domains: BrainSearchResult[];
  directMatches: BrainSearchResult[];
  relatedMatches: BrainSearchResult[];
  contextualMatches: BrainSearchResult[];
} {
  const normQuery = query.toLowerCase().trim();
  const intent = classifyQueryIntent(query);
  const preferSkills = intent.preferSkills || /\bskills?\b/i.test(normQuery) || /\bframeworks?\b/i.test(normQuery) || /\brules?\b/i.test(normQuery);

  if (!normQuery) {
    return {
      totalResults: 0,
      preferSkills: false,
      resources: [],
      skills: [],
      notes: [],
      capabilities: [],
      domains: [],
      directMatches: [],
      relatedMatches: [],
      contextualMatches: [],
    };
  }

  // 1. Search Tools & Skills with Hard Relevance Threshold
  const candidateEvals = searchToolsWithRelevanceGate(normQuery, tools, 0.30, 0.30);

  const resources: BrainSearchResult[] = [];
  const skills: BrainSearchResult[] = [];
  const notesFromTools: BrainSearchResult[] = [];

  const directMatches: BrainSearchResult[] = [];
  const relatedMatches: BrainSearchResult[] = [];
  const contextualMatches: BrainSearchResult[] = [];

  candidateEvals.forEach((ev) => {
    const isFragmentNote = ev.tool.entityType === 'note';
    const isSkill = ev.tool.entityType === 'skill';

    const matchTier: 'direct' | 'related' | 'contextual' =
      ev.capabilityRelevance >= 0.70 ? 'direct' : ev.capabilityRelevance >= 0.45 ? 'related' : 'contextual';

    const resultObj: BrainSearchResult = {
      type: isFragmentNote ? 'note' : isSkill ? 'skill' : 'resource',
      matchTier,
      id: ev.tool.id,
      title: ev.tool.title,
      subtitle: `${ev.tool.domain} · ${ev.tool.subCapability || ev.tool.title}`,
      description: ev.tool.description,
      domain: ev.tool.domain,
      rating: ev.tool.rating,
      tags: ev.tool.tags,
      relevanceScore: ev.capabilityRelevance,
      item: ev.tool,
    };

    if (matchTier === 'direct') directMatches.push(resultObj);
    else if (matchTier === 'related') relatedMatches.push(resultObj);
    else contextualMatches.push(resultObj);

    if (isFragmentNote) {
      notesFromTools.push(resultObj);
    } else if (isSkill) {
      skills.push(resultObj);
    } else {
      resources.push(resultObj);
    }
  });

  // Bound maximum resources to 30 to prevent 100+ result noise
  const boundedResources = resources.slice(0, 30);
  const boundedSkills = skills.slice(0, 20);

  // 2. Search Custom Notes
  const notes: BrainSearchResult[] = [...notesFromTools];
  customNotes.forEach((note) => {
    const noteText = `${note.title} ${note.content} ${note.category}`.toLowerCase();

    // Check negative evidence for notes
    const isSeoQuery = /\bseo\b/i.test(normQuery);
    if (isSeoQuery && /virtual iphone|vphone/i.test(noteText)) {
      return;
    }

    let match = false;
    let score = 0;

    if (note.title.toLowerCase().includes(normQuery)) {
      match = true;
      score = 0.95;
    } else {
      const stopWords = new Set(['what', 'do', 'i', 'have', 'for', 'a', 'an', 'the', 'is', 'in', 'my', 'brain']);
      const queryTokens = normQuery.split(/[^a-z0-9_-]+/).filter((t) => t.length >= 2 && !stopWords.has(t));

      const hits = queryTokens.filter((t) => noteText.includes(t)).length;
      if (queryTokens.length > 0 && hits > 0) {
        match = true;
        score = 0.4 + (hits / queryTokens.length) * 0.4;
      }
    }

    if (match && score >= 0.3) {
      const matchTier = score >= 0.7 ? 'direct' : 'related';
      const noteResult: BrainSearchResult = {
        type: 'note',
        matchTier,
        id: note.id,
        title: note.title,
        subtitle: `Note · Category: ${note.category} · ${note.createdAt}`,
        description: note.content.slice(0, 140) + (note.content.length > 140 ? '...' : ''),
        relevanceScore: score,
        item: note,
      };
      notes.push(noteResult);

      if (matchTier === 'direct') directMatches.push(noteResult);
      else relatedMatches.push(noteResult);
    }
  });

  // 3. Search Capabilities
  const capabilities: BrainSearchResult[] = [];
  for (const def of Object.values(CANONICAL_CAPABILITIES)) {
    const capText = `${def.name} ${def.domain} ${def.synonyms.join(' ')}`.toLowerCase();
    if (def.synonyms.some((s) => normQuery.includes(s)) || capText.includes(normQuery)) {
      capabilities.push({
        type: 'capability',
        matchTier: 'direct',
        id: def.canonicalId,
        title: def.name,
        subtitle: `Capability Slot · Domain: ${def.domain}`,
        description: `Canonical capability pattern for ${def.domain} orchestration.`,
        domain: def.domain,
        relevanceScore: 0.9,
        item: def,
      });
    }
  }

  // 4. Search Domains
  const domains: BrainSearchResult[] = [];
  const knownDomains: Domain[] = ['SEO', 'Development', 'Design', 'Marketing', 'Copywriting', 'DevOps', 'AI & Prompting', 'Productivity'];
  knownDomains.forEach((d) => {
    if (d.toLowerCase().includes(normQuery) || normQuery.includes(d.toLowerCase())) {
      const count = tools.filter((t) => t.domain === d).length;
      domains.push({
        type: 'domain',
        matchTier: 'direct',
        id: `domain-${d}`,
        title: `${d} Domain`,
        subtitle: `Domain Knowledge Area · ${count} Indexed Resources`,
        description: `Explore all ${count} tools, skills, and notes categorized under ${d}.`,
        domain: d,
        relevanceScore: 0.95,
        item: { name: d, count },
      });
    }
  });

  const totalResults = boundedResources.length + boundedSkills.length + notes.length + capabilities.length + domains.length;

  return {
    totalResults,
    preferSkills,
    resources: boundedResources,
    skills: boundedSkills,
    notes,
    capabilities,
    domains,
    directMatches,
    relatedMatches,
    contextualMatches,
  };
}
