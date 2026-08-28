# Skill: Emil Kowalski Design & UI Taste

**Domain**: Design & UI Aesthetics  
**Rating**: 10.0 / 10  
**Target**: Enterprise Grade UI, High-Density Layouts, Micro-Interactions & Taste Audit

---

## 🎨 Core Design Principles & Taste Guidelines

### 1. Functional Micro-Interactions
- Every hover, active, and focus state must communicate explicit feedback.
- Use ultra-fast, snappy transitions (`150ms` - `200ms` `ease-in-out` or `cubic-bezier(0.16, 1, 0.3, 1)`).
- Avoid slow, floaty, or over-dramatic animations that delay user interaction.

### 2. High-Density Industrial Spacing
- Use a disciplined 4px/8px spatial grid (`p-3`, `p-4`, `p-5`, `p-6`).
- Maximize useful data density on screen without causing visual clutter.
- Maintain crisp alignment between headings, key-value metrics, and action buttons.

### 3. Slate Dark-Mode Color Hierarchy
- **Base Background**: `#0b0f17` (Deep dark slate background).
- **Surface Elevation**: `#131823` (Structured dark surface card).
- **Borders & Dividers**: `#1e2638` (Crisp, subtle 1px border contrast).
- **Accent Primary**: `#2563eb` (Solid enterprise blue action accent).
- **Text Scale**:
  - Primary: `#ffffff` (High contrast headers).
  - Body: `#cbd5e1` (Readable slate body copy).
  - Muted: `#64748b` (Secondary labels & metadata).

### 4. Typographic Clarity
- Use geometric sans-serif fonts for headings (`Plus Jakarta Sans`, `Inter`).
- Use monospace font stacks (`JetBrains Mono`, `monospace`) for metrics, technical tags, and ratings.
- Strict visual hierarchy: Headings (`text-lg` to `text-2xl`), Body (`text-xs` to `text-sm`), Labels (`text-[10px]` to `text-[11px]`).

### 5. Skeleton Loading & Zero Layout Shifts
- Never use non-deterministic spinners for data blocks.
- Implement CSS keyframe pulse loaders (`skeleton-box`) matching exact component layout dimensions.

---

## 🚀 Applied Checklist for UI Quality
- [x] Zero harsh gradients, zero radial orbs, zero liquid glass.
- [x] High-contrast 1px solid borders on all elevated card surfaces.
- [x] Inline vector SVG icons only — zero external icon bloat.
- [x] Full responsive adaptation across mobile (`xs`), tablet (`sm`/`md`), and desktop (`lg`/`xl`).
- [x] Visible, accessible text labels and tooltips on interactive elements.
