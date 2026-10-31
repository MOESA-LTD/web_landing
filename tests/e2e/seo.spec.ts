import { expect, test } from '@playwright/test'
import { ROUTES, type RouteName } from '../../i18n/routes'

/**
 * SEO and security against the production build: per-page head tags on all 30 URLs (15 EN + 15 TR), the sitemap
 * (28 URLs: every page in both locales except the two thank-you pages), robots.txt, the Organization JSON-LD on
 * the home pages, the security headers, and a Content-Security-Policy that no page violates.
 */
const ORIGIN = 'https://www.moesaltd.com'
const NAMES = Object.keys(ROUTES) as RouteName[]
const ALL_URLS = NAMES.flatMap((name) => [ROUTES[name].en, ROUTES[name].tr])
const THANK_YOU = [ROUTES['thank-you'].en, ROUTES['thank-you'].tr]
const SITEMAP_URLS = ALL_URLS.filter((p) => !THANK_YOU.includes(p))

const SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=63072000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-frame-options': 'DENY',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'content-security-policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com; " +
    "frame-src https://challenges.cloudflare.com; img-src 'self' data:; style-src 'self' 'unsafe-inline'; " +
    "connect-src 'self'; font-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
}

test.describe('page head', () => {
  for (const path of ALL_URLS) {
    test(`${path}: one h1, self canonical, og:title and og:description`, async ({ page }) => {
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', ORIGIN + path)
      const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content')
      const ogDescription = await page.locator('meta[property="og:description"]').getAttribute('content')
      expect(ogTitle?.trim()).toBeTruthy()
      expect(ogDescription?.trim()).toBeTruthy()
    })
  }
})

test.describe('sitemap and robots', () => {
  test('/sitemap.xml lists the 28 public URLs with hreflang alternates, and no thank-you page', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)
    const xml = await res.text()
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!)
    expect(locs.sort()).toEqual(SITEMAP_URLS.map((p) => ORIGIN + p).sort())
    for (const p of THANK_YOU) expect(xml).not.toContain(ORIGIN + p + '<')
    expect(xml).not.toContain('/_dev')
    expect(xml).not.toContain('/api')
    // Every entry carries its en, tr and x-default alternates (xhtml:link).
    const about = xml.slice(xml.indexOf(`<loc>${ORIGIN}/tr/hakkimizda</loc>`))
    const entry = about.slice(0, about.indexOf('</url>'))
    expect(entry).toContain(`hreflang="en" href="${ORIGIN}/about"`)
    expect(entry).toContain(`hreflang="tr" href="${ORIGIN}/tr/hakkimizda"`)
    expect(entry).toContain(`hreflang="x-default" href="${ORIGIN}/about"`)
    const svc = xml.slice(xml.indexOf(`<loc>${ORIGIN}/services/operations-supply-chain</loc>`))
    expect(svc.slice(0, svc.indexOf('</url>'))).toContain(
      `hreflang="tr" href="${ORIGIN}/tr/hizmetler/operasyon-ve-tedarik-zinciri"`,
    )
  })

  test('/robots.txt allows the site, disallows /api/ and links the sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt')
    expect(res.status()).toBe(200)
    const txt = await res.text()
    expect(txt).toContain('Sitemap:')
    expect(txt).toContain(`${ORIGIN}/sitemap.xml`)
    expect(txt).toMatch(/Disallow: \/api\//)
    expect(txt).not.toMatch(/Disallow: \/\s*$/m)
  })
})

test.describe('structured data', () => {
  for (const path of [ROUTES.home.en, ROUTES.home.tr]) {
    test(`${path} has the Organization JSON-LD`, async ({ request }) => {
      const html = await (await request.get(path)).text()
      expect(html).toContain('application/ld+json')
      expect(html).toContain('"vatID":"BG207200475"')
      const raw = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/.exec(html)?.[1]
      const data = JSON.parse(raw!)
      expect(data).toMatchObject({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MOESA Ltd.',
        url: ORIGIN,
        email: 'info@moesaltd.com',
        telephone: '+359 88 501 661',
        vatID: 'BG207200475',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '1 Petyofi Str.',
          addressLocality: 'Plovdiv',
          postalCode: '4000',
          addressCountry: 'BG',
        },
        contactPoint: { '@type': 'ContactPoint', contactType: 'sales', email: 'info@moesaltd.com', telephone: '+359 88 501 661' },
      })
      expect(data.logo).toMatch(new RegExp(`^${ORIGIN}/`))
    })
  }

  test('the OG image is served', async ({ request }) => {
    const res = await request.get('/og-default.png')
    expect(res.status()).toBe(200)
    expect(res.headers()['content-type']).toContain('image/png')
  })
})

test.describe('security headers', () => {
  for (const path of ['/', '/services', '/tr/hakkimizda', '/contact', '/this-does-not-exist']) {
    test(`${path} sends the security headers`, async ({ request }) => {
      const res = await request.get(path)
      const headers = res.headers()
      for (const [name, value] of Object.entries(SECURITY_HEADERS)) expect(headers[name], name).toBe(value)
    })
  }

  test('no page violates the Content-Security-Policy', async ({ page }) => {
    test.setTimeout(180_000)
    const violations: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && /Content Security Policy|Content-Security-Policy/i.test(msg.text())) {
        violations.push(`${page.url()}: ${msg.text()}`)
      }
    })
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (e) => {
        console.error(`Content Security Policy violation: ${e.violatedDirective} ${e.blockedURI}`)
      })
    })
    for (const path of ALL_URLS) {
      const res = await page.goto(path, { waitUntil: 'networkidle' })
      expect(res?.status(), path).toBe(200)
      expect(res?.headers()['content-security-policy'], path).toBe(SECURITY_HEADERS['content-security-policy'])
    }
    expect(violations).toEqual([])
  })
})
