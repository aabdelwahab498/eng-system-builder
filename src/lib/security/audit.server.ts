/**
 * Server-only admin audit trail.
 *
 * Entries are written with the service-role client so the log cannot be
 * altered or deleted from the app (no INSERT/UPDATE/DELETE grants exist for
 * `authenticated`; admins may only read it). Logging never blocks or fails an
 * admin action — a broken log must not lock the admin out.
 */
import { getRequestHeader } from "@tanstack/react-start/server";

export type AuditActor = { userId: string; claims?: Record<string, unknown> };

function requestMeta() {
  try {
    const forwarded = getRequestHeader("x-forwarded-for") ?? "";
    const ip =
      getRequestHeader("cf-connecting-ip") ??
      (forwarded ? forwarded.split(",")[0]!.trim() : null);
    const userAgent = getRequestHeader("user-agent") ?? null;
    return { ip, userAgent };
  } catch {
    return { ip: null, userAgent: null };
  }
}

export async function recordAudit(
  actor: AuditActor,
  action: string,
  details?: Record<string, unknown>,
  entity?: { entity?: string; entityId?: string },
): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { ip, userAgent } = requestMeta();
    await supabaseAdmin.from("admin_audit_log").insert({
      actor_id: actor.userId,
      actor_email: (actor.claims?.["email"] as string | undefined) ?? null,
      action,
      entity: entity?.entity ?? action.split(".")[0] ?? null,
      entity_id: entity?.entityId ?? (details?.["id"] as string | undefined) ?? null,
      details: (details ?? {}) as Record<string, unknown>,
      ip,
      user_agent: userAgent,
    });
  } catch {
    // Never surface audit failures to the caller.
  }
}
