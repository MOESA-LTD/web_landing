import { expect, test } from '@playwright/test'

/**
 * Canvas update 1793440192-c426 (Main.dc.html page style):
 *   .ms-hero-panel .ms-motif-chevron { inset: auto; left: 50%; top: 50%; width: 100%; height: auto;
 *     aspect-ratio: 734/1125; transform: translate(-63.2%, -40.6%); overflow: visible }
 *   @media (max-width: 859px) { .ms-hero-panel { display: none } }
 * The navy panel (with the "MOESA LTD." label) is gone at ≤859px; the chevron box is panel-wide, 1125/734 as tall,
 * anchored at the panel centre and translated by its own size; the panel still clips (overflow hidden).
 * Sets its own viewports, so it runs once (desktop project).
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

  for (const width of [860, 1160, 1440]) {
    test(`is visible at ${width}px, chevron box panel-wide, centred and translated (-63.2%, -40.6%)`, async ({ page }) => {
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
      const g = await svg.evaluate((el) => {
        const cs = getComputedStyle(el)
        const p = el.parentElement!.getBoundingClientRect()
        const r = el.getBoundingClientRect() // includes the translate; size is unaffected by it
        return {
          transform: cs.transform,
          overflow: cs.overflow,
          width: parseFloat(cs.width),
          height: parseFloat(cs.height),
          left: r.left - p.left,
          top: r.top - p.top,
          panelW: p.width,
          panelH: p.height,
        }
      })
      expect(g.overflow).toBe('visible')
      expect(Math.abs(g.width - g.panelW)).toBeLessThanOrEqual(1)
      expect(Math.abs(g.height - (g.width * 1125) / 734)).toBeLessThanOrEqual(1)
      // matrix(1, 0, 0, 1, tx, ty) with tx = -63.2% of the svg width and ty = -40.6% of its height.
      const m = /matrix\(1, 0, 0, 1, (-?[\d.]+), (-?[\d.]+)\)/.exec(g.transform)
      expect(m, g.transform).not.toBeNull()
      expect(Math.abs(Number(m![1]) - -0.632 * g.width)).toBeLessThanOrEqual(1)
      expect(Math.abs(Number(m![2]) - -0.406 * g.height)).toBeLessThanOrEqual(1)
      // Anchored at the panel centre (left/top 50%), then translated.
      expect(Math.abs(g.left - (g.panelW / 2 - 0.632 * g.width))).toBeLessThanOrEqual(1)
      expect(Math.abs(g.top - (g.panelH / 2 - 0.406 * g.height))).toBeLessThanOrEqual(1)
    })
  }
})
