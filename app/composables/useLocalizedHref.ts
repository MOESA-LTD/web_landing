import type { Locale } from '#content/types'
import { localizeHref } from '~~/i18n/routes'

/**
 * Map an EN path (with optional query and hash) to the current locale's path.
 * Unknown paths and external URLs are returned unchanged. The mapping lives in `localizeHref`.
 */
export function useLocalizedHref(href: string): string {
  const { $i18n } = useNuxtApp()
  return localizeHref(href, $i18n.locale.value as Locale)
}
