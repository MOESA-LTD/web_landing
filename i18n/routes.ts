/**
 * The single source of truth for page paths in every locale.
 *
 * Plain TypeScript with no Nuxt imports: nuxt.config.ts imports it (to build the i18n `pages`
 * option) and so do the composables and the unit tests.
 *
 * EN lives at the root, TR under /tr/ with Turkish slugs, DE under /de/ with German slugs, BG under /bg/ with Bulgarian
 * slugs in Latin transliteration (the official Streamlined System: ъ → a, ц → ts, я → ya). Content files store EN paths; `localizeHref` maps them to the current locale at render time.
 */
import type { Locale, PageKey, ServiceSlug } from '../content/types'

/** Route names equal the page keys of the content layer, except for the 404 page, which is not a route. */
export type RouteName = Exclude<PageKey, '404'>

/** The path of one page in each locale. */
export type LocalePaths = Record<Locale, string>

/** Every locale, in switcher and hreflang order. EN is the default (unprefixed) locale. */
export const LOCALES: readonly Locale[] = ['en', 'tr', 'de', 'bg']

/**
 * Locale switches: `NUXT_PUBLIC_ENABLE_TR=false` / `NUXT_PUBLIC_ENABLE_DE=false` / `NUXT_PUBLIC_ENABLE_BG=false` hide
 * that locale (no prerendered routes, no switcher entry, no sitemap URL or hreflang alternate, contact redirects to EN).
 * All default to on.
 */
export interface LocaleOptions {
  enableTr?: boolean
  enableDe?: boolean
  enableBg?: boolean
}

/**
 * The locale switches as read from the environment: a locale is off only for the exact value `"false"`. Used where
 * the flags are read at request time (server/middleware/locale-guard.ts, server/api/contact.post.ts) and by
 * nuxt.config.ts at build time (prerender list, sitemap, runtimeConfig.public defaults), so the parsing never drifts.
 */
export function localeOptionsFromEnv(
  env: Record<string, string | undefined> = globalThis.process?.env ?? {},
): Required<LocaleOptions> {
  return {
    enableTr: env.NUXT_PUBLIC_ENABLE_TR !== 'false',
    enableDe: env.NUXT_PUBLIC_ENABLE_DE !== 'false',
    enableBg: env.NUXT_PUBLIC_ENABLE_BG !== 'false',
  }
}

const SWITCH: Record<Exclude<Locale, 'en'>, keyof LocaleOptions> = { tr: 'enableTr', de: 'enableDe', bg: 'enableBg' }

/** The locales that are switched on: EN always, then TR, DE and BG unless disabled. */
export function enabledLocales(options: LocaleOptions = {}): Locale[] {
  return LOCALES.filter((l) => l === 'en' || options[SWITCH[l]] !== false)
}

/**
 * The locale of `path` when that locale is switched off (`/tr/...` with `enableTr: false`, `/de/...` with
 * `enableDe: false`, `/bg/...` with `enableBg: false`), else null. Such paths answer 404 (server/middleware/locale-guard.ts).
 */
export function disabledLocaleOfPath(path: string, options: LocaleOptions): Locale | null {
  const locale = localeOfPath(path)
  return locale !== 'en' && !enabledLocales(options).includes(locale) ? locale : null
}

/**
 * The locale prefix of a path (`/tr`, `/tr/...` → tr; `/de`, `/de/...` → de; `/bg`, `/bg/...` → bg; anything else, e.g.
 * `/tracking`, → en).
 * Case- and percent-encoding-insensitive, like the router: `/DE/...` and `/%64e/...` still render the DE pages.
 */
export function localeOfPath(path: string): Locale {
  let p = path
  try {
    p = decodeURIComponent(path)
  } catch {
    // Malformed escapes: match the raw path.
  }
  p = p.toLowerCase()
  for (const l of LOCALES) if (l !== 'en' && (p === `/${l}` || p.startsWith(`/${l}/`))) return l
  return 'en'
}

