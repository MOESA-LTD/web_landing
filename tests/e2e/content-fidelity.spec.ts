import { expect, test } from '@playwright/test'
import { approvedStringsFor, findMissing, mdPath, readPageMeta } from './fidelity/extract'
import { FIDELITY_ROUTES } from './fidelity/routes'

/**
 * Every approved string of a page's md (headings, paragraphs, list items, CTA labels) must be visible text of
 * the page's own content: `<main id="main">` only, so the header, language bar and footer (nav labels, service
 * links, header CTA) cannot stand in for a missing section. Case-insensitive, because eyebrows are uppercased
 * by CSS (innerText reflects that); TR is case-folded with Turkish rules (see `findMissing`).
 * Title and meta description must equal the md values.
 */
for (const { route, md, locale } of FIDELITY_ROUTES) {
  test.describe(`content fidelity ${route} (${locale}/${md})`, () => {
    test('shows every approved string inside <main>', async ({ page }) => {
      const strings = approvedStringsFor(locale, md)
      expect(strings.length, `no approved strings extracted from ${locale}/${md}`).toBeGreaterThan(0)
      await page.goto(route)
      const text = await page.locator('#main').innerText()
      const missing = findMissing(text, strings, locale)
      expect(missing, `approved strings missing on ${route}`).toEqual([])
    })

    test('has the md title and meta description and one h1', async ({ page }) => {
      await page.goto(route)
      const meta = readPageMeta(mdPath(locale, md))
      await expect(page).toHaveTitle(meta.title)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', meta.description)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
    })
  })
}

test('switching EN → TR on Home updates lang, title and canonical without a reload', async ({ page }) => {
  await page.goto('/')
  await page.locator('a[hreflang="tr"]').first().click()
  await expect(page).toHaveURL(/\/tr$/)
  const tr = readPageMeta(mdPath('tr', 'home.md'))
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
  await expect(page).toHaveTitle(tr.title)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.moesaltd.com/tr')
  await expect(page.locator('h1')).toHaveText('Ticari hedeften pazara hazır teslimata.')
})
