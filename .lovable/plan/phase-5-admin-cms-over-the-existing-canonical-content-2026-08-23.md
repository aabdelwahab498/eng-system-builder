# Phase 5 — Admin CMS over the existing canonical content

## What currently exists (inspected, not assumed)

- **Canonical schema** — `src/content/schema/index.ts` (387 lines): `Localized<T>` (`ar: null` = translation required), `Tracked<T>` (`status` + `provenance` + `visibility{public,portfolio,cv,linkedin}`), `isPublishable()`, and models for Profile, Experience, Education, Skills, Projects, Products, Services, CV, LinkedIn.
- **Canonical data** — `src/content/canonical/*.ts`, hand-authored TypeScript modules. `cv.ts` and `linkedin.ts` are derived views, not copies.
- **Access boundary** — `src/content/api.ts`. Every canonical getter already applies the publish filter. UI reads through it.
- **UI dictionaries** — `src/content/en|ar/index.ts` feed nav/labels/meta via `useLocale()`; separate concern from canonical entities.
- **Routing** — TanStack Start, locale-prefixed `src/routes/$locale.*`, plus `src/routes/index.tsx` redirect. SEO helpers in `src/lib/seo.ts`.
- **Backend** — none. No `src/integrations/`, no auth, no database, no storage. This is the blocking gap: a real admin needs real auth + persistence.

## Integration principle

The Admin never gets its own content model. It edits rows that the **same** canonical types describe, and `src/content/api.ts` stays the only thing the public UI talks to:

```text
Admin UI ──> server functions ──> Cloud DB ─┐
                                            ├─> content/api.ts ──> Portfolio / CV / LinkedIn / SEO
TypeScript canonical modules (seed/fallback)┘
```

`api.ts` becomes async-capable and reads through a **repository adapter**. Two adapters: `typescript` (current modules, read-only) and `cloud` (database). Public components keep calling the same getters, so nothing in Phase 4 is redesigned.

## Backend: enable Lovable Cloud

Required, not optional — it supplies real authentication, a Postgres database with row-level security, and file storage for the media library. Without it the only honest options are a read-only admin or fake auth, and fake auth is out of scope by your own rules.

- Auth: email+password sign-in at `/admin/login`, single owner account; an `admin` role in a separate `user_roles` table checked server-side via a security-definer function. No credentials in frontend code.
- Every write goes through an authenticated server function that re-checks the admin role. Route guards are UX only.
- Tables mirror the canonical entities: `profile`, `experience`, `education`, `skill_groups`, `projects`, `products`, `services`, `articles`, `announcements`, `media`, `seo_overrides`, `cv_settings`, `social_drafts` — each carrying `status`, `visibility`, `provenance`, `created_at/updated_at/published_at`, and localized `*_en` / `*_ar` columns (Arabic nullable = "translation required").
- Public reads: anon SELECT policies restricted to published+public rows. Draft content is unreachable from the browser, not merely hidden.

## Admin surface

Routes under `/admin` (outside the `$locale` tree, not in public nav, `noindex`):
`/admin`, `/profile`, `/experience`, `/education`, `/skills`, `/projects`, `/products`, `/services`, `/blog`, `/announcements`, `/media`, `/seo`, `/cv`, `/social`, plus `/admin/login`.

Shell: fixed sidebar + topbar (admin status, locale toggle, theme, "Preview site", sign out). Dense, functional visual language reusing the existing design tokens — no motion, no editorial styling. Dashboard shows counts computed from real rows only.

Each entity screen: filterable list → editor form with EN/AR tabs and an explicit translation-status badge → preview → publish confirmation dialog. Destructive actions archive/soft-delete behind confirmation. Slugs validated for uniqueness and URL safety; changing a published slug warns and records the old slug for redirects.

## New public surface

- `/$locale/blog` and `/$locale/blog/$slug` — Markdown articles rendered through a sanitizing renderer (no raw HTML), with per-article SEO + JSON-LD.
- Announcement banner component driven by placement/date-window/priority, rendered in the site shell.

## Deferred on purpose

- Payments — offers stay display-only, provider-agnostic.
- Real social publishing — drafts only; a `SocialPublisher` interface with no provider implementations.
- Factory API integration — boundary only, no calls.
- PDF generation from admin — the existing static CV file remains; the admin controls CV composition and exposes the export state without inventing a generated file.
- Revision history — timestamps and author fields are stored now; diff/restore UI later.

## Sequencing

1. Enable Cloud; auth + admin role + protected `/admin` shell.
2. Repository adapter in `content/api.ts`; migrate canonical modules into the database as seed data (literal INSERTs), keeping the TypeScript modules as fallback.
3. Profile / Experience / Education / Skills management.
4. Projects, Products, Services management + preview.
5. Blog: schema, admin editor, public `/blog` routes.
6. Announcements + banner.
7. Media library on Cloud storage.
8. SEO overrides, CV settings, social drafts.
9. Verify every public route, both locales, both themes, and that drafts never appear publicly.

This is large; I'll execute it in that order and report progress per step rather than in one silent pass.
