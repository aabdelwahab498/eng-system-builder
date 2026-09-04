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

export const PUBLIC_CONTENT_KINDS = [
  "project",
  "service",
  "product",
  "skill_group",
  "experience",
  "education",
] as const;

export type PublicContentKind = (typeof PUBLIC_CONTENT_KINDS)[number];

function isPublicContentKind(kind: string): kind is PublicContentKind {
  return (PUBLIC_CONTENT_KINDS as readonly string[]).includes(kind);
}

/**
 * Generic published read for any content kind. Explicitly filters for
 * state === 'published' AND visible_public === true AND schedule validation.
 */
export const listPublicByKind = createServerFn({ method: "GET" })
  .inputValidator((input: { kind: string }) => ({ kind: String(input.kind) }))
  .handler(async ({ data: input }): Promise<ContentItem[]> => {
    const { data, error } = await publicClient()
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", input.kind as any)
      .eq("state", "published")
      .eq("visible_public", true)
      .order("sort_order", { ascending: true });
    if (error || !data) return [];
    const now = Date.now();
    return (data as ContentRow[])
      .map(toContentItem)
      .filter((item) => {
        if (item.scheduledAt && new Date(item.scheduledAt).getTime() > now) return false;
        const d = item.data as { startsAt?: string | null; endsAt?: string | null };
        if (d.startsAt && new Date(d.startsAt).getTime() > now) return false;
        if (d.endsAt && new Date(d.endsAt).getTime() < now) return false;
        return true;
      });
  });

export type CmsKindStatus = "initialized" | "uninitialized" | "error";

/**
 * Returns total CMS population status and published entries for a content kind.
 * Used to distinguish "CMS initialized with 0 published items" (CMS authoritative)
 * from "CMS has never been populated for this kind" (fallback).
 */
export const getPublicKindState = createServerFn({ method: "GET" })
  .inputValidator((input: { kind: string }) => ({ kind: String(input.kind) }))
  .handler(
    async (
      { data: input },
    ): Promise<{ status: CmsKindStatus; items: ContentItem[] }> => {
      try {
        if (!isPublicContentKind(input.kind)) {
          return { status: "error", items: [] };
        }

        const validKind = input.kind;

        // Privileged server-side total row count check to determine if kind is initialized
        let totalInCms = 0;
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { count, error: countError } = await supabaseAdmin
            .from("content_items")
            .select("id", { count: "exact", head: true })
            .eq("kind", validKind);

          if (countError) {
            return { status: "error", items: [] };
          }
          totalInCms = count ?? 0;
        } catch {
          return { status: "error", items: [] };
        }

        if (totalInCms === 0) {
          return { status: "uninitialized", items: [] };
        }

        // Public read for published public entries through publicClient (RLS applies)
        const client = publicClient();
        const { data, error } = await client
          .from("content_items")
          .select(CONTENT_COLUMNS)
          .eq("kind", validKind)
          .eq("state", "published")
          .eq("visible_public", true)
          .order("sort_order", { ascending: true });

        if (error || !data) {
          return { status: "error", items: [] };
        }

        const now = Date.now();
        const items = (data as ContentRow[])
          .map(toContentItem)
          .filter((item) => {
            if (item.scheduledAt && new Date(item.scheduledAt).getTime() > now) return false;
            const d = item.data as { startsAt?: string | null; endsAt?: string | null };
            if (d.startsAt && new Date(d.startsAt).getTime() > now) return false;
            if (d.endsAt && new Date(d.endsAt).getTime() < now) return false;
            return true;
          });

        return { status: "initialized", items };
      } catch {
        return { status: "error", items: [] };
      }
    },
  );

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