export const ROUTES: Record<RouteName, LocalePaths> = {
  home: {
    en: '/',
    tr: '/tr',
    de: '/de',
    bg: '/bg',
  },
  services: {
    en: '/services',
    tr: '/tr/hizmetler',
    de: '/de/leistungen',
    bg: '/bg/uslugi',
  },
  'services/sourcing-managed-procurement': {
    en: '/services/sourcing-managed-procurement',
    tr: '/tr/hizmetler/tedarik-ve-yonetilen-satin-alma',
    de: '/de/leistungen/sourcing-und-beschaffungsmanagement',
    bg: '/bg/uslugi/sorsing-i-upravlenie-na-snabdyavaneto',
  },
  'services/product-private-label-development': {
    en: '/services/product-private-label-development',
    tr: '/tr/hizmetler/urun-ve-private-label-gelistirme',
    de: '/de/leistungen/produkt-und-private-label-entwicklung',
    bg: '/bg/uslugi/razrabotka-na-produkti-i-sobstveni-marki',
  },
  'services/market-access-commercial-representation': {
    en: '/services/market-access-commercial-representation',
    tr: '/tr/hizmetler/pazara-giris-ve-ticari-temsil',
    de: '/de/leistungen/marktzugang-und-handelsvertretung',
    bg: '/bg/uslugi/dostap-do-pazari-i-targovsko-predstavitelstvo',
  },
  'services/operations-supply-chain': {
    en: '/services/operations-supply-chain',
    tr: '/tr/hizmetler/operasyon-ve-tedarik-zinciri',
    de: '/de/leistungen/operations-und-lieferkette',
    bg: '/bg/uslugi/operatsii-i-veriga-na-dostavki',
  },
  'services/digital-commerce-commercial-intelligence': {
    en: '/services/digital-commerce-commercial-intelligence',
    tr: '/tr/hizmetler/dijital-ticaret-ve-ticari-icgoru',
    de: '/de/leistungen/digital-commerce-und-commercial-intelligence',
    bg: '/bg/uslugi/digitalna-targoviya-i-biznes-analizi',
  },
  'how-we-work': {
    en: '/how-we-work',
    tr: '/tr/nasil-calisiyoruz',
    de: '/de/so-arbeiten-wir',
    bg: '/bg/kak-rabotim',
  },
  'who-we-work-with': {
    en: '/who-we-work-with',
    tr: '/tr/kimlerle-calisiyoruz',
    de: '/de/fuer-wen-wir-arbeiten',
    bg: '/bg/s-kogo-rabotim',
  },
  about: {
    en: '/about',
    tr: '/tr/hakkimizda',
    de: '/de/ueber-uns',
    bg: '/bg/za-nas',
  },
  contact: {
    en: '/contact',
    tr: '/tr/iletisim',
    de: '/de/kontakt',
    bg: '/bg/kontakti',
  },
  'thank-you': {
    en: '/thank-you',
    tr: '/tr/tesekkurler',
    de: '/de/danke',
    bg: '/bg/blagodarim',
  },
  'privacy-policy': {
    en: '/privacy-policy',
    tr: '/tr/gizlilik-politikasi',
    de: '/de/datenschutz',
    bg: '/bg/politika-za-poveritelnost',
  },
  'cookie-policy': {
    en: '/cookie-policy',
    tr: '/tr/cerez-politikasi',
    de: '/de/cookie-richtlinie',
    bg: '/bg/politika-za-biskvitkite',
  },
  'legal-notice': {
    en: '/legal-notice',
    tr: '/tr/yasal-bildirim',
    de: '/de/impressum',
    bg: '/bg/pravna-informatsiya',
  },
}

const routeEntries = Object.entries(ROUTES) as [RouteName, LocalePaths][]

const nameByEnPath = new Map<string, RouteName>(routeEntries.map(([name, p]) => [p.en, name]))

/** The route that an EN path (no query, no hash) belongs to, or null. A trailing slash is ignored. */
export function routeNameForPath(path: string): RouteName | null {
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return nameByEnPath.get(clean) ?? null
}

const nameByLocalePath = new Map<string, RouteName>(
  routeEntries.flatMap(([name, p]) => LOCALES.map((l) => [p[l], name] as const)),
)

/** The route that a path in any locale (no query, no hash) belongs to, or null. A trailing slash is ignored. */
export function routeNameForLocalePath(path: string): RouteName | null {
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return nameByLocalePath.get(clean) ?? null
}

/**
 * Map an EN href (path, optional query and hash) to the same page in `locale`, keeping the query
 * and the hash. External URLs, `mailto:`/`tel:` links, in-page `#anchors` and unknown paths are
 * returned unchanged.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const match = /^([^?#]*)(\?[^#]*)?(#.*)?$/.exec(href)
  if (!match) return href
  const name = routeNameForPath(match[1] ?? '')
  if (!name) return href
  return ROUTES[name][locale] + (match[2] ?? '') + (match[3] ?? '')
}

/**
 * The `pages` option of @nuxtjs/i18n (`customRoutes: 'config'`), keyed by page file path relative
 * to `app/pages` without extension. Only the TR, DE and BG paths are customised, and without the locale
 * prefix (`/tr`, `/de`, `/bg`), which the `prefix_except_default` strategy adds. The home page needs no entry.
 * All five service pages share the one dynamic page `services/[slug]`.
 */
