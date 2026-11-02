import { describe, expect, it } from 'vitest'
import {
  ROUTES,
  buildI18nPages,
  localeSlugForService,
  localizeHref,
  routeNameForLocalePath,
  serviceSlugFromLocaleSlug,
  servicePrerenderRoutes,
  contactPrerenderRoutes,
  enabledLocales,
  sitemapUrls,
  type RouteName,
} from '../../i18n/routes'
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

const entries = Object.entries(ROUTES) as [RouteName, { en: string; tr: string; de: string; bg: string }][]

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
    expect(pages['services']).toMatchObject({ tr: '/hizmetler' })
    expect(pages['services/[slug]']).toMatchObject({ tr: '/hizmetler/[slug]' })
    expect(pages['how-we-work']).toMatchObject({ tr: '/nasil-calisiyoruz' })
    expect(pages['who-we-work-with']).toMatchObject({ tr: '/kimlerle-calisiyoruz' })
    expect(pages['about']).toMatchObject({ tr: '/hakkimizda' })
    expect(pages['contact']).toMatchObject({ tr: '/iletisim' })
    expect(pages['thank-you']).toMatchObject({ tr: '/tesekkurler' })
    expect(pages['privacy-policy']).toMatchObject({ tr: '/gizlilik-politikasi' })
    expect(pages['cookie-policy']).toMatchObject({ tr: '/cerez-politikasi' })
    expect(pages['legal-notice']).toMatchObject({ tr: '/yasal-bildirim' })
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

describe('serviceSlugFromLocaleSlug', () => {
  const PAIRS: [string, string][] = [
    ['sourcing-managed-procurement', 'tedarik-ve-yonetilen-satin-alma'],
    ['product-private-label-development', 'urun-ve-private-label-gelistirme'],
    ['market-access-commercial-representation', 'pazara-giris-ve-ticari-temsil'],
    ['operations-supply-chain', 'operasyon-ve-tedarik-zinciri'],
    ['digital-commerce-commercial-intelligence', 'dijital-ticaret-ve-ticari-icgoru'],
  ]

  it('maps each EN slug to itself and each TR slug to its EN service slug', () => {
    for (const [en, tr] of PAIRS) {
      expect(serviceSlugFromLocaleSlug('en', en)).toBe(en)
      expect(serviceSlugFromLocaleSlug('tr', tr)).toBe(en)
    }
  })

  it('returns null for a slug of the other locale, an unknown slug or an empty slug', () => {
    expect(serviceSlugFromLocaleSlug('en', 'operasyon-ve-tedarik-zinciri')).toBeNull()
    expect(serviceSlugFromLocaleSlug('tr', 'operations-supply-chain')).toBeNull()
    expect(serviceSlugFromLocaleSlug('en', 'unknown')).toBeNull()
    expect(serviceSlugFromLocaleSlug('tr', '')).toBeNull()
    expect(serviceSlugFromLocaleSlug('en', 'services')).toBeNull()
  })

  it('localeSlugForService is its inverse', () => {
    for (const [en, tr] of PAIRS) {
      expect(localeSlugForService('en', en as never)).toBe(en)
      expect(localeSlugForService('tr', en as never)).toBe(tr)
    }
  })
})

describe('servicePrerenderRoutes', () => {
  it('lists the overview and the 5 service pages in both locales (12 URLs) when TR is enabled', () => {
    const routes = servicePrerenderRoutes({ enableTr: true, enableDe: false, enableBg: false })
    expect(routes).toHaveLength(12)
    expect(routes).toEqual(expect.arrayContaining(['/services', '/tr/hizmetler']))
    for (const [, p] of entries.filter(([n]) => n.startsWith('services/'))) {
      expect(routes).toContain(p.en)
      expect(routes).toContain(p.tr)
    }
  })

  it('leaves out every /tr URL when TR is disabled', () => {
    const routes = servicePrerenderRoutes({ enableTr: false, enableDe: false, enableBg: false })
    expect(routes).toHaveLength(6)
    expect(routes.some((r) => r.startsWith('/tr'))).toBe(false)
  })
})

describe('contactPrerenderRoutes', () => {
  it('lists the contact and thank-you pages in both locales, never the API route', () => {
    expect(contactPrerenderRoutes({ enableTr: true, enableDe: false, enableBg: false })).toEqual(['/contact', '/tr/iletisim', '/thank-you', '/tr/tesekkurler'])
    expect(contactPrerenderRoutes({ enableTr: false, enableDe: false, enableBg: false })).toEqual(['/contact', '/thank-you'])
  })
})

