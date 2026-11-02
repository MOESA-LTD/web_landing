import type { ServiceSlug } from '#content/types'

/**
 * Structural links between services (not copy). The labels always come from the content modules.
 */

/** The business needs of home.md, in order: each points to the service that covers it. */
export const NEED_SERVICES: ServiceSlug[] = [
  'sourcing-managed-procurement',
  'product-private-label-development',
  'sourcing-managed-procurement',
  'market-access-commercial-representation',
  'digital-commerce-commercial-intelligence',
]

/** The two related services of each service page (the canvas's `related` pairs, i18n.js `pages.svc.*.related`). */
export const RELATED_SERVICES: Record<ServiceSlug, [ServiceSlug, ServiceSlug]> = {
  'sourcing-managed-procurement': ['product-private-label-development', 'operations-supply-chain'],
  'product-private-label-development': ['sourcing-managed-procurement', 'operations-supply-chain'],
  'market-access-commercial-representation': ['operations-supply-chain', 'digital-commerce-commercial-intelligence'],
  'operations-supply-chain': ['sourcing-managed-procurement', 'market-access-commercial-representation'],
  'digital-commerce-commercial-intelligence': ['product-private-label-development', 'operations-supply-chain'],
}

/** EN path of a service page; components localise it. */
export const serviceHref = (slug: ServiceSlug) => `/services/${slug}`
