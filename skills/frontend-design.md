# Skill: Frontend Design (Modern UI Systems & Swiss Typography)

**Domain**: Frontend System Architecture & Layout Engineering  
**Rating**: 9.9 / 10  
**Target**: Scalable Component Architecture, Responsive Layout Engineering & Design System Tokens

---

## 🎨 Design System & Layout Architecture

### 1. Component Modularity & Clean Props
- Keep UI components focused, single-purpose, and decoupled from global side effects.
- Pass explicit TypeScript interfaces for all component prop definitions.

### 2. Modern Responsive Layout Standards
- Mobile-First Grid System: Build clean viewports starting from mobile (`xs`) through desktop (`xl`).
- Use CSS Flexbox and Grid layouts with responsive utility fallbacks (`hidden md:table`, `block md:hidden`).

### 3. Systematic Color Tokens
- Enforce curated semantic color tokens (`bg-[#0b0f17]`, `bg-[#131823]`, `border-[#1e2638]`).
- Avoid arbitrary inline hex values across components by standardizing surface tokens.
