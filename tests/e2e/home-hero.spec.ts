import { expect, test } from '@playwright/test'

/**
 * Canvas update 1793402809 (Main.dc.html page style):
 *   .ms-hero-panel .ms-motif-chevron { transform: translateX(-13%); overflow: visible }
 *   @media (max-width: 859px) { .ms-hero-panel { display: none } }
 * The navy panel (with the "MOESA LTD." label) is gone at ≤859px; the chevron is nudged left inside the panel,
 * which itself still clips (overflow hidden). Sets its own viewports, so it runs once (desktop project).
 */
test.describe('home display hero panel', () => {
  test.beforeEach(({ page }) => {
    test.skip(page.viewportSize()!.width !== 1440, 'runs once, sets its own viewport')
  })

  for (const width of [390, 859]) {
    test(`is hidden at ${width}px, with its label`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await expect(page.locator('[data-hero-panel]')).toBeHidden()
      await expect(page.locator('[data-panel-label]')).toBeHidden()
      await expect(page.locator('h1')).toBeVisible()
    })
  }

  for (const width of [860, 1440]) {
    test(`is visible at ${width}px, chevron shifted -13% and not clipped by its own box`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      const panel = page.locator('[data-hero-panel]')
      await expect(panel).toBeVisible()
      await expect(page.locator('[data-panel-label]')).toHaveText('MOESA LTD.')
      // Beside the text (never stacked), as in the canvas: the right 37% of the hero.
      const box = (await panel.boundingBox())!
      expect(box.x + box.width).toBeCloseTo(width, -1)
      expect(box.width).toBeCloseTo(width * 0.37, -1)
      expect(await panel.evaluate((el) => getComputedStyle(el).overflow)).toBe('hidden')
      const svg = panel.locator('svg').first()
      const style = await svg.evaluate((el) => {
        const cs = getComputedStyle(el)
        return { transform: cs.transform, overflow: cs.overflow, width: el.getBoundingClientRect().width }
      })
      expect(style.overflow).toBe('visible')
      // matrix(1, 0, 0, 1, tx, 0) with tx = -13% of the svg width.
      const tx = Number(/matrix\(1, 0, 0, 1, (-?[\d.]+), 0\)/.exec(style.transform)?.[1])
      expect(tx).toBeCloseTo(-0.13 * style.width, 0)
    })
  }
})
