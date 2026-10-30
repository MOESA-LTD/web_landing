import type { FinalCtaContent, HeroContent, PageMeta, ServiceSlug, TextSection } from '../types'

export interface ServiceSummary {
  slug: ServiceSlug
  title: string
  summary: string
  /** EN only: the TR md gives no bullet list per service. */
  items?: string[]
}

export interface ServicesContent {
  meta: PageMeta
  hero: HeroContent
  /** The five service sections, in navigation order. */
  services: ServiceSummary[]
  /** "One service or an integrated mandate." EN only. */
  integrated?: TextSection
  finalCta: FinalCtaContent
}

/** Verbatim from MOESA_Website_Package_v1.0/content/en/services.md */
const content: ServicesContent = {
  meta: {
    path: '/services',
    title: 'Services | MOESA Ltd.',
    description: 'Explore MOESA services across international sourcing, managed procurement, product development, market access, supply chain and digital commerce operations.',
  },
  hero: {
    title: 'Connected services for international product businesses.',
    body: 'Use one service for a defined requirement or connect multiple services within a long-term operating partnership.',
  },
  services: [
    {
      slug: 'sourcing-managed-procurement',
      title: 'Sourcing & Managed Procurement',
      summary: 'International brand and product sourcing, manufacturer and supplier identification, commercial negotiation, purchasing and recurring procurement management.',
      items: [
        'Specific brand or product sourcing',
        'Alternative supplier development',
        'Outsourced procurement capacity',
        'Supplier and purchase-order management',
      ],
    },
    {
      slug: 'product-private-label-development',
      title: 'Product & Private Label Development',
      summary: 'Product concepts, product-family architecture, specifications, variations, packaging, QA and compliance coordination, and production readiness.',
      items: [
        'Individual products',
        'Private-label portfolios',
        'Existing-product adaptation',
        'Product improvement and supplier transition',
      ],
    },
    {
      slug: 'market-access-commercial-representation',
      title: 'Market Access & Commercial Representation',
      summary: 'European market preparation, commercial representation, distributor and retailer relationships, channel development and local operational coordination.',
      items: [
        'European market entry',
        'Commercial representation',
        'Distributor and retailer development',
        'International buyer representation',
      ],
    },
    {
      slug: 'operations-supply-chain',
      title: 'Operations & Supply Chain',
      summary: 'Purchasing, production follow-up, product and document coordination, international logistics, import operations, warehousing, inventory and delivery.',
      items: [
        'Single-order coordination',
        'Recurring production and logistics',
        'Multi-supplier operations',
        'Inventory and replenishment coordination',
      ],
    },
    {
      slug: 'digital-commerce-commercial-intelligence',
      title: 'Digital Commerce & Commercial Intelligence',
      summary: 'Product positioning, creative coordination, SEO, listings, catalog, marketplace and D2C operations, inventory planning, reporting and customer intelligence.',
      items: [
        'Digital launch preparation',
        'Catalog and content operations',
        'Managed marketplace or D2C operations',
        'Commercial analysis and improvement',
      ],
    },
  ],
  integrated: {
    title: 'One service or an integrated mandate.',
    body: 'A project can begin at any point. MOESA identifies what is already confirmed, what remains open and which services are actually required.',
  },
  finalCta: {
    title: 'Not sure which service fits?',
    body: 'Describe the commercial objective, current situation and main challenge. We will help structure the appropriate starting point.',
    cta: {
      label: 'Discuss a Project',
      href: '/contact',
    },
  },
}

export default content
