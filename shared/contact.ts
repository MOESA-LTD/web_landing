/**
 * Contact-form rules shared by the client (ContactForm.vue) and the server (server/utils/contact-schema.ts):
 * field names, limits, error codes and the `?service=` preselect table. Plain TypeScript, no Nuxt or zod imports,
 * so the client bundle stays small. The server validates again with zod; both produce the same error codes.
 */
import contactFormJson from '../MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0/data/contact_form.json'
import type { ServiceSlug } from '../content/types'

/** The only accepted `service` values: contact_form.json `service_options` (EN), whatever the UI locale. */
export const SERVICE_OPTIONS = contactFormJson.service_options as readonly string[]

/** `?service=<slug>` → the option it preselects. Unknown slugs preselect nothing. */
export const SERVICE_SLUG_TO_OPTION: Record<ServiceSlug, string> = {
  'sourcing-managed-procurement': 'Brand or Product Sourcing',
  'product-private-label-development': 'Product & Private Label Development',
  'market-access-commercial-representation': 'Market Access',
  'operations-supply-chain': 'Operations & Supply Chain',
  'digital-commerce-commercial-intelligence': 'Digital Commerce Operations',
}

export function serviceOptionForSlug(slug: unknown): string | null {
  return typeof slug === 'string' && Object.hasOwn(SERVICE_SLUG_TO_OPTION, slug)
    ? SERVICE_SLUG_TO_OPTION[slug as ServiceSlug]
    : null
}

/** Required fields in form order (also the error-summary order). */
export const REQUIRED_FIELDS = ['name', 'company', 'work_email', 'country', 'service', 'project_brief', 'privacy_consent'] as const
export const OPTIONAL_FIELDS = ['product_category', 'target_market', 'estimated_volume', 'target_timeline'] as const
export type RequiredField = (typeof REQUIRED_FIELDS)[number]
export type OptionalField = (typeof OPTIONAL_FIELDS)[number]
export type ContactField = RequiredField | OptionalField | 'locale'

export const LIMITS = {
  text: 200,
  email: 254,
  briefMin: 10,
  briefMax: 5000,
} as const

export type ContactErrorCode = 'required' | 'invalid_email' | 'invalid_option' | 'too_short' | 'too_long' | 'invalid'
export type ContactErrors = Partial<Record<ContactField, ContactErrorCode>>

/** Error codes of a non-422 failure (JSON `{ error }`, or `?error=<code>` after a non-JS redirect). */
export type ContactFailure = 'rate_limited' | 'verification_failed' | 'send_failed'

/**
 * Pragmatic email check: one @, a dot in the domain, and no whitespace or `<>",;()`, so a display name or a second
 * address ("Name <a@b.com>", "a@b.com, c@d.com") cannot reach the Reply-To header. The server applies the same rule.
 */
export const EMAIL_RE = /^[^\s@<>",;()]+@[^\s@<>",;()]+\.[^\s@<>",;()]+$/

export const CONTACT_LOCALES = ['en', 'tr', 'de'] as const
export type ContactLocale = (typeof CONTACT_LOCALES)[number]

/**
 * Client-side validation of the visible fields, in form order. Returns error codes keyed by field; empty when valid.
 * `privacy_consent` is a boolean here (the checkbox state).
 */
export function validateContactClient(values: Record<string, string | boolean | undefined>): ContactErrors {
  const errors: ContactErrors = {}
  const str = (k: string) => (typeof values[k] === 'string' ? (values[k] as string).trim() : '')
  for (const field of REQUIRED_FIELDS) {
    if (field === 'privacy_consent') {
      if (values.privacy_consent !== true && values.privacy_consent !== 'on') errors.privacy_consent = 'required'
      continue
    }
    const v = str(field)
    if (!v) {
      errors[field] = 'required'
    } else if (field === 'work_email') {
      if (v.length > LIMITS.email) errors.work_email = 'too_long'
      else if (!EMAIL_RE.test(v)) errors.work_email = 'invalid_email'
    } else if (field === 'service') {
      if (!SERVICE_OPTIONS.includes(v)) errors.service = 'invalid_option'
    } else if (field === 'project_brief') {
      if (v.length < LIMITS.briefMin) errors.project_brief = 'too_short'
      else if (v.length > LIMITS.briefMax) errors.project_brief = 'too_long'
    } else if (v.length > LIMITS.text) {
      errors[field] = 'too_long'
    }
  }
  for (const field of OPTIONAL_FIELDS) if (str(field).length > LIMITS.text) errors[field] = 'too_long'
  return errors
}
