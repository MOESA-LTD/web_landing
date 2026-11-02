import { expect, test } from '@playwright/test'
import { ROUTES } from '../../i18n/routes'
import { content as en } from '../../content/en/index'
import { content as tr } from '../../content/tr/index'
import { content as de } from '../../content/de/index'
import type { LegalContent } from '../../content/en/legal'

/**
 * NUXT_PUBLIC_LEGAL_REVIEW_NOTES on the legal pages (EN/TR/DE), against the production build after hydration:
 * - the default server (production: flag unset) shows no Draft status chip and no OPEN note;
 * - the second web server of playwright.config.ts (the same build, flag "true", as on a Pages Preview deployment)
 *   shows both as before.
 */
const REVIEW_NOTES_ORIGIN = `http://localhost:${Number(process.env.E2E_PORT ?? 3100) + 1}`
const OPEN_PREFIX = 'OPEN / AÇIK - '
const PAGES = ['privacy-policy', 'cookie-policy', 'legal-notice'] as const
const CONTENT = { en, tr, de }
const OPEN_LABEL = { en: 'Open', tr: 'Açık', de: 'Offen' } as const

const opens = (c: LegalContent) => c.sections.flatMap((s) => s.paragraphs ?? []).filter((p) => p.startsWith(OPEN_PREFIX))

for (const page of PAGES) {
  for (const locale of ['en', 'tr', 'de'] as const) {
    const path = ROUTES[page][locale]
    const c = CONTENT[locale][page] as LegalContent

    test(`${path}: production hides the status chip and the OPEN notes`, async ({ page: p }) => {
      await p.goto(path, { waitUntil: 'networkidle' })
      await expect(p.locator('h1')).toHaveText(c.hero.title)
      await expect(p.locator('[data-legal-status]')).toHaveCount(0)
      await expect(p.locator('[data-open]')).toHaveCount(0)
      await expect(p.locator('[data-legal-page] [data-chip]')).toHaveCount(0)
      const text = await p.locator('#main').innerText()
      for (const phrase of ['DRAFT', 'TASLAK', 'LEGAL REVIEW REQUIRED', 'is to be confirmed', 'teyit edilecek', 'noch zu bestätigen']) {
        expect(text, phrase).not.toContain(phrase)
      }
      // The chip label as the chip shows it (uppercased by CSS; innerText reflects that): EN "OPEN", TR "AÇIK", DE "OFFEN".
      expect(text).not.toMatch(new RegExp(`(^|\\s)${OPEN_LABEL[locale].toLocaleUpperCase(locale)}(\\s|$)`))
    })

    test(`${path}: a Preview deployment (flag on) shows the status chip and every OPEN note`, async ({ page: p }) => {
      await p.goto(`${REVIEW_NOTES_ORIGIN}${path}`, { waitUntil: 'networkidle' })
      await expect(p.locator('[data-legal-status]')).toHaveCount(1)
      await expect(p.locator('[data-legal-status]')).toContainText(c.status)
      const notes = p.locator('[data-open]')
      const expected = opens(c)
      await expect(notes).toHaveCount(expected.length)
      for (const [i, o] of expected.entries()) {
        await expect(notes.nth(i).locator('[data-chip="open"]')).toHaveText(new RegExp(`^${OPEN_LABEL[locale]}$`, 'i'))
        await expect(notes.nth(i)).toContainText(o.slice(OPEN_PREFIX.length))
      }
    })
  }
}
