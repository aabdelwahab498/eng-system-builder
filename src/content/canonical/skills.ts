import type { Skill, SkillCategoryId, SkillGroup } from "../schema";

/**
 * Canonical skills (Phase 4).
 *
 * No percentages, no star ratings, no invented proficiency claims.
 * Depth is expressed through `emphasis` (primary/supporting) and a factual
 * `context` sentence. Every entry is user-provided unless it is also visible
 * in the project sources.
 */

type Input = {
  name: string;
  context: string;
  emphasis?: "primary" | "supporting";
  featured?: boolean;
  source?: "user-provided" | "project-documentation";
};

const skill = (category: SkillCategoryId, input: Input): Skill => ({
  name: input.name,
  category,
  context: { en: input.context, ar: null },
  emphasis: input.emphasis ?? "supporting",
  provenance: {
    sourceType: input.source ?? "user-provided",
    source: input.source === "project-documentation" ? "project sources" : "Phase 4 briefing",
  },
  featured: input.featured ?? false,
  portfolioVisible: true,
  cvVisible: true,
  linkedinVisible: true,
});

export const skillGroups: SkillGroup[] = [
  {
    id: "backend",
    category: "backend",
    label: { en: "Backend", ar: "الواجهة الخلفية" },
    description: { en: "Services, APIs and data access on the .NET stack.", ar: null },
    skills: [
      skill("backend", {
        name: "C#",
        context: "Primary backend language.",
        emphasis: "primary",
        featured: true,
      }),
      skill("backend", {
        name: ".NET",
        context: "Runtime and framework for backend services.",
        emphasis: "primary",
        featured: true,
      }),
      skill("backend", {
        name: "ASP.NET Core",
        context: "Used to build HTTP services and APIs.",
        emphasis: "primary",
        featured: true,
      }),
      skill("backend", {
        name: "Entity Framework Core",
        context: "Data access and migrations in .NET services.",
        emphasis: "primary",
      }),
      skill("backend", {
        name: "REST APIs",
        context: "Designing and implementing resource-based HTTP APIs.",
        emphasis: "primary",
        featured: true,
      }),
      skill("backend", {
        name: "API Architecture",
        context: "Contracts, versioning and service boundaries.",
        emphasis: "primary",
      }),
    ],
  },
  {
    id: "frontend",
    category: "frontend",
    label: { en: "Frontend", ar: "الواجهة الأمامية" },
    description: { en: "Web interfaces built with React and TypeScript.", ar: null },
    skills: [
      skill("frontend", {
        name: "TypeScript",
        context: "Default language for web application code.",
        emphasis: "primary",
        featured: true,
        source: "project-documentation",
      }),
      skill("frontend", { name: "JavaScript", context: "Used where TypeScript is not in place." }),
      skill("frontend", {
        name: "React",
        context: "Component model used across web projects.",
        emphasis: "primary",
        featured: true,
        source: "project-documentation",
      }),
      skill("frontend", {
        name: "Vite",
        context: "Build tooling for web applications.",
        source: "project-documentation",
      }),
      skill("frontend", { name: "HTML", context: "Semantic markup for web interfaces." }),
      skill("frontend", { name: "CSS", context: "Layout and styling fundamentals." }),
      skill("frontend", {
        name: "Tailwind CSS",
        context: "Utility-first styling in current web projects.",
        emphasis: "primary",
        source: "project-documentation",
      }),
      skill("frontend", { name: "Bootstrap", context: "Used in earlier web work." }),
    ],
  },
  {
    id: "mobile",
    category: "mobile",
    label: { en: "Mobile", ar: "تطبيقات الموبايل" },
    description: { en: "Cross-platform mobile applications.", ar: null },
    skills: [
      skill("mobile", {
        name: "Flutter",
        context: "Cross-platform mobile application development.",
        emphasis: "primary",
        featured: true,
      }),
      skill("mobile", {
        name: "Dart",
        context: "Language used with Flutter.",
        emphasis: "primary",
      }),
    ],
  },
  {
    id: "ai",
    category: "ai",
    label: { en: "AI Engineering", ar: "هندسة الذكاء الاصطناعي" },
    description: { en: "LLM integration, agents and automation inside real products.", ar: null },
    skills: [
      skill("ai", {
        name: "Python",
        context: "Used for AI services and tooling.",
        emphasis: "primary",
        featured: true,
      }),
      skill("ai", {
        name: "FastAPI",
        context: "HTTP layer for Python AI services.",
        emphasis: "primary",
      }),
      skill("ai", {
        name: "LLM integrations",
        context: "Language models integrated into product flows.",
        emphasis: "primary",
        featured: true,
        source: "project-documentation",
      }),
      skill("ai", {
        name: "AI Agents",
        context: "Agent workflows used inside the Factory pipeline.",
        emphasis: "primary",
        source: "project-documentation",
      }),
      skill("ai", {
        name: "AI Automation",
        context: "Automating multi-step generation and validation work.",
        source: "project-documentation",
      }),
      skill("ai", {
        name: "AI Orchestration",
        context: "Coordinating multiple AI steps and services.",
        source: "project-documentation",
      }),
      skill("ai", {
        name: "AI Video Production",
        context: "Producing cartoon episodes and product clips with generative video models.",
        emphasis: "primary",
        featured: true,
      }),
      skill("ai", {
        name: "Prompt Engineering",
        context: "Writing professional production prompts for text, image and video models.",
        emphasis: "primary",
        featured: true,
      }),
    ],
  },
  {
    id: "business",
    category: "business",
    label: { en: "Growth & Marketing", ar: "النمو والتسويق" },
    description: { en: "Getting the work in front of the right audience.", ar: null },
    skills: [
      skill("business", {
        name: "SEO",
        context: "Technical and content SEO for shipped web products.",
        emphasis: "primary",
        featured: true,
      }),
      skill("business", {
        name: "Social Media Ads",
        context: "Planning and running paid campaigns on Meta, LinkedIn and TikTok.",
        emphasis: "primary",
      }),
      skill("business", {
        name: "Content Distribution",
        context: "Publishing work across code, article, image and video platforms.",
      }),
    ],
  },

  {
    id: "databases",
    category: "databases",
    label: { en: "Databases", ar: "قواعد البيانات" },
    description: { en: "Relational data modelling and caching.", ar: null },
    skills: [
      skill("databases", {
        name: "SQL Server",
        context: "Relational database used with .NET services.",
        emphasis: "primary",
      }),
      skill("databases", {
        name: "PostgreSQL",
        context: "Relational database used in current projects.",
        emphasis: "primary",
        featured: true,
      }),
      skill("databases", {
        name: "Entity Framework Core",
        context: "ORM and migrations layer.",
        emphasis: "primary",
      }),
      skill("databases", { name: "Redis", context: "Caching and ephemeral state." }),
    ],
  },
  {
    id: "devops",
    category: "devops",
    label: { en: "DevOps & Infrastructure", ar: "البنية التحتية والتشغيل" },
    description: { en: "Containerized deployment and operation on Linux.", ar: null },
    skills: [
      skill("devops", {
        name: "Docker",
        context: "Containerizing services for deployment.",
        emphasis: "primary",
        featured: true,
        source: "project-documentation",
      }),
      skill("devops", {
        name: "Linux",
        context: "Host environment for deployed services.",
        emphasis: "primary",
      }),
      skill("devops", {
        name: "NGINX",
        context: "Reverse proxy and TLS termination.",
        emphasis: "primary",
        source: "project-documentation",
      }),
      skill("devops", {
        name: "Git",
        context: "Version control for all work.",
        emphasis: "primary",
      }),
      skill("devops", { name: "GitHub", context: "Repository hosting and collaboration." }),
      skill("devops", {
        name: "HTTPS / SSL",
        context: "Certificates and secure transport for public endpoints.",
      }),
      skill("devops", {
        name: "Reverse Proxy",
        context: "Routing public traffic to internal services.",
      }),
      skill("devops", {
        name: "Deployment",
        context: "Releasing and operating services in production.",
      }),
    ],
  },
  {
    id: "languages",
    category: "languages",
    label: { en: "Other Languages & Tools", ar: null },
    description: {
      en: "Additional languages and environments used outside the core stack.",
      ar: null,
    },
    skills: [
      skill("languages", { name: "C++", context: "Used in earlier programming work." }),
      skill("languages", { name: "Godot", context: "Used for game/interactive experiments." }),
    ],
  },
];
