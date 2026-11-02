# MOESA Ltd. website

The public website of MOESA Ltd. (`https://www.moesaltd.com`), in English, Turkish, German and Bulgarian.

Nuxt 4 · Tailwind CSS v4 · `@nuxtjs/i18n` (EN at `/`, TR under `/tr/` with Turkish slugs, DE under `/de/` with German slugs,
BG under `/bg/` with Bulgarian slugs in Latin transliteration) · `@nuxtjs/sitemap` and
`@nuxtjs/robots` · contact form via a Nitro server route → Resend, protected by Cloudflare Turnstile. Hosted on Cloudflare Pages
(static files + one Pages Function).

All page copy comes verbatim from the approved package in `MOESA_Website_Package_v1.0/` (EN) and its TR files.
Turkish strings that have no approved source are listed in `i18n/UNREVIEWED_TR.md`. The German site has no approved
source at all: every German string is our translation of the approved EN and is listed in `i18n/UNREVIEWED_DE.md`.
The Bulgarian site is the same: every Bulgarian string is our translation of the approved EN, listed in
`i18n/UNREVIEWED_BG.md`. All four locales are live: `wrangler.toml` sets DE and BG on for production and preview.

## Requirements

- Node.js **22** (`.nvmrc` = `22`, `package.json` `engines.node` = `22.x`; Nuxt 4.6 needs `>=22.21`). npm. On
  Cloudflare Pages the `NODE_VERSION` variable sets it (see "Deploying to Cloudflare Pages").
- For the e2e tests and the OG image script: Playwright's Chromium (`npx playwright install chromium`).

## Local development

```bash
npm i
cp .env.example .env      # fill in what you need, see "Environment variables"
npm run dev               # http://localhost:3000
```

In `nuxt dev` without `RESEND_API_KEY` the contact form does not send email: the message is printed in the terminal.
Without a Turnstile site key the widget is not rendered; set `CONTACT_DEV_BYPASS_TURNSTILE=true` to let submissions
through in `nuxt dev` (the flag is ignored by production builds). The component gallery `/_dev` exists only in
`nuxt dev`.

## Tests

| Command | What it runs |
|---|---|
| `npm test` (`vitest run`) | Unit tests (`tests/unit`): content fidelity, i18n routes, SEO head builder, components, contact API, consent, `nuxt.config` (TR-/DE-/BG-disabled builds, headers), DE and BG translation provenance and key parity. |
| `npm run test:e2e` (`playwright test`) | E2E (`tests/e2e`) against the **production build**: Playwright runs `npm run build && npm run preview` on port **3100** (never reuses a running server; a second `npm run preview` of the same build on **3101** with `NUXT_PUBLIC_LEGAL_REVIEW_NOTES=true` checks the legal review notes as a Preview deployment shows them), desktop (1440) and mobile (390) projects. Covers content fidelity, routing, 404 status, forms, SEO (head tags, sitemap, robots, JSON-LD), security headers and zero CSP violations on all 60 URLs, TR/DE/BG hreflang and links, DE and BG content fidelity (against the DE and BG modules), DE and BG text overflow, the BG header fit and the self-hosted Cyrillic font. |
| `npm run test:cloudflare` | Checks on the **Cloudflare Pages build** (`tests/cloudflare`, `dist/`): run `NITRO_PRESET=cloudflare-pages npm run build` first. `_headers` carries every security header on `/*` (exactly `routeRules['/**']`) and the noindex `X-Robots-Tag` on the thank-you pages; `_routes.json` leaves every non-file path to the function; no `404.html` or `_redirects` fallback; pages prerendered as `<route>.html`; `wrangler.json` has `nodejs_compat` and a date on or after 2025-04-01; the Cyrillic subset of the self-hosted Manrope ships from the site itself. Not part of `npm test`. |
| `npm run test:acceptance` | Acceptance checks (`tests/acceptance`) against the **built** `.output/`: run `npm run build` first (without a build it fails and says so). Starts the built server on a free port and scans all 60 routes: no forbidden claims (EN/TR/DE/BG); claim-sensitive words (AI, platform, portal, guarantee …) only in approved text of the same page, in visible text, `content`/`alt`/`aria-label`/`title` attributes and JSON-LD; no source comment from `app/`, `server/`, `i18n/`, `content/` in the public HTML/JS, the server bundle or the rendered pages. Not part of `npm test`. |
| `npm run typecheck` (`nuxt typecheck`) | `vue-tsc` over the app, server and config. |

