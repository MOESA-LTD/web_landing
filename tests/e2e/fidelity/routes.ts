import type { FidelityLocale } from './extract'

export interface FidelityRoute {
  route: string
  /** Package md file name under content/<locale>/. */
  md: string
  locale: FidelityLocale
}

/**
 * Routes checked by content-fidelity.spec.ts against their approved md. EN pages are checked against
 * PKG/content/en and TR pages against PKG/content/tr. Page tasks append their routes here.
 */
export const FIDELITY_ROUTES: FidelityRoute[] = [
  { route: '/', md: 'home.md', locale: 'en' },
  { route: '/tr', md: 'home.md', locale: 'tr' },
]
