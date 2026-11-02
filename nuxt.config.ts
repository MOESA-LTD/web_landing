import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { buildI18nPages, contactPrerenderRoutes, localeOptionsFromEnv, servicePrerenderRoutes, sitemapUrls } from './i18n/routes'

// NUXT_PUBLIC_ENABLE_TR=false hides TR, NUXT_PUBLIC_ENABLE_DE=false hides DE and NUXT_PUBLIC_ENABLE_BG=false hides BG:
// no routes of that locale are prerendered, the switcher leaves it out, and the sitemap and hreflang alternates do not list it. The same flags are
// read again at runtime (locale guard, contact redirects), so set them for build and runtime alike.
const locales = localeOptionsFromEnv(process.env)
const { enableTr, enableDe, enableBg } = locales

const SITE_URL = 'https://www.moesaltd.com'

/**
 * Cloudflare Workers runtime settings for the Pages Function (`_worker.js`). Nitro writes them to
 * `dist/_worker.js/wrangler.json` (`cloudflare.deployConfig`), which `wrangler pages dev` / `wrangler pages deploy`
 * read. A Git-connected Pages project reads its runtime settings from the dashboard instead, so the same date and flags
 * are entered there (README, "Deploying to Cloudflare Pages"). The date is before 2026-08-04, the date from which
 * `nodejs_compat` is on by default, so the flag is listed explicitly; with `nodejs_compat` and a date on or after
 * 2025-04-01 the Workers runtime also fills `process.env` from the project's variables and secrets.
 */
export const CLOUDFLARE_COMPATIBILITY_DATE = '2026-07-01'

/**
 * Sent on every response (pages, assets, API, 404). On Cloudflare Pages the static files are served without the
 * function, so the Pages build also writes these route rules to `dist/_headers` (Nitro does it for the preset; checked
 * by tests/cloudflare). The CSP allows Cloudflare Turnstile (script + iframe on
 * /contact), Nuxt's inline hydration scripts ('unsafe-inline'; the JSON payload is not executed) and inline styles.
 * Fonts are self-hosted (@fontsource), images are local or data: URIs. No analytics origin: v1 loads none.
 */
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com",
    'frame-src https://challenges.cloudflare.com',
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "connect-src 'self'",
    "font-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; '),
}

