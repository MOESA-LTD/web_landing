import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { buildI18nPages, contactPrerenderRoutes, localeOptionsFromEnv, servicePrerenderRoutes, sitemapUrls } from './i18n/routes'

// NUXT_PUBLIC_ENABLE_TR=false hides TR and NUXT_PUBLIC_ENABLE_DE=false hides DE: no routes of that locale are
// prerendered, the switcher leaves it out, and the sitemap and hreflang alternates do not list it. The same flags are
// read again at runtime (locale guard, contact redirects), so set them for build and runtime alike.
const locales = localeOptionsFromEnv(process.env)
const { enableTr, enableDe } = locales

const SITE_URL = 'https://www.moesaltd.com'

/**
 * Sent on every response (pages, assets, API, 404). The CSP allows Cloudflare Turnstile (script + iframe on
 * /contact), Nuxt's inline hydration scripts ('unsafe-inline'; the JSON payload is not executed) and inline styles.
 * Fonts are self-hosted (@fontsource), images are local or data: URIs. No analytics origin: v1 loads none.
 */
const SECURITY_HEADERS = {
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
    // The form endpoint is a server function (Vercel function), never prerendered.
    '/api/**': { prerender: false },
    // The thank-you page is reached after a form post only: keep it out of search results (@nuxtjs/robots sends
    // the X-Robots-Tag header and the robots meta; the page also sets the meta itself).
    '/thank-you': { robots: 'noindex, follow' },
    '/tr/tesekkurler': { robots: 'noindex, follow' },
    '/de/danke': { robots: 'noindex, follow' },
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
    },
  },
  runtimeConfig: {
    // Server-only secrets (RESEND_API_KEY, CONTACT_TO, CONTACT_FROM, NUXT_TURNSTILE_SECRET_KEY) are read from
    // process.env at request time by server/api/contact.post.ts; see .env.example.
    public: {
      enableTr,
      enableDe,
      // NUXT_PUBLIC_TURNSTILE_SITE_KEY. /contact is prerendered, so the key must be set at build time.
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
    },
  },
  nitro: {
    // Minify the server bundle (terser, comments: false): Nitro keeps source comments in it otherwise, and the
    // acceptance test (tests/unit/claims.test.ts) asserts that no app source comment ships in .output.
    minify: true,
    prerender: {
      // The services overview and the five service pages, EN + TR + DE (18 URLs; 6 per enabled locale), plus the
      // contact and thank-you pages (2 per enabled locale). /api/contact stays a server route.
      // No /404.html: Nuxt would emit an SPA shell (no noindex, no SSR copy). Unknown paths reach the server
      // (Vercel's fallback function, `nuxt preview`) and error.vue renders them with HTTP 404, in the path's locale.
      routes: [...servicePrerenderRoutes(locales), ...contactPrerenderRoutes(locales)],
    },
  },
  // The sitemap lists exactly the indexable pages from i18n/routes.ts (42 URLs: 14 per locale EN/TR/DE, no thank-you
  // page, no /_dev, no /api), each with its hreflang alternates en/tr/de/x-default, the same set as the pages' own
  // <link rel="alternate">. The URLs are given explicitly (and the module's own page discovery and i18n
  // expansion are off) because the five service pages share one dynamic route that the module cannot expand,
  // and because NUXT_PUBLIC_ENABLE_TR=false / NUXT_PUBLIC_ENABLE_DE=false must drop every URL and alternate of that
  // locale.
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
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    // TR and DE paths come from i18n/routes.ts, the single source of truth for page paths.
    pages: buildI18nPages(),
    baseUrl: 'https://www.moesaltd.com',
  },
})
