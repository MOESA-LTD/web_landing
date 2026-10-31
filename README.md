# MOESA Ltd. website

The public website of MOESA Ltd. (`https://www.moesaltd.com`), in English, Turkish and German.

Nuxt 4 · Tailwind CSS v4 · `@nuxtjs/i18n` (EN at `/`, TR under `/tr/` with Turkish slugs, DE under `/de/` with German slugs) · `@nuxtjs/sitemap` and
`@nuxtjs/robots` · contact form via a Nitro server route → Resend, protected by Cloudflare Turnstile. Hosted on Vercel.

All page copy comes verbatim from the approved package in `MOESA_Website_Package_v1.0/` (EN) and its TR files.
Turkish strings that have no approved source are listed in `i18n/UNREVIEWED_TR.md`. The German site has no approved
source at all: every German string is our translation of the approved EN and is listed in `i18n/UNREVIEWED_DE.md`.

## Requirements

- Node.js **22** (`.nvmrc` = `22`; `package.json` `engines.node` = `22.x`, so Vercel builds with the newest Node 22
  and never moves to a new major on its own; Nuxt 4.6 needs `>=22.21`). npm. Also set *Node.js Version* to **22.x** in
  the Vercel project settings (*Project → Settings → Build and Deployment*) so the two never disagree.
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
| `npm test` (`vitest run`) | Unit tests (`tests/unit`): content fidelity, i18n routes, SEO head builder, components, contact API, consent, `nuxt.config` (TR-/DE-disabled builds, headers), DE translation provenance and key parity. |
| `npm run test:e2e` (`playwright test`) | E2E (`tests/e2e`) against the **production build**: Playwright runs `npm run build && npm run preview` on port **3100** (never reuses a running server), desktop (1440) and mobile (390) projects. Covers content fidelity, routing, 404 status, forms, SEO (head tags, sitemap, robots, JSON-LD), security headers and zero CSP violations on all 45 URLs, TR/DE hreflang and links, DE content fidelity (against the DE modules) and DE text overflow. |
| `npm run test:acceptance` | Acceptance checks (`tests/acceptance`) against the **built** `.output/`: run `npm run build` first (without a build it fails and says so). Starts the built server on a free port and scans all 45 routes: no forbidden claims (EN/TR/DE); claim-sensitive words (AI, platform, portal, guarantee …) only in approved text of the same page, in visible text, `content`/`alt`/`aria-label`/`title` attributes and JSON-LD; no source comment from `app/`, `server/`, `i18n/`, `content/` in the public HTML/JS, the server bundle or the rendered pages. Not part of `npm test`. |
| `npm run typecheck` (`nuxt typecheck`) | `vue-tsc` over the app, server and config. |

CI (`.github/workflows/ci.yml`, every push and pull request, Node 22): `npm ci`, `npm test`, `npx nuxt typecheck`,
`npm run build`, `npm run test:acceptance`. The Playwright e2e suite is not run in CI: it builds the site a second
time and runs about 400 browser tests in two viewports (plus a Chromium download), which is slow for every push; run
`npm run test:e2e` locally before merging.

## Build and preview

```bash
npm run build      # .output/ (node-server output locally; on Vercel the Vercel preset is detected automatically)
npm run preview    # serves the production build
```

Do not set `nitro.preset`: Vercel is auto-detected during its build, and the local preview and e2e use the node server.

Other scripts:

- `npm run og:image` regenerates `public/og-default.png` (1200×630) from the HTML template in `scripts/og-image.ts`
  (navy ground, bars motif, "MOESA LTD." and the EN descriptor; Manrope from `node_modules`, no network). Commit the PNG.
- `npm run unreviewed:tr` regenerates `i18n/UNREVIEWED_TR.md`.
- `npm run unreviewed:de` regenerates `i18n/UNREVIEWED_DE.md` (DE page copy from `content/de/unreviewed.ts` and every key of `i18n/locales/de.json`).

## Environment variables

Copy `.env.example` to `.env` locally. On Vercel set them in *Project → Settings → Environment Variables* (Production
and Preview). **Build-time** variables are read while `nuxt build` runs (some pages are prerendered), so a change needs
a redeploy.

