import type { Locale, PageMeta } from '#content/types'
import { buildPageSeo } from '~~/i18n/seo'

/**
 * Title, description, self-referencing canonical, hreflang alternates (en, tr, de, x-default = EN; a disabled
 * locale is left out),
 * OG and Twitter tags, and `<html lang>` for the current locale. `meta.path` is the EN path.
 */
export function usePageSeo(meta: PageMeta) {
  const nuxtApp = useNuxtApp()
  const locale = nuxtApp.$i18n.locale.value as Locale
  // unhead types an `alternate` link as a feed (it wants `type`); hreflang alternates are valid without it.
  useHead(buildPageSeo(meta, locale, useLocaleOptions()) as Parameters<typeof useHead>[0])
}
