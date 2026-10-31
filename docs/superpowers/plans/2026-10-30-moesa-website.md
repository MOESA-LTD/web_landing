# MOESA Public Website v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public English B2B website for https://www.moesaltd.com as a Nuxt 4 app that looks like the Claude Design MOESA design and uses only the approved package copy.

**Architecture:** Nuxt 4 (`app/` dir, TypeScript). Every route is prerendered. One Nitro server route (`POST /api/contact`) is deployed to Vercel as a function. The copy lives in typed TS modules under `content/en/` (one per page) and is kept separate from the Vue components in `app/components/`. Brand, navigation and form data are imported straight from the package JSON. The look is ported from the newer Moesa design-system React bundle into Vue SFCs that are styled with Tailwind v4 `@theme` tokens.

**Tech Stack:**
- Nuxt 4.6, Vue 3, TypeScript, Tailwind CSS 4.3 (`@tailwindcss/vite`)
- `@fontsource-variable/manrope`, self-hosted, so no Google request (GDPR)
- zod 4 and Resend 6 for the contact form, Cloudflare Turnstile for spam protection
- `@nuxtjs/sitemap`, `@nuxtjs/robots`
- Vitest with `@nuxt/test-utils` and `@vue/test-utils` for unit/component tests, `@playwright/test` for e2e

**Spec (read all three before starting any task):**
1. `MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0/MOESA_Website_AI_Build_Spec_v1.0.md`: requirements and acceptance criteria.
2. `design-reference/DESIGN_NOTES.md`: tokens, component markup, page layouts, copy discrepancies.
3. `design-reference/design-system/project/README.md` and `components/*/README.md`: **the target visual style** (newer DS).

**Package root** (abbreviated `PKG` below): `MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0/`.

## Decisions already made (by the user, 2026-10-30)

| Topic | Decision |
|---|---|
| Visual target | **Newer DS** (`design-reference/design-system/project/components/bundle.{js,css}`): navy hero panel with chevron motif, `bars` motif in Final CTA, disc timeline markers, 4px ruled numbered cards, `surface-inverse` = `#102C49`, headings weight 700, `Stat` for About experience figures. **Page layouts** (section order, grids, gaps) follow the canvas artboards in `design-reference/canvas/project/*.dc.html`. Where the newer DS changes a component's markup, use the newer DS markup. |
| Copy | **Only** `PKG/content/en/*.md`, copied verbatim. Canvas-only text (DESIGN_NOTES §6 "invented" items) is never used. Approved sections that have no canvas layout are built from the DS patterns listed in Task 3. |
| Hosting | Vercel (`nitro.preset = 'vercel'`). |
| Form delivery | Nitro route, then Resend, to `info@moesaltd.com`. Turnstile spam check. **File upload disabled in v1.** |
| Styling | Tailwind v4. DS tokens live in `@theme`. Component-level CSS sits in `@layer components` only where Tailwind utilities would be unreadable (motif, ticks marker, timeline connectors). |
| Language (amended 2026-10-30) | **EN + TR**, URL-based, with `@nuxtjs/i18n` 10.6 (`strategy: 'prefix_except_default'`, `defaultLocale: 'en'`, `detectBrowserLanguage: false`, `customRoutes: 'config'`). EN lives at the root and TR under `/tr/` with **Turkish slugs** (table below). Page copy comes from `content/en/*.ts` and `content/tr/*.ts`, and the TR files are transcribed verbatim from `PKG/content/tr/*.md`. **The canvas's own TR/DE strings in `design-reference/canvas/project/i18n.js` are NOT copy sources**, because they are unapproved re-translations (CANVAS_UPDATE_NOTES §3). DE is not built: there is no approved source, though the setup allows adding it later. `NUXT_PUBLIC_ENABLE_TR=false` hides TR: no TR routes are prerendered, the switcher is hidden and TR is left out of the sitemap. |
| Layout source (amended) | The canvas was updated to v1793392139 and now uses the newer DS. Page layouts follow the **current** `design-reference/canvas/project/*.dc.html`. Read `design-reference/CANVAS_UPDATE_NOTES.md` for what changed relative to DESIGN_NOTES: language bar above the header, Home services 4+1, navy "How we work" band, ruled partnership list, About Experience panel, round bullets. Where DESIGN_NOTES and CANVAS_UPDATE_NOTES disagree, CANVAS_UPDATE_NOTES wins. |
| Language switcher | Use the canvas visual: a grey bar above the header, right-aligned, with the label "Language"/"Dil" and EN/TR buttons (44px; the active one blue, the others ink). Implement them as `<NuxtLink>`s from `useSwitchLocalePath()`, never as JS-only buttons. The links carry `hreflang` and `lang`, and the active one has `aria-current="true"`. |
| UI microcopy | Text that is not page copy (nav labels, form labels and errors, "Skip to content", breadcrumbs "Home", "All services", the switcher label, cookie buttons) goes in `i18n/locales/{en,tr}.json`. TR values come from `PKG/content/tr` wherever a TR equivalent exists there, for example nav labels from the TR page titles and the form labels from TR `contact.md`. Strings with no package source are translated by us and listed in `i18n/UNREVIEWED_TR.md` for the user to review. |

### TR routes (Turkish slugs, derived from the `PKG/content/tr` page titles)

| EN | TR |
|---|---|
| `/` | `/tr` |
| `/services` | `/tr/hizmetler` |
| `/services/sourcing-managed-procurement` | `/tr/hizmetler/tedarik-ve-yonetilen-satin-alma` |
| `/services/product-private-label-development` | `/tr/hizmetler/urun-ve-private-label-gelistirme` |
| `/services/market-access-commercial-representation` | `/tr/hizmetler/pazara-giris-ve-ticari-temsil` |
| `/services/operations-supply-chain` | `/tr/hizmetler/operasyon-ve-tedarik-zinciri` |
| `/services/digital-commerce-commercial-intelligence` | `/tr/hizmetler/dijital-ticaret-ve-ticari-icgoru` |
| `/how-we-work` | `/tr/nasil-calisiyoruz` |
| `/who-we-work-with` | `/tr/kimlerle-calisiyoruz` |
| `/about` | `/tr/hakkimizda` |
| `/contact` | `/tr/iletisim` |
| `/thank-you` | `/tr/tesekkurler` |
| `/privacy-policy` | `/tr/gizlilik-politikasi` |
| `/cookie-policy` | `/tr/cerez-politikasi` |
| `/legal-notice` | `/tr/yasal-bildirim` |

All TR slugs live in one map, `i18n/routes.ts` (`ROUTES: Record<RouteName, { en: string; tr: string }>`). Every internal link is built with `localePath()` from route names. Hard-coded paths in content files (`/contact`, `/contact?service=…`, `/services/...`) are stored as **EN paths** and localised at render time by `useLocalizedHref(href: string): string`, which maps EN path to route name to the current-locale path and keeps the query and hash. The service-slug query parameter (`?service=operations-supply-chain`) stays in English in both locales. The contact form always sends the **EN** service option value to the API, whatever the UI locale.

## Global Constraints

