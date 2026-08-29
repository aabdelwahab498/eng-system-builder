# API Contract Gap Register (V1)

This document formalizes all identified technical gaps between the existing TanStack/Lovable frontend and the standalone ASP.NET Core backend API.

---

## GAP 1 — Authentication & Token Scheme Alignment

- **Gap Description:** Current backend validates JWTs using a local symmetric key (`Jwt:SecretKey`), while current frontend relies on Supabase Auth (RS256/HS256 tokens signed by Supabase).
- **Evidence:** `src/integrations/supabase/auth-middleware.ts` vs `backend/src/Portfolio.Api/Program.cs`.
- **Frontend Dependency:** `src/routes/auth.tsx`, `useSupabaseAuth`, Supabase OAuth.
- **Backend Dependency:** `builder.Services.AddAuthentication().AddJwtBearer()`.
- **Required Contract:** Introduce `POST /api/v1/auth/login` endpoint issuing ASP.NET Core JWTs, or configure backend JwtBearer options to validate Supabase JWKS/tokens during transition.
- **Implementation Phase:** Phase 2 Contract Implementation.
- **Risk Level:** High
- **Migration Order:** 1 (Prerequisite for admin endpoints cutover).

---

## GAP 2 — Blog Articles CMS Representation

- **Gap Description:** Frontend loads articles from Supabase table `content_items` (`kind = 'article'`). Backend lacks an `ArticleEntity` and `/api/v1/articles` controller.
- **Evidence:** `src/lib/cms/public.functions.ts` (`listPublicArticles`, `getPublicArticle`).
- **Frontend Dependency:** `src/routes/$locale.blog.index.tsx`, `src/routes/$locale.blog.$slug.tsx`.
- **Backend Dependency:** Missing `ArticleEntity` in EF Core `PortfolioDbContext`.
- **Required Contract:**
  - `GET /api/v1/articles`
  - `GET /api/v1/articles/{slug}`
  - `GET/POST/PUT/DELETE /api/v1/admin/articles`
- **Implementation Phase:** Phase 2 Contract Implementation.
- **Risk Level:** Medium
- **Migration Order:** 2

---

## GAP 3 — Site Announcements Domain Representation

- **Gap Description:** Frontend loads active announcements from Supabase table `content_items` (`kind = 'announcement'`) with date window logic (`startsAt`, `endsAt`). Backend lacks an `AnnouncementEntity`.
- **Evidence:** `src/lib/cms/public.functions.ts` (`listPublicAnnouncements`).
- **Frontend Dependency:** Global banner component & home page notices.
- **Backend Dependency:** Missing `AnnouncementEntity` in `PortfolioDbContext`.
- **Required Contract:**
  - `GET /api/v1/announcements`
  - `GET/POST/PUT/DELETE /api/v1/admin/announcements`
- **Implementation Phase:** Phase 2 Contract Implementation.
- **Risk Level:** Low
- **Migration Order:** 3

---

## GAP 4 — Media Binary Upload & Streaming Ownership

- **Gap Description:** Backend manages media metadata (`media_assets` table via `/api/v1/admin/media`), but binary image files are stored in Supabase Storage `media` bucket.
- **Evidence:** `src/lib/cms/admin.functions.ts` (`adminDeleteMedia` calling `supabase.storage.from("media")`).
- **Frontend Dependency:** `src/routes/_authenticated/admin.media.tsx`, `src/routes/api/public/media.$.ts`.
- **Backend Dependency:** Needs file upload endpoint and physical/cloud storage provider (Local Disk / S3 / MinIO).
- **Required Contract:**
  - `POST /api/v1/admin/media/upload` (Multipart form payload returning `AdminMediaAssetDto`)
  - `GET /api/public/media/{*storagePath}` (Binary stream server)
- **Implementation Phase:** Phase 2 Contract Implementation.
- **Risk Level:** Medium
- **Migration Order:** 4

---

## GAP 5 — Contact Form Payload Normalization

- **Gap Description:** Frontend contact forms submit camelCase payloads (`clientName`, `serviceId`, `description`), while backend `POST /api/v1/contact` expects `ContactMessageRequest` (`Name`, `Email`, `Subject`, `Message`).
- **Evidence:** `src/lib/crm/requests.functions.ts` (`submitServiceRequest`) vs `backend/src/Portfolio.Api/Controllers/PublicControllers.cs` (`ContactController`).
- **Frontend Dependency:** `src/lib/crm/requests.functions.ts`.
- **Backend Dependency:** `ContactMessageRequest` validation rules in `Portfolio.Application`.
- **Required Contract:** Update `ContactMessageRequest` DTO and validator to accept normalized property names or JSON property alias attributes.
- **Implementation Phase:** Phase 2 Contract Implementation.
- **Risk Level:** Low
- **Migration Order:** 5
