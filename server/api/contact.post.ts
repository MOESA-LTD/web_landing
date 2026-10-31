/**
 * POST /api/contact: the project-brief form.
 *
 * Accepts JSON (the enhanced form, `$fetch`) and `application/x-www-form-urlencoded` (the plain HTML form without JS).
 * Order: rate limit (429) → body size cap (413) → read body → honeypot (silent drop) → validation (422) →
 * Turnstile (400) → Resend (500 on failure). The rate limit and the size cap run before the body is read.
 * JSON answers: `{ ok: true }`, `422 { errors: { field: code } }`, `413/429/400/500 { error: code }`.
 * Form posts are answered with 303: success → the locale's thank-you page; any failure → the locale's contact page
 * with `?error=1` (validation) or `?error=<code>`. Error texts live in i18n/locales; the server only sends codes.
 *
 * h3 helpers are imported explicitly (not Nitro auto-imports) so the handler also runs in a plain h3 app (unit tests).
 * Secrets come from env only (see .env.example). This route is never prerendered.
 */
import { defineEventHandler, getRequestHeader, readBody, sendRedirect, setResponseStatus, type H3Event } from 'h3'
import { ROUTES, localeOfPath } from '../../i18n/routes'
import { CONTACT_LOCALES, type ContactFailure, type ContactLocale } from '../../shared/contact'
import { validateContact } from '../utils/contact-schema'
import { mailConfig, sendContactEmail } from '../utils/email'
import { rateLimit } from '../utils/rate-limit'
import { shouldBypassTurnstile, verifyTurnstile } from '../utils/turnstile'

type Locale = ContactLocale

/** Largest accepted request body. The form's own limits (5000-char brief, 200-char fields) fit well inside it. */
const MAX_BODY_BYTES = 32 * 1024

const isDev = () => import.meta.dev === true

/**
 * Whether a locale is switched on (NUXT_PUBLIC_ENABLE_TR / NUXT_PUBLIC_ENABLE_DE, read at request time). A redirect
 * for a disabled locale goes to the EN path instead.
 */
const localeEnabled = (l: Locale) =>
  l === 'tr' ? process.env.NUXT_PUBLIC_ENABLE_TR !== 'false' : l === 'de' ? process.env.NUXT_PUBLIC_ENABLE_DE !== 'false' : true

/**
 * The client IP for the rate limit.
 * Trust: on Vercel the edge network sets `x-vercel-forwarded-for` and `x-real-ip` itself and overwrites any value the
 * client sent, so they identify the real client. The first `X-Forwarded-For` entry is client-controlled and is
 * only used when `CONTACT_TRUST_XFF=true`, i.e. behind another proxy that is documented to overwrite it.
 * Otherwise the socket address is used (direct `node .output/server` hosting).
 */
function clientIp(event: H3Event): string {
  const first = (v: string | undefined) => v?.split(',')[0]?.trim() || undefined
  return (
    first(getRequestHeader(event, 'x-vercel-forwarded-for')) ??
    first(getRequestHeader(event, 'x-real-ip')) ??
    (process.env.CONTACT_TRUST_XFF === 'true' ? first(getRequestHeader(event, 'x-forwarded-for')) : undefined) ??
    event.node?.req?.socket?.remoteAddress ??
    'unknown'
  )
}

/** Locale before the body is read (for an early 429/413 redirect): the Referer path, else EN. */
function localeFromReferer(event: H3Event): Locale {
  const ref = getRequestHeader(event, 'referer')
  if (!ref) return 'en'
  try {
    return localeOfPath(new URL(ref, 'http://x').pathname)
  } catch {
    return 'en'
  }
}

export default defineEventHandler(async (event: H3Event) => {
  const isJson = (getRequestHeader(event, 'content-type') ?? '').includes('application/json')
  const ip = clientIp(event)
  const pathLocale = (l: Locale): Locale => (localeEnabled(l) ? l : 'en')

  const fail = (status: number, code: ContactFailure, locale: Locale) => {
    if (!isJson) return sendRedirect(event, `${ROUTES.contact[pathLocale(locale)]}?error=${code}`, 303)
    setResponseStatus(event, status)
    return { error: code }
  }
  const succeed = (locale: Locale) =>
    isJson ? { ok: true } : sendRedirect(event, ROUTES['thank-you'][pathLocale(locale)], 303)

  // Before reading anything from the body: rate limit, then the size cap.
  if (!rateLimit(`contact:${ip}`, { limit: 5, windowMs: 600_000 })) return fail(429, 'rate_limited', localeFromReferer(event))
  const length = Number(getRequestHeader(event, 'content-length') ?? 0)
  if (length > MAX_BODY_BYTES) {
    setResponseStatus(event, 413)
    return { error: 'too_large' }
  }

  let body: unknown
  try {
    body = await readBody(event)
  } catch {
    body = {}
  }
  const sent = (body as { locale?: unknown } | null)?.locale
  const locale: Locale = CONTACT_LOCALES.find((l) => l === sent) ?? 'en'

  // Honeypot: bots fill the hidden `website` field. Look like a success, send nothing.
  const honeypot = (body as { website?: unknown } | null)?.website
  if (typeof honeypot === 'string' ? honeypot.trim() !== '' : honeypot != null) return succeed(locale)

  const result = validateContact(body)
  if (!result.ok) {
    if (!isJson) return sendRedirect(event, `${ROUTES.contact[pathLocale(locale)]}?error=1`, 303)
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
