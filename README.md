# MOESA Ltd. website

Public website of MOESA Ltd. — https://www.moesaltd.com — in English, Turkish, German and Bulgarian.

Nuxt 4 · Tailwind CSS v4 · `@nuxtjs/i18n` · contact form → Resend, protected by Cloudflare Turnstile ·
hosted on Cloudflare Pages.

## Content

- The approved copy lives in `content/approved/{en,tr}/*.md` and the site data (brand tokens, navigation, contact
  form, page map) in `content/data/*.json`, both taken unchanged from MOESA_Website_Package v1.0. English copy comes
  verbatim from the approved copy; the page modules in `content/<locale>/` name their source md.
- TR, DE and BG are our translations where no approved text exists; every such string is listed in
  `i18n/UNREVIEWED_{TR,DE,BG}.md`. Legal text we wrote is listed in `i18n/UNREVIEWED_LEGAL.md`.
  Regenerate the lists with `npm run unreviewed:tr|de|bg|legal`.
- Page paths for every locale live in `i18n/routes.ts` (EN at `/`, others under `/tr/`, `/de/`, `/bg/`).

## Local development

Requires Node.js 22 (`.nvmrc`).

```bash
npm i
cp .env.example .env   # optional, see below
npm run dev            # http://localhost:3000
```

Without an email API key the contact form prints the email to the terminal instead of sending it.
`CONTACT_DEV_BYPASS_TURNSTILE=true` skips the Turnstile check in `nuxt dev` only.

## Tests

| Command | What it runs |
|---|---|
| `npm test` | Unit tests (`tests/unit`) |
| `npm run typecheck` | `vue-tsc` |
| `npm run test:e2e` | Playwright against the production build (needs `npx playwright install chromium`) |
| `npm run test:acceptance` | Claim and source-leak checks on the built site (run `npm run build` first) |
| `npm run test:cloudflare` | Checks on the Pages output (run `NITRO_PRESET=cloudflare-pages npm run build` first) |

CI (`.github/workflows/ci.yml`) runs everything except e2e on every PR and on `main`; run `npm run test:e2e`
locally before merging.

## Deployment (Cloudflare Pages)

- Project `moesa-website`, connected to this repo. `main` deploys to production; every other branch gets a preview
  at `https://<branch>.moesa-website.pages.dev`. Build command `npm run build`, output `dist`.
- **`wrangler.toml` is the source of truth** for runtime settings and public variables (`[vars]` for production,
  `[env.preview.vars]` for previews). The Cloudflare dashboard shows them read-only — change them in the file and merge.
- API keys are kept in the Cloudflare dashboard, never in the repository. `NODE_VERSION=22.22.3` is set there as a build
  variable.
- DNS for `moesaltd.com` is on Cloudflare (registrar: Namecheap). The Namecheap Private Email records (MX, SPF,
  `default._domainkey`, `mail`/`autodiscover`/`autoconfig`) must stay **DNS only**. A zone Redirect Rule sends
  `moesaltd.com/*` to `https://www.moesaltd.com/`. Resend sends from the subdomain `notify.moesaltd.com`.

### Variables

| Variable | Where | Purpose |
|---|---|---|
| `NUXT_PUBLIC_ENABLE_TR` / `_DE` / `_BG` | `wrangler.toml` | `"false"` takes that language offline (404, removed from switcher, sitemap, hreflang). Default on. |
| `NUXT_PUBLIC_LEGAL_REVIEW_NOTES` | `wrangler.toml` (preview only) | Shows the legal pages' draft chip and open notes for reviewers. Off in production. |
| `NUXT_SITE_INDEXABLE` | `wrangler.toml` (preview only) | `"false"` keeps previews out of search engines. |
| `NUXT_PUBLIC_TURNSTILE_SITE_KEY` | `wrangler.toml` | Turnstile site key (public). |
| `CONTACT_TO` / `CONTACT_FROM` | `wrangler.toml` | Enquiry recipient and sender. |
| `NUXT_PUBLIC_ANALYTICS_ID` | — | Leave unset: there is no analytics. Setting it would show a cookie banner. |

Language flags and the site key are read at build time, so a change needs a new deployment (merging the change does
that). See `.env.example` for local values.

### Workflows

- `release-please.yml` keeps a release PR (version + `CHANGELOG.md`) from Conventional Commit messages. Merge feature
  PRs with a **merge commit, not squash**.
- `pr-preview-link.yml` adds the Cloudflare preview links to the end of a PR's description after each successful
  preview deployment.