CI (`.github/workflows/ci.yml`, every push and pull request, Node 22): `npm ci`, `npm test`, `npx nuxt typecheck`,
`npm run build`, `npm run test:acceptance`, then `NITRO_PRESET=cloudflare-pages npm run build` and
`npm run test:cloudflare`. The Playwright e2e suite is not run in CI: it builds the site a second
time and runs about 400 browser tests in two viewports (plus a Chromium download), which is slow for every push; run
`npm run test:e2e` locally before merging.

## Build and preview

```bash
npm run build      # .output/ (node-server output locally; on Cloudflare Pages the cloudflare-pages preset is detected)
npm run preview    # serves the production build
NITRO_PRESET=cloudflare-pages npm run build   # dist/: the Cloudflare Pages output, as Cloudflare's build makes it
```

Do not set `nitro.preset`: Nitro detects Cloudflare Pages during its build (`CF_PAGES=1`), and the local preview, e2e
and acceptance tests use the node server. `NITRO_PRESET=cloudflare-pages` builds the Pages output locally; `dist/` and
`.wrangler/` are git-ignored.

Other scripts:

- `npm run og:image` regenerates `public/og-default.png` (1200×630) from the HTML template in `scripts/og-image.ts`
  (navy ground, bars motif, "MOESA LTD." and the EN descriptor; Manrope from `node_modules`, no network). Commit the PNG.
- `npm run unreviewed:tr` regenerates `i18n/UNREVIEWED_TR.md`.
- `npm run unreviewed:de` regenerates `i18n/UNREVIEWED_DE.md` (DE page copy from `content/de/unreviewed.ts` and every key of `i18n/locales/de.json`).
- `npm run unreviewed:bg` regenerates `i18n/UNREVIEWED_BG.md` (BG page copy from `content/bg/unreviewed.ts` and every key of `i18n/locales/bg.json`).
- `npm run unreviewed:legal` regenerates `i18n/UNREVIEWED_LEGAL.md`: the legal text we wrote after the legal review
  (paths in `content/legal-revisions.ts`, EN/TR/DE/BG), the legal UI strings, and the package strings the legal pages dropped.

## Environment variables

Copy `.env.example` to `.env` locally. On Cloudflare Pages set them in *Settings → Variables and Secrets*, for
Production **and** Preview (secrets as type *Secret*). **Build-time** variables are read while `nuxt build` runs (some
pages are prerendered), so a change needs a redeploy; runtime variables are read by the Pages Function per request.

