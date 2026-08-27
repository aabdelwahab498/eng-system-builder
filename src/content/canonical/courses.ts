import type { Localized } from "../schema";

/**
 * Canonical courses (Phase 5).
 *
 * Practical engineering courses and learning tracks authored from Ahmed's
 * real expertise. Each course links to the /courses route until a dedicated
 * detail page exists. No invented metrics, durations or pricing.
 */

export type CourseLevel = "foundations" | "intermediate" | "advanced";

export type Course = {
  id: string;
  /** Stable slug used in the URL once detail pages exist. */
  slug: string;
  /** lucide-react icon name resolved by the UI. */
  icon: string;
  level: CourseLevel;
  /** When false the course is listed in search but shown as Coming Soon. */
  ready: boolean;
  order: number;
  title: Localized<string>;
  summary: Localized<string>;
  description: Localized<string>;
  /** Keywords used to match the quick search beyond title/summary. */
  keywords: Localized<string[]>;
};

export const courses: Course[] = [
  {
    id: "course-backend-engineering",
    slug: "backend-engineering",
    icon: "Server",
    level: "intermediate",
    ready: false,
    order: 1,
    title: {
      en: "Backend Engineering with ASP.NET Core",
      ar: "هندسة الواجهة الخلفية بـ ASP.NET Core",
    },
    summary: {
      en: "Build production backend services and REST APIs with ASP.NET Core and EF Core.",
      ar: "بناء خدمات الواجهة الخلفية وواجهات REST API بـ ASP.NET Core و EF Core.",
    },
    description: {
      en: "From data modelling to deployment: design services, write explicit API contracts and ship containerized ASP.NET Core backends.",
      ar: "من نمذجة البيانات حتى النشر: تصميم الخدمات وكتابة عقود API واضحة وتسليم خدمات ASP.NET Core داخل حاويات.",
    },
    keywords: {
      en: ["C#", ".NET", "ASP.NET Core", "EF Core", "REST API", "backend"],
      ar: ["سي شارب", "دوت نت", "ASP.NET Core", "EF Core", "REST API", "الواجهة الخلفية"],
    },
  },
  {
    id: "course-ai-llm-integration",
    slug: "ai-llm-integration",
    icon: "BrainCircuit",
    level: "intermediate",
    ready: false,
    order: 2,
    title: { en: "AI & LLM Integration", ar: "دمج الذكاء الاصطناعي و LLM" },
    summary: {
      en: "Integrate language models into real product flows with structured outputs.",
      ar: "دمج نماذج اللغة داخل مسارات المنتج بالمخرجات المنظمة.",
    },
    description: {
      en: "Prompt and response handling, structured output parsing, and service boundaries around the model — not demos.",
      ar: "إدارة المدخلات والمخرجات وتحليل المخرجات المنظمة وحدود الخدمة حول النموذج — لا عروض تجريبية.",
    },
    keywords: {
      en: ["LLM", "AI", "prompt", "structured output", "agents"],
      ar: ["LLM", "الذكاء الاصطناعي", "البرومبت", "المخرجات المنظمة", "الوكلاء"],
    },
  },
  {
    id: "course-fullstack-development",
    slug: "fullstack-development",
    icon: "Layers",
    level: "intermediate",
    ready: false,
    order: 3,
    title: { en: "Full-Stack Development", ar: "التطوير المتكامل Full-Stack" },
    summary: {
      en: "End-to-end web apps with React, TypeScript and a .NET or Python backend.",
      ar: "تطبيقات ويب متكاملة بـ React و TypeScript وباك اند .NET أو Python.",
    },
    description: {
      en: "State management, routing, backend integration and deployment for complete web applications.",
      ar: "إدارة الحالة والمسارات وربط الباك اند والنشر لتطبيقات ويب متكاملة.",
    },
    keywords: {
      en: ["React", "TypeScript", "full-stack", "web app"],
      ar: ["رياكت", "تايب سكريبت", "متكامل", "تطبيق ويب"],
    },
  },
  {
    id: "course-api-design",
    slug: "api-design",
    icon: "Webhook",
    level: "intermediate",
    ready: false,
    order: 4,
    title: { en: "API Design & Contracts", ar: "تصميم الواجهات البرمجية والعقود" },
    summary: {
      en: "Versioned, documented APIs with explicit contracts.",
      ar: "واجهات برمجية موثقة ومرقّمة بعقود واضحة.",
    },
    description: {
      en: "Resource modelling, contracts, versioning and documentation for APIs that stay maintainable.",
      ar: "نمذجة الموارد والعقود والترقيم والتوثيق لواجهات تبقى قابلة للصيانة.",
    },
    keywords: {
      en: ["REST", "API", "contracts", "documentation"],
      ar: ["REST", "API", "العقود", "التوثيق"],
    },
  },
  {
    id: "course-software-architecture",
    slug: "software-architecture",
    icon: "Network",
    level: "advanced",
    ready: false,
    order: 5,
    title: { en: "Software Architecture & System Design", ar: "معمارية البرمجيات وتصميم الأنظمة" },
    summary: {
      en: "System design that stays understandable as the product grows.",
      ar: "تصميم أنظمة يبقى مفهومًا مع نمو المنتج.",
    },
    description: {
      en: "System decomposition, service boundaries, data flow and deployment topology.",
      ar: "تفكيك النظام وحدود الخدمات وتدفق البيانات وطوبولوجيا النشر.",
    },
    keywords: {
      en: ["architecture", "system design", "microservices", "scalability"],
      ar: ["المعمارية", "تصميم الأنظمة", "الخدمات المصغرة", "التوسّع"],
    },
  },
];
