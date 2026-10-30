import { expect, test } from '@playwright/test'

/**
 * Full-width bands (CapabilityStrip, EUBaseSection, FinalCTA) keep 96px vertical padding above a container
 * width of 860px and drop to 64px at 860px or less, like the page sections (DESIGN_NOTES §1.5 / §5).
 * Measured as the distance between the band's edges and its content box, so it holds wherever the padding sits.
 */
for (const route of ['/', '/tr']) {
  test(`bands on ${route} use 96px vertical padding above 860px and 64px at or below`, async ({ page }, info) => {
    await page.goto(route)
    const bands = await page.locator('[data-band]').evaluateAll((els) =>
      els.map((band) => {
        const content = band.querySelector('[data-band-content]')!
        const b = band.getBoundingClientRect()
        const c = content.getBoundingClientRect()
        const cs = getComputedStyle(content)
        return {
          top: Math.round(c.top + parseFloat(cs.paddingTop) - b.top),
          bottom: Math.round(b.bottom - (c.bottom - parseFloat(cs.paddingBottom))),
        }
      }),
    )
    expect(bands).toHaveLength(3)
    const expected = (info.project.use.viewport?.width ?? 1440) <= 860 ? 64 : 96
    expect(bands).toEqual(bands.map(() => ({ top: expected, bottom: expected })))
  })
}
