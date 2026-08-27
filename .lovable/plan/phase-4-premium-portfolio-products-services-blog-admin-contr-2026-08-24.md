# Phase 4 — Premium portfolio + products, services, blog, admin control center

## Audit of what already exists (keep, do not rebuild)

- Canonical layer: `src/content/schema/index.ts` + `src/content/api.ts` with profile, experience, education, skills, projects, products, services, CV and LinkedIn views, plus visibility/provenance filtering. Untouched.
- CMS storage projection: `src/lib/cms/types.ts` (12 content kinds), admin/public server functions, media library and a working `/admin` studio with generic + article/announcement/SEO editors.
- Public routes: home, about, projects (index + slug), products (index + slug), services, skills, blog (index + slug), contact, cv, auth.
- Bilingual EN/AR with RTL, dark/light theme toggle, motion primitives (`Reveal`, `Stagger`, `TextReveal`), SEO helpers with JSON-LD.

## Gaps Phase 4 closes

Public: homepage narrative is generic; no work filtering; services are one-liners; no blog section on home; no Factory credibility section; no gallery; no final CTA block.
Admin: no gallery, social profiles/campaigns, marketing, payments or settings sections; missing duplicate/reorder/confirm affordances on lists.

## What I will build

### 1. Schema extensions (additive only, in the existing files)

- `src/content/schema/index.ts`: add `GalleryItem`, `SocialCampaign`, `MarketingCampaign`, `PaymentMethod` / `PaymentAccount` types with the same `Tracked` + `Localized` conventions.
- `src/lib/cms/types.ts`: add matching content kinds `gallery_item`, `social_campaign`, `marketing_campaign`, `payment_method` and their payload types.
- One migration extends the existing `content_kind` enum — no new tables, no second content system.

### 2. Homepage redesign (`src/routes/$locale.index.tsx`)

Sections in order: Hero (name, positioning, supporting line, View My Work / Let's Build Something / View CV) → capability strip → Featured work with category filter (Web, Backend, AI, Mobile, SaaS, Digital Product) → Services grid with deliverables + CTA → Technology capabilities by group → Digital products with Live/Beta/Coming Soon states → Blog (latest articles, View All) → Universal AI Software Factory credibility panel with domain grid and Explore CTA → Visual gallery → Final CTA ("Have a project in mind?").
All copy comes from the locale dictionaries; no hardcoded strings in components.

### 3. Public pages

- `/projects`: shared filter component with the homepage; detail pages gain related projects + related services blocks.
- `/services`: full service pages with explanation, deliverables and transparent "delivered with my team" wording where applicable.
- `/blog`: search, category and tag filters, featured vs latest split, related articles on detail.
- `/gallery`: new route rendering gallery items (masonry, image/video, category filters) — empty state when no items exist.
- `/cv`: unchanged behaviour, kept generated from canonical data.

### 4. Admin control center

Sidebar restructured to: Dashboard, Profile, Experience, Education, Skills, Projects, Products, Services, Blog, Gallery, CV, Social Media, Marketing, Payments, Settings.

- New sections: `/admin/gallery`, `/admin/social` (profiles + campaigns with draft / ready / scheduled / published labels, no real publishing), `/admin/marketing` (campaign records), `/admin/payments` (methods and accounts with an explicit public-visibility switch, sensitive fields hidden by default, provider left configurable), `/admin/settings`.
- Lists gain duplicate, reorder, publish/unpublish/archive and confirmation dialogs on every destructive action.

### 5. Quality bar

Reduced-motion respected, keyboard/ARIA on filters and dialogs, RTL-safe logical spacing, per-route SEO metadata with hreflang and JSON-LD, responsive layouts tuned for mobile separately. No invented clients, metrics, testimonials or products — empty states say "Coming Soon" or "Add from Admin".

## Notes

Payments, social publishing and ad APIs stay UI + data contracts only. Nothing in the Phase 3 canonical architecture is replaced.
