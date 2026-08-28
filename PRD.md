# Product Requirements Document (PRD) — Brain App

## 1. Executive Summary
**Brain** is a cross-platform personal knowledge engine designed to organize, categorize, rank, and recommend curated skills, tools, links, and notes. Unlike traditional bookmark managers or note-taking apps that return bloated lists of overlapping resources, Brain acts as an intelligent **Capability Orchestrator**. When given a high-level goal (e.g., *"I want to work on SEO"*), Brain returns a non-redundant **"God Stack"**—selecting the single best tool for each distinct sub-capability required for the job.

---

## 2. Core Problem & Objectives
* **The Problem**: Useful skills, tools, and links scattered across text files become unsearchable. When starting a workflow, searching notes yields 20 tools that do the exact same thing, causing decision paralysis.
* **The Goal**: Ingest raw links and notes, automatically extract fine-grained capabilities, deduplicate overlapping tools, and output optimal, role-specific tool stacks for any given task.
* **Primary Target Platforms**: Mobile (iOS & Android) and Desktop (Linux, macOS, Windows) via Progressive Web App (PWA) standards.

---

## 3. Key Feature Requirements

### 3.1 Tool & Skill Ingestion
* **Multi-Format Input**: Accept raw URLs, freeform text notes, markdown files, and manual entries.
* **Metadata Extraction**: Scrape metadata (OpenGraph tags, page titles, descriptions) from URLs automatically.
* **Quick Capture**: Mobile and Desktop Web Share API integration for one-click saving.

### 3.2 AI Capability Engine & Taxonomy
* **Automatic Tagging**: Assign every item to a Primary Domain (e.g., `SEO`, `Design`, `DevOps`) and fine-grained Sub-Capabilities (e.g., `Keyword Research`, `Technical Audit`).
* **Tool Quality Scoring**: Calculate utility ratings based on user notes, frequency of use, and explicit quality tags.
* **Redundancy Detection**: Flag tools that perform identical sub-tasks to prevent duplicate recommendations.

### 3.3 "God Stack" Recommendation Engine
* **Workflow Querying**: Allow natural language queries (e.g., *"I need a complete stack for launching a SaaS landing page"*).
* **Capability Coverage Selection**: Identify all sub-capabilities required for the workflow and select **exactly one best-in-class tool** for each slot.
* **Stack Export & Share**: Copy recommended stacks as markdown, checklist, or direct launch links.

### 3.4 Library & Semantic Search
* **Hybrid Search**: Combine keyword search with vector semantic search (`pgvector`) to find tools based on intent rather than exact keyword matches.
* **Domain Filtering**: Browse tools by category, capability, rating, or platform.

---

## 4. Non-Functional Requirements
* **Cross-Platform Access**: Seamless installation on Phone and Desktop with PWA standalone mode.
* **Performance**: Sub-100ms library search and under 2s recommendation generation.
* **Data Privacy**: Local-first or encrypted cloud database for personal notes and API credentials.
* **Offline Resilience**: Cache stored tool library for offline browsing.

---

## 5. Success Metrics
* 0% redundancy in generated workflow recommendations (max 1 tool per sub-capability slot).
* Instant cross-device synchronization between Phone and Desktop.
* Sub-30-second capture time for new skills and tools.
