import { Tool, OverlapCluster, CapabilityRelation, Domain } from '@/types';

/**
 * Detects overlapping capability clusters across the tool dataset.
 * Groups tools by subCapability or domain keyword to evaluate competition,
 * selecting the best overall, alternatives, specialized use-cases, and non-recommended tools.
 */
export function detectOverlapClusters(tools: Tool[]): OverlapCluster[] {
  const clusterMap = new Map<string, Tool[]>();

  // Group tools by shared capabilities array
  for (const tool of tools) {
    const caps = tool.capabilities && tool.capabilities.length > 0
      ? tool.capabilities
      : [tool.subCapability || tool.domain];

    for (const cap of caps) {
      if (!cap || cap.trim().length < 3) continue;
      const normalizedKey = cap.toLowerCase().trim();
      if (!clusterMap.has(normalizedKey)) {
        clusterMap.set(normalizedKey, []);
      }
      const list = clusterMap.get(normalizedKey)!;
      if (!list.some(t => t.id === tool.id)) {
        list.push(tool);
      }
    }
  }

  const clusters: OverlapCluster[] = [];
  let clusterIdCounter = 1;

  clusterMap.forEach((toolsInCluster, capNameKey) => {
    // Only form clusters if there are 2 or more tools competing for the exact capability
    if (toolsInCluster.length < 2) return;

    // Filter out ultra-generic terms
    if (['development', 'design', 'seo', 'marketing', 'ai-inbox', 'brain-vault', 'tool'].includes(capNameKey)) {
      return;
    }

    // Sort by rating descending
    const sorted = [...toolsInCluster].sort((a, b) => b.rating - a.rating);
    const bestOverall = sorted[0];
    const remaining = sorted.slice(1);

    const alternatives: Tool[] = [];
    const specialized: { tool: Tool; useCase: string }[] = [];
    const notRecommended: { tool: Tool; reason: string }[] = [];

    remaining.forEach((tool) => {
      // If rating difference is small, mark as alternative or specialized
      if (bestOverall.rating - tool.rating <= 0.5) {
        if (tool.isOpenSource && !bestOverall.isOpenSource) {
          specialized.push({
            tool,
            useCase: 'Best open-source self-hosted alternative',
          });
        } else if (tool.hasApi && !bestOverall.hasApi) {
          specialized.push({
            tool,
            useCase: 'Best for headless API automation',
          });
        } else {
          alternatives.push(tool);
        }
      } else {
        notRecommended.push({
          tool,
          reason: `Both cover '${capNameKey}'. Outperformed by champion '${bestOverall.title}' (${bestOverall.rating}/10 vs ${tool.rating}/10). Adding '${tool.title}' creates unnecessary redundancy.`,
        });
      }
    });

    const displayTitle = capNameKey.charAt(0).toUpperCase() + capNameKey.slice(1);

    clusters.push({
      id: `cluster-${clusterIdCounter++}`,
      capabilityName: displayTitle,
      domain: bestOverall.domain,
      bestOverall,
      alternatives,
      specialized,
      notRecommended,
      allMembers: toolsInCluster,
    });
  });

  // Sort clusters by size (most overlapping first)
  return clusters.sort((a, b) => b.allMembers.length - a.allMembers.length);
}

/**
 * Computes implicit graph relations between a target tool and the rest of the dataset.
 */
export function buildToolRelations(target: Tool, allTools: Tool[]): CapabilityRelation[] {
  const relations: CapabilityRelation[] = [];

  for (const tool of allTools) {
    if (tool.id === target.id) continue;

    // Overlaps: same capability
    if (
      target.subCapability.toLowerCase().trim() === tool.subCapability.toLowerCase().trim() &&
      target.subCapability.length > 2
    ) {
      relations.push({
        targetToolId: tool.id,
        targetTitle: tool.title,
        relationType: 'overlaps',
        description: `Directly competes with '${tool.title}' for ${target.subCapability}.`,
      });
    }

    // Complements: same domain, different capability
    else if (target.domain === tool.domain) {
      relations.push({
        targetToolId: tool.id,
        targetTitle: tool.title,
        relationType: 'complements',
        description: `Complements '${tool.title}' within the ${target.domain} domain stack.`,
      });
    }

    // Enables / DependsOn: web crawling -> content extraction / SEO
    else if (
      target.subCapability.toLowerCase().includes('crawl') &&
      tool.subCapability.toLowerCase().includes('seo')
    ) {
      relations.push({
        targetToolId: tool.id,
        targetTitle: tool.title,
        relationType: 'enables',
        description: `Enables automated data feeding into ${tool.title}.`,
      });
    }
  }

  // Limit to top 5 relevant relations to keep UI readable
  return relations.slice(0, 5);
}

/**
 * Returns capability coverage breakdown for a given domain
 */
export function getDomainCapabilityMatrix(
  domain: Domain,
  tools: Tool[]
): { capability: string; count: number; bestTool: Tool; status: 'covered' | 'weak' | 'missing' }[] {
  const domainTools = tools.filter((t) => t.domain.toLowerCase() === domain.toLowerCase());
  const capGroup = new Map<string, Tool[]>();

  for (const t of domainTools) {
    const cap = t.subCapability.trim() || 'General';
    if (!capGroup.has(cap)) capGroup.set(cap, []);
    capGroup.get(cap)!.push(t);
  }

  const result: {
    capability: string;
    count: number;
    bestTool: Tool;
    status: 'covered' | 'weak' | 'missing';
  }[] = [];

  capGroup.forEach((toolsInCap, capName) => {
    const sorted = [...toolsInCap].sort((a, b) => b.rating - a.rating);
    const count = sorted.length;
    const status = count >= 2 ? 'covered' : count === 1 ? 'weak' : 'missing';

    result.push({
      capability: capName,
      count,
      bestTool: sorted[0],
      status,
    });
  });

  return result.sort((a, b) => b.count - a.count);
}
