import { createServerFn } from "@tanstack/react-start";
import { adminStatus, assertAdminContext } from "@/lib/security/admin-guard";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  CONTENT_COLUMNS,
  MEDIA_COLUMNS,
  toContentItem,
  toMediaAsset,
  type ContentRow,
  type MediaRow,
} from "./mappers";
import {
  CONTENT_KINDS,
  WORKFLOW_STATES,
  type ContentItem,
  type ContentKind,
  type JsonObject,
  type MediaAsset,
  type WorkflowState,
} from "./types";
import { isValidSlug } from "./slug";

type Ctx = { supabase: any; userId: string; claims?: Record<string, unknown> };

async function assertAdmin(context: Ctx) {
  await assertAdminContext(context);
}

const asKind = (value: unknown): ContentKind => {
  if (!CONTENT_KINDS.includes(value as ContentKind)) throw new Error("Invalid content kind");
  return value as ContentKind;
};

const asState = (value: unknown): WorkflowState => {
  if (!WORKFLOW_STATES.includes(value as WorkflowState)) throw new Error("Invalid state");
  return value as WorkflowState;
};

/* --------------------------------------------------------------- reads */

export const adminIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return adminStatus(context as unknown as Ctx);
  });

export const adminListContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { kind: string }) => ({ kind: asKind(input.kind) }))
  .handler(async ({ data: input, context }): Promise<ContentItem[]> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { data, error } = await ctx.supabase
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("kind", input.kind)
      .order("sort_order", { ascending: true })
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as ContentRow[]).map(toContentItem);
  });

export const adminGetContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data: input, context }): Promise<ContentItem | null> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { data } = await ctx.supabase
      .from("content_items")
      .select(CONTENT_COLUMNS)
      .eq("id", input.id)
      .maybeSingle();
    return data ? toContentItem(data as ContentRow) : null;
  });

export const adminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { data } = await ctx.supabase.from("content_items").select("kind, state, updated_at, slug");
    const rows = (data ?? []) as { kind: ContentKind; state: WorkflowState; updated_at: string; slug: string }[];
    const byKind: Record<string, { total: number; published: number; draft: number }> = {};
    for (const row of rows) {
      const bucket = (byKind[row.kind] ??= { total: 0, published: 0, draft: 0 });
      bucket.total += 1;
      if (row.state === "published") bucket.published += 1;
      if (row.state === "draft" || row.state === "review") bucket.draft += 1;
    }
    const recent = [...rows]
      .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
      .slice(0, 8);
    return { byKind, recent };
  });

/* -------------------------------------------------------------- writes */

type UpsertInput = {
  id?: string;
  kind: string;
  slug: string;
  state: string;
  visibility: { public: boolean; portfolio: boolean; cv: boolean; linkedin: boolean };
  featured: boolean;
  sortOrder: number;
  data: JsonObject;
  scheduledAt?: string | null;
};

const validateUpsert = (input: UpsertInput): UpsertInput => {
  const slug = String(input.slug ?? "").trim();
  if (!isValidSlug(slug)) throw new Error("Slug must be lowercase words separated by hyphens.");
  return {
    ...(input.id ? { id: String(input.id) } : {}),
    kind: asKind(input.kind),
    slug,
    state: asState(input.state),
    visibility: {
      public: Boolean(input.visibility?.public),
      portfolio: Boolean(input.visibility?.portfolio),
      cv: Boolean(input.visibility?.cv),
      linkedin: Boolean(input.visibility?.linkedin),
    },
    featured: Boolean(input.featured),
    sortOrder: Number.isFinite(Number(input.sortOrder)) ? Number(input.sortOrder) : 0,
    data: (input.data ?? {}) as JsonObject,
    scheduledAt: input.scheduledAt ?? null,
  };
};

export const adminSaveContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(validateUpsert)
  .handler(async ({ data: input, context }): Promise<ContentItem> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);

    const row: Record<string, unknown> = {
      kind: input.kind,
      slug: input.slug,
      state: input.state,
      visible_public: input.visibility.public,
      visible_portfolio: input.visibility.portfolio,
      visible_cv: input.visibility.cv,
      visible_linkedin: input.visibility.linkedin,
      featured: input.featured,
      sort_order: input.sortOrder,
      data: input.data,
      scheduled_at: input.state === "scheduled" ? input.scheduledAt : null,
      updated_by: ctx.userId,
    };

    if (input.id) {
      const { data: existing } = await ctx.supabase
        .from("content_items")
        .select("slug, previous_slugs, published_at")
        .eq("id", input.id)
        .maybeSingle();
      if (existing && existing.slug !== input.slug) {
        const prev: string[] = existing.previous_slugs ?? [];
        row["previous_slugs"] = Array.from(new Set([...prev, existing.slug]));
      }
      row["published_at"] =
        input.state === "published"
          ? (existing?.published_at ?? new Date().toISOString())
          : null;
      row["archived_at"] = input.state === "archived" ? new Date().toISOString() : null;

      const { data, error } = await ctx.supabase
        .from("content_items")
        .update(row)
        .eq("id", input.id)
        .select(CONTENT_COLUMNS)
        .single();
      if (error) throw new Error(error.message);
      return toContentItem(data as ContentRow);
    }

    row["created_by"] = ctx.userId;
    row["published_at"] = input.state === "published" ? new Date().toISOString() : null;
    const { data, error } = await ctx.supabase
      .from("content_items")
      .insert(row)
      .select(CONTENT_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return toContentItem(data as ContentRow);
  });

