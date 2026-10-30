import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { buildI18nPages, contactPrerenderRoutes, servicePrerenderRoutes } from './i18n/routes'

// NUXT_PUBLIC_ENABLE_TR=false hides TR (no TR routes prerendered, no switcher, not in the sitemap).
const enableTr = process.env.NUXT_PUBLIC_ENABLE_TR !== 'false'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-30',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/i18n',
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
  routeRules: {
    // `robots: false` is read by @nuxtjs/robots (added with the sitemap task); until then the header does the job.
    '/_dev/**': { prerender: false, robots: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    // The form endpoint is a server function (Vercel function), never prerendered.
    '/api/**': { prerender: false },
    // The thank-you page is reached after a form post only: keep it out of search results (also <meta robots>).
    '/thank-you': { robots: false, headers: { 'X-Robots-Tag': 'noindex' } },
    '/tr/tesekkurler': { robots: false, headers: { 'X-Robots-Tag': 'noindex' } },
  },
  vite: {
    plugins: [tailwindcss()],
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
      // NUXT_PUBLIC_TURNSTILE_SITE_KEY. /contact is prerendered, so the key must be set at build time.
      turnstileSiteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
    },
  },
  nitro: {
    prerender: {
      // The services overview and the five service pages, EN + TR (12 URLs; 6 with TR disabled), plus the contact
      // and thank-you pages (4 URLs; 2 with TR disabled). /api/contact stays a server route.
      routes: [...servicePrerenderRoutes({ enableTr }), ...contactPrerenderRoutes({ enableTr })],
    },
  },
  i18n: {
    locales: [
      { code: 'en', language: 'en', name: 'EN', file: 'en.json' },
      { code: 'tr', language: 'tr', name: 'TR', file: 'tr.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    customRoutes: 'config',
    // TR paths come from i18n/routes.ts, the single source of truth for page paths.
    pages: buildI18nPages(),
    baseUrl: 'https://www.moesaltd.com',
  },
})
