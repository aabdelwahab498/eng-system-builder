import type { Dictionary } from "@/types/content";
import dalilMasryCover from "@/assets/projects/dalil-masry.png.asset.json";
import shifaTravelCover from "@/assets/projects/shifa-travel.png.asset.json";
import wameedhHubCover from "@/assets/projects/wameedh-hub.png.asset.json";
import indusB2BCover from "@/assets/projects/indusb2b.png.asset.json";
import aureaClinicCover from "@/assets/projects/aurea-clinic.png.asset.json";
import maisonParfumCover from "@/assets/projects/maison-parfum.png.asset.json";
import stockHubCover from "@/assets/projects/stockhub.png.asset.json";
import wameedOsCover from "@/assets/projects/wameed-os.png.asset.json";
import digitalOpsConsoleCover from "@/assets/projects/digital-ops-console.png.asset.json";
import scriptoriaArCover from "@/assets/projects/scriptoria-ar.png.asset.json";
import devShieldNexusCover from "@/assets/projects/dev-shield-nexus.png.asset.json";


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
    {
      slug: "indusb2b",
      name: "IndusB2B — Industrial B2B Marketplace",
      category: "Web Platform · Commerce & Market Data",
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
        "An Arabic-first B2B industrial commerce platform for construction materials and tools — catalog search, supplier comparison, RFQ workflows and a daily commodity price ticker.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
      featured: true,
      links: [{ label: "Live preview", url: "https://grand-shelf-sync.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: indusB2BCover.url,
          alt: "IndusB2B homepage with category cards, supplier comparison tools and a steel prices ticker",
        },
      ],
      caseStudy: {
        overview:
          "IndusB2B is a B2B commerce surface where buyers search a consolidated catalog of construction materials and industrial tools, compare suppliers on price, availability and delivery, request quotes and track daily market prices.",
        problem:
          "Industrial procurement in Egypt runs on phone calls, paper quotes and scattered supplier catalogs — no consolidated search, no price transparency and no structured supplier comparison.",
        approach:
          "A single catalog across many suppliers, a comparison layer on price/availability/delivery, an RFQ workflow with a 24-hour response target, and a daily-updated commodity price tracker for steel, cement and related materials.",
        architecture: [
          "React / TypeScript client",
          "Consolidated catalog and supplier data model",
          "Supplier comparison layer (price, availability, delivery)",
          "RFQ workflow with response target",
          "Daily commodity price ticker",
          "Supabase auth, data and storage",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "aurea-clinic-os",
      name: "Aurea Clinic OS — Aesthetic Clinic Management",
      category: "Web Platform · Healthcare Operations",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, frontend, backend, data model and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Product Design",
        "Backend Architecture",
        "Data Visualization",
      ],
      summary:
        "An operations system for aesthetic clinics — leads and CRM, patients, appointments, treatment plans, sessions, billing, campaigns and analytics in one workspace.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Recharts"],
      featured: true,
      links: [{ label: "Live preview", url: "https://clinic-artistry-os.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: aureaClinicCover.url,
          alt: "Aurea Clinic OS dashboard with lead, revenue and appointment metrics and conversion charts",
        },
      ],
      caseStudy: {
        overview:
          "Aurea Clinic OS gives an aesthetic clinic one workspace for the full patient lifecycle: capture a lead, convert it to a patient, plan treatments, book sessions, invoice and measure results.",
        problem:
          "Clinics run on spreadsheets, WhatsApp threads and paper files — no shared pipeline, no revenue visibility and no reliable link between marketing spend and converted patients.",
        approach:
          "A role-aware workspace built around a CRM pipeline, a clinical record (patients, treatment plans, sessions), a billing layer, and a dashboard that ties leads and revenue together over a rolling 12 months.",
        architecture: [
          "React / TypeScript client with a persistent workspace shell",
          "Lead pipeline and CRM stages",
          "Patient records, treatment plans and session tracking",
          "Billing, invoices and campaign modules",
          "Before/after media library",
          "Supabase auth, row-level security and data",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "maison-parfum",
      name: "Maison Parfum — Luxury Fragrance E-Commerce",
      category: "Web Platform · E-Commerce",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, storefront, cart and checkout flow, backend and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Frontend Engineering",
        "E-Commerce Architecture",
        "Brand & Product Design",
      ],
      summary:
        "A bilingual luxury fragrance storefront with curated collections for him, her and all, a custom perfume builder, cart and account flows, and an editorial brand aesthetic.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
      featured: true,
      links: [{ label: "Live preview", url: "https://perfume-joy-store.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: maisonParfumCover.url,
          alt: "Maison Parfum storefront hero with a perfume bottle and collection cards for him, her and all",
        },
      ],
      caseStudy: {
        overview:
          "Maison Parfum is a premium fragrance storefront: curated catalog, gendered collections, a 'create your perfume' path, cart and checkout, plus EN/AR switching and light/dark themes.",
        problem:
          "Small fragrance brands sell through social DMs with no catalog structure, no reliable cart and no bilingual storefront that matches the perceived value of the product.",
        approach:
          "An editorial storefront where typography and imagery carry the brand, backed by a structured catalog, a configurable custom-perfume flow and a conventional cart/account layer.",
        architecture: [
          "React / TypeScript storefront",
          "Product catalog and collection taxonomy",
          "Custom perfume configuration flow",
          "Cart, account and order state",
          "Bilingual EN/AR with theme switching",
          "Supabase auth, data and storage",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "stockhub",
      name: "StockHub — Inventory Management System",
      category: "Web Platform · Operations & Inventory",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, frontend, backend, data model and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Backend Architecture",
        "Product Design",
        "Data Modeling",
      ],
      summary:
        "An Arabic-first warehouse and inventory system — product management with categories and pricing, stock movement tracking for inbound and outbound, and smart low-stock alerts.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
      featured: true,
      links: [{ label: "Live preview", url: "https://prod-warden.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: stockHubCover.url,
          alt: "StockHub Arabic hero with feature cards for smart alerts, stock tracking and product management",
        },
      ],
      caseStudy: {
        overview:
          "StockHub manages products, stock levels and warehouse movements in one Arabic-first interface, with alerts that fire automatically when an item drops below its reorder threshold.",
        problem:
          "Small distributors track stock in spreadsheets: quantities drift from reality, movements are unlogged, and shortages are discovered only when an order cannot be fulfilled.",
        approach:
          "A movement-ledger data model where every inbound and outbound entry adjusts stock, plus per-product minimum thresholds that drive automatic alerts and a bilingual RTL/LTR interface.",
        architecture: [
          "React / TypeScript client with RTL-first layout",
          "Product catalog with categories and pricing",
          "Stock movement ledger (inbound / outbound)",
          "Threshold-based low-stock alerting",
          "Authentication and role-aware access",
          "Supabase auth, data and storage",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "wameed-os",
      name: "Wameed OS — CRM & HR Business Operating System",
      category: "Web Platform · CRM & HR",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, frontend, backend, data model and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Backend Architecture",
        "Product Design",
        "Data Modeling",
      ],
      summary:
        "A unified business operating system combining CRM pipeline, lead and client management, HR, project tracking, payments, campaigns and an AI assistant in one bilingual dashboard.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
      featured: true,
      links: [{ label: "Live preview", url: "https://wameed-flow-hub.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: wameedOsCover.url,
          alt: "Wameed OS dashboard with revenue, project and lead KPI cards, revenue chart and project-types donut",
        },
      ],
      caseStudy: {
        overview:
          "Wameed OS is a single workspace that consolidates CRM, HR and project operations — a dashboard that surfaces revenue, active projects, pending payments and team earnings alongside a CRM pipeline, leads and clients, projects, payments, kanban, campaigns, wallets, academy, performance, automations and an AI assistant.",
        problem:
          "Growing teams run sales, people and project operations across disconnected spreadsheets and tools, so revenue, leads and team performance are never visible from one place.",
        approach:
          "A role-aware dashboard built around a shared data model: every lead, client, project, payment and team member links back to a single source, with KPI cards, charts and lists that update from the same records, plus an automations engine and AI assistant to reduce manual work.",
        architecture: [
          "React / TypeScript dashboard client",
          "CRM pipeline, leads and clients data model",
          "HR: team earnings, performance and feedback modules",
          "Projects, payments, wallets and kanban tracking",
          "Campaigns, academy and knowledge base modules",
          "Automations engine and AI assistant",
          "Supabase auth, data and storage with role-aware access",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "digital-ops-console",
      name: "Digital Operations Console — Projects, Clients & AI Command Center",
      category: "Web Platform · Operations & Automation",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, frontend, backend, multi-tenant data model and deployment",
      disciplines: [
        "Full-Stack Engineering",
        "Backend Architecture",
        "DevOps & Infrastructure",
        "AI Automation",
      ],
      summary:
        "A multi-tenant digital operations command center that unifies project, client, infrastructure, automation and AI-solution management behind JWT-ready auth and Dockerized deployment — a single console to run operations at scale.",
      tech: ["React", "TypeScript", "Docker", "JWT", "PostgreSQL", "Automation", "AI"],
      featured: true,
      links: [{ label: "Live preview", url: "https://digitaloperations-pro.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: digitalOpsConsoleCover.url,
          alt: "Digital Operations Console hero with command-center headline, teal console buttons and a futuristic dashboard illustration",
        },
      ],
      caseStudy: {
        overview:
          "Digital Operations Console is a SaaS-grade command center that consolidates projects, clients, infrastructure, automation and AI solutions into one multi-tenant, JWT-ready, Dockerized platform — surfacing 17 active projects, 99.98% uptime and 44k automation runs from a single dashboard.",
        problem:
          "Engineering and operations teams juggle projects, clients, servers, automations and AI workloads across disconnected tools, so infrastructure health, client delivery and automation throughput are never visible together.",
        approach:
          "A multi-tenant console built around a shared operations graph: every project, client, server, automation run and AI solution links to one tenant-scoped data model, with a real-time dashboard of KPIs, an automations engine, and AI-solution orchestration — all behind JWT auth and containerized for repeatable deployment.",
        architecture: [
          "React / TypeScript console client with dark command-center UI",
          "Multi-tenant data model with JWT-ready authentication",
          "Dockerized deployment for portable, repeatable releases",
          "Projects, clients and infrastructure inventory modules",
          "Automation engine tracking runs and throughput",
          "AI-solution orchestration and management layer",
          "Real-time KPI dashboard (uptime, active projects, automation runs)",
        ],
        implementation: "",
        challenges: "",
        outcome: "",
      },
    },
    {
      slug: "scriptoria-ar",
      name: "Scriptoria — Arabic AI Creator Studio",
      category: "AI Platform · Content & Media",
      status: "Live preview",
      role: "Architect and sole engineer",
      scope: "Product design, frontend, backend, AI orchestration and deployment",
      disciplines: [
        "AI Engineering",
        "Full-Stack Engineering",
        "Product Design",
        "Arabic NLP",
      ],
      summary:
        "An Arabic-first AI studio that turns a short brief into a ready-to-publish video ad, social reel or YouTube script — handling the script, the Arabic dialect, the voice and the visuals end-to-end.",
      tech: ["React", "TypeScript", "Tailwind CSS", "AI", "Text-to-Speech", "Arabic NLP", "Vite"],
      featured: true,
      links: [{ label: "Live preview", url: "https://scriptoria-ar.lovable.app/" }],
      media: [
        {
          kind: "image",
          src: scriptoriaArCover.url,
          alt: "Scriptoria Arabic AI Creator Studio dashboard with a 'What do you want to create today?' hero and video-ad, social-reel and YouTube format cards",
        },
      ],
      caseStudy: {
        overview:
          "Scriptoria is an Arabic-first AI creator studio that produces short-form video ads, social reels and long-form YouTube scripts from a brief — writing the script, choosing the Arabic dialect, generating the voice and assembling the visuals in one workflow, with a creator-mode workspace, AI identity, voice studio and automations.",
        problem:
          "Arabic content creators need a tool that handles the whole production pipeline — script, dialect, voice and visuals — in one place, instead of stitching together separate tools that don't respect Arabic dialects and pronunciation.",
        approach:
          "A studio workspace that takes a format and a brief, then runs a guarded, dialect-aware generation pipeline: a Prompt Guardian fixes the brief before generation, an AI brain and voice layer produce dialect-accurate scripts and narration, and a visual assembly step turns it into a publishable video.",
        architecture: [
          "React / TypeScript studio client with creator and studio modes",
          "Format-first flows: video ad (20–30s), social reel (15–45s), YouTube (3–10 min)",
          "AI identity layer: AI avatar, voice, brain, characters and brand",
          "8 Arabic dialects with an accurate-Arabic pronunciation dictionary",
          "Prompt Guardian that cleans and enforces the brief before generation",
          "Voice studio and text-to-speech narration pipeline",
          "Automations and content factory for repeatable production",
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
