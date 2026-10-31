import { expect, test } from '@playwright/test'
import { ROUTES, routeNameForLocalePath, type RouteName } from '../../i18n/routes'

/**
 * The Turkish site: `<html lang="tr">` and hreflang alternates (en, tr, x-default) pointing at the right counterpart
 * on every TR page, and no TR page linking into the EN content (except the language switcher's EN link).
 */
const ORIGIN = 'https://www.moesaltd.com'
const NAMES = Object.keys(ROUTES) as RouteName[]

test.describe('TR pages', () => {
  for (const name of NAMES) {
    const { en, tr } = ROUTES[name]
    test(`${tr}: html lang tr and hreflang alternates en/tr/x-default`, async ({ page }) => {
      const res = await page.goto(tr)
      expect(res?.status()).toBe(200)
      await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
      const alt = (lang: string) => page.locator(`head link[rel="alternate"][hreflang="${lang}"]`)
      for (const lang of ['en', 'tr', 'x-default']) await expect(alt(lang)).toHaveCount(1)
      await expect(alt('en')).toHaveAttribute('href', ORIGIN + en)
      await expect(alt('tr')).toHaveAttribute('href', ORIGIN + tr)
      await expect(alt('x-default')).toHaveAttribute('href', ORIGIN + en)
    })
  }

  test('no TR page links to an EN content route (switcher EN link aside)', async ({ page }) => {
    test.setTimeout(120_000)
    const offenders: string[] = []
    for (const name of NAMES) {
      const tr = ROUTES[name].tr
      await page.goto(tr)
      const links = await page.locator('a[href]').evaluateAll((as) =>
        as.map((a) => ({ href: a.getAttribute('href')!, hreflang: a.getAttribute('hreflang') })),
      )
      for (const { href, hreflang } of links) {
        if (hreflang === 'en') continue // the language switcher's link to the EN counterpart
        if (/^(mailto:|tel:|#|https?:\/\/(?!www\.moesaltd\.com))/.test(href)) continue
        const path = href.replace(/^https?:\/\/www\.moesaltd\.com/, '').replace(/[?#].*$/, '')
        if (path.startsWith('/api') || /\.[a-z0-9]+$/i.test(path)) continue
        const target = routeNameForLocalePath(path)
        if (path === '/' || (target && ROUTES[target].en === path && ROUTES[target].tr !== path)) {
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
