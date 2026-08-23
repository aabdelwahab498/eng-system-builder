export type CaseStudySection = {
  heading: string;
  body: string;
  items?: string[];
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  description: string;
  technology: string[];
  status: string;
  featured: boolean;
  /** Configurable external product URL. Empty = no external link rendered. */
  externalUrl?: string;
  externalLabel?: string;
  accent?: string;
  caseStudy: {
    overview: string;
    problem: string;
    approach: string;
    architecture: string[];
    implementation: string;
    challenges: string;
    outcome: string;
    screenshots: { src: string; alt: string }[];
  };
};

const placeholder = "Details for this section will be documented as the work is published.";

export const projects: Project[] = [
  {
    slug: "najmah-ai-story-platform",
    name: "Najmah AI Story Platform",
    category: "AI Product",
    description:
      "An Arabic-first AI story platform focused on creating personalized children's stories and digital story experiences.",
    technology: ["React", "TypeScript", "NestJS", "Supabase", "AI services", "PDF", "Audio"],
    status: "Product",
    featured: true,
    externalUrl: "https://najmah.nextnext-gen.com",
    externalLabel: "Visit Product",
    caseStudy: {
      overview:
        "An Arabic-first AI story platform focused on creating personalized children's stories and digital story experiences.",
      problem: placeholder,
      approach: placeholder,
      architecture: [
        "React / TypeScript client",
        "NestJS application services",
        "Supabase data & storage layer",
        "AI generation services",
        "PDF and audio export pipeline",
      ],
      implementation: placeholder,
      challenges: placeholder,
      outcome: placeholder,
      screenshots: [],
    },
  },
  {
    slug: "universal-ai-software-factory",
    name: "Universal AI Software Factory",
    category: "Engineering System",
    description:
      "A production-oriented software factory designed to transform software requirements into structured software systems through specialized generation, validation, quality, and deployment workflows.",
    technology: ["ASP.NET Core", "C#", "Python", "FastAPI", "React", "TypeScript", "Docker", "Nginx"],
    status: "In development",
    featured: true,
    externalUrl: "https://factory-api.nextnext-gen.com",
    externalLabel: "Open Factory API",
    caseStudy: {
      overview:
        "A production-oriented software factory designed to transform software requirements into structured software systems through specialized generation, validation, quality, and deployment workflows.",
      problem: placeholder,
      approach:
        "Requirements are analyzed, then orchestrated through specialized factories for architecture, backend, frontend, database and AI, followed by quality, security and deployment workflows.",
      architecture: [
        "Requirement",
        "Project Analyzer",
        "Factory Orchestrator",
        "Architecture / Contracts",
        "Backend Factory",
        "Frontend Factory",
        "Database Factory",
        "AI Factory",
        "QA / Security / DevOps",
        "Production",
      ],
      implementation: placeholder,
      challenges: placeholder,
      outcome: placeholder,
      screenshots: [],
    },
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const factoryPipeline = [
  "Requirement",
  "Project Analyzer",
  "Factory Orchestrator",
  "Architecture / Contracts",
  "Backend Factory",
  "Frontend Factory",
  "Database Factory",
  "AI Factory",
  "QA / Security / DevOps",
  "Production",
];

export const factoryTechnology = [
  { area: "Backend", value: "ASP.NET Core / C#" },
  { area: "AI", value: "Python / FastAPI" },
  { area: "Frontend", value: "React / TypeScript" },
  { area: "Infrastructure", value: "Docker / Nginx" },
  { area: "Quality", value: "Automated validation / quality gates" },
];
