import { describe, expect, it } from 'vitest'
import { ROUTES, type RouteName } from '../../i18n/routes'

/**
 * Guards the @nuxtjs/i18n config (strategy, `pages` built from ROUTES) against the real router.
 * Page files arrive in later tasks; every page route that exists must have exactly the path that
 * i18n/routes.ts says, in both locales.
 */
describe('i18n config', () => {
  const routesByName = () => new Map(useRouter().getRoutes().map((r) => [String(r.name), r.path]))

  it('serves the home page at / (EN) and /tr (TR)', () => {
    expect(routesByName().get('index___en')).toBe('/')
    expect(routesByName().get('index___tr')).toBe('/tr')
  })

  it('every page route has the path ROUTES gives it', () => {
    for (const [name, path] of routesByName()) {
      const m = /^(.+)___(en|tr)$/.exec(name)
      if (!m || m[1]!.startsWith('_dev')) continue
      const base = m[1]!
      const locale = m[2] as 'en' | 'tr'
      const expected =
        base === 'index'
          ? ROUTES.home[locale]
          : base === 'services-slug'
            ? `${ROUTES.services[locale]}/:slug()`
            : ROUTES[base as RouteName]?.[locale]
      expect(path, name).toBe(expected)
    }
  })

  it('has TR enabled by default and a default EN locale', () => {
    expect(useRuntimeConfig().public.enableTr).toBe(true)
    expect(useNuxtApp().$i18n.locale.value).toBe('en')
    expect(useNuxtApp().$i18n.locales.value.map((l) => (typeof l === 'string' ? l : l.code))).toEqual(['en', 'tr'])
  })
})
