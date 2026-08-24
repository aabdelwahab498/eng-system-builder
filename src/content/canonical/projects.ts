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
    id: "project-nextnext-gen-hub",
    slug: "nextnext-gen-hub",
    title: { en: "nextnext-gen.com ecosystem hub", ar: null },
    tagline: { en: "The bilingual root site for a growing product ecosystem.", ar: null },
    category: "web",
    platform: ["web"],
    lifecycle: "in-development",
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
