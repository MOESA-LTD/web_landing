// @vitest-environment node
/**
 * POST /api/contact, run through a real h3 app (the same handler Nitro mounts). Resend and the Turnstile
 * `$fetch` (ofetch) are mocked: no real email, no network.
 */
import { createApp, toWebHandler } from 'h3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const send = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn(function (this: unknown) {
    return { emails: { send } }
  }),
}))

const fetchMock = vi.fn()
vi.mock('ofetch', () => ({ $fetch: (...args: unknown[]) => fetchMock(...args) }))

const { default: handler } = await import('../../../server/api/contact.post')
const { resetRateLimit, rateLimit } = await import('../../../server/utils/rate-limit')
const { composeEmail } = await import('../../../server/utils/email')
const { contactSchema, validateContact } = await import('../../../server/utils/contact-schema')
const { shouldBypassTurnstile } = await import('../../../server/utils/turnstile')

const app = createApp()
app.use('/api/contact', handler)
const call = toWebHandler(app)

const VALID = {
  name: 'Ada Lovelace',
  company: 'Analytical Ltd',
  work_email: 'ada@analytical.example',
  country: 'Bulgaria',
  service: 'Operations & Supply Chain',
  project_brief: 'We need a supplier for kitchen textiles in the EU.',
  privacy_consent: 'on',
  'cf-turnstile-response': 'token-ok',
  website: '',
  locale: 'en',
}

let ip = 0
/** A fresh client IP per request unless one is given, so the rate limit only bites where a test wants it. */
const nextIp = () => `10.0.0.${++ip}`

function postJson(body: unknown, clientIp = nextIp()) {
  return call(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': clientIp },
      body: JSON.stringify(body),
    }),
  )
}

function postForm(body: Record<string, string>, clientIp = nextIp()) {
  return call(
    new Request('http://localhost/api/contact', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', 'x-forwarded-for': clientIp },
      body: new URLSearchParams(body).toString(),
      redirect: 'manual',
    }),
  )
}

beforeEach(() => {
  resetRateLimit()
  send.mockReset()
  send.mockResolvedValue({ data: { id: 'email-1' }, error: null })
  fetchMock.mockReset()
  fetchMock.mockResolvedValue({ success: true })
  vi.stubEnv('RESEND_API_KEY', 're_test')
  vi.stubEnv('CONTACT_TO', 'info@moesaltd.com')
  vi.stubEnv('CONTACT_FROM', 'MOESA Website <website@mail.example>')
  vi.stubEnv('NUXT_TURNSTILE_SECRET_KEY', 'secret-test')
  vi.stubEnv('CONTACT_DEV_BYPASS_TURNSTILE', '')
})
afterEach(() => vi.unstubAllEnvs())

