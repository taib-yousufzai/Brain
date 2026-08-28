# Overall Implementation Plan — Brain App

## Overview
This document details the complete end-to-end execution roadmap for building the **Brain** application.

---

## Phase 1: Foundation & Project Setup
* **1.1 Initialize Next.js Project**:
  * Set up Next.js App Router with TypeScript.
  * Configure PWA support (`next-pwa` / manifest generation).
* **1.2 Design System Setup**:
  * Create `app/globals.css` with CSS tokens (Dark mode palette, Glassmorphism, typography).
  * Build core UI layout components (Header, Navigation bar, Responsive container).
* **1.3 Database Setup**:
  * Initialize Supabase / PostgreSQL schema (`tools`, `capabilities`, `tool_capabilities`).
  * Enable `pgvector` extension and indexing.

---

## Phase 2: Tool Ingestion & Tagging Pipeline
* **2.1 Metadata Extraction Service**:
  * Build URL metadata scraper for extracting titles, OpenGraph data, and descriptions.
* **2.2 AI Taxonomy Ingester**:
  * Integrate LLM prompt handler to parse user notes/links and output structured JSON tags (`domain`, `sub_capability`, `rating`, `summary`).
* **2.3 Persistence Layer**:
  * Build server action / API route `/api/tools/ingest` to store tools and generate vector embeddings.

---

## Phase 3: "God Stack" Recommendation Engine
* **3.1 Workflow Decomposition Service**:
  * Build prompt engine to break down user workflow goals into distinct sub-capability slots.
* **3.2 Greedy Coverage Selection Logic**:
  * Implement non-redundant tool selection algorithm (max 1 tool per capability slot).
* **3.3 Recommendation API Endpoint**:
  * Build `/api/recommend` route to execute the selection algorithm and return assembled stacks.

---

## Phase 4: UI / UX & PWA Integration
* **4.1 Dashboard & Search Interface**:
  * Implement real-time library search bar with domain filter chips.
  * Build semantic vector search integration.
* **4.2 "God Stack" Generator View**:
  * Build interactive stack generation view with goal input and stack export options.
* **4.3 Mobile & Desktop PWA Polish**:
  * Configure `manifest.json`, offline service workers, and app icons for phone & desktop home screens.

---

## Phase 5: Verification & Launch
* **5.1 End-to-End Testing**:
  * Verify PWA installation flow on mobile and desktop viewports.
  * Test tool ingest with sample notes/links.
  * Confirm 0% tool redundancy in generated workflow stacks.
