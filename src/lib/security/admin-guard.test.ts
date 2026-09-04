import { describe, expect, it } from "vitest";
import { adminStatus, assertAdminContext, hasAdminRole, mfaSatisfied } from "./admin-guard";

type FactorStatus = "verified" | "unverified";

/** Minimal fake of the request-scoped Supabase client used by the guard. */
function ctx(options: {
  isAdmin: boolean;
  factor?: FactorStatus | null;
  aal?: "aal1" | "aal2";
  rpcError?: boolean;
}) {
  return {
    userId: "user-1",
    claims: { aal: options.aal ?? "aal1", email: "admin@example.com" },
    supabase: {
      rpc: async () => ({
        data: options.isAdmin,
        error: options.rpcError ? { message: "boom" } : null,
      }),
      auth: {
        mfa: {
          listFactors: async () => ({
            data: { totp: options.factor ? [{ id: "f1", status: options.factor }] : [] },
            error: null,
          }),
        },
      },
    },
  };
}

describe("hasAdminRole", () => {
  it("is false for an authenticated non-admin", async () => {
    expect(await hasAdminRole(ctx({ isAdmin: false }))).toBe(false);
  });
  it("is false when the role lookup fails (fail closed)", async () => {
    expect(await hasAdminRole(ctx({ isAdmin: true, rpcError: true }))).toBe(false);
  });
  it("is true for an admin", async () => {
    expect(await hasAdminRole(ctx({ isAdmin: true }))).toBe(true);
  });
});

describe("mfaSatisfied", () => {
  it("passes when no factor is enrolled", async () => {
    expect(await mfaSatisfied(ctx({ isAdmin: true, factor: null }))).toBe(true);
  });
  it("fails when a verified factor exists but the session is aal1", async () => {
    expect(await mfaSatisfied(ctx({ isAdmin: true, factor: "verified" }))).toBe(false);
  });
  it("passes once the session reached aal2", async () => {
    expect(await mfaSatisfied(ctx({ isAdmin: true, factor: "verified", aal: "aal2" }))).toBe(true);
  });
  it("ignores unverified factors", async () => {
    expect(await mfaSatisfied(ctx({ isAdmin: true, factor: "unverified" }))).toBe(true);
  });
});

describe("assertAdminContext", () => {
  it("rejects a non-admin", async () => {
    await expect(assertAdminContext(ctx({ isAdmin: false }))).rejects.toThrow("Forbidden");
  });
  it("rejects an admin whose MFA challenge is incomplete", async () => {
    await expect(
      assertAdminContext(ctx({ isAdmin: true, factor: "verified" })),
    ).rejects.toThrow(/MFA/);
  });
  it("allows an admin with no MFA enrolled", async () => {
    await expect(assertAdminContext(ctx({ isAdmin: true }))).resolves.toBeUndefined();
  });
  it("allows an admin with a completed MFA challenge", async () => {
    await expect(
      assertAdminContext(ctx({ isAdmin: true, factor: "verified", aal: "aal2" })),
    ).resolves.toBeUndefined();
  });
});

describe("adminStatus", () => {
  it("reports mfaRequired for an enrolled admin on an aal1 session", async () => {
    expect(await adminStatus(ctx({ isAdmin: true, factor: "verified" }))).toEqual({
      isAdmin: true,
      mfaEnrolled: true,
      mfaRequired: true,
    });
  });
  it("reports nothing privileged for a non-admin", async () => {
    expect(await adminStatus(ctx({ isAdmin: false }))).toEqual({
      isAdmin: false,
      mfaEnrolled: false,
      mfaRequired: false,
    });
  });
});
