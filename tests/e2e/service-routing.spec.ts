import { expect, test } from '@playwright/test'
import { switchLanguage } from './lang'

/**
 * Service URLs: Turkish slugs under /tr/hizmetler, 404 for unknown or wrong-locale slugs, and a language
 * dropdown (in the header bar) that links each service page to its counterpart. The header is rendered by the
 * layout before the page's setup runs, so the server-rendered HTML (read here without running any script) must already carry
 * the counterpart slug.
 */
const PAIR = { en: '/services/operations-supply-chain', tr: '/tr/hizmetler/operasyon-ve-tedarik-zinciri' }

/** The href of the switcher link for `locale` in raw HTML (`<a ... hreflang="tr">`, not the head `<link>`). */
const switcherHref = (html: string, locale: 'en' | 'tr') => {
  const tag = [...html.matchAll(/<a\b[^>]*>/g)].map((m) => m[0]).find((t) => t.includes(`hreflang="${locale}"`))
  return tag ? /href="([^"]*)"/.exec(tag)?.[1] : undefined
}

test.describe('service routing', () => {
  test('the server-rendered switcher on an EN service page links to the TR slug, and back', async ({ request }) => {
    const enHtml = await (await request.get(PAIR.en)).text()
    expect(switcherHref(enHtml, 'tr')).toBe(PAIR.tr)
    expect(switcherHref(enHtml, 'en')).toBe(PAIR.en)
    const trHtml = await (await request.get(PAIR.tr)).text()
    expect(switcherHref(trHtml, 'en')).toBe(PAIR.en)
    expect(switcherHref(trHtml, 'tr')).toBe(PAIR.tr)
  })

  test('the server-rendered switcher on the overview links /services and /tr/hizmetler', async ({ request }) => {
    expect(switcherHref(await (await request.get('/services')).text(), 'tr')).toBe('/tr/hizmetler')
    expect(switcherHref(await (await request.get('/tr/hizmetler')).text(), 'en')).toBe('/services')
  })

  test('unknown and wrong-locale slugs answer 404', async ({ request }) => {
    for (const path of ['/services/unknown', '/tr/hizmetler/operations-supply-chain', '/services/operasyon-ve-tedarik-zinciri', '/tr/hizmetler/unknown']) {
      expect((await request.get(path)).status(), path).toBe(404)
    }
  })

  test('switching EN → TR on a service page lands on the TR slug with the TR h1', async ({ page }) => {
    await page.goto(PAIR.en)
    await switchLanguage(page, 'tr')
    await expect(page).toHaveURL(new RegExp(`${PAIR.tr}$`))
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
    await expect(page.locator('h1')).toHaveText('Satın alma siparişinden varış noktasına.')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.moesaltd.com${PAIR.tr}`)
    await switchLanguage(page, 'en')
    await expect(page).toHaveURL(new RegExp(`${PAIR.en}$`))
    await expect(page.locator('h1')).toHaveText('From purchase order to destination.')
  })

  test('a service page has exactly one canonical and one hreflang alternate per locale', async ({ page }) => {
    await page.goto(PAIR.tr)
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
    for (const lang of ['en', 'tr', 'x-default']) await expect(page.locator(`link[rel="alternate"][hreflang="${lang}"]`)).toHaveCount(1)
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', `https://www.moesaltd.com${PAIR.en}`)
  })
})