| Variable | Scope | Required in production | Description |
|---|---|---|---|
| `RESEND_API_KEY` | server, runtime | yes | Resend API key. Unset in `nuxt dev`: the email is printed to the terminal instead. |
| `CONTACT_TO` | server, runtime | no | Recipient of enquiries. Default `info@moesaltd.com`. |
| `CONTACT_FROM` | server, runtime | yes | Sender on a Resend-verified domain, e.g. `MOESA Website <website@moesaltd.com>`. The visitor's address is only used as Reply-To. |
| `NUXT_TURNSTILE_SECRET_KEY` | server, runtime | yes | Cloudflare Turnstile secret key. |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | public, **build-time** | yes | Turnstile site key. Empty → no widget and the server rejects submissions. |
| `NUXT_PUBLIC_ENABLE_TR` | public, **build + runtime** | no | `false` hides the Turkish site. At build time: no TR routes prerendered, no TR entry in the language switcher, no TR URLs or hreflang alternates (sitemap and pages). At runtime: every `/tr` path answers 404 with an all-EN 404 page (locale guard) and contact redirects go to EN paths. Set it once in the Pages project variables (they reach the build and the function) and **redeploy after changing it**: pages prerendered while the locale was on are static files the guard never sees, so flipping the flag at runtime alone leaves them reachable. Default: TR on. |
| `NUXT_PUBLIC_ENABLE_DE` | public, **build + runtime** | no | `false` hides the German site, exactly like `NUXT_PUBLIC_ENABLE_TR` for TR. With TR, DE and BG all off the switcher is not shown. Default: DE on. |
| `NUXT_PUBLIC_ENABLE_BG` | public, **build + runtime** | no | `false` hides the Bulgarian site, exactly like `NUXT_PUBLIC_ENABLE_TR` for TR (every `/bg` path answers 404, no BG switcher entry, sitemap URL or hreflang alternate). Default in code: BG on. `wrangler.toml` sets it to `true` for production and preview deployments. |
| `NUXT_PUBLIC_ANALYTICS_ID` | public, **build + runtime** | no — leave **empty** in v1 | `runtimeConfig.public.analyticsId`. Setting it adds the Analytics category and its buttons to the consent panel and shows the cookie consent banner (mounted in the default layout, until a choice is stored); no analytics loader exists in v1, so add one (and update the Cookie Policy) before setting it. Prerendered pages carry the build-time value, so redeploy after changing it. |
| `NUXT_PUBLIC_LEGAL_REVIEW_NOTES` | public, **build + runtime** | no — Preview only | `runtimeConfig.public.legalReviewNotes`. `true` shows the legal pages' review notes: the "DRAFT / TASLAK - LEGAL REVIEW REQUIRED" status chip and the dashed OPEN notes (owner facts still missing), for the lawyer and the owner. Any other value or unset → hidden: no chip, and the OPEN paragraphs are left out entirely. Set to `true` in `wrangler.toml` `[env.preview.vars]` only; production `[vars]` leaves it unset. The legal pages are rendered per request (not prerendered), so the runtime value applies. Default: off. |
| `CONTACT_TRUST_XFF` | server, runtime | no | `true` also trusts the first `X-Forwarded-For` entry for the rate-limit IP (only behind a proxy that overwrites it). Leave empty on Cloudflare. On Cloudflare (the request runs in the Pages Function) the IP comes from `CF-Connecting-IP`, which Cloudflare sets and overwrites; anywhere else that header is ignored and the socket address is used. |
| `CONTACT_DEV_BYPASS_TURNSTILE` | server, dev only | no — leave empty | `true` skips the Turnstile check **only in `nuxt dev`**; production builds ignore it. |
| `NUXT_SITE_INDEXABLE` | **build-time** | no | `false` in the Pages **Preview** environment only: robots.txt disallows everything and pages get `noindex`. Unset in Production. |
| `NODE_VERSION` | Pages build | yes (Pages) | `22.22.3` (Node for the Pages build; Nuxt 4.6 requires `^22.22.3`). |
| `E2E_PORT` | tests | — | Port for the Playwright web server. Default `3100`. |

## Deploying to Cloudflare Pages

The site runs on Cloudflare Pages (free plan): the prerendered pages and assets are static files on Cloudflare's
global network, and everything else (the other pages, the 404 page, `/api/contact`, `sitemap.xml`, `robots.txt`)
runs in one Pages Function (`dist/_worker.js`, a Worker). Nitro picks its `cloudflare-pages` preset by itself on
Cloudflare's build (which sets `CF_PAGES=1`); no `nitro.preset` is set, so local builds stay node-server. What the
Pages build writes (checked by `npm run test:cloudflare`, also in CI):

