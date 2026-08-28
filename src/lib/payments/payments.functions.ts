import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { createClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PaymentSubmissionRow = {
  id: string;
  client_name: string;
  email: string | null;
  whatsapp: string | null;
  service_id: string | null;
  service_title: string | null;
  project_name: string | null;
  amount: string | null;
  currency: string | null;
  method_id: string | null;
  proof_path: string | null;
  proof_filename: string | null;
  proof_type: string | null;
  proof_size_bytes: number | null;
  status: string;
  note: string;
  created_at: string;
  updated_at: string;
};

export const PAYMENT_STATUS_OPTIONS = [
  { value: "pending_review", label: "Pending review" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "needs_more_information", label: "Needs more information" },
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

const text = (value: unknown, max = 1000) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

export type SubmitPaymentInput = {
  clientName?: string | undefined;
  email?: string | undefined;
  whatsapp?: string | undefined;
  serviceId?: string | undefined;
  serviceTitle?: string | undefined;
  projectName?: string | undefined;
  amount?: string | undefined;
  currency?: string | undefined;
  methodId?: string | undefined;
  proofPath?: string | undefined;
  proofFilename?: string | undefined;
  proofType?: string | undefined;
  proofSizeBytes?: number | undefined;
  locale?: string | undefined;
};

/**
 * Public: records a payment proof via the Phase 6 backend API.
 * The backend handles creating the payment submission and mirroring into the CRM inbox.
 */
export const submitPaymentProof = createServerFn({ method: "POST" })
  .inputValidator((input: SubmitPaymentInput) => input)
  .handler(async ({ data }) => {
    const apiBaseUrl = getBackendUrl();
    if (!apiBaseUrl) {
      throw new Error(
        "Phase 6 Backend API URL is not configured (VITE_PORTFOLIO_API_URL or PORTFOLIO_API_URL required for payment operations)",
      );
    }

    const proofPath = text(data.proofPath, 500) || undefined;
    if (proofPath && (proofPath.includes("..") || !proofPath.startsWith("proofs/"))) {
      throw new Error("Invalid proof path");
    }

    const payload = {
      clientName: text(data.clientName, 120) || undefined,
      email: text(data.email, 255) || undefined,
      whatsapp: text(data.whatsapp, 40) || undefined,
      serviceId: text(data.serviceId, 80) || undefined,
      serviceTitle: text(data.serviceTitle, 160) || undefined,
      projectName: text(data.projectName, 160) || undefined,
      amount: text(data.amount, 40) || undefined,
      currency: text(data.currency, 8) || undefined,
      methodId: text(data.methodId, 80) || undefined,
      proofPath,
      proofFilename: text(data.proofFilename, 255) || undefined,
      proofType: text(data.proofType, 80) || undefined,
      proofSizeBytes:
        typeof data.proofSizeBytes === "number" && Number.isFinite(data.proofSizeBytes)
          ? Math.max(0, Math.floor(data.proofSizeBytes))
          : undefined,
      locale: text(data.locale, 5) || undefined,
    };

    const res = await fetch(`${apiBaseUrl}/api/v1/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const errMsg = errJson?.error?.message || `HTTP ${res.status} ${res.statusText}`;
      throw new Error(`Failed to submit payment proof: ${errMsg}`);
    }

    return { ok: true };
  });

export const adminListPaymentSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PaymentSubmissionRow[]> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);

    const apiBaseUrl = getBackendUrl();
    if (!apiBaseUrl) {
      throw new Error(
        "Phase 6 Backend API URL is not configured (VITE_PORTFOLIO_API_URL or PORTFOLIO_API_URL required for admin payment operations)",
      );
    }

    const authHeaders = getAuthHeader(ctx);
    const res = await fetch(`${apiBaseUrl}/api/v1/admin/payments`, {
      headers: {
        Accept: "application/json",
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(
        `Failed to list payment submissions from backend API: HTTP ${res.status} ${errText}`,
      );
    }

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new Error("Invalid response envelope from backend API for payments");
    }

    return json.data.map((item: Record<string, unknown>) => ({
      id: String(item["id"] ?? ""),
      client_name: String(item["clientName"] || "Website visitor"),
      email: item["email"] ? String(item["email"]) : null,
      whatsapp: item["whatsapp"] ? String(item["whatsapp"]) : null,
      service_id: item["serviceId"] ? String(item["serviceId"]) : null,
      service_title: item["serviceTitle"] ? String(item["serviceTitle"]) : null,
      project_name: item["projectName"] ? String(item["projectName"]) : null,
      amount: item["amount"] ? String(item["amount"]) : null,
      currency: item["currency"] ? String(item["currency"]) : null,
      method_id: item["methodId"] ? String(item["methodId"]) : null,
      proof_path: item["proofPath"] ? String(item["proofPath"]) : null,
      proof_filename: item["proofFilename"] ? String(item["proofFilename"]) : null,
      proof_type: item["proofType"] ? String(item["proofType"]) : null,
      proof_size_bytes: typeof item["proofSizeBytes"] === "number" ? item["proofSizeBytes"] : null,
      status: String(item["statusState"] || "pending_review"),
      note: String(item["adminNote"] || ""),
      created_at: String(item["createdAt"] || new Date().toISOString()),
      updated_at: String(item["updatedAt"] || new Date().toISOString()),
    }));
  });

export const adminUpdatePaymentSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status?: string; note?: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);

    const apiBaseUrl = getBackendUrl();
    if (!apiBaseUrl) {
      throw new Error(
        "Phase 6 Backend API URL is not configured (VITE_PORTFOLIO_API_URL or PORTFOLIO_API_URL required for admin payment operations)",
      );
    }

    const authHeaders = getAuthHeader(ctx);

    if (data.status !== undefined) {
      const res = await fetch(`${apiBaseUrl}/api/v1/admin/payments/${data.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ statusState: text(data.status, 40) }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(
          `Failed to update payment status via backend API: HTTP ${res.status} ${errText}`,
        );
      }
    }

    if (data.note !== undefined) {
      const res = await fetch(`${apiBaseUrl}/api/v1/admin/payments/${data.id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({ adminNote: text(data.note, 4000) }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(
          `Failed to update payment note via backend API: HTTP ${res.status} ${errText}`,
        );
      }
    }

    return { ok: true };
  });

export const adminDeletePaymentSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);

    const apiBaseUrl = getBackendUrl();
    if (!apiBaseUrl) {
      throw new Error(
        "Phase 6 Backend API URL is not configured (VITE_PORTFOLIO_API_URL or PORTFOLIO_API_URL required for admin payment operations)",
      );
    }

    const authHeaders = getAuthHeader(ctx);

    // Optional proof cleanup from private Supabase bucket
    const { data: row } = await ctx.supabase
      .from("payment_submissions")
      .select("proof_path")
      .eq("id", data.id)
      .maybeSingle();
    const proofPath = (row as { proof_path?: string | null } | null)?.proof_path;
    if (proofPath) {
      await ctx.supabase.storage
        .from("payment-proofs")
        .remove([proofPath])
        .catch(() => null);
    }

    const res = await fetch(`${apiBaseUrl}/api/v1/admin/payments/${data.id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      throw new Error(
        `Failed to delete payment submission via backend API: HTTP ${res.status} ${errText}`,
      );
    }

    return { ok: true };
  });

/** Admin: short-lived signed URL so a proof image can be viewed from the private bucket. */
export const adminGetPaymentProofUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { path: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const path = text(data.path, 500);
    if (!path || path.includes("..")) throw new Error("Invalid path");
    const { data: signed, error } = await ctx.supabase.storage
      .from("payment-proofs")
      .createSignedUrl(path, 300);
    if (error || !signed?.signedUrl) throw new Error("Could not load the proof file");
    return { url: signed.signedUrl as string };
  });
