import { expect, test } from '@playwright/test'
import { content as trContent } from '../../content/tr/index'
import type { PageKey } from '../../content/types'
import { approvedStringsFor, findMissing, legalRemovedMetaDescription, mdPath, readPageMeta } from './fidelity/extract'
import { FIDELITY_ROUTES } from './fidelity/routes'
import { switchLanguage } from './lang'

/**
 * Every approved string of a page's md (headings, paragraphs, list items, CTA labels) must be visible text of
 * the page's own content: `<main id="main">` only, so the header (with the language dropdown) and footer (nav labels, service
 * links, header CTA) cannot stand in for a missing section. Case-insensitive, because eyebrows are uppercased
 * by CSS (innerText reflects that); TR is case-folded with Turkish rules (see `findMissing`).
 * Title and meta description must equal the md values, except a legal meta description that was draft text and is
 * replaced by a translation of the EN one (legal review B4; listed in content/legal-revisions.ts `LEGAL_REMOVED`).
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
      const replaced = legalRemovedMetaDescription(locale, md) === meta.description
      const description = replaced ? trContent[md.replace(/\.md$/, '') as PageKey].meta.description : meta.description
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', description)
      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page.locator('html')).toHaveAttribute('lang', locale)
    })
  })
}

test('switching EN → TR on Home updates lang, title and canonical without a reload', async ({ page }) => {
  await page.goto('/')
  await switchLanguage(page, 'tr')
  await expect(page).toHaveURL(/\/tr$/)
  const tr = readPageMeta(mdPath('tr', 'home.md'))
  await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
  await expect(page).toHaveTitle(tr.title)
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.moesaltd.com/tr')
  await expect(page.locator('h1')).toHaveText('Ticari hedeften pazara hazır teslimata.')
})
