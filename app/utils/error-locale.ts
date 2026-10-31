import type { Locale } from '#content/types'

/**
 * The locale of an error page, from the requested path: `/tr` and `/tr/*` are TR, every other path is EN
 * (so `/tracking` stays EN). With TR disabled everything is EN.
 */
export function errorLocale(path: string, options: { enableTr?: boolean } = {}): Locale {
  if (options.enableTr === false) return 'en'
  return path === '/tr' || path.startsWith('/tr/') ? 'tr' : 'en'
}