/** The DE routes table from task-12-brief.md, copied independently of ROUTES. */
const EXPECTED_DE: [string, string][] = [
  ['/', '/de'],
  ['/services', '/de/leistungen'],
  ['/services/sourcing-managed-procurement', '/de/leistungen/sourcing-und-beschaffungsmanagement'],
  ['/services/product-private-label-development', '/de/leistungen/produkt-und-private-label-entwicklung'],
  ['/services/market-access-commercial-representation', '/de/leistungen/marktzugang-und-handelsvertretung'],
  ['/services/operations-supply-chain', '/de/leistungen/operations-und-lieferkette'],
  ['/services/digital-commerce-commercial-intelligence', '/de/leistungen/digital-commerce-und-commercial-intelligence'],
  ['/how-we-work', '/de/so-arbeiten-wir'],
  ['/who-we-work-with', '/de/fuer-wen-wir-arbeiten'],
  ['/about', '/de/ueber-uns'],
  ['/contact', '/de/kontakt'],
  ['/thank-you', '/de/danke'],
  ['/privacy-policy', '/de/datenschutz'],
  ['/cookie-policy', '/de/cookie-richtlinie'],
  ['/legal-notice', '/de/impressum'],
]

describe('ROUTES (DE)', () => {
  it('matches the approved DE routes table exactly', () => {
    expect(entries.map(([, p]) => [p.en, p.de])).toEqual(EXPECTED_DE)
  })

  it('every DE path starts with /de, is lowercase ASCII [a-z0-9/-], unique, without a trailing slash', () => {
    for (const [, p] of entries) {
      expect(p.de === '/de' || p.de.startsWith('/de/')).toBe(true)
      expect(p.de).toMatch(/^[a-z0-9/-]+$/)
      expect(p.de.endsWith('/')).toBe(false)
    }
    expect(new Set(entries.map(([, p]) => p.de)).size).toBe(entries.length)
  })
})

describe('localizeHref (DE)', () => {
  it('maps EN paths to the German slugs, keeping query and hash', () => {
    expect(localizeHref('/', 'de')).toBe('/de')
    expect(localizeHref('/services/operations-supply-chain', 'de')).toBe('/de/leistungen/operations-und-lieferkette')
    expect(localizeHref('/contact?service=operations-supply-chain#project-form', 'de')).toBe(
      '/de/kontakt?service=operations-supply-chain#project-form',
    )
    expect(localizeHref('/legal-notice', 'de')).toBe('/de/impressum')
  })

  it('returns external, unknown and already-localised hrefs unchanged', () => {
    for (const href of ['https://x.y/', 'mailto:info@moesaltd.com', '#top', '/nope', '/de/kontakt']) {
      expect(localizeHref(href, 'de')).toBe(href)
    }
  })
})

describe('routeNameForLocalePath (DE)', () => {
  it('maps DE paths to their route names', () => {
    expect(routeNameForLocalePath('/de')).toBe('home')
    expect(routeNameForLocalePath('/de/')).toBe('home')
    expect(routeNameForLocalePath('/de/ueber-uns')).toBe('about')
    expect(routeNameForLocalePath('/de/leistungen/operations-und-lieferkette')).toBe('services/operations-supply-chain')
    expect(routeNameForLocalePath('/de/about')).toBeNull()
  })
})

describe('buildI18nPages (DE)', () => {
  const pages = buildI18nPages()
  it('gives the TR and DE paths (without the locale prefix) for each file route', () => {
    expect(pages['services']).toMatchObject({ tr: '/hizmetler', de: '/leistungen' })
    expect(pages['services/[slug]']).toMatchObject({ tr: '/hizmetler/[slug]', de: '/leistungen/[slug]' })
    expect(pages['who-we-work-with']).toMatchObject({ tr: '/kimlerle-calisiyoruz', de: '/fuer-wen-wir-arbeiten' })
    expect(pages['thank-you']).toMatchObject({ tr: '/tesekkurler', de: '/danke' })
    expect(pages['legal-notice']).toMatchObject({ tr: '/yasal-bildirim', de: '/impressum' })
  })
})

