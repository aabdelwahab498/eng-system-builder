import type { Experience } from "../schema";

/**
 * Canonical experience (Phase 4).
 *
 * Software engineering experience is separated from earlier professional and
 * academic experience. Old-CV entries are preserved as historical source
 * material with `sourceType: "cv"` and `status: "needs-verification"` — no
 * dates, employers, metrics or achievements are invented, and none of them are
 * rewritten as software-engineering work.
 */
export const experience: Experience[] = [
  {
    id: "exp-software-engineering",
    company: "Independent / self-directed",
    organizationType: "self",
    position: {
      en: "Software Engineer — full-stack, backend and AI systems",
      ar: null,
    },
    location: "Cairo, Egypt",
    // Start date not provided.
    current: true,
    description: {
      en: "Designs and builds backend services, web and mobile applications, and AI-driven systems, including the Universal AI Software Factory and the Najmah AI story platform.",
      ar: null,
    },
    responsibilities: {
      en: [
        "Design and implement backend services and REST APIs.",
        "Build full-stack web applications with React and TypeScript.",
        "Integrate LLMs, AI agents and automation into product flows.",
        "Deploy and operate services with Docker, Linux and NGINX.",
      ],
      ar: null,
    },
    achievements: { en: [], ar: null },
    technologies: [
      "C#",
      ".NET",
      "ASP.NET Core",
      "TypeScript",
      "React",
      "Python",
      "FastAPI",
      "Flutter",
      "PostgreSQL",
      "Docker",
      "NGINX",
    ],
    category: "engineering",
    verified: false,
    status: "draft",
    provenance: { sourceType: "project-documentation", source: "nextnext-gen.com project sources" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  },
  {
    id: "exp-faculty-member-cairo-university",
    company: "Cairo University — Logistics Department",
    organizationType: "academic",
    position: { en: "Faculty Member", ar: null },
    // Dates not provided; old CV states a duration of 3 years.
    current: false,
    description: { en: "Academic work in the Logistics Department. Duration stated in the old CV as 3 years; exact dates not provided.", ar: null },
    responsibilities: { en: [], ar: null },
    achievements: { en: [], ar: null },
    technologies: [],
    category: "academic",
    verified: false,
    status: "needs-verification",
    provenance: { sourceType: "cv", source: "old CV (unverified)" },
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
  },
  {
    id: "exp-chief-of-logistics-munisca",
    company: "United Nations (MUNISCA)",
    organizationType: "government",
    position: { en: "Chief of Logistics", ar: null },
    current: false,
    description: { en: "Logistics role. Duration stated in the old CV as 2 years; exact dates not provided.", ar: null },
    responsibilities: { en: [], ar: null },
    achievements: { en: [], ar: null },
    technologies: [],
    category: "operations",
    verified: false,
    status: "needs-verification",
    provenance: { sourceType: "cv", source: "old CV (unverified)" },
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
  },
  {
    id: "exp-quality-control-petroleum",
    company: "Coop. Company — petroleum field",
    organizationType: "company",
    position: { en: "Quality Control Specialist", ar: null },
    current: false,
    description: { en: "Quality control role in the petroleum field. Duration stated in the old CV as 3 years; exact dates not provided.", ar: null },
    responsibilities: { en: [], ar: null },
    achievements: { en: [], ar: null },
    technologies: [],
    category: "operations",
    verified: false,
    status: "needs-verification",
    provenance: { sourceType: "cv", source: "old CV (unverified)" },
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
  },
];
