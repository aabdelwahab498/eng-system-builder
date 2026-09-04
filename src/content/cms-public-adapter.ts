/**
 * CMS-First Public Content Adapter & Caching Layer (Phase 1A Corrected)
 *
 * Explicitly distinguishes three CMS states per content kind:
 * 1. "initialized" (CMS contains entries for this kind): CMS is authoritative.
 *    Returns published entries (or [] if Admin unpublished all items). Fallbacks are NOT resurrected.
 * 2. "uninitialized" (CMS has 0 total entries for this kind): Fallback to Backend API / Static.
 * 3. "error" (CMS unavailable / network error): Fallback to Backend API / Static.
 */

import type {
  CaseStudy,
  Education,
  Experience,
  ExternalLink,
  Locale,
  MediaSlot,
  Product,
  Project,
  Service,
  SkillCategory,
} from "@/types/content";
import { getPublicKindState, type CmsKindStatus } from "@/lib/cms/public.functions";
import type { ContentItem } from "@/lib/cms/types";

interface CmsCacheEntry<T> {
  status: CmsKindStatus;
  data: T[];
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 1000; // 1 minute cache TTL

const projectsCmsCache = new Map<string, CmsCacheEntry<Project>>();
const servicesCmsCache = new Map<string, CmsCacheEntry<Service>>();
const productsCmsCache = new Map<string, CmsCacheEntry<Product>>();
const skillsCmsCache = new Map<string, CmsCacheEntry<SkillCategory>>();
const experienceCmsCache = new Map<string, CmsCacheEntry<Experience>>();
const educationCmsCache = new Map<string, CmsCacheEntry<Education>>();

function pickLocalized(val: unknown, locale: Locale): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    const arVal = obj["ar"];
    if (locale === "ar" && typeof arVal === "string" && arVal.trim() !== "") {
      return arVal;
    }
    const enVal = obj["en"];
    if (typeof enVal === "string" && enVal.trim() !== "") {
      return enVal;
    }
  }
  return "";
}

function pickArrayLocalized(val: unknown, locale: Locale): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((v) => pickLocalized(v, locale)).filter(Boolean);
  }
  return [];
}

/* ------------------------------------------------------------- Mappers */

function mapCmsItemToProject(item: ContentItem, locale: Locale): Project {
  const d = item.data;
  const cs = (d["caseStudy"] as Record<string, unknown>) ?? {};

  const rawLinks = Array.isArray(d["links"]) ? d["links"] : [];
  const links: ExternalLink[] = rawLinks
    .map((l: unknown) => {
      if (typeof l === "object" && l !== null) {
        const obj = l as Record<string, unknown>;
        const label = pickLocalized(obj["label"], locale) || String(obj["label"] || "");
        const url = typeof obj["url"] === "string" ? obj["url"] : "";
        if (label && url) return { label, url };
      }
      return null;
    })
    .filter((l): l is ExternalLink => l !== null);

  const rawMedia = Array.isArray(d["media"]) ? d["media"] : [];
  const media: MediaSlot[] = rawMedia
    .map((m: unknown) => {
      if (typeof m === "object" && m !== null) {
        const obj = m as Record<string, unknown>;
        const kind = obj["kind"] === "image" ? "image" : "placeholder";
        const alt = pickLocalized(obj["alt"], locale) || String(obj["alt"] || "");
        const src = typeof obj["src"] === "string" ? obj["src"] : undefined;
        const label = pickLocalized(obj["label"], locale) || undefined;
        return { kind, alt, ...(src ? { src } : {}), ...(label ? { label } : {}) };
      }
      return null;
    })
    .filter((m): m is MediaSlot => m !== null);

  const caseStudy: CaseStudy = {
    overview: pickLocalized(cs["overview"], locale),
    problem: pickLocalized(cs["problem"], locale),
    approach: pickLocalized(cs["approach"], locale),
    architecture: pickArrayLocalized(cs["architecture"], locale),
    implementation: pickLocalized(cs["implementation"], locale),
    challenges: pickLocalized(cs["challenges"], locale),
    outcome: pickLocalized(cs["outcome"], locale),
  };

  const role = pickLocalized(d["role"], locale);
  const scope = pickLocalized(d["scope"], locale);
  const solution = pickLocalized(d["solution"], locale);
  const flagship = Boolean(d["flagship"]);

  return {
    slug: item.slug,
    name: pickLocalized(d["name"] || d["title"], locale) || item.slug,
    category: pickLocalized(d["category"], locale) || "Engineering",
    status: pickLocalized(d["status"], locale) || "Production",
    disciplines: pickArrayLocalized(d["disciplines"], locale),
    features: pickArrayLocalized(d["features"], locale),
    summary: pickLocalized(d["summary"] || d["description"], locale),
    tech: Array.isArray(d["tech"]) ? (d["tech"] as string[]).filter((t) => typeof t === "string") : [],
    featured: item.featured,
    media,
    caseStudy,
    ...(role ? { role } : {}),
    ...(scope ? { scope } : {}),
    ...(solution ? { solution } : {}),
    ...(flagship ? { flagship: true } : {}),
    ...(links.length > 0 ? { links } : {}),
  };
}

