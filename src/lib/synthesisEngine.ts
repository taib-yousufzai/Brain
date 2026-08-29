import { Tool, CustomNote, SynthesisResult, SynthesisSection } from '@/types';
import { classifyQueryIntent } from './queryIntent';
import { searchToolsWithRelevanceGate, enrichToolCapabilities, evaluateCandidateForQuery } from './semanticCapabilityEngine';
import { generateGodStack } from './godStackEngine';
import { detectOverlapClusters } from './capabilityGraph';
import { extractResourceCapabilities } from './capabilityModel';

export function synthesizeQuery(
  query: string,
  tools: Tool[],
  notes: CustomNote[]
): SynthesisResult {
  const intent = classifyQueryIntent(query);
  const enrichedTools = tools.map(enrichToolCapabilities);

  // 1. STACK RECOMMENDATION GOAL REQUEST (e.g. "Build me an SEO stack", "I'm starting an SEO project")
  if (intent.intentType === 'goal_request') {
    const godStack = generateGodStack(query, enrichedTools);

    const sections: SynthesisSection[] = [
      {
        title: 'Source Facts: Selected Champion Resources [CONFIDENCE: HIGH]',
        items: godStack.slots.length > 0
          ? godStack.slots.map(s => `[${s.subCapability}] Champion: ${s.tool.title} (${s.tool.rating}/10) - ${s.tool.description}`)
          : ['No matching champions found for this goal stack.'],
        category: 'source_fact',
      },
      {
        title: 'AI Inferences: Selection Rationale & Redundancy Exclusions [CONFIDENCE: HIGH]',
        items: [
          ...godStack.slots.map(s => `Selected '${s.tool.title}': ${s.reasoning}`),
          ...godStack.nonRecommendations.map(nr => `Excluded '${nr.tool.title}': ${nr.reason}`),
        ],
        category: 'ai_inference',
      },
      {
        title: 'Uncertainties & Knowledge Gaps [CONFIDENCE: MEDIUM]',
        items: godStack.knowledgeGaps.length > 0
          ? godStack.knowledgeGaps.map(g => `Missing Gap: The current brain does not contain a sufficiently strong resource for '${g}'.`)
          : ['All required capability slots for this stack are covered.'],
        category: 'uncertainty',
      },
    ];

    return {
      query,
      topic: `Optimized Stack for ${intent.topicKeyword}`,
      summary: `Built minimal high-quality stack (${godStack.resourcesSelected} selected champions, ${godStack.redundancyFiltered} redundant tools excluded).`,
      sections,
      relevantTools: godStack.slots.map(s => s.tool),
      relevantNotes: [],
      knowledgeGaps: godStack.knowledgeGaps.map(g => ({ capability: g, status: 'missing', notes: 'No strong resource in brain' })),
    };
  }

  // 2. REDUNDANCY / DUPLICATE QUERY
  if (intent.intentType === 'redundancy_query') {
    const clusters = detectOverlapClusters(enrichedTools);
    const topClusters = clusters.slice(0, 5);

    const sections: SynthesisSection[] = [
      {
        title: 'Source Facts: Preserved Overlapping Clusters [CONFIDENCE: HIGH]',
        items: topClusters.map(
          (c) =>
            `Capability '${c.capabilityName}': ${c.allMembers.length} tools stored (${c.allMembers.map((m) => m.title).join(', ')})`
        ),
        category: 'source_fact',
      },
      {
        title: 'AI Inferences: Champion Selection vs Exclusions [CONFIDENCE: HIGH]',
        items: topClusters.map(
          (c) =>
            `Champion for ${c.capabilityName}: '${c.bestOverall.title}' (${c.bestOverall.rating}/10). ${
              c.notRecommended.length > 0
                ? `Redundant tools excluded: ${c.notRecommended.map(nr => nr.tool.title).join(', ')}.`
                : 'All alternatives serve specialized edge cases.'
            }`
        ),
        category: 'ai_inference',
      },
      {
        title: 'Uncertainties [CONFIDENCE: LOW]',
        items: [
          'Ratings are derived from vault evaluations. Benchmark against your active project dependencies before removing stored items.',
        ],
        category: 'uncertainty',
      },
    ];

    return {
      query,
      topic: 'Redundant Resources & Overlaps',
      summary: `Found ${clusters.length} capability overlap cluster(s) with redundant tools identified.`,
      sections,
      relevantTools: topClusters.flatMap(c => c.allMembers),
      relevantNotes: [],
      knowledgeGaps: [],
    };
  }

  // 3. UNEXPLORED SAVED TOOLS QUERY
  if (intent.intentType === 'unexplored_query') {
    const unexplored = enrichedTools
      .filter(t => t.rating >= 9.0 && (!t.notes || t.notes.length < 30 || t.notes.includes('God-Stack Champion')))
      .slice(0, 6);

    const sections: SynthesisSection[] = [
      {
        title: 'Source Facts: High-Rating Stored Resources [CONFIDENCE: HIGH]',
        items: unexplored.map(t => `${t.title} [${t.domain}] - Rating ${t.rating}/10: ${t.description}`),
        category: 'source_fact',
      },
      {
        title: 'AI Inferences: Unexplored Gems Rationale [CONFIDENCE: MEDIUM]',
        items: unexplored.map(t => `'${t.title}' has a high rating (${t.rating}/10) and capabilities (${(t.capabilities || []).slice(0, 3).join(', ')}), but lacks usage notes.`),
        category: 'ai_inference',
      },
      {
        title: 'Uncertainties [CONFIDENCE: LOW]',
        items: ['Evaluated based on note length in local vault storage.'],
        category: 'uncertainty',
      },
    ];

    return {
      query,
      topic: 'Unexplored Saved Resources',
      summary: `Identified ${unexplored.length} high-potential resources in your brain with minimal usage notes.`,
      sections,
      relevantTools: unexplored,
      relevantNotes: [],
      knowledgeGaps: [],
    };
  }

  // 4. INFORMATIONAL QUERY (Requirement #1 & #12: "What do I have for SEO?", "What tools do I have for browser automation?")
  // Hard Relevance Gate filtering
  const validEvaluations = searchToolsWithRelevanceGate(intent.topicKeyword, enrichedTools, 0.65, 0.60);
  const strongResources = validEvaluations.map(ev => ev.tool);

  // Group strong resources by matched canonical capabilities
  const capabilityGroupedMap = new Map<string, Tool[]>();
  validEvaluations.forEach(ev => {
    const capName = ev.matchedCapabilities[0] || ev.tool.subCapability || ev.tool.domain;
    if (!capabilityGroupedMap.has(capName)) {
      capabilityGroupedMap.set(capName, []);
    }
    capabilityGroupedMap.get(capName)!.push(ev.tool);
  });

  const strongResourceItems: string[] = [];
  capabilityGroupedMap.forEach((toolsInCap, capName) => {
    strongResourceItems.push(`[Capability: ${capName}]`);
    toolsInCap.forEach(t => {
      const evs = extractResourceCapabilities(t);
      const evQuote = evs[0]?.evidence[0] ? ` (Evidence: ${evs[0].evidence[0]})` : '';
      strongResourceItems.push(`  • ${t.title} (${t.rating}/10) - ${t.description}${evQuote}`);
    });
  });

  const sections: SynthesisSection[] = [];

  if (validEvaluations.length > 0) {
    sections.push({
      title: `Source Facts: Strong Resources for '${intent.topicKeyword}' [CONFIDENCE: HIGH]`,
      items: strongResourceItems,
      category: 'source_fact',
    });

    sections.push({
      title: `AI Inferences: Capability Breakdown & Champion Selection [CONFIDENCE: HIGH]`,
      items: Array.from(capabilityGroupedMap.entries()).map(([cap, toolList]) => {
        const champion = toolList.sort((a, b) => b.rating - a.rating)[0];
        return `Primary Champion for ${cap}: '${champion.title}' (${champion.rating}/10). ${toolList.length > 1 ? `${toolList.length - 1} alternative(s) stored.` : 'No competing alternatives.'}`;
      }),
      category: 'ai_inference',
    });
  } else {
    // Abstention response (Requirement #4 & #15)
    sections.push({
      title: `Source Facts: Inventory Results [CONFIDENCE: HIGH]`,
      items: [`The current brain does not contain a sufficiently strong resource for '${intent.topicKeyword}'.`],
      category: 'source_fact',
    });

    sections.push({
      title: `AI Inferences: Abstention Rationale [CONFIDENCE: HIGH]`,
      items: [`Evaluated dataset with hard relevance gate (relevance threshold: >= 0.65). Unrelated high-rating tools were rejected to prevent false positive recommendations.`],
      category: 'ai_inference',
    });
  }

  sections.push({
    title: `Uncertainties & Knowledge Gaps [CONFIDENCE: MEDIUM]`,
    items: [
      validEvaluations.length === 0
        ? `Knowledge Gap: No verified resource for '${intent.topicKeyword}' is stored in your brain vault.`
        : `Verified capability evidence grounded in tool titles and descriptions.`,
    ],
    category: 'uncertainty',
  });

  return {
    query,
    topic: `Resource Inventory for ${intent.topicKeyword}`,
    summary: validEvaluations.length > 0
      ? `Found ${validEvaluations.length} strong, evidence-verified resource(s) for '${intent.topicKeyword}'.`
      : `No verified resource found for '${intent.topicKeyword}' in your brain.`,
    sections,
    relevantTools: strongResources,
    relevantNotes: [],
    knowledgeGaps: validEvaluations.length === 0
      ? [{ capability: intent.topicKeyword, status: 'missing', notes: 'No verified resource in brain' }]
      : [],
  };
}
