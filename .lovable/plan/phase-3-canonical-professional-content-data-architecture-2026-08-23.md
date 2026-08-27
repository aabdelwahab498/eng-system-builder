# Phase 3 — Canonical Professional Content & Data Architecture

Specification only. No implementation, no pages, no packages.

## A–L. Domain model

All user-facing text fields use `Localized<T> = { en: T; ar: T | null }`, where `null` means ARABIC COPY REQUIRED (never machine-filled, never rendered).

Shared envelopes applied to every fact-bearing object:

```ts
type ContentStatus =
  "verified" | "draft" | "needs-verification" | "placeholder" | "private" | "deprecated";
type SourceType =
  "github" | "linkedin" | "cv" | "user-provided" | "project-documentation" | "portfolio" | "other";

type Provenance = { source?: string; sourceType: SourceType; verifiedAt?: string };
type Visibility = { public: boolean; portfolio: boolean; cv: boolean; linkedin: boolean };
type Tracked<T> = T & { status: ContentStatus; provenance: Provenance; visibility: Visibility };
```

Render rule: only `status: "verified" | "draft"` with `visibility.public === true` may reach production UI. `needs-verification`, `placeholder`, `private`, `deprecated` are build/authoring states only.

**A. Profile**
`identity { displayName, professionalName, shortName, monogram }` · `positioning { primaryTitle, secondaryTitle, shortHeadline, longHeadline, professionalSummary }` · `biography { short, medium, long }` · `location { city?, country?, timezone?, relocation?, remote? }` · `availability { state: "open" | "selective" | "unavailable", note }` · `contact: ContactChannel[]` · `socialLinks: SocialLink[]` · plus references to education, experience, skills, certifications, projects, products, services, documents.

`ContactChannel { kind: "email" | "phone" | "whatsapp" | "form", value, label }` wrapped in `Tracked`, so a private phone simply never has `visibility.public = true`.

**B. Experience**
`{ id, company, organizationType: "company" | "startup" | "agency" | "academic" | "government" | "self", position, location, startDate, endDate, current, description, responsibilities[], achievements[], technologies[], category: "engineering" | "product" | "academic" | "operations" | "marketing" | "other", verified }`. No date, title, metric, or achievement may be authored without a source; unresolved entries stay `needs-verification`.

**C. Education**
`{ id, institution, degree, field, startDate?, endDate?, graduationDate?, description?, verified }`.

**D. Skills**
`SkillGroup { id, category, label, description, skills: Skill[] }` with categories: backend, frontend, mobile, ai, databases, devops, languages, tools, business.
`Skill { name, category, context, proficiencyLabel?, featured, portfolioVisible, cvVisible, linkedinVisible }`. No percentages. `proficiencyLabel` is restricted to `"working" | "production" | "primary"` and only when Ahmed confirms; `context` (one factual sentence) is the default expression of depth.

**E. Project**
`{ id, slug, title, tagline, category: web|backend|frontend|mobile|ai|saas|infrastructure|digital-product, platform[], status, role, timeframe, summary, problem, approach, architecture[], features[], technologies[], outcomes[], screenshots[], links { repo?, live?, docs?, api? }, featured, visibility, verified }`. `outcomes[]` accepts only verified statements — no metrics, users, revenue, or performance numbers without a source.

**F. Product**
`{ id, slug, name, category: saas|ai-tool|developer-tool|template|digital-download|course|other, status: live|beta|in-development|coming-soon, tagline, summary, description, features[], technologies[], screenshots[], externalUrl?, demoUrl?, docsUrl?, relatedProjectId?, offers[], visibility }`.
`Offer { id, name, price, currency, billing: "one-time" | "month" | "year", checkoutUrl?, provider?, active }` — display-only in V1, provider-agnostic, no keys, no checkout.

**G. Service**
`{ id, title, summary, description, capabilities[], deliverables[], idealFor[], relatedProjects[], visible }`. No pricing.

**H. CV**
`CvDocument { variant, profile, summary, experience[], education[], skills[], projects[], certifications[], selectedProjects[], links }`, produced by a pure selector `buildCv(variant, locale)` over canonical data. Variants: general, backend-dotnet, ai, fullstack, mobile-flutter. A variant may change ordering, emphasis, selected projects, summary, and skill subset — never the underlying facts. Generation itself is out of scope for this phase.

