import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type ServiceRequestRow = {
  id: string;
  client_name: string;
  email: string | null;
  whatsapp: string | null;
  service_id: string | null;
  service_title: string | null;
  project_name: string | null;
  description: string | null;
  platform: string | null;
  scope: string | null;
  budget: string | null;
  timeline: string | null;
  preferred_channel: string | null;
  attachment_url: string | null;
  locale: string;
  source: string;
  status: string;
  admin_note: string;
  created_at: string;
  updated_at: string;
};

export const REQUEST_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "proposal_sent", label: "Proposal sent" },
  { value: "deposit_pending", label: "Deposit pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

const COLUMNS =
  "id, client_name, email, whatsapp, service_id, service_title, project_name, description, platform, scope, budget, timeline, preferred_channel, attachment_url, locale, source, status, admin_note, created_at, updated_at";

type Ctx = { supabase: any; userId: string };

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

/** Anon client used for the public submission endpoint (INSERT-only by RLS). */
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

const text = (value: unknown, max = 1000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export type SubmitRequestInput = {
  clientName?: string | undefined;
  email?: string | undefined;
  whatsapp?: string | undefined;
  serviceId?: string | undefined;
  serviceTitle?: string | undefined;
  projectName?: string | undefined;
  description?: string | undefined;
  platform?: string | undefined;
  scope?: string | undefined;
  budget?: string | undefined;
  timeline?: string | undefined;
  preferredChannel?: string | undefined;
  attachmentUrl?: string | undefined;
  locale?: string | undefined;
  source?: string | undefined;
};

/** Public: a visitor pressing "Start project" lands a lead in the admin inbox. */
export const submitServiceRequest = createServerFn({ method: "POST" })
  .inputValidator((input: SubmitRequestInput) => input)
  .handler(async ({ data }) => {
    const payload = {
      client_name: text(data.clientName, 120) || "Website visitor",
      email: text(data.email, 255) || null,
      whatsapp: text(data.whatsapp, 40) || null,
      service_id: text(data.serviceId, 80) || null,
      service_title: text(data.serviceTitle, 160) || null,
      project_name: text(data.projectName, 160) || null,
      description: text(data.description, 4000) || null,
      platform: text(data.platform, 80) || null,
      scope: text(data.scope, 80) || null,
      budget: text(data.budget, 80) || null,
      timeline: text(data.timeline, 80) || null,
      preferred_channel: text(data.preferredChannel, 40) || null,
      attachment_url: text(data.attachmentUrl, 500) || null,
      locale: text(data.locale, 5) || "en",
      source: text(data.source, 60) || "services_page",
    };
    const { error } = await publicClient().from("service_requests").insert(payload);
    if (error) throw new Error("Could not send the request");
    return { ok: true };
  });

export const adminListServiceRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ServiceRequestRow[]> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { data, error } = await ctx.supabase
      .from("service_requests")
      .select(COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as ServiceRequestRow[];
  });

export const adminUpdateServiceRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status?: string; adminNote?: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const patch: Record<string, unknown> = {};
    if (data.status !== undefined) patch["status"] = text(data.status, 40);
    if (data.adminNote !== undefined) patch["admin_note"] = text(data.adminNote, 4000);
    const { error } = await ctx.supabase
      .from("service_requests")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteServiceRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { error } = await ctx.supabase.from("service_requests").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
