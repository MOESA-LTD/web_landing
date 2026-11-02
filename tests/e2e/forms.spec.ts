import { expect, test, type Page, type Route } from '@playwright/test'

/**
 * The contact form in the browser, against the production build. Every browser request to /api/contact is
 * intercepted with page.route, so no test can ever send a real email. The two direct API checks at the end post
 * invalid payloads only (rejected by validation before Turnstile or Resend).
 */

/** Resolves once Vue has mounted (and hydrated) the app; a click before that would submit the plain HTML form. */
async function hydrated(page: Page) {
  await page.waitForFunction(() => Boolean((document.querySelector('#__nuxt') as { __vue_app__?: unknown } | null)?.__vue_app__))
}

/** Intercepts /api/contact; records the posted JSON bodies. */
async function mockApi(page: Page, reply: (route: Route) => Promise<void> = (r) => r.fulfill({ json: { ok: true } })) {
  const bodies: Record<string, unknown>[] = []
  await page.route('**/api/contact', async (route) => {
    const data = route.request().postData()
    try {
      bodies.push(JSON.parse(data ?? '{}'))
    } catch {
      bodies.push({ raw: data })
    }
    await reply(route)
  })
  return bodies
}

const VALID = {
  name: 'Ada Lovelace',
  company: 'Analytical Ltd',
  work_email: 'ada@analytical.example',
  country: 'Bulgaria',
  project_brief: 'We need a supplier for kitchen textiles in the EU.',
}

async function fillValid(page: Page, service = 'Operations & Supply Chain') {
  for (const [name, value] of Object.entries(VALID)) await page.locator(`[name="${name}"]`).fill(value)
  await page.locator('select[name="service"]').selectOption(service)
  await page.locator('input[name="privacy_consent"]').check()
}