export const adminSetState = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; state: string }) => ({
    id: String(input.id),
    state: asState(input.state),
  }))
  .handler(async ({ data: input, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const patch: Record<string, unknown> = { state: input.state, updated_by: ctx.userId };
    if (input.state === "published") patch["published_at"] = new Date().toISOString();
    if (input.state === "archived") patch["archived_at"] = new Date().toISOString();
    const { error } = await ctx.supabase.from("content_items").update(patch).eq("id", input.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { items: { id: string; sortOrder: number }[] }) => ({
    items: (input.items ?? []).map((i) => ({ id: String(i.id), sortOrder: Number(i.sortOrder) })),
  }))
  .handler(async ({ data: input, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    for (const item of input.items) {
      await ctx.supabase
        .from("content_items")
        .update({ sort_order: item.sortOrder })
        .eq("id", item.id);
    }
    return { ok: true };
  });

export const adminDeleteContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input.id) }))
  .handler(async ({ data: input, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { error } = await ctx.supabase.from("content_items").delete().eq("id", input.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Bulk import used by the "seed from canonical files" action. */
export const adminSeedContent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { items: UpsertInput[] }) => ({
    items: (input.items ?? []).map(validateUpsert),
  }))
  .handler(async ({ data: input, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const rows = input.items.map((item, index) => ({
      kind: item.kind,
      slug: item.slug,
      state: item.state,
      visible_public: item.visibility.public,
      visible_portfolio: item.visibility.portfolio,
      visible_cv: item.visibility.cv,
      visible_linkedin: item.visibility.linkedin,
      featured: item.featured,
      sort_order: item.sortOrder || index,
      data: item.data,
      published_at: item.state === "published" ? new Date().toISOString() : null,
      created_by: ctx.userId,
      updated_by: ctx.userId,
    }));
    const { error } = await ctx.supabase
      .from("content_items")
      .upsert(rows, { onConflict: "kind,slug" });
    if (error) throw new Error(error.message);
    return { imported: rows.length };
  });

/* --------------------------------------------------------------- media */

export const adminListMedia = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<MediaAsset[]> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { data, error } = await ctx.supabase
      .from("media_assets")
      .select(MEDIA_COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data as MediaRow[]).map(toMediaAsset);
  });

export const adminRegisterMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    filename: string;
    storagePath: string;
    mimeType?: string;
    sizeBytes?: number;
    altEn?: string;
    altAr?: string;
  }) => ({
    filename: String(input.filename),
    storagePath: String(input.storagePath),
    mimeType: input.mimeType ? String(input.mimeType) : null,
    sizeBytes: Number(input.sizeBytes ?? 0),
    altEn: input.altEn ? String(input.altEn) : null,
    altAr: input.altAr ? String(input.altAr) : null,
  }))
  .handler(async ({ data: input, context }): Promise<MediaAsset> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { data, error } = await ctx.supabase
      .from("media_assets")
      .insert({
        filename: input.filename,
        storage_path: input.storagePath,
        public_url: `/api/public/media/${input.storagePath}`,
        mime_type: input.mimeType,
        size_bytes: input.sizeBytes,
        alt_en: input.altEn,
        alt_ar: input.altAr,
        created_by: ctx.userId,
      })
      .select(MEDIA_COLUMNS)
      .single();
    if (error) throw new Error(error.message);
    return toMediaAsset(data as MediaRow);
  });

export const adminUpdateMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    id: string;
    altEn?: string;
    altAr?: string;
    captionEn?: string;
    captionAr?: string;
    archived?: boolean;
  }) => input)
  .handler(async ({ data: input, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { error } = await ctx.supabase
      .from("media_assets")
      .update({
        alt_en: input.altEn ?? null,
        alt_ar: input.altAr ?? null,
        caption_en: input.captionEn ?? null,
        caption_ar: input.captionAr ?? null,
        archived: Boolean(input.archived),
      })
      .eq("id", String(input.id));
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteMedia = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; storagePath: string }) => ({
    id: String(input.id),
    storagePath: String(input.storagePath),
  }))
  .handler(async ({ data: input, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    await ctx.supabase.storage.from("media").remove([input.storagePath]);
    const { error } = await ctx.supabase.from("media_assets").delete().eq("id", input.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