type I18nPage = Record<Exclude<Locale, 'en'>, `/${string}`>

export function buildI18nPages(): Record<string, I18nPage> {
  const pages: Record<string, I18nPage> = {}
  for (const [name, p] of routeEntries) {
    if (name === 'home' || name.startsWith('services/')) continue
    pages[p.en.slice(1)] = {
      tr: p.tr.slice('/tr'.length) as `/${string}`,
      de: p.de.slice('/de'.length) as `/${string}`,
      bg: p.bg.slice('/bg'.length) as `/${string}`,
    }
  }
  pages['services/[slug]'] = { tr: '/hizmetler/[slug]', de: '/leistungen/[slug]', bg: '/uslugi/[slug]' }
  return pages
}

const SERVICE_PREFIX = 'services/'
const lastSegment = (path: string) => path.slice(path.lastIndexOf('/') + 1)

/** The five service routes, in ROUTES order. */
const serviceRoutes = routeEntries.filter(([name]) => name.startsWith(SERVICE_PREFIX))

/**
 * The service that the `[slug]` of a service URL names in `locale`: an EN slug on an EN URL, a Turkish slug on
 * a TR URL (`/tr/hizmetler/operasyon-ve-tedarik-zinciri` → `operations-supply-chain`), a German slug on a DE URL, a
 * Bulgarian (transliterated) slug on a BG URL.
 * A slug of another locale, an unknown slug or an empty slug gives null (the page answers 404).
 */
export function serviceSlugFromLocaleSlug(locale: Locale, slug: string): ServiceSlug | null {
  if (!slug) return null
  const hit = serviceRoutes.find(([, p]) => lastSegment(p[locale]) === slug)
  return hit ? (hit[0].slice(SERVICE_PREFIX.length) as ServiceSlug) : null
}

/** The `[slug]` of a service in `locale` (the inverse of `serviceSlugFromLocaleSlug`). */
export function localeSlugForService(locale: Locale, slug: ServiceSlug): string {
  return lastSegment(ROUTES[`services/${slug}`][locale])
}

/** The paths of `names` in every enabled locale, page by page (EN, TR, DE, BG). */
const pathsIn = (names: RouteName[], options: LocaleOptions) => {
  const locales = enabledLocales(options)
  return names.flatMap((name) => locales.map((l) => ROUTES[name][l]))
}

/**
 * URLs prerendered for the services section (`nitro.prerender.routes`): the overview and the five service
 * pages in every enabled locale (EN, plus TR, DE and BG unless disabled: 24 URLs with all four).
 */
export function servicePrerenderRoutes(options: LocaleOptions): string[] {
  return pathsIn(['services', ...serviceRoutes.map(([name]) => name)], options)
}

/** URLs prerendered for the contact form: the contact and thank-you pages in every enabled locale. */
export function contactPrerenderRoutes(options: LocaleOptions): string[] {
  return pathsIn(['contact', 'thank-you'], options)
}

/** One `<url>` of the sitemap: an absolute-path `loc` and its hreflang alternates (rendered as `xhtml:link`). */
export interface SitemapUrl {
  loc: string
  alternatives: { hreflang: string; href: string }[]
}

/** Pages that are never listed in the sitemap: the thank-you page is reached after a form post only (noindex). */
const SITEMAP_EXCLUDED: RouteName[] = ['thank-you']

/**
 * The sitemap entries (`sitemap.urls`): every page except the thank-you page in every enabled locale
 * (14 per locale: 56 URLs with TR, DE and BG), each with its alternates en, tr, de, bg and x-default (= EN), the same set
 * as the page's `<link rel="alternate">` tags. A disabled locale has no URL and no alternate.
 */
export function sitemapUrls(options: LocaleOptions): SitemapUrl[] {
  const locales = enabledLocales(options)
  const names = (Object.keys(ROUTES) as RouteName[]).filter((name) => !SITEMAP_EXCLUDED.includes(name))
  return names.flatMap((name) => {
    const paths = ROUTES[name]
    const alternatives = [
      ...locales.map((l) => ({ hreflang: l, href: paths[l] })),
      { hreflang: 'x-default', href: paths.en },
    ]
    return locales.map((l) => ({ loc: paths[l], alternatives }))
  })
}
