# Admin protection: Cloudflare Access + rate limiting

Applies to `https://nextnext-gen.com`. Nothing here is configured automatically —
these are the exact settings to apply in the Cloudflare dashboard.

## 1. What may and may not be protected

| Path | Cloudflare Access | Why |
| --- | --- | --- |
| `/admin`, `/admin/*` | **Protect** | Admin UI only. Safe to gate. |
| `/auth` | **Do NOT protect** | Google OAuth returns to this URL. Gating it breaks sign-in. |
| `/api/public/*` | **Do NOT protect** | Webhooks and public endpoints; they authenticate themselves. |
| `/_serverFn/*` | **Do NOT protect** | Every page (public pages included) calls server functions through this path. Authorization already happens server-side. |
| `/en/*`, `/ar/*`, `/`, assets | **Do NOT protect** | Public site. |

Access in front of `/admin/*` is compatible with the app: the app's own
Supabase session lives in `localStorage` and is unaffected by the Access
cookie, and the admin data calls do not go through `/admin/*` (they go through
`/_serverFn/*`, which remains guarded server-side by role + MFA).

## 2. Cloudflare Access application

Zero Trust → Access → Applications → **Add an application** → *Self-hosted*.

- Application name: `NextGen Admin`
- Session duration: `8 hours` (or shorter)
- Application domain 1: `nextnext-gen.com` — path `admin`
- Application domain 2: `nextnext-gen.com` — path `admin/*`
- Identity providers: One-time PIN (email) and/or Google
- Options: leave *Bypass options* off; do not enable "Enable Application in App Launcher" if you want it unlisted.

Policy:

- Name: `Admin only`
- Action: `Allow`
- Include → `Emails` → your admin email address(es)
- Require (recommended) → `Login Method` → your IdP with MFA enforced
- Optionally Require → `Country` → Egypt (only if you never travel)

Add a second policy `Block everyone else` with Action `Block`, Include →
`Everyone`, placed **after** the allow policy.

> Do **not** add an application, bypass rule, or policy for `/auth`,
> `/api/public/*`, or `/_serverFn/*`.

## 3. Rate limiting the login endpoint

Security → **WAF** → Rate limiting rules → *Create rule*.

Rule A — Supabase auth calls from the browser (if auth traffic is proxied
through your domain):

- Name: `Auth login throttle`
- Expression: `(http.request.uri.path contains "/auth/v1/token") or (http.request.uri.path eq "/auth" and http.request.method eq "POST")`
- Characteristics: `IP`
- Period: `1 minute`, Requests: `5`
- Action: `Block`, Duration: `10 minutes`

Rule B — admin surface probing:

- Expression: `starts_with(http.request.uri.path, "/admin")`
- Characteristics: `IP`
- Period: `1 minute`, Requests: `30`
- Action: `Managed Challenge`

Rule C — server function abuse (keep it generous, public pages use it too):

- Expression: `starts_with(http.request.uri.path, "/_serverFn")`
- Characteristics: `IP`
- Period: `1 minute`, Requests: `300`
- Action: `Managed Challenge`

If Supabase Auth is reached directly at its own hostname (the default), Rule A
cannot apply — brute-force protection then relies on the auth provider's own
limits. Keep signups disabled and leaked-password protection on.

## 4. Bot & general hardening

- Security → Settings → Bot Fight Mode: **On**.
- Always Use HTTPS: **On**; Minimum TLS: **1.2**.
- Do not enable "Cache Everything" for `/admin*` or `/_serverFn*`.

## 5. Verification checklist

1. Signed out, open `https://nextnext-gen.com/admin` → Cloudflare Access login → after passing it, the app redirects to `/auth`.
2. Google sign-in on `/auth` completes without an Access prompt.
3. A public page (`/en`, `/en/projects`) loads with no Access prompt.
4. Six failed logins in a minute from one IP get blocked (Rule A) or challenged.
5. Admin dashboard, audit log and content saves all work while Access is on.
