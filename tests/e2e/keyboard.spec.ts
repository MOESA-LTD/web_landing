import { expect, test, type Page } from '@playwright/test'

/**
 * Keyboard-only walkthrough (Task 11 acceptance): Tab order through the header, the Services disclosure, the
 * language dropdown, the mobile menu at 390px, and the contact form with its error summary. Desktop-only and
 * mobile-only checks skip on the other project (desktop 1440, mobile 390).
 */

async function hydrated(page: Page) {
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__))
}

/** A short descriptor of the focused element: `#id`, else `tag[href]`, else `tag`. */
async function focused(page: Page): Promise<string> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null
    if (!el || el === document.body) return 'body'
    if (el.id) return `#${el.id}`
    const href = el.getAttribute('href')
    return href !== null ? `${el.tagName.toLowerCase()}[${href}]` : el.tagName.toLowerCase()
  })
}

/** Presses Tab `n` times and returns the descriptor after each press. */
async function tabs(page: Page, n: number): Promise<string[]> {
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab')
    out.push(await focused(page))
  }
  return out
}

/** Tabs until `target` is focused (at most `max` presses); fails otherwise. */
async function tabTo(page: Page, target: string, max = 80) {
  for (let i = 0; i < max; i++) {
    await page.keyboard.press('Tab')
    if ((await focused(page)) === target) return
  }
  throw new Error(`${target} not reached within ${max} Tab presses`)
}

const isDesktop = (page: Page) => (page.viewportSize()?.width ?? 0) >= 1160

test.describe('keyboard walkthrough', () => {
  test('the skip link is the first stop, is visible when focused, and moves focus to main', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await page.keyboard.press('Tab')
    const skip = page.locator('a[href="#main"]')
    await expect(skip).toBeFocused()
    const box = await skip.boundingBox()
    expect(box && box.width > 20 && box.height > 20).toBe(true)
    await page.keyboard.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
  })

  test('desktop header Tab order: skip link, logo, nav (Services first), CTA, language button', async ({ page }) => {
    test.skip(!isDesktop(page), 'desktop header (>=1160px)')
    await page.goto('/')
    await hydrated(page)
    const order = await tabs(page, 9)
    expect(order[0]).toBe('a[#main]')
    expect(order[1]).toBe('a[/]')
    expect(order[2]).toBe('#services-button')
    // Nav links after Services in visual order (Contact is a nav link too), then the CTA, then the language button.
    expect(order.slice(3)).toEqual([
      'a[/how-we-work]',
      'a[/who-we-work-with]',
      'a[/about]',
      'a[/contact]',
      'a[/contact]',
      '#lang-button',
    ])
    await expect(page.locator('#lang-button')).toBeFocused()
    await expect(page.locator('[data-header-cta] a')).toHaveAttribute('href', '/contact')
  })

  test('Services disclosure: Enter opens, Tab enters the menu, Escape closes and returns focus', async ({ page }) => {
    test.skip(!isDesktop(page), 'desktop header (>=1160px)')
    await page.goto('/')
    await hydrated(page)
    await tabTo(page, '#services-button')
    const button = page.locator('#services-button')
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#services-menu')).toBeVisible()
    await page.keyboard.press('Tab')
    expect(await focused(page)).toMatch(/^a\[\/services/)
    await page.keyboard.press('Escape')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#services-menu')).toBeHidden()
    await expect(button).toBeFocused()
    // Space toggles it too.
    await page.keyboard.press('Space')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Space')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  test('language dropdown: Enter opens, Tab walks EN/TR, tabbing out closes, Escape returns focus, Enter switches', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await tabTo(page, '#lang-button')
    const button = page.locator('#lang-button')
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#lang-menu')).toBeVisible()
    expect(await tabs(page, 2)).toEqual(['a[/]', 'a[/tr]'])
    // Tabbing past the last item leaves the dropdown, which closes.
    await page.keyboard.press('Tab')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    // Back to the button, reopen, Escape.
    await button.focus()
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Escape')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(button).toBeFocused()
    // Enter on TR follows the link.
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/tr$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
  })

  test('mobile (390): Tab order skip, logo, menu button, language button; the menu opens with Enter and closes with Escape', async ({ page }) => {
    test.skip(isDesktop(page), 'mobile header (<1160px)')
    await page.goto('/')
    await hydrated(page)
    // DOM order puts the menu button before the language button (the language button sits visually left of it).
    expect(await tabs(page, 4)).toEqual(['a[#main]', 'a[/]', '#menu-button', '#lang-button'])
    await page.locator('#menu-button').focus()
    await page.keyboard.press('Enter')
    await expect(page.locator('#menu-button')).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#mobile-menu')).toBeVisible()
    // The panel follows the language button in the Tab order.
    const next = await tabs(page, 3)
    expect(next[0]).toBe('#lang-button')
    expect(next[1]).toMatch(/^a\[\//)
    expect(await page.evaluate(() => document.querySelector('#mobile-menu')!.contains(document.activeElement))).toBe(true)
    await page.keyboard.press('Escape')
    await expect(page.locator('#menu-button')).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#mobile-menu')).toBeHidden()
    await expect(page.locator('#menu-button')).toBeFocused()
  })

  test('focus is visible: 2px blue outline on header controls', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await tabTo(page, '#lang-button')
    const style = await page.locator('#lang-button').evaluate((el) => {
      const s = getComputedStyle(el)
      return { style: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor }
    })
    expect(style).toEqual({ style: 'solid', width: '2px', color: 'rgb(0, 105, 178)' })
  })

  test('contact form: fields in visual order, submit with Enter, focused error summary, link to the field', async ({ page }) => {
    await page.route('**/api/contact', (r) => r.fulfill({ json: { ok: true } }))
    await page.goto('/contact')
    await hydrated(page)
    await tabTo(page, '#contact-name')
    const order = [await focused(page), ...(await tabs(page, 11))]
    expect(order).toEqual([
      '#contact-name',
      '#contact-company',
      '#contact-work_email',
      '#contact-country',
      '#contact-service',
      '#contact-project_brief',
      '#contact-product_category',
      '#contact-target_market',
      '#contact-estimated_volume',
      '#contact-target_timeline',
      '#contact-privacy_consent',
      // The consent label links to the privacy policy (new tab-order stop between the checkbox and submit).
      'a[/privacy-policy]',
    ])
    await page.keyboard.press('Tab')
    expect(await focused(page)).toBe('button')
    // The honeypot (tabindex -1) is skipped. Enter on the submit button validates.
    await page.keyboard.press('Enter')
    const summary = page.locator('[data-error-summary]')
    await expect(summary).toBeFocused()
    await page.keyboard.press('Tab')
    expect(await focused(page)).toBe('a[#contact-name]')
    await page.keyboard.press('Enter')
    await expect(page.locator('#contact-name')).toBeFocused()
    // Space toggles the consent checkbox.
    await page.locator('#contact-privacy_consent').focus()
    await page.keyboard.press('Space')
    await expect(page.locator('#contact-privacy_consent')).toBeChecked()
  })
})
