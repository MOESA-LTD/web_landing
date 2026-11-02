/**
 * A disabled locale is not served: with `NUXT_PUBLIC_ENABLE_TR=false` every request under `/tr`, with
 * `NUXT_PUBLIC_ENABLE_DE=false` every request under `/de`, and with `NUXT_PUBLIC_ENABLE_BG=false` every request under
 * `/bg`, answers 404 (rendered by error.vue in EN, since
 * `errorLocale` falls back to EN for a disabled locale). The flags are read at request time (the Cloudflare bindings,
 * else process.env), like the contact route.
 * Without this guard the pages of a disabled locale would still render on request (only their prerendering, the
 * switcher entry, the sitemap URLs and hreflang alternates are dropped at build time).
 *
 * h3 helpers are imported explicitly so the handler also runs in a plain h3 app (unit tests).
 */
import { createError, defineEventHandler, getRequestURL } from 'h3'
import { disabledLocaleOfPath, localeOptionsFromEnv } from '../../i18n/routes'
import { runtimeEnv } from '../utils/runtime-env'

export default defineEventHandler((event) => {
  const locale = disabledLocaleOfPath(getRequestURL(event).pathname, localeOptionsFromEnv(runtimeEnv(event)))
  if (locale) throw createError({ statusCode: 404, statusMessage: 'Page not found' })
})