function mapCmsItemToService(item: ContentItem, locale: Locale): Service {
  const d = item.data;
  const note = pickLocalized(d["note"], locale);
  return {
    id: item.slug || item.id,
    title: pickLocalized(d["title"] || d["name"], locale) || item.slug,
    outcome: pickLocalized(d["outcome"] || d["summary"] || d["description"], locale),
    deliverables: pickArrayLocalized(d["deliverables"], locale),
    ...(note ? { note } : {}),
  };
}

const VALID_PRODUCT_STATUSES = new Set<Product["status"]>([
  "available",
  "live",
  "beta",
  "coming-soon",
  "in-development",
]);

const VALID_PRODUCT_TYPES = new Set<NonNullable<Product["type"]>>([
  "saas",
  "ai-tool",
  "dev-tool",
  "template",
  "download",
  "course",
  "other",
]);

function mapCmsItemToProduct(item: ContentItem, locale: Locale): Product {
  const d = item.data;
  const rawStatus = pickLocalized(d["status"], locale);
  const status: Product["status"] = VALID_PRODUCT_STATUSES.has(rawStatus as Product["status"])
    ? (rawStatus as Product["status"])
    : "available";

  const rawType = pickLocalized(d["type"] || d["kind"], locale);
  const type: Product["type"] = VALID_PRODUCT_TYPES.has(rawType as NonNullable<Product["type"]>)
    ? (rawType as NonNullable<Product["type"]>)
    : "saas";

  const accessUrl = typeof d["accessUrl"] === "string" ? d["accessUrl"] : undefined;
  const price = pickLocalized(d["price"], locale) || undefined;
  const subdomain = typeof d["subdomain"] === "string" ? d["subdomain"] : undefined;
  const relatedProjectSlug = typeof d["relatedProjectSlug"] === "string" ? d["relatedProjectSlug"] : undefined;

  const rawMedia = Array.isArray(d["media"]) ? d["media"] : [];
  const media: MediaSlot[] = rawMedia
    .map((m: unknown) => {
      if (typeof m === "object" && m !== null) {
        const obj = m as Record<string, unknown>;
        const kind = obj["kind"] === "image" ? "image" : "placeholder";
        const alt = pickLocalized(obj["alt"], locale) || String(obj["alt"] || "");
        const src = typeof obj["src"] === "string" ? obj["src"] : undefined;
        return { kind, alt, ...(src ? { src } : {}) };
      }
      return null;
    })
    .filter((m): m is MediaSlot => m !== null);

  return {
    slug: item.slug,
    name: pickLocalized(d["name"] || d["title"], locale) || item.slug,
    kind: type,
    status,
    type,
    summary: pickLocalized(d["summary"], locale),
    description: pickLocalized(d["description"], locale),
    features: pickArrayLocalized(d["features"], locale),
    media,
    ...(price ? { price } : {}),
    ...(accessUrl ? { accessUrl } : {}),
    ...(subdomain ? { subdomain } : {}),
    ...(relatedProjectSlug ? { relatedProjectSlug } : {}),
  };
}

const VALID_SKILL_IDS = new Set<SkillCategory["id"]>([
  "backend",
  "frontend",
  "mobile",
  "ai",
  "databases",
  "devops",
  "architecture",
  "languages",
  "tools",
  "business",
]);

function mapCmsItemToSkillCategory(item: ContentItem, locale: Locale): SkillCategory {
  const d = item.data;
  const rawId = item.slug as SkillCategory["id"];
  const id: SkillCategory["id"] = VALID_SKILL_IDS.has(rawId) ? rawId : "tools";

  const rawItems = Array.isArray(d["items"])
    ? d["items"]
    : Array.isArray(d["skills"])
    ? d["skills"]
    : [];

  type SkillItem = { name: string; note?: string; highlight?: boolean };

  const items: SkillItem[] = [];
  for (const s of rawItems) {
    if (typeof s === "string") {
      items.push({ name: s });
    } else if (typeof s === "object" && s !== null) {
      const rec = s as Record<string, unknown>;
      const name = pickLocalized(rec["name"] || rec["label"], locale);
      if (name) {
        const note = pickLocalized(rec["note"], locale);
        const highlight = Boolean(rec["highlight"]);
        const entry: SkillItem = { name };
        if (note) entry.note = note;
        if (highlight) entry.highlight = true;
        items.push(entry);
      }
    }
  }

  return {
    id,
    label: pickLocalized(d["label"] || d["title"] || d["name"], locale) || item.slug,
    description: pickLocalized(d["description"] || d["summary"], locale),
    items,
  };
}