- `dist/_headers` from `routeRules`: the security headers on every path and `X-Robots-Tag: noindex, follow` on the
  thank-you pages, so static files get the same headers as function responses.
- `dist/_routes.json`: the function runs for `/*` except the built files, so unknown and disabled-locale paths reach
  it and answer 404 with the SSR error page. No `404.html` and no `_redirects` fallback is emitted.
- Prerendered pages as `<route>.html` (Pages would redirect `/about` to `/about/` for `about/index.html`).
- `dist/_worker.js/wrangler.json` with the runtime settings, merged from the root `wrangler.toml`.

The root **`wrangler.toml`** is the source of truth for the project's runtime settings: compatibility date
`2026-07-01`, flags `nodejs_compat` + `no_nodejs_compat_v2`, and the non-secret runtime variables (`[vars]`, repeated
under `[env.preview.vars]` because `vars` is not inherited). The Git-connected build reads it, and the dashboard then
shows those fields read-only, so change them in the file. Secrets and the build-time variables stay in the dashboard.
`[env.preview.vars]` also sets `NUXT_PUBLIC_LEGAL_REVIEW_NOTES = "true"`: Preview deployments show the legal pages'
Draft status chip and OPEN notes for the lawyer and the owner; production (`[vars]`, flag unset) shows neither.

1. **DNS to Cloudflare.** Add the zone `moesaltd.com` to the Cloudflare account (free plan), let Cloudflare import the
   existing records, and **before** switching the nameservers at Namecheap check that every mail record of the
   Namecheap Private Email mailbox (`info@moesaltd.com`) is there unchanged and **DNS only** (grey cloud): the `MX`
   records (`mx1/mx2.privateemail.com`), the SPF `TXT` on the apex, the DKIM `TXT` (`default._domainkey`) and the
   `mail` / `autodiscover` / `autoconfig` records if present. Then set the two Cloudflare nameservers at Namecheap
   (*Domain List → Manage → Nameservers → Custom DNS*). Remove any old Vercel `A` / `CNAME` records for `@` and `www`.
2. **Create the project:** *Workers & Pages → Create → Pages → Connect to Git* → `MOESA-LTD/web_landing`.
   - Project name: `moesa-website` (gives `moesa-website.pages.dev`; the name in `nitro.cloudflare.wrangler`).
   - Production branch: `main` (every other branch and pull request becomes a Preview deployment).
   - Framework preset: **None** (or Nuxt.js; either way set the two fields below).
   - Build command: `npm run build` · Build output directory: `dist` · Root directory: empty (repository root).
   - Build system version: **v3** (the newest).
3. **Variables and secrets** (*Settings → Variables and Secrets*): add them for **Production** and for **Preview**
   (each environment has its own list). Pages gives the same variables to the build and to the function; what matters
   is when they are read:
   - **Build-time** (read while `nuxt build` prerenders; change → redeploy): `NODE_VERSION=22.22.3` (Nuxt 4.6
     requires `^22.22.3`; Pages installs the exact version),
     `NUXT_PUBLIC_TURNSTILE_SITE_KEY`, `NUXT_PUBLIC_ENABLE_TR`, `NUXT_PUBLIC_ENABLE_DE`, `NUXT_PUBLIC_ENABLE_BG`, `NUXT_PUBLIC_ANALYTICS_ID`
     (leave unset in v1), and `NUXT_SITE_INDEXABLE=false` in **Preview only** (preview deployments then serve
     `Disallow: /` and `noindex`; leave it unset in Production).
   - **Runtime** (read by the function per request): `RESEND_API_KEY` and `NUXT_TURNSTILE_SECRET_KEY` as **Secret**
     (encrypted). The non-secret runtime variables (`CONTACT_FROM`, `CONTACT_TO`, `NUXT_PUBLIC_ENABLE_DE`, `NUXT_PUBLIC_ENABLE_BG`, and
     `NUXT_PUBLIC_ENABLE_TR` if TR is turned off) live in `wrangler.toml` `[vars]`; a locale flag set there must match
     the build-time value set here. Leave `CONTACT_TRUST_XFF` and `CONTACT_DEV_BYPASS_TURNSTILE` unset.
