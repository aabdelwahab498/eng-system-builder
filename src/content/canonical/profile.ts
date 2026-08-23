import type {
  Availability,
  Biography,
  CanonicalProfile,
  ContactChannel,
  DocumentRef,
  Identity,
  LocationInfo,
  Positioning,
  SocialLink,
  Tracked,
} from "../schema";

/**
 * Canonical profile (Phase 4).
 *
 * Every field is either user-provided, or derived from existing verified
 * project sources. Nothing here is invented. Arabic copy that has not been
 * authored/approved is `null` (= ARABIC COPY REQUIRED) and must not render.
 */

export const identity: Identity = {
  displayName: "Eng. Ahmed Abdelwahab",
  professionalName: "Ahmed Abdelwahab",
  shortName: "Ahmed",
  monogram: "AA",
};

/** Arabic personal name is user-provided and approved. */
export const arabicName = "أحمد عبد الوهاب";

export const positioning: Positioning = {
  primaryTitle: { en: "Software Engineer", ar: "مهندس برمجيات" },
  secondaryTitle: {
    en: "Full-Stack Developer · AI Product Builder",
    ar: null,
  },
  shortHeadline: {
    en: "Software Engineer · Full-Stack Developer · AI Product Builder",
    ar: null,
  },
  longHeadline: {
    en: "Building scalable software systems, AI-powered products, automation systems, and production-ready digital products.",
    ar: null,
  },
  professionalSummary: {
    en: "Software engineer working across backend engineering, full-stack web, AI engineering and mobile development. Works primarily with C#/.NET and ASP.NET Core, TypeScript and React, Python and FastAPI, and Flutter, with containerized deployment on Linux. Builds and operates his own systems, including the Universal AI Software Factory and the Najmah AI story platform.",
    ar: null,
  },
};

export const biography: Biography = {
  short: {
    en: "Software engineer building backend systems, AI-powered products and digital products end to end.",
    ar: null,
  },
  medium: {
    en: "Software engineer focused on backend services, full-stack web applications and AI-driven product features. Designs APIs and data models, integrates LLMs and agent workflows into real product flows, and deploys with Docker, Linux and NGINX. Also builds mobile applications with Flutter.",
    ar: null,
  },
  long: {
    en: "Software engineer working across backend engineering, full-stack web development, AI engineering, AI agents and automation, mobile development, software architecture, databases and DevOps. Current work centres on the Universal AI Software Factory — an AI-powered platform for analysing, generating, validating and orchestrating software systems — and Najmah, an Arabic-first AI story platform. Earlier professional experience was outside software engineering, in quality control, logistics and academic work, and informs how problems are framed and communicated.",
    ar: null,
  },
};

export const location: Tracked<LocationInfo> = {
  city: "Cairo",
  country: "Egypt",
  status: "verified",
  provenance: { sourceType: "user-provided", source: "Phase 4 briefing" },
  visibility: { public: true, portfolio: true, cv: true, linkedin: true },
};

export const availability: Availability = {
  state: "open",
  note: {
    en: "Open to software engineering, AI and product engineering work.",
    ar: null,
  },
};

export const contact: ContactChannel[] = [
  {
    kind: "email",
    value: "ahmedabdelwahab689@gmail.com",
    label: { en: "Email", ar: "البريد الإلكتروني" },
    status: "verified",
    provenance: { sourceType: "user-provided", source: "Phase 4 briefing" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  },
  {
    // Second address supplied in project context. Kept, not published, until
    // Ahmed confirms which address is the canonical public one.
    kind: "email",
    value: "aabdelwahab498@gmail.com",
    label: { en: "Secondary email", ar: null },
    status: "needs-verification",
    provenance: { sourceType: "user-provided", source: "recent project context" },
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
  },
  {
    kind: "phone",
    value: "01050064380",
    label: { en: "Phone", ar: "الهاتف" },
    status: "verified",
    provenance: { sourceType: "user-provided", source: "Phase 4 briefing" },
    // Private by default: never published without explicit approval.
    visibility: { public: false, portfolio: false, cv: true, linkedin: false },
  },
];

export const socialLinks: SocialLink[] = [
  {
    platform: "github",
    url: "https://github.com/aabdelwahab498",
    handle: "aabdelwahab498",
    status: "verified",
    provenance: { sourceType: "user-provided", source: "Phase 4 briefing" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  },
  {
    platform: "linkedin",
    url: "https://www.linkedin.com/in/ahmed-abdelwahab/",
    status: "verified",
    provenance: { sourceType: "user-provided", source: "Phase 4 briefing" },
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
  },
];

/** No approved CV file exists yet — the slot stays non-public. */
export const documents: DocumentRef[] = [
  {
    kind: "cv",
    url: "",
    label: { en: "Download CV", ar: "تحميل السيرة الذاتية" },
    status: "placeholder",
    provenance: { sourceType: "user-provided" },
    visibility: { public: false, portfolio: false, cv: false, linkedin: false },
  },
];

export const canonicalProfile: CanonicalProfile = {
  identity,
  positioning,
  biography,
  location,
  availability,
  contact,
  socialLinks,
  educationIds: [
    "edu-cairo-university-bsc",
    "edu-diploma-software-engineering",
    "edu-diploma-modern-education",
    "edu-diploma-digital-marketing",
  ],
  experienceIds: [
    "exp-software-engineering",
    "exp-faculty-member-cairo-university",
    "exp-chief-of-logistics-munisca",
    "exp-quality-control-petroleum",
  ],
  certificationIds: [],
  projectIds: ["project-universal-ai-software-factory", "project-najmah", "project-nextnext-gen-hub"],
  productIds: ["product-najmah", "product-factory-api"],
  serviceIds: [
    "service-backend-engineering",
    "service-fullstack-development",
    "service-ai-integration",
    "service-ai-automation",
    "service-api-development",
    "service-software-architecture",
    "service-digital-product-development",
  ],
  documents,
};
