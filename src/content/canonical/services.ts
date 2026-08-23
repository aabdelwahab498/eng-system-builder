import type { CanonicalService } from "../schema";

const base = {
  status: "draft" as const,
  provenance: { sourceType: "user-provided" as const, source: "Phase 4 briefing" },
  visibility: { public: true, portfolio: true, cv: false, linkedin: true },
};

/**
 * Canonical services (Phase 4). Capability statements only — no clients,
 * teams, guarantees, SLAs, enterprise claims or pricing.
 */
export const services: CanonicalService[] = [
  {
    ...base,
    id: "service-backend-engineering",
    title: { en: "Backend Engineering", ar: null },
    summary: { en: "Backend services and APIs built with C#/.NET and ASP.NET Core.", ar: null },
    description: {
      en: "Design and implementation of backend services, data models and REST APIs, with explicit contracts and containerized deployment.",
      ar: null,
    },
    capabilities: { en: ["ASP.NET Core services", "REST API design", "Data modelling with EF Core"], ar: null },
    deliverables: { en: ["Backend service", "API contract", "Deployment setup"], ar: null },
    idealFor: { en: ["Products needing a reliable backend", "Teams replacing an ad-hoc API"], ar: null },
    relatedProjects: ["project-universal-ai-software-factory"],
  },
  {
    ...base,
    id: "service-fullstack-development",
    title: { en: "Full-Stack Development", ar: null },
    summary: { en: "End-to-end web applications with React, TypeScript and a .NET or Python backend.", ar: null },
    description: { en: "Building complete web applications from data model to interface, including state management, routing and deployment.", ar: null },
    capabilities: { en: ["React + TypeScript front ends", "Backend integration", "Responsive, bilingual interfaces"], ar: null },
    deliverables: { en: ["Working web application", "Source code", "Deployment setup"], ar: null },
    idealFor: { en: ["New products", "Rebuilds of existing web apps"], ar: null },
    relatedProjects: ["project-najmah", "project-nextnext-gen-hub"],
  },
  {
    ...base,
    id: "service-ai-integration",
    title: { en: "AI Integration", ar: null },
    summary: { en: "LLM features integrated into real product flows, not demos.", ar: null },
    description: { en: "Integration of language models into existing products: prompt and response handling, structured outputs, and service boundaries around the model.", ar: null },
    capabilities: { en: ["LLM integration", "Structured output handling", "AI service boundaries"], ar: null },
    deliverables: { en: ["AI-backed feature", "Service integration"], ar: null },
    idealFor: { en: ["Products adding their first AI feature"], ar: null },
    relatedProjects: ["project-najmah"],
  },
  {
    ...base,
    id: "service-ai-automation",
    title: { en: "AI Automation & Agents", ar: null },
    summary: { en: "Agent and automation workflows around existing systems.", ar: null },
    description: { en: "Design and implementation of agent workflows and automation pipelines that orchestrate steps across services.", ar: null },
    capabilities: { en: ["Agent workflows", "Task orchestration", "Automation pipelines"], ar: null },
    deliverables: { en: ["Automation workflow", "Orchestration service"], ar: null },
    idealFor: { en: ["Repetitive multi-step processes"], ar: null },
    relatedProjects: ["project-universal-ai-software-factory"],
  },
  {
    ...base,
    id: "service-api-development",
    title: { en: "API Development", ar: null },
    summary: { en: "Versioned, documented APIs with explicit contracts.", ar: null },
    description: { en: "API design and implementation: resource modelling, contracts, versioning and documentation.", ar: null },
    capabilities: { en: ["REST API design", "API contracts", "Documentation"], ar: null },
    deliverables: { en: ["API implementation", "Contract and docs"], ar: null },
    idealFor: { en: ["Products exposing data to clients or partners"], ar: null },
    relatedProjects: ["project-universal-ai-software-factory"],
  },
  {
    ...base,
    id: "service-software-architecture",
    title: { en: "Software Architecture", ar: null },
    summary: { en: "System design that stays understandable as the product grows.", ar: null },
    description: { en: "Architecture work: system decomposition, service boundaries, data flow and deployment topology.", ar: null },
    capabilities: { en: ["System decomposition", "Service boundaries", "Deployment topology"], ar: null },
    deliverables: { en: ["Architecture documentation", "Implementation plan"], ar: null },
    idealFor: { en: ["Systems outgrowing their original design"], ar: null },
    relatedProjects: ["project-universal-ai-software-factory"],
  },
  {
    ...base,
    id: "service-digital-product-development",
    title: { en: "Digital Product Development", ar: null },
    summary: { en: "From problem framing to a shipped digital product.", ar: null },
    description: { en: "Taking a product idea through scoping, architecture, implementation and deployment as a working digital product.", ar: null },
    capabilities: { en: ["Product scoping", "Implementation", "Deployment and iteration"], ar: null },
    deliverables: { en: ["Shipped product", "Source code", "Deployment setup"], ar: null },
    idealFor: { en: ["Founders building a first version"], ar: null },
    relatedProjects: ["project-najmah"],
  },
];
