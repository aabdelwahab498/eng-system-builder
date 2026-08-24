import type { Dictionary } from "@/types/content";
import dalilMasryCover from "@/assets/projects/dalil-masry.png.asset.json";
import shifaTravelCover from "@/assets/projects/shifa-travel.png.asset.json";
import wameedhHubCover from "@/assets/projects/wameedh-hub.png.asset.json";
import indusB2BCover from "@/assets/projects/indusb2b.png.asset.json";

/**
 * English content source. Edit copy here — nothing is generated at runtime.
 * Empty strings are treated as "not provided" and are not rendered.
 */
export const en: Dictionary = {
  locale: "en",
  dir: "ltr",
  htmlLang: "en",

  nav: [
    { label: "About", path: "/about" },
    { label: "Gallery", path: "/gallery" },
    { label: "Services", path: "/services" },
    { label: "Blogs", path: "/blog" },
    { label: "Courses", path: "/courses" },
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
    ourWorks: "Our Works",
    myWorks: "My Works",
    breadcrumb: "Breadcrumb",
    galleryIntro: "Interfaces, systems and product visuals from the work.",
    noGallery: "No gallery items published yet.",
    writing: "Blogs",
    latestWriting: "Latest articles",
    viewAllWriting: "All articles",
    courses: "Courses",
    coursesIntro:
      "Practical engineering courses and learning tracks on backend, AI and product building.",
    noCourses: "No courses are published yet. Courses will appear here once they are ready.",
    certificates: "Certificates",
    certificatesIntro:
      "Professional certifications, credentials and verifiable qualifications.",
    noCertificates:
      "No certificates are published yet. Certificates will appear here once they are verified.",
    seeCertificates: "See my certificates",
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
      title: "Ahmed Abdelwahab — Software Engineer, Senior Full Stack Developer & AI, Product Builder",
      description:
        "Personal engineering hub of Ahmed Abdelwahab: full stack development, AI engineering, software architecture, mobile and web product development.",
    },
    about: {
      title: "About — Ahmed Abdelwahab",
      description:
        "How Ahmed Abdelwahab approaches software engineering, architecture and AI-driven product development.",
    },
    projects: {
      title: "Projects — Ahmed Abdelwahab",
      description:
        "Engineering projects and case studies: Najmah Story Studio and the Universal AI Software Factory.",
    },
    products: {
      title: "Products — Ahmed Abdelwahab",
      description:
        "Digital products built on the nextnext-gen ecosystem, each with its own subdomain and identity.",
    },
    skills: {
      title: "Skills & Technology Stack — Ahmed Abdelwahab",
      description:
        "Backend, frontend, mobile (Flutter/Dart), AI, databases and DevOps technologies used in production work.",
    },
    services: {
      title: "Services — Ahmed Abdelwahab",
      description:
        "Backend, web, mobile, AI, API integration, software architecture and digital product development services.",
    },
    factory: {
      title: "Universal AI Software Factory — Ahmed Abdelwahab",
      description:
        "An AI software engineering platform that turns structured requirements into validated, production-oriented software systems.",
    },
    contact: {
      title: "Contact — Ahmed Abdelwahab",
      description:
        "Get in touch about backend engineering, AI systems, mobile applications and digital product work.",
    },
    cv: {
      title: "CV — Ahmed Abdelwahab",
      description:
        "Curriculum vitae of Ahmed Abdelwahab: software engineering, full-stack development, AI engineering and product building.",
    },
    courses: {
      title: "Courses — Ahmed Abdelwahab",
      description:
        "Practical engineering courses and learning tracks on backend, AI systems and building production digital products.",
    },
    certificates: {
      title: "Certificates — Ahmed Abdelwahab",
      description:
        "Professional certifications and credentials of Ahmed Abdelwahab across software engineering, AI and cloud.",
    },
  },

  profile: {
    displayName: "Ahmed Abdelwahab",
    positioning: "Software Engineer · Senior Full Stack Developer & AI · Product Builder",
    statement:
      "I design and build production-ready software products across backend, frontend, mobile, AI and cloud infrastructure.",
    shortBio:
      "Software Engineer and Product Builder focused on backend engineering, AI-powered systems, full-stack applications, and scalable software architecture.",
    longBio:
      "Experienced with C#, .NET, ASP.NET Core, REST APIs, SQL, React, TypeScript, Python, FastAPI, Docker, and AI/LLM technologies. Strong interest in AI agents, automation, system design, API architecture, software quality, and reusable engineering platforms.\n\nCurrently developing the Universal AI Software Factory, an AI-powered engineering platform for analyzing, generating, validating, and orchestrating software projects across backend, frontend, mobile, AI, database, QA, security, and DevOps domains.",
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
      "Full Stack Systems",
      "AI Applications",
      "Mobile Applications",
      "APIs & Integrations",
      "Software Architecture",
      "Digital Products",
      "Video AI",
      "Cartoon AI",
    ],
    photo: { kind: "placeholder", alt: "Portrait of Ahmed Abdelwahab" },
    location: "Cairo, Egypt",
    cv: { url: "/cv-ahmed-abdelwahab.pdf", label: "Download CV" },
    experience: [
      {
        role: "Software Engineering & Product Development",
        kind: "engineering",
        summary:
          "Backend and full-stack development focused on scalable APIs, system architecture, data management, integrations, AI services, Docker-based deployment, and automated quality validation.",
      },
      {
        role: "Digital Marketing & Google Ads",
        kind: "earlier",
        summary:
          "Experience in digital marketing and performance advertising, combining technology with product thinking and user acquisition.",
      },
      {
        role: "Logistics & Operations",
        kind: "earlier",
        summary:
          "Previous operational experience that strengthened process optimization, planning, coordination, and structured problem solving.",
      },
    ],
    education: [
      {
        credential: "Bachelor of Engineering — Computer Science",
        institution: "Cairo University",
        period: "2020",
      },
      {
        credential: "Diploma — Software Engineering / Backend Development",
        period: "2020",
      },
      {
        credential: "Diploma — Basics of Modern Education",
        period: "2021",
      },
      {
        credential: "Diploma — Digital Marketing",
        period: "2022",
      },
    ],
    languages: [
      { language: "Arabic", level: "Native" },
      { language: "English", level: "Professional" },
      { language: "French", level: "B2" },
      { language: "German", level: "Developing" },
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
      category: "AI Product · Full-Stack Web Application",
      status: "Existing project",
      role: "Architect and sole engineer",
      scope: "Frontend, backend, data, AI services and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Frontend Engineering",
        "Backend Architecture",
        "AI Engineering",
        "Infrastructure",
      ],
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
      category: "AI Software Engineering Platform",
      status: "Active / evolving",
      role: "Architect and sole engineer",
      scope: "Platform architecture, AI orchestration, generation tracks and quality gates",
      disciplines: [
        "Software Architecture",
        "AI Engineering",
        "Backend Architecture",
        "Automation",
        "Infrastructure",
      ],
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
    {
      slug: "dalil-masry",
      name: "Dalil Masry — Egyptian Services Directory",
      category: "Web Platform · Directory & Marketplace",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, frontend, backend, data model and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Frontend Engineering",
        "Backend Architecture",
        "Product Design",
      ],
      summary:
        "An Arabic-first directory that brings services, clinics, shops and professional providers across Egypt into one searchable platform.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
      featured: true,
      links: [{ label: "Live preview", url: "https://dalil-masry-app.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: dalilMasryCover.url,
          alt: "Dalil Masry homepage with search filters and provider statistics",
        },
      ],
      caseStudy: {
        overview:
          "Dalil Masry is a bilingual directory where users search verified providers by sector, governorate, specialty or location, then compare ratings and prices before contacting them.",
        problem:
          "Finding trustworthy service providers in Egypt is fragmented across social pages and word of mouth, with no consistent structure, coverage or rating signal.",
        approach:
          "A single search surface backed by a normalized provider model: sectors, governorates, regions, specialties and reviews, with provider onboarding and a client dashboard.",
        architecture: [
          "React / TypeScript client",
          "Search & filtering layer",
          "Provider & sector data model",
          "Supabase auth, data and storage",
          "Provider onboarding workflow",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "shifa-travel",
      name: "Shifa Travel — Medical Tourism Platform",
      category: "Web Platform · Healthcare & Travel",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, frontend, backend, data model and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Frontend Engineering",
        "Backend Architecture",
        "Product Design",
      ],
      summary:
        "A bilingual medical-tourism platform connecting patients with accredited hospitals, doctors, treatment packages and end-to-end travel coordination.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
      featured: true,
      links: [{ label: "Live preview", url: "https://journey-cure-haven.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: shifaTravelCover.url,
          alt: "Shifa Travel homepage showing accredited doctors, treatment stats and consultation booking",
        },
      ],
      caseStudy: {
        overview:
          "Shifa Travel guides a patient from browsing treatments and accredited medical centers to booking a consultation, with travel, accommodation and follow-up handled in one journey.",
        problem:
          "Medical travel is scattered across brokers and chat threads: no verified provider data, no clear pricing packages and no continuity after the procedure.",
        approach:
          "One structured journey model: treatments, centers, doctors, packages and travel partners, plus a consultation request flow and a personal coordinator view.",
        architecture: [
          "React / TypeScript client",
          "Treatments, centers and doctors data model",
          "Packages and travel partner layer",
          "Consultation request workflow",
          "Supabase auth, data and storage",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "wameedh-hub",
      name: "Wameedh Hub — Learning & Professional Growth Platform",
      category: "Web Platform · Education & Coaching",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, frontend, backend, data model and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Frontend Engineering",
        "Backend Architecture",
        "Product Design",
      ],
      summary:
        "A bilingual educational platform offering courses, services and coaching to help professionals build confidence, sharpen skills and advance their careers.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
      featured: true,
      links: [{ label: "Live preview", url: "https://wameedhhub.com/" }],
      media: [
        {
          kind: "image",
          src: wameedhHubCover.url,
          alt: "Wameedh Hub homepage with courses, services and sign-up call to action",
        },
      ],
      caseStudy: {
        overview:
          "Wameedh Hub is a learning and professional growth platform that brings courses, coaching services and skill-building content into one bilingual experience with sign-up, theming and live social proof.",
        problem:
          "Aspiring professionals struggle to find structured learning paths and coaching in one place, with no clear progression from skill-building to practical application.",
        approach:
          "A unified landing and learning surface: a hero-driven conversion flow, course and service catalogs, authentication, a theme toggle and bilingual support, layered with live-engagement cues.",
        architecture: [
          "React / TypeScript client",
          "Courses and services data model",
          "Supabase auth, data and storage",
          "Bilingual (EN/AR) and theme switching",
          "Social-proof and engagement layer",
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
        { name: "C#", highlight: true },
        { name: ".NET", highlight: true },
        { name: "ASP.NET Core", highlight: true },
        { name: "EF Core" },
        { name: "REST APIs" },
        { name: "Authentication" },
        { name: "SQL Server" },
        { name: "PostgreSQL" },
        { name: "Redis" },
      ],
    },
    {
      id: "frontend",
      label: "Frontend",
      description: "Product interfaces built for clarity and performance.",
      items: [
        { name: "TypeScript", highlight: true },
        { name: "JavaScript" },
        { name: "React", highlight: true },
        { name: "Vite" },
        { name: "HTML5" },
        { name: "CSS3" },
        { name: "Tailwind CSS" },
        { name: "Bootstrap" },
      ],
    },
    {
      id: "ai",
      label: "AI",
      description: "AI integration and orchestration inside real products.",
      items: [
        { name: "Python", highlight: true },
        { name: "FastAPI", highlight: true },
        { name: "LLM Integration", highlight: true },
        { name: "AI Agents" },
        { name: "AI Automation" },
        { name: "AI Orchestration" },
      ],
    },
    {
      id: "mobile",
      label: "Mobile",
      description: "Cross-platform mobile applications.",
      items: [
        { name: "Flutter", highlight: true },
        { name: "Dart", highlight: true },
        { name: "Cross-platform Development" },
      ],
    },
    {
      id: "devops",
      label: "DevOps",
      description: "Deployment, runtime and operational structure.",
      items: [
        { name: "Docker", highlight: true },
        { name: "Linux" },
        { name: "NGINX" },
        { name: "Git" },
        { name: "GitHub" },
        { name: "HTTPS/SSL" },
        { name: "Reverse Proxy" },
        { name: "Containerized Deployment" },
      ],
    },
    {
      id: "architecture",
      label: "Architecture",
      description: "How systems stay coherent as products grow.",
      items: [
        { name: "System Design", highlight: true },
        { name: "API Contracts", highlight: true },
        { name: "Software Architecture" },
        { name: "Automated Testing" },
        { name: "Quality Gates" },
        { name: "Architecture Validation" },
      ],
    },
  ],

  capabilityStrip: [
    "Full-Stack Engineering",
    "AI Engineering",
    "Backend & APIs",
    "Frontend Engineering",
    "Mobile — Flutter",
    "Cloud & DevOps",
    "Software Architecture",
    "Product Building",
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
