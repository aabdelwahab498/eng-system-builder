import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdminContext, hasAdminRole, type AdminCtx } from "@/lib/security/admin-guard";

/**
 * MFA recovery codes for admin accounts.
 *
 * Codes are single-use, stored only as salted SHA-256 hashes, and never
 * readable again after generation. Redeeming a valid code removes the
 * enrolled TOTP factors (through the Auth Admin API) so the admin can
 * re-enrol a new authenticator — it never grants admin access by itself:
 * the caller must already hold a valid, admin-role Supabase session.
 */

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no ambiguous chars

function generateCode(): string {
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]!);
  return `${chars.slice(0, 4).join("")}-${chars.slice(4, 8).join("")}-${chars.slice(8, 12).join("")}`;
}

export function normalizeCode(code: string): string {
  return code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
}

export async function hashCode(userId: string, code: string): Promise<string> {
  const data = new TextEncoder().encode(`${userId}:${normalizeCode(code)}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const adminRecoveryStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const ctx = context as unknown as AdminCtx;
    if (!(await hasAdminRole(ctx))) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("admin_recovery_codes")
      .select("id, used_at")
      .eq("user_id", ctx.userId);
    const rows = (data ?? []) as { used_at: string | null }[];
    return { total: rows.length, remaining: rows.filter((r) => !r.used_at).length };
  });

/** Generates a fresh set of 10 codes and invalidates any previous set. */
export const adminGenerateRecoveryCodes = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ codes: string[] }> => {
    const ctx = context as unknown as AdminCtx;
    await assertAdminContext(ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const codes = Array.from({ length: 10 }, generateCode);
    const rows = await Promise.all(
      codes.map(async (code) => ({
        user_id: ctx.userId,
        code_hash: await hashCode(ctx.userId, code),
      })),
    );
    await supabaseAdmin.from("admin_recovery_codes").delete().eq("user_id", ctx.userId);
    const { error } = await supabaseAdmin.from("admin_recovery_codes").insert(rows);
    if (error) throw new Error(error.message);
    const { recordAudit } = await import("@/lib/security/audit.server");
    await recordAudit(ctx, "security.recovery_codes_generated", { count: codes.length }, {
      entity: "security",
    });
    return { codes };
  });

/**
 * Redeems one recovery code. Requires an authenticated admin session but NOT
 * AAL2 — that is the whole point of a recovery path. On success every TOTP
 * factor is deleted so the admin can enrol a new device.
 */
export const adminRedeemRecoveryCode = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { code: string }) => ({ code: String(input.code).slice(0, 40) }))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as AdminCtx;
    if (!(await hasAdminRole(ctx))) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const hash = await hashCode(ctx.userId, data.code);
    const { data: row } = await supabaseAdmin
      .from("admin_recovery_codes")
      .select("id, used_at")
      .eq("user_id", ctx.userId)
      .eq("code_hash", hash)
      .maybeSingle();
    const entry = row as { id: string; used_at: string | null } | null;
    const { recordAudit } = await import("@/lib/security/audit.server");
    if (!entry || entry.used_at) {
      await recordAudit(ctx, "security.recovery_code_rejected", {}, { entity: "security" });
      throw new Error("Invalid or already used recovery code");
    }
    await supabaseAdmin
      .from("admin_recovery_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", entry.id);

    // Remove enrolled authenticators so a new device can be paired.
    let removed = 0;
    try {
      const { data: factors } = await supabaseAdmin.auth.admin.mfa.listFactors({
        userId: ctx.userId,
      });
      for (const factor of factors?.factors ?? []) {
        await supabaseAdmin.auth.admin.mfa.deleteFactor({ id: factor.id, userId: ctx.userId });
        removed += 1;
      }
    } catch {
      // Factor cleanup is best effort; the code is already consumed.
    }
    await recordAudit(ctx, "security.recovery_code_used", { factorsRemoved: removed }, {
      entity: "security",
    });
    return { ok: true, factorsRemoved: removed };
  });
