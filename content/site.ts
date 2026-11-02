/**
 * Site-wide data from the approved site data (content/data/*.json). Labels here are the EN labels;
 * TR UI labels live in i18n/locales/tr.json.
 */
import brandTokens from './data/brand_tokens.json'
import contactFormJson from './data/contact_form.json'
import navigationJson from './data/navigation.json'
import type { Cta, PageKey, ServiceSlug } from './types'

export const brand = brandTokens

export const contactForm = contactFormJson

export const navigation: { primary: Cta[]; services: Cta[]; legal: Cta[] } = navigationJson

/** Service slugs in navigation order (navigation.json `services` hrefs). */
export const serviceSlugs: ServiceSlug[] = navigation.services.map(
  (s) => s.href.replace('/services/', '') as ServiceSlug,
)

export const serviceLabelBySlug = Object.fromEntries(
  navigation.services.map((s) => [s.href.replace('/services/', ''), s.label]),
) as Record<ServiceSlug, string>

/** Every page key, in page_map.json order. */
export const PAGE_KEYS: PageKey[] = [
  'home',
  'services',
  ...serviceSlugs.map((slug) => `services/${slug}` as const),
  'how-we-work',
  'who-we-work-with',
  'about',
  'contact',
  'thank-you',
  '404',
  'legal-notice',
  'privacy-policy',
  'cookie-policy',
]

/** Keys of `form.serviceOptions.*` in i18n/locales/*.json, in the order of contact_form.json `service_options`. */
export const serviceOptionKeys = [
  'sourcing',
  'procurement',
  'productPrivateLabel',
  'marketAccess',
  'commercialRepresentation',
  'operations',
  'digitalCommerce',
  'integrated',
  'notSure',
  'other',
] as const

/**
 * The project-form service options: `value` is the EN option string the API receives whatever the UI
 * locale; `key` selects the localised label in `form.serviceOptions.<key>`.
 */
export const serviceOptions = contactForm.service_options.map((value, i) => ({
  value,
  key: serviceOptionKeys[i]!,
}))