- Node `>=22.21` (Nuxt 4.6 requirement; `.nvmrc` = `22`). Package manager: npm.
- Copy rule (build spec §2): "Do not invent services, offices, client references, guarantees, certifications or legal responsibilities. Unresolved information remains open and is not replaced with assumptions."
- Forbidden phrases (spec §11): "full compliance guaranteed", "we assume all legal responsibility", "we operate in every country". No claim that MOESA OS, an AI platform or a client portal exists.
- Approved compliance wording: "We coordinate product checks, technical documentation and compliance workflows with the relevant manufacturers, economic operators and specialists."
- The old tagline "Flexible on Details" must not appear.
- Header CTA: **Discuss a Project** → `/contact`. Canonical origin: `https://www.moesaltd.com`.
- One `<h1>` per page. Titles and meta descriptions come exactly from each md's `**Page Title:**` and `**Meta Description:**`.
- Legal pages show the DS "Draft" status chip with the text "DRAFT / TASLAK - LEGAL REVIEW REQUIRED" until legal review is recorded.
- No non-essential cookies or analytics scripts in v1. The consent infrastructure exists but analytics stays off unless `NUXT_PUBLIC_ANALYTICS_ID` is set **and** consent is given.
- Secrets only via env: `RESEND_API_KEY`, `CONTACT_TO` (default `info@moesaltd.com`), `CONTACT_FROM`, `NUXT_TURNSTILE_SECRET_KEY`, `NUXT_PUBLIC_TURNSTILE_SITE_KEY`. Commit `.env.example`, never `.env`.
- Accessibility: visible `:focus-visible` (2px `#0069B2`, offset 2; cyan `#14A3DB` on navy), `prefers-reduced-motion` disables transitions, decorative SVG is `aria-hidden="true"`, text contrast is ≥4.5:1.
- Responsive breakpoints (container widths, from DESIGN_NOTES §1.5): 560, 720, 860, 960, 1000. Use Tailwind v4 `@container` variants on components that the DS marks as container-query based.
- i18n: every page exists in EN and TR. `<html lang>` follows the locale (`en` / `tr`). Every page outputs `<link rel="alternate" hreflang="en|tr|x-default">` (x-default = EN) and a self-referencing canonical in its own locale. TR page titles and descriptions come from the TR md `**Page Title:**` and `**Meta Description:**`. No DE.
- Commit after every task with Conventional Commits. End every commit message with these two lines:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`
  `Claude-Session: https://claude.ai/code/session_01AmKGHA5GsJjQjAALbYrQDB`

## Review Focus

1. **Approved copy silently dropped or reworded.** Expect every approved heading, paragraph, list item and CTA label from `content/en/*.md` to appear in the rendered page. This is pinned by `tests/e2e/content-fidelity.spec.ts`, created in Task 5 and extended in Tasks 6–9.
2. **Contact form without JavaScript, or with a hostile payload** (oversized brief, missing consent, HTML in fields, invalid `service`, missing Turnstile token). Expect server-side rejection with field errors, no email sent, and HTML-escaped values in any email that is sent. Pinned in Task 8's `server/contact.test.ts`.
3. **`/contact?service=<slug>` deep links from service CTAs.** Expect the matching option to be preselected, and an unknown slug to be ignored. Pinned in Task 8's `ContactForm.test.ts` and the e2e `forms.spec.ts`.
4. **Keyboard and mobile navigation.** Expect the Services dropdown to open and close with click, Enter and Escape and on an outside click, the mobile menu to work at 390px, and focus to stay visible. Pinned in Task 4's `SiteHeader.test.ts` and the e2e `navigation.spec.ts`.
6. **Switching language on a deep page with a query** (`/contact?service=operations-supply-chain` → TR). Expect to land on `/tr/iletisim?service=operations-supply-chain` with the same service preselected, and every internal link on TR pages to stay in TR. Pinned in Task 4's `LanguageSwitcher.test.ts` and the e2e `i18n.spec.ts` (Task 10), which crawls all TR pages and fails on any `href` to an EN content route.
5. **Unknown URL.** Expect HTTP 404 with the designed 404 page, not a 200 soft-404 (prerendered SPA fallbacks on Vercel often return 200). Pinned in Task 9's e2e `not-found.spec.ts` against `nuxt preview` output.

---

## File structure

```
nuxt.config.ts                       modules, routeRules (prerender, headers), runtimeConfig, nitro vercel preset
app/app.vue                          <NuxtLayout><NuxtPage/></NuxtLayout>
app/error.vue                        404 / generic error page (NotFound component)
app/layouts/default.vue              SiteHeader + <slot/> + SiteFooter (+ CookieConsent banner when analytics enabled)
app/assets/css/main.css              tailwind import, @theme tokens, type utilities, @layer components
app/components/brand/                Glyph.vue, Logo.vue, LineMotif.vue
app/components/ui/                   Button.vue, Breadcrumbs.vue, TickList.vue, Chip.vue
app/components/layout/               SiteHeader.vue, SiteFooter.vue
app/components/sections/             PageHero.vue, SectionHeader.vue, ServiceCard.vue, NeedCard.vue,
                                     PartnershipCard.vue, AudienceCard.vue, ProcessTimeline.vue,
                                     CapabilityStrip.vue, EUBaseSection.vue, FinalCTA.vue,
                                     RelatedServices.vue, Stat.vue, NumberedCards.vue, MandatesPanel.vue,
                                     RuledList.vue, StatementSplit.vue, FlowLine.vue
app/components/forms/                ContactForm.vue, FormField.vue
app/components/legal/                LegalPage.vue, CookieConsent.vue
app/components/message/              MessageState.vue (thank-you + 404)
app/composables/                     useContent.ts, usePageSeo.ts, useConsent.ts
app/pages/                           index.vue, services/index.vue, services/[slug].vue, how-we-work.vue,
                                     who-we-work-with.vue, about.vue, contact.vue, thank-you.vue,
                                     privacy-policy.vue, cookie-policy.vue, legal-notice.vue
content/types.ts                     shared content types (Cta, Section shapes, PageMeta)
content/site.ts                      re-exports PKG data JSON with types (brand, navigation, form)
content/en/*.ts                      one module per page, copy verbatim from PKG/content/en/*.md
server/api/contact.post.ts           validation, Turnstile, rate limit, Resend, 303 redirect / JSON
server/utils/contact-schema.ts       zod schema shared by server and tests
server/utils/rate-limit.ts           in-memory sliding window per IP
server/utils/email.ts                escape + compose email text/html
public/                              favicon.png, og-default.png, moesa_mark.png (copied from PKG/assets)
tests/unit/**                        vitest (environment nuxt) component + util tests
tests/e2e/**                         playwright: content-fidelity, navigation, forms, not-found, seo
tests/e2e/fidelity/extract.ts        md → approved strings extractor + per-page exclusions
README.md                            local dev, build, env, deploy to Vercel, domain setup, legal TODOs
vercel.json                          apex→www redirect
```

---

### Task 1: Design tokens, fonts, base styles and test tooling

**Files:**
- Modify: `nuxt.config.ts`, `app/assets/css/main.css`, `package.json`
- Create: `vitest.config.ts`, `playwright.config.ts`, `tests/unit/tokens.test.ts`, `public/moesa_mark.png`, `public/favicon.png`

**Interfaces:**
- Produces Tailwind theme tokens (used by every later task):
  - Colors: `navy` `#19324A`, `navy-dark` `#102C49`, `blue-dark` `#003B72`, `blue` `#0069B2`, `cyan` `#14A3DB`, `slate` `#536B7D`, `pale` `#EBF5FB`, `mist` `#F7FAFC`, `line` `#D5E3ED`, `line-strong` `#748CA0`, `mist-blue` `#B4CFE0`, `navy-line` `#1B4264`, `danger` `#B42318`, `danger-tint` `#FEF3F2`.
  - Font: `--font-sans: "Manrope Variable", Manrope, Arial, "Segoe UI", sans-serif`.
  - Radius: `--radius-sm: 2px`. Shadow: `--shadow-menu: 0 12px 32px rgba(16,44,73,.14)`.
  - Container: `.container-site` (max-width 1200px, padding-inline 24px, 16px below 720px).
- Produces type utilities (DESIGN_NOTES §1.3, using the newer-DS weights): `text-display` (56/60 700 −0.015em; 38/44 under 720), `text-h1` (44/52 700 −0.01em; 34/40), `text-h2` (32/40 700; 26/34 under 720), `text-h3` (22/30 700), `text-h4` (18/26 700), `text-lead` (20/32; 18/28 under 720), `text-body` (17/28), `text-body-sm` (15/24), `text-label` (15/20 600), `text-eyebrow` (13/16 700 0.08em uppercase), `text-caption` (13/20 500), `text-numeral` (44/48 700), `text-stat` (72/72 700 −0.02em).
- Produces `.section` (padding-block 96px; 64px under 720px).
- Produces npm scripts: `test` (vitest run), `test:e2e` (playwright test).

