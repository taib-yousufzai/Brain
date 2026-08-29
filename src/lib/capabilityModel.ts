import { Tool, Domain } from '@/types';

export interface CapabilityEvidence {
  capability: string; // Human readable name (e.g., "Keyword Research")
  canonicalId: string; // Standardized key (e.g., "keyword_research")
  confidence: number; // 0.0 to 1.0
  evidence: string[]; // Specific supporting text snippets from the tool itself
  source: 'explicit' | 'inferred' | 'external';
}

export interface CanonicalCapabilityDef {
  canonicalId: string;
  name: string;
  domain: Domain;
  synonyms: string[];
  requiredKeywords: string[];
  incompatibleDomains?: string[];
}

export const CANONICAL_CAPABILITIES: Record<string, CanonicalCapabilityDef> = {
  saas_development: {
    canonicalId: 'saas_development',
    name: 'SaaS Product & Web App Development',
    domain: 'Development',
    synonyms: ['saas', 'saas dev', 'saas development', 'saas build', 'saas stack', 'building saas', 'web app development', 'fullstack saas', 'software as a service', 'saas tools', 'skills for saas'],
    requiredKeywords: ['saas', 'development', 'fullstack', 'web app', 'next.js', 'react', 'typescript', 'api', 'database', 'auth', 'billing', 'stripe', 'analytics', 'posthog', 'docker', 'devops', 'ponytail', 'fable method', 'context7', 'senior dev', 'yagni'],
  },
  software_engineering_rules: {
    canonicalId: 'software_engineering_rules',
    name: 'Senior Developer Methodology & Engineering Rules',
    domain: 'Development',
    synonyms: ['developer skills', 'dev skills', 'senior dev mode', 'yagni', 'clean code', 'fable method', 'ponytail', 'context7', 'software engineering', 'dev rules', 'senior developer', 'saas dev'],
    requiredKeywords: ['ponytail', 'fable method', 'context7', 'yagni', 'minimal viable code', 'debugging', 'verification', 'senior dev'],
  },
  seo_toolkit: {
    canonicalId: 'seo_toolkit',
    name: 'SEO & Search Engine Optimization',
    domain: 'SEO',
    synonyms: ['seo', 'search engine optimization', 'seo audit', 'seo tool', 'seo skill', 'programmatic seo', 'geo/aeo'],
    requiredKeywords: ['seo', 'search engine optimization', 'technical seo', 'ahrefs', 'semrush', 'dataforseo', 'screaming frog', 'claude-seo', 'ultimate-seo-geo'],
    incompatibleDomains: ['virtualization', 'mobile', 'hardware', 'ios', 'browser automation'],
  },
  keyword_research: {
    canonicalId: 'keyword_research',
    name: 'Keyword Research',
    domain: 'SEO',
    synonyms: ['keyword research', 'keyword discovery', 'keyword analysis', 'search volume', 'keyword targeting', 'google rankings', 'rankings', 'rank tracking'],
    requiredKeywords: ['keyword', 'search volume', 'ahrefs', 'semrush', 'dataforseo', 'google rankings', 'rankings', 'keyword research'],
    incompatibleDomains: ['virtualization', 'mobile', 'hardware', 'ios'],
  },
  technical_seo: {
    canonicalId: 'technical_seo',
    name: 'Technical SEO',
    domain: 'SEO',
    synonyms: ['technical seo', 'site audit', 'crawlability', 'indexation', 'schema markup', 'meta tags', 'screaming frog', 'citations'],
    requiredKeywords: ['technical seo', 'site audit', 'crawlability', 'screaming frog', 'ahrefs', 'citations', 'schema markup'],
  },
  competitor_analysis: {
    canonicalId: 'competitor_analysis',
    name: 'Competitor Analysis',
    domain: 'SEO',
    synonyms: ['competitor analysis', 'competitor research', 'competitor spy', 'gap analysis', 'serp analysis'],
    requiredKeywords: ['competitor', 'serp analysis', 'ahrefs', 'semrush'],
  },
  content_optimization: {
    canonicalId: 'content_optimization',
    name: 'Content Optimization',
    domain: 'SEO',
    synonyms: ['content optimization', 'on-page seo', 'content score', 'surfer seo', 'clearscope', 'blog delivery', 'blog'],
    requiredKeywords: ['content optimization', 'on-page seo', 'surfer', 'clearscope', 'blog delivery', 'blog'],
  },
  backlink_analysis: {
    canonicalId: 'backlink_analysis',
    name: 'Backlink Analysis',
    domain: 'SEO',
    synonyms: ['backlink analysis', 'link building', 'backlinks', 'domain authority', 'referring domains'],
    requiredKeywords: ['backlink', 'link building', 'ahrefs', 'semrush'],
  },
  search_performance: {
    canonicalId: 'search_performance',
    name: 'Search Performance',
    domain: 'SEO',
    synonyms: ['search performance', 'rank tracking', 'google search console', 'organic traffic', 'serp tracking'],
    requiredKeywords: ['search console', 'rank tracking', 'serp tracking', 'organic traffic'],
  },
  browser_automation: {
    canonicalId: 'browser_automation',
    name: 'Browser Automation',
    domain: 'Development',
    synonyms: ['browser automation', 'headless browser', 'web automation', 'playwright', 'puppeteer', 'selenium', 'browser-use', 'extract data from websites'],
    requiredKeywords: ['puppeteer', 'playwright', 'selenium', 'browser-use', 'headless browser', 'browser automation', 'playwrite', 'agent-browser'],
  },
  web_crawling: {
    canonicalId: 'web_crawling',
    name: 'Web Crawling & Data Extraction',
    domain: 'Development',
    synonyms: ['web crawling', 'web scraping', 'site crawler', 'firecrawl', 'crawl4ai', 'scrapy', 'crawly', 'extract data from websites', 'extract website data', 'extract data', 'data extraction', 'scraping', 'extracting data'],
    requiredKeywords: ['crawl', 'scraper', 'scraping', 'firecrawl', 'crawl4ai', 'scrapy', 'crawly', 'web crawler', 'extract'],
  },
  rag_retrieval: {
    canonicalId: 'rag_retrieval',
    name: 'RAG & Vector Retrieval',
    domain: 'AI & Prompting',
    synonyms: ['rag', 'retrieval augmented generation', 'vector database', 'vector db', 'semantic search', 'embedding', 'things related to rag'],
    requiredKeywords: ['rag', 'retrieval', 'vector', 'embedding', 'chroma', 'pgvector', 'pinecone', 'qdrant'],
  },
  ai_agent_framework: {
    canonicalId: 'ai_agent_framework',
    name: 'AI Agent Framework',
    domain: 'AI & Prompting',
    synonyms: ['ai agent framework', 'autonomous agent', 'multi-agent', 'agent orchestration', 'agentic workflow', 'crewai', 'autogen'],
    requiredKeywords: ['agent', 'crewai', 'autogen', 'langchain', 'llamaindex', 'agentic', 'tool calling'],
  },
  apple_virtualization: {
    canonicalId: 'apple_virtualization',
    name: 'Apple Virtualization & Mobile VM',
    domain: 'Development',
    synonyms: ['apple virtualization', 'virtual iphone', 'pcc vm', 'pcc research', 'ios virtualization', 'vphone-cli', 'vphone'],
    requiredKeywords: ['virtual iphone', 'virtualization.framework', 'pcc research vm', 'vphone', 'apple virtualization'],
  },
  copywriting: {
    canonicalId: 'copywriting',
    name: 'Copywriting & Landing Copy',
    domain: 'Copywriting',
    synonyms: ['copywriting', 'landing page copy', 'value proposition', 'conversion copy', 'sales copy', 'copywriting slop removal'],
    requiredKeywords: ['copywriting', 'landing page copy', 'value proposition', 'conversion copy'],
  },
  ai_slop_elimination: {
    canonicalId: 'ai_slop_elimination',
    name: 'AI Slop Elimination',
    domain: 'Copywriting',
    synonyms: ['ai slop elimination', 'humanizer', 'ai text cleanup', 'slop killer', 'blader humanizer', 'copywriting slop removal', 'slop'],
    requiredKeywords: ['slop killer', 'humanizer', 'ai slop', 'buzzwords', 'slop'],
  },
  ui_design: {
    canonicalId: 'ui_design',
    name: 'UI/UX Design Systems',
    domain: 'Design',
    synonyms: ['ui design', 'micro-interactions', 'design system', 'frontend aesthetics', 'emil kowalski'],
    requiredKeywords: ['design system', 'micro-interactions', 'ui design', 'emil kowalski', 'frontend taste', 'design'],
  },
  ocr_processing: {
    canonicalId: 'ocr_processing',
    name: 'OCR & Document Parsing',
    domain: 'Development',
    synonyms: ['ocr', 'text recognition', 'image to text', 'pdf ocr', 'document parsing', 'olmocr'],
    requiredKeywords: ['ocr', 'image to text', 'pdf processing', 'document parsing', 'olmocr'],
  },
  devops_deployment: {
    canonicalId: 'devops_deployment',
    name: 'DevOps & Deployment',
    domain: 'DevOps',
    synonyms: ['deployment', 'self-hosting', 'paas', 'docker deployment', 'cloud host'],
    requiredKeywords: ['docker', 'deployment', 'self-host', 'paas', 'kubernetes'],
  },
  lead_generation: {
    canonicalId: 'lead_generation',
    name: 'Lead Generation & Prospecting',
    domain: 'Marketing',
    synonyms: ['lead generation', 'prospecting', 'email extraction', 'outreach automation', 'contact finder', 'job search', 'lead'],
    requiredKeywords: ['lead generation', 'prospecting', 'email extraction', 'outreach', 'job search', 'lead'],
  },
};