test.describe('contact form', () => {
  test('an empty submit shows the focused error summary with links to the 7 fields', async ({ page }) => {
    const bodies = await mockApi(page)
    await page.goto('/contact')
    await hydrated(page)
    await page.getByRole('button', { name: 'Send Project Brief' }).click()
    const summary = page.locator('[data-error-summary]')
    await expect(summary).toBeVisible()
    await expect(summary).toBeFocused()
    await expect(summary.locator('p').first()).toHaveText('Please check 7 fields')
    await expect(summary.locator('a')).toHaveCount(7)
    await expect(page.locator('[name="name"]')).toHaveAttribute('aria-invalid', 'true')
    // A summary link moves focus to its field.
    await summary.getByRole('link', { name: 'Enter your country.' }).click()
    await expect(page.locator('[name="country"]')).toBeFocused()
    expect(bodies).toHaveLength(0)
  })

  test('the service deep link preselects the option (EN and TR), an unknown slug does not', async ({ page }) => {
    await page.goto('/contact?service=operations-supply-chain')
    await expect(page.locator('select[name="service"]')).toHaveValue('Operations & Supply Chain')
    await page.goto('/tr/iletisim?service=digital-commerce-commercial-intelligence')
    await expect(page.locator('select[name="service"]')).toHaveValue('Digital Commerce Operations')
    await expect(page.locator('select[name="service"] option:checked')).toHaveText('Digital commerce')
    await page.goto('/contact?service=bogus')
    await hydrated(page)
    await expect(page.locator('select[name="service"]')).toHaveValue('')
  })

  test('the service CTA on a service page lands on the form with the service preselected', async ({ page }) => {
    await page.goto('/services/sourcing-managed-procurement')
    await hydrated(page)
    await page.locator('main a[href="/contact?service=sourcing-managed-procurement"]').first().click()
    await expect(page).toHaveURL(/\/contact\?service=sourcing-managed-procurement$/)
    await expect(page.locator('select[name="service"]')).toHaveValue('Brand or Product Sourcing')
  })

  test('a valid submit (API mocked) posts JSON and lands on /thank-you', async ({ page }) => {
    const bodies = await mockApi(page)
    await page.goto('/contact')
    await hydrated(page)
    await fillValid(page)
    await page.getByRole('button', { name: 'Send Project Brief' }).click()
    await expect(page).toHaveURL(/\/thank-you$/)
    await expect(page.locator('h1')).toHaveText('Thank you. Your project brief has been received.')
    expect(bodies).toHaveLength(1)
    expect(bodies[0]).toMatchObject({ ...VALID, service: 'Operations & Supply Chain', privacy_consent: 'on', locale: 'en', website: '' })
  })

  test('TR: a valid submit sends the EN service value and lands on /tr/tesekkurler', async ({ page }) => {
    const bodies = await mockApi(page)
    await page.goto('/tr/iletisim')
    await hydrated(page)
    await fillValid(page, 'Market Access')
    await expect(page.locator('select[name="service"] option:checked')).toHaveText('Pazara giriş')
    await page.getByRole('button', { name: 'Proje Briefini Gönder' }).click()
    await expect(page).toHaveURL(/\/tr\/tesekkurler$/)
    expect(bodies[0]).toMatchObject({ service: 'Market Access', locale: 'tr' })
  })

  test('DE: a valid submit sends the EN service value and lands on /de/danke', async ({ page }) => {
    const bodies = await mockApi(page)
    await page.goto('/de/kontakt')
    await hydrated(page)
    await fillValid(page, 'Market Access')
    await expect(page.locator('select[name="service"] option:checked')).toHaveText('Marktzugang')
    await page.getByRole('button', { name: 'Projektbriefing senden' }).click()
    await expect(page).toHaveURL(/\/de\/danke$/)
    await expect(page.locator('h1')).toHaveText('Vielen Dank. Ihr Projektbriefing ist eingegangen.')
    expect(bodies[0]).toMatchObject({ service: 'Market Access', locale: 'de' })
  })

  test('DE: an empty submit shows the German error summary; ?error=1 shows the German generic error', async ({ page }) => {
    await page.goto('/de/kontakt')
    await hydrated(page)
    await page.getByRole('button', { name: 'Projektbriefing senden' }).click()
    await expect(page.locator('[data-error-summary]')).toContainText('Bitte prüfen Sie 7 Felder')
    await expect(page.locator('[data-error-summary]')).toContainText('Geben Sie Ihren Namen ein.')
    await page.goto('/de/kontakt?error=1')
    await expect(page.locator('[data-error-summary]')).toContainText('Einige Angaben konnten nicht angenommen werden.')
  })

  test('BG: a valid submit sends the EN service value and lands on /bg/blagodarim', async ({ page }) => {
    const bodies = await mockApi(page)
    await page.goto('/bg/kontakti')
    await hydrated(page)
    await fillValid(page, 'Market Access')
    await expect(page.locator('select[name="service"] option:checked')).toHaveText('Достъп до пазари')
    await page.getByRole('button', { name: 'Изпратете описание на проекта' }).click()
    await expect(page).toHaveURL(/\/bg\/blagodarim$/)
    await expect(page.locator('h1')).toHaveText('Благодарим Ви. Описанието на Вашия проект е получено.')
    expect(bodies[0]).toMatchObject({ service: 'Market Access', locale: 'bg' })
  })

  test('BG: an empty submit shows the Bulgarian error summary; ?error=1 shows the Bulgarian generic error', async ({ page }) => {
    await page.goto('/bg/kontakti')
    await hydrated(page)
    await page.getByRole('button', { name: 'Изпратете описание на проекта' }).click()
    await expect(page.locator('[data-error-summary]')).toContainText('Моля, проверете 7 полета')
    await expect(page.locator('[data-error-summary]')).toContainText('Въведете Вашето име.')
    await page.goto('/bg/kontakti?error=1')
    await expect(page.locator('[data-error-summary]')).toContainText('Някои от данните не могат да бъдат приети.')
  })

  test('the BG service deep link preselects the EN option value', async ({ page }) => {
    await page.goto('/bg/kontakti?service=operations-supply-chain')
    await hydrated(page)
    await expect(page.locator('select[name="service"]')).toHaveValue('Operations & Supply Chain')
    await expect(page.locator('select[name="service"] option:checked')).toHaveText('Операции и верига на доставки')
  })

  test('the DE service deep link preselects the EN option value', async ({ page }) => {
    await page.goto('/de/kontakt?service=operations-supply-chain')
    await hydrated(page)
    await expect(page.locator('select[name="service"]')).toHaveValue('Operations & Supply Chain')
    await expect(page.locator('select[name="service"] option:checked')).toHaveText('Operations & Lieferkette')
  })

  test('server error codes (422) are shown as texts; a 429 shows the rate-limit message', async ({ page }) => {
    let status = 422
    await mockApi(page, (r) =>
      r.fulfill(status === 422 ? { status, json: { errors: { work_email: 'invalid_email' } } } : { status, json: { error: 'rate_limited' } }),
    )
    await page.goto('/contact')
    await hydrated(page)
    await fillValid(page)
    await page.getByRole('button', { name: 'Send Project Brief' }).click()
    const summary = page.locator('[data-error-summary]')
    await expect(summary).toContainText('Please check 1 field')
    await expect(summary).toContainText('Enter a work email address, like name@company.com.')
    await expect(page.locator('[name="work_email"]')).toHaveAttribute('aria-invalid', 'true')
    status = 429
    await page.getByRole('button', { name: 'Send Project Brief' }).click()
    await expect(summary).toContainText('Too many submissions')
    await expect(page).toHaveURL(/\/contact$/)
  })

  test('?error=1 (non-JS redirect) shows the generic error summary', async ({ page }) => {
    await page.goto('/contact?error=1')
    await expect(page.locator('[data-error-summary]')).toContainText('Some details could not be accepted.')
  })

  test('has no file input and no Turnstile script when no site key is configured', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('input[type="file"]')).toHaveCount(0)
    await expect(page.locator('script[src*="challenges.cloudflare.com"]')).toHaveCount(0)
  })

  test('the thank-you pages are noindex', async ({ page }) => {
    for (const path of ['/thank-you', '/tr/tesekkurler', '/de/danke', '/bg/blagodarim']) {
      const res = await page.goto(path)
      expect(res?.status()).toBe(200)
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/)
    }
  })
})

