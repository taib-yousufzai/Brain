# Application Flow (APPFLOW) — Brain App

## 1. Overview & Navigation Structure
The Brain App is designed for high-efficiency capture, browsing, and workflow generation across Mobile and Desktop displays.

```
                  ┌──────────────────────────────┐
                  │    Brain Dashboard / Home    │
                  └──────────────┬───────────────┘
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     ▼                           ▼                           ▼
┌─────────┐             ┌─────────────────┐         ┌─────────────────┐
│ Quick   │             │   "God Stack"   │         │  Tool & Skill   │
│ Capture │             │   Generator     │         │    Library      │
└─────────┘             └─────────────────┘         └─────────────────┘
```

---

## 2. User Journey Flows

### Flow 1: Ingesting New Tools & Skills (Quick Capture)
1. **Trigger**: User hits "+ Add Tool" button in app, or uses OS Share Sheet (Mobile/Desktop PWA).
2. **Input**: User pastes a URL or raw text snippet (e.g., note about a new Python library or SEO tool).
3. **Processing**:
   * App fetches page metadata (Title, OG Description, Favicon).
   * AI Ingesters parse the content and auto-assign:
     * Domain (e.g., `Development`)
     * Sub-Capability (e.g., `API Testing`)
     * Utility Score & Key Features
4. **Confirmation**: App displays a auto-tagged summary card. User can edit tags or tap "Save".

---

### Flow 2: Workflow Recommendation Request ("God Stack" Generator)
1. **Trigger**: User lands on the Generator screen and inputs a goal (e.g., *"I need an SEO stack for e-commerce"*).
2. **Processing**:
   * Generator breaks goal into sub-capability slots (`Keyword Research`, `Technical Audit`, `Schema Generator`, `Backlink Monitor`).
   * For each slot, the engine queries the library and selects the single highest-rated tool.
3. **Output**:
   * Renders the **God Stack**: A curated, non-redundant list of tools with exact roles specified for each.
   * Action buttons: `Copy Stack as Markdown`, `Open All Tools`, `Save Workflow`.

---

### Flow 3: Library Search & Capability Browsing
1. **Trigger**: User navigates to the Library tab.
2. **Search / Filter**:
   * Search bar supports semantic query (e.g., *"tools for fixing website loading speed"*).
   * Filter chips by Domain (`SEO`, `Design`, `Frontend`, `Marketing`) and Capability.
3. **Detail View**: Tapping a tool shows its extracted features, personal notes, quality score, and related alternative tools.

---

## 3. Screen Breakdown

| Screen | Primary Purpose | Key Features |
| :--- | :--- | :--- |
| **Home / Dashboard** | High-level overview & search | Recent tools, Quick Search, Quick Stack generator input |
| **Quick Add** | Fast ingestion | URL auto-fill, AI auto-tag preview, manual tag override |
| **God Stack Generator** | Capability orchestration | Goal input, sub-capability mapping, non-redundant tool output |
| **Library** | Tool browsing | Multi-faceted search, domain categorization, tool detail modal |
| **Settings** | Configuration | Database sync settings, AI API key configuration, PWA offline options |
