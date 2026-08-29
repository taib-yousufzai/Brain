export type Domain =
  | 'SEO'
  | 'Development'
  | 'Design'
  | 'Marketing'
  | 'Copywriting'
  | 'DevOps'
  | 'AI & Prompting'
  | 'Productivity'
  | 'General';

export type KnowledgeType =
  | 'resource'
  | 'knowledge'
  | 'capability'
  | 'workflow'
  | 'intent'
  | 'other';

export type ResourceCategory = 'tool' | 'skill' | 'repo' | 'mcp' | 'api' | 'note' | 'concept';

export type RelationshipType =
  | 'complements'
  | 'overlaps'
  | 'dependsOn'
  | 'enables'
  | 'replaces';

export interface CapabilityRelation {
  targetToolId: string;
  targetTitle: string;
  relationType: RelationshipType;
  description: string;
}

export interface UserPreferences {
  openSourceOnly?: boolean;
  selfHostedOnly?: boolean;
  apiRequired?: boolean;
  maxComplexity?: 'low' | 'medium' | 'high';
}

export interface Tool {
  id: string;
  title: string;
  name?: string;
  url?: string;
  description: string;
  domain: Domain;
  subCapability: string;
  capabilities?: string[]; // Explicit array of reusable capabilities provided by this resource
  rating: number;
  notes?: string;
  tags: string[];
  entityType?: ResourceCategory;
  category?: ResourceCategory;
  knowledgeTypes?: KnowledgeType[];
  relations?: CapabilityRelation[];
  useCases?: string[];
  strengths?: string[];
  weaknesses?: string[];
  alternatives?: string[];
  overlaps?: string[];
  complements?: string[];
  dependencies?: string[];
  source?: string;
  confidence?: number; // 0 to 1 confidence score
  isOpenSource?: boolean;
  isSelfHosted?: boolean;
  hasApi?: boolean;
  complexity?: 'low' | 'medium' | 'high';
  rawInput?: string;
  createdAt?: string;
  updatedAt?: string;
  sourceOrigin?: string;
}

export interface CustomNote {
  id: string;
  title: string;
  category: 'agentic' | 'bestpractices' | 'vibecode' | 'general';
  content: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  rawContent?: string;
}

export interface GodStackSlot {
  subCapability: string;
  tool: Tool;
  reasoning: string;
  alternatives?: Tool[];
}

export interface NonRecommendationRationale {
  tool: Tool;
  reason: string;
  replacedBy?: string;
}

export interface GodStack {
  goal: string;
  slots: GodStackSlot[];
  redundancyFiltered: number;
  coveragePercentage: number;
  candidatesConsidered: number;
  resourcesSelected: number;
  nonRecommendations: NonRecommendationRationale[];
  knowledgeGaps: string[];
}

export interface OverlapCluster {
  id: string;
  capabilityName: string;
  domain: Domain;
  bestOverall: Tool;
  alternatives: Tool[];
  specialized: { tool: Tool; useCase: string }[];
  notRecommended: { tool: Tool; reason: string }[];
  allMembers: Tool[];
}

export interface SynthesisSection {
  title: string;
  items: string[];
  category: 'source_fact' | 'ai_inference' | 'uncertainty';
}

export interface SynthesisResult {
  query: string;
  topic: string;
  summary: string;
  sections: SynthesisSection[];
  relevantTools: Tool[];
  relevantNotes: CustomNote[];
  knowledgeGaps: { capability: string; status: 'covered' | 'weak' | 'missing'; notes: string }[];
  temporalEvolution?: { timestamp: string; insight: string }[];
}

export type UserFeedbackType =
  | 'useful'
  | 'not_useful'
  | 'already_know'
  | 'prefer_instead'
  | 'dont_recommend';

export interface UserFeedback {
  id: string;
  toolId: string;
  goalContext?: string;
  feedbackType: UserFeedbackType;
  notes?: string;
  createdAt: string;
}

