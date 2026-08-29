import type { ContentItem, WorkflowState } from "./types";

/**
 * Adapter converting backend DTOs into existing frontend ContentItem models.
 * Preserves 100% component compatibility and Arabic/English localization behavior.
 */

export function mapArticleToContentItem(dto: any): ContentItem {
  return {
    id: String(dto.id || ""),
    kind: "article",
    slug: String(dto.slug || ""),
    state: (dto.statusState || "published") as WorkflowState,
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
    featured: Boolean(dto.featured),
    sortOrder: Number(dto.sortOrder || 0),
    data: {
      title: { en: String(dto.titleEn || ""), ar: dto.titleAr ? String(dto.titleAr) : null },
      excerpt: { en: String(dto.summaryEn || ""), ar: dto.summaryAr ? String(dto.summaryAr) : null },
      body: { en: String(dto.contentEn || ""), ar: dto.contentAr ? String(dto.contentAr) : null },
      coverImageUrl: dto.coverImageUrl ? String(dto.coverImageUrl) : undefined,
      category: dto.category ? String(dto.category) : undefined,
      tags: Array.isArray(dto.tags) ? dto.tags : [],
      seoTitle: { en: String(dto.titleEn || ""), ar: dto.titleAr ? String(dto.titleAr) : null },
      seoDescription: { en: String(dto.summaryEn || ""), ar: dto.summaryAr ? String(dto.summaryAr) : null },
    },
    previousSlugs: [],
    scheduledAt: null,
    publishedAt: dto.publishedAt ? String(dto.publishedAt) : null,
    archivedAt: null,
    createdAt: dto.createdAt ? String(dto.createdAt) : new Date().toISOString(),
    updatedAt: dto.updatedAt ? String(dto.updatedAt) : new Date().toISOString(),
  };
}

export function mapAnnouncementToContentItem(dto: any): ContentItem {
  return {
    id: String(dto.id || ""),
    kind: "announcement",
    slug: String(dto.slug || `announcement-${dto.id}`),
    state: "published",
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
    featured: Boolean(dto.featured),
    sortOrder: Number(dto.priority || dto.sortOrder || 0),
    data: {
      title: { en: String(dto.titleEn || ""), ar: dto.titleAr ? String(dto.titleAr) : null },
      message: { en: String(dto.messageEn || ""), ar: dto.messageAr ? String(dto.messageAr) : null },
      ctaLabel: { en: String(dto.ctaLabelEn || "Learn More"), ar: dto.ctaLabelAr ? String(dto.ctaLabelAr) : null },
      ctaUrl: dto.ctaUrl ? String(dto.ctaUrl) : undefined,
      imageUrl: dto.imageUrl ? String(dto.imageUrl) : undefined,
      placement: dto.kind || "banner",
      priority: Number(dto.priority || 0),
      startsAt: dto.startsAt ? String(dto.startsAt) : null,
      endsAt: dto.endsAt ? String(dto.endsAt) : null,
    },
    previousSlugs: [],
    scheduledAt: null,
    publishedAt: dto.startsAt ? String(dto.startsAt) : null,
    archivedAt: null,
    createdAt: dto.createdAt ? String(dto.createdAt) : new Date().toISOString(),
    updatedAt: dto.updatedAt ? String(dto.updatedAt) : new Date().toISOString(),
  };
}

export function mapProjectToContentItem(dto: any): ContentItem {
  return {
    id: String(dto.id || ""),
    kind: "project",
    slug: String(dto.slug || ""),
    state: "published",
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
    featured: Boolean(dto.featured),
    sortOrder: Number(dto.sortOrder || 0),
    data: {
      title: { en: String(dto.titleEn || ""), ar: dto.titleAr ? String(dto.titleAr) : null },
      summary: { en: String(dto.summaryEn || ""), ar: dto.summaryAr ? String(dto.summaryAr) : null },
      description: { en: String(dto.descriptionEn || ""), ar: dto.descriptionAr ? String(dto.descriptionAr) : null },
      category: dto.category ? String(dto.category) : undefined,
      coverImageUrl: dto.coverImageUrl ? String(dto.coverImageUrl) : undefined,
      demoUrl: dto.demoUrl ? String(dto.demoUrl) : undefined,
      githubUrl: dto.githubUrl ? String(dto.githubUrl) : undefined,
      technologies: Array.isArray(dto.technologies) ? dto.technologies : [],
    },
    previousSlugs: [],
    scheduledAt: null,
    publishedAt: dto.createdAt ? String(dto.createdAt) : null,
    archivedAt: null,
    createdAt: dto.createdAt ? String(dto.createdAt) : new Date().toISOString(),
    updatedAt: dto.updatedAt ? String(dto.updatedAt) : new Date().toISOString(),
  };
}

