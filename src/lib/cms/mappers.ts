import type { ContentItem, ContentKind, JsonObject, MediaAsset, WorkflowState } from "./types";

/** Raw row shape as returned by the Data API. */
export type ContentRow = {
  id: string;
  kind: ContentKind;
  slug: string;
  state: WorkflowState;
  visible_public: boolean;
  visible_portfolio: boolean;
  visible_cv: boolean;
  visible_linkedin: boolean;
  featured: boolean;
  sort_order: number;
  data: JsonObject;
  previous_slugs: string[] | null;
  scheduled_at: string | null;
  published_at: string | null;
  archived_at: string | null;
  created_at: string;
  updated_at: string;
};

export const CONTENT_COLUMNS =
  "id, kind, slug, state, visible_public, visible_portfolio, visible_cv, visible_linkedin, featured, sort_order, data, previous_slugs, scheduled_at, published_at, archived_at, created_at, updated_at";

export function toContentItem(row: ContentRow): ContentItem {
  return {
    id: row.id,
    kind: row.kind,
    slug: row.slug,
    state: row.state,
    visibility: {
      public: row.visible_public,
      portfolio: row.visible_portfolio,
      cv: row.visible_cv,
      linkedin: row.visible_linkedin,
    },
    featured: row.featured,
    sortOrder: row.sort_order,
    data: (row.data ?? {}) as JsonObject,
    previousSlugs: row.previous_slugs ?? [],
    scheduledAt: row.scheduled_at,
    publishedAt: row.published_at,
    archivedAt: row.archived_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export type MediaRow = {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  mime_type: string | null;
  size_bytes: number | null;
  alt_en: string | null;
  alt_ar: string | null;
  caption_en: string | null;
  caption_ar: string | null;
  archived: boolean;
  created_at: string;
};

export const MEDIA_COLUMNS =
  "id, filename, storage_path, public_url, mime_type, size_bytes, alt_en, alt_ar, caption_en, caption_ar, archived, created_at";

export function toMediaAsset(row: MediaRow): MediaAsset {
  return {
    id: row.id,
    filename: row.filename,
    storagePath: row.storage_path,
    publicUrl: row.public_url,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    altEn: row.alt_en,
    altAr: row.alt_ar,
    captionEn: row.caption_en,
    captionAr: row.caption_ar,
    archived: row.archived,
    createdAt: row.created_at,
  };
}