describe('POST /api/contact', () => {
  it('a valid JSON payload sends 1 email to CONTACT_TO with replyTo = the work email, and returns { ok: true }', async () => {
    const res = await postJson(VALID)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(send).toHaveBeenCalledTimes(1)
    const msg = send.mock.calls[0]![0]
    expect(msg.to).toEqual(['info@moesaltd.com'])
    expect(msg.replyTo).toBe('ada@analytical.example')
    expect(msg.from).toBe('MOESA Website <website@mail.example>')
    expect(msg.from).not.toContain('ada@analytical.example')
    expect(msg.subject).toBe('Project brief: Analytical Ltd – Operations & Supply Chain')
  })

  it('CONTACT_TO defaults to info@moesaltd.com', async () => {
    vi.stubEnv('CONTACT_TO', '')
    await postJson(VALID)
    expect(send.mock.calls[0]![0].to).toEqual(['info@moesaltd.com'])
  })

  it('verifies the Turnstile token with the secret and the client IP', async () => {
    await postJson(VALID, '203.0.113.9')
    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, opts] = fetchMock.mock.calls[0]!
    expect(url).toBe('https://challenges.cloudflare.com/turnstile/v0/siteverify')
    expect(opts.method).toBe('POST')
    expect(opts.body).toMatchObject({ secret: 'secret-test', response: 'token-ok', remoteip: '203.0.113.9' })
  })

  it('a form post (no JS) is answered with 303 to /thank-you', async () => {
    const res = await postForm(VALID)
    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/thank-you')
    expect(send).toHaveBeenCalledTimes(1)
  })

  it('a form post with locale=tr is answered with 303 to /tr/tesekkurler', async () => {
    const res = await postForm({ ...VALID, locale: 'tr' })
    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/tr/tesekkurler')
  })

  it('missing privacy_consent returns 422 with errors.privacy_consent', async () => {
    const { privacy_consent: _omit, ...rest } = VALID
    const res = await postJson(rest)
    expect(res.status).toBe(422)
    const body = await res.json()
    expect(body.errors.privacy_consent).toBe('required')
    expect(send).not.toHaveBeenCalled()
  })

  it('returns error codes, not texts', async () => {
    const res = await postJson({ ...VALID, name: '   ', work_email: 'not-an-email', project_brief: 'short' })
    expect(res.status).toBe(422)
    expect((await res.json()).errors).toEqual({ name: 'required', work_email: 'invalid_email', project_brief: 'too_short' })
  })

  it('a service that is not one of the options returns 422', async () => {
    const res = await postJson({ ...VALID, service: 'Space Tourism' })
    expect(res.status).toBe(422)
    expect((await res.json()).errors.service).toBe('invalid_option')
    expect(send).not.toHaveBeenCalled()
  })

  it('a TR post with a TR service label returns 422: only the EN option values are accepted', async () => {
    const res = await postJson({ ...VALID, locale: 'tr', service: 'Operasyon ve Tedarik Zinciri' })
    expect(res.status).toBe(422)
    expect((await res.json()).errors.service).toBe('invalid_option')
  })

  it('a 6000-char brief returns 422', async () => {
    const res = await postJson({ ...VALID, project_brief: 'x'.repeat(6000) })
    expect(res.status).toBe(422)
    expect((await res.json()).errors.project_brief).toBe('too_long')
  })

  it('an invalid locale returns 422', async () => {
    const res = await postJson({ ...VALID, locale: 'de' })
    expect(res.status).toBe(422)
    expect((await res.json()).errors.locale).toBeDefined()
  })

  it('a non-JS post with validation errors is redirected (303) to the locale contact page with ?error=1', async () => {
    const en = await postForm({ ...VALID, name: '' })
    expect(en.status).toBe(303)
    expect(en.headers.get('location')).toBe('/contact?error=1')
    const tr = await postForm({ ...VALID, name: '', locale: 'tr' })
    expect(tr.headers.get('location')).toBe('/tr/iletisim?error=1')
    expect(send).not.toHaveBeenCalled()
  })

  it('a filled honeypot returns 303 to thank-you but sends no email (silent drop)', async () => {
    const res = await postForm({ ...VALID, website: 'https://spam.example' })
    expect(res.status).toBe(303)
    expect(res.headers.get('location')).toBe('/thank-you')
    expect(send).not.toHaveBeenCalled()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('a filled honeypot in JSON looks like a success and sends no email', async () => {
    const res = await postJson({ ...VALID, website: 'x' })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
    expect(send).not.toHaveBeenCalled()
  })

  it('a failed Turnstile check returns 400 and sends no email', async () => {
    fetchMock.mockResolvedValue({ success: false, 'error-codes': ['invalid-input-response'] })
    const res = await postJson(VALID)
    expect(res.status).toBe(400)
    expect(await res.json()).toEqual({ error: 'verification_failed' })
    expect(send).not.toHaveBeenCalled()
  })

  it('a missing Turnstile token returns 400 without calling Cloudflare', async () => {
    const res = await postJson({ ...VALID, 'cf-turnstile-response': '' })
    expect(res.status).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })

  it('a Turnstile network error returns 400 and sends no email', async () => {
    fetchMock.mockRejectedValue(new Error('network down'))
    const res = await postJson(VALID)
    expect(res.status).toBe(400)
    expect(send).not.toHaveBeenCalled()
  })

  it('the dev bypass env is ignored outside `nuxt dev` (a missing token is still rejected)', async () => {
    vi.stubEnv('CONTACT_DEV_BYPASS_TURNSTILE', 'true')
    const res = await postJson({ ...VALID, 'cf-turnstile-response': '' })
    expect(res.status).toBe(400)
  })

  it('the 6th request from the same IP within 10 minutes returns 429', async () => {
    for (let i = 0; i < 5; i++) expect((await postJson(VALID, '198.51.100.7')).status).toBe(200)
    const sixth = await postJson(VALID, '198.51.100.7')
    expect(sixth.status).toBe(429)
    expect(await sixth.json()).toEqual({ error: 'rate_limited' })
    expect(send).toHaveBeenCalledTimes(5)
    // Another IP is unaffected.
    expect((await postJson(VALID, '198.51.100.8')).status).toBe(200)
  })

  it('a Resend error is logged server-side but never exposed to the client', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    send.mockResolvedValue({ data: null, error: { name: 'validation_error', message: 'secret provider detail re_123' } })
    const res = await postJson(VALID)
    expect(res.status).toBe(500)
    const text = await res.text()
    expect(text).not.toContain('secret provider detail')
    expect(JSON.parse(text)).toEqual({ error: 'send_failed' })
    expect(log).toHaveBeenCalled()
    log.mockRestore()
  })

  it('a thrown Resend error is handled the same way', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {})
    send.mockRejectedValue(new Error('boom re_secret'))
    const res = await postJson(VALID)
    expect(res.status).toBe(500)
    expect(await res.text()).not.toContain('re_secret')
    log.mockRestore()
  })
})

