export type QueryIntentType =
  | 'informational'
  | 'knowledge_retrieval'
  | 'recommendation'
  | 'goal_orchestration'
  | 'capability_retrieval'
  | 'goal_request'
  | 'redundancy_query'
  | 'unexplored_query'
  | 'temporal_query';

export interface ClassifiedQueryIntent {
  intentType: QueryIntentType;
  rawQuery: string;
  topicKeyword: string;
  cleanedCoreTopic?: string;
  coreTokens?: string[];
  requestedCapabilityId?: string;
  entityTypeFilter?: 'all' | 'resource' | 'note' | 'skill';
  preferSkills?: boolean;
  requiresStackOptimization: boolean;
  confidence: number;
}

export function classifyQueryIntent(query: string): ClassifiedQueryIntent {
  const norm = query.toLowerCase().trim();

  // Detect explicit preference for skills (e.g. "top skills for...", "skills for...", "skills related to...")
  const preferSkills = /\bskills?\b/i.test(norm) || /\bframeworks?\b/i.test(norm) || /\brules?\b/i.test(norm);

  // Helper to extract core tokens and cleaned topic
  const extractCoreTopicAndTokens = (rawTopic: string) => {
    const cleaned = rawTopic
      .replace(/\b(top|best|good|great|recommended|essential|favorite|skills|skill|tools|tool|resources|resource|for|in|on|about|my|brain|devs|dev|development)\b/gi, '')
      .replace(/[^a-z0-9_-]+/g, ' ')
      .trim();

    const tokens = query
      .toLowerCase()
      .split(/[^a-z0-9_-]+/)
      .filter((t) => t.length > 1 && !['top', 'best', 'skills', 'skill', 'tools', 'tool', 'for', 'a', 'an', 'the', 'my', 'in', 'on', 'about', 'what', 'do', 'have', 'show', 'list'].includes(t));

    return {
      cleanedCoreTopic: cleaned || rawTopic,
      coreTokens: tokens.length > 0 ? tokens : [rawTopic],
    };
  };

  // 1. Redundancy / Duplicate Query
  if (/redundant|duplicate|overlap|competing tools|what tools overlap/i.test(norm)) {
    return {
      intentType: 'redundancy_query',
      rawQuery: query,
      topicKeyword: 'redundancies',
      requiresStackOptimization: false,
      confidence: 0.95,
    };
  }

  // 2. Unexplored Saved Tools Query
  if (/unexplored|never really explored|saved but|hidden gems|forgotten tools/i.test(norm)) {
    return {
      intentType: 'unexplored_query',
      rawQuery: query,
      topicKeyword: 'unexplored',
      requiresStackOptimization: false,
      confidence: 0.95,
    };
  }

  // 3. Temporal / Evolution Query
  if (/thinking|evolution|changed|how has my|over time|history of/i.test(norm)) {
    return {
      intentType: 'temporal_query',
      rawQuery: query,
      topicKeyword: 'evolution',
      requiresStackOptimization: false,
      confidence: 0.9,
    };
  }

  // 4. Goal / Stack Orchestration Request (Triggers Stack Optimization & Goal Decomposition)
  const isGoalOrchestration =
    /build me|start a|start an|starting a|starting an|recommend a stack|stack|design a workflow|create a stack/i.test(norm) ||
    norm.startsWith('i want to') ||
    norm.startsWith("i'm building") ||
    norm.startsWith('i am building') ||
    norm.startsWith("i'm starting") ||
    norm.startsWith('i am starting');

  if (isGoalOrchestration) {
    let topic = norm
      .replace(/build me|starting an|starting a|start an|start a|how should i|what combination|stack|for my|project|system/gi, '')
      .trim();
    if (!topic) topic = 'General Goal';

    const { cleanedCoreTopic, coreTokens } = extractCoreTopicAndTokens(topic);

    return {
      intentType: 'goal_request',
      rawQuery: query,
      topicKeyword: topic,
      cleanedCoreTopic,
      coreTokens,
      preferSkills,
      requiresStackOptimization: true,
      confidence: 0.95,
    };
  }

  // 5. Explicit Recommendation Query ("What should I use for SEO?")
  if (/what should i use|recommend a tool|best tool for|which tool should i|top skills for|best skills for/i.test(norm)) {
    let topic = norm
      .replace(/what should i use|recommend a tool for|best tool for|which tool should i use for|top skills for|best skills for|for|about|on/gi, '')
      .replace(/\?$/, '')
      .trim();
    if (!topic) topic = norm;

    const { cleanedCoreTopic, coreTokens } = extractCoreTopicAndTokens(topic);

    return {
      intentType: 'recommendation',
      rawQuery: query,
      topicKeyword: topic,
      cleanedCoreTopic,
      coreTokens,
      preferSkills,
      requiresStackOptimization: false,
      confidence: 0.92,
    };
  }

  // 6. Capability Retrieval Query ("What can I use to crawl websites?", "Do I have anything for competitor analysis?")
  if (/what can i use|do i have anything for|tools do i have for|what tools do i have for|what skills do i have for/i.test(norm)) {
    let topic = norm
      .replace(/^what (can i use|do i have for|tools do i have for|skills do i have for) (to|for|about)?/i, '')
      .replace(/^do i have anything for/i, '')
      .replace(/\?$/, '')
      .trim();
    if (!topic) topic = norm;

    const { cleanedCoreTopic, coreTokens } = extractCoreTopicAndTokens(topic);

    return {
      intentType: 'capability_retrieval',
      rawQuery: query,
      topicKeyword: topic,
      cleanedCoreTopic,
      coreTokens,
      preferSkills,
      requiresStackOptimization: false,
      confidence: 0.93,
    };
  }

  // 7. Knowledge Retrieval / Informational Query ("What do I have for SEO?", "What did I save about programmatic SEO?", "top skills for SAAS dev")
  let topic = norm
    .replace(/^what (do i have|tools do i have|skills do i have|have i saved|did i save|is in my brain|do i know) (for|about|on)?/i, '')
    .replace(/^show me (my|all)?/i, '')
    .replace(/^list (my|all)?/i, '')
    .replace(/\?$/, '')
    .trim();

  if (!topic) topic = norm;

  const { cleanedCoreTopic, coreTokens } = extractCoreTopicAndTokens(topic);

  return {
    intentType: 'informational',
    rawQuery: query,
    topicKeyword: topic,
    cleanedCoreTopic,
    coreTokens,
    preferSkills,
    requiresStackOptimization: false,
    confidence: 0.95,
  };
}
