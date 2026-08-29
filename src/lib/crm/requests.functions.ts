import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = { supabase: any; userId: string };

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

function getBackendUrl(): string | null {
  const url = process.env["VITE_PORTFOLIO_API_URL"] || process.env["PORTFOLIO_API_URL"];
  if (url && url.trim()) {
    return url.trim().replace(/\/+$/, "");
  }
  return null;
}

function getAuthHeader(ctx: Ctx): Record<string, string> {
  try {
    const req = getRequest();
    const authHeader = req?.headers?.get("authorization");
    if (authHeader) {
      return { Authorization: authHeader };
    }
  } catch {
    // getRequest might not be available in all execution contexts
  }
  if (ctx?.supabase?.auth?.token) {
    return { Authorization: `Bearer ${ctx.supabase.auth.token}` };
  }
  return {};
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
    const contactPayload = {
      name: text(data.clientName, 120) || "Website visitor",
      email: text(data.email, 255) || "visitor@nextnext-gen.com",
      subject: text(data.serviceTitle, 160) || text(data.projectName, 160) || "Service Inquiry",
      message: text(data.description, 4000) || "Inquiry from website",
      whatsapp: text(data.whatsapp, 40) || undefined,
      serviceId: text(data.serviceId, 80) || undefined,
      serviceTitle: text(data.serviceTitle, 160) || undefined,
      projectName: text(data.projectName, 160) || undefined,
      scope: text(data.scope, 80) || undefined,
      budget: text(data.budget, 80) || undefined,
      timeline: text(data.timeline, 80) || undefined,
      preferredChannel: text(data.preferredChannel, 40) || undefined,
      platform: text(data.platform, 80) || undefined,
      attachmentUrl: text(data.attachmentUrl, 500) || undefined,
      locale: text(data.locale, 5) || "en",
      source: text(data.source, 60) || "services_page",
    };

    const apiBaseUrl = getBackendUrl();
    if (apiBaseUrl) {
      const res = await fetch(`${apiBaseUrl}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(contactPayload),
      });
      if (res.ok) return { ok: true };
    }

    const legacyPayload = {
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
    const { error } = await publicClient().from("service_requests").insert(legacyPayload);
    if (error) throw new Error("Could not send the request");
    return { ok: true };
  });

export const adminListServiceRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<ServiceRequestRow[]> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);

    const apiBaseUrl = getBackendUrl();
    if (!apiBaseUrl) {
      throw new Error(
        "Phase 5 Backend API URL is not configured (VITE_PORTFOLIO_API_URL or PORTFOLIO_API_URL required for admin CRM operations)",
      );
    }

    const res = await fetch(`${apiBaseUrl}/api/v1/admin/requests`, {
      headers: {
        Accept: "application/json",
        ...getAuthHeader(ctx),
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to list service requests from backend API: HTTP ${res.status}`);
    }

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error(json.error?.message || "Invalid response envelope from backend API");
    }

    return json.data.map((item: Record<string, unknown>) => ({
      id: String(item["id"] ?? ""),
      client_name: String(item["name"] || "Website visitor"),
      email: item["email"] ? String(item["email"]) : null,
      whatsapp: null,
      service_id: null,
      service_title: item["subject"] ? String(item["subject"]) : null,
      project_name: null,
      description: item["message"] ? String(item["message"]) : null,
      platform: null,
      scope: null,
      budget: null,
      timeline: null,
      preferred_channel: null,
      attachment_url: null,
      locale: "en",
      source: "contact_form",
      status: String(item["statusState"] || "new"),
      admin_note: String(item["adminNote"] || ""),
      created_at: String(item["createdAt"] || new Date().toISOString()),
      updated_at: String(item["updatedAt"] || new Date().toISOString()),
    }));
  });

export const adminUpdateServiceRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status?: string; adminNote?: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);

    const apiBaseUrl = getBackendUrl();
    if (!apiBaseUrl) {
      throw new Error(
        "Phase 5 Backend API URL is not configured (VITE_PORTFOLIO_API_URL or PORTFOLIO_API_URL required for admin CRM operations)",
      );
    }

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...getAuthHeader(ctx),
    };

    if (data.status !== undefined) {
      const res = await fetch(`${apiBaseUrl}/api/v1/admin/requests/${data.id}/status`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ statusState: data.status }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update service request status: HTTP ${res.status}`);
      }
    }

    if (data.adminNote !== undefined) {
      const res = await fetch(`${apiBaseUrl}/api/v1/admin/requests/${data.id}/notes`, {
        method: "POST",
        headers,
        body: JSON.stringify({ adminNote: data.adminNote }),
      });
      if (!res.ok) {
        throw new Error(`Failed to update service request note: HTTP ${res.status}`);
      }
    }

    return { ok: true };
  });

export const adminDeleteServiceRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);

    const apiBaseUrl = getBackendUrl();
    if (!apiBaseUrl) {
      throw new Error(
        "Phase 5 Backend API URL is not configured (VITE_PORTFOLIO_API_URL or PORTFOLIO_API_URL required for admin CRM operations)",
      );
    }

    const res = await fetch(`${apiBaseUrl}/api/v1/admin/requests/${data.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...getAuthHeader(ctx),
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete service request: HTTP ${res.status}`);
    }

    return { ok: true };
  });
