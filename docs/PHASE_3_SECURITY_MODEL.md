# Phase 3 — Security Model & Architecture Specification

## 1. Authentication Provider & Token Validation

* **Provider:** Supabase Auth (`@supabase/supabase-js`) issuing standard 3-part RSA/HS256 Bearer JWT tokens.
* **Backend Validation:** ASP.NET Core `Microsoft.AspNetCore.Authentication.JwtBearer` validates incoming `Authorization: Bearer <token>` headers cryptographically.
* **Token Parameters:** Cryptographically verifies signing key, issuer (`Jwt:Issuer`), audience (`Jwt:Audience`), and expiration (`ValidateLifetime = true`, `ClockSkew = TimeSpan.Zero`).

---

## 2. Trust Boundary & Identity Mapping

* **Trust Rule:** The backend ONLY trusts claims extracted from a cryptographically validated JWT. Client-supplied headers (e.g. `X-Admin: true`) or request body user IDs are explicitly rejected for authorization decisions.
* **Identity Mapping:**
  * `JWT Subject (sub)` $\rightarrow$ Application User Identity (`User.FindFirstValue(ClaimTypes.NameIdentifier)`)
  * `JWT Role Claim (role / ClaimTypes.Role)` $\rightarrow$ ASP.NET Core Role Principal (`admin`, `user`).

---

## 3. Policy-Based Authorization

* **`AuthenticatedUser` Policy:** Requires `ClaimsPrincipal.Identity.IsAuthenticated == true`.
* **`Administrator` Policy:** Requires `ClaimsPrincipal.Identity.IsAuthenticated == true` AND `User.IsInRole("admin")` or `User.IsInRole("Administrator")`.

---

## 4. API Surface Separation

* **Public APIs (`/api/v1/*`):** `ProfileController`, `ProjectsController`, `ExperienceController`, `EducationController`, `SkillsController`, `ServicesController`, `ProductsController`, `CoursesController`. Unauthenticated, read-only.
* **Admin APIs (`/api/v1/admin/*`):** `AdminController` protected by `[Authorize(Policy = "Administrator")]`.
  * `GET /api/v1/admin/audit-logs`
  * `POST /api/v1/admin/projects`

---

## 5. Audit Logging Architecture

* **Entity:** `AuditLogEntity`
* **Recorded Parameters:**
  * `User`: Actor ID extracted from JWT token
  * `Action`: Administrative operation (e.g. `CREATE_PROJECT`)
  * `EntityName` & `EntityId`: Modified target
  * `CorrelationId`: `HttpContext.TraceIdentifier`
  * `IpAddress`: Remote IP address
  * `UserAgent`: Client request user agent
  * `Success`: Boolean execution status
  * `MetadataJson`: Non-sensitive context metadata
* **Redaction Policy:** Passwords, Bearer tokens, secrets, and private keys are strictly prohibited from audit logs.

---

## 6. CORS & Security Middleware

* **CORS:** Restricted to trusted origins (`http://localhost:3000`, `http://localhost:5173`, `http://localhost:8080`). No wildcard `*` with credentials.
* **Security Headers:**
  * `X-Content-Type-Options: nosniff`
  * `X-Frame-Options: DENY`
  * `X-XSS-Protection: 1; mode=block`
  * `Referrer-Policy: strict-origin-when-cross-origin`

---

## 7. Rate Limiting Evaluation

* **Decision:** Basic connection level throttling is managed by NGINX / reverse proxy. Rate limiting is NOT applied to public portfolio GET endpoints to avoid degrading user experience during high traffic. Sensitive admin endpoints are protected by authentication, authorization, and audit logging.

---

## 8. Threat Model & Known Security Limitations

1. **Supabase Auth Dependency:** Authentication relies on Supabase Auth token issuance. A future migration phase can transition to an independent OAuth2 / OpenID Connect authority if desired.
2. **Secret Management:** Production environments MUST override `Jwt:SecretKey`, `Jwt:Issuer`, and `Jwt:Audience` via environment variables. Development fallback key is strictly for local dev/testing.
