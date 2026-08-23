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

export type Project = {
  slug: string;
  name: string;
  category: string;
  status: string;
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
  status: "available" | "coming-soon";
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
  | "devops";

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
  cv?: { url: string; label: string };
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
};

export type MetaKey =
  | "home"
  | "about"
  | "projects"
  | "products"
  | "skills"
  | "services"
  | "factory"
  | "contact";

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
