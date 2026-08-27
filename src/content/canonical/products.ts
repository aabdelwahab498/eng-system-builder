import type { CanonicalProduct } from "../schema";

/**
 * Canonical products (Phase 4).
 *
 * A product is something intended for users/customers — not every project is a
 * product. No pricing, no checkout links, no screenshots are invented; offers
 * stay empty and provider-agnostic in V1.
 */
export const products: CanonicalProduct[] = [
  {
    id: "product-najmah",
    slug: "najmah",
    name: { en: "Najmah", ar: "نجمة" },
    category: "ai-tool",
    lifecycle: "coming-soon",
    tagline: { en: "Arabic-first AI stories for children.", ar: null },
    summary: {
      en: "A story platform that generates Arabic-first children's stories with social-emotional learning themes, with PDF, text and narrated audio output.",
      ar: null,
    },
    description: {
      en: "Najmah is the product surface of the Najmah Story Studio project. Public availability and a public URL have not been confirmed yet, so it is listed as coming soon.",
      ar: null,
    },
    features: {
      en: [
        "Arabic-first story generation",
        "SEL-oriented themes",
        "PDF and TXT export",
        "MP3 narration",
        "Illustration workflows",
      ],
      ar: null,
    },
    technologies: ["React", "TypeScript", "NestJS", "Supabase", "Docker"],
    screenshots: [],
    relatedProjectId: "project-najmah",
    offers: [],
    status: "draft",
    provenance: { sourceType: "project-documentation", source: "Najmah project sources" },
    visibility: { public: true, portfolio: true, cv: false, linkedin: false },
  },
  {
    id: "product-factory-api",
    slug: "factory-api",
    name: { en: "Factory API", ar: null },
    category: "developer-tool",
    lifecycle: "in-development",
    tagline: { en: "The control plane of the Universal AI Software Factory.", ar: null },
    summary: {
      en: "The public API entry point of the Universal AI Software Factory. A health endpoint is publicly reachable; the wider capability surface is not published yet.",
      ar: null,
    },
    description: {
      en: "Factory API exposes the Factory control plane. Only the health endpoint is confirmed public at this stage; access model, documentation and capability surface are still being defined.",
      ar: null,
    },
    features: { en: ["Public health endpoint"], ar: null },
    technologies: ["Python", "FastAPI", "Docker", "NGINX"],
    screenshots: [],
    externalUrl: "https://factory-api.nextnext-gen.com",
    docsUrl: "https://factory-api.nextnext-gen.com/health",
    relatedProjectId: "project-universal-ai-software-factory",
    offers: [],
    status: "draft",
    provenance: {
      sourceType: "project-documentation",
      source: "factory-api.nextnext-gen.com/health",
    },
    visibility: { public: true, portfolio: true, cv: false, linkedin: false },
  },
];
