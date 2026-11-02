import { expect, test } from '@playwright/test'
import { ROUTES, type RouteName } from '../../i18n/routes'
import { deMeta, deStringsFor } from './fidelity/de'
import { switchLanguage } from './lang'

/**
 * German pages: no approved DE md exists, so the oracle is the DE content module (our flagged translation of the
 * approved EN). Every copy string of the page's module must be visible text inside `<main id="main">` (header and
 * footer cannot stand in for a missing section); title and meta description come from the module's meta; one h1;
 * `<html lang="de">`. Case-insensitive with German folding (eyebrows are uppercased by CSS).
 */
const NAMES = Object.keys(ROUTES) as RouteName[]
const fold = (s: string) => s.replace(/\s+/g, ' ').trim().toLocaleLowerCase('de')

for (const name of NAMES) {
  const route = ROUTES[name].de
  test.describe(`content fidelity ${route} (de/${name})`, () => {
    test('shows every DE module string inside <main>', async ({ page }) => {
      const strings = deStringsFor(name)
      expect(strings.length).toBeGreaterThan(3)
      await page.goto(route)
      const text = fold(await page.locator('#main').innerText())
      expect(strings.filter((s) => !text.includes(fold(s))), `DE strings missing on ${route}`).toEqual([])
    })

    test('has the DE title and meta description, one h1 and html lang de', async ({ page }) => {
      await page.goto(route)
      const meta = deMeta(name)
      await expect(page).toHaveTitle(meta.title)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', meta.description)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('html')).toHaveAttribute('lang', 'de')
    })
  })
}

test('switching EN → DE on Home updates lang, title and canonical without a reload', async ({ page }) => {
  await page.goto('/')
  await switchLanguage(page, 'de')
  await expect(page).toHaveURL(/\/de$/)
  await expect(page.locator('html')).toHaveAttribute('lang', 'de')
  await expect(page).toHaveTitle(deMeta('home').title)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.moesaltd.com/de')
  await expect(page.locator('h1')).toHaveText('Vom Geschäftsziel zur marktreifen Lieferung.')
})
