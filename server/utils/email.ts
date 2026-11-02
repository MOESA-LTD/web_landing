/**
 * The enquiry email to MOESA: always in English, whatever the site language (`Locale: tr` / `Locale: de` / `Locale: bg` marks TR, DE and BG enquiries).
 * Every submitted value is HTML-escaped in the HTML part. The sender's address is only ever the Reply-To.
 */
import { Resend } from 'resend'
import type { ContactInput } from './contact-schema'

const DEFAULT_TO = 'info@moesaltd.com'

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Header values must not carry line breaks. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, ' ').trim()

export function composeEmail(data: ContactInput): { subject: string; text: string; html: string } {
  const rows: [string, string | undefined][] = [
    ['Name', data.name],
    ['Company', data.company],
    ['Work email', data.work_email],
    ['Country', data.country],
    ['Service', data.service],
    ['Product category', data.product_category],
    ['Target market', data.target_market],
    ['Estimated volume', data.estimated_volume],
    ['Target timeline', data.target_timeline],
    // The checkbox acknowledges the privacy policy; the enquiry is answered under Art. 6(1)(b)/(f) GDPR, not on consent.
    ['Privacy policy', 'acknowledged (details used only to respond to this enquiry)'],
  ]
  // The enquiry's UI language, for non-EN enquiries only (the email itself is always English).
  if (data.locale !== 'en') rows.push(['Locale', data.locale])
  const present = rows.filter((r): r is [string, string] => Boolean(r[1]))

  const subject = oneLine(`Project brief: ${data.company} – ${data.service}`)

  const text = [
    'New project brief from the MOESA website.',
    '',
    ...present.map(([k, v]) => `${k}: ${v}`),
    '',
    'Project brief:',
    data.project_brief,
  ].join('\n')

  const html = [
    '<p>New project brief from the MOESA website.</p>',
    ...present.map(([k, v]) => `<p style="margin:0 0 4px">${escapeHtml(k)}: ${escapeHtml(v)}</p>`),
    '<p><strong>Project brief:</strong></p>',
    `<p style="white-space:pre-wrap">${escapeHtml(data.project_brief)}</p>`,
  ].join('\n')

  return { subject, text, html }
}

export interface MailConfig {
  apiKey: string | undefined
  to: string
  from: string | undefined
}

/** Read at request time, so a deploy only needs the env vars (see .env.example). */
export function mailConfig(env: Record<string, string | undefined> = process.env): MailConfig {
  return {
    apiKey: env.RESEND_API_KEY || undefined,
    to: env.CONTACT_TO || DEFAULT_TO,
    from: env.CONTACT_FROM || undefined,
  }
}

/**
 * Send the enquiry through Resend. Throws on any failure; the caller logs it and answers with a generic code,
 * so provider details never reach the client.
 */
export async function sendContactEmail(data: ContactInput, config: MailConfig): Promise<void> {
  if (!config.apiKey) throw new Error('RESEND_API_KEY is not set')
  if (!config.from) throw new Error('CONTACT_FROM is not set')
  const mail = composeEmail(data)
  const resend = new Resend(config.apiKey)
  const { error } = await resend.emails.send({
    from: config.from,
    to: [config.to],
    replyTo: data.work_email,
    subject: mail.subject,
    text: mail.text,
    html: mail.html,
  })
  // The error name only: a provider message can quote the submitted addresses, and the caller logs this text.
  if (error) throw new Error(`Resend error: ${error.name}`)
}