export default defineNuxtConfig({
  compatibilityDate: '2026-10-30',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
    // The component gallery (app/pages/_dev) exists only in `nuxt dev`: production builds drop the route,
    // so /_dev/** is a 404 there and is never prerendered or listed in a sitemap.
    (_options, nuxt) => {
      if (nuxt.options.dev) return
      nuxt.hook('pages:extend', (pages) => {
        for (let i = pages.length - 1; i >= 0; i--) {
          if (pages[i]!.path.startsWith('/_dev')) pages.splice(i, 1)
        }
      })
    },
    // Cloudflare Pages serves `about/index.html` at `/about/` and redirects `/about` there (308), but serves `about.html`
    // at `/about` itself. The Pages build therefore prerenders to `<route>.html`, so the canonical slash-less URLs
    // answer 200. The node-server build (preview, e2e, acceptance) keeps Nitro's default `<route>/index.html`.
    (_options, nuxt) => {
      nuxt.hook('nitro:init', (nitro) => {
        if (nitro.options.preset.startsWith('cloudflare-pages')) nitro.options.prerender.autoSubfolderIndex = false
      })
    },
  ],
  css: ['~/assets/css/main.css'],
  // Components are named by file, not by folder: <Button>, <PageHero>, <Logo> (not <UiButton> ...).
  components: [{ path: '~/components', pathPrefix: false }],
  site: {
    url: SITE_URL,
    name: 'MOESA Ltd.',
  },
  routeRules: {
    '/**': { headers: SECURITY_HEADERS },
    // `robots: false` is read by @nuxtjs/robots (noindex meta + X-Robots-Tag); the explicit header stays as a backstop.
    '/_dev/**': { prerender: false, robots: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    // The form endpoint is a server route (the Pages Function on Cloudflare), never prerendered.
    '/api/**': { prerender: false },
    // The thank-you page is reached after a form post only: keep it out of search results (@nuxtjs/robots sends
    // the X-Robots-Tag header and the robots meta; the page also sets the meta itself).
    '/thank-you': { robots: 'noindex, follow' },
    '/tr/tesekkurler': { robots: 'noindex, follow' },
    '/de/danke': { robots: 'noindex, follow' },
    '/bg/blagodarim': { robots: 'noindex, follow' },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Never inline a font as a data: URI (Vite inlines files under 4 kB, e.g. a small Manrope subset):
      // the CSP allows fonts from 'self' only.
      assetsInlineLimit: (file: string) => (/\.(woff2?|ttf|otf)$/.test(file) ? false : undefined),
    },
  },
  alias: {
    '#content': fileURLToPath(new URL('./content', import.meta.url)),
    '#pkg': fileURLToPath(new URL('./MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0', import.meta.url)),
  },
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      // public/favicon.png (64x64). Without the link browsers request /favicon.ico, which renders the 404 page.
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    },
  },
  runtimeConfig: {
    // Server-only secrets (RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, NUXT_TURNSTILE_SECRET_KEY) are read at request
    // time by server/api/contact.post.ts (server/utils/runtime-env.ts: the Cloudflare bindings, else process.env);
    // see .env.example.
    public: {
      enableTr,
      enableDe,
      enableBg,
      // NUXT_PUBLIC_TURNSTILE_SITE_KEY. /contact is prerendered, so the key must be set at build time.
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      // NUXT_PUBLIC_ANALYTICS_ID. Empty in v1: the cookie banner (layouts/default.vue) shows only when it is set and
      // no choice is stored. No analytics script is loaded either way; a future loader must also check the consent.
      analyticsId: process.env.NUXT_PUBLIC_ANALYTICS_ID ?? '',
    },
  },
  nitro: {
    // Minify the server bundle (terser, comments: false): Nitro keeps source comments in it otherwise, and the
    // acceptance test (tests/unit/claims.test.ts) asserts that no app source comment ships in .output.
    minify: true,
    // resend lazily imports the optional `@react-email/render` (React templates, unused here). The Workers bundle
    // must resolve every import, so it gets a stub that throws if it were ever called.
    alias: {
      '@react-email/render': fileURLToPath(new URL('./server/stubs/react-email-render.ts', import.meta.url)),
    },
    prerender: {
      // The services overview and the five service pages, EN + TR + DE + BG (24 URLs; 6 per enabled locale), plus the
      // contact and thank-you pages (2 per enabled locale). /api/contact stays a server route.
      // No /404.html: Nuxt would emit an SPA shell (no noindex, no SSR copy), and on Cloudflare Pages Nitro would turn
      // it into a `/* /404.html 404` fallback. Unknown paths reach the server (the Pages Function: `_routes.json`
      // includes `/*` and excludes only the built files; `nuxt preview` locally) and error.vue renders them with
      // HTTP 404, in the path's locale.
      routes: [...servicePrerenderRoutes(locales), ...contactPrerenderRoutes(locales)],
    },
    // Used only by the Cloudflare presets (NITRO_PRESET=cloudflare-pages, or auto-detected from CF_PAGES in the Pages
    // build); a local `npm run build` stays node-server. `nodeCompat` uses the Workers runtime's Node.js APIs
    // (needs the `nodejs_compat` flag); `deployConfig` writes `dist/_worker.js/wrangler.json` with the runtime settings.
    cloudflare: {
      nodeCompat: true,
      deployConfig: true,
      wrangler: {
        name: 'moesa-website',
        compatibility_date: CLOUDFLARE_COMPATIBILITY_DATE,
        compatibility_flags: ['nodejs_compat'],
      },
    },
  },
  // The sitemap lists exactly the indexable pages from i18n/routes.ts (56 URLs: 14 per locale EN/TR/DE/BG, no thank-you
  // page, no /_dev, no /api), each with its hreflang alternates en/tr/de/bg/x-default, the same set as the pages' own
  // <link rel="alternate">. The URLs are given explicitly (and the module's own page discovery and i18n
  // expansion are off) because the five service pages share one dynamic route that the module cannot expand,
  // and because NUXT_PUBLIC_ENABLE_TR=false / NUXT_PUBLIC_ENABLE_DE=false / NUXT_PUBLIC_ENABLE_BG=false must drop every
  // URL and alternate of that locale.
  sitemap: {
    autoI18n: false,
    excludeAppSources: true,
    urls: sitemapUrls(locales),
  },
  // Allow everything except the form endpoint; robots.txt links the sitemap (added by @nuxtjs/sitemap).
  robots: {
    disallow: ['/api/'],
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en', name: 'EN', file: 'en.json' },
      { code: 'tr', language: 'tr', name: 'TR', file: 'tr.json' },
      { code: 'de', language: 'de', name: 'DE', file: 'de.json' },
      { code: 'bg', language: 'bg', name: 'BG', file: 'bg.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    // TR, DE and BG paths come from i18n/routes.ts, the single source of truth for page paths.
    pages: buildI18nPages(),
    baseUrl: 'https://www.moesaltd.com',
  },
})
