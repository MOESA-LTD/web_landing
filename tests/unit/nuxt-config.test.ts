// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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

  it('hides the legal review notes unless NUXT_PUBLIC_LEGAL_REVIEW_NOTES is exactly "true", and prerenders no legal page', async () => {
    for (const v of [undefined, '', 'false', '1', 'TRUE']) {
      const config = await loadConfig({ NUXT_PUBLIC_LEGAL_REVIEW_NOTES: v })
      expect(config.runtimeConfig.public.legalReviewNotes, String(v)).toBe(false)
    }
    const config = await loadConfig({ NUXT_PUBLIC_LEGAL_REVIEW_NOTES: 'true' })
    expect(config.runtimeConfig.public.legalReviewNotes).toBe(true)
    // The legal pages render per request, so the runtime value (Nitro's NUXT_PUBLIC_* override) is what they show.
    const legal = /^\/((tr|de)\/)?(privacy-policy|cookie-policy|legal-notice|gizlilik-politikasi|cerez-politikasi|yasal-bildirim|datenschutz|cookie-richtlinie|impressum)$/
    expect(config.nitro.prerender.routes.filter((r: string) => legal.test(r))).toEqual([])
    // wrangler.toml turns them on for Preview deployments only; production `[vars]` leaves the flag unset.
    const toml = readFileSync(resolve(process.cwd(), 'wrangler.toml'), 'utf8').replace(/\r\n?/g, '\n')
    const [prod, preview] = toml.split('[env.preview.vars]')
    expect(prod).not.toContain('NUXT_PUBLIC_LEGAL_REVIEW_NOTES')
    expect(preview).toContain('NUXT_PUBLIC_LEGAL_REVIEW_NOTES = "true"')
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

  it('configures the Cloudflare Pages build: Node.js compatibility, a generated wrangler config, a date >= 2025-04-01', async () => {
    const config = await loadConfig({})
    const cf = config.nitro.cloudflare
    expect(cf.nodeCompat).toBe(true)
    expect(cf.deployConfig).toBe(true)
    // With nodejs_compat and a date on or after 2025-04-01 the Workers runtime fills process.env from the bindings.
    expect(cf.wrangler.compatibility_flags).toContain('nodejs_compat')
    expect(cf.wrangler.compatibility_date >= '2025-04-01').toBe(true)
    // wrangler.toml (read by the Git-connected Pages build) carries the same runtime settings.
    const toml = readFileSync(resolve(process.cwd(), 'wrangler.toml'), 'utf8')
    expect(toml).toContain(`compatibility_date = "${cf.wrangler.compatibility_date}"`)
    expect(toml).toContain('compatibility_flags = ["nodejs_compat", "no_nodejs_compat_v2"]')
    expect(toml).toContain('pages_build_output_dir = "./dist"')
    // The optional resend peer is stubbed so the Workers bundle resolves every import.
    expect(config.nitro.alias['@react-email/render']).toMatch(/server[\\/]stubs[\\/]react-email-render\.ts$/)
  })

  // No apple-touch-icon: public/favicon.png is 64x64 and iOS wants 180x180; add one when such an asset exists.
  it('links the favicon (public/favicon.png) in every page head', async () => {
    const config = await loadConfig({})
    expect(config.app.head.link).toEqual(expect.arrayContaining([{ rel: 'icon', type: 'image/png', href: '/favicon.png' }]))
  })

  it('declares runtimeConfig.public.analyticsId from NUXT_PUBLIC_ANALYTICS_ID, empty by default', async () => {
    expect((await loadConfig({ NUXT_PUBLIC_ANALYTICS_ID: undefined })).runtimeConfig.public.analyticsId).toBe('')
    expect((await loadConfig({ NUXT_PUBLIC_ANALYTICS_ID: 'G-TEST' })).runtimeConfig.public.analyticsId).toBe('G-TEST')
  })
})
