/**
 * Admin/CMS shared types.
 *
 * These are the *storage projection* of the canonical content model in
 * `src/content/schema`. No new domain model is introduced: `data` payloads use
 * the canonical shapes, and the row columns carry the canonical `status`,
 * `visibility` and workflow metadata.
 */

export const CONTENT_KINDS = [
  "profile",
  "experience",
  "education",
  "skill_group",
  "project",
  "product",
  "service",
  "article",
  "announcement",
  "seo",
  "cv_settings",
  "social_draft",
  "gallery_item",
  "social_campaign",
  "marketing_campaign",
  "payment_method",
] as const;

export type ContentKind = (typeof CONTENT_KINDS)[number];

export const WORKFLOW_STATES = ["draft", "review", "scheduled", "published", "archived"] as const;

export type WorkflowState = (typeof WORKFLOW_STATES)[number];

export type ContentVisibility = {
  public: boolean;
  portfolio: boolean;
  cv: boolean;
  linkedin: boolean;
};

export type JsonValue =
  string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };

export type ContentItem<TData = JsonObject> = {
  id: string;
  kind: ContentKind;
  slug: string;
  state: WorkflowState;
  visibility: ContentVisibility;
  featured: boolean;
  sortOrder: number;
  data: TData;
  previousSlugs: string[];
  scheduledAt: string | null;
  publishedAt: string | null;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Localized field pair used by every editable entity. `ar: null` = translation required. */
export type LocalizedText = { en: string; ar: string | null };

export const emptyLocalized = (): LocalizedText => ({ en: "", ar: null });

export const hasArabic = (value: LocalizedText | undefined | null) =>
  Boolean(value && value.ar && value.ar.trim().length > 0);

/* ------------------------------------------------------------- payloads */

export type ArticleData = {
  title: LocalizedText;
  excerpt: LocalizedText;
  body: LocalizedText;
  coverImageUrl?: string;
  category?: string;
  tags: string[];
  seoTitle: LocalizedText;
  seoDescription: LocalizedText;
  canonicalUrl?: string;
};

export type AnnouncementData = {
  title: LocalizedText;
  message: LocalizedText;
  ctaLabel: LocalizedText;
  ctaUrl?: string;
  imageUrl?: string;
  placement: "banner" | "home" | "notification";
  priority: number;
  startsAt?: string | null;
  endsAt?: string | null;
};

export type SocialDraftData = {
  platform: "linkedin" | "facebook" | "instagram" | "x";
  content: string;
  link?: string;
  mediaUrl?: string;
  /** Local mirror of the workflow state used by the drafts board. */
  outcome: "draft" | "ready" | "scheduled" | "published" | "failed";
};

export type SeoData = {
  path: string;
  title: LocalizedText;
  description: LocalizedText;
  canonicalUrl?: string;
  ogTitle: LocalizedText;
  ogDescription: LocalizedText;
  ogImageUrl?: string;
  robots: "index, follow" | "noindex, follow" | "index, nofollow" | "noindex, nofollow";
};

export type CvSettingsData = {
  summary: LocalizedText;
  sections: { id: string; label: string; enabled: boolean }[];
  featuredProjectSlugs: string[];
};

export type GalleryItemData = {
  title: LocalizedText;
  caption: LocalizedText;
  mediaUrl: string;
  mediaType: "image" | "video";
  category: string;
  credit?: string;
  linkUrl?: string;
};

export type SocialCampaignData = {
  name: LocalizedText;
  objective: LocalizedText;
  platforms: string[];
  startsAt?: string | null;
  endsAt?: string | null;
  outcome: "draft" | "ready" | "scheduled" | "published";
  notes: LocalizedText;
};

export type MarketingCampaignData = {
  name: LocalizedText;
  channel: "email" | "search" | "social" | "content" | "other";
  audience: LocalizedText;
  message: LocalizedText;
  landingUrl?: string;
  startsAt?: string | null;
  endsAt?: string | null;
  outcome: "planned" | "running" | "paused" | "completed";
};

export type PaymentMethodData = {
  label: LocalizedText;
  provider: string;
  instructions: LocalizedText;
  /** Account handle / IBAN / link. Hidden in the admin UI unless revealed. */
  accountReference: string;
  currency: string;
  showOnSite: boolean;
};

/** Generic payload for canonical entities managed through the JSON editor. */
export type CanonicalPayload = JsonObject;

export type MediaAsset = {
  id: string;
  filename: string;
  storagePath: string;
  publicUrl: string;
  mimeType: string | null;
  sizeBytes: number | null;
  altEn: string | null;
  altAr: string | null;
  captionEn: string | null;
  captionAr: string | null;
  archived: boolean;
  createdAt: string;
};

export const KIND_LABELS: Record<ContentKind, string> = {
  profile: "Profile",
  experience: "Experience",
  education: "Education",
  skill_group: "Skills",
  project: "Projects",
  product: "Products",
  service: "Services",
  article: "Blog",
  announcement: "Announcements",
  seo: "SEO",
  cv_settings: "CV",
  gallery_item: "Gallery",
  social_campaign: "Social campaigns",
  marketing_campaign: "Marketing",
  payment_method: "Payments",
  social_draft: "Social",
};
