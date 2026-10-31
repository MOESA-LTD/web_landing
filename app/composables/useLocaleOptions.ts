import type { LocaleOptions } from '~~/i18n/routes'

/**
 * The locale switches from the public runtime config (`NUXT_PUBLIC_ENABLE_TR`, `NUXT_PUBLIC_ENABLE_DE`; both
 * default to on), in the form the pure helpers of i18n/routes.ts and i18n/seo.ts take.
 */
export function useLocaleOptions(): Required<LocaleOptions> {
  const { enableTr, enableDe } = useRuntimeConfig().public
  return { enableTr: enableTr !== false, enableDe: enableDe !== false }
}
