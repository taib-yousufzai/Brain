import { PARSED_PUBLIC_TOOLS } from './fileParser';
import { INITIAL_SEED_TOOLS } from './storage';
import { evaluateCandidateForQuery } from './semanticCapabilityEngine';
import { Tool } from '@/types';

const allTools: Tool[] = [...INITIAL_SEED_TOOLS, ...PARSED_PUBLIC_TOOLS];

const targetTitles = [
  'agent-browser',
  'ultimate-seo-geo',
  'claude-seo',
  'cutons 404 pages',
  'case study section',
  'response time promise',
  'meta descriptions',
];

const query = 'What do I have on SEO?';

console.log('====================================================');
console.log(`QUERY: "${query}"`);
console.log('====================================================\n');

targetTitles.forEach((target) => {
  const found = allTools.find(
    (t) => t.title.toLowerCase().includes(target) || (t.url && t.url.toLowerCase().includes(target))
  );

  if (!found) {
    console.log(`RESOURCE: ${target} [NOT FOUND IN DATASET]`);
    return;
  }

  const ev = evaluateCandidateForQuery(query, found);
  const normQuery = query.toLowerCase();
  const text = `${found.title} ${found.description} ${found.subCapability} ${found.domain} ${found.tags?.join(' ') || ''}`.toLowerCase();

  // Calculate sub-scores as computed by the current logic
  const isSeoQuery = /\bseo\b/i.test(normQuery);
  const domainScore = isSeoQuery && found.domain === 'SEO' ? 0.92 : 0.0;
  const keywordScore = text.includes('seo') ? 0.85 : 0.0;
  const capabilityScore = ev.capabilityRelevance;
  const semanticScore = ev.capabilityConfidence;
  const searchScore = ev.capabilityRelevance;
  const finalScore = ev.goalFit;

  console.log(`RESOURCE: ${found.title}`);
  console.log(`RAW INPUT: ${found.rawInput || `${found.title} - ${found.description} (${found.url || ''})`}`);
  console.log(`PARSED DESCRIPTION: ${found.description}`);
  console.log(`CAPABILITIES: ${found.capabilities?.join(', ') || 'None'}`);
  console.log(`DOMAINS: ${found.domain}`);
  console.log(`SEARCH SCORE: ${searchScore.toFixed(2)}`);
  console.log(`KEYWORD SCORE: ${keywordScore.toFixed(2)}`);
  console.log(`SEMANTIC SCORE: ${semanticScore.toFixed(2)}`);
  console.log(`CAPABILITY SCORE: ${capabilityScore.toFixed(2)}`);
  console.log(`DOMAIN SCORE: ${domainScore.toFixed(2)}`);
  console.log(`FINAL SCORE: ${finalScore.toFixed(2)}`);
  console.log(`MATCH REASON: ${ev.rejectionReason || (ev.matchedCapabilities.length > 0 ? `Matched: ${ev.matchedCapabilities.join(', ')}` : 'Domain/keyword match')}`);
  console.log('--------------------------------------------------\n');
});
