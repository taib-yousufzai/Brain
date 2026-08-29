import { Tool, CustomNote } from '@/types';
import { classifyQueryIntent } from './queryIntent';
import { evaluateCandidateForQuery, searchBrainKnowledge } from './semanticCapabilityEngine';
import { generateGodStack } from './godStackEngine';
import { synthesizeQuery } from './synthesisEngine';

export interface TestCaseResult {
  id: number;
  description: string;
  passed: boolean;
  actual: string;
  expected: string;
}

export function runAdversarialTestSuite(tools: Tool[], notes: CustomNote[] = []): TestCaseResult[] {
  const results: TestCaseResult[] = [];

  const vphoneTool = tools.find((t) => t.title.toLowerCase().includes('vphone'));
  const agentBrowserTool = tools.find((t) => t.title.toLowerCase().includes('agent-browser'));

  // Test 1: Query Intent Classification - Informational SEO Query
  const intent1 = classifyQueryIntent('What do I have for SEO?');
  results.push({
    id: 1,
    description: "Intent Classification: 'What do I have for SEO?' -> Informational",
    passed: intent1.intentType === 'informational' && !intent1.requiresStackOptimization,
    actual: `Intent: ${intent1.intentType}, RequiresOptimization: ${intent1.requiresStackOptimization}`,
    expected: 'Intent: informational, RequiresOptimization: false',
  });

  // Test 2: Query Intent Classification - Goal Request SEO Stack
  const intent2 = classifyQueryIntent('Build me an SEO stack.');
  results.push({
    id: 2,
    description: "Intent Classification: 'Build me an SEO stack.' -> Goal Request",
    passed: intent2.intentType === 'goal_request' && intent2.requiresStackOptimization,
    actual: `Intent: ${intent2.intentType}, RequiresOptimization: ${intent2.requiresStackOptimization}`,
    expected: 'Intent: goal_request, RequiresOptimization: true',
  });

  // Test 3: Adversarial vphone-cli & agent-browser Negative Evidence Test for SEO
  if (vphoneTool) {
    const evalVphoneForSEO = evaluateCandidateForQuery('What do I have for SEO?', vphoneTool);
    const evalAgentBrowserForSEO = agentBrowserTool ? evaluateCandidateForQuery('What do I have for SEO?', agentBrowserTool) : null;
    const isVphoneRejected = evalVphoneForSEO.negativeEvidence && evalVphoneForSEO.capabilityRelevance === 0;
    const isAgentBrowserRejected = evalAgentBrowserForSEO ? evalAgentBrowserForSEO.negativeEvidence || evalAgentBrowserForSEO.capabilityRelevance === 0 : true;

    results.push({
      id: 3,
      description: "Adversarial: vphone-cli & agent-browser must have negative evidence for SEO query",
      passed: isVphoneRejected && isAgentBrowserRejected,
      actual: `vphoneRejected: ${isVphoneRejected}, agentBrowserRejected: ${isAgentBrowserRejected}`,
      expected: 'vphoneRejected: true, agentBrowserRejected: true',
    });
  }

  // Test 4: Informational Search 'What do I have on SEO?' MUST NOT return vphone-cli or agent-browser
  const searchSEO = searchBrainKnowledge('What do I have on SEO?', tools, notes);
  const vphoneInSEO = searchSEO.resources.some((r) => r.title.toLowerCase().includes('vphone'));
  const agentBrowserInSEO = searchSEO.resources.some((r) => r.title.toLowerCase().includes('agent-browser'));
  const boundedCount = searchSEO.resources.length <= 30;

  results.push({
    id: 4,
    description: "Adversarial: 'What do I have on SEO?' MUST NOT return vphone-cli/agent-browser & bounded <= 30",
    passed: !vphoneInSEO && !agentBrowserInSEO && boundedCount,
    actual: `vphoneInSEO: ${vphoneInSEO}, agentBrowserInSEO: ${agentBrowserInSEO}, resourceCount: ${searchSEO.resources.length}`,
    expected: 'vphoneInSEO: false, agentBrowserInSEO: false, resourceCount <= 30',
  });

  // Test 5: Informational Query 'What do I have for SEO?' MUST contain Claude blog / SEO tools
  const synthSEO = synthesizeQuery('What do I have for SEO?', tools, notes);
  const ahrefsInSEO = synthSEO.relevantTools.some((t) => /blog|seo|ahrefs|dataforseo|ultimate-seo-geo|claude-seo/i.test(t.title) || /rankings|seo/i.test(t.description));
  results.push({
    id: 5,
    description: "Informational: 'What do I have for SEO?' MUST return Claude blog / SEO tools",
    passed: ahrefsInSEO,
    actual: `Returned tools: ${synthSEO.relevantTools.map((t) => t.title).join(', ')}`,
    expected: 'SEO/blog resources present in results',
  });

  // Test 6: Query 'What tools do I have for browser automation?' MUST return Puppeteer/Playwright
  const synthBrowser = synthesizeQuery('What tools do I have for browser automation?', tools, notes);
  const puppeteerInBrowser = synthBrowser.relevantTools.some((t) => /puppeteer|playwright|selenium|browser-use|agent-browser/i.test(t.title));
  results.push({
    id: 6,
    description: "Informational: 'What tools do I have for browser automation?' MUST return Puppeteer/Playwright",
    passed: puppeteerInBrowser,
    actual: `Returned tools: ${synthBrowser.relevantTools.map((t) => t.title).join(', ')}`,
    expected: 'Puppeteer or Playwright present',
  });

  // Test 7: Query 'What tools do I have for browser automation?' MUST NOT return vphone-cli
  const vphoneInBrowser = synthBrowser.relevantTools.some((t) => t.title.toLowerCase().includes('vphone'));
  results.push({
    id: 7,
    description: "Adversarial: 'What tools do I have for browser automation?' MUST NOT return vphone-cli",
    passed: !vphoneInBrowser,
    actual: vphoneInBrowser ? 'vphone-cli FOUND (FAIL)' : 'vphone-cli REJECTED',
    expected: 'vphone-cli REJECTED',
  });

  // Test 8: Query for Apple Virtualization MUST return vphone-cli
  const synthVirtual = synthesizeQuery('What do I have for virtual iPhone or Apple virtualization?', tools, notes);
  const vphoneInVirtual = synthVirtual.relevantTools.some((t) => t.title.toLowerCase().includes('vphone'));
  results.push({
    id: 8,
    description: "Informational: 'What do I have for Apple virtualization?' MUST return vphone-cli",
    passed: vphoneInVirtual,
    actual: `Returned tools: ${synthVirtual.relevantTools.map((t) => t.title).join(', ')}`,
    expected: 'vphone-cli present',
  });

  // Test 9: Query for Web Crawling MUST return Crawl4AI / Firecrawl
  const synthCrawl = synthesizeQuery('What do I have for web crawling?', tools, notes);
  const crawlToolsFound = synthCrawl.relevantTools.some((t) => /crawl4ai|firecrawl|scraper|crawly/i.test(t.title));
  results.push({
    id: 9,
    description: "Informational: 'What do I have for web crawling?' MUST return Crawl4AI/Firecrawl",
    passed: crawlToolsFound,
    actual: `Returned tools: ${synthCrawl.relevantTools.map((t) => t.title).join(', ')}`,
    expected: 'Crawl4AI or Firecrawl present',
  });

  // Test 10: Strict Abstention on Unstocked Niche Query (Quantum Computing OS)
  const synthQuantum = synthesizeQuery('What do I have for quantum computing operating systems?', tools, notes);
  results.push({
    id: 10,
    description: "Abstention: 'Quantum computing OS' MUST return 0 tools and state knowledge gap",
    passed: synthQuantum.relevantTools.length === 0 && synthQuantum.knowledgeGaps.length > 0,
    actual: `Relevant Tools: ${synthQuantum.relevantTools.length}, Knowledge Gaps: ${synthQuantum.knowledgeGaps.length}`,
    expected: 'Relevant Tools: 0, Knowledge Gaps: > 0',
  });

  // Test 11: OCR Query MUST return olmOCR
  const synthOCR = synthesizeQuery('What do I have for OCR?', tools, notes);
  const ocrFound = synthOCR.relevantTools.some((t) => t.title.toLowerCase().includes('olmocr') || t.title.toLowerCase().includes('ocr'));
  results.push({
    id: 11,
    description: "Informational: 'What do I have for OCR?' MUST return olmOCR",
    passed: ocrFound,
    actual: `Returned tools: ${synthOCR.relevantTools.map((t) => t.title).join(', ')}`,
    expected: 'olmOCR present',
  });

  // Test 12: Goal Stack Optimization 'Build me an SEO stack' MUST NOT contain vphone-cli
  const stackSEO = generateGodStack('Build me an SEO stack', tools);
  const vphoneInStack = stackSEO.slots.some((s) => s.tool.title.toLowerCase().includes('vphone'));
  results.push({
    id: 12,
    description: "Adversarial Stack: God Stack for 'Build me an SEO stack' MUST NOT contain vphone-cli",
    passed: !vphoneInStack,
    actual: vphoneInStack ? 'vphone-cli selected in stack (FAIL)' : 'vphone-cli REJECTED',
    expected: 'vphone-cli REJECTED',
  });

  // Test 13: Goal Stack Optimization 'Build me an SEO stack' MUST select SEO champions
  const ahrefsInStack = stackSEO.slots.some((s) => /blog|seo|ahrefs|dataforseo|ultimate-seo-geo|claude-seo/i.test(s.tool.title) || /rankings|seo/i.test(s.tool.description));
  results.push({
    id: 13,
    description: "Goal Stack: 'Build me an SEO stack' MUST select SEO champions",
    passed: ahrefsInStack,
    actual: `Selected champions: ${stackSEO.slots.map((s) => s.tool.title).join(', ')}`,
    expected: 'SEO champions present',
  });

  // Test 14: Intent Classification - 'What tools overlap in my brain?' -> Redundancy
  const intentRedun = classifyQueryIntent('What tools overlap in my brain?');
  results.push({
    id: 14,
    description: "Intent Classification: 'What tools overlap in my brain?' -> Redundancy",
    passed: intentRedun.intentType === 'redundancy_query',
    actual: `Intent: ${intentRedun.intentType}`,
    expected: 'Intent: redundancy_query',
  });

  // Test 15: Intent Classification - 'Show me my unexplored tools' -> Unexplored
  const intentUnexpl = classifyQueryIntent('Show me my unexplored tools');
  results.push({
    id: 15,
    description: "Intent Classification: 'Show me my unexplored tools' -> Unexplored",
    passed: intentUnexpl.intentType === 'unexplored_query',
    actual: `Intent: ${intentUnexpl.intentType}`,
    expected: 'Intent: unexplored_query',
  });

  // Test 16: AI Slop Elimination Query MUST return Slop Killer / Blader Humanizer
  const synthSlop = synthesizeQuery('What do I have for copywriting slop removal?', tools, notes);
  const slopFound = synthSlop.relevantTools.some((t) => /slop|humanizer|blader/i.test(t.title) || /humanizer|slop/i.test(t.description));
  results.push({
    id: 16,
    description: "Informational: 'Copywriting slop removal' MUST return Slop Killer/Humanizer",
    passed: slopFound,
    actual: `Returned tools: ${synthSlop.relevantTools.map((t) => t.title).join(', ')}`,
    expected: 'Slop Killer or Humanizer present',
  });

  // Test 17: UI Design Micro-interactions Query MUST return UI resources
  const synthUI = synthesizeQuery('What do I have for UI design micro-interactions?', tools, notes);
  const uiFound = synthUI.relevantTools.some((t) => /kowalski|design|animation|framer|rive/i.test(t.title) || /design/i.test(t.domain));
  results.push({
    id: 17,
    description: "Informational: 'UI design micro-interactions' MUST return UI resources",
    passed: uiFound,
    actual: `Returned tools: ${synthUI.relevantTools.map((t) => t.title).join(', ')}`,
    expected: 'Emil Kowalski or UI resources present',
  });

  // Test 18: Strict Abstention on Submarine Software Query
  const synthSub = synthesizeQuery('What do I have for underwater submarine navigation software?', tools, notes);
  results.push({
    id: 18,
    description: "Abstention: 'Submarine software' MUST return 0 tools",
    passed: synthSub.relevantTools.length === 0,
    actual: `Relevant Tools: ${synthSub.relevantTools.length}`,
    expected: 'Relevant Tools: 0',
  });

  // Test 19: Lead Generation Goal Stack Test
  const stackLead = generateGodStack("I'm starting a lead generation campaign", tools);
  results.push({
    id: 19,
    description: "Goal Stack: Lead Generation campaign MUST produce valid capability slots",
    passed: stackLead.slots.length > 0 && stackLead.coveragePercentage > 0,
    actual: `Selected slots: ${stackLead.slots.length}, Coverage: ${stackLead.coveragePercentage}%`,
    expected: 'Slots: > 0, Coverage: > 0%',
  });

  // Test 20: Checklist Fragment Re-classification into Notes
  const checklistNotesFound = searchSEO.notes.some((n) => /cutons 404 pages|meta descriptions|response time promise|case study section/i.test(n.title));
  const checklistInResources = searchSEO.resources.some((r) => /cutons 404 pages|meta descriptions|response time promise|case study section/i.test(r.title));
  results.push({
    id: 20,
    description: "Entity Classification: Checklist items MUST be in NOTES, NOT top-level RESOURCES",
    passed: checklistNotesFound && !checklistInResources,
    actual: `checklistNotesFound: ${checklistNotesFound}, checklistInResources: ${checklistInResources}`,
    expected: 'checklistNotesFound: true, checklistInResources: false',
  });

  // Test 21: SaaS Dev Skills Retrieval Test
  const searchSaasDev = searchBrainKnowledge('top skills for SAAS dev', tools, notes);
  const saasSkills = searchSaasDev.skills;
  const hasSaasDevChampions = saasSkills.some((s) => /ponytail|fable|kowalski|humanizer|marketing|context7|claude-blog/i.test(s.title));
  results.push({
    id: 21,
    description: "Informational: 'top skills for SAAS dev' MUST return >= 5 skills including SaaS dev champions",
    passed: saasSkills.length >= 5 && hasSaasDevChampions,
    actual: `Skills count: ${saasSkills.length}, Has Champions: ${hasSaasDevChampions}`,
    expected: 'Skills count: >= 5, Has Champions: true',
  });

  return results;
}
