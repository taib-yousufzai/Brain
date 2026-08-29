import { Tool, GodStack, GodStackSlot, NonRecommendationRationale, UserPreferences } from '@/types';
import { decomposeGoal } from './goalDecomposition';
import { searchToolsWithRelevanceGate, CandidateEvaluation } from './semanticCapabilityEngine';

export function generateGodStack(
  goalPrompt: string,
  allTools: Tool[],
  preferences?: UserPreferences
): GodStack {
  // 1. Goal Decomposition into Required Capability Slots
  const decomposition = decomposeGoal(goalPrompt);
  const { requiredSlots } = decomposition;

  // Apply User Preferences
  let filteredTools = [...allTools];
  if (preferences) {
    if (preferences.openSourceOnly) filteredTools = filteredTools.filter(t => t.isOpenSource);
    if (preferences.selfHostedOnly) filteredTools = filteredTools.filter(t => t.isSelfHosted);
    if (preferences.apiRequired) filteredTools = filteredTools.filter(t => t.hasApi);
  }
  if (filteredTools.length === 0) filteredTools = [...allTools];

  const selectedSlots: GodStackSlot[] = [];
  const selectedTools = new Set<string>();
  const nonRecommendations: NonRecommendationRationale[] = [];
  const missingGaps: string[] = [];
  const candidatesConsidered = new Set<string>();

  // 2. Iterate through required capability slots
  for (const slot of requiredSlots) {
    // Candidate retrieval + Hard Relevance Gate (relevance >= 0.65, confidence >= 0.60, negativeEvidence = false)
    const validCandidates: CandidateEvaluation[] = searchToolsWithRelevanceGate(
      slot.capabilityName,
      filteredTools,
      0.65,
      0.60
    );

    validCandidates.forEach(c => candidatesConsidered.add(c.tool.id));

    // 3. Abstention Check: If no candidate passes hard relevance gate, mark missing gap
    if (validCandidates.length === 0) {
      missingGaps.push(`${slot.capabilityName} (${slot.whyRequired})`);
      continue;
    }

    // Top valid candidate champion
    const topCandidate = validCandidates[0];
    const topTool = topCandidate.tool;

    // 4. Multi-Capability Packing Check: Avoid adding duplicate tools if already selected in stack
    if (selectedTools.has(topTool.id)) {
      continue;
    }

    selectedTools.add(topTool.id);

    const providedCaps = topCandidate.matchedCapabilities.join(', ') || topTool.subCapability;

    selectedSlots.push({
      subCapability: slot.capabilityName,
      tool: topTool,
      reasoning: `Selected as primary champion for '${slot.capabilityName}' (${slot.whyRequired}). Capability Relevance: ${Math.round(topCandidate.capabilityRelevance * 100)}%, Quality Rating: ${topTool.rating}/10.`,
      alternatives: validCandidates.slice(1, 3).map(c => c.tool),
    });

    // 5. Excluded Redundant Tools Rationale
    validCandidates.slice(1, 3).forEach(comp => {
      const altTool = comp.tool;
      if (!selectedTools.has(altTool.id)) {
        nonRecommendations.push({
          tool: altTool,
          reason: `Both '${topTool.title}' and '${altTool.title}' provide valid coverage for '${slot.capabilityName}'. '${topTool.title}' provides stronger fit/rating (${topTool.rating}/10 vs ${altTool.rating}/10). Adding '${altTool.title}' creates unnecessary redundancy.`,
          replacedBy: topTool.title,
        });
      }
    });
  }

  // Deduplicate non-recommendations
  const uniqueNonRecs: NonRecommendationRationale[] = [];
  const seenNonRecIds = new Set<string>();
  nonRecommendations.forEach(nr => {
    if (!seenNonRecIds.has(nr.tool.id)) {
      seenNonRecIds.add(nr.tool.id);
      uniqueNonRecs.push(nr);
    }
  });

  const totalRequired = requiredSlots.length;
  const fulfilledCount = totalRequired - missingGaps.length;
  const coveragePercentage = totalRequired > 0
    ? Math.round((fulfilledCount / Math.max(1, totalRequired)) * 100)
    : 100;

  return {
    goal: goalPrompt,
    slots: selectedSlots,
    redundancyFiltered: Math.max(0, candidatesConsidered.size - selectedSlots.length),
    coveragePercentage,
    candidatesConsidered: candidatesConsidered.size,
    resourcesSelected: selectedSlots.length,
    nonRecommendations: uniqueNonRecs,
    knowledgeGaps: missingGaps,
  };
}
