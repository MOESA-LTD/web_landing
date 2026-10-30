/**
 * Pure head builder for `usePageSeo`: title, description, canonical, hreflang alternates and
 * OG/Twitter tags for one page in one locale. Plain TypeScript so it is unit-testable.
 */
import type { Locale, PageMeta } from '../content/types'
import { localizeHref, routeNameForPath } from './routes'

export const SITE_ORIGIN = 'https://www.moesaltd.com'
export const SITE_NAME = 'MOESA Ltd.'
export const OG_IMAGE = `${SITE_ORIGIN}/og-default.png`

export interface SeoMeta {
  name?: string
  property?: string
  content: string
}

export interface SeoLink {
  rel: string
  href: string
  hreflang?: string
}

export interface SeoHead {
  title: string
  htmlAttrs: { lang: Locale }
  meta: SeoMeta[]
  link: SeoLink[]
}

/**
 * @param meta     the page meta, where `path` is the EN path
 * @param locale   the locale the page is rendered in (self-referencing canonical)
 * @param options  `enableTr: false` drops the TR alternate
 *
 * A path that is not a route (the 404 page) gets no canonical, no alternates and no og:url.
 */
export function buildPageSeo(
  meta: PageMeta,
  locale: Locale,
  options: { enableTr?: boolean } = {},
): SeoHead {
  const enableTr = options.enableTr ?? true
  const known = routeNameForPath(meta.path) !== null
  const urlFor = (l: Locale) => SITE_ORIGIN + localizeHref(meta.path, l)
  const canonical = urlFor(locale)

  const tags: SeoMeta[] = [
    { name: 'description', content: meta.description },
    { property: 'og:title', content: meta.title },
    { property: 'og:description', content: meta.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:image', content: OG_IMAGE },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.title },
    { name: 'twitter:description', content: meta.description },
    { name: 'twitter:image', content: OG_IMAGE },
  ]
  if (known) tags.splice(4, 0, { property: 'og:url', content: canonical })

  const link: SeoLink[] = []
  if (known) {
    link.push({ rel: 'canonical', href: canonical })
    link.push({ rel: 'alternate', hreflang: 'en', href: urlFor('en') })
    if (enableTr) link.push({ rel: 'alternate', hreflang: 'tr', href: urlFor('tr') })
    link.push({ rel: 'alternate', hreflang: 'x-default', href: urlFor('en') })
  }

  return { title: meta.title, htmlAttrs: { lang: locale }, meta: tags, link }
}
