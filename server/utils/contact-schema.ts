/**
 * Server-side validation of POST /api/contact. Every zod message is an error CODE (see shared/contact.ts);
 * the client maps codes to i18n texts, so no user-facing text lives on the server.
 */
import { z } from 'zod'
import {
  CONTACT_LOCALES,
  EMAIL_RE,
  LIMITS,
  SERVICE_OPTIONS,
  type ContactErrorCode,
  type ContactErrors,
  type ContactField,
} from '../../shared/contact'

const requiredText = (max: number) =>
  z.string({ error: 'required' }).trim().min(1, { error: 'required' }).max(max, { error: 'too_long' })

/** Optional text: an empty or missing value becomes undefined. */
const optionalText = z
  .string({ error: 'invalid' })
  .trim()
  .max(LIMITS.text, { error: 'too_long' })
  .optional()
  .transform((v) => (v ? v : undefined))

export const contactSchema = z.object({
  name: requiredText(LIMITS.text),
  company: requiredText(LIMITS.text),
  country: requiredText(LIMITS.text),
  work_email: requiredText(LIMITS.email).regex(EMAIL_RE, { error: 'invalid_email' }),
  service: z.enum(SERVICE_OPTIONS as [string, ...string[]], {
    error: (issue) => (issue.input === undefined || issue.input === '' ? 'required' : 'invalid_option'),
  }),
  project_brief: z
    .string({ error: 'required' })
    .trim()
    .min(1, { error: 'required' })
    .min(LIMITS.briefMin, { error: 'too_short' })
    .max(LIMITS.briefMax, { error: 'too_long' }),
  // Acknowledgement of the privacy policy (legal review S2), not consent: the enquiry is answered under Art. 6(1)(b)/(f).
  privacy_consent: z.union([z.literal('on'), z.literal(true)], { error: 'required' }),
  product_category: optionalText,
  target_market: optionalText,
  estimated_volume: optionalText,
  target_timeline: optionalText,
  'cf-turnstile-response': z.string({ error: 'invalid' }).max(4096, { error: 'too_long' }).optional().default(''),
  /** Honeypot: must be empty (the route drops a filled one silently before validating). */
  website: z.string({ error: 'invalid' }).max(0, { error: 'invalid' }).optional().default(''),
  locale: z.enum(CONTACT_LOCALES, { error: 'invalid' }).default('en'),
})

export type ContactInput = z.output<typeof contactSchema>

export type ContactValidation = { ok: true; data: ContactInput } | { ok: false; errors: ContactErrors }

/** Validate a raw body. The first issue of each field gives that field's code. */
export function validateContact(raw: unknown): ContactValidation {
  const result = contactSchema.safeParse(raw ?? {})
  if (result.success) return { ok: true, data: result.data }
  const errors: ContactErrors = {}
  for (const issue of result.error.issues) {
    const field = String(issue.path[0] ?? '') as ContactField
    if (!field || errors[field]) continue
    errors[field] = issue.message as ContactErrorCode
  }
  return { ok: false, errors }
}
