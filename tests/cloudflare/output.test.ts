/**
 * Checks on the CLOUDFLARE PAGES build (`dist/`). Not part of `npm test`: run
 * `NITRO_PRESET=cloudflare-pages npm run build && npm run test:cloudflare` (CI does). Without `dist/` the tests fail and
 * say so; they never pass silently on a missing build.
 *
 * Pages serves the files in `dist/` without running the function, so what Vercel did from the route rules has to be
 * in the output itself:
 * - `_headers`: the security headers (`routeRules['/**']`) on every path and the noindex `X-Robots-Tag` on the
 *   thank-you pages, written by Nitro from the same route rules the server uses (no second header list).
 * - `_routes.json`: the function runs for every path except the built files, so unknown and disabled-locale paths
 *   reach it and get the SSR 404 page; no `404.html` and no `_redirects` fallback (Pages would answer 200 with an SPA
 *   shell or a static 404 page instead).
 * - prerendered pages are `<route>.html` (Pages redirects `/about` to `/about/` for `about/index.html`).
 * - `_worker.js/wrangler.json`: `nodejs_compat` and a compatibility date on or after 2025-04-01.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

const ROOT = resolve(import.meta.dirname, '../..')
const DIST = join(ROOT, 'dist')

function requireBuild() {
  if (!existsSync(join(DIST, '_worker.js', 'index.js'))) {
    throw new Error(
      `No Cloudflare Pages build at ${DIST}. Run \`NITRO_PRESET=cloudflare-pages npm run build\` first, then \`npm run test:cloudflare\`.`,
    )
  }
}

function files(dir: string): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) out.push(...files(full))
    else out.push(relative(DIST, full).replace(/\\/g, '/'))
  }
  return out
}

/** `_headers` as path → { header → value } (https://developers.cloudflare.com/pages/configuration/headers/). */
function parseHeaders(text: string): Map<string, Record<string, string>> {
  const rules = new Map<string, Record<string, string>>()
  let current: Record<string, string> | undefined
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith('#')) continue
    if (!/^\s/.test(line)) {
      current = {}
      rules.set(line.trim(), current)
      continue
    }
    const at = line.indexOf(':')
    current![line.slice(0, at).trim()] = line.slice(at + 1).trim()
  }
  return rules
}

type AnyConfig = Record<string, any>
let config: AnyConfig

beforeAll(async () => {
  // nuxt.config.ts itself (defineNuxtConfig stubbed as the identity): the route rules the build was made from.
  vi.stubGlobal('defineNuxtConfig', (c: AnyConfig) => c)
  config = (await import('../../nuxt.config')).default as AnyConfig
})
afterAll(() => vi.unstubAllGlobals())

describe('Cloudflare Pages build (dist/)', () => {
  it('has the Pages Function (_worker.js) and the generated wrangler config with nodejs_compat', () => {
    requireBuild()
    const wrangler = JSON.parse(readFileSync(join(DIST, '_worker.js', 'wrangler.json'), 'utf8'))
    expect(wrangler.compatibility_flags).toContain('nodejs_compat')
    expect(wrangler.compatibility_date >= '2025-04-01').toBe(true)
    expect(wrangler.compatibility_date).toBe(config.nitro.cloudflare.wrangler.compatibility_date)
    expect(wrangler.pages_build_output_dir).toBe('..')
  })

  it('_headers sends every security header on every path, exactly as routeRules["/**"]', () => {
    requireBuild()
    const text = readFileSync(join(DIST, '_headers'), 'utf8')
    const rules = parseHeaders(text)
    expect(rules.get('/*')).toEqual(config.routeRules['/**'].headers)
    for (const name of ['Strict-Transport-Security', 'Content-Security-Policy', 'X-Frame-Options']) {
      expect(rules.get('/*')![name], name).toBeTruthy()
    }
    // Pages limits: 100 rules, 2000 characters per line.
    expect(rules.size).toBeLessThanOrEqual(100)
    for (const line of text.split(/\r?\n/)) expect(line.length).toBeLessThan(2000)
  })

  it('_headers keeps the thank-you pages out of search results (X-Robots-Tag: noindex, follow)', () => {
    requireBuild()
    const rules = parseHeaders(readFileSync(join(DIST, '_headers'), 'utf8'))
    for (const path of ['/thank-you', '/tr/tesekkurler', '/de/danke']) {
      expect(rules.get(path)?.['X-Robots-Tag'], path).toBe('noindex, follow')
    }
  })

  it('_routes.json sends every path to the function except the built files, so unknown paths get the SSR 404', () => {
    requireBuild()
    const routes = JSON.parse(readFileSync(join(DIST, '_routes.json'), 'utf8'))
    expect(routes.include).toEqual(['/*'])
    const built = new Set(files(DIST).map((f) => `/${f}`.replace(/\.html$/, '')))
    for (const path of routes.exclude as string[]) {
      if (path.endsWith('/*')) {
        expect(path, 'only build asset folders are excluded by wildcard').toBe('/_nuxt/*')
        continue
      }
      expect(built.has(path), `${path} is a built file`).toBe(true)
    }
    for (const path of ['/nope', '/services/not-a-service', '/tr/olmayan-sayfa', '/de/gibt-es-nicht', '/api/contact']) {
      expect(routes.exclude, path).not.toContain(path)
    }
  })

  it('emits no 404.html and no _redirects fallback (no SPA or static 404 page in front of the function)', () => {
    requireBuild()
    expect(existsSync(join(DIST, '404.html'))).toBe(false)
    const redirects = existsSync(join(DIST, '_redirects')) ? readFileSync(join(DIST, '_redirects'), 'utf8') : ''
    expect(redirects).not.toMatch(/^\/\*/m)
  })

  it('prerenders pages as <route>.html, never <route>/index.html', () => {
    requireBuild()
    const html = files(DIST).filter((f) => f.endsWith('.html'))
    expect(html).toEqual(expect.arrayContaining(['contact.html', 'thank-you.html', 'services/operations-supply-chain.html']))
    expect(html.filter((f) => f.endsWith('/index.html'))).toEqual([])
  })
})