describe('serviceSlugFromLocaleSlug (DE)', () => {
  const PAIRS: [string, string][] = [
    ['sourcing-managed-procurement', 'sourcing-und-beschaffungsmanagement'],
    ['product-private-label-development', 'produkt-und-private-label-entwicklung'],
    ['market-access-commercial-representation', 'marktzugang-und-handelsvertretung'],
    ['operations-supply-chain', 'operations-und-lieferkette'],
    ['digital-commerce-commercial-intelligence', 'digital-commerce-und-commercial-intelligence'],
  ]

  it('maps each DE slug to its EN service slug and back', () => {
    for (const [en, de] of PAIRS) {
      expect(serviceSlugFromLocaleSlug('de', de)).toBe(en)
      expect(localeSlugForService('de', en as never)).toBe(de)
    }
  })

  it('rejects EN and TR slugs on DE URLs and DE slugs on EN/TR URLs', () => {
    expect(serviceSlugFromLocaleSlug('de', 'operations-supply-chain')).toBeNull()
    expect(serviceSlugFromLocaleSlug('de', 'operasyon-ve-tedarik-zinciri')).toBeNull()
    expect(serviceSlugFromLocaleSlug('en', 'operations-und-lieferkette')).toBeNull()
    expect(serviceSlugFromLocaleSlug('tr', 'operations-und-lieferkette')).toBeNull()
  })
})

describe('locale switches (enableTr / enableDe / enableBg)', () => {
  it('enabledLocales lists EN always, TR, DE and BG unless disabled (all default to enabled)', () => {
    expect(enabledLocales({})).toEqual(['en', 'tr', 'de', 'bg'])
    expect(enabledLocales({ enableTr: false })).toEqual(['en', 'de', 'bg'])
    expect(enabledLocales({ enableDe: false })).toEqual(['en', 'tr', 'bg'])
    expect(enabledLocales({ enableBg: false })).toEqual(['en', 'tr', 'de'])
    expect(enabledLocales({ enableTr: false, enableDe: false })).toEqual(['en', 'bg'])
    expect(enabledLocales({ enableTr: false, enableDe: false, enableBg: false })).toEqual(['en'])
  })

  it('prerenders the DE service, contact and thank-you pages unless DE is disabled', () => {
    const all = servicePrerenderRoutes({ enableTr: true, enableDe: true, enableBg: false })
    expect(all).toHaveLength(18)
    for (const [, p] of entries.filter(([n]) => n === 'services' || n.startsWith('services/'))) expect(all).toContain(p.de)
    expect(contactPrerenderRoutes({ enableTr: true, enableDe: true, enableBg: false })).toEqual([
      '/contact',
      '/tr/iletisim',
      '/de/kontakt',
      '/thank-you',
      '/tr/tesekkurler',
      '/de/danke',
    ])
    const noDe = [
      ...servicePrerenderRoutes({ enableTr: true, enableDe: false, enableBg: false }),
      ...contactPrerenderRoutes({ enableTr: true, enableDe: false, enableBg: false }),
    ]
    expect(noDe.some((r) => r.startsWith('/de'))).toBe(false)
    expect(servicePrerenderRoutes({ enableTr: false, enableDe: true, enableBg: false }).some((r) => r.startsWith('/tr'))).toBe(false)
  })

  it('sitemapUrls: 42 URLs (14 per locale) with en/tr/de/x-default alternates', () => {
    const urls = sitemapUrls({ enableTr: true, enableDe: true, enableBg: false })
    expect(urls).toHaveLength(42)
    expect(urls.filter((u) => u.loc.startsWith('/de')).length).toBe(14)
    const about = urls.find((u) => u.loc === '/de/ueber-uns')!
    expect(about.alternatives).toEqual([
      { hreflang: 'en', href: '/about' },
      { hreflang: 'tr', href: '/tr/hakkimizda' },
      { hreflang: 'de', href: '/de/ueber-uns' },
      { hreflang: 'x-default', href: '/about' },
    ])
    expect(urls.some((u) => u.loc === '/de/danke')).toBe(false)
  })

  it('sitemapUrls drops every DE URL and alternate when DE is disabled', () => {
    const urls = sitemapUrls({ enableTr: true, enableDe: false, enableBg: false })
    expect(urls).toHaveLength(28)
    expect(urls.some((u) => u.loc.startsWith('/de') || u.alternatives.some((a) => a.hreflang === 'de'))).toBe(false)
    expect(sitemapUrls({ enableTr: false, enableDe: true, enableBg: false })).toHaveLength(28)
    expect(sitemapUrls({ enableTr: false, enableDe: false, enableBg: false })).toHaveLength(14)
  })
})

