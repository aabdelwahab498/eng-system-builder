import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdminContext, hasAdminRole, type AdminCtx } from "@/lib/security/admin-guard";

export type AuditEntry = {
  id: string;
  actorEmail: string | null;
  actorId: string | null;
  action: string;
  entity: string | null;
  entityId: string | null;
  details: Record<string, unknown>;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
};

/** Client-reportable events (session lifecycle). Anything else is rejected. */
const CLIENT_EVENTS = new Set([
  "auth.admin_signin",
  "auth.admin_signout",
  "auth.mfa_verified",
  "auth.mfa_enrolled",
  "auth.mfa_removed",
]);

export const adminListAuditLog = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { limit?: number; action?: string } | undefined) => ({
    limit: Math.min(Math.max(Number(input?.limit ?? 100), 1), 500),
    action: input?.action ? String(input.action).slice(0, 80) : undefined,
  }))
  .handler(async ({ data, context }): Promise<AuditEntry[]> => {
    const ctx = context as unknown as AdminCtx;
    await assertAdminContext(ctx);
    let query = ctx.supabase
      .from("admin_audit_log")
      .select("id, actor_id, actor_email, action, entity, entity_id, details, ip, user_agent, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit);
    if (data.action) query = query.eq("action", data.action);
    const { data: rows, error } = await query;
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: Record<string, unknown>) => ({
      id: String(r["id"]),
      actorId: (r["actor_id"] as string | null) ?? null,
      actorEmail: (r["actor_email"] as string | null) ?? null,
      action: String(r["action"]),
      entity: (r["entity"] as string | null) ?? null,
      entityId: (r["entity_id"] as string | null) ?? null,
      details: (r["details"] as Record<string, unknown>) ?? {},
      ip: (r["ip"] as string | null) ?? null,
      userAgent: (r["user_agent"] as string | null) ?? null,
      createdAt: String(r["created_at"]),
    }));
  });

/** Records a session-lifecycle event. Admin role required; MFA level is not,
 *  because sign-in and MFA verification happen before AAL2 exists. */
export const adminLogAuthEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { action: string }) => ({ action: String(input.action) }))
  .handler(async ({ data, context }) => {
    const ctx = context as unknown as AdminCtx;
    if (!CLIENT_EVENTS.has(data.action)) throw new Error("Unknown event");
    if (!(await hasAdminRole(ctx))) throw new Error("Forbidden");
    const { recordAudit } = await import("@/lib/security/audit.server");
    await recordAudit(ctx, data.action, {}, { entity: "auth" });
    return { ok: true };
  });