- [ ] **Step 1:** Install the dev tooling: `npm i -D vitest @nuxt/test-utils @vue/test-utils happy-dom @playwright/test` and `npm i @fontsource-variable/manrope`. Run `npx playwright install chromium`.
- [ ] **Step 2: Write the failing test** `tests/unit/tokens.test.ts`. It reads `app/assets/css/main.css` as text and asserts that the CSS contains every hex above (case-insensitive) and the 13 type-utility names. It also asserts that every color in `PKG/data/brand_tokens.json` `colors` appears in the CSS, which pins the package as the color source.
- [ ] **Step 3:** Run `npx vitest run tests/unit/tokens.test.ts`. Expected: FAIL.
- [ ] **Step 4:** Implement `main.css`:
  - `@import "tailwindcss"` and `@import "@fontsource-variable/manrope"`.
  - The `@theme` block.
  - `@utility` definitions for the type roles.
  - Base layer: body slate on white, `-webkit-font-smoothing: antialiased`, headings in `navy`, `:focus-visible` ring, and a reduced-motion rule that zeroes transitions.
  - Configure `vitest.config.ts` with `defineVitestConfig` and `environment: 'nuxt'`.
  - Configure `playwright.config.ts`: `webServer` runs `npm run build && npm run preview` on port 3000; projects `desktop` (1440×900) and `mobile` (390×844).
  - Copy `PKG/assets/moesa_mark.png` to `public/`. Make `favicon.png` a 64×64 downscale of the mark on a white square.
- [ ] **Step 5:** Run `npx vitest run`. Expected: PASS. Run `npm run build`. Expected: build completes.
- [ ] **Step 6:** Commit `feat: add MOESA design tokens, Manrope and test tooling`.

### Task 2: Content layer and i18n foundation (types, site data, EN+TR content, routes, `useContent`)

**Files:**
- Create: `content/types.ts`, `content/site.ts`, `content/en/index.ts`, `content/tr/index.ts`, `app/composables/useContent.ts`, `app/composables/usePageSeo.ts`, `app/composables/useLocalizedHref.ts`, `i18n/routes.ts`, `i18n/locales/en.json`, `i18n/locales/tr.json`, `i18n/UNREVIEWED_TR.md`, `tests/unit/content.test.ts`, `tests/unit/i18n-routes.test.ts`
- Modify: `nuxt.config.ts` (alias `#content` → `./content`, alias `#pkg` → `./MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0`; the `@nuxtjs/i18n` module config from the Decisions table, with `pages` built from `i18n/routes.ts`; `runtimeConfig.public.enableTr` from `NUXT_PUBLIC_ENABLE_TR`, default `true`)

**i18n additions (amended):**
- Install `@nuxtjs/i18n@^10.6.0`. Locales: `{ code: 'en', language: 'en', name: 'EN' }` and `{ code: 'tr', language: 'tr', name: 'TR' }`.
- `type Locale = 'en' | 'tr'`. `useContent(key, locale?)` defaults to the current i18n locale.
- Write `content/tr/*.ts` for all 16 pages, verbatim from `PKG/content/tr/*.md`, with the same TS interfaces as EN. The test also asserts that each TR module has the same shape as its EN counterpart: identical key sets and equal array lengths. **If a TR md structurally differs from its EN md** (a missing section, or a different list length), do not invent text. Record the difference in the task report and make the field optional for that page.
- `i18n/routes.ts` exports `ROUTES` (the TR routes table in Decisions) and `type RouteName`.
- `useLocalizedHref(href: string): string` maps an EN path, with an optional query and hash, to the current locale's path. An unknown path or an external URL is returned unchanged.
- `usePageSeo(meta)` additionally emits the hreflang alternates (en, tr, x-default) and uses the locale's canonical URL. You can use `useLocaleHead()` from @nuxtjs/i18n with `baseUrl` set to `https://www.moesaltd.com`.
- Fill the UI-microcopy JSON files: nav, footer column titles, breadcrumbs "Home", "All services", the skip link, the switcher label, the form labels, help text and 7 error messages, the error-summary title, and the cookie panel strings. Every TR string that has no `PKG/content/tr` source gets a line in `UNREVIEWED_TR.md` in the form `key | EN | TR`.

**Extra tests (amended):**
- `i18n-routes.test.ts`: `ROUTES` has 15 entries; every TR path starts with `/tr` and is lowercase ASCII `[a-z0-9/-]`; the TR paths are unique.
- `useLocalizedHref('/contact?service=operations-supply-chain#project-form')` in `tr` returns `'/tr/iletisim?service=operations-supply-chain#project-form'`. `useLocalizedHref('/services/operations-supply-chain')` in `tr` returns `'/tr/hizmetler/operasyon-ve-tedarik-zinciri'`. `useLocalizedHref('https://x.y/')` returns the input unchanged.
- The content test covers TR as well: TR `meta.title` and `meta.description` must match the TR md.

**Interfaces:**
- Produces in `content/types.ts`:
  - `type Locale = 'en'`
  - `interface Cta { label: string; href: string }`
  - `interface PageMeta { path: string; title: string; description: string }`
  - `interface FinalCtaContent { title: string; body: string; cta: Cta; secondary?: Cta }`
  - `type ServiceSlug = 'sourcing-managed-procurement' | 'product-private-label-development' | 'market-access-commercial-representation' | 'operations-supply-chain' | 'digital-commerce-commercial-intelligence'`
  - Each page module exports `default` typed by its own interface (`HomeContent`, `ServicesContent`, `ServicePageContent`, `HowWeWorkContent`, `WhoWeWorkWithContent`, `AboutContent`, `ContactContent`, `MessageContent`, `LegalContent`). Each interface is declared in its own content file and holds `meta: PageMeta` plus named section objects that mirror the md `##` sections in order.
- Produces in `content/site.ts`: `brand` (typed `PKG/data/brand_tokens.json`), `navigation` (`{ primary: Cta[]; services: Cta[]; legal: Cta[] }` from `navigation.json`), `contactForm` (from `contact_form.json`), `serviceSlugs: ServiceSlug[]` in navigation order, and `serviceLabelBySlug: Record<ServiceSlug,string>`.
- Produces `useContent<K extends PageKey>(key: K, locale?: Locale)`, which returns the typed page content. `PageKey` = `'home' | 'services' | 'how-we-work' | 'who-we-work-with' | 'about' | 'contact' | 'thank-you' | '404' | 'privacy-policy' | 'cookie-policy' | 'legal-notice' | \`services/${ServiceSlug}\``.
- Produces `usePageSeo(meta: PageMeta)`. It sets the title, the description, the canonical `https://www.moesaltd.com${path}` (no trailing slash, except `/`), and the OG/Twitter title, description, url, `og:type=website`, `og:site_name="MOESA Ltd."` and `og:image`.

- [ ] **Step 1: Write the failing test** `tests/unit/content.test.ts`:
  - For every `PageKey`, `useContent(key).meta.title` equals the md `**Page Title:**` value and `.meta.description` equals `**Meta Description:**`. Parse them from `PKG/content/en/<file>.md`, using `page_map.json` "English File" for the mapping.
  - `serviceSlugs` equals the slugs in `navigation.json` services hrefs.
  - `brand.email === 'info@moesaltd.com'`.
- [ ] **Step 2:** Run `npx vitest run tests/unit/content.test.ts`. Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement `types.ts`, `site.ts`, `useContent.ts` and `usePageSeo.ts`. Create **all 16 `content/en/*.ts` page modules now**, transcribing every md section verbatim:
  - Keep hyphens and quotes as in the md. Don't "improve" punctuation.
  - Arrow lines (`A → B → C`) become `string[]` steps.
  - `**Primary CTA:** [label](href)` becomes a `Cta`.
  - Include instructional sections only where they are display copy (see the exclusions list in Task 5).
