# Brand + UX + Visual Design Specification — nextnext-gen.com

Spec only. No implementation in this phase.

## A. Brand concept

"Engineer behind a growing software and product ecosystem." The root domain is the identity layer; products live on their own subdomains. Tone: precise, structured, intelligent, credible. Not startup-flashy, not corporate-beige. Visual thesis: **structured surfaces + technical typography + restrained signal color**, where the only "decorative" element is system diagramming (pipelines, nodes, grids) that is also informative.

## B. Three color palettes

**1. Signal Blue (engineering / infrastructure)**
Primary #2F6BFF · Secondary #1B2B4B · Accent #5BA8FF · bg-dark #07090D · surface-dark #10141B · text-dark #E9EDF5 · bg-light #FBFBFD · surface-light #F1F3F8 · text-light #0B0F17 · muted #8A93A6 · border #232A36 (light #DFE3EC) · success #2FA96B · warning #D99A2B · error #DE4B4B

**2. Graphite Amber (product / premium)**
Primary #E0A040 · Secondary #2A2724 · Accent #F2C879 · bg-dark #0A0908 · surface-dark #16140F · text-dark #F2EEE6 · bg-light #FCFAF6 · surface-light #F2EDE4 · text-light #14110D · muted #948C7E · border #2A2621 (light #E5DED2) · success #4E9A6A · warning #D98E1F · error #C9503F

**3. Slate Teal (technical / calm)**
Primary #1F9E93 · Secondary #17272B · Accent #57D3C4 · bg-dark #06090A · surface-dark #0F1618 · text-dark #E6EEEE · bg-light #FAFCFC · surface-light #EDF3F3 · text-light #08110F · muted #7F9394 · border #1E2A2C (light #DAE4E4) · success #2E9C6E · warning #CE9527 · error #D45151

All three: AA on body text in both modes, gradients used only as accents (hero flow lines, card edge glow), never as the identity.

## C. Recommended palette

**Signal Blue.** It reads as systems/infrastructure engineering rather than "AI startup purple" or "agency amber"; blue is neutral enough that future product subdomains can each take their own accent while inheriting the same neutral scaffolding. Amber risks reading commercial; teal risks reading wellness/dev-tool cliché.

## D. Typography system

- Display + Headings: **Space Grotesk** (technical, geometric, distinctive at large sizes)
- Body: **IBM Plex Sans** (engineering heritage, excellent at 14–18px)
- Mono / labels / metrics: **JetBrains Mono** (eyebrows, tech chips, pipeline labels only)
- Arabic: **IBM Plex Sans Arabic** (matched to Latin body; display Arabic uses the same family at heavier weight rather than a second Arabic face)

Four families total. Scale: 12/13 mono labels, 15–17 body, 20–24 sub, 32/40/56/72 display with clamp(). Line-height 1.05 display, 1.6 body, 1.8 Arabic body. Latin technical terms stay LTR inside Arabic text via inline isolation.

## E. Logo / monogram

Recommend **Option C — hybrid**: an `A A` monogram in a square with a hairline border and a single offset baseline notch (an engineering "registration mark" feel), paired with the wordmark "Ahmed Abdelwahab" in Space Grotesk Medium. Monogram alone for favicon/avatar/GitHub/product subdomain headers; lockup for site header, CV, LinkedIn banner. Monochrome-safe, works at 16px, no gradient, no icon metaphor to age badly.

## F. Three hero concepts

**H1 — Ecosystem Map (recommended)**

- Headline: "Software systems, engineered end to end."
- Support: "Full-stack and AI engineering, architecture, and the products built on top of them."
- CTA: View Projects · Secondary: Let's build
- Visual: profile mark + live node graph — identity node branching to Factory, Najmah, future products.
- Animation: nodes fade in staggered, connectors draw over 600ms, slow idle pulse on one edge.
- Why: states positioning and proves the ecosystem thesis in one frame.

