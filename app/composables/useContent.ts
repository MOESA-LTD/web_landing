import { content as de } from '#content/de'
import { content as en, type ContentMap } from '#content/en'
import { content as tr } from '#content/tr'
import type { Locale, PageKey } from '#content/types'

const BY_LOCALE: Record<Locale, ContentMap> = { en, tr, de }

/**
 * The typed content of one page. `locale` defaults to the current i18n locale.
 * All locales are bundled, which keeps the call synchronous and SSR-safe.
 */
export function useContent<K extends PageKey>(key: K, locale?: Locale): ContentMap[K] {
  const active = locale ?? (useNuxtApp().$i18n.locale.value as Locale)
  return (BY_LOCALE[active] ?? en)[key]
}
