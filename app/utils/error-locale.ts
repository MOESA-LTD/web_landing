import type { Locale } from '#content/types'
import { localeOfPath, type LocaleOptions } from '~~/i18n/routes'

/**
 * The locale of an error page, from the requested path: `/tr` and `/tr/*` are TR, `/de` and `/de/*` are DE, every
 * other path is EN (so `/tracking` and `/demo` stay EN). A disabled locale falls back to EN.
 */
export function errorLocale(path: string, options: LocaleOptions = {}): Locale {
  const locale = localeOfPath(path)
  if (locale === 'tr' && options.enableTr === false) return 'en'
  if (locale === 'de' && options.enableDe === false) return 'en'
  return locale
}
