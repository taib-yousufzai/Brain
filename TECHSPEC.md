# Technical Specification (TECHSPEC) — Brain App

## 1. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Client (Mobile & Desktop PWA)                │
│                   Next.js App Router (React + CSS)              │
└────────────────────────────────┬────────────────────────────────┘
                                 │ HTTP / REST / Server Actions
┌────────────────────────────────▼────────────────────────────────┐
│                       Next.js API Server                        │
│ ┌───────────────────────────┬─────────────────────────────────┐ │
│ │ Tool Ingestion & Parser   │  God Stack Coverage Engine     │ │
│ └─────────────┬─────────────┴─────────────────┬───────────────┘ │
└───────────────┼───────────────────────────────┼─────────────────┘
                │                               │
┌───────────────▼───────────────┐     ┌─────────▼─────────────────┐
│     AI Engine / Embeddings    │     │   Database (Supabase /   │
│ (Vercel AI SDK / OpenAI API) │     │ PostgreSQL + pgvector)   │
└───────────────────────────────┘     └───────────────────────────┘
```

---

## 2. Technology Stack Selection

* **Frontend**: Next.js 14+ (App Router), React, Vanilla CSS with custom tokens (Glassmorphism & Dark Mode).
* **Animation & UI Libraries**:
  * `@darkroom.engineering/lenis` (Inertia smooth scroll)
  * `gsap` (Complex timeline & card assembly animations)
  * `vanta` & `three` (Interactive 3D neural-net background matrix)
  * `framer-motion` & custom React Bits components (Spotlight cursor, tilt cards, magnetic buttons)
* **PWA Engine**: `@ducanh2912/next-pwa` or Serwist for manifest generation, service worker caching, and installation support.
* **Backend / API**: Next.js Server Actions & API Routes (Node.js runtime).
* **Database & Vector Search**: Supabase PostgreSQL with `pgvector` extension (or Prisma/Drizzle ORM for local SQLite option).
* **AI & NLP Orchestration**: Vercel AI SDK (`ai` package) paired with `gpt-4o-mini` or `claude-3-5-haiku` for classification & embedding generation (`text-embedding-3-small`).

---

## 2.1 Design System Tokens & Glassmorphism Specs

```css
:root {
  /* Color Palette */
  --bg-main: #090a0f;
  --bg-surface: #12151e;
  --bg-glass: rgba(18, 21, 30, 0.65);
  --bg-glass-hover: rgba(255, 255, 255, 0.05);

  /* Accents & Gradients */
  --accent-primary: #6366f1;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%);
  --accent-cyan: #06b6d4;
  --accent-emerald: #10b981;

  /* Glass Borders & Shadows */
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glass-active: rgba(99, 102, 241, 0.4);
  --shadow-glow: 0 0 25px rgba(99, 102, 241, 0.15);

  /* Typography */
  --font-display: 'Plus Jakarta Sans', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Blur & Transitions */
  --backdrop-blur: blur(16px);
  --transition-smooth: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
```

---

## 3. Database Schema Design

### `tools`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Unique tool ID |
| `title` | `VARCHAR(255)` | Tool/Skill name |
| `url` | `TEXT` | Direct URL (optional) |
| `description` | `TEXT` | Summary of tool functionality |
| `content` | `TEXT` | Raw user notes or full markdown content |
| `domain` | `VARCHAR(100)` | Primary domain (e.g. `SEO`, `DevOps`) |
| `rating` | `INTEGER` | Quality score (1 to 10) |
| `embedding` | `vector(1536)` | Vector embedding for semantic search |
| `created_at` | `TIMESTAMP` | Record creation timestamp |

### `capabilities`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Capability ID |
| `domain` | `VARCHAR(100)` | Domain name |
| `name` | `VARCHAR(100)` | Sub-capability name (e.g., `Keyword Research`) |

### `tool_capabilities` (Junction Table)
| Column | Type | Description |
| :--- | :--- | :--- |
| `tool_id` | `UUID` (FK) | Reference to `tools.id` |
| `capability_id` | `UUID` (FK) | Reference to `capabilities.id` |
| `is_primary` | `BOOLEAN` | True if this is the tool's primary strength |

---

## 4. God-Stack Selection Algorithm

1. **Input**: Goal Prompt $G$ (e.g. *"SEO Workflow"*).
2. **Step 1 (Decomposition)**: LLM breaks down $G$ into a set of distinct, non-overlapping sub-capabilities: $C = \{c_1, c_2, \dots, c_n\}$.
3. **Step 2 (Candidate Fetch)**: For each capability $c_i \in C$, fetch matching candidate tools from `tools` table filtered by `tool_capabilities`.
4. **Step 3 (Greedy Coverage Selection)**:
   * Rank candidates for slot $c_i$ by: $\text{Score} = (W_1 \cdot \text{Rating}) + (W_2 \cdot \text{PrimaryStrength}) + (W_3 \cdot \text{VectorSimilarity})$.
   * Select top tool $T_i$ for slot $c_i$.
   * Exclude $T_i$ from subsequent slots to guarantee zero redundancy across the stack.
5. **Output**: Formatted JSON response representing the assembled "God Stack".
