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
  { route: '/services', md: 'services.md', locale: 'en' },
  { route: '/tr/hizmetler', md: 'services.md', locale: 'tr' },
  { route: '/services/sourcing-managed-procurement', md: 'services__sourcing-managed-procurement.md', locale: 'en' },
  { route: '/tr/hizmetler/tedarik-ve-yonetilen-satin-alma', md: 'services__sourcing-managed-procurement.md', locale: 'tr' },
  { route: '/services/product-private-label-development', md: 'services__product-private-label-development.md', locale: 'en' },
  { route: '/tr/hizmetler/urun-ve-private-label-gelistirme', md: 'services__product-private-label-development.md', locale: 'tr' },
  { route: '/services/market-access-commercial-representation', md: 'services__market-access-commercial-representation.md', locale: 'en' },
  { route: '/tr/hizmetler/pazara-giris-ve-ticari-temsil', md: 'services__market-access-commercial-representation.md', locale: 'tr' },
  { route: '/services/operations-supply-chain', md: 'services__operations-supply-chain.md', locale: 'en' },
  { route: '/tr/hizmetler/operasyon-ve-tedarik-zinciri', md: 'services__operations-supply-chain.md', locale: 'tr' },
  { route: '/services/digital-commerce-commercial-intelligence', md: 'services__digital-commerce-commercial-intelligence.md', locale: 'en' },
  { route: '/tr/hizmetler/dijital-ticaret-ve-ticari-icgoru', md: 'services__digital-commerce-commercial-intelligence.md', locale: 'tr' },
  { route: '/how-we-work', md: 'how-we-work.md', locale: 'en' },
  { route: '/tr/nasil-calisiyoruz', md: 'how-we-work.md', locale: 'tr' },
  { route: '/who-we-work-with', md: 'who-we-work-with.md', locale: 'en' },
  { route: '/tr/kimlerle-calisiyoruz', md: 'who-we-work-with.md', locale: 'tr' },
  { route: '/about', md: 'about.md', locale: 'en' },
  { route: '/tr/hakkimizda', md: 'about.md', locale: 'tr' },
]