/** The BG routes table (owner decision: /bg/ + Latin-transliterated Bulgarian slugs), copied independently of ROUTES. */
const EXPECTED_BG: [string, string][] = [
  ['/', '/bg'],
  ['/services', '/bg/uslugi'],
  ['/services/sourcing-managed-procurement', '/bg/uslugi/sorsing-i-upravlenie-na-snabdyavaneto'],
  ['/services/product-private-label-development', '/bg/uslugi/razrabotka-na-produkti-i-sobstveni-marki'],
  ['/services/market-access-commercial-representation', '/bg/uslugi/dostap-do-pazari-i-targovsko-predstavitelstvo'],
  ['/services/operations-supply-chain', '/bg/uslugi/operatsii-i-veriga-na-dostavki'],
  ['/services/digital-commerce-commercial-intelligence', '/bg/uslugi/digitalna-targoviya-i-biznes-analizi'],
  ['/how-we-work', '/bg/kak-rabotim'],
  ['/who-we-work-with', '/bg/s-kogo-rabotim'],
  ['/about', '/bg/za-nas'],
  ['/contact', '/bg/kontakti'],
  ['/thank-you', '/bg/blagodarim'],
  ['/privacy-policy', '/bg/politika-za-poveritelnost'],
  ['/cookie-policy', '/bg/politika-za-biskvitkite'],
  ['/legal-notice', '/bg/pravna-informatsiya'],
]

describe('ROUTES (BG)', () => {
  it('matches the approved BG routes table exactly', () => {
    expect(entries.map(([, p]) => [p.en, p.bg])).toEqual(EXPECTED_BG)
  })

  it('every BG path starts with /bg, is lowercase ASCII [a-z0-9/-] (transliterated, no Cyrillic), unique, without a trailing slash', () => {
    for (const [, p] of entries) {
      expect(p.bg === '/bg' || p.bg.startsWith('/bg/')).toBe(true)
      expect(p.bg).toMatch(/^[a-z0-9/-]+$/)
      expect(p.bg.endsWith('/')).toBe(false)
    }
    expect(new Set(entries.map(([, p]) => p.bg)).size).toBe(entries.length)
  })

  it('shares no path with another locale', () => {
    const others = new Set(entries.flatMap(([, p]) => [p.en, p.tr, p.de]))
    for (const [, p] of entries) expect(others.has(p.bg), p.bg).toBe(false)
  })
})

describe('localizeHref (BG)', () => {
  it('maps EN paths to the Bulgarian slugs, keeping query and hash', () => {
    expect(localizeHref('/', 'bg')).toBe('/bg')
    expect(localizeHref('/services/operations-supply-chain', 'bg')).toBe('/bg/uslugi/operatsii-i-veriga-na-dostavki')
    expect(localizeHref('/contact?service=operations-supply-chain#project-form', 'bg')).toBe(
      '/bg/kontakti?service=operations-supply-chain#project-form',
    )
    expect(localizeHref('/legal-notice', 'bg')).toBe('/bg/pravna-informatsiya')
  })

  it('returns external, unknown and already-localised hrefs unchanged', () => {
    for (const href of ['https://x.y/', 'mailto:info@moesaltd.com', '#top', '/nope', '/bg/kontakti']) {
      expect(localizeHref(href, 'bg')).toBe(href)
    }
  })
})

describe('routeNameForLocalePath (BG)', () => {
  it('maps BG paths to their route names', () => {
    expect(routeNameForLocalePath('/bg')).toBe('home')
    expect(routeNameForLocalePath('/bg/')).toBe('home')
    expect(routeNameForLocalePath('/bg/za-nas')).toBe('about')
    expect(routeNameForLocalePath('/bg/uslugi/operatsii-i-veriga-na-dostavki')).toBe('services/operations-supply-chain')
    expect(routeNameForLocalePath('/bg/about')).toBeNull()
  })
})

