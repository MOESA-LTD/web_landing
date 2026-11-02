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

/** The computed outline of the focused element (the :focus-visible ring). */
async function ring(page: Page): Promise<{ who: string; style: string; width: number }> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement
    const s = getComputedStyle(el)
    return { who: el.id || el.getAttribute('href') || el.tagName, style: s.outlineStyle, width: parseFloat(s.outlineWidth) }
  })
}

/** Fails unless the focused element shows a visible focus ring (solid outline of at least 2px). */
async function expectRing(page: Page) {
  const r = await ring(page)
  expect(r.style, `focus ring style on ${r.who}`).not.toBe('none')
  expect(r.width, `focus ring width on ${r.who}`).toBeGreaterThanOrEqual(2)
}

/** Presses Tab `n` times and returns the descriptor after each press; every stop must show a focus ring. */
async function tabs(page: Page, n: number): Promise<string[]> {
  const out: string[] = []
  for (let i = 0; i < n; i++) {
    await page.keyboard.press('Tab')
    out.push(await focused(page))
    await expectRing(page)
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
    await expectRing(page)
    await page.keyboard.press('Enter')
    await expect(page.locator('#main')).toBeFocused()
  })

  const HEADER_PATHS = {
    en: { home: '/', how: '/how-we-work', who: '/who-we-work-with', about: '/about', contact: '/contact' },
    tr: { home: '/tr', how: '/tr/nasil-calisiyoruz', who: '/tr/kimlerle-calisiyoruz', about: '/tr/hakkimizda', contact: '/tr/iletisim' },
  } as const

  for (const locale of ['en', 'tr'] as const) {
    const p = HEADER_PATHS[locale]

    test(`desktop header Tab order (${locale}): skip link, logo, nav (Services first), CTA, language button`, async ({ page }) => {
      test.skip(!isDesktop(page), 'desktop header (>=1160px)')
      await page.goto(p.home)
      await hydrated(page)
      // Nav links after Services in visual order (Contact is a nav link too), then the CTA, then the language button.
      expect(await tabs(page, 9)).toEqual([
        'a[#main]',
        `a[${p.home}]`,
        '#services-button',
        `a[${p.how}]`,
        `a[${p.who}]`,
        `a[${p.about}]`,
        `a[${p.contact}]`,
        `a[${p.contact}]`,
        '#lang-button',
      ])
      await expect(page.locator('[data-header-cta] a')).toHaveAttribute('href', p.contact)
    })

    test(`mobile header Tab order (${locale}): skip link, logo, language button, menu button, then the menu panel`, async ({ page }) => {
      test.skip(isDesktop(page), 'mobile header (<1160px)')
      await page.goto(p.home)
      await hydrated(page)
      // Visual order left to right: logo, language button, menu button.
      expect(await tabs(page, 4)).toEqual(['a[#main]', `a[${p.home}]`, '#lang-button', '#menu-button'])
      await page.keyboard.press('Enter')
      await expect(page.locator('#menu-button')).toHaveAttribute('aria-expanded', 'true')
      await expect(page.locator('#mobile-menu')).toBeVisible()
      // The panel opens below the bar and comes next in the Tab order.
      const next = await tabs(page, 2)
      for (const stop of next) expect(stop).toMatch(/^(a\[\/|#services)/)
      expect(await page.evaluate(() => document.querySelector('#mobile-menu')!.contains(document.activeElement))).toBe(true)
      await page.keyboard.press('Escape')
      await expect(page.locator('#menu-button')).toHaveAttribute('aria-expanded', 'false')
      await expect(page.locator('#mobile-menu')).toBeHidden()
      await expect(page.locator('#menu-button')).toBeFocused()
      await expectRing(page)
    })
  }

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
    await expectRing(page)
    await page.keyboard.press('Escape')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#services-menu')).toBeHidden()
    await expect(button).toBeFocused()
    await expectRing(page)
    // Space toggles it too.
    await page.keyboard.press('Space')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await page.keyboard.press('Space')
    await expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  test('language dropdown: Enter opens, Tab walks EN/TR/DE, tabbing out closes, Escape returns focus, Enter switches', async ({ page }) => {
    await page.goto('/')
    await hydrated(page)
    await tabTo(page, '#lang-button')
    const button = page.locator('#lang-button')
    await page.keyboard.press('Enter')
    await expect(button).toHaveAttribute('aria-expanded', 'true')
    await expect(page.locator('#lang-menu')).toBeVisible()
    expect(await tabs(page, 3)).toEqual(['a[/]', 'a[/tr]', 'a[/de]'])
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
    await expectRing(page)
    // Enter on TR follows the link.
    await page.keyboard.press('Enter')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/tr$/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'tr')
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
    await expectRing(page)
    // The honeypot (tabindex -1) is skipped. Enter on the submit button validates.
    await page.keyboard.press('Enter')
    const summary = page.locator('[data-error-summary]')
    await expect(summary).toBeFocused()
    await page.keyboard.press('Tab')
    expect(await focused(page)).toBe('a[#contact-name]')
    await expectRing(page)
    await page.keyboard.press('Enter')
    await expect(page.locator('#contact-name')).toBeFocused()
    await expectRing(page)
    // Space toggles the consent checkbox.
    await page.locator('#contact-privacy_consent').focus()
    await page.keyboard.press('Space')
    await expect(page.locator('#contact-privacy_consent')).toBeChecked()
  })
})
