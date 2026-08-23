# nextnext-gen.com — Architecture (V1)

Bilingual (EN/AR) personal brand + product ecosystem root for Eng. Ahmed Abdelwahab. No code yet — review and approve first.

## 1. Information Architecture

Three layers:
- **Identity** — who Ahmed is (Home, About, Skills, Services, Contact)
- **Proof** — what he built (Projects, Factory, case studies)
- **Distribution** — what people can get (Products, CV, contact channels)

Every page is locale-scoped; all content comes from typed modules, never hardcoded in components.

## 2. Sitemap

```text
/                      -> redirect to /en
/{locale}              Home
/{locale}/about        About
/{locale}/skills       Skills
/{locale}/services     Services
/{locale}/projects     Projects index
/{locale}/projects/$slug   Case study (najmah, universal-ai-software-factory)
/{locale}/factory      Universal AI Software Factory (flagship)
/{locale}/products     Products index
/{locale}/products/$slug   Product detail
/{locale}/contact      Contact
/{locale}/*            404
robots.txt, sitemap.xml (both locales, hreflang)
```

locale = `en` | `ar`.

## 3. Navigation

Header: Logo/name · Projects · Factory · Products · Skills · Services · About · Contact · [Language switch EN/AR] · [Theme toggle] · CTA "Let's Build" / "لنبنِ معًا".
On mobile the same set collapses into a sheet; CTA pinned at bottom.

Footer: three columns — Work (Projects, Factory, Products), Profile (About, Skills, Services, CV), Connect (Email, LinkedIn, GitHub, WhatsApp, X) + ecosystem note (root vs. product subdomains) + locale switch.

Language switch preserves the current route: `/en/projects/najmah` ⇄ `/ar/projects/najmah`.

## 4. Homepage wireframe

```text
1  Hero            name, positioning line, 2 CTAs, ecosystem system-flow visual,
                   reserved circular profile-media slot (renders without a photo)
2  Capability strip  compact marquee-free row of core technologies
3  Featured Projects  2 large cards (Najmah, Factory) w/ media slot + tech chips
4  Products         real products only; empty state = "products in progress" panel
5  Skills summary   curated top skills grouped by category + link to /skills
6  Factory teaser   pipeline diagram, 3 capability points, link to /factory
7  Services         7 service categories, no pricing
8  Contact CTA      availability line + primary contact action
```

## 5. Page-by-page content architecture

- **About** — short bio, long bio, positioning, engineering philosophy, focus areas, CV slot. All fields empty-safe (a section is skipped if its copy is absent).
- **Skills** — category groups: Backend, Frontend, Mobile (Flutter/Dart first-class), AI, Databases, DevOps/Infrastructure; each item has name, optional level, optional note.
- **Services** — 7 categories: Backend, Web Apps, Mobile Apps, AI/AI-powered Apps, API & Integration, Software Architecture, Digital Product Development. Each: title, outcome statement, deliverables list, engagement note. No pricing.
- **Projects index** — filter by category; cards from typed data.
- **Case study** — overview, problem, approach, architecture, implementation, challenges, outcome, tech, media slots, external links.
- **Factory** — what it is, problem solved, high-level architecture, capabilities, generated application categories, quality/validation model, product vision, public API/demo entry points only. No secrets, internal endpoints, or ops detail.
- **Products** — real products only in V1; `coming-soon` is a supported state, not filler.
- **Contact** — structured channel fields (email, LinkedIn, GitHub, WhatsApp, X, CV); each renders only when its value is provided. Form is V2 (no backend in V1).

## 6–9. Data models (typed, locale-aware)

Localized values use `type L<T> = { en: T; ar: T }`.

