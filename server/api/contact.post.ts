/**
 * POST /api/contact: the project-brief form.
 *
 * Accepts JSON (the enhanced form, `$fetch`) and `application/x-www-form-urlencoded` (the plain HTML form without JS).
 * Order: rate limit → honeypot (silent drop) → validation (422) → Turnstile (400) → Resend (500 on failure).
 * JSON answers: `{ ok: true }`, `422 { errors: { field: code } }`, `429/400/500 { error: code }`.
 * Form posts are answered with 303: success → the locale's thank-you page; any failure → the locale's contact page
 * with `?error=1` (validation) or `?error=<code>`. Error texts live in i18n/locales; the server only sends codes.
 *
 * h3 helpers are imported explicitly (not Nitro auto-imports) so the handler also runs in a plain h3 app (unit tests).
 * Secrets come from env only (see .env.example). This route is never prerendered.
 */
import { defineEventHandler, getRequestHeader, getRequestIP, readBody, sendRedirect, setResponseStatus, type H3Event } from 'h3'
import { ROUTES } from '../../i18n/routes'
import type { ContactFailure } from '../../shared/contact'
import { validateContact } from '../utils/contact-schema'
import { mailConfig, sendContactEmail } from '../utils/email'
import { rateLimit } from '../utils/rate-limit'
import { shouldBypassTurnstile, verifyTurnstile } from '../utils/turnstile'

type Locale = 'en' | 'tr'

const isDev = () => import.meta.dev === true

function localeOf(body: unknown): Locale {
  return (body as { locale?: unknown } | null)?.locale === 'tr' ? 'tr' : 'en'
}

export default defineEventHandler(async (event: H3Event) => {
  const isJson = (getRequestHeader(event, 'content-type') ?? '').includes('application/json')
  const ip = getRequestIP(event, { xForwardedFor: true }) ?? 'unknown'

  const fail = (status: number, code: ContactFailure, locale: Locale) => {
    if (!isJson) return sendRedirect(event, `${ROUTES.contact[locale]}?error=${code}`, 303)
    setResponseStatus(event, status)
    return { error: code }
  }
  const succeed = (locale: Locale) => (isJson ? { ok: true } : sendRedirect(event, ROUTES['thank-you'][locale], 303))

  let body: unknown
  try {
    body = await readBody(event)
  } catch {
    body = {}
  }
  const locale = localeOf(body)

  if (!rateLimit(`contact:${ip}`, { limit: 5, windowMs: 600_000 })) return fail(429, 'rate_limited', locale)

  // Honeypot: bots fill the hidden `website` field. Look like a success, send nothing.
  const honeypot = (body as { website?: unknown } | null)?.website
  if (typeof honeypot === 'string' ? honeypot.trim() !== '' : honeypot != null) return succeed(locale)

  const result = validateContact(body)
  if (!result.ok) {
    if (!isJson) return sendRedirect(event, `${ROUTES.contact[locale]}?error=1`, 303)
    setResponseStatus(event, 422)
    return { errors: result.errors }
  }
  const data = result.data

  const bypass = shouldBypassTurnstile({ dev: isDev(), flag: process.env.CONTACT_DEV_BYPASS_TURNSTILE })
  if (!bypass) {
    const ok = await verifyTurnstile(data['cf-turnstile-response'], process.env.NUXT_TURNSTILE_SECRET_KEY, ip === 'unknown' ? undefined : ip)
    if (!ok) return fail(400, 'verification_failed', data.locale)
  }

  const config = mailConfig()
  if (isDev() && !config.apiKey) {
    // Local development without Resend: show the email in the terminal instead of sending it.
    console.info('[contact] RESEND_API_KEY not set (dev): email not sent', { to: config.to, replyTo: data.work_email, data })
    return succeed(data.locale)
  }
  try {
    await sendContactEmail(data, config)
  } catch (err) {
    console.error('[contact] sending the enquiry email failed', err)
    return fail(500, 'send_failed', data.locale)
  }
  return succeed(data.locale)
})
