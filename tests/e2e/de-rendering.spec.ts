import { expect, test } from '@playwright/test'
import { ROUTES } from '../../i18n/routes'

/**
 * German renders longer words than EN ("Beschaffungsmanagement", "Produktionsverfolgung"). On every DE page, at 1440
 * (desktop project) and 390 (mobile project): no horizontal page scroll, and no text box whose content overflows it
 * (a word wider than its column). Full-page screenshots of four pages go to tests/e2e/__screens__/ (gitignored) for
 * the visual check.
 */
const PAGES = [
  ['/de', 'de-home'],
  ['/de/leistungen/operations-und-lieferkette', 'de-operations'],
  ['/de/kontakt', 'de-kontakt'],
  ['/de/impressum', 'de-impressum'],
] as const

/** Every DE page is checked for overflow; the four PAGES are also screenshotted. */
const ALL: (readonly [string, string | null])[] = [
  ...PAGES,
  ...(Object.values(ROUTES) as { de: string }[]).map((p) => p.de).filter((p) => !PAGES.some(([q]) => q === p)).map((p) => [p, null] as const),
]

/** Text-box overflow and off-screen text in the header, main and footer (a word wider than its column). */
function findOverflow() {
  const out: string[] = []
  for (const el of document.querySelectorAll<HTMLElement>('header *, main *, footer *')) {
    const cs = getComputedStyle(el)
    if (cs.display === 'inline' || cs.display === 'none' || cs.visibility === 'hidden') continue
    if (el.closest('[hidden], .sr-only, svg') || el.classList.contains('sr-only')) continue
    if (!el.textContent?.trim() || el.clientWidth === 0) continue
    // Only boxes that hold text directly (headings, paragraphs, list items, links, buttons, labels).
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim())) continue
    const text = el.textContent.trim().slice(0, 60)
    if (el.scrollWidth > el.clientWidth + 1) out.push(`${el.tagName.toLowerCase()} "${text}" ${el.scrollWidth}>${el.clientWidth}`)
    const r = el.getBoundingClientRect()
    if (r.right > document.documentElement.clientWidth + 1 || r.left < -1) out.push(`${el.tagName.toLowerCase()} off-screen "${text}"`)
  }
  return out
}

/** The desktop project also sweeps the layout breakpoints between 1440 and 390 (container widths 1160 … 560). */
const EXTRA_WIDTHS = [1160, 1000, 960, 860, 720, 560]

for (const [path, name] of ALL) {
  test(`${path}: no horizontal overflow and no overflowing text box`, async ({ page }) => {
    await page.goto(path)
    await page.evaluate(() => document.fonts.ready)
    const width = page.viewportSize()!.width
    const scroll = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(await scroll()).toBe(0)
    expect(await page.evaluate(findOverflow)).toEqual([])
    if (name) await page.screenshot({ path: `tests/e2e/__screens__/${name}-${width}.png`, fullPage: true })
    if (width !== 1440) return
    for (const w of EXTRA_WIDTHS) {
      await page.setViewportSize({ width: w, height: 900 })
      expect(await scroll(), `${w}px`).toBe(0)
      expect(await page.evaluate(findOverflow), `${w}px`).toEqual([])
    }
  })
}
