import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { CONTENT_COLUMNS, toContentItem, type ContentRow } from "./mappers";
import type { ContentItem } from "./types";
import { apiRequest } from "../api/client";
import {
  mapArticleToContentItem,
  mapAnnouncementToContentItem,
  mapProjectToContentItem,
  mapProductToContentItem,
  mapServiceToContentItem,
  mapCourseToContentItem,
} from "./adapters";

/**
 * Public, unauthenticated reads. Connects to Standalone ASP.NET Core API
 * with automatic fallback to Supabase for unmigrated fields.
 */
function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const listPublicArticles = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentItem[]> => {
    const res = await apiRequest<any[]>("/api/v1/articles");
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(mapArticleToContentItem);
    }
    const { data, error } = await publicClient()
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", "article")
      .order("published_at", { ascending: false });
    if (error) return [];
    return (data as ContentRow[]).map(toContentItem);
  },
);

export const getPublicArticle = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => ({ slug: String(input.slug) }))
  .handler(async ({ data: input }): Promise<ContentItem | null> => {
    const res = await apiRequest<any>(`/api/v1/articles/${input.slug}`);
    if (res.success && res.data) {
      return mapArticleToContentItem(res.data);
    }
    const client = publicClient();
    const { data } = await client
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", "article")
      .eq("slug", input.slug)
      .maybeSingle();
    if (data) return toContentItem(data as ContentRow);

    const { data: legacy } = await client
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", "article")
      .contains("previous_slugs", [input.slug])
      .maybeSingle();
    return legacy ? toContentItem(legacy as ContentRow) : null;
  });

export const listPublicAnnouncements = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentItem[]> => {
    const res = await apiRequest<any[]>("/api/v1/announcements");
    if (res.success && Array.isArray(res.data)) {
      return res.data.map(mapAnnouncementToContentItem);
    }
    const { data, error } = await publicClient()
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", "announcement")
      .order("sort_order", { ascending: true });
    if (error) return [];
    const now = Date.now();
    return (data as ContentRow[]).map(toContentItem).filter((item) => {
      const d = item.data as { startsAt?: string | null; endsAt?: string | null };
      if (d.startsAt && new Date(d.startsAt).getTime() > now) return false;
      if (d.endsAt && new Date(d.endsAt).getTime() < now) return false;
      return true;
    });
  },
);

export const listPublicByKind = createServerFn({ method: "GET" })
  .inputValidator((input: { kind: string }) => ({ kind: String(input.kind) }))
  .handler(async ({ data: input }): Promise<ContentItem[]> => {
    let endpoint = "";
    let mapper: ((dto: any) => ContentItem) | null = null;

    if (input.kind === "project") {
      endpoint = "/api/v1/projects";
      mapper = mapProjectToContentItem;
    } else if (input.kind === "product") {
      endpoint = "/api/v1/products";
      mapper = mapProductToContentItem;
    } else if (input.kind === "service") {
      endpoint = "/api/v1/services";
      mapper = mapServiceToContentItem;
    } else if (input.kind === "course") {
      endpoint = "/api/v1/courses";
      mapper = mapCourseToContentItem;
    }

    if (endpoint && mapper) {
      const res = await apiRequest<any[]>(endpoint);
      if (res.success && Array.isArray(res.data)) {
        return res.data.map(mapper);
      }
    }

    const { data, error } = await publicClient()
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", input.kind)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data as ContentRow[]).map(toContentItem);
  });

export const getPublicProfile = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentItem | null> => {
    const res = await apiRequest<any>("/api/v1/profile");
    if (res.success && res.data) {
      return {
        id: String(res.data.id || "profile-id"),
        kind: "profile",
        slug: "profile",
        state: "published",
        visibility: { public: true, portfolio: true, cv: true, linkedin: true },
        featured: true,
        sortOrder: 0,
        data: res.data,
        previousSlugs: [],
        scheduledAt: null,
        publishedAt: null,
        archivedAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    const { data, error } = await publicClient()
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", "profile")
      .order("sort_order", { ascending: true })
      .limit(1);
    if (error || !data || data.length === 0) return null;
    return toContentItem(data[0] as ContentRow);
  },
);
