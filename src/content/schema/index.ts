/**
 * Canonical content schema (Phase 3).
 *
 * Locale-agnostic domain model that the future portfolio, CV and LinkedIn
 * surfaces all read from. No UI depends on these types yet — they exist so the
 * content layer can migrate to them without redesigning components.
 */

export type Locale = "en" | "ar";

/** Arabic is authored, never machine-duplicated. `null` = ARABIC COPY REQUIRED. */
export type Localized<T> = { en: T; ar: T | null };

export type ContentStatus =
  | "verified"
  | "draft"
  | "needs-verification"
  | "placeholder"
  | "private"
  | "deprecated";

export type SourceType =
  | "github"
  | "linkedin"
  | "cv"
  | "user-provided"
  | "project-documentation"
  | "portfolio"
  | "other";

export type Provenance = {
  source?: string;
  sourceType: SourceType;
  /** ISO date; present only once the fact was confirmed by Ahmed. */
  verifiedAt?: string;
};

export type Visibility = {
  public: boolean;
  portfolio: boolean;
  cv: boolean;
  linkedin: boolean;
};

export type Tracked<T> = T & {
  status: ContentStatus;
  provenance: Provenance;
  visibility: Visibility;
};

/** Only these states may ever reach production UI. */
export const PUBLISHABLE_STATUSES: ContentStatus[] = ["verified", "draft"];

export const isPublishable = <T,>(item: Tracked<T>): boolean =>
  PUBLISHABLE_STATUSES.includes(item.status) && item.visibility.public;

/* ---------------------------------------------------------------- profile */

export type Identity = {
  displayName: string;
  professionalName: string;
  shortName: string;
  monogram: string;
};

export type Positioning = {
  primaryTitle: Localized<string>;
  secondaryTitle: Localized<string>;
  shortHeadline: Localized<string>;
  longHeadline: Localized<string>;
  professionalSummary: Localized<string>;
};

export type Biography = {
  short: Localized<string>;
  medium: Localized<string>;
  long: Localized<string>;
};

export type LocationInfo = {
  city?: string;
  country?: string;
  timezone?: string;
  relocation?: boolean;
  remote?: boolean;
};

export type Availability = {
  state: "open" | "selective" | "unavailable";
  note: Localized<string>;
};

export type ContactChannel = Tracked<{
  kind: "email" | "phone" | "whatsapp" | "form";
  value: string;
  label: Localized<string>;
}>;

export type SocialLink = Tracked<{
  platform: "github" | "linkedin" | "x" | "youtube" | "medium" | "other";
  url: string;
  handle?: string;
}>;

export type DocumentRef = Tracked<{
  kind: "cv" | "other";
  url: string;
  label: Localized<string>;
  updated?: string;
}>;

export type CanonicalProfile = {
  identity: Identity;
  positioning: Positioning;
  biography: Biography;
  location: Tracked<LocationInfo>;
  availability: Availability;
  contact: ContactChannel[];
  socialLinks: SocialLink[];
  educationIds: string[];
  experienceIds: string[];
  certificationIds: string[];
  projectIds: string[];
  productIds: string[];
  serviceIds: string[];
  documents: DocumentRef[];
};

/* ------------------------------------------------------------- experience */

export type ExperienceCategory =
  | "engineering"
  | "product"
  | "academic"
  | "operations"
  | "marketing"
  | "other";

export type OrganizationType =
  | "company"
  | "startup"
  | "agency"
  | "academic"
  | "government"
  | "self";

export type Experience = Tracked<{
  id: string;
  company: string;
  organizationType: OrganizationType;
  position: Localized<string>;
  location?: string;
  startDate?: string;
  endDate?: string;
  current: boolean;
  description: Localized<string>;
  responsibilities: Localized<string[]>;
  achievements: Localized<string[]>;
  technologies: string[];
  category: ExperienceCategory;
  verified: boolean;
}>;

/* -------------------------------------------------------------- education */

export type Education = Tracked<{
  id: string;
  institution: string;
  degree: Localized<string>;
  field: Localized<string>;
  startDate?: string;
  endDate?: string;
  graduationDate?: string;
  description?: Localized<string>;
  verified: boolean;
}>;

export type Certification = Tracked<{
  id: string;
  name: Localized<string>;
  issuer: string;
  issuedAt?: string;
  credentialUrl?: string;
  verified: boolean;
}>;

/* ----------------------------------------------------------------- skills */

export type SkillCategoryId =
  | "backend"
  | "frontend"
  | "mobile"
  | "ai"
  | "databases"
  | "devops"
  | "languages"
  | "tools"
  | "business";