**I. LinkedIn content model**
`LinkedInContent { headline, about, experienceBlurbs: Record<experienceId, string>, projectBlurbs: Record<projectId, string>, featured: { title, url, note }[] }` — derived views for manual copy-paste. No API integration.

**J. Localization** — see `Localized<T>` above; Arabic authored, never duplicated from English.
**K. Visibility/privacy** — `Visibility` above; contact channels default to `public: false`. Secrets, infrastructure detail, IPs, and internal paths are never modeled at all.
**L. Verification/provenance** — `Provenance` above; every non-obvious fact carries a source and, once confirmed, `verifiedAt`.

## M. Content folder structure

```text
src/content/
  schema/            domain types + zod-style guards (locale-agnostic)
  registry/          ids, slugs, ordering, cross-entity relations
  en/  profile · experience · education · skills · projects · products · services · seo
  ar/  same files; missing fields = null (ARABIC COPY REQUIRED)
  cv/                variant selectors (data only)
  linkedin/          derived content blocks
```

Existing `src/content/{en,ar}/index.ts` becomes the migration source; current UI keeps working because the access layer keeps returning today's `Dictionary` shape until Phase 4.

## N. Content access layer

`src/content/api.ts` exposes `getProfile(locale)`, `getProjects(locale)`, `getProject(locale, slug)`, `getProducts(locale)`, `getProduct(locale, slug)`, `getSkills(locale)`, `getExperience(locale, category?)`, `getEducation(locale)`, `getServices(locale)`, `getSeo(locale, key)`, `getCv(locale, variant)`, `getLinkedIn(locale)`.

Rules: components never import content files directly; every getter applies the publish filter (status + visibility) and locale fallback policy; return types come from `schema/`, so a later swap to API/DB/CMS changes only this module.

## O. Current known facts (candidate baseline)

Verified enough to publish once Ahmed confirms the title: name Ahmed Abdelwahab; GitHub `ahmedabdelwahab98` and its URL; LinkedIn `/in/ahmed-abdelwahab/`; root domain nextnext-gen.com; Factory API deployed at `factory-api.nextnext-gen.com` with a `/health` endpoint; technology areas listed in §12 as _worked-with_ areas; Universal AI Software Factory and Najmah exist as his own work; Bachelor of Engineering, Computer Science, Cairo University (dates unconfirmed).

## P. Facts requiring verification

Primary public email · phone/WhatsApp and whether either is public at all · city/country/timezone and remote or relocation stance · the exact professional title to publish · whether the GitHub and LinkedIn handles above are current and canonical · any other social accounts (X, YouTube, Medium) · all employment company names, positions, locations, and start/end dates · which past roles are safe to publish · education dates and the exact degree wording · the additional Software Engineering / Backend, Basics of Modern Education, and Digital Marketing programs (issuer, type, dates) · all certifications · Najmah's real status and public URL · Factory public status, what may be described, and whether the repo is public · availability state · whether a CV file may be published in V1.

## Q. Outdated or unsafe current-CV information

Do not carry over verbatim: old positioning and job titles; contact block (email, phone, address) — never auto-published; OCR/formatting artifacts and inconsistent terminology; percentage or star skill ratings; unsourced achievements and metrics; date ranges that conflict between sections; marketing-era phrasing that misrepresents the current engineering identity; any employer name that cannot be confirmed. Treat the CV as a _candidate source_ with `sourceType: "cv"` and `status: "needs-verification"`.

## R. Positioning options

1. **Software Engineer** / Full-Stack & AI Systems — "I design and build production software systems end to end, from backend services to AI-driven product features." Portfolio: strong · CV: strong · LinkedIn: strong. **Recommended.**
2. **Backend Engineer (.NET)** / APIs, Services & System Design — "I build reliable .NET backends and APIs that products depend on." Portfolio: focused · CV: strongest for backend roles · LinkedIn: strong for recruiter search.
3. **AI Engineer** / LLM Systems & Agents — "I build LLM-powered systems and agents that work inside real products, not demos." Portfolio: strong for AI positioning · CV: good for AI roles · LinkedIn: high visibility, higher scrutiny.
4. **Full-Stack Developer** / Web, Mobile & AI Integration — "I ship complete products across web, mobile, and AI integrations." Portfolio: good · CV: good for product teams · LinkedIn: broad but less differentiated.
5. **Software Engineer & Product Builder** / Systems and the products built on them — "I engineer the systems and turn them into products." Portfolio: strongest for the ecosystem story · CV: weaker for classic hiring pipelines · LinkedIn: good for founders and clients.

