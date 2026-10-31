// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'

/**
 * Reads nuxt.config.ts itself (with `defineNuxtConfig` stubbed as the identity) under different env values:
 * NUXT_PUBLIC_ENABLE_TR=false must leave every /tr URL out of the prerender list and the sitemap, and the
 * security headers and sitemap/robots settings must be the ones the deployment relies on.
 */
type AnyConfig = Record<string, any>

async function loadConfig(env: Record<string, string | undefined>): Promise<AnyConfig> {
  vi.resetModules()
  for (const [k, v] of Object.entries(env)) {
    if (v === undefined) vi.stubEnv(k, undefined as unknown as string)
    else vi.stubEnv(k, v)
  }
  vi.stubGlobal('defineNuxtConfig', (c: AnyConfig) => c)
  return (await import('../../nuxt.config')).default as AnyConfig
}

const isTr = (p: string) => p === '/tr' || p.startsWith('/tr/')
const isDe = (p: string) => p === '/de' || p.startsWith('/de/')

describe('nuxt.config', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('with NUXT_PUBLIC_ENABLE_TR=false prerenders no /tr route and lists no /tr URL in the sitemap', async () => {
    const config = await loadConfig({ NUXT_PUBLIC_ENABLE_TR: 'false' })
    const routes: string[] = config.nitro.prerender.routes
    expect(routes.length).toBeGreaterThan(0)
    expect(routes.filter(isTr)).toEqual([])
    const locs: string[] = config.sitemap.urls.map((u: { loc: string }) => u.loc)
    expect(locs).toHaveLength(28)
    expect(locs.filter(isTr)).toEqual([])
    expect(locs.filter(isDe)).toHaveLength(14)
    for (const u of config.sitemap.urls) {
      for (const a of u.alternatives ?? []) expect(isTr(a.href), a.href).toBe(false)
    }
    expect(config.runtimeConfig.public.enableTr).toBe(false)
  })

  it('by default prerenders TR and DE routes and lists 42 sitemap URLs (no thank-you page)', async () => {
    const config = await loadConfig({ NUXT_PUBLIC_ENABLE_TR: undefined, NUXT_PUBLIC_ENABLE_DE: undefined })
    expect(config.nitro.prerender.routes.filter(isTr).length).toBeGreaterThan(0)
    expect(config.nitro.prerender.routes.filter(isDe)).toHaveLength(8)
    const locs: string[] = config.sitemap.urls.map((u: { loc: string }) => u.loc)
    expect(locs).toHaveLength(42)
    expect(locs).not.toContain('/thank-you')
    expect(locs).not.toContain('/tr/tesekkurler')
    expect(locs).not.toContain('/de/danke')
    expect(config.runtimeConfig.public.enableDe).toBe(true)
  })

  it('with NUXT_PUBLIC_ENABLE_DE=false prerenders no /de route and lists no /de URL or alternate in the sitemap', async () => {
    const config = await loadConfig({ NUXT_PUBLIC_ENABLE_DE: 'false' })
    expect(config.nitro.prerender.routes.filter(isDe)).toEqual([])
    const locs: string[] = config.sitemap.urls.map((u: { loc: string }) => u.loc)
    expect(locs).toHaveLength(28)
    expect(locs.filter(isDe)).toEqual([])
    for (const u of config.sitemap.urls) {
      for (const a of u.alternatives ?? []) expect(isDe(a.href), a.href).toBe(false)
    }
    expect(config.runtimeConfig.public.enableDe).toBe(false)
  })

  it('registers the de locale (language de, name DE) and keeps the DE thank-you page out of search results', async () => {
    const config = await loadConfig({})
    expect(config.i18n.locales).toContainEqual({ code: 'de', language: 'de', name: 'DE', file: 'de.json' })
    expect(config.routeRules['/de/danke']).toEqual({ robots: 'noindex, follow' })
  })

  it('sets the security headers on every route and does not pin a Nitro preset', async () => {
    const config = await loadConfig({})
    const headers = config.routeRules['/**'].headers
    expect(headers['X-Content-Type-Options']).toBe('nosniff')
    expect(headers['Strict-Transport-Security']).toBe('max-age=63072000; includeSubDomains; preload')
    expect(headers['Content-Security-Policy']).toContain('https://challenges.cloudflare.com')
    expect(config.nitro.preset).toBeUndefined()
    expect(config.site.url).toBe('https://www.moesaltd.com')
  })
})
