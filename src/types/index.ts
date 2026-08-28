export type Domain =
  | 'SEO'
  | 'Development'
  | 'Design'
  | 'Marketing'
  | 'Copywriting'
  | 'DevOps'
  | 'AI & Prompting'
  | 'Productivity';

export interface Tool {
  id: string;
  title: string;
  url?: string;
  description: string;
  domain: Domain;
  subCapability: string;
  rating: number;
  notes?: string;
  tags: string[];
  createdAt?: string;
}

export interface GodStackSlot {
  subCapability: string;
  tool: Tool;
  reasoning: string;
}

export interface GodStack {
  goal: string;
  slots: GodStackSlot[];
  redundancyFiltered: number;
}