4. **Runtime settings** come from `wrangler.toml` (see above); nothing to set in *Settings → Runtime*.
   `nodejs_compat` is required: the function bundle imports Node.js built-ins, and with a date on or after 2025-04-01
   the runtime also fills `process.env` from the variables and secrets (the contact route reads the bindings directly
   as well, `server/utils/runtime-env.ts`). `NUXT_PUBLIC_ENABLE_DE`, `NUXT_PUBLIC_ENABLE_BG`, `CONTACT_TO` and
   `CONTACT_FROM` are in `[vars]`. DE and BG are `"true"` in `[vars]` (production) and in `[env.preview.vars]`; to take a
   locale offline set it to `"false"` in both and redeploy. `NUXT_PUBLIC_LEGAL_REVIEW_NOTES = "true"` is in `[env.preview.vars]` only (do not
   add it to Production).
5. **Custom domains** (*Project → Custom domains*): add `www.moesaltd.com` and `moesaltd.com`. Cloudflare creates the
   proxied `CNAME` records to `moesa-website.pages.dev` itself and issues the certificates.
6. **Apex → www redirect** (zone `moesaltd.com` → *Rules → Redirect Rules → Create rule*, or the template "Redirect
   from root to WWW"). Pages `_redirects` cannot match on the host, so this is a zone rule:
   - When incoming requests match: *Wildcard pattern*, Request URL `https://moesaltd.com/*`
   - Then: Target URL `https://www.moesaltd.com/${1}`, status **301**, **Preserve query string** on.
   Also turn on *SSL/TLS → Edge Certificates → Always Use HTTPS* (HTTP → HTTPS for both hosts).
7. Leave **Bot Fight Mode** (*Security → Bots*) off: it sets a `__cf_bm` cookie the Cookie Policy does not list and
   can challenge form posts. If it is ever turned on, update the cookie inventory first.
8. Deploy (push to `main`, or *Deployments → Retry deployment*). Pages builds with `npm ci` from `package-lock.json`.

Local check of the Pages output (no Cloudflare account needed):

```bash
NITRO_PRESET=cloudflare-pages npm run build   # dist/ (the Pages build), plus .wrangler/deploy/config.json
npm run test:cloudflare                       # _headers, _routes.json, wrangler.json, <route>.html
npx wrangler pages dev --binding RESEND_API_KEY=... --binding NUXT_TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
                                              # from the repository root, http://localhost:8788
```

### Resend (contact-form email)

Use a **subdomain** for sending, so none of the Namecheap Private Email records on the root domain (`MX`, the SPF
`TXT`, the `default._domainkey` DKIM) is touched:

1. In Resend, *Domains → Add domain* `notify.moesaltd.com` (any unused subdomain works; not `mail`, which Private Email
   may use).
2. Add the records Resend lists in the Cloudflare DNS of `moesaltd.com`, all **DNS only** (grey cloud): an `MX` and a
   `TXT` (SPF) record on `send.notify` and a `TXT` DKIM record on `resend._domainkey.notify`. Do not add a second
   apex SPF record or change the existing one. A DMARC `TXT` on `_dmarc` is optional and covers the whole domain,
   including the Private Email mailbox, so start with `p=none`.
3. Wait until the domain shows **Verified**, create an API key (*Sending access*, this domain) → `RESEND_API_KEY`.
4. Set `CONTACT_FROM` to an address on the verified subdomain, e.g. `MOESA Website <website@notify.moesaltd.com>`.

### Cloudflare Turnstile (spam protection)

1. In the Cloudflare dashboard, *Turnstile → Add widget*. Hostnames: `www.moesaltd.com` and `moesaltd.com`, plus
   `moesa-website.pages.dev` if preview deployments (`<branch>.moesa-website.pages.dev`, covered as a subdomain)
   should accept submissions. Widget mode: **Managed**.
2. Site key → `NUXT_PUBLIC_TURNSTILE_SITE_KEY` (build-time; redeploy after changing). Secret key →
   `NUXT_TURNSTILE_SECRET_KEY` (Secret).
3. The Content-Security-Policy already allows `https://challenges.cloudflare.com` for scripts and frames.

### Releases (release-please)

`.github/workflows/release-please.yml` runs on every push to `main` and keeps a release PR (version bump +
`CHANGELOG.md`) up to date from Conventional Commit messages. Merging that PR tags the release.

- The workflow needs permission to open PRs. Either enable *Organization settings → Actions → General → Workflow
  permissions → "Allow GitHub Actions to create and approve pull requests"* (and the same in the repository settings),
  or add a fine-grained PAT with *Contents* and *Pull requests* write access as the repository secret
  `RELEASE_PLEASE_TOKEN` (also makes CI run on the release PR).
- Merge feature PRs with a **merge commit or rebase, not squash** (unless the squash title is itself a Conventional
  Commit), so the individual `feat:` / `fix:` messages reach `main` and the changelog.

### Preview links on pull requests

`.github/workflows/pr-preview-link.yml` runs when the Cloudflare Pages GitHub app finishes its **Cloudflare Pages**
check run with success. It reads the "Branch Preview URL" and "Preview URL" from the check run summary and writes them
at the end of the description of every open PR whose head is that commit, between `<!-- preview-link:start -->` and
`<!-- preview-link:end -->`; each new deployment replaces that block. Production deployments (no open PR) are skipped.
`check_run` workflows run from the default branch only, so changes to this file take effect after they reach `main`.

## Post-deploy verification checklist

Run against a preview deployment (and again on production). `BASE=https://<branch>.moesa-website.pages.dev`, then
`BASE=https://www.moesaltd.com`.

- [ ] Unknown paths answer a real **404**:
  ```bash
  curl -sI "$BASE/nope" | head -1                     # HTTP/2 404
  curl -sI "$BASE/tr/olmayan-sayfa" | head -1         # HTTP/2 404
  curl -sI "$BASE/services/not-a-service" | head -1   # HTTP/2 404
  ```
- [ ] Key pages answer **200**:
  ```bash
  for p in / /services /services/operations-supply-chain /how-we-work /who-we-work-with /about /contact \
           /privacy-policy /cookie-policy /legal-notice /tr /tr/hizmetler /tr/iletisim; do
    printf '%s ' "$p"; curl -s -o /dev/null -w '%{http_code}\n' "$BASE$p"; done
  ```
- [ ] **Security headers** on a function page, a static page, an asset and a 404:
  ```bash
  curl -sI "$BASE/" | grep -iE 'strict-transport|x-content-type|referrer-policy|x-frame|permissions-policy|content-security'
  curl -sI "$BASE/contact" | grep -iE 'strict-transport|content-security'     # static file (_headers)
  curl -sI "$BASE/og-default.png" | grep -i x-content-type
  curl -sI "$BASE/nope" | grep -i content-security
  ```
- [ ] Prerendered pages answer without a trailing-slash redirect: `curl -sI "$BASE/services/operations-supply-chain" | head -1` → 200.
- [ ] **Sitemap and robots**: `curl -s "$BASE/sitemap.xml" | grep -c '<loc>'` → 14 per enabled locale (56 with all four;
  no `/thank-you`, `/tr/tesekkurler`, `/de/danke` or `/bg/blagodarim`; no `/bg` URL while BG is off); `curl -s "$BASE/robots.txt"` has `Disallow: /api/` and `Sitemap: https://www.moesaltd.com/sitemap.xml`
  (on a preview deployment with `NUXT_SITE_INDEXABLE=false` robots.txt disallows everything — expected).
- [ ] `/thank-you` sends `X-Robots-Tag: noindex, follow`.
- [ ] Open `/contact` in a browser with DevTools: the Turnstile widget renders, **no CSP errors in the console**, and a
  test enquiry arrives at `CONTACT_TO` with the visitor as Reply-To.
- [ ] After the domain switch: `curl -sI "https://moesaltd.com/about?x=1"` → 301 to `https://www.moesaltd.com/about?x=1`
  (Redirect Rule), and `curl -sI http://www.moesaltd.com/` → 301 to `https://` (Always Use HTTPS).
- [ ] Mail still works after the nameserver switch: send to and from `info@moesaltd.com`.
- [ ] Share preview (e.g. a LinkedIn post inspector) shows `og-default.png` and the page title.

## Before launch

From `MOESA_Website_Package_v1.0/.../legal/LEGAL_IMPLEMENTATION_NOTES.md` and the legal review
(`docs/superpowers/reviews/2026-11-01-legal-pages-review.md`). The legal pages now describe the real stack (Cloudflare
Pages hosting and Turnstile, Resend, the `moesa_consent` cookie; no analytics, no file upload), but they are still our drafts,
not legal advice: every authored string is in `i18n/UNREVIEWED_LEGAL.md`. Before publication:

- [ ] Owner facts for the OPEN notes: legal form (ЕООД/ООД) and Commercial Register entry, managing director, phone
  number (`+359 88 501 661` looks one digit short), retention periods (enquiries, Cloudflare logs, Resend emails).
  The OPEN notes and the Draft chip are shown on Preview deployments only (`NUXT_PUBLIC_LEGAL_REVIEW_NOTES`); the
  live site already hides them, so a missing fact is simply absent there until it is filled in. The mailbox provider
  is named (Namecheap, Inc., Private Email); the lawyer should confirm its DPA and transfer basis like the others.
- [ ] Lawyer: review `i18n/UNREVIEWED_LEGAL.md` (legal bases, recipients, transfers incl. DPF/SCCs per provider, CPDP
  complaint text, the contact-form acknowledgement instead of consent, Turnstile as strictly necessary without consent).
- [ ] Processing location (review S6, an owner decision): the Pages Function for `/api/contact` runs in the Cloudflare
  data centre that receives the request (usually near the visitor), and the static pages are served from Cloudflare's
  global network. Pinning processing to the EU (Regional Services / Data Localization Suite) is not part of the free
  plan. Leave *Smart Placement* off.
- [ ] Cloudflare logs: check which request and function logs Cloudflare keeps for the Pages project on the free plan
  (Functions real-time logs are a live stream) and record the retention in the privacy policy OPEN note.
- [ ] Check in DevTools (Application tab, frame `challenges.cloudflare.com`) whether Turnstile stores anything, and
  adjust the Cookie Policy inventory text if needed.
- [ ] Record legal review and technical review before changing these pages to FINAL status. Production already hides
  the "DRAFT / TASLAK - LEGAL REVIEW REQUIRED" chip and the OPEN notes (`NUXT_PUBLIC_LEGAL_REVIEW_NOTES` is unset
  there), so at the lawyer's sign-off nothing changes for production except setting `LEGAL_UPDATED` in
  `content/en/legal.ts` to the publication date. Preview deployments keep showing the notes until they are removed
  from the content.

Also:

- [ ] Review the Turkish strings in `i18n/UNREVIEWED_TR.md` (translated by us, no approved source).
- [ ] Review the German strings in `i18n/UNREVIEWED_DE.md` (the whole German site is our translation of the approved
  EN; nothing in it is approved yet), or set `NUXT_PUBLIC_ENABLE_DE=false` until it is.
- [ ] Review the Bulgarian strings in `i18n/UNREVIEWED_BG.md` (the whole Bulgarian site is our translation of the
  approved EN) on a preview deployment, then set `NUXT_PUBLIC_ENABLE_BG = "true"` in `wrangler.toml` `[vars]` (and the
  production build-time variable) to publish it.
- [ ] **Bulgarian legal review before the BG launch:** the Bulgarian Политика за поверителност, Политика за
  бисквитките and Правна информация (`/bg/politika-za-poveritelnost`, `/bg/politika-za-biskvitkite`,
  `/bg/pravna-informatsiya`) are translated drafts of the EN drafts with the same open items (legal form and register
  entry, управител, phone, mailbox provider, retention periods); the legal text written after the legal review is in
  `i18n/UNREVIEWED_LEGAL.md` with its BG column. The registered address is shown as in the package (Latin script);
  give its Bulgarian form as entered in the Commercial Register if the BG pages should use it.
- [ ] **German legal review before the DE launch:** the German Impressum (`/de/impressum`), Datenschutzerklärung
  (`/de/datenschutz`) and Cookie-Richtlinie must meet German requirements. The Impressum needs the § 5 DDG details the
  package does not yet have: the **Geschäftsführer** (managing director / legal representative), the
  **Registergericht** and **Registernummer** (register court and number; for MOESA Ltd. the Bulgarian commercial
  register entry, EIK 207200475), plus the VAT ID (USt-IdNr. BG207200475) and the contact details already shown. The
  Datenschutzerklärung needs the GDPR information duties in German. All three are translated drafts of the EN drafts
  with the same open items.
- [ ] Provide an **SVG logo** (the site currently uses the PNG lockup/mark from the package; the Organization JSON-LD
  points to `/moesa_lockup.png`).
- [ ] Set the production env vars, verify the Resend domain and the Turnstile widget, run the post-deploy checklist.

## Third-party inventory

| Service | Purpose | Data |
|---|---|---|
| **Cloudflare** | DNS; hosting on Pages (static files on the global network, one Pages Function / Worker for the SSR pages and `/api/contact`); the apex → www redirect; Turnstile spam check on `/contact` (script and iframe from `challenges.cloudflare.com`, loaded on the contact pages only) | Request data (IP, user agent) at the edge and in logs if enabled; browser signals for the challenge, the visitor IP on verification |
| **Resend** | Sends the contact-form enquiry to `CONTACT_TO` | The form fields of each enquiry |

- **Fonts are self-hosted** (`@fontsource-variable/manrope`, served from the site; no Google Fonts). Its Cyrillic
  subset (for the Bulgarian pages) is part of the same package and is loaded only where Cyrillic text is shown.
- **No analytics** and no non-essential cookies in v1. The only first-party cookie is the strictly necessary
  `moesa_consent`, written only when a visitor saves a cookie choice. A choice is offered (Cookie Policy panel and
  banner) only once `NUXT_PUBLIC_ANALYTICS_ID` is set, so v1 never writes it; the panel shows "Strictly necessary"
  and a note that there is nothing to choose.
- **Logs:** the contact route logs only an error message on a failed Resend or Turnstile call (no form data, no stack);
  Cloudflare's function and request logs follow the plan's retention (see "Before launch").

## SEO and security (reference)

- Canonical origin `https://www.moesaltd.com`; every page has a self-referencing canonical and `hreflang` alternates
  en / tr / de / bg / x-default (EN) for the enabled locales, plus `og:locale` (en_GB, tr_TR, de_DE, bg_BG) and
  `og:locale:alternate`. Sitemap: 14 URLs per enabled locale (56 with all four) from `i18n/routes.ts`, thank-you
  pages excluded.
- Organization JSON-LD on `/`, `/tr`, `/de` and `/bg` (facts from `data/brand_tokens.json` only).
- Security headers on every response (`routeRules['/**']` in `nuxt.config.ts`; on Cloudflare Pages Nitro also writes
  them to `dist/_headers` for the static files): HSTS (2 years, preload),
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, and a CSP allowing
  only the site itself plus Cloudflare Turnstile. Fonts are never inlined as `data:` URIs (the CSP's `font-src 'self'`).