- [ ] **Step 4:** Run `npx vitest run`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add typed content layer from approved package`.

### Task 2b: Complete the TR content where the package TR is thinner (added 2026-10-30, user decision)

The PKG TR files are a condensed mirror: only `home.md` matches EN, and the others lack sections and lists. The user chose to have us **translate the missing parts from the approved EN**, flagged for approval.

**Files:**
- Modify: `content/tr/*.ts`, the content shape test (remove `KNOWN_TR_GAPS`; TR must now have the same shape as EN)
- Create: `content/tr/unreviewed.ts`, exporting `UNREVIEWED_TR: { page: PageKey; path: string; en: string; tr: string }[]`. `path` is the dotted content path, for example `sections.projectVisibility.items[3]`. Create `i18n/UNREVIEWED_TR.md`, generated from it by `scripts/unreviewed-tr.ts` (committed; `npm run unreviewed:tr`), which lists the page copy and the UI microcopy for the user.

**Rules:**
- **Approved TR text from the md is never changed.** Translate only what is missing in TR relative to EN: whole sections, list items, and lists that TR collapsed into a sentence. When TR collapsed a list into a sentence, keep the approved sentence and add the translated list items only if the EN layout needs the list. Record the choice in the report.
- Translate from the approved EN only. Use the TR terminology the approved TR files already use, for example "Partneri", "Private Label", "Ticari İçgörü", "Tedarik ve Yönetilen Satın Alma" and "Projeyi Görüşelim". Use the formal "siz" register. Never use the canvas `i18n.js` translations.
- Every translated string has exactly one `UNREVIEWED_TR` entry. The test asserts that every TR content string is either found verbatim in `PKG/content/tr/*.md` or listed in `UNREVIEWED_TR`. Normalise the whitespace and the arrow lines before comparing.
- Legal pages: translate the missing sections too, but they remain drafts under the same "DRAFT / TASLAK" status.

- [ ] **Step 1:** Write the failing tests: the TR/EN shape is equal for all 16 pages (no gaps), and the provenance test above.
- [ ] **Step 2:** Translate and add the `UNREVIEWED_TR` entries.
- [ ] **Step 3:** Run `npx vitest run`. Expected: PASS. Run `npm run unreviewed:tr` and commit the generated md.
- [ ] **Step 4:** Commit `feat: complete TR content with flagged translations`.

### Task 3: Brand, UI and section components (ported from newer DS)

Port from `design-reference/design-system/project/components/bundle.js` and `bundle.css`, plus each component's `README.md`. Read `preview.html` where it exists. Keep the DS class semantics but express them as Tailwind utilities. Keep the DS accessibility attributes exactly (`aria-hidden`, `aria-current`, the sr-only texts).

**Files:**
- Create: everything under `app/components/brand/`, `app/components/ui/` and `app/components/sections/` listed in the file structure
- Create: `app/pages/_dev/components.vue`, a gallery page that renders every component with sample props from `content/en/home.ts`. It is excluded from prerender and the sitemap and is only available in dev (`routeRules: { '/_dev/**': { robots: false } }`, guarded by `import.meta.dev`, otherwise 404).
- Test: `tests/unit/components/*.test.ts`

**Interfaces (props; all optional unless marked `!`):**
- `Glyph { name!: 'arrow'|'chevronDown'|'chevronRight'|'menu'|'close'|'check'|'alert'|'loop'|'upload'; size?: number = 24 }`. Paths are in DESIGN_NOTES §2. It renders with `aria-hidden="true"`.
- `Logo { tone?: 'default'|'inverse'; height?: number = 26; href?: string }`. The mark uses `/moesa_mark.png` with `width = round(height*1855/531)`. In the inverse tone it is the typeset name only. With `href` it is wrapped in a link with `aria-label="MOESA Ltd. home"`.
- `LineMotif { variant!: 'chevron'|'bars' }`. The polygons come from DESIGN_NOTES §3.5 (newer DS). It is `aria-hidden`.
- `Button { variant?: 'primary'|'secondary'|'text' = 'primary'; inverse?: boolean; size?: 'md'|'sm'; block?: boolean; to?: string; type?: 'button'|'submit' }`. With `to` it renders `<NuxtLink>`, otherwise `<button>`. The text variant appends an arrow glyph that moves 3px on hover.
- `Breadcrumbs { items!: Cta[] }`. The last item gets `aria-current="page"` and no link.
- `TickList { items!: string[]; columns?: 1|2 }`. Cyan caret marker per DESIGN_NOTES §2 ticks.
- `Chip { kind!: 'draft'|'open' }`.
- `PageHero { variant?: 'display'|'page'; eyebrow?; title!; intro?; note?; crumbs?: Cta[]; actions?: Cta[] }`. The display variant is the newer-DS 2-column hero with the 8px cyan left edge, the navy panel and the chevron motif. The page variant is the canvas page hero (no panel, motif hidden ≤1000).
- `SectionHeader { eyebrow?; title!; intro?; action?: Cta & { variant?: 'secondary'|'text' }; titleMax?: string }`
- `ServiceCard { index?: string; capability?: boolean; title!; summary!; points!: string[]; to!: string }`. The whole card is a link, with a 4px top rule in the DS color sequence.
- `NeedCard { text!; service!; to!: string }`
- `PartnershipCard { index!: string; title!; inverse? }`
- `AudienceCard { title!; text?; points?: string[]; to? }`
- `ProcessTimeline { steps!: string[]; layout?: 'row'|'column'; loop?: string; inverse?; highlightLast? }`. Disc markers per the newer DS.
- `CapabilityStrip { eyebrow?; title!; body!; note?; items!: string[] }`
- `EUBaseSection { eyebrow?; title!; body!; rows!: { label: string; value: string }[] }`
- `FinalCTA { content!: FinalCtaContent }`. Navy band with the `bars` motif.
- `RelatedServices { items!: { title: string; summary: string; to: string }[] }`
- `Stat { value!: string; label!: string }`
- Patterns for approved sections that have no canvas layout:
  - `NumberedCards { items!: { title: string; body?: string }[] }`: ruled numbered columns (DS README "Rules, not boxes"). Use for principles, engagement models and responsibilities.
  - `MandatesPanel { title!; items!: string[]; tone?: 'mist'|'pale' }`: the service-page "Typical mandates" panel.
  - `RuledList { items!: string[] | { term: string; text: string }[] }`: hairline-separated rows. Use for "What MOESA manages", "Project visibility" and the selection guide.
  - `StatementSplit`: 2-column statement grid with slots `#left` and `#right` (minmax 420, gap 48).
  - `FlowLine { steps!: string[] }`: horizontal chips with chevron separators that wrap on mobile. Use for "Not a linear process".

- [ ] **Step 1: Write the failing tests**:
  - `Button.test.ts`: `to` renders an `<a href>`; without `to` it renders a `<button type="button">`.
  - `Breadcrumbs.test.ts`: the last item has `aria-current="page"` and is not a link; the separators are `aria-hidden`.
  - `LineMotif.test.ts`: the root svg has `aria-hidden="true"`; `chevron` renders 2 polygons with the exact `points` strings from DESIGN_NOTES §3.5.
  - `ServiceCard.test.ts`: there is exactly one `<a>`, its `href` equals `to`, the title is inside an `h3`, and each point is an `li`.
  - `ProcessTimeline.test.ts`: renders an `ol` with N `li`; markers contain 1..N; `loop` renders when given.
- [ ] **Step 2:** Run `npx vitest run tests/unit/components`. Expected: FAIL.
- [ ] **Step 3:** Implement the components.
- [ ] **Step 4:** Run `npx vitest run`. Expected: PASS. Run `npm run dev`, open `/_dev/components` and compare each component visually with `design-reference/design-system/project/components/<Name>/preview.html` opened locally. Fix any spacing or colour drift.
- [ ] **Step 5:** Commit `feat: port MOESA design-system components to Vue`.

### Task 4: Header, footer and default layout

**Files:**
- Create: `app/components/layout/SiteHeader.vue`, `app/components/layout/SiteFooter.vue`, `app/layouts/default.vue`
- Test: `tests/unit/components/SiteHeader.test.ts`, `tests/unit/components/SiteFooter.test.ts`

**Interfaces:**
- Consumes: `navigation`, `brand` (Task 2); `Logo`, `Button`, `Glyph` (Task 3).
- `SiteHeader` has no props and reads the current route.
  - Behaviour per DESIGN_NOTES §3.1: Services is a disclosure `<button aria-expanded aria-controls="services-menu">`. It opens on click or Enter and closes on Escape or a mousedown outside. Escape returns focus to the button.
  - Active state: exact or prefix match, so `/services/*` marks Services.
  - Below 960px the mobile panel pushes the content down and is not an overlay.
  - Route changes close both menus.
  - The header is not sticky.
- `LanguageSwitcher` (amended, new file `app/components/layout/LanguageSwitcher.vue`): a full-width bar above the header on every page. Its visual spec is **CANVAS_UPDATE_NOTES "Update 1793392616 — language switcher"**:
  - Bar: `#F7FAFC`, 1px `#D5E3ED` bottom border, height 44px. The container is 1200px wide with 24px padding, its items right-aligned with a 4px gap.
  - Label: 13/20, weight 500, `#536B7D`, margin-right 8px. The text is "Language" in EN and "Dil" in TR.
  - Items: min-width 44px, height 44px, padding 0 8px, radius 2px, 13px, weight 700, letter-spacing .08em. The active item has a `#0069B2` background and white text; inactive items are transparent with `#19324A` text.
  - The group has `role="group"` and an `aria-label`.

  Differences from the canvas, by ruling:
  - Items are **links** with `lang`, `hreflang` and `aria-current="true"` on the active one, instead of the canvas's `aria-pressed` buttons and localStorage.
  - Only EN and TR are offered, not DE.
  - Inactive links get a hover style of `#EBF5FB` background and `#0069B2` text. It renders links from `useSwitchLocalePath()`, which keep the query and hash. It is hidden when `enableTr` is false. Test `LanguageSwitcher.test.ts`: on `/contact?service=operations-supply-chain` the TR link href is `/tr/iletisim?service=operations-supply-chain`; the active locale link has `aria-current="true"`; each link has a `hreflang` attribute.
- All header and footer labels come from `i18n/locales/*.json`, and all links go through `localePath()`.
- `SiteFooter { showCta?: boolean }`. The layout passes `true` on `/` and `/about` only, per DESIGN_NOTES §3.2. The bottom bar uses `navy-dark` with a 1px `navy-line` top border.

- [ ] **Step 1: Write the failing tests** (`mountSuspended`):
  - The header renders the 6 primary labels from `navigation.json`.
  - Clicking Services sets `aria-expanded="true"` and shows the 5 service links plus "All services".
  - Pressing Escape closes it and focuses the button.
  - On route `/services/operations-supply-chain`, Services has the active class or `aria-current`.
  - The footer shows `brand.email` as a `mailto:` link, the phone as `tel:+35988501661`, the company ID and VAT text, and the 3 legal links.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement the header, the footer and `default.vue`. The layout adds a skip link "Skip to content" that targets `#main`, and wraps the slot in `<main id="main">`.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add site header, footer and layout`.

### Task 4b: Header language dropdown (canvas v1793393437; added 2026-10-31, runs after Task 6)

The user updated the canvas so that the grey language bar above the header is **replaced** by a language dropdown at the right end of the header bar, and **Home is removed from the header nav** (the logo is the home link). The spec is in `design-reference/CANVAS_UPDATE_1793393437.md`; the new artboards are in `design-reference/canvas-incoming/project/`, and the controller moves them into `design-reference/canvas/` before dispatch.

**Files:**
- Modify: `app/components/layout/LanguageSwitcher.vue`, which becomes the in-header dropdown; `app/components/layout/SiteHeader.vue`, to place the switcher and drop Home from the nav; the mobile menu; and the tests `LanguageSwitcher.test.ts` and `SiteHeader.test.ts`.

**Requirements:**
- Visual: match the canvas dropdown (button showing the current code plus a chevron; the menu lists native name plus code, "English EN" and "Türkçe TR"). Take the exact sizes and offsets from CANVAS_UPDATE_1793393437 §1, including the 76px CTA spacing and the 68px offset below 960px.
- Behaviour:
  - Disclosure button with `aria-expanded` and `aria-controls`. Escape closes it and returns focus to the button; an outside mousedown closes it; a route change closes it. **These close behaviours are added on top of the canvas, which lacks them.**
  - The menu items are `<NuxtLink>`s from `useSwitchLocalePath()` with `lang`, `hreflang`, and `aria-current="true"` on the current one.
  - EN and TR only.
  - Keep the SSR/after-mount query handling from Task 4.
  - The switcher is hidden when `enableTr` is false.
- Opening the language menu closes the Services menu, and vice versa.
- Header nav: Services, How We Work, Who We Work With, About MOESA and Contact (5 items, without Home). The mobile menu follows the canvas; if the canvas mobile panel still lists Home, keep it.
- **TR nav labels stay as they are** (from the approved TR page titles). The canvas draft labels "Müşterilerimiz" and "Hakkımızda" are not used.
- Update the Task 5 home and layout e2e tests that relied on the bar.

- [ ] **Step 1:** Write the failing tests: the dropdown's ARIA attributes, Escape, outside click, hrefs (including the `/contact?service=` case), Home absent from the desktop nav, and the language bar no longer rendered.
- [ ] **Step 2:** Implement. Run `npx vitest run` and `npx playwright test`. Compare screenshots at 1440 and 390 with the new canvas.
- [ ] **Step 3:** Commit `feat: move language switcher into header dropdown`.

### Task 5: Home page and content-fidelity harness

**Files:**
- Create: `app/pages/index.vue`, `tests/e2e/fidelity/extract.ts`, `tests/e2e/content-fidelity.spec.ts`, `tests/unit/fidelity-extract.test.ts`

**Interfaces:**
- `extractApprovedStrings(mdFile: string): string[]`. It returns every heading, paragraph, list item and CTA label from a package md.
  - Skip: line 1 (the `# PageName` title), metadata lines (`**URL:**`, `**Status:**`, `**Version:**`, `**Page Title:**`, `**Meta Description:**`) and the structural headings `Hero` and `Final CTA`.
  - Arrow lines are split on ` → ` into separate strings.
  - `**Primary CTA:** [X](href)` yields `X`.
  - Each string is whitespace-normalised.
- `FIDELITY_EXCLUSIONS: Record<string, { text: string; reason: string }[]>`. These are instructions to the builder, not display copy. Initial entries:
  - `contact.md`: the "Project form" field list. These are form labels, rendered with the "(optional)" suffix instead of " - optional", and checked by the form test instead.
  - `contact.md`: "File Upload - optional". Upload is disabled in v1.
  - `contact.md`: the whole "Privacy note" paragraph. It is an instruction, implemented as the consent checkbox.
  - Add any further exclusions **only** with a reason string, and list them in the task report for user review.
- The e2e spec runs per route: `page.goto(route)`, read `document.body.innerText` (normalised), and expect every approved string to be contained in it (case-insensitive, because eyebrows are CSS-uppercased). It also checks the `<title>` and the meta description against the md.

- **i18n (amended):**
  - The fidelity spec takes a list of `{ route: string; md: string; locale: 'en'|'tr' }` and checks EN pages against `PKG/content/en` and TR pages against `PKG/content/tr`. Exclusions are keyed by locale and file.
  - Task 5 covers `/` and `/tr`.
  - Implement the TR home with the same `index.vue` (the i18n module localises it). Section order follows the **current** `Main.dc.html` (CANVAS_UPDATE_NOTES).
  - The footer CTA shows on `/`, `/tr`, `/about` and `/tr/hakkimizda`.
- [ ] **Step 1: Write the failing unit test** `fidelity-extract.test.ts`. On `home.md` it should return "From commercial objective to market-ready delivery.", "One mandate. One coordinated operating partner.", "Retail Groups & Corporate Buyers" and "Discuss a Project" (if a CTA line exists), and should not return "Hero" or the meta description.
- [ ] **Step 2:** Run it. Expected: FAIL. Implement `extract.ts`. Run it again. Expected: PASS.
- [ ] **Step 3:** Write `content-fidelity.spec.ts` with the routes list `['/']`. Run `npx playwright test content-fidelity --project=desktop`. Expected: FAIL (home not built).
- [ ] **Step 4:** Implement `index.vue`. Follow the section order of `Main.dc.html` (DESIGN_NOTES §4 Home, as updated by CANVAS_UPDATE_NOTES) and add the approved sections the canvas dropped:
  1. Display hero.
  2. "Your external product & procurement team." as a `StatementSplit`. The left side holds the approved text; the right side holds the You / MOESA cards, whose texts come only from the approved operating statement.
  3. Services (`ServiceCard` ×5, with titles and summaries from `services.md`) under the approved heading "One operating model across the commercial process."
  4. Business needs: all 5 `NeedCard`s.
  5. Process timeline: 5 steps.
  6. Partnership models: all 5 `PartnershipCard`s.
  7. Audiences: 4 `AudienceCard`s, titles only plus a link. The md has no per-audience text on Home, so the cards use the title only. Do not import the canvas texts.
  8. `CapabilityStrip`.
  9. `EUBaseSection` (rows: Registered address, Company ID and VAT from `brand`).
  10. `FinalCTA`.

  Alternate the section backgrounds white / `mist` so that no two adjacent sections share one. This fixes DESIGN_NOTES §7.5.
- [ ] **Step 5:** Run the fidelity spec. Expected: PASS. Take Playwright screenshots of `/` at 1440 and 390 into `tests/e2e/__screens__/` (gitignored). Compare them side by side with the canvas Main artboard (`https://claude.ai/artifact/Y1h2M2SHu6PRxqqXu5Yrh3`) and the newer DS previews. Fix any drift.
- [ ] **Step 6:** Commit `feat: build home page with content-fidelity checks`.

### Task 6: Services overview and the five service pages

**Files:**
- Create: `app/pages/services/index.vue`, `app/pages/services/[slug].vue`
- Modify: `tests/e2e/content-fidelity.spec.ts` (add the 6 routes)

**Interfaces:**
- Consumes: `useContent('services')` and `` useContent(`services/${slug}`) ``.
- `[slug].vue` validates `slug` against `serviceSlugs` with `definePageMeta({ validate })`, so an unknown slug gives a 404.
- **i18n (amended):** the TR path is `/tr/hizmetler/[slug]`, where the slug is the TR slug from `ROUTES`. Export `serviceSlugFromLocaleSlug(locale, slug): ServiceSlug | null` from `i18n/routes.ts`. The page resolves the slug through it, and an unknown slug gives a 404. Call `useSetI18nParams({ en: { slug: enSlug }, tr: { slug: trSlug } })` so the switcher links to the right counterpart. Prerender all 10 service URLs. Add the 6 TR routes to the fidelity spec.
- Prerender all 5 slugs through `nitro.prerender.routes`.

- [ ] **Step 1:** Add the routes to the fidelity spec. Run it. Expected: FAIL.
- [ ] **Step 2:** Implement `/services`. Layout per Services.dc.html: page hero with crumbs, the core-services grid, NeedCards, `CapabilityStrip` and `FinalCTA`. Use the approved H1 "Connected services for international product businesses.", the approved intro, the "One service or an integrated mandate." section and the approved final CTA "Not sure which service fits?".
- [ ] **Step 3:** Implement the service template.
  - Canvas skeleton: hero with crumbs Home / Services / name and the service CTA; Scope as a `StatementSplit` plus a `MandatesPanel` with the approved 5 mandates; "How the work runs"; `RelatedServices`; `FinalCTA`.
  - Approved sections rendered with the Task 3 patterns: "What MOESA manages" (`RuledList`), models and structures (`NumberedCards`), and the Responsibilities / Legal-role boundary text.
  - The Operations legal-role boundary paragraph and "Third-party delays or losses cannot be guaranteed against." **must** render.
  - Operations uses its own approved operating flow instead of the generic 5 steps.
  - CTA labels exactly as in the md: "Discuss a Market Project", "Discuss a Commerce Project".
- [ ] **Step 4:** Run the fidelity spec. Expected: PASS. Take screenshots and compare them with the ServiceSourcing and ServiceDigital artboards.
- [ ] **Step 5:** Commit `feat: add services overview and service detail pages`.

### Task 7: How We Work, Who We Work With and About

**Files:**
- Create: `app/pages/how-we-work.vue`, `app/pages/who-we-work-with.vue`, `app/pages/about.vue`
- Modify: the fidelity spec (3 routes)

- [ ] **Step 1:** Add the routes to the fidelity spec in both locales (`/tr/nasil-calisiyoruz`, `/tr/kimlerle-calisiyoruz`, `/tr/hakkimizda`). Run it. Expected: FAIL.
- [ ] **Step 2:** Implement **How We Work**:
  - Use the canvas layout. The operating flow is a column `ProcessTimeline` with the 7 approved steps; "Not a linear process" is a `FlowLine` plus the loop sentence. Do **not** use the canvas text "Seven steps, one accountable team."
  - Decision governance uses the approved paragraph.
  - Add "Start at any point", "One controlled product truth", "Open questions and risks" (the full approved sentence), "Project visibility" (`RuledList`), the 6 partnership models, "Engagement levels" (`NumberedCards`), "Responsibility boundary" and "Built to evolve".
  - Final CTA: "Where should we begin?"
- [ ] **Step 3:** Implement **Who We Work With**: approved H1 and intro, all 5 audiences as `AudienceCard`s with their approved bullets, the two buyer sections, the selection guide as a `RuledList` of term → text (approved 6+ lines), "Not sure yet?", and the final CTA "Discuss Your Business Need".
- [ ] **Step 4:** Implement **About**:
  - Approved H1 and intro, plus the hero note.
  - "Who we are" and "What we manage".
  - "Why MOESA" and "Our operating principles": the 6 approved principles as `NumberedCards`.
  - "Experience" as 2 `Stat`s, with values exactly as in `about.md`.
  - "European base, international scope", using the About text in `EUBaseSection`.
  - "What MOESA is not" (`TickList`), "Our direction" and the approved final CTA.
  - Footer CTA shown.
- [ ] **Step 5:** Run the fidelity spec. Expected: PASS. Take screenshots and compare them.
- [ ] **Step 6:** Commit `feat: add how-we-work, who-we-work-with and about pages`.

### Task 8: Contact form, API route and thank-you page

**Files:**
- Create: `server/utils/contact-schema.ts`, `server/utils/rate-limit.ts`, `server/utils/email.ts`, `server/api/contact.post.ts`, `app/components/forms/ContactForm.vue`, `app/components/forms/FormField.vue`, `app/components/message/MessageState.vue`, `app/pages/contact.vue`, `app/pages/thank-you.vue`, `.env.example`
- Test: `tests/unit/server/contact.test.ts`, `tests/unit/components/ContactForm.test.ts`, `tests/e2e/forms.spec.ts`

**Interfaces:**
- `contactSchema` (zod):

  | Field | Rule |
  |---|---|
  | `name`, `company`, `country` | trimmed, 1–200 chars |
  | `work_email` | email, ≤254 |
  | `service` | enum of `contactForm.service_options` |
  | `project_brief` | 10–5000 chars |
  | `privacy_consent` | literal `'on'` or `true` |
  | `product_category`, `target_market`, `estimated_volume`, `target_timeline` | optional, ≤200 |
  | `cf-turnstile-response` | string |
  | `website` | honeypot: must be empty |

- `SERVICE_SLUG_TO_OPTION: Record<ServiceSlug, string>` maps each slug to the form option it preselects:

  | Slug | Option |
  |---|---|
  | `sourcing-managed-procurement` | "Brand or Product Sourcing" |
  | `product-private-label-development` | "Product & Private Label Development" |
  | `market-access-commercial-representation` | "Market Access" |
  | `operations-supply-chain` | "Operations & Supply Chain" |
  | `digital-commerce-commercial-intelligence` | "Digital Commerce Operations" |

- `rateLimit(key: string, opts: { limit: 5; windowMs: 600_000 }): boolean`
- `composeEmail(data: ContactInput): { subject: string; text: string; html: string }`. All values are HTML-escaped. The subject is `` `Project brief: ${company} – ${service}` ``.
- `POST /api/contact`:
  - Accepts `application/x-www-form-urlencoded` (progressive enhancement) and JSON.
  - On success it returns `303 Location: /thank-you` for form posts, or `{ ok: true }` for JSON.
  - On a validation error it returns `422 { errors: Record<field,string> }`. For non-JS posts it instead returns 303 to `/contact?error=1`, where a generic error summary is shown.
  - It returns 429 when rate-limited and 400 when the Turnstile check fails.
  - The Resend error is logged server-side but never exposed to the client.
  - The user's email is used as `replyTo`, never as `from`.
- Error messages use the canvas wording from DESIGN_NOTES §4 Contact (UI microcopy, not page copy), for example "Enter your name.".
- **i18n (amended):**
  - The form posts a hidden `locale` field (`en`|`tr`, validated). Non-JS success redirects to the locale's thank-you path (`/thank-you` or `/tr/tesekkurler`), and non-JS errors redirect to the locale's contact path.
  - Client-side and server-side error texts come from `i18n/locales/*.json`. The server returns error **codes** (for example `required`, `invalid_email`), not texts, and the client maps them to texts.
  - The service `<select>` shows the TR labels on TR pages, but every option `value` is the EN option string from `contact_form.json`. TR labels come from the TR `contact.md` list. "Other" has no TR source; record it in `UNREVIEWED_TR.md`.
  - The email to MOESA is always in English and includes `Locale: tr` when the enquiry came from the TR site.
  - Add tests: a TR JSON post with `service` set to a TR label returns 422 (only EN values are accepted); a non-JS post with `locale=tr` gets 303 to `/tr/tesekkurler`.
  - The fidelity spec adds `/tr/iletisim` and `/tr/tesekkurler`.

- [ ] **Step 1: Write the failing server tests**. Mock `resend` and `$fetch` for Turnstile.
  - A valid payload sends 1 email to `CONTACT_TO` with `replyTo` = the work email.
  - Missing `privacy_consent` returns 422 with `errors.privacy_consent`.
  - A `service` that is not in the options returns 422.
  - A 6000-char brief returns 422.
  - A filled honeypot returns 303 to thank-you but sends **no** email (silent drop).
  - A failed Turnstile check returns 400 and sends no email.
  - The 6th request from the same IP within 10 min returns 429.
  - `composeEmail` escapes `<script>` in `name`.
- [ ] **Step 2: Write the failing component tests**.
  - With `?service=operations-supply-chain` the select's value is "Operations & Supply Chain".
  - With `?service=bogus` the placeholder stays selected.
  - Submitting an empty form shows a focused error summary "Please check 7 fields" with anchor links, and the fields get `aria-invalid` plus `aria-describedby`.
  - Labels for optional fields end with "(optional)".
  - There is no file input.
- [ ] **Step 3:** Run the tests. Expected: FAIL.
- [ ] **Step 4:** Implement the schema, rate limit, email, route, form, contact page and thank-you page.
  - `contact.vue` follows Contact.dc.html: the form card and the aside with "Direct contact", "Company details" and "What happens next". "What happens next" uses the 4 items from `contact.md`, not the canvas list.
  - Add the approved final CTA "Ready to discuss the project?".
  - The form is `<form method="post" action="/api/contact">`, enhanced with client-side validation and `$fetch`. The Turnstile widget script loads only on `/contact`.
  - `thank-you.vue` uses `MessageState` with the approved copy, including "Need to add information?" and the final CTA "Continue exploring MOESA.".
  - Set `noindex` on `/thank-you`.
- [ ] **Step 5:** Run the unit tests. Expected: PASS. Write `forms.spec.ts`: the empty submit shows the summary; the deep link preselects the service; a valid submit with the API mocked through `page.route` lands on `/thank-you`. Add `/contact` and `/thank-you` to the fidelity spec. Run e2e. Expected: PASS.
- [ ] **Step 6:** Commit `feat: add contact form with validated API route and thank-you page`.

### Task 9: Legal pages, cookie consent and 404

**Files:**
- Create: `app/components/legal/LegalPage.vue`, `app/components/legal/CookieConsent.vue`, `app/composables/useConsent.ts`, `app/pages/privacy-policy.vue`, `app/pages/cookie-policy.vue`, `app/pages/legal-notice.vue`, `app/error.vue`
- Test: `tests/unit/consent.test.ts`, `tests/e2e/not-found.spec.ts`; extend the fidelity spec

**Interfaces:**
- `useConsent(): { state: Ref<{ necessary: true; preferences: boolean; analytics: boolean } | null>; save(choice): void; reset(): void }`. It is stored in the `moesa_consent` cookie for 180 days, which is strictly necessary and is listed in the Cookie Policy inventory. `null` means no choice has been made yet.
- The `CookieConsent` banner renders globally **only** when `runtimeConfig.public.analyticsId` is set and `state === null`. On `/cookie-policy` it always renders as the in-page settings panel.
- **i18n (amended):**
  - The TR legal pages come from `PKG/content/tr` (`/tr/gizlilik-politikasi`, `/tr/cerez-politikasi`, `/tr/yasal-bildirim`). The status chip text is the md `**Status:**` value, which is the same in both locales.
  - `error.vue` renders the 404 copy in the locale of the requested path: `/tr/*` gives TR, everything else gives EN.
  - Add the TR routes to fidelity, plus an e2e case: `GET /tr/olmayan-sayfa` returns 404 with the TR 404 heading.
- `LegalPage` is centred inside `.container-site`, which fixes DESIGN_NOTES §7.5. Every `OPEN` marker in the md renders as `Chip kind="open"` with the md text, so it is never replaced by an assumption.

- [ ] **Step 1: Write the failing tests**:
  - `useConsent` starts as `null`, `save` persists, and `analytics` stays false after "Reject non-essential".
  - The e2e test expects `GET /this-does-not-exist` to return status 404 and the body to contain "The page could not be found."
  - Add the 3 legal routes to fidelity.
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3:** Implement. The legal pages render the full approved md sections, including the Legal Notice "Content responsibility", "External links" and "Intellectual property", the Privacy "Purposes", rights, security and contact sections, and the Cookie "Marketing - only if implemented" entry. `error.vue` renders `MessageState` with the 404 copy and the approved final CTA for 404, and a generic message for 500. Make sure Vercel serves a real 404 for unknown paths: prerender `/404.html`, which Nitro does with `nitro.prerender.routes: ['/404.html']`, and verify it against `nuxt preview` with the vercel preset output.
- [ ] **Step 4:** Run the tests. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add legal draft pages, consent handling and 404`.

### Task 10: SEO, security headers, deployment config and README

**Files:**
- Modify: `nuxt.config.ts`, `app/app.vue`
- Create: `vercel.json`, `public/og-default.png`, `README.md`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Modules: `@nuxtjs/sitemap` (`site.url = 'https://www.moesaltd.com'`; excludes `/thank-you` and `/_dev/**`), `@nuxtjs/robots` (allow all; disallow `/api/`; sitemap link).
- JSON-LD on `/`: `Organization` with `name: "MOESA Ltd."`, `url`, `logo`, `email`, `telephone`, `address` (PostalAddress: streetAddress "1 Petyofi Str.", addressLocality "Plovdiv", postalCode "4000", addressCountry "BG"), `vatID: "BG207200475"`, and a `contactPoint` of type ContactPoint with `contactType: "sales"`, email and telephone. Nothing beyond `brand_tokens.json`.
- Security headers via `routeRules['/**'].headers`:
  - `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Content-Security-Policy`: `default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; connect-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`
- `vercel.json`: redirect host `moesaltd.com` → `https://www.moesaltd.com/:path*` (permanent). HTTP → HTTPS is Vercel's default.
- `og-default.png`: 1200×630, navy `#102C49` ground with the `bars` motif and the typeset "MOESA LTD." name plus the descriptor. Generate it from an HTML template with a Playwright screenshot script `scripts/og-image.ts` (committed).

- **i18n (amended):**
  - The sitemap uses the i18n integration of `@nuxtjs/sitemap`. It lists 28 URLs (14 EN and 14 TR, all except the thank-you pages) with `xhtml:link` alternates.
  - JSON-LD stays the same in both locales.
  - Write a new e2e `tests/e2e/i18n.spec.ts`:
    - On every TR route, `html[lang="tr"]` is set and the hreflang alternates en, tr and x-default are present and point to the correct counterpart.
    - Crawl every TR page and collect all internal `a[href]`. None may point to an EN content route; links to `/api`, assets and `mailto:`/`tel:` are allowed.
    - The switcher on `/services/operations-supply-chain` links to `/tr/hizmetler/operasyon-ve-tedarik-zinciri`.
    - With `NUXT_PUBLIC_ENABLE_TR=false`, a build has no `/tr` routes and no switcher. This is a vitest test that reads the config and checks that the prerender route list excludes `/tr`. A second e2e build is not required.
- [ ] **Step 1: Write the failing e2e `seo.spec.ts`**:
  - Every route has exactly one `h1`, `link[rel=canonical]` equal to `https://www.moesaltd.com{path}`, and `og:title`/`og:description`.
  - `/sitemap.xml` lists the 28 public URLs (14 EN + 14 TR) and neither thank-you page.
  - `/robots.txt` contains `Sitemap:`.
  - `/` contains `application/ld+json` with `"vatID":"BG207200475"`.
  - The response headers include `x-content-type-options: nosniff`.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement. Write `README.md`:
  - Requirements, `npm i`, `npm run dev`, tests, build and preview.
  - An env table.
  - Vercel deploy steps: import the repo, set the env, add the domains `www.moesaltd.com` (primary) and `moesaltd.com` (redirect), and the DNS records.
  - Resend domain verification for `moesaltd.com`, which needs DNS records.
  - Turnstile site setup.
  - A "Before launch" checklist copied from `PKG/legal/LEGAL_IMPLEMENTATION_NOTES.md`, plus a third-party inventory (Vercel, Resend, Cloudflare Turnstile; fonts self-hosted).
- [ ] **Step 4:** Run `npm test && npm run test:e2e`. Expected: all PASS.
- [ ] **Step 5:** Commit `feat: add SEO, security headers and deployment docs`.

### Task 11: Final acceptance pass

- [ ] **Step 1:** Run a forbidden-claims scan as a vitest test, `tests/unit/claims.test.ts`. Grep the built `.output/public/**/*.html` for "full compliance guaranteed", "assume all legal responsibility", "every country", "Flexible on Details", "lorem", "MOESA OS is available" and "client portal". Expected: no matches. "client portal" may only appear if approved copy contains it; check the md first.
- [ ] **Step 2:** Run a Lighthouse audit (chrome-devtools MCP `lighthouse_audit` or `npx lighthouse`) on `/`, `/contact` and one service page, both mobile and desktop. Target: Accessibility 100, SEO 100, Best Practices ≥95, Performance ≥90. Fix the regressions.
- [ ] **Step 3:** Run a keyboard-only walkthrough of the header, dropdown, mobile menu and form at 390px and at 1440px.
- [ ] **Step 4:** Take full-page screenshots of all 30 URLs (15 EN + 15 TR) at 1440 and 390 and put them next to the canvas artboards. List any remaining deviations for the user, each with a reason (approved copy added, or the newer-DS style).
- [ ] **Step 5:** Commit `test: add acceptance checks` and report the deviations list and the fidelity exclusions list to the user.

### Task 12: German (DE) locale (added 2026-10-31, user request; runs after Task 11)

User decisions: DE copy = **our translation of the approved EN** (formal "Sie"), every DE string flagged for review; URLs = `/de/` + **German slugs**.

**Routes (add `de` to `ROUTES` in `i18n/routes.ts`):**

| EN | DE |
|---|---|
| `/` | `/de` |
| `/services` | `/de/leistungen` |
| `/services/sourcing-managed-procurement` | `/de/leistungen/sourcing-und-beschaffungsmanagement` |
| `/services/product-private-label-development` | `/de/leistungen/produkt-und-private-label-entwicklung` |
| `/services/market-access-commercial-representation` | `/de/leistungen/marktzugang-und-handelsvertretung` |
| `/services/operations-supply-chain` | `/de/leistungen/operations-und-lieferkette` |
| `/services/digital-commerce-commercial-intelligence` | `/de/leistungen/digital-commerce-und-commercial-intelligence` |
| `/how-we-work` | `/de/so-arbeiten-wir` |
| `/who-we-work-with` | `/de/fuer-wen-wir-arbeiten` |
| `/about` | `/de/ueber-uns` |
| `/contact` | `/de/kontakt` |
| `/thank-you` | `/de/danke` |
| `/privacy-policy` | `/de/datenschutz` |
| `/cookie-policy` | `/de/cookie-richtlinie` |
| `/legal-notice` | `/de/impressum` |

**Requirements:**
- `Locale = 'en' | 'tr' | 'de'`; @nuxtjs/i18n locale `{ code: 'de', language: 'de', name: 'DE' }`; `NUXT_PUBLIC_ENABLE_DE` (default `true`) hides DE everywhere (routes not prerendered, switcher option hidden, sitemap/hreflang without de) like `enableTr`.
- `content/de/*.ts` for all 16 pages with the **EN shape** (same interfaces; no `condensed`/TR-only fields). Translate from approved EN only — never from canvas `i18n.js` and never from TR. Keep claims/scope exactly (compliance sentence, roadmap wording, "cannot be guaranteed", legal-role boundary). Proper nouns/brand terms stay ("MOESA Ltd.", service names may keep established English terms like "Private Label", "Sourcing", "Digital Commerce" where German B2B usage does). Legal pages keep the draft status chip (status text: md value) and OPEN markers verbatim from EN.
- Provenance: `content/de/unreviewed.ts` listing EVERY DE page string (`page`, `path`, `en`, `de`) — test: every DE leaf is listed and its `en` equals the EN leaf at the same path; `npm run unreviewed:de` generates `i18n/UNREVIEWED_DE.md` (page copy + DE UI microcopy). UI microcopy: `i18n/locales/de.json` with every key of en.json (test enforces key parity), all listed as unreviewed.
- Header: language dropdown lists English EN / Türkçe TR / Deutsch DE (as in canvas). Verify desktop nav fits on one line at ≥1160px in DE; if not, add short DE header labels (`nav.header.*`) and record them; do not change the breakpoint without measuring.
- SEO: `<html lang="de">`, hreflang en/tr/de/x-default on every page, DE titles/descriptions from `content/de` meta; sitemap = 42 URLs (14 per locale) with alternates; JSON-LD unchanged.
- Contact form: DE labels/errors; still submits EN option values; email to MOESA notes `Locale: de`; non-JS redirects to `/de/danke` / `/de/kontakt`.
- Legal: add a README "Before launch" item: German Impressum/Datenschutz must meet German requirements (legal review) before DE launch.
- Tests: extend unit (routes, localizeHref for de, content shape parity, provenance, locale JSON parity), e2e (fidelity: DE pages must render every DE content leaf — use the DE module as the oracle since no md exists; i18n spec: lang/hreflang/no EN-route links on DE pages; switcher counterpart hrefs for all 5 services in de↔en↔tr; 404 for `/de/gibt-es-nicht` in DE; seo sitemap 42).
- Commit `feat: add German locale with flagged translations`.