**H2 — Typographic Statement**

- Headline: "I build the systems behind the product."
- Support: positioning line + location/availability.
- Visual: oversized display type, hairline grid, portrait as a small circular anchor.
- Animation: word-by-word reveal, grid parallax on scroll.
- Why: most premium/editorial; least explanatory.

**H3 — Pipeline / Terminal**

- Headline: "Requirements in. Production systems out."
- Visual: horizontal pipeline strip mirroring the Factory stages.
- Animation: stage-by-stage illumination loop.
- Why: strongest engineering signal, but overlaps the Factory section.

## G. Homepage narrative (recommended order)

1. **Hero** — identity. Ecosystem map. Entrance reveal. CTA pair.
2. **Capability strip** — capability at a glance. Mono tech row on a hairline band. Fade only.
3. **Selected work** — proof. Two large case-study cards. Stagger 90ms. CTA → all projects.
4. **Inside the Factory** — engineering depth. Pipeline + 3 capability tiles. Scroll-linked stage highlight.
5. **Products** — future value. Status-badged cards, empty/coming-soon is a designed state. Stagger.
6. **Capabilities / skills** — substantiation. Category groups, no percentages.
7. **How I work** — trust. Numbered principles, 3-up. Subtle lift on hover.
8. **Services** — engagement. Six engagement types in a hairline grid, no pricing.
9. **Contact** — conclusion. Question-led CTA block.

## H. Navigation

Seven items (Home implicit via logo): About · Projects · Products · Services · Factory · Contact — six links plus logo is within a comfortable limit at ≥1280px. Utility cluster: EN/AR, theme, primary CTA.
Sticky, transparent at top, hairline border + background blur after 12px scroll. Active route underline/foreground shift. Mobile: full-height sheet, items at display size, language + theme in a row, CTA pinned at the bottom. Keyboard: skip-link, visible ring, escape closes sheet.

## I. Project visual system

**Recommended: large featured + horizontal case-study cards.** Two featured projects get full-width alternating media/text rows; the index uses horizontal cards (media left, role/problem/outcome right, mono tech chips, architecture preview line). Categories: Backend/API, Frontend/Web, Mobile, AI, SaaS, Infrastructure, Digital Products. Filters as a single row of quiet text chips with an underline indicator — no dropdowns, no counts, no dashboard chrome.

## J. Factory visual concept

"Inside the Factory": full-bleed dark band, six-stage pipeline (Requirements → Architecture → Generation → Validation → Quality Gate → Production) as connected nodes; scroll progress illuminates each stage and reveals its one-line description. Three capability tiles below, then a public-surface note referencing the documented API entry point only. No internal endpoints, prompts, or ops detail. V1 presentation-only; the panel reserves space for a future interactive demo.

## K. Product visual system

Products read as offerings, not artifacts: name, one-line value promise, status badge (Live / Beta / Coming Soon / In Development), audience line, and a disabled-but-visible action row (Visit · Demo · Docs) so the future commerce surface is legible today. Card style differs from projects — lighter surface, more whitespace, badge-first. Coming-soon cards are deliberately designed, never greyed placeholders.

## L. Services visual system

Six engagement types in a gap-px hairline grid. Each: title, the problem it solves, the capability applied, the typical outcome. No prices, no packages, no tiers. Single closing CTA: "Let's build something."

## M. About visual system

Narrative order: background → engineering transition → current focus → how he thinks → what he builds now → future direction. Portrait as a circular anchor in the header. Recent engineering experience gets full entries; earlier non-software work compresses into a single quiet "earlier journey" list. Education as a two-line block.

## N. CV placement

Three reserved locations, all fed later by one canonical profile: (1) About header secondary action, (2) footer Profile column, (3) contact section utility line. V1 shows the action only where a real file exists; otherwise the slot is omitted, not faked.

## O. Contact experience