Avoided: Architect, Principal, Expert, CTO — no verified evidence. The GitHub headline's "Cybersecurity Enthusiast" is dropped from professional positioning.

## S. Professional summary drafts

All marked **[DRAFT — REQUIRES AHMED APPROVAL]**, capability-based, zero metrics.

- **50w** — Software engineer focused on backend services, full-stack web, and AI-driven features. Works primarily with .NET and ASP.NET Core, React and TypeScript, Python and FastAPI, and Flutter. Builds and operates his own products, including an AI software generation system and an Arabic-first AI storytelling platform.
- **100w** — Adds: designs APIs and data models, containerized deployment on Linux with Docker and NGINX, integrates LLMs and agent workflows into real product flows, and works end to end from problem framing to production; ecosystem hosted under nextnext-gen.com.
- **150w** — Adds a short career-transition line (earlier operations, quality, academic, and digital-marketing work informing how he frames problems and communicates with stakeholders) plus a forward-looking line about the growing product ecosystem.
- **LinkedIn version** — first person, short paragraphs, ends with an availability line and contact channel; headline mirrors the chosen positioning option.
- **CV version** — third-person-neutral, four lines, front-loads .NET, API design, AI integration, and full-stack delivery; no adjectives without evidence.
- **Portfolio version** — one sentence of positioning plus one sentence of proof, matched to the Phase 2 hero copy.

## T. Initial project inventory

1. **Universal AI Software Factory** — flagship, category `ai`/`infrastructure`, status `in-development` pending confirmation. Publishable: AI-assisted software generation; Backend/Frontend/Mobile/AI/Database factory tracks; API contract capabilities; architecture and quality validation; quality gates; production-oriented generation; public API entry point and its health endpoint. Not publishable: keys, credentials, internal endpoints, prompts, server IPs, ops configuration.
2. **Najmah** — category `ai`/`saas`, Arabic-first AI storytelling. Publishable capability areas: Arabic children's stories, AI-assisted generation, SEL-oriented storytelling, text and PDF output, audio narration, illustrations/illustration prompts. Status, URL, and any audience claim: NEEDS VERIFICATION. Not the portfolio's central identity.
3. **nextnext-gen.com ecosystem hub** — category `web`, this site; role, stack, and architecture are self-evident and verifiable.
4. Reserved slots for further real projects once Ahmed supplies them — no filler entries.

## U. Initial product inventory

1. **Najmah** — `ai-tool`/`saas`, status pending, `relatedProjectId` → Najmah project, `externalUrl` reserved for `najmah.nextnext-gen.com`.
2. **Factory API** — `developer-tool`, status live (health endpoint confirmed), `docsUrl`/`externalUrl` → `factory-api.nextnext-gen.com`, offers empty.
3. Future products resolve to `product-name.nextnext-gen.com` via `externalUrl`; the hub stays decoupled from product implementations. Coming-soon is a designed state, never a greyed placeholder.

## V. Content strategy by version

- **V1** — typed content files under the structure in §M, access layer in §N, verified/draft content only, direct contact channels, display-only offers, CV slot rendered only when a real approved file exists.
- **V2** — CV variants generated from canonical data, interactive Factory surface, contact form on a backend, richer case studies, LinkedIn export views.
- **V3** — commerce (real offers and checkout via a provider adapter), accounts, product subdomains fully wired, admin/CMS editing that writes to the same canonical model.

## Verification checklist for Ahmed

Answering these unblocks Phase 4: chosen positioning option · public email (and whether phone/WhatsApp are public) · location and availability wording · employment history entries to publish with exact dates · education dates and extra programs · certifications · Najmah status and URL · what the Factory may say publicly · CV file availability.
