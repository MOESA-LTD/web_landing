import { describe, expect, it } from 'vitest'
import { ROUTES, buildI18nPages, localizeHref, routeNameForLocalePath, type RouteName } from '../../i18n/routes'
import { useLocalizedHref } from '../../app/composables/useLocalizedHref'

/** The TR routes table from the plan's Decisions section, copied independently of ROUTES. */
const EXPECTED: [string, string][] = [
  ['/', '/tr'],
  ['/services', '/tr/hizmetler'],
  ['/services/sourcing-managed-procurement', '/tr/hizmetler/tedarik-ve-yonetilen-satin-alma'],
  ['/services/product-private-label-development', '/tr/hizmetler/urun-ve-private-label-gelistirme'],
  ['/services/market-access-commercial-representation', '/tr/hizmetler/pazara-giris-ve-ticari-temsil'],
  ['/services/operations-supply-chain', '/tr/hizmetler/operasyon-ve-tedarik-zinciri'],
  ['/services/digital-commerce-commercial-intelligence', '/tr/hizmetler/dijital-ticaret-ve-ticari-icgoru'],
  ['/how-we-work', '/tr/nasil-calisiyoruz'],
  ['/who-we-work-with', '/tr/kimlerle-calisiyoruz'],
  ['/about', '/tr/hakkimizda'],
  ['/contact', '/tr/iletisim'],
  ['/thank-you', '/tr/tesekkurler'],
  ['/privacy-policy', '/tr/gizlilik-politikasi'],
  ['/cookie-policy', '/tr/cerez-politikasi'],
  ['/legal-notice', '/tr/yasal-bildirim'],
]

const entries = Object.entries(ROUTES) as [RouteName, { en: string; tr: string }][]

describe('ROUTES', () => {
  it('has 15 entries', () => {
    expect(entries).toHaveLength(15)
  })

  it('matches the approved TR routes table exactly', () => {
    expect(entries.map(([, p]) => [p.en, p.tr])).toEqual(EXPECTED)
  })

  it('every TR path starts with /tr and is lowercase ASCII [a-z0-9/-]', () => {
    for (const [, p] of entries) {
      expect(p.tr.startsWith('/tr')).toBe(true)
      expect(p.tr).toMatch(/^[a-z0-9/-]+$/)
    }
  })

  it('TR paths are unique, and so are EN paths', () => {
    expect(new Set(entries.map(([, p]) => p.tr)).size).toBe(entries.length)
    expect(new Set(entries.map(([, p]) => p.en)).size).toBe(entries.length)
  })

  it('has no trailing slashes (except the EN root)', () => {
    for (const [, p] of entries) {
      if (p.en !== '/') expect(p.en.endsWith('/')).toBe(false)
      expect(p.tr.endsWith('/')).toBe(false)
    }
  })
})

describe('localizeHref (pure)', () => {
  it('keeps query and hash when mapping to TR', () => {
    expect(localizeHref('/contact?service=operations-supply-chain#project-form', 'tr')).toBe(
      '/tr/iletisim?service=operations-supply-chain#project-form',
    )
  })

  it('maps a service page to its Turkish slug', () => {
    expect(localizeHref('/services/operations-supply-chain', 'tr')).toBe(
      '/tr/hizmetler/operasyon-ve-tedarik-zinciri',
    )
  })

  it('maps the home page and a hash-only suffix', () => {
    expect(localizeHref('/', 'tr')).toBe('/tr')
    expect(localizeHref('/#services', 'tr')).toBe('/tr#services')
    expect(localizeHref('/contact#project-form', 'tr')).toBe('/tr/iletisim#project-form')
  })

  it('returns external URLs and non-path hrefs unchanged', () => {
    for (const href of ['https://x.y/', 'http://x.y/contact', '//x.y/contact', 'mailto:info@moesaltd.com', 'tel:+35988501661', '#top']) {
      expect(localizeHref(href, 'tr')).toBe(href)
    }
  })

  it('returns unknown internal paths unchanged', () => {
    expect(localizeHref('/nope', 'tr')).toBe('/nope')
    expect(localizeHref('/services/unknown-slug', 'tr')).toBe('/services/unknown-slug')
    expect(localizeHref('/tr/iletisim', 'tr')).toBe('/tr/iletisim')
  })

  it('is the identity for EN', () => {
    for (const [, p] of entries) expect(localizeHref(p.en, 'en')).toBe(p.en)
    expect(localizeHref('/contact?service=x#y', 'en')).toBe('/contact?service=x#y')
  })

  it('tolerates a trailing slash on the input path', () => {
    expect(localizeHref('/contact/', 'tr')).toBe('/tr/iletisim')
  })
})

describe('useLocalizedHref (composable, default locale en)', () => {
  it('delegates to localizeHref with the current locale', () => {
    expect(useLocalizedHref('/contact?service=operations-supply-chain')).toBe(
      '/contact?service=operations-supply-chain',
    )
    expect(useLocalizedHref('https://x.y/')).toBe('https://x.y/')
  })
})

describe('buildI18nPages', () => {
  const pages = buildI18nPages()

  it('gives the TR path (without the /tr locale prefix) for each file route', () => {
    expect(pages['services']).toEqual({ tr: '/hizmetler' })
    expect(pages['services/[slug]']).toEqual({ tr: '/hizmetler/[slug]' })
    expect(pages['how-we-work']).toEqual({ tr: '/nasil-calisiyoruz' })
    expect(pages['who-we-work-with']).toEqual({ tr: '/kimlerle-calisiyoruz' })
    expect(pages['about']).toEqual({ tr: '/hakkimizda' })
    expect(pages['contact']).toEqual({ tr: '/iletisim' })
    expect(pages['thank-you']).toEqual({ tr: '/tesekkurler' })
    expect(pages['privacy-policy']).toEqual({ tr: '/gizlilik-politikasi' })
    expect(pages['cookie-policy']).toEqual({ tr: '/cerez-politikasi' })
    expect(pages['legal-notice']).toEqual({ tr: '/yasal-bildirim' })
  })

  it('does not customise the home page (the prefix alone gives /tr)', () => {
    expect(pages['index']).toBeUndefined()
  })
})

describe('routeNameForLocalePath', () => {
  it('maps a path in either locale to its route name, ignoring a trailing slash', () => {
    expect(routeNameForLocalePath('/')).toBe('home')
    expect(routeNameForLocalePath('/tr')).toBe('home')
    expect(routeNameForLocalePath('/tr/')).toBe('home')
    expect(routeNameForLocalePath('/about')).toBe('about')
    expect(routeNameForLocalePath('/tr/hakkimizda')).toBe('about')
    expect(routeNameForLocalePath('/tr/hizmetler/operasyon-ve-tedarik-zinciri')).toBe('services/operations-supply-chain')
  })

  it('returns null for unknown paths', () => {
    expect(routeNameForLocalePath('/nope')).toBeNull()
    expect(routeNameForLocalePath('/tr/about')).toBeNull()
  })
})
