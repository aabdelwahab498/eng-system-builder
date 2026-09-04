/**
 * Shared server-side authorization guard for every admin server function.
 *
 * Two independent checks, both server-side:
 *  1. the caller has the `admin` role (database `has_role`, security definer)
 *  2. if the caller enrolled a TOTP factor, the session must be AAL2
 *     (i.e. the MFA challenge was actually completed for this session)
 *
 * The external portfolio API token plays no part here: authorization is
 * derived only from the verified Supabase access token of the request.
 */
export type AdminCtx = {
  supabase: any;
  userId: string;
  claims?: Record<string, unknown>;
};

export async function hasAdminRole(context: AdminCtx): Promise<boolean> {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  return !error && Boolean(data);
}

/** True when the user enrolled at least one verified TOTP factor. */
export async function hasVerifiedMfaFactor(context: AdminCtx): Promise<boolean> {
  try {
    const { data, error } = await context.supabase.auth.mfa.listFactors();
    if (error) return false;
    const all = [...(data?.totp ?? []), ...(data?.all ?? [])];
    return all.some((f: { status?: string }) => f?.status === "verified");
  } catch {
    return false;
  }
}

/** MFA is satisfied when no factor is enrolled, or the session reached AAL2. */
export async function mfaSatisfied(context: AdminCtx): Promise<boolean> {
  const aal = (context.claims?.["aal"] as string | undefined) ?? "aal1";
  if (aal === "aal2") return true;
  return !(await hasVerifiedMfaFactor(context));
}

export async function adminStatus(context: AdminCtx) {
  const isAdmin = await hasAdminRole(context);
  if (!isAdmin) return { isAdmin: false, mfaEnrolled: false, mfaRequired: false };
  const mfaEnrolled = await hasVerifiedMfaFactor(context);
  const aal = (context.claims?.["aal"] as string | undefined) ?? "aal1";
  return { isAdmin: true, mfaEnrolled, mfaRequired: mfaEnrolled && aal !== "aal2" };
}

/** Throws unless the caller is an admin with a fully elevated session. */
export async function assertAdminContext(context: AdminCtx): Promise<void> {
  if (!(await hasAdminRole(context))) throw new Error("Forbidden");
  if (!(await mfaSatisfied(context))) throw new Error("Forbidden: MFA verification required");
}