| Variable | Scope | Required in production | Description |
|---|---|---|---|
| `RESEND_API_KEY` | server, runtime | yes | Resend API key. Unset in `nuxt dev`: the email is printed to the terminal instead. |
| `CONTACT_TO` | server, runtime | no | Recipient of enquiries. Default `info@moesaltd.com`. |
| `CONTACT_FROM` | server, runtime | yes | Sender on a Resend-verified domain, e.g. `MOESA Website <website@moesaltd.com>`. The visitor's address is only used as Reply-To. |
| `NUXT_TURNSTILE_SECRET_KEY` | server, runtime | yes | Cloudflare Turnstile secret key. |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | public, **build-time** | yes | Turnstile site key. Empty → no widget and the server rejects submissions. |
| `NUXT_PUBLIC_ENABLE_TR` | public, **build + runtime** | no | `false` hides the Turkish site. At build time: no TR routes prerendered, no TR entry in the language switcher, no TR URLs or hreflang alternates (sitemap and pages). At runtime: every `/tr` path answers 404 with an all-EN 404 page (locale guard) and contact redirects go to EN paths. Set it once in the Vercel project env (it applies to both). Default: TR on. |
| `NUXT_PUBLIC_ENABLE_DE` | public, **build + runtime** | no | `false` hides the German site, exactly like `NUXT_PUBLIC_ENABLE_TR` for TR. With both off the switcher is not shown. Default: DE on. |
| `NUXT_PUBLIC_ANALYTICS_ID` | public, **build + runtime** | no — leave **empty** in v1 | `runtimeConfig.public.analyticsId`. Setting it only shows the cookie consent banner (mounted in the default layout, until a choice is stored); no analytics loader exists in v1. Prerendered pages carry the build-time value, so redeploy after changing it. |
| `CONTACT_TRUST_XFF` | server, runtime | no | `true` also trusts the first `X-Forwarded-For` entry for the rate-limit IP (only behind a proxy that overwrites it). Leave empty on Vercel. On Vercel (`VERCEL` set by its runtime) the IP comes from `x-vercel-forwarded-for` / `x-real-ip`; anywhere else those headers are ignored and the socket address is used. |
| `CONTACT_DEV_BYPASS_TURNSTILE` | server, dev only | no — leave empty | `true` skips the Turnstile check **only in `nuxt dev`**; production builds ignore it. |
| `NUXT_SITE_INDEXABLE` | **build-time** | no | `false` on Vercel **Preview** only: robots.txt disallows everything and pages get `noindex`. Unset in Production. |
| `E2E_PORT` | tests | — | Port for the Playwright web server. Default `3100`. |

## Deploying to Vercel

1. **Import the repository** `github.com/MOESA-LTD/web_landing` in Vercel (*Add New → Project*). Framework preset:
   **Nuxt** (detected). Build command `npm run build`, output handled by the preset. Node version comes from
   `engines.node` (`22.x`); also set *Node.js Version* to **22.x** in the project settings.
2. **Environment variables**: set the table above for *Production* and *Preview* (use Turnstile test keys or a
   separate widget hostname for previews if you want the form to work there).
3. **Domains** (*Project → Settings → Domains*):
   - Add `www.moesaltd.com` and make it the **primary** domain.
   - Add `moesaltd.com` and set it to **redirect (308) to `www.moesaltd.com`**. `vercel.json` also redirects any
     request whose host is `moesaltd.com` to `https://www.moesaltd.com/:path*` (permanent), so the redirect holds
     even if the domain is attached without a redirect. HTTP → HTTPS is automatic on Vercel.
4. **DNS** at the registrar of `moesaltd.com` (Vercel shows the exact values for the project; these are the usual ones):
   - `moesaltd.com` (apex): `A` record → `76.76.21.21`
   - `www`: `CNAME` → `cname.vercel-dns.com` (or the project-specific value Vercel shows)
   - Keep the existing `MX` records for `info@moesaltd.com` untouched.
5. Set `NUXT_SITE_INDEXABLE=false` for the **Preview** environment only, so preview deployments serve
   `Disallow: /` and `noindex` (`@nuxtjs/robots` does not detect Vercel previews by itself). Leave it unset for
   Production.
6. Deploy.

### Resend (contact-form email)

