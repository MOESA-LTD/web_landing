import type { Locale } from '#content/types'
import { enabledLocales, localeOfPath, type LocaleOptions } from '~~/i18n/routes'

/**
 * The locale of an error page, from the requested path: `/tr` and `/tr/*` are TR, `/de` and `/de/*` are DE, `/bg` and
 * `/bg/*` are BG, every other path is EN (so `/tracking`, `/demo` and `/bgx` stay EN). A disabled locale falls back to EN.
 */
export function errorLocale(path: string, options: LocaleOptions = {}): Locale {
  const locale = localeOfPath(path)
  return enabledLocales(options).includes(locale) ? locale : 'en'
}