/** No percentages, ever. Labels only when explicitly confirmed. */
export type ProficiencyLabel = "working" | "production" | "primary";

export type Skill = {
  name: string;
  category: SkillCategoryId;
  /** One factual sentence describing how the skill is actually used. */
  context: Localized<string>;
  proficiencyLabel?: ProficiencyLabel;
  featured: boolean;
  portfolioVisible: boolean;
  cvVisible: boolean;
  linkedinVisible: boolean;
};

export type SkillGroup = {
  id: SkillCategoryId;
  category: SkillCategoryId;
  label: Localized<string>;
  description: Localized<string>;
  skills: Skill[];
};

/* --------------------------------------------------------------- projects */

export type ProjectCategory =
  | "web"
  | "backend"
  | "frontend"
  | "mobile"
  | "ai"
  | "saas"
  | "infrastructure"
  | "digital-product";

export type ProjectStatus =
  | "live"
  | "beta"
  | "in-development"
  | "coming-soon"
  | "archived";

export type MediaRef = {
  kind: "placeholder" | "image";
  src?: string;
  alt: Localized<string>;
  label?: Localized<string>;
};

export type CanonicalProject = Tracked<{
  id: string;
  slug: string;
  title: Localized<string>;
  tagline: Localized<string>;
  category: ProjectCategory;
  platform: string[];
  status: ProjectStatus;
  role: Localized<string>;
  timeframe?: string;
  summary: Localized<string>;
  problem: Localized<string>;
  approach: Localized<string>;
  architecture: Localized<string[]>;
  features: Localized<string[]>;
  technologies: string[];
  /** Verified statements only — no metrics without a source. */
  outcomes: Localized<string[]>;
  screenshots: MediaRef[];
  links: { repo?: string; live?: string; docs?: string; api?: string };
  featured: boolean;
  verified: boolean;
}>;

/* --------------------------------------------------------------- products */

export type ProductCategory =
  | "saas"
  | "ai-tool"
  | "developer-tool"
  | "template"
  | "digital-download"
  | "course"
  | "other";

export type ProductStatus = "live" | "beta" | "in-development" | "coming-soon";

/** Provider-agnostic. V1 is display-only: no checkout, no keys, no processing. */
export type Offer = {
  id: string;
  name: Localized<string>;
  price?: number;
  currency?: string;
  billing?: "one-time" | "month" | "year";
  checkoutUrl?: string;
  provider?: string;
  active: boolean;
};

export type CanonicalProduct = Tracked<{
  id: string;
  slug: string;
  name: Localized<string>;
  category: ProductCategory;
  status: ProductStatus;
  tagline: Localized<string>;
  summary: Localized<string>;
  description: Localized<string>;
  features: Localized<string[]>;
  technologies: string[];
  screenshots: MediaRef[];
  externalUrl?: string;
  demoUrl?: string;
  docsUrl?: string;
  relatedProjectId?: string;
  offers: Offer[];
}>;

/* --------------------------------------------------------------- services */

export type CanonicalService = Tracked<{
  id: string;
  title: Localized<string>;
  summary: Localized<string>;
  description: Localized<string>;
  capabilities: Localized<string[]>;
  deliverables: Localized<string[]>;
  idealFor: Localized<string[]>;
  relatedProjects: string[];
}>;

/* --------------------------------------------------------------------- cv */

export type CvVariant =
  | "general"
  | "backend-dotnet"
  | "ai"
  | "fullstack"
  | "mobile-flutter";

export type CvDocument = {
  variant: CvVariant;
  locale: Locale;
  profile: CanonicalProfile;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: SkillGroup[];
  projects: CanonicalProject[];
  certifications: Certification[];
  selectedProjects: string[];
  links: SocialLink[];
};

/* --------------------------------------------------------------- linkedin */

export type LinkedInContent = {
  headline: string;
  about: string;
  experienceBlurbs: Record<string, string>;
  projectBlurbs: Record<string, string>;
  featured: { title: string; url: string; note?: string }[];
};

/* ---------------------------------------------------------------- helpers */

/** Resolve a localized value; returns null when the Arabic copy is missing. */
export const pick = <T,>(value: Localized<T>, locale: Locale): T | null =>
  locale === "ar" ? value.ar : value.en;

/** Resolve with English fallback — use only where a gap must not break the UI. */
export const pickOrEn = <T,>(value: Localized<T>, locale: Locale): T =>
  (locale === "ar" ? (value.ar ?? value.en) : value.en);