Opens with "Have a problem worth building a system for?" followed by four intent choices — Build something · Hire me · Collaborate · Discuss a product — each pre-framing a direct channel. V1 uses direct channels (email, LinkedIn, GitHub, WhatsApp); form arrives with the backend in V2.

## P. Dark mode system

Five layers: background #07090D → surface #10141B → elevated #161C26 → border #232A36 → hairline highlight. Text: primary #E9EDF5, secondary #8A93A6. Accent used on ≤5% of pixels: links, active state, one hero edge. No pure black, no neon field, no glow on text.

## Q. Light mode

Designed independently: warm-neutral #FBFBFD background, #F1F3F8 surfaces, borders carry the hierarchy instead of shadows, one soft shadow level for elevated cards, primary darkened to #2456D8 for AA on light. Not an inversion of dark.

## R/S. EN/AR and RTL

Locale-prefixed routes; the switcher preserves the current path. `lang` and `dir` set at the shell. Logical properties everywhere (ms/me, start/end) — no hardcoded left/right. Directional icons (arrows, chevrons) mirror; brand marks and media do not. Reveal/slide animations invert their x-axis in RTL. Arabic gets its own line-height and slightly larger body size; Latin technical terms remain LTR-isolated.

## T. Animation system

Default intensity subtle→medium. Trigger on intersection at 12% with a −40px bottom margin, once only.

- Page entrance: 300ms fade+4px rise, ease-out
- Hero entrance: 600–800ms, staggered 60ms, cubic-bezier(0.22,1,0.36,1)
- Scroll reveal: 500ms, 16px rise
- Stagger: 50–90ms steps, max 6 items
- Hover: 150–200ms, 2px lift + border brighten
- Image movement: ≤20px parallax
- Navigation: 300ms background/border cross-fade
- Page transition: 250ms fade, no slide
- CTA: 120ms scale 0.98 on press
- Project transitions: 200ms media scale 1.02
  `prefers-reduced-motion: reduce` disables transforms and parallax; opacity-only fades ≤120ms remain.

## U. Micro-interactions

Buttons: press scale + focus ring. Links: underline grows from the inline-start edge. Nav: active item foreground shift. Project cards: whole-card lift + arrow nudge. Tech tags: border brighten only, non-interactive cursor. Product cards: badge tint reacts to status. Theme switch: 200ms icon cross-fade, no page flash (pre-hydration script). Language switch: label swaps to the target language's own script. External links: small arrow-up-right glyph, `rel="noopener"`.

## V. Responsive strategy

360/390/430 — single column, display type clamps to 32–40px, hero graph becomes a compact vertical node stack, filters scroll horizontally, CTA pinned in the mobile sheet.
768 — two-column cards, hero still stacked.
1024 — nav expands, hero splits.
1280/1440 — target composition, 1200px content max.
1920 — content capped, background grid extends full-bleed. Mobile is composed independently, not scaled down.

## W. Accessibility

AA contrast in both modes (verified on muted text and badges), semantic landmarks, one H1 per page, visible 2px focus ring on all interactive elements, full keyboard operation including the mobile sheet and filters, `aria-current` on active nav, labelled theme/language controls, alt text on all media, reduced-motion honored, no color-only status signalling (badges carry text).

## X. Premium quality checklist

- Optical alignment and a real spacing scale — not arbitrary padding
- Hairline borders doing the structural work instead of drop shadows everywhere
- One accent color used sparingly, never a rainbow of chips
- Typography with genuine size/weight contrast; mono reserved for labels
- Custom system diagrams instead of stock icon rows
- Designed empty/coming-soon states
- Motion that resolves and stops — no perpetual loops
- Light mode designed, not inverted
- Arabic that looks native, not retrofitted
- Consistent radius, border, and elevation tokens across every surface
- No stock-photo filler, no fabricated metrics, no fake logos

---

Awaiting approval. Next phase: turn this into the implementation prompt, including localized project and product detail pages with per-entry OpenGraph, JSON-LD, and SEO metadata.
