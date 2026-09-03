import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import {
  CONTENT_COLUMNS,
  toContentItem,
  type ContentRow,
} from "./mappers";
import type { ContentItem } from "./types";

/**
 * Public, unauthenticated reads. Uses the publishable key so RLS applies as
 * `anon`: only rows that are published AND flagged public are ever returned.
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

import { fetchPublicArticlesApi, fetchPublicArticleBySlugApi } from "@/content/articles-api-adapter";

export const listPublicArticles = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentItem[]> => {
    const apiArticles = await fetchPublicArticlesApi();
    if (apiArticles && apiArticles.length > 0) {
      return apiArticles;
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
    const apiArticle = await fetchPublicArticleBySlugApi(input.slug);
    if (apiArticle) {
      return apiArticle;
    }
    const client = publicClient();
    const { data } = await client
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", "article")
      .eq("slug", input.slug)
      .maybeSingle();
    if (data) return toContentItem(data as ContentRow);

    // Renamed article: honour previous slugs so old links keep resolving.
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

/**
 * Generic published read for any content kind. RLS still restricts results to
 * rows that are published and flagged public.
 */
export const listPublicByKind = createServerFn({ method: "GET" })
  .inputValidator((input: { kind: string }) => ({ kind: String(input.kind) }))
  .handler(async ({ data: input }): Promise<ContentItem[]> => {
    const { data, error } = await publicClient()
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", input.kind)
      .order("sort_order", { ascending: true });
    if (error) return [];
    return (data as ContentRow[]).map(toContentItem);
  });

/**
 * Published profile entry, if any. RLS limits this to published + public rows,
 * so an unpublished profile draft never leaks to the site.
 */
export const getPublicProfile = createServerFn({ method: "GET" }).handler(
  async (): Promise<ContentItem | null> => {
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
