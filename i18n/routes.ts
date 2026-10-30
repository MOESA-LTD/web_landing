/**
 * The single source of truth for page paths in both locales.
 *
 * Plain TypeScript with no Nuxt imports: nuxt.config.ts imports it (to build the i18n `pages`
 * option) and so do the composables and the unit tests.
 *
 * EN lives at the root, TR under /tr/ with Turkish slugs. Content files store EN paths;
 * `localizeHref` maps them to the current locale at render time.
 */
import type { Locale, PageKey } from '../content/types'

/** Route names equal the page keys of the content layer, except for the 404 page, which is not a route. */
export type RouteName = Exclude<PageKey, '404'>

export const ROUTES: Record<RouteName, { en: string; tr: string }> = {
  home: { en: '/', tr: '/tr' },
  services: { en: '/services', tr: '/tr/hizmetler' },
  'services/sourcing-managed-procurement': {
    en: '/services/sourcing-managed-procurement',
    tr: '/tr/hizmetler/tedarik-ve-yonetilen-satin-alma',
  },
  'services/product-private-label-development': {
    en: '/services/product-private-label-development',
    tr: '/tr/hizmetler/urun-ve-private-label-gelistirme',
  },
  'services/market-access-commercial-representation': {
    en: '/services/market-access-commercial-representation',
    tr: '/tr/hizmetler/pazara-giris-ve-ticari-temsil',
  },
  'services/operations-supply-chain': {
    en: '/services/operations-supply-chain',
    tr: '/tr/hizmetler/operasyon-ve-tedarik-zinciri',
  },
  'services/digital-commerce-commercial-intelligence': {
    en: '/services/digital-commerce-commercial-intelligence',
    tr: '/tr/hizmetler/dijital-ticaret-ve-ticari-icgoru',
  },
  'how-we-work': { en: '/how-we-work', tr: '/tr/nasil-calisiyoruz' },
  'who-we-work-with': { en: '/who-we-work-with', tr: '/tr/kimlerle-calisiyoruz' },
  about: { en: '/about', tr: '/tr/hakkimizda' },
  contact: { en: '/contact', tr: '/tr/iletisim' },
  'thank-you': { en: '/thank-you', tr: '/tr/tesekkurler' },
  'privacy-policy': { en: '/privacy-policy', tr: '/tr/gizlilik-politikasi' },
  'cookie-policy': { en: '/cookie-policy', tr: '/tr/cerez-politikasi' },
  'legal-notice': { en: '/legal-notice', tr: '/tr/yasal-bildirim' },
}

const nameByEnPath = new Map<string, RouteName>(
  (Object.entries(ROUTES) as [RouteName, { en: string; tr: string }][]).map(([name, p]) => [p.en, name]),
)

/** The route that an EN path (no query, no hash) belongs to, or null. A trailing slash is ignored. */
export function routeNameForPath(path: string): RouteName | null {
  const clean = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  return nameByEnPath.get(clean) ?? null
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
 * to `app/pages` without extension. Only the TR path is customised, and without the `/tr` locale
 * prefix, which the `prefix_except_default` strategy adds. The home page needs no entry.
 * All five service pages share the one dynamic page `services/[slug]`.
 */
export function buildI18nPages(): Record<string, { tr: string }> {
  const pages: Record<string, { tr: string }> = {}
  for (const [name, p] of Object.entries(ROUTES)) {
    if (name === 'home' || name.startsWith('services/')) continue
    pages[p.en.slice(1)] = { tr: p.tr.slice('/tr'.length) }
  }
  pages['services/[slug]'] = { tr: '/hizmetler/[slug]' }
  return pages
}
