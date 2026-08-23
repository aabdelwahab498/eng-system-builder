import type { CanonicalProject } from "../schema";

/**
 * Canonical projects (Phase 4).
 *
 * Projects are proof of engineering capability. No metrics, users, revenue or
 * performance claims appear anywhere — none were verified. Unknown fields stay
 * empty rather than being filled with invented content.
 */
export const projects: CanonicalProject[] = [
  {
    id: "project-universal-ai-software-factory",
    slug: "universal-ai-software-factory",
    title: { en: "Universal AI Software Factory", ar: "مصنع البرمجيات الشامل بالذكاء الاصطناعي" },
    tagline: {
      en: "An AI-powered software factory that analyses, generates, validates and orchestrates software systems.",
      ar: null,
    },
    category: "ai",
    platform: ["api", "web"],
    status: "in-development",
    role: { en: "Architect and sole engineer", ar: null },
    // Timeframe not provided.
    summary: {
      en: "A platform that takes structured requirements and drives them through specialised generation and validation tracks toward production-oriented software systems. The control plane is exposed as a public API.",
      ar: null,
    },
    problem: {
      en: "Building a complete system means repeating the same backend, frontend, API, database, mobile, QA, security and DevOps work for every new product, with quality depending on who does it.",
      ar: null,
    },
    approach: {
      en: "Split the work into specialised factories behind a single control plane, each responsible for one part of the system, with validation steps between stages instead of a single end-to-end prompt.",
      ar: null,
    },
    architecture: {
      en: [
        "Backend Factory",
        "Frontend Factory",
        "API Contract Factory",
        "Database Factory",
        "Mobile Factory",
        "AI Factory",
        "QA Factory",
        "Security Factory",
        "DevOps Factory",
        "Control plane exposed at factory-api.nextnext-gen.com",
      ],
      ar: null,
    },
    features: {
      en: [
        "Structured analysis of requirements before generation",
        "Specialised generation tracks per system layer",
        "Validation steps between stages",
        "Orchestration across factories from a single control plane",
        "Public health endpoint for the control plane",
      ],
      ar: null,
    },
    technologies: ["Python", "FastAPI", "Docker", "Linux", "NGINX"],
    // No outcome claims: nothing has been independently verified.
    outcomes: { en: [], ar: null },
    screenshots: [],
    links: {
      api: "https://factory-api.nextnext-gen.com",
      docs: "https://factory-api.nextnext-gen.com/health",
    },
    featured: true,
    verified: false,
    status_note_runtime_version: "0.21.0",
    status: "draft",
    provenance: {
      sourceType: "project-documentation",
      source: "factory-api.nextnext-gen.com/health (runtime 0.21.0)",
    },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  } as CanonicalProject & { status_note_runtime_version: string },
  {
    id: "project-najmah",
    slug: "najmah",
    title: { en: "Najmah Story Studio", ar: "نجمة" },
    tagline: { en: "An Arabic-first AI story platform for children.", ar: null },
    category: "saas",
    platform: ["web"],
    status: "in-development",
    role: { en: "Architect and sole engineer", ar: null },
    summary: {
      en: "A platform for generating, saving and exporting Arabic-first children's stories with social-emotional learning themes, including PDF, text and narrated audio output.",
      ar: null,
    },
    problem: {
      en: "High-quality Arabic children's stories with an educational angle are hard to produce at the pace families and educators need.",
      ar: null,
    },
    approach: {
      en: "Combine an AI generation service with a product surface for creating, reading, saving and exporting stories in multiple formats.",
      ar: null,
    },
    architecture: {
      en: [
        "React + TypeScript + Vite front end",
        "Tailwind CSS and shadcn/ui interface layer",
        "NestJS backend",
        "Supabase for data and auth",
        "Dedicated AI service",
        "Docker and NGINX deployment",
      ],
      ar: null,
    },
    features: {
      en: [
        "Arabic-first story generation",
        "SEL-oriented story themes",
        "Story creation, saving and detail views",
        "PDF generation",
        "TXT download",
        "MP3 narration",
        "Illustration workflows",
      ],
      ar: null,
    },
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "shadcn/ui",
      "NestJS",
      "Supabase",
      "Docker",
      "NGINX",
    ],
    outcomes: { en: [], ar: null },
    screenshots: [],
    links: {},
    featured: true,
    verified: false,
    status: "draft",
    provenance: { sourceType: "project-documentation", source: "Najmah project sources" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  },
  {
    id: "project-nextnext-gen-hub",
    slug: "nextnext-gen-hub",
    title: { en: "nextnext-gen.com ecosystem hub", ar: null },
    tagline: { en: "The bilingual root site for a growing product ecosystem.", ar: null },
    category: "web",
    platform: ["web"],
    status: "in-development",
    role: { en: "Designer and engineer", ar: null },
    summary: {
      en: "The root domain of the ecosystem: a bilingual (EN/AR, RTL) portfolio and product hub built on a typed, data-driven content layer so products can later ship on their own subdomains.",
      ar: null,
    },
    problem: {
      en: "Projects, products and professional information were scattered with no single canonical source.",
      ar: null,
    },
    approach: {
      en: "A typed canonical content layer behind a single access API, with locale-prefixed routes and server-rendered SEO metadata.",
      ar: null,
    },
    architecture: {
      en: [
        "TanStack Start with locale-prefixed routes",
        "Typed canonical content layer with provenance and visibility",
        "Per-route SEO metadata, hreflang and JSON-LD",
        "Dark/light theming and full RTL support",
      ],
      ar: null,
    },
    features: {
      en: ["Bilingual EN/AR with RTL", "Dark and light themes", "Project and product detail pages", "Canonical content architecture"],
      ar: null,
    },
    technologies: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "TanStack Router"],
    outcomes: { en: [], ar: null },
    screenshots: [],
    links: { live: "https://nextnext-gen.com" },
    featured: false,
    verified: true,
    status: "verified",
    provenance: { sourceType: "portfolio", source: "this repository" },
    visibility: { public: true, portfolio: true, cv: false, linkedin: false },
  },
];

/**
 * Architecture maturity for the Factory is recorded separately so the
 * PROVEN / IMPLEMENTED-NOT-PROVEN / NOT-COMPLETE distinction is never lost.
 */
export const factoryMaturity = {
  projectId: "project-universal-ai-software-factory",
  runtimeVersionObserved: "0.21.0",
  controlPlane: "https://factory-api.nextnext-gen.com",
  healthEndpoint: "https://factory-api.nextnext-gen.com/health",
  claims: [
    { area: "Public control-plane health endpoint", state: "PROVEN" },
    { area: "Factory tracks (backend, frontend, API contract, database, mobile, AI, QA, security, DevOps)", state: "IMPLEMENTED_NOT_PROVEN" },
    { area: "Level 4 infrastructure", state: "NOT_COMPLETE" },
    { area: "Level 5", state: "NOT_COMPLETE" },
    { area: "Production AWS trust boundary", state: "NOT_COMPLETE" },
  ],
} as const;