function mapCmsItemToExperience(item: ContentItem, locale: Locale): Experience {
  const d = item.data;
  const rawKind = pickLocalized(d["kind"] || d["category"], locale);
  const kind: "engineering" | "earlier" = rawKind === "earlier" ? "earlier" : "engineering";

  const role = pickLocalized(d["role"] || d["title"], locale) || item.slug;
  const org = pickLocalized(d["org"] || d["company"] || d["institution"], locale);
  const period = pickLocalized(d["period"] || d["dates"], locale);
  const summary = pickLocalized(d["summary"] || d["description"], locale);

  return {
    role,
    kind,
    ...(org ? { org } : {}),
    ...(period ? { period } : {}),
    ...(summary ? { summary } : {}),
  };
}

function mapCmsItemToEducation(item: ContentItem, locale: Locale): Education {
  const d = item.data;
  const credential = pickLocalized(d["credential"] || d["degree"] || d["title"], locale) || item.slug;
  const institution = pickLocalized(d["institution"] || d["school"] || d["university"], locale);
  const period = pickLocalized(d["period"] || d["dates"], locale);
  const note = pickLocalized(d["note"] || d["summary"], locale);

  return {
    credential,
    ...(institution ? { institution } : {}),
    ...(period ? { period } : {}),
    ...(note ? { note } : {}),
  };
}

/* ------------------------------------------------ Fetchers & Cache Getters */

export async function fetchCmsPublicContent(locale: Locale): Promise<void> {
  try {
    const fetchStateFn = getPublicKindState as (input: { data: { kind: string } }) => Promise<{ status: CmsKindStatus; items: ContentItem[] }>;

    const [projectsState, servicesState, productsState, skillsState, expState, eduState] = await Promise.all([
      fetchStateFn({ data: { kind: "project" } }),
      fetchStateFn({ data: { kind: "service" } }),
      fetchStateFn({ data: { kind: "product" } }),
      fetchStateFn({ data: { kind: "skill_group" } }),
      fetchStateFn({ data: { kind: "experience" } }),
      fetchStateFn({ data: { kind: "education" } }),
    ]);

    projectsCmsCache.set(locale, {
      status: projectsState.status,
      data: projectsState.items.map((i) => mapCmsItemToProject(i, locale)),
      timestamp: Date.now(),
    });

    servicesCmsCache.set(locale, {
      status: servicesState.status,
      data: servicesState.items.map((i) => mapCmsItemToService(i, locale)),
      timestamp: Date.now(),
    });

    productsCmsCache.set(locale, {
      status: productsState.status,
      data: productsState.items.map((i) => mapCmsItemToProduct(i, locale)),
      timestamp: Date.now(),
    });

    skillsCmsCache.set(locale, {
      status: skillsState.status,
      data: skillsState.items.map((i) => mapCmsItemToSkillCategory(i, locale)),
      timestamp: Date.now(),
    });

    experienceCmsCache.set(locale, {
      status: expState.status,
      data: expState.items.map((i) => mapCmsItemToExperience(i, locale)),
      timestamp: Date.now(),
    });

    educationCmsCache.set(locale, {
      status: eduState.status,
      data: eduState.items.map((i) => mapCmsItemToEducation(i, locale)),
      timestamp: Date.now(),
    });
  } catch (_error) {
    // Silent fallback to API / static dictionaries on network error
  }
}

export function getCmsProjectsCached(locale: Locale): Project[] | null {
  const cached = projectsCmsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    if (cached.status === "initialized") {
      return cached.data; // Authoritative (returns items array or [] if all items unpublished)
    }
  }
  return null; // Trigger fallback when uninitialized or error
}

export function getCmsServicesCached(locale: Locale): Service[] | null {
  const cached = servicesCmsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    if (cached.status === "initialized") {
      return cached.data;
    }
  }
  return null;
}

export function getCmsProductsCached(locale: Locale): Product[] | null {
  const cached = productsCmsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    if (cached.status === "initialized") {
      return cached.data;
    }
  }
  return null;
}

export function getCmsSkillsCached(locale: Locale): SkillCategory[] | null {
  const cached = skillsCmsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    if (cached.status === "initialized") {
      return cached.data;
    }
  }
  return null;
}

export function getCmsExperienceCached(locale: Locale, category?: "engineering" | "earlier"): Experience[] | null {
  const cached = experienceCmsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    if (cached.status === "initialized") {
      return category ? cached.data.filter((i) => i.kind === category) : cached.data;
    }
  }
  return null;
}

export function getCmsEducationCached(locale: Locale): Education[] | null {
  const cached = educationCmsCache.get(locale);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    if (cached.status === "initialized") {
      return cached.data;
    }
  }
  return null;
}