1. In Resend, *Domains → Add domain* `moesaltd.com` (a subdomain such as `mail.moesaltd.com` also works and keeps the
   root domain's SPF untouched).
2. Add the DNS records Resend lists — typically an `MX` and a `TXT` (SPF) record on the `send` subdomain and a
   `TXT` DKIM record (`resend._domainkey`). Optionally add a DMARC `TXT` record on `_dmarc`.
3. Wait until the domain shows **Verified**, create an API key (*Sending access*, this domain) → `RESEND_API_KEY`.
4. Set `CONTACT_FROM` to an address on the verified domain, e.g. `MOESA Website <website@moesaltd.com>`.

### Cloudflare Turnstile (spam protection)

1. In the Cloudflare dashboard, *Turnstile → Add widget*. Hostnames: `www.moesaltd.com` and `moesaltd.com` (add your
   Vercel preview hostname if previews should accept submissions). Widget mode: **Managed**.
2. Site key → `NUXT_PUBLIC_TURNSTILE_SITE_KEY` (build-time; redeploy after changing). Secret key →
   `NUXT_TURNSTILE_SECRET_KEY`.
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

## Post-deploy verification checklist

Run against the Vercel preview URL (and again on production). `BASE=https://<deployment>.vercel.app`.

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
- [ ] **Security headers** on a page, an asset and a 404:
  ```bash
  curl -sI "$BASE/" | grep -iE 'strict-transport|x-content-type|referrer-policy|x-frame|permissions-policy|content-security'
  curl -sI "$BASE/og-default.png" | grep -i x-content-type
  curl -sI "$BASE/nope" | grep -i content-security
  ```
- [ ] **Sitemap and robots**: `curl -s "$BASE/sitemap.xml" | grep -c '<loc>'` → `42` (no `/thank-you`,
  `/tr/tesekkurler` or `/de/danke`); `curl -s "$BASE/robots.txt"` has `Disallow: /api/` and `Sitemap: https://www.moesaltd.com/sitemap.xml`
  (on a preview deployment with `NUXT_SITE_INDEXABLE=false` robots.txt disallows everything — expected).
- [ ] `/thank-you` sends `X-Robots-Tag: noindex, follow`.
- [ ] Open `/contact` in a browser with DevTools: the Turnstile widget renders, **no CSP errors in the console**, and a
  test enquiry arrives at `CONTACT_TO` with the visitor as Reply-To.
- [ ] After the domain switch: `curl -sI http://moesaltd.com/about` → 308 to `https://www.moesaltd.com/about`.
- [ ] Share preview (e.g. a LinkedIn post inspector) shows `og-default.png` and the page title.

## Before launch

From `MOESA_Website_Package_v1.0/.../legal/LEGAL_IMPLEMENTATION_NOTES.md` — the Legal Notice, Privacy Policy and Cookie
Policy are implementation drafts, not final legal advice. Before publication confirm:

- [ ] legal representative / managing director details
- [ ] hosting and email providers
- [ ] contact-form provider and data route
- [ ] analytics and tag-management tools
- [ ] cookie inventory and consent configuration
- [ ] embedded media and third-party services
- [ ] CRM, file upload and scheduling services
- [ ] data retention periods
- [ ] international data transfers
- [ ] supervisory authority and country-specific legal requirements
- [ ] Record legal review and technical review before changing these pages to FINAL status (then remove the
  "DRAFT / TASLAK - LEGAL REVIEW REQUIRED" chip).

Also:

- [ ] Review the Turkish strings in `i18n/UNREVIEWED_TR.md` (translated by us, no approved source).
- [ ] Review the German strings in `i18n/UNREVIEWED_DE.md` (the whole German site is our translation of the approved
  EN; nothing in it is approved yet), or set `NUXT_PUBLIC_ENABLE_DE=false` until it is.
- [ ] **German legal review before the DE launch:** the German Impressum (`/de/impressum`), Datenschutzerklärung
  (`/de/datenschutz`) and Cookie-Richtlinie must meet German requirements. The Impressum needs the § 5 DDG details the
  package does not yet have: the **Geschäftsführer** (managing director / legal representative), the
  **Registergericht** and **Registernummer** (register court and number; for MOESA Ltd. the Bulgarian commercial
  register entry, EIK 207200475), plus the VAT ID (USt-IdNr. BG207200475) and the contact details already shown. The
  Datenschutzerklärung needs the GDPR information duties in German. All three are translated drafts of the EN drafts
  with the same open items.
- [ ] Legal review of the legal drafts, including the cookie-inventory row for the strictly necessary
  `moesa_consent` cookie.
- [ ] Provide an **SVG logo** (the site currently uses the PNG lockup/mark from the package; the Organization JSON-LD
  points to `/moesa_lockup.png`).
- [ ] Set the production env vars, verify the Resend domain and the Turnstile widget, run the post-deploy checklist.

## Third-party inventory

| Service | Purpose | Data |
|---|---|---|
| **Vercel** | Hosting, CDN, serverless function for `/api/contact` | Request logs (IP, user agent) |
| **Resend** | Sends the contact-form enquiry to `CONTACT_TO` | The form fields of each enquiry |
| **Cloudflare Turnstile** | Spam check on `/contact` (script and iframe from `challenges.cloudflare.com`, loaded on the contact pages only) | Browser signals for the challenge, the visitor IP on verification |

- **Fonts are self-hosted** (`@fontsource-variable/manrope`, served from the site; no Google Fonts).
- **No analytics** and no non-essential cookies in v1. The only cookie is the strictly necessary `moesa_consent`
  (only written when the consent banner is enabled via `NUXT_PUBLIC_ANALYTICS_ID`).

## SEO and security (reference)

- Canonical origin `https://www.moesaltd.com`; every page has a self-referencing canonical and `hreflang` alternates
  en / tr / de / x-default (EN). Sitemap: 42 URLs (14 per locale) from `i18n/routes.ts`, thank-you pages excluded.
- Organization JSON-LD on `/`, `/tr` and `/de` (facts from `data/brand_tokens.json` only).
- Security headers on every response (`routeRules['/**']` in `nuxt.config.ts`): HSTS (2 years, preload),
  `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options: DENY`, `Permissions-Policy`, and a CSP allowing
  only the site itself plus Cloudflare Turnstile. Fonts are never inlined as `data:` URIs (the CSP's `font-src 'self'`).