describe('rateLimit', () => {
  it('allows 5 hits per window, then blocks, then allows again after the window', () => {
    const opts = { limit: 5, windowMs: 600_000 } as const
    const t0 = 1_000_000
    for (let i = 0; i < 5; i++) expect(rateLimit('k', opts, t0 + i)).toBe(true)
    expect(rateLimit('k', opts, t0 + 10)).toBe(false)
    expect(rateLimit('k', opts, t0 + 600_001)).toBe(true)
  })
})

describe('composeEmail', () => {
  const data = contactSchema.parse(VALID)

  it('escapes <script> in name', () => {
    const mail = composeEmail({ ...data, name: '<script>alert(1)</script>' })
    expect(mail.html).not.toContain('<script>')
    expect(mail.html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;')
  })

  it('escapes every value in the HTML', () => {
    const mail = composeEmail({ ...data, company: 'A & "B"', project_brief: "<b>bold</b> it's" })
    expect(mail.html).toContain('A &amp; &quot;B&quot;')
    expect(mail.html).toContain('&lt;b&gt;bold&lt;/b&gt; it&#39;s')
  })

  it('has the subject `Project brief: ${company} – ${service}`', () => {
    expect(composeEmail(data).subject).toBe('Project brief: Analytical Ltd – Operations & Supply Chain')
  })

  it('is in English and says `Locale: tr` only for TR enquiries', () => {
    const en = composeEmail(data)
    expect(en.text).toContain('Name: Ada Lovelace')
    expect(en.text).toContain('Service: Operations & Supply Chain')
    expect(en.text).not.toContain('Locale: tr')
    const tr = composeEmail({ ...data, locale: 'tr' })
    expect(tr.text).toContain('Locale: tr')
    expect(tr.html).toContain('Locale: tr')
  })

  it('lists the optional fields only when given', () => {
    expect(composeEmail(data).text).not.toContain('Product category')
    const mail = composeEmail({ ...data, product_category: 'Textiles' })
    expect(mail.text).toContain('Product category: Textiles')
  })
})

describe('contactSchema', () => {
  it('trims and accepts privacy_consent true (JSON) as well as "on" (form)', () => {
    const parsed = contactSchema.parse({ ...VALID, name: '  Ada  ', privacy_consent: true })
    expect(parsed.name).toBe('Ada')
  })

  it('rejects names over 200 chars and optional fields over 200 chars', () => {
    const r = validateContact({ ...VALID, name: 'n'.repeat(201), target_market: 'm'.repeat(201) })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.errors).toEqual({ name: 'too_long', target_market: 'too_long' })
  })

  it('reports all 7 required fields on an empty payload', () => {
    const r = validateContact({})
    expect(r.ok).toBe(false)
    if (!r.ok)
      expect(Object.keys(r.errors).sort()).toEqual(
        ['company', 'country', 'name', 'privacy_consent', 'project_brief', 'service', 'work_email'],
      )
  })
})

describe('shouldBypassTurnstile', () => {
  it('only bypasses in dev with the explicit env flag', () => {
    expect(shouldBypassTurnstile({ dev: true, flag: 'true' })).toBe(true)
    expect(shouldBypassTurnstile({ dev: false, flag: 'true' })).toBe(false)
    expect(shouldBypassTurnstile({ dev: true, flag: undefined })).toBe(false)
  })
})
