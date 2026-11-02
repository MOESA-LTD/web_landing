import { expect, test } from '@playwright/test'
import { ROUTES, type RouteName } from '../../i18n/routes'
import { bgMeta, bgStringsFor } from './fidelity/bg'
import { switchLanguage } from './lang'

/**
 * Bulgarian pages: no approved BG md exists, so the oracle is the BG content module (our flagged translation of the
 * approved EN). Every copy string of the page's module must be visible text inside `<main id="main">` (header and
 * footer cannot stand in for a missing section); title and meta description come from the module's meta; one h1;
 * `<html lang="bg">`, `og:locale` bg_BG. Case-insensitive with Bulgarian folding (eyebrows are uppercased by CSS).
 */
const NAMES = Object.keys(ROUTES) as RouteName[]
const fold = (s: string) => s.replace(/\s+/g, ' ').trim().toLocaleLowerCase('bg')

for (const name of NAMES) {
  const route = ROUTES[name].bg
  test.describe(`content fidelity ${route} (bg/${name})`, () => {
    test('shows every BG module string inside <main>', async ({ page }) => {
      const strings = bgStringsFor(name)
      expect(strings.length).toBeGreaterThan(3)
      await page.goto(route)
      const text = fold(await page.locator('#main').innerText())
      expect(strings.filter((s) => !text.includes(fold(s))), `BG strings missing on ${route}`).toEqual([])
    })

    test('has the BG title and meta description, one h1, html lang bg and og:locale bg_BG', async ({ page }) => {
      await page.goto(route)
      const meta = bgMeta(name)
      await expect(page).toHaveTitle(meta.title)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', meta.description)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('html')).toHaveAttribute('lang', 'bg')
      await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', 'bg_BG')
    })
  })
}

test('switching EN → BG on Home updates lang, title and canonical without a reload', async ({ page }) => {
  await page.goto('/')
  await switchLanguage(page, 'bg')
  await expect(page).toHaveURL(/\/bg$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'bg')
  await expect(page).toHaveTitle(bgMeta('home').title)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.moesaltd.com/bg')
  await expect(page.locator('h1')).toHaveText('От бизнес целта до доставка, готова за пазара.')
})