/**
 * A distinct client IP per direct API call, so reruns against one server never reach the rate limit. Sent as
 * X-Forwarded-For, which the e2e server trusts (CONTACT_TRUST_XFF=true in playwright.config.ts).
 */
const uniqueIp = () => ({ 'x-forwarded-for': `198.18.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` })

test.describe('POST /api/contact (server route in the build)', () => {
  test('is a live server route: an invalid JSON post gets 422 with error codes', async ({ request }) => {
    const res = await request.post('/api/contact', { data: { name: '', locale: 'en' }, headers: uniqueIp() })
    expect(res.status()).toBe(422)
    const body = await res.json()
    expect(body.errors).toMatchObject({ name: 'required', privacy_consent: 'required' })
  })

  test('an invalid non-JS form post is redirected (303) to the contact page with ?error=1', async ({ request }) => {
    const res = await request.post('/api/contact', { form: { name: '', locale: 'tr' }, maxRedirects: 0, headers: uniqueIp() })
    expect(res.status()).toBe(303)
    expect(res.headers()['location']).toBe('/tr/iletisim?error=1')
  })

  test('an invalid non-JS DE form post is redirected (303) to /de/kontakt?error=1', async ({ request }) => {
    const res = await request.post('/api/contact', { form: { name: '', locale: 'de' }, maxRedirects: 0, headers: uniqueIp() })
    expect(res.status()).toBe(303)
    expect(res.headers()['location']).toBe('/de/kontakt?error=1')
  })

  test('an invalid non-JS BG form post is redirected (303) to /bg/kontakti?error=1', async ({ request }) => {
    const res = await request.post('/api/contact', { form: { name: '', locale: 'bg' }, maxRedirects: 0, headers: uniqueIp() })
    expect(res.status()).toBe(303)
    expect(res.headers()['location']).toBe('/bg/kontakti?error=1')
  })
})
