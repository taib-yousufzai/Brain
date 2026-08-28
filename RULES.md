# Project Rules & Standards (RULES.md) — Brain App

## 1. Coding & Architecture Rules
* **Strict TypeScript**: No `any` types. All tool metadata, database rows, and API responses must have explicit TypeScript interfaces.
* **Next.js App Router Conventions**:
  * Put shared client components in `components/`.
  * Put server actions / data fetchers in `lib/` or `app/api/`.
* **Zero Unnecessary Dependencies**: Keep package overhead low to maintain sub-second PWA load times on mobile devices.

---

## 2. Selected UI Aesthetic: Swiss Editorial Bento-Glass

* **Style Architecture (Swiss Editorial + Bento Grid + Glassmorphism)**:
  * **Bento Grid Layout**: All tool cards, capability slots, metrics, and God-Stack output panels are structured in asymmetric, modular Bento Grid cards.
  * **Swiss Editorial Typography**: Ultra-clean typographic hierarchy, huge bold headlines, crisp mathematical grid alignments, and high-contrast editorial data displays.
  * **Obsidian Glassmorphism**: Translucent dark glass cards (`rgba(18, 21, 30, 0.65)` + `backdrop-filter: blur(16px)`) with glowing 1px borders and dynamic hover spotlights.

* **Animation & Interaction Stack**:
  * **Lenis (`@darkroom.engineering/lenis`)**: Liquid inertia smooth scrolling across desktop and mobile viewports.
  * **GSAP (GreenSock)**: Timeline-driven "God Stack" assembly animations—cards dynamically glide and lock into their capability slots when generated.
  * **Vanta.js (`vanta/dist/vanta.net.min.js` or `vanta.topology`)**: Dark interactive 3D neural-net background matrix reacting subtly to cursor movement.
  * **React Bits**: Spotlight cursor tracking, 3D card tilt effects, magnetic action buttons, and animated gradient text highlights.

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
