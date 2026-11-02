import { expect, test } from '@playwright/test'
import { ROUTES, routeNameForLocalePath, type RouteName } from '../../i18n/routes'

/**
 * The Turkish site: `<html lang="tr">` and hreflang alternates (en, tr, de, bg, x-default) pointing at the right
 * counterpart on every TR page, and no TR page linking into the EN, DE or BG content (except the language switcher).
 */
const ORIGIN = 'https://www.moesaltd.com'
const NAMES = Object.keys(ROUTES) as RouteName[]

test.describe('TR pages', () => {
  for (const name of NAMES) {
    const { en, tr } = ROUTES[name]
    test(`${tr}: html lang tr and hreflang alternates en/tr/de/bg/x-default`, async ({ page }) => {
      const res = await page.goto(tr)
      expect(res?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
      const alt = (lang: string) => page.locator(`head link[rel="alternate"][hreflang="${lang}"]`)
      for (const lang of ['en', 'tr', 'de', 'bg', 'x-default']) await expect(alt(lang)).toHaveCount(1)
      await expect(alt('en')).toHaveAttribute('href', ORIGIN + en)
      await expect(alt('tr')).toHaveAttribute('href', ORIGIN + tr)
      await expect(alt('de')).toHaveAttribute('href', ORIGIN + ROUTES[name].de)
      await expect(alt('bg')).toHaveAttribute('href', ORIGIN + ROUTES[name].bg)
      await expect(alt('x-default')).toHaveAttribute('href', ORIGIN + en)
    })
  }

  test('no TR page links to an EN, DE or BG content route (switcher links aside)', async ({ page }) => {
    test.setTimeout(120_000)
    const offenders: string[] = []
    for (const name of NAMES) {
      const tr = ROUTES[name].tr
      await page.goto(tr)
      const links = await page.locator('a[href]').evaluateAll((as) =>
        as.map((a) => ({ href: a.getAttribute('href')!, hreflang: a.getAttribute('hreflang') })),
      )
      for (const { href, hreflang } of links) {
        if (hreflang === 'en' || hreflang === 'de' || hreflang === 'bg') continue // the language switcher's links to the counterparts
        if (/^(mailto:|tel:|#|https?:\/\/(?!www\.moesaltd\.com))/.test(href)) continue
        const path = href.replace(/^https?:\/\/www\.moesaltd\.com/, '').replace(/[?#].*$/, '')
        if (path.startsWith('/api') || /\.[a-z0-9]+$/i.test(path)) continue
        const target = routeNameForLocalePath(path)
        if (path === '/' || (target && ROUTES[target].tr !== path)) {
          offenders.push(`${tr} -> ${href}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  test('the switcher on /services/operations-supply-chain links to the TR slug', async ({ page }) => {
    await page.goto('/services/operations-supply-chain')
    await expect(page.locator('#lang-menu a[hreflang="tr"]')).toHaveAttribute(
      'href',
      '/tr/hizmetler/operasyon-ve-tedarik-zinciri',
    )
  })
})

/**
 * The German site: `<html lang="de">`, hreflang alternates en/tr/de/bg/x-default on every DE page, no DE page linking
 * into the EN, TR or BG content (except the language switcher's links), and the switcher pairing every service page
 * with its counterpart slug in every direction, in the server-rendered HTML (no JS).
 */
test.describe('DE pages', () => {
  for (const name of NAMES) {
    const { en, tr, de } = ROUTES[name]
    test(`${de}: html lang de and hreflang alternates en/tr/de/bg/x-default`, async ({ page }) => {
      const res = await page.goto(de)
      expect(res?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', 'de')
      const alt = (lang: string) => page.locator(`head link[rel="alternate"][hreflang="${lang}"]`)
      for (const lang of ['en', 'tr', 'de', 'bg', 'x-default']) await expect(alt(lang)).toHaveCount(1)
      await expect(alt('bg')).toHaveAttribute('href', ORIGIN + ROUTES[name].bg)
      await expect(alt('en')).toHaveAttribute('href', ORIGIN + en)
      await expect(alt('tr')).toHaveAttribute('href', ORIGIN + tr)
      await expect(alt('de')).toHaveAttribute('href', ORIGIN + de)
      await expect(alt('x-default')).toHaveAttribute('href', ORIGIN + en)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', ORIGIN + de)
    })
  }

  test('no DE page links to an EN, TR or BG content route (switcher links aside)', async ({ page }) => {
    test.setTimeout(120_000)
    const offenders: string[] = []
    for (const name of NAMES) {
      const de = ROUTES[name].de
      await page.goto(de)
      const links = await page.locator('a[href]').evaluateAll((as) =>
        as.map((a) => ({ href: a.getAttribute('href')!, hreflang: a.getAttribute('hreflang') })),
      )
      for (const { href, hreflang } of links) {
        if (hreflang === 'en' || hreflang === 'tr' || hreflang === 'bg') continue // the language switcher's links to the counterparts
        if (/^(mailto:|tel:|#|https?:\/\/(?!www\.moesaltd\.com))/.test(href)) continue
        const path = href.replace(/^https?:\/\/www\.moesaltd\.com/, '').replace(/[?#].*$/, '')
        if (path.startsWith('/api') || /\.[a-z0-9]+$/i.test(path)) continue
        const target = routeNameForLocalePath(path)
        if (path === '/' || (target && ROUTES[target].de !== path)) offenders.push(`${de} -> ${href}`)
      }
    }
    expect(offenders).toEqual([])
  })
})

/**
 * The Bulgarian site: `<html lang="bg">`, hreflang alternates en/tr/de/bg/x-default and og:locale bg_BG on every BG
 * page, and no BG page linking into the EN, TR or DE content (except the language switcher's links).
 */
test.describe('BG pages', () => {
  for (const name of NAMES) {
    const { en, tr, de, bg } = ROUTES[name]
    test(`${bg}: html lang bg, og:locale bg_BG and hreflang alternates en/tr/de/bg/x-default`, async ({ page }) => {
      const res = await page.goto(bg)
      expect(res?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', 'bg')
      const alt = (lang: string) => page.locator(`head link[rel="alternate"][hreflang="${lang}"]`)
      for (const lang of ['en', 'tr', 'de', 'bg', 'x-default']) await expect(alt(lang)).toHaveCount(1)
      await expect(alt('en')).toHaveAttribute('href', ORIGIN + en)
      await expect(alt('tr')).toHaveAttribute('href', ORIGIN + tr)
      await expect(alt('de')).toHaveAttribute('href', ORIGIN + de)
      await expect(alt('bg')).toHaveAttribute('href', ORIGIN + bg)
      await expect(alt('x-default')).toHaveAttribute('href', ORIGIN + en)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', ORIGIN + bg)
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'bg_BG')
      await expect(page.locator('meta[property="og:locale:alternate"]')).toHaveCount(3)
    })
  }

  test('no BG page links to an EN, TR or DE content route (switcher links aside)', async ({ page }) => {
    test.setTimeout(120_000)
    const offenders: string[] = []
    for (const name of NAMES) {
      const bg = ROUTES[name].bg
      await page.goto(bg)
      const links = await page.locator('a[href]').evaluateAll((as) =>
        as.map((a) => ({ href: a.getAttribute('href')!, hreflang: a.getAttribute('hreflang') })),
      )
      for (const { href, hreflang } of links) {
        if (hreflang === 'en' || hreflang === 'tr' || hreflang === 'de') continue // the language switcher's links
        if (/^(mailto:|tel:|#|https?:\/\/(?!www\.moesaltd\.com))/.test(href)) continue
        const path = href.replace(/^https?:\/\/www\.moesaltd\.com/, '').replace(/[?#].*$/, '')
        if (path.startsWith('/api') || /\.[a-z0-9]+$/i.test(path)) continue
        const target = routeNameForLocalePath(path)
        if (path === '/' || (target && ROUTES[target].bg !== path)) offenders.push(`${bg} -> ${href}`)
      }
    }
    expect(offenders).toEqual([])
  })
})

test.describe('language switcher counterparts (server-rendered, every service page, en ↔ tr ↔ de ↔ bg)', () => {
  /** The href of the switcher link for `locale` in raw HTML (`<a ... hreflang="de">`, not the head `<link>`). */
  const switcherHref = (html: string, locale: string) => {
    const tag = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]).find((t) => t.includes(`hreflang="${locale}"`))
    return tag ? /href="([^"]*)"/.exec(tag)?.[1] : undefined
  }
  const SERVICES = NAMES.filter((n) => n.startsWith('services/'))

  for (const name of SERVICES) {
    test(`${name}: each locale's page links all four counterparts`, async ({ request }) => {
      const paths = ROUTES[name]
      for (const from of ['en', 'tr', 'de', 'bg'] as const) {
        const html = await (await request.get(paths[from])).text()
        for (const to of ['en', 'tr', 'de', 'bg'] as const) expect(switcherHref(html, to), `${from} → ${to}`).toBe(paths[to])
      }
    })
  }

  test('covers the five service pages', () => {
    expect(SERVICES).toHaveLength(5)
  })
})
