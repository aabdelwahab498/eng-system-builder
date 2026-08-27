import { createServerFn } from "@tanstack/react-start";
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

const COLUMNS =
  "id, client_name, email, whatsapp, service_id, service_title, project_name, amount, currency, method_id, proof_path, proof_filename, proof_type, proof_size_bytes, status, note, created_at, updated_at";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Ctx = { supabase: any; userId: string };

async function assertAdmin(context: Ctx) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !data) throw new Error("Forbidden");
}

/** Anon client for the public submission endpoint (INSERT-only by RLS). */
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
 * Public: records a payment proof after the visitor uploaded the file to the
 * payment-proofs bucket. Also lands a lead in the service-requests inbox with
 * the proof attached, so the admin sees the payment next to the request.
 */
export const submitPaymentProof = createServerFn({ method: "POST" })
  .inputValidator((input: SubmitPaymentInput) => input)
  .handler(async ({ data }) => {
    const db = publicClient();
    const proofPath = text(data.proofPath, 500) || null;
    if (proofPath && (proofPath.includes("..") || !proofPath.startsWith("proofs/"))) {
      throw new Error("Invalid proof path");
    }

    const row = {
      client_name: text(data.clientName, 120) || "Website visitor",
      email: text(data.email, 255) || null,
      whatsapp: text(data.whatsapp, 40) || null,
      service_id: text(data.serviceId, 80) || null,
      service_title: text(data.serviceTitle, 160) || null,
      project_name: text(data.projectName, 160) || null,
      amount: text(data.amount, 40) || null,
      currency: text(data.currency, 8) || null,
      method_id: text(data.methodId, 80) || null,
      proof_path: proofPath,
      proof_filename: text(data.proofFilename, 255) || null,
      proof_type: text(data.proofType, 80) || null,
      proof_size_bytes:
        typeof data.proofSizeBytes === "number" && Number.isFinite(data.proofSizeBytes)
          ? Math.max(0, Math.floor(data.proofSizeBytes))
          : null,
    };

    const { error } = await db.from("payment_submissions").insert(row);
    if (error) throw new Error("Could not submit the payment proof");

    // Mirror into the requests inbox so the proof shows next to the lead.
    await db.from("service_requests").insert({
      client_name: row.client_name,
      email: row.email,
      whatsapp: row.whatsapp,
      service_id: row.service_id,
      service_title: row.service_title,
      project_name: row.project_name,
      description: `Payment proof submitted${row.amount ? ` — ${row.amount} ${row.currency ?? ""}` : ""}${row.method_id ? ` via ${row.method_id}` : ""}.`,
      budget: row.amount && row.currency ? `${row.amount} ${row.currency}` : row.amount,
      preferred_channel: row.whatsapp ? "whatsapp" : row.email ? "email" : null,
      attachment_url: proofPath,
      locale: text(data.locale, 5) || "en",
      source: "pay_page",
      status: "deposit_pending",
    });

    return { ok: true };
  });

export const adminListPaymentSubmissions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PaymentSubmissionRow[]> => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { data, error } = await ctx.supabase
      .from("payment_submissions")
      .select(COLUMNS)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as PaymentSubmissionRow[];
  });

export const adminUpdatePaymentSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status?: string; note?: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const patch: Record<string, unknown> = {};
    if (data.status !== undefined) patch["status"] = text(data.status, 40);
    if (data.note !== undefined) patch["note"] = text(data.note, 4000);
    const { error } = await ctx.supabase
      .from("payment_submissions")
      .update(patch)
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeletePaymentSubmission = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as Ctx;
    await assertAdmin(ctx);
    const { data: row } = await ctx.supabase
      .from("payment_submissions")
      .select("proof_path")
      .eq("id", data.id)
      .maybeSingle();
    const proofPath = (row as { proof_path?: string | null } | null)?.proof_path;
    if (proofPath) {
      await ctx.supabase.storage.from("payment-proofs").remove([proofPath]);
    }
    const { error } = await ctx.supabase.from("payment_submissions").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
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