export function extractResourceCapabilities(tool: Partial<Tool>): CapabilityEvidence[] {
  const title = (tool.title || '').trim();
  const description = (tool.description || '').trim();
  const url = (tool.url || '').trim();
  const subCap = (tool.subCapability || '').trim();
  const primaryText = `${title} ${description} ${subCap} ${url}`.toLowerCase();

  const results: CapabilityEvidence[] = [];

  for (const def of Object.values(CANONICAL_CAPABILITIES)) {
    const evidenceQuotes: string[] = [];

    const titleMatch = def.synonyms.some((s) => title.toLowerCase().includes(s));
    if (titleMatch) {
      evidenceQuotes.push(`Title explicitly contains "${title}"`);
    }

    const matchedKeywords = def.requiredKeywords.filter((kw) => primaryText.includes(kw.toLowerCase()));

    if (titleMatch || matchedKeywords.length > 0) {
      let confidence = 0.5;

      if (titleMatch) {
        confidence = 0.98;
      } else if (matchedKeywords.length >= 2) {
        confidence = 0.90;
        evidenceQuotes.push(`Description matches keywords: ${matchedKeywords.join(', ')}`);
      } else if (matchedKeywords.length === 1) {
        const singleKw = matchedKeywords[0];
        if (
          [
            'keyword',
            'ahrefs',
            'semrush',
            'puppeteer',
            'playwright',
            'crawl4ai',
            'firecrawl',
            'screaming frog',
            'slop',
            'humanizer',
            'olmocr',
            'vphone',
            'job search',
            'lead',
            'claude-seo',
            'ultimate-seo-geo',
            'ponytail',
            'fable method',
            'context7',
            'posthog',
            'saas',
          ].includes(singleKw)
        ) {
          confidence = 0.85;
          evidenceQuotes.push(`Description contains core keyword "${singleKw}"`);
        } else {
          continue;
        }
      }

      if (def.incompatibleDomains) {
        const isIncompatible = def.incompatibleDomains.some((inc) => primaryText.includes(inc));
        if (isIncompatible) {
          continue;
        }
      }

      results.push({
        capability: def.name,
        canonicalId: def.canonicalId,
        confidence,
        evidence: evidenceQuotes.length > 0 ? evidenceQuotes : [`Matches canonical pattern for ${def.name}`],
        source: titleMatch ? 'explicit' : 'inferred',
      });
    }
  }

  return results;
}