export function mapProductToContentItem(dto: any): ContentItem {
  return {
    id: String(dto.id || ""),
    kind: "product",
    slug: String(dto.slug || ""),
    state: "published",
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
    featured: Boolean(dto.featured),
    sortOrder: Number(dto.sortOrder || 0),
    data: {
      name: { en: String(dto.nameEn || ""), ar: dto.nameAr ? String(dto.nameAr) : null },
      summary: { en: String(dto.summaryEn || ""), ar: dto.summaryAr ? String(dto.summaryAr) : null },
      description: { en: String(dto.descriptionEn || ""), ar: dto.descriptionAr ? String(dto.descriptionAr) : null },
      price: dto.priceUsd ? `$${dto.priceUsd}` : dto.priceEgp ? `${dto.priceEgp} EGP` : "Free",
      imageUrl: dto.coverImageUrl ? String(dto.coverImageUrl) : undefined,
      buyUrl: dto.demoUrl ? String(dto.demoUrl) : undefined,
    },
    previousSlugs: [],
    scheduledAt: null,
    publishedAt: dto.createdAt ? String(dto.createdAt) : null,
    archivedAt: null,
    createdAt: dto.createdAt ? String(dto.createdAt) : new Date().toISOString(),
    updatedAt: dto.updatedAt ? String(dto.updatedAt) : new Date().toISOString(),
  };
}

export function mapServiceToContentItem(dto: any): ContentItem {
  return {
    id: String(dto.id || ""),
    kind: "service",
    slug: String(dto.slug || `service-${dto.id}`),
    state: "published",
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
    featured: Boolean(dto.featured),
    sortOrder: Number(dto.sortOrder || 0),
    data: {
      title: { en: String(dto.titleEn || ""), ar: dto.titleAr ? String(dto.titleAr) : null },
      summary: { en: String(dto.summaryEn || ""), ar: dto.summaryAr ? String(dto.summaryAr) : null },
      description: { en: String(dto.descriptionEn || ""), ar: dto.descriptionAr ? String(dto.descriptionAr) : null },
      icon: dto.icon ? String(dto.icon) : "Code",
      deliverables: Array.isArray(dto.deliverables) ? dto.deliverables : [],
    },
    previousSlugs: [],
    scheduledAt: null,
    publishedAt: dto.createdAt ? String(dto.createdAt) : null,
    archivedAt: null,
    createdAt: dto.createdAt ? String(dto.createdAt) : new Date().toISOString(),
    updatedAt: dto.updatedAt ? String(dto.updatedAt) : new Date().toISOString(),
  };
}

export function mapCourseToContentItem(dto: any): ContentItem {
  return {
    id: String(dto.id || ""),
    kind: "course",
    slug: String(dto.slug || `course-${dto.id}`),
    state: "published",
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
    featured: Boolean(dto.featured),
    sortOrder: Number(dto.order || dto.sortOrder || 0),
    data: {
      title: { en: String(dto.titleEn || ""), ar: dto.titleAr ? String(dto.titleAr) : null },
      summary: { en: String(dto.summaryEn || ""), ar: dto.summaryAr ? String(dto.summaryAr) : null },
      description: { en: String(dto.descriptionEn || ""), ar: dto.descriptionAr ? String(dto.descriptionAr) : null },
      level: dto.level || "foundations",
      icon: dto.icon || "BookOpen",
      priceEgp: dto.priceEgp || "0",
      priceUsd: dto.priceUsd || "0",
      duration: { en: String(dto.durationEn || ""), ar: dto.durationAr ? String(dto.durationAr) : null },
      enrollmentOpen: dto.enrollmentOpen !== false,
    },
    previousSlugs: [],
    scheduledAt: null,
    publishedAt: dto.createdAt ? String(dto.createdAt) : null,
    archivedAt: null,
    createdAt: dto.createdAt ? String(dto.createdAt) : new Date().toISOString(),
    updatedAt: dto.updatedAt ? String(dto.updatedAt) : new Date().toISOString(),
  };
}
