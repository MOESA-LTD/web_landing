import { expect, test } from '@playwright/test'
import { openLanguageMenu } from './lang'

/**
 * Header language dropdown (canvas v1793393437): in the header bar, no grey bar above it, Home not in the nav,
 * real links, one menu open at a time, Escape / outside click close it. Geometry is the canvas's `.mo-lang`.
 */
const box = async (loc: import('@playwright/test').Locator) => (await loc.boundingBox())!

test.describe('header language dropdown', () => {
  test('SSR HTML: dropdown in the header, no language bar, no Home item, both hreflang links', async ({ request }) => {
    const html = await (await request.get('/services')).text()
    const header = /<header\b[\s\S]*?<\/header>/.exec(html)![0]
    expect(header).toContain('id="lang-button"')
    expect(header).toContain('aria-label="Language: English"')
    expect(header).toContain('hreflang="tr"')
    expect(html).not.toContain('role="group"')
    const nav = /<nav\b[^>]*data-nav="desktop"[\s\S]*?<\/nav>/.exec(header)![0]
    expect(nav).not.toContain('href="/"')
    expect(nav.match(/<li\b/g)!.length).toBe(5 + 6) // 5 items + 6 links in the Services menu
  })

  test('opens, shows English / Türkçe with codes, closes on Escape with focus back, and on an outside click', async ({ page }) => {
    await page.goto('/services')
    await openLanguageMenu(page)
    const menu = page.locator('#lang-menu')
    await expect(menu.locator('a > span')).toHaveText(['English', 'EN', 'Türkçe', 'TR'])
    await expect(menu.locator('a[aria-current="true"] > span').first()).toHaveText('English')
    await page.keyboard.press('Escape')
    await expect(menu).toBeHidden()
    await expect(page.locator('#lang-button')).toBeFocused()
    await openLanguageMenu(page)
    await page.locator('main h1').click()
    await expect(menu).toBeHidden()
  })

  test('the language menu and the Services menu are never open together', async ({ page, isMobile }) => {
    test.skip(!!isMobile || page.viewportSize()!.width < 960, 'Services disclosure is desktop only')
    await page.goto('/services')
    await openLanguageMenu(page)
    await page.locator('#services-button').click()
    await expect(page.locator('#services-menu')).toBeVisible()
    await expect(page.locator('#lang-menu')).toBeHidden()
    await page.locator('#lang-button').click()
    await expect(page.locator('#lang-menu')).toBeVisible()
    await expect(page.locator('#services-menu')).toBeHidden()
  })

  test('switches EN to TR through the dropdown, keeping the query', async ({ page }) => {
    // (/contact itself arrives with Task 9; /services exercises the same query handling)
    await page.goto('/services?ref=header')
    await openLanguageMenu(page)
    await expect(page.locator('#lang-menu a[hreflang="tr"]')).toHaveAttribute('href', '/tr/hizmetler?ref=header')
    await page.locator('#lang-menu a[hreflang="tr"]').click()
    await expect(page).toHaveURL(/\/tr\/hizmetler\?ref=header$/)
    await expect(page.locator('#lang-button')).toHaveText('TR')
    await expect(page.locator('#lang-menu')).toBeHidden()
    await expect(page.locator('#lang-button')).toHaveAttribute('aria-label', 'Dil: Türkçe')
  })

  test('geometry: button vertically centred in the bar at the right end of the 1200px container, clear of the CTA / menu button', async ({ page }) => {
    await page.goto('/')
    const header = page.locator('header')
    const btn = page.locator('#lang-button')
    await expect(btn).toBeVisible()
    const hb = await box(header)
    const bb = await box(btn)
    const vw = page.viewportSize()!.width
    expect(Math.round(bb.height)).toBe(44)
    expect(bb.width).toBeGreaterThanOrEqual(64)
    if (vw >= 960) {
      expect(Math.round(bb.y - hb.y)).toBe(16) // 76px bar
      expect(Math.round(vw - (bb.x + bb.width))).toBe(Math.max(24, (vw - 1200) / 2 + 24))
      const cta = await box(page.locator('[data-header-cta] a'))
      expect(bb.x - (cta.x + cta.width)).toBeGreaterThanOrEqual(12)
    } else {
      expect(Math.round(bb.y - hb.y)).toBe(10) // 64px bar
      expect(Math.round(vw - (bb.x + bb.width))).toBe(68)
      const menu = await box(page.locator('#menu-button'))
      expect(Math.round(menu.x - (bb.x + bb.width))).toBe(8)
    }
  })

  test('no horizontal page scroll with the menu open', async ({ page }) => {
    await page.goto('/')
    await openLanguageMenu(page)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBe(0)
  })

  test('TR nav labels stay on one line at 1440 (the 76px dropdown reserve must not make them wrap)', async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1200, 'desktop only')
    await page.goto('/tr/hizmetler')
    const links = page.locator('[data-nav="desktop"] > ul > li > a, [data-nav="desktop"] > ul > li > button')
    await expect(links).toHaveCount(5)
    const lines = await links.evaluateAll((els) =>
      els.map((e) => {
        const range = document.createRange()
        range.selectNodeContents([...e.childNodes].find((n) => n.nodeType === 3 && n.textContent!.trim())!)
        return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size
      }),
    )
    expect(lines).toEqual([1, 1, 1, 1, 1])
    const cta = await box(page.locator('[data-header-cta] a'))
    expect(Math.round(cta.height)).toBe(40) // the CTA label must not wrap either
    const last = await box(links.last())
    expect(cta.x - (last.x + last.width)).toBeGreaterThanOrEqual(22)
  })

  // Measured: with the short TR header labels the five items plus logo, CTA and the 76px reserve need ~1125px (TR) /
  // ~1148px (EN) to stay on one line, so one-line is asserted from 1160px; 1024 and 960 only assert that nothing
  // overflows or breaks the 76px bar (the DS lets the labels wrap there, as before this task).
  for (const width of [1200, 1160, 1024, 960]) {
    for (const [route, locale] of [['/services', 'EN'], ['/tr/hizmetler', 'TR']] as const) {
      test(`${locale} nav is on fits at ${width}px: bar stays 76px, no horizontal overflow, dropdown clear`, async ({ page }) => {
        test.skip(page.viewportSize()!.width !== 1440, 'runs once, sets its own viewport')
        await page.setViewportSize({ width, height: 800 })
        await page.goto(route)
        const bar = await box(page.locator('header > div').first())
        expect(Math.round(bar.height)).toBe(76)
        const cta = await box(page.locator('[data-header-cta] a'))
        const lines = await page.locator('[data-nav="desktop"] > ul > li > a, [data-nav="desktop"] > ul > li > button').evaluateAll((els) =>
          els.map((e) => {
            const range = document.createRange()
            range.selectNodeContents([...e.childNodes].find((n) => n.nodeType === 3 && n.textContent!.trim())!)
            return new Set([...range.getClientRects()].map((r) => Math.round(r.top))).size
          }),
        )
        if (width >= 1160) {
          expect(lines).toEqual([1, 1, 1, 1, 1])
          expect(Math.round(cta.height)).toBe(40)
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
        const last = await box(page.locator('[data-nav="desktop"] > ul > li').last())
        if (width >= 1160) expect(cta.x - (last.x + last.width)).toBeGreaterThanOrEqual(0)
        const lang = await box(page.locator('#lang-button'))
        expect(lang.x - (cta.x + cta.width)).toBeGreaterThanOrEqual(10)
        if (locale === 'TR') await page.screenshot({ path: `tests/e2e/__screens__/hdr-app-tr-${width}.png`, clip: { x: 0, y: 0, width, height: 140 } })
      })
    }
  }
})
