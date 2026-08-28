import { Tool, GodStack, GodStackSlot, Domain } from '@/types';

// Pre-defined workflow mappings for common user goals
const DOMAIN_WORKFLOW_MAP: Record<string, { domain: Domain; capabilities: string[] }> = {
  seo: {
    domain: 'SEO',
    capabilities: [
      'Keyword Research',
      'Backlink Analysis',
      'Technical Audit',
      'Content Optimization',
      'Rank & Index Tracking',
    ],
  },
  development: {
    domain: 'Development',
    capabilities: ['Fullstack Framework', 'Backend Database', 'Minimal Viable Diff & YAGNI Architecture', 'Root-Cause Auditing'],
  },
  web: {
    domain: 'Development',
    capabilities: ['Fullstack Framework', 'Backend Database', 'Minimal Viable Diff & YAGNI Architecture'],
  },
  design: {
    domain: 'Design',
    capabilities: ['UI/UX Design', 'Micro-Animations & Micro-Interactions', 'Color Palette Selection', 'Zero-Flaw Pixel Polish'],
  },
  marketing: {
    domain: 'Marketing',
    capabilities: ['High-Converting Positioning & Copy', 'Content Optimization'],
  },
  copywriting: {
    domain: 'Copywriting',
    capabilities: ['AI Slop Deletion & Natural Voice', 'High-Converting Positioning & Copy', 'Content Optimization'],
  },
};

export function generateGodStack(goalPrompt: string, allTools: Tool[]): GodStack {
  const normalizedGoal = goalPrompt.toLowerCase().trim();

  // Find matching domain workflow or infer from query keywords
  let matchedDomainKey = Object.keys(DOMAIN_WORKFLOW_MAP).find((key) =>
    normalizedGoal.includes(key)
  );

  let targetDomain: Domain | null = matchedDomainKey
    ? DOMAIN_WORKFLOW_MAP[matchedDomainKey].domain
    : null;

  // Filter tools by target domain if detected, or evaluate all tools
  let candidatePool = targetDomain
    ? allTools.filter((t) => t.domain.toLowerCase() === targetDomain?.toLowerCase())
    : allTools;

  // If pool is small or query is specific (e.g., "slop", "copywriter", "bento", "canvas")
  if (candidatePool.length === 0 || normalizedGoal.length > 2) {
    const searchMatches = allTools.filter(
      (t) =>
        t.title.toLowerCase().includes(normalizedGoal) ||
        t.description.toLowerCase().includes(normalizedGoal) ||
        t.subCapability.toLowerCase().includes(normalizedGoal) ||
        t.tags.some((tag) => tag.toLowerCase().includes(normalizedGoal))
    );

    if (searchMatches.length > 0) {
      candidatePool = searchMatches;
    }
  }

  // Fallback to entire library if candidate pool empty
  if (candidatePool.length === 0) {
    candidatePool = allTools;
  }

  // Group candidate tools by sub-capability slot
  const capabilityMap = new Map<string, Tool[]>();
  for (const tool of candidatePool) {
    const cap = tool.subCapability.trim();
    if (!capabilityMap.has(cap)) {
      capabilityMap.set(cap, []);
    }
    capabilityMap.get(cap)!.push(tool);
  }

  const slots: GodStackSlot[] = [];
  let totalCandidatesEvaluated = 0;

  // For EACH distinct sub-capability, select EXACTLY 1 winner (the highest rated tool)
  capabilityMap.forEach((toolsInSlot, capName) => {
    totalCandidatesEvaluated += toolsInSlot.length;

    // Rank tools in this slot by rating (descending)
    const sortedTools = [...toolsInSlot].sort((a, b) => b.rating - a.rating);
    const winnerTool = sortedTools[0];

    const countInSlot = sortedTools.length;
    const reasoning =
      countInSlot > 1
        ? `Outperformed ${countInSlot - 1} competing tool(s) in '${capName}' with a top rating of ${winnerTool.rating}/10.`
        : `Selected as the primary winner for '${capName}'.`;

    slots.push({
      subCapability: capName,
      tool: winnerTool,
      reasoning,
    });
  });

  // Calculate redundant tools excluded
  const redundancyFiltered = Math.max(0, totalCandidatesEvaluated - slots.length);

  return {
    goal: goalPrompt,
    slots,
    redundancyFiltered,
  };
}