```ts
Project { slug, name:L<string>, category, status,
  summary:L<string>, tech:string[], featured:boolean,
  links?: { label:L<string>; url:string }[],
  media: MediaSlot[],            // {kind:'placeholder'|'image', src?, alt:L<string>}
  caseStudy: { overview, problem, approach, implementation,
               challenges, outcome }:L<string>
             & { architecture: L<string>[] } }

Product { slug, name:L<string>, kind, status:'available'|'coming-soon',
  summary:L<string>, description:L<string>, price?:L<string>,
  accessUrl?, subdomain?, media: MediaSlot[], features:L<string>[] }

SkillCategory { id:'backend'|'frontend'|'mobile'|'ai'|'databases'|'devops',
  label:L<string>, items:{ name:string; note?:L<string>; highlight?:boolean }[] }

Service { id, title:L<string>, outcome:L<string>,
  deliverables:L<string>[], note?:L<string> }   // pricing intentionally absent

Profile { displayName:L<string>, positioning:L<string>,
  shortBio:L<string>, longBio:L<string>, philosophy:L<string>[],
  photo?:MediaSlot, cv?:{ url:string; label:L<string> } }

Contact { email?, linkedin?, github?, whatsapp?, x?, cv?, availability:L<string> }
```

Empty string / undefined = not rendered. Nothing is fabricated.

## 10. Localization architecture

- Route param `$locale` validated to `en|ar`; unknown locale → 404, `/` → `/en`.
- `<html lang>` and `dir` set per locale in the root shell; Arabic uses true RTL (logical CSS properties everywhere — `ms-`/`me-`, `start`/`end`, no hardcoded left/right).
- Two content sources: `src/content/en/*` and `src/content/ar/*` — separate editable files, not runtime translation. UI labels live in a typed dictionary with the same shape in both locales, hand-written.
- Arabic typography: dedicated Arabic display/body font stack; numerals kept Latin for tech terms.

## 11. Theme architecture

Light + dark, semantic tokens only in `src/styles.css` (OKLCH), toggle persisted and applied pre-hydration. Three accent proposals — all AA-compliant in both modes, no neon:

- **A. Signal Blue** — deep ink neutrals + a restrained electric blue accent. Reads as engineering/infrastructure, safest and most credible.
- **B. Graphite Amber** — warm graphite neutrals + refined amber/brass accent. Product-oriented, distinctive, premium.
- **C. Slate Teal** — cool slate neutrals + deep teal accent. Technical and calm, differentiates from typical dev-blue.

Motion: moderate — entrance reveals, hover lifts, one hero system animation. No heavy glass or gradient washes.

## 12. SEO architecture

Per-route `head()` with locale-specific title/description/og, self-referencing canonical, `hreflang` alternates (en, ar, x-default→en), JSON-LD: Person + WebSite at root, Article/CreativeWork on case studies, SoftwareApplication on Factory/products, BreadcrumbList on deep routes. Sitemap lists both locales. Keyword priority: Ahmed Abdelwahab → Software Engineer → Backend/.NET → AI Engineer → Software Architecture → Flutter/Mobile → Universal AI Software Factory → product names.

## 13. Subdomain / ecosystem architecture

Root stays Ahmed's personal brand. Products get independent identities on `product.nextnext-gen.com`; the root links out via `Product.subdomain`/`accessUrl` and never assumes shared UI. Factory public surface references `factory-api.nextnext-gen.com` for documented public entry points only. Design tokens are structured so they can later be extracted into a shared package.

## 14. V1 / V2 / V3 boundaries

- **V1** — bilingual static site, all pages above, typed content, theme + RTL, SEO, no backend, no payments, no CMS, no fabricated content.
- **V2** — contact form + backend, CV download, CMS-backed content behind the same interfaces, provider-agnostic commerce scaffolding, project screenshots.
- **V3** — accounts/licensing across products, payments, admin dashboard, shared design-system package, interactive Factory demo.

## 15. Frontend architecture

TanStack Start + React + TS + Tailwind + shadcn/ui + Lucide. Routes: `src/routes/$locale/…` with a locale layout route providing dir/lang/dictionary via router context. Presentation components in `src/components/site/*`, typed content in `src/content/*`, models in `src/types/*`. Existing single-locale pages are refactored into the locale tree during implementation.

---

Open item before implementation: pick accent palette A, B, or C.
