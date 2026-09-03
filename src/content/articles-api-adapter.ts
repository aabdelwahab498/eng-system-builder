/**
 * Articles / Blog API Adapter
 */

import type { ContentItem, ArticleData } from "@/lib/cms/types";
import { fetchProjectsFromApi } from "./projects-api-client";

export interface BackendArticleDto {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  tags?: string[];
  publishedAt?: string;
  createdAt: string;
}

export function mapArticleDtoToContentItem(dto: BackendArticleDto): ContentItem<ArticleData> {
  const data: ArticleData = {
    title: { en: dto.title, ar: null },
    excerpt: { en: dto.summary, ar: null },
    body: { en: dto.content, ar: null },
    category: dto.tags?.[0] ?? "Engineering",
    tags: dto.tags ?? [],
    seoTitle: { en: dto.title, ar: null },
    seoDescription: { en: dto.summary, ar: null },
  };

  if (dto.coverImage) {
    data.coverImageUrl = dto.coverImage;
  }

  return {
    id: dto.id,
    kind: "article",
    slug: dto.slug,
    state: "published",
    visibility: { public: true, portfolio: true, cv: true, linkedin: true },
    featured: false,
    sortOrder: 0,
    previousSlugs: [],
    scheduledAt: null,
    publishedAt: dto.publishedAt ?? dto.createdAt,
    archivedAt: null,
    createdAt: dto.createdAt,
    updatedAt: dto.createdAt,
    data,
  };
}

export async function fetchPublicArticlesApi(locale: string = "en"): Promise<ContentItem<ArticleData>[] | null> {
  const result = await fetchProjectsFromApi<BackendArticleDto[]>("/articles", { locale });
  if (result.ok && result.data && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(mapArticleDtoToContentItem);
  }
  return null;
}

export async function fetchPublicArticleBySlugApi(slug: string, locale: string = "en"): Promise<ContentItem<ArticleData> | null> {
  const result = await fetchProjectsFromApi<BackendArticleDto>(`/articles/${encodeURIComponent(slug)}`, { locale });
  if (result.ok && result.data) {
    return mapArticleDtoToContentItem(result.data);
  }
  return null;
}
