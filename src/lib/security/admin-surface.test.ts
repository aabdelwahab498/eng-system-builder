import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Structural integration tests over the whole admin surface.
 *
 * They assert the two boundaries that actually enforce access:
 *  1. every /admin deep link lives under the `_authenticated` gate, which
 *     redirects unauthenticated visitors to /auth;
 *  2. every exported admin server function runs `requireSupabaseAuth` and the
 *     shared server-side guard (admin role + MFA level), so calling the RPC
 *     endpoint directly cannot bypass the frontend route.
 */

const ROUTES_DIR = path.resolve(process.cwd(), "src/routes");
const AUTH_DIR = path.join(ROUTES_DIR, "_authenticated");

const adminRouteFiles = readdirSync(AUTH_DIR).filter((f) => f.startsWith("admin"));

describe("/admin route protection", () => {
  it("has admin routes to protect", () => {
    expect(adminRouteFiles.length).toBeGreaterThan(10);
  });

  it("keeps the _authenticated gate redirecting to /auth", () => {
    const gate = readFileSync(path.join(AUTH_DIR, "route.tsx"), "utf8");
    expect(gate).toContain("supabase.auth.getUser()");
    expect(gate).toMatch(/redirect\(\{\s*to:\s*"\/auth"/);
    expect(gate).toContain("ssr: false");
  });

  it("declares every admin deep link under /_authenticated", () => {
    for (const file of adminRouteFiles) {
      if (file === "route.tsx") continue;
      const source = readFileSync(path.join(AUTH_DIR, file), "utf8");
      expect(source, file).toMatch(/createFileRoute\("\/_authenticated\/admin/);
    }
  });

  it("defines no admin route outside the gate", () => {
    const strays = readdirSync(ROUTES_DIR).filter((f) => f.startsWith("admin"));
    expect(strays).toEqual([]);
  });

  it("guards the admin shell with a role check and an MFA challenge", () => {
    const shell = readFileSync(path.join(AUTH_DIR, "admin.tsx"), "utf8");
    expect(shell).toContain("adminIsAdmin");
    expect(shell).toContain("MfaChallenge");
  });
});

const FUNCTION_FILES = [
  "src/lib/cms/admin.functions.ts",
  "src/lib/payments/payments.functions.ts",
  "src/lib/crm/requests.functions.ts",
  "src/lib/security/audit.functions.ts",
  "src/lib/security/recovery.functions.ts",
];

/** Functions whose authorization is intentionally weaker than full AAL2. */
const ROLE_ONLY = new Set([
  "adminIsAdmin", // reports status to the shell; returns no privileged data
  "adminLogAuthEvent", // runs before AAL2 exists
  "adminRecoveryStatus",
  "adminRedeemRecoveryCode", // the recovery path itself
]);

function blocksFor(source: string) {
  const parts = source.split(/export const /).slice(1);
  return parts
    .map((part) => ({ name: part.slice(0, part.indexOf(" ")), body: part }))
    .filter((b) => b.name.startsWith("admin") && b.body.includes("createServerFn"));
}

describe("protected admin server functions", () => {
  const all = FUNCTION_FILES.flatMap((file) =>
    blocksFor(readFileSync(path.resolve(process.cwd(), file), "utf8")).map((b) => ({
      ...b,
      file,
    })),
  );

  it("discovers the admin server functions", () => {
    expect(all.length).toBeGreaterThan(15);
  });

  it("requires an authenticated Supabase session on every one", () => {
    for (const fn of all) {
      expect(fn.body, `${fn.file}:${fn.name}`).toContain("requireSupabaseAuth");
    }
  });

  it("runs a server-side authorization check on every one", () => {
    for (const fn of all) {
      const hasGuard =
        fn.body.includes("assertAdmin") ||
        fn.body.includes("hasAdminRole") ||
        fn.body.includes("adminStatus");
      expect(hasGuard, `${fn.file}:${fn.name}`).toBe(true);
    }
  });

  it("enforces the MFA-elevated guard except on documented recovery paths", () => {
    for (const fn of all) {
      if (ROLE_ONLY.has(fn.name)) continue;
      expect(fn.body.includes("assertAdmin"), `${fn.file}:${fn.name}`).toBe(true);
    }
  });

  it("never trusts the external API token for authorization", () => {
    for (const file of FUNCTION_FILES) {
      const source = readFileSync(path.resolve(process.cwd(), file), "utf8");
      expect(source, file).not.toContain("loginAdminApi");
      expect(source, file).not.toMatch(/localStorage/);
    }
  });
});

describe("admin discovery mechanisms", () => {
  it("has no reveal shortcut or ?admin=1 mechanism left", () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory()
          ? walk(path.join(dir, e.name))
          : /\.(ts|tsx)$/.test(e.name)
            ? [path.join(dir, e.name)]
            : [],
      );
    const offenders = walk(path.resolve(process.cwd(), "src"))
      .filter((file) => !file.endsWith(".test.ts"))
      .filter((file) => {
      const source = readFileSync(file, "utf8");
      return /admin=1/.test(source) || /useHiddenAdmin/.test(source);
    });
    expect(offenders).toEqual([]);
  });
});
