# Project Rules & Standards (RULES.md) — Brain App

## 1. Coding & Architecture Rules
* **Strict TypeScript**: No `any` types. All tool metadata, database rows, and API responses must have explicit TypeScript interfaces.
* **Next.js App Router Conventions**:
  * Put shared client components in `components/`.
  * Put server actions / data fetchers in `lib/` or `app/api/`.
* **Zero Unnecessary Dependencies**: Keep package overhead low to maintain sub-second PWA load times on mobile devices.

---

## 2. Selected UI Aesthetic: Emil Kowalski Design & UI Taste

* **Style Architecture (Emil Kowalski High-Density Slate Industrial)**:
  * **Emil Kowalski Design Standard**: Snappy micro-interactions (150-200ms ease), high-density data layout grids, and strict typography contrast.
  * **Slate Industrial Surface**: Deep dark background (`#0b0f17`), structured cards (`#131823`), and crisp 1px borders (`#1e2638`).
  * **Skeleton Loading**: Integrated `skeleton-box` keyframe loaders matching component geometry to prevent layout shift.

---

## 3. Taxonomy & Categorization Rules
* **Single Tool Per Capability Slot**: The recommendation engine MUST NEVER assign 2 tools to the same sub-capability in a single generated workflow stack.
* **Normalized Capability Names**: Standardize sub-capability tags (e.g. use `Keyword Research` instead of freeform variations like `kw-research` or `finding keywords`).

---

## 4. Git & Commit Conventions
* **Prefixes**:
  * `feat:` New user-facing feature
  * `fix:` Bug fix
  * `docs:` Documentation updates
  * `refactor:` Code cleanup without logic change