describe('buildI18nPages (BG)', () => {
  const pages = buildI18nPages()
  it('gives the TR, DE and BG paths (without the locale prefix) for each file route', () => {
    expect(pages['services']).toEqual({ tr: '/hizmetler', de: '/leistungen', bg: '/uslugi' })
    expect(pages['services/[slug]']).toEqual({ tr: '/hizmetler/[slug]', de: '/leistungen/[slug]', bg: '/uslugi/[slug]' })
    expect(pages['who-we-work-with']).toEqual({ tr: '/kimlerle-calisiyoruz', de: '/fuer-wen-wir-arbeiten', bg: '/s-kogo-rabotim' })
    expect(pages['thank-you']).toEqual({ tr: '/tesekkurler', de: '/danke', bg: '/blagodarim' })
    expect(pages['legal-notice']).toEqual({ tr: '/yasal-bildirim', de: '/impressum', bg: '/pravna-informatsiya' })
  })
})

describe('serviceSlugFromLocaleSlug (BG)', () => {
  const PAIRS: [string, string][] = [
    ['sourcing-managed-procurement', 'sorsing-i-upravlenie-na-snabdyavaneto'],
    ['product-private-label-development', 'razrabotka-na-produkti-i-sobstveni-marki'],
    ['market-access-commercial-representation', 'dostap-do-pazari-i-targovsko-predstavitelstvo'],
    ['operations-supply-chain', 'operatsii-i-veriga-na-dostavki'],
    ['digital-commerce-commercial-intelligence', 'digitalna-targoviya-i-biznes-analizi'],
  ]

  it('maps each BG slug to its EN service slug and back', () => {
    for (const [en, bg] of PAIRS) {
      expect(serviceSlugFromLocaleSlug('bg', bg)).toBe(en)
      expect(localeSlugForService('bg', en as never)).toBe(bg)
    }
  })

  it('rejects EN, TR and DE slugs on BG URLs and BG slugs on EN/TR/DE URLs', () => {
    expect(serviceSlugFromLocaleSlug('bg', 'operations-supply-chain')).toBeNull()
    expect(serviceSlugFromLocaleSlug('bg', 'operasyon-ve-tedarik-zinciri')).toBeNull()
    expect(serviceSlugFromLocaleSlug('bg', 'operations-und-lieferkette')).toBeNull()
    for (const l of ['en', 'tr', 'de'] as const) expect(serviceSlugFromLocaleSlug(l, 'operatsii-i-veriga-na-dostavki')).toBeNull()
  })
})

describe('locale switch enableBg', () => {
  it('prerenders the BG service, contact and thank-you pages unless BG is disabled', () => {
    const all = servicePrerenderRoutes({})
    expect(all).toHaveLength(24)
    for (const [, p] of entries.filter(([n]) => n === 'services' || n.startsWith('services/'))) expect(all).toContain(p.bg)
    expect(contactPrerenderRoutes({})).toEqual([
      '/contact',
      '/tr/iletisim',
      '/de/kontakt',
      '/bg/kontakti',
      '/thank-you',
      '/tr/tesekkurler',
      '/de/danke',
      '/bg/blagodarim',
    ])
    const noBg = [...servicePrerenderRoutes({ enableBg: false }), ...contactPrerenderRoutes({ enableBg: false })]
    expect(noBg.some((r) => r.startsWith('/bg'))).toBe(false)
  })

  it('sitemapUrls: 56 URLs (14 per locale) with en/tr/de/bg/x-default alternates', () => {
    const urls = sitemapUrls({})
    expect(urls).toHaveLength(56)
    expect(urls.filter((u) => u.loc.startsWith('/bg')).length).toBe(14)
    const about = urls.find((u) => u.loc === '/bg/za-nas')!
    expect(about.alternatives).toEqual([
      { hreflang: 'en', href: '/about' },
      { hreflang: 'tr', href: '/tr/hakkimizda' },
      { hreflang: 'de', href: '/de/ueber-uns' },
      { hreflang: 'bg', href: '/bg/za-nas' },
      { hreflang: 'x-default', href: '/about' },
    ])
    expect(urls.some((u) => u.loc === '/bg/blagodarim')).toBe(false)
  })

  it('sitemapUrls drops every BG URL and alternate when BG is disabled', () => {
    const urls = sitemapUrls({ enableBg: false })
    expect(urls).toHaveLength(42)
    expect(urls.some((u) => u.loc.startsWith('/bg') || u.alternatives.some((a) => a.hreflang === 'bg'))).toBe(false)
    expect(sitemapUrls({ enableTr: false, enableDe: false })).toHaveLength(28)
  })
})
