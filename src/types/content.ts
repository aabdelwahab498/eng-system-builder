export type Locale = "en" | "ar";

export const locales: Locale[] = ["en", "ar"];

export const isLocale = (value: unknown): value is Locale =>
  value === "en" || value === "ar";

export type MediaSlot = {
  kind: "placeholder" | "image";
  src?: string;
  alt: string;
  label?: string;
};

export type ExternalLink = {
  label: string;
  url: string;
};

export type CaseStudy = {
  overview: string;
  problem: string;
  approach: string;
  architecture: string[];
  implementation: string;
  challenges: string;
  outcome: string;
};

export type Offer = {
  id: string;
  label: string;
  price?: { amount: number; currency: string; interval?: "one-time" | "month" | "year" };
  checkoutUrl?: string;
  /** Provider-agnostic: no payment provider is assumed or integrated in V1. */
  provider?: string;
  licenseKind?: string;
};

export type Experience = {
  role: string;
  org?: string;
  period?: string;
  summary?: string;
  kind: "engineering" | "earlier";
};

export type Education = {
  credential: string;
  institution?: string;
  period?: string;
  note?: string;
};

export type Project = {
  slug: string;
  name: string;
  category: string;
  status: string;
  role?: string;
  scope?: string;
  disciplines?: string[];
  solution?: string;
  features?: string[];
  summary: string;
  tech: string[];
  featured: boolean;
  flagship?: boolean;
  links?: ExternalLink[];
  media: MediaSlot[];
  caseStudy: CaseStudy;
};

export type Product = {
  slug: string;
  name: string;
  kind: string;
  status: "available" | "live" | "beta" | "coming-soon" | "in-development";
  type?:
    | "saas"
    | "ai-tool"
    | "dev-tool"
    | "template"
    | "download"
    | "course"
    | "other";
  relatedProjectSlug?: string;
  /** Commerce shell only — V1 renders nothing from this. */
  offers?: Offer[];
  summary: string;
  description: string;
  price?: string;
  accessUrl?: string;
  subdomain?: string;
  features: string[];
  media: MediaSlot[];
};

export type SkillCategoryId =
  | "backend"
  | "frontend"
  | "mobile"
  | "ai"
  | "databases"
  | "devops"
  | "architecture";

export type SkillCategory = {
  id: SkillCategoryId;
  label: string;
  description: string;
  items: { name: string; note?: string; highlight?: boolean }[];
};

export type Service = {
  id: string;
  title: string;
  outcome: string;
  deliverables: string[];
  note?: string;
};

export type Profile = {
  displayName: string;
  positioning: string;
  statement: string;
  shortBio: string;
  longBio: string;
  philosophy: { title: string; body: string }[];
  focusAreas: string[];
  photo?: MediaSlot;
  location?: string;
  experience?: Experience[];
  education?: Education[];
  languages?: { language: string; level: string }[];
  cv?: { url: string; label: string; updated?: string };
};

export type ContactChannels = {
  email: string;
  linkedin: string;
  github: string;
  whatsapp: string;
  x: string;
  cv: string;
  availability: string;
};

export type FactoryContent = {
  title: string;
  tagline: string;
  what: string;
  problem: string;
  architecture: string[];
  capabilities: { title: string; body: string }[];
  categories: string[];
  quality: { title: string; body: string }[];
  vision: string;
  entryPoints: ExternalLink[];
};

export type UiStrings = {
  home: string;
  letsBuild: string;
  viewWork: string;
  viewProject: string;
  viewAllProjects: string;
  viewAllSkills: string;
  readMore: string;
  featuredProjects: string;
  products: string;
  skills: string;
  services: string;
  factory: string;
  contact: string;
  about: string;
  comingSoon: string;
  available: string;
  noProducts: string;
  contentPending: string;
  mediaPlaceholder: string;
  technology: string;
  status: string;
  category: string;
  overview: string;
  problem: string;
  approach: string;
  architecture: string;
  implementation: string;
  challenges: string;
  outcome: string;
  deliverables: string;
  entryPoints: string;
  capabilities: string;
  generatedCategories: string;
  quality: string;
  vision: string;
  switchLanguage: string;
  toggleTheme: string;
  openMenu: string;
  closeMenu: string;
  backHome: string;
  notFound: string;
  notFoundBody: string;
  ecosystemNote: string;
  downloadCv: string;
  availability: string;
  work: string;
  profile: string;
  connect: string;
  productsIntro: string;
  getAccess: string;
  elsewhere: string;
  selectedWork: string;
  howIWork: string;
  experience: string;
  earlierExperience: string;
  education: string;
  intent: string;
  intentHire: string;
  intentBuild: string;
  intentCollaborate: string;
  intentProduct: string;
  intentOther: string;
  startConversation: string;
  live: string;
  beta: string;
  inDevelopment: string;
  exploreFactory: string;
  filterBy: string;
  allCategories: string;
  noMatches: string;
  cv: string;
  cvIntro: string;
  cvVariantAts: string;
  cvVariantDesigned: string;
  printCv: string;
  phone: string;
  email: string;
  cvPendingFile: string;
  gallery: string;
  ourWorks: string;
  myWorks: string;
  breadcrumb: string;
  galleryIntro: string;
  noGallery: string;
  writing: string;
  latestWriting: string;
  viewAllWriting: string;
  courses: string;
  coursesIntro: string;
  noCourses: string;
  certificates: string;
  certificatesIntro: string;
  noCertificates: string;
  seeCertificates: string;
  searchPlaceholder: string;
  allTopics: string;
  relatedProjects: string;
  relatedServices: string;
  ctaTitle: string;
  ctaBody: string;
  idealFor: string;
  engineeringStack: string;
  stackIntro: string;
  whatIBuild: string;
  whatIBuildIntro: string;
  selectedWorkIntro: string;
  roleLabel: string;
  scopeLabel: string;
  projectType: string;
  videos: string;
  images: string;
  youtubeCtaTitle: string;
  youtubeCtaBody: string;
  youtubeCtaButton: string;

};

export type MetaKey =
  | "home"
  | "about"
  | "projects"
  | "products"
  | "skills"
  | "services"
  | "factory"
  | "contact"
  | "cv"
  | "courses"
  | "certificates";

export type Dictionary = {
  locale: Locale;
  dir: "ltr" | "rtl";
  htmlLang: string;
  nav: { label: string; path: string }[];
  ui: UiStrings;
  meta: Record<MetaKey, { title: string; description: string }>;
  profile: Profile;
  contact: ContactChannels;
  projects: Project[];
  products: Product[];
  skills: SkillCategory[];
  capabilityStrip: string[];
  services: Service[];
  factory: FactoryContent;
};
