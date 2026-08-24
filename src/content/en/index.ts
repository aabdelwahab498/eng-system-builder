import type { Dictionary } from "@/types/content";

/**
 * English content source. Edit copy here — nothing is generated at runtime.
 * Empty strings are treated as "not provided" and are not rendered.
 */
export const en: Dictionary = {
  locale: "en",
  dir: "ltr",
  htmlLang: "en",

  nav: [
    { label: "Work", path: "/projects" },
    { label: "Services", path: "/services" },
    { label: "Writing", path: "/blog" },
    { label: "Gallery", path: "/gallery" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ],


  ui: {
    home: "Home",
    letsBuild: "Let's Build",
    viewWork: "View Work",
    viewProject: "View Project",
    viewAllProjects: "All projects",
    viewAllSkills: "Full technology stack",
    readMore: "Read more",
    featuredProjects: "Featured Projects",
    products: "Products",
    skills: "Skills",
    services: "Services",
    factory: "Universal AI Software Factory",
    contact: "Contact",
    about: "About",
    comingSoon: "Coming Soon",
    available: "Available",
    noProducts:
      "No products are published yet. Product listings appear here once they are ready.",
    contentPending: "Copy for this section is being finalized.",
    mediaPlaceholder: "Media placeholder — not a product screenshot",
    technology: "Technology",
    status: "Status",
    category: "Category",
    overview: "Overview",
    problem: "Problem",
    approach: "Approach",
    architecture: "Architecture",
    implementation: "Implementation",
    challenges: "Challenges",
    outcome: "Outcome",
    deliverables: "Deliverables",
    entryPoints: "Public entry points",
    capabilities: "Capabilities",
    generatedCategories: "Generated application categories",
    quality: "Quality & validation",
    vision: "Product vision",
    switchLanguage: "العربية",
    toggleTheme: "Toggle theme",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    backHome: "Back to home",
    notFound: "Page not found",
    notFoundBody: "This route doesn't exist in the ecosystem.",
    ecosystemNote:
      "nextnext-gen.com is the root of a growing product ecosystem. Products ship on their own subdomains with independent identities.",
    downloadCv: "Download CV",
    availability: "Availability",
    work: "Work",
    profile: "Profile",
    connect: "Connect",
    productsIntro: "Digital products from the nextnext-gen ecosystem.",
    getAccess: "Get access",
    elsewhere: "Elsewhere",
    selectedWork: "Selected Work",
    howIWork: "How I Work",
    experience: "Experience",
    earlierExperience: "Earlier Experience",
    education: "Education",
    intent: "What is this about?",
    intentHire: "Hire me",
    intentBuild: "Build something",
    intentCollaborate: "Collaborate",
    intentProduct: "Discuss a product",
    intentOther: "Something else",
    startConversation: "Start the conversation",
    live: "Live",
    beta: "Beta",
    inDevelopment: "In development",
    exploreFactory: "Explore the Factory",
    filterBy: "Filter",
    allCategories: "All",
    noMatches: "No entries match this filter.",
    cv: "CV",
    cvIntro: "Generated from the canonical profile. Print or save as PDF.",
    cvVariantAts: "ATS version",
    cvVariantDesigned: "Designed version",
    printCv: "Print / Save as PDF",
    phone: "Phone",
    email: "Email",
    cvPendingFile: "A downloadable PDF file has not been published yet.",
    gallery: "Gallery",
    galleryIntro: "Interfaces, systems and product visuals from the work.",
    noGallery: "No gallery items published yet.",
    writing: "Writing",
    latestWriting: "Latest articles",
    viewAllWriting: "All articles",
    searchPlaceholder: "Search articles",
    allTopics: "All topics",
    relatedProjects: "Related projects",
    relatedServices: "Related services",
    ctaTitle: "Have a project in mind?",
    ctaBody: "Tell me what you are building and I will tell you how I would engineer it.",
    idealFor: "Ideal for",
    engineeringStack: "Engineering Stack",
    stackIntro: "The technologies I design, build and ship production software with.",
    whatIBuild: "What I Build",
    whatIBuildIntro:
      "Complete software products — architecture, APIs, interfaces, mobile apps, AI systems and production infrastructure.",
    selectedWorkIntro: "Real systems, products and engineering work.",
    roleLabel: "Role",
    scopeLabel: "Scope",
    projectType: "Project type",

  },

  meta: {
    home: {
      title: "Eng. Ahmed Abdelwahab — Software Engineer, Senior Full Stack Developer & AI, Product Builder",
      description:
        "Personal engineering hub of Ahmed Abdelwahab: full stack development, AI engineering, software architecture, mobile and web product development.",
    },
    about: {
      title: "About — Eng. Ahmed Abdelwahab",
      description:
        "How Ahmed Abdelwahab approaches software engineering, architecture and AI-driven product development.",
    },
    projects: {
      title: "Projects — Eng. Ahmed Abdelwahab",
      description:
        "Engineering projects and case studies: Najmah Story Studio and the Universal AI Software Factory.",
    },
    products: {
      title: "Products — Eng. Ahmed Abdelwahab",
      description:
        "Digital products built on the nextnext-gen ecosystem, each with its own subdomain and identity.",
    },
    skills: {
      title: "Skills & Technology Stack — Eng. Ahmed Abdelwahab",
      description:
        "Backend, frontend, mobile (Flutter/Dart), AI, databases and DevOps technologies used in production work.",
    },
    services: {
      title: "Services — Eng. Ahmed Abdelwahab",
      description:
        "Backend, web, mobile, AI, API integration, software architecture and digital product development services.",
    },
    factory: {
      title: "Universal AI Software Factory — Eng. Ahmed Abdelwahab",
      description:
        "An AI software engineering platform that turns structured requirements into validated, production-oriented software systems.",
    },
    contact: {
      title: "Contact — Eng. Ahmed Abdelwahab",
      description:
        "Get in touch about backend engineering, AI systems, mobile applications and digital product work.",
    },
    cv: {
      title: "CV — Eng. Ahmed Abdelwahab",
      description:
        "Curriculum vitae of Ahmed Abdelwahab: software engineering, full-stack development, AI engineering and product building.",
    },
  },

  profile: {
    displayName: "Eng. Ahmed Abdelwahab",
    positioning: "Software Engineer · Senior Full Stack Developer & AI · Product Builder",
    statement:
      "Engineering full stack systems, AI-powered applications and digital products — from architecture to production.",
    shortBio: "",
    longBio: "",
    philosophy: [
      {
        title: "Architecture first",
        body: "Systems are designed so they remain understandable as the product grows.",
      },
      {
        title: "Contracts over assumptions",
        body: "Interfaces between services are explicit, versioned and testable.",
      },
      {
        title: "Product, not code",
        body: "Work is measured by a usable product in production, not isolated components.",
      },
      {
        title: "Quality gates",
        body: "Validation, tests and review steps are part of the pipeline, not an afterthought.",
      },
    ],
    focusAreas: [
      "Backend Systems",
      "AI Applications",
      "Mobile Applications",
      "APIs & Integrations",
      "Software Architecture",
      "Digital Products",
    ],
    photo: { kind: "placeholder", alt: "Portrait of Eng. Ahmed Abdelwahab" },
    cv: { url: "/cv-ahmed-abdelwahab.pdf", label: "Download CV" },
    experience: [
      {
        role: "Software Engineer — full stack, backend and AI systems",
        kind: "engineering",
        summary:
          "Designing and building backend services, web and mobile applications, and AI-driven systems, including the Universal AI Software Factory.",
      },
      { role: "Digital marketing", kind: "earlier" },
      { role: "Teaching and academic work", kind: "earlier" },
      { role: "Logistics", kind: "earlier" },
      { role: "Quality control", kind: "earlier" },
    ],
    education: [
      {
        credential: "Bachelor of Engineering — Computer Science",
        institution: "Cairo University",
        period: "2016",
      },
      { credential: "Software engineering and backend development studies" },
      { credential: "Digital marketing studies" },
    ],
  },

  contact: {
    email: "",
    linkedin: "https://www.linkedin.com/in/ahmed-abdelwahab-5686102aa/",
    github: "",
    whatsapp: "",
    x: "",
    cv: "",
    availability: "Open to backend, AI and product engineering work.",
  },

  projects: [
    {
      slug: "najmah",
      name: "Najmah Story Studio",
      category: "AI-powered web application",
      status: "Existing project",
      summary:
        "An Arabic-first AI application for creating personalized stories and digital story experiences.",
      tech: ["React", "TypeScript", "NestJS", "Supabase", "AI services", "PDF", "Audio"],
      featured: true,
      links: [],
      media: [
        { kind: "placeholder", alt: "Najmah Story Studio interface", label: "Screenshot slot" },
      ],
      caseStudy: {
        overview:
          "Najmah Story Studio is an AI-powered product for generating personalized, Arabic-first stories and turning them into shareable digital experiences.",
        problem:
          "Arabic-language story creation for children is underserved by generic AI tools, which handle right-to-left text, tone and cultural context poorly.",
        approach:
          "The product is structured around a generation pipeline: input, story generation, review, and export into digital formats.",
        architecture: [
          "React / TypeScript client",
          "NestJS application services",
          "Supabase data & storage layer",
          "AI generation services",
          "Export pipeline (PDF / audio)",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "universal-ai-software-factory",
      name: "Universal AI Software Factory",
      category: "AI software engineering platform",
      status: "Active / evolving",
      summary:
        "A platform that transforms structured software requirements into validated, production-oriented software systems through specialized generation and quality workflows.",
      tech: ["ASP.NET Core", "C#", "Python", "FastAPI", "React", "TypeScript", "Docker", "Nginx"],
      featured: true,
      flagship: true,
      links: [],
      media: [
        { kind: "placeholder", alt: "Factory pipeline visualization", label: "Diagram slot" },
      ],
      caseStudy: {
        overview:
          "The Factory is developer infrastructure: it takes a requirement, analyzes it, and orchestrates specialized factories that produce architecture, backend, frontend, database and AI layers under continuous validation.",
        problem:
          "AI code generation produces fragments. Turning a requirement into a coherent, validated system still requires architecture, contracts, quality gates and deployment structure.",
        approach:
          "Requirements are analyzed, then orchestrated through specialized factories, followed by quality, security and delivery workflows.",
        architecture: [
          "Requirement intake",
          "Project analyzer",
          "Factory orchestrator",
          "Architecture & contracts",
          "Backend factory",
          "Frontend factory",
          "Database factory",
          "AI factory",
          "Quality, security & delivery",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
  ],

  products: [],

  skills: [
    {
      id: "backend",
      label: "Backend",
      description: "Services, business logic, persistence and integrations.",
      items: [
        { name: ".NET", highlight: true },
        { name: "C#", highlight: true },
        { name: "ASP.NET Core", highlight: true },
        { name: "NestJS" },
        { name: "FastAPI" },
        { name: "REST APIs" },
        { name: "Background jobs" },
      ],
    },
    {
      id: "frontend",
      label: "Frontend",
      description: "Product interfaces built for clarity and performance.",
      items: [
        { name: "React", highlight: true },
        { name: "TypeScript", highlight: true },
        { name: "Vite" },
        { name: "Tailwind CSS" },
        { name: "shadcn/ui" },
      ],
    },
    {
      id: "mobile",
      label: "Mobile",
      description: "Cross-platform mobile applications.",
      items: [
        { name: "Flutter", highlight: true },
        { name: "Dart", highlight: true },
        { name: "Mobile architecture" },
        { name: "App delivery" },
      ],
    },
    {
      id: "ai",
      label: "AI",
      description: "AI integration and orchestration inside real products.",
      items: [
        { name: "AI orchestration", highlight: true },
        { name: "Model integration" },
        { name: "Prompt systems" },
        { name: "AI services" },
      ],
    },
    {
      id: "databases",
      label: "Databases",
      description: "Data modeling, persistence and query design.",
      items: [
        { name: "SQL Server" },
        { name: "PostgreSQL" },
        { name: "Supabase" },
        { name: "Redis" },
        { name: "SQL" },
      ],
    },
    {
      id: "devops",
      label: "DevOps / Infrastructure",
      description: "Deployment, runtime and operational structure.",
      items: [
        { name: "Docker", highlight: true },
        { name: "Nginx" },
        { name: "Linux" },
        { name: "Git" },
        { name: "CI pipelines" },
      ],
    },
  ],

  capabilityStrip: [
    ".NET / C#",
    "ASP.NET Core",
    "Python",
    "Flutter / Dart",
    "React",
    "TypeScript",
    "SQL",
    "AI Systems",
    "Docker",
    "Software Architecture",
  ],

  services: [
    {
      id: "backend",
      title: "Backend Development",
      outcome: "Reliable services and business logic that hold up in production.",
      deliverables: ["Service design", "Business logic", "Persistence layer", "Integrations"],
    },
    {
      id: "web",
      title: "Web Application Development",
      outcome: "Complete web applications from interface to backend.",
      deliverables: ["Application UI", "State & data layer", "Auth flows", "Release setup"],
    },
    {
      id: "mobile",
      title: "Mobile Application Development",
      outcome: "Cross-platform mobile apps built with Flutter and Dart.",
      deliverables: ["App architecture", "Feature implementation", "API integration", "Store delivery"],
    },
    {
      id: "ai",
      title: "AI / AI-powered Applications",
      outcome: "AI capabilities embedded into products, not bolted on.",
      deliverables: ["AI orchestration", "Model integration", "Prompt systems", "Evaluation loops"],
    },
    {
      id: "integration",
      title: "API & System Integration",
      outcome: "Systems that talk to each other through explicit contracts.",
      deliverables: ["API design", "Third-party integration", "Contract documentation", "Error handling"],
    },
    {
      id: "architecture",
      title: "Software Architecture",
      outcome: "Structure that survives product growth and team changes.",
      deliverables: ["System design", "Contracts & boundaries", "Technical review", "Migration paths"],
    },
    {
      id: "product",
      title: "Digital Product Development",
      outcome: "From idea to a released, maintainable product.",
      deliverables: ["Scoping", "Architecture", "Implementation", "Deployment"],
    },
  ],

  factory: {
    title: "Universal AI Software Factory",
    tagline: "From structured requirements to validated software systems.",
    what:
      "The Universal AI Software Factory is an AI software engineering platform. It takes a structured software requirement and drives it through specialized generation, validation and delivery workflows until it becomes a coherent system rather than a set of code fragments.",
    problem:
      "General-purpose AI code generation produces isolated snippets. What real products need is architecture, explicit contracts, consistent layers, validation and a delivery path. The Factory exists to make that end-to-end path repeatable.",
    architecture: [
      "Requirement intake",
      "Project analyzer",
      "Factory orchestrator",
      "Architecture & contracts",
      "Backend factory",
      "Frontend factory",
      "Database factory",
      "AI factory",
      "Quality, security & delivery",
    ],
    capabilities: [
      {
        title: "Requirement analysis",
        body: "Structured requirements are parsed into a project model before any generation happens.",
      },
      {
        title: "Contract-first architecture",
        body: "Architecture and interfaces are produced first, so every generated layer targets the same contracts.",
      },
      {
        title: "Specialized factories",
        body: "Backend, frontend, database and AI layers are generated by dedicated workflows instead of one generic prompt.",
      },
      {
        title: "Validation workflows",
        body: "Generated output passes through validation and quality gates before it is considered complete.",
      },
      {
        title: "Delivery structure",
        body: "Containerization and deployment structure are part of the output, not a separate manual step.",
      },
    ],
    categories: [
      "Business web applications",
      "API & backend services",
      "AI-powered applications",
      "Data-driven dashboards",
      "Integration services",
    ],
    quality: [
      {
        title: "Contract validation",
        body: "Generated layers are checked against the architecture contracts they were built from.",
      },
      {
        title: "Automated checks",
        body: "Build, type and structural checks run as gates inside the pipeline.",
      },
      {
        title: "Security review steps",
        body: "Security-oriented review is a defined stage of the workflow.",
      },
    ],
    vision:
      "The Factory is evolving into a product: a controlled environment where a requirement becomes a validated, deployable system, with the engineering discipline made explicit instead of implicit.",
    entryPoints: [],
  },
};
