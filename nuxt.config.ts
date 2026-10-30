import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { buildI18nPages } from './i18n/routes'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-30',
  devtools: { enabled: true },
  modules: ['@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
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
    public: {
      // NUXT_PUBLIC_ENABLE_TR=false hides TR (no TR routes prerendered, no switcher, not in the sitemap).
      enableTr: process.env.NUXT_PUBLIC_ENABLE_TR !== 'false',
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
