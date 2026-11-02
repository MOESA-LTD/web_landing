import type { FinalCtaContent, HeroContent, PageMeta, Section, ServiceSlug, TextSection } from '../types'

/** One line of the engagement selection guide: `need → target`. */
export interface GuideRow {
  need: string
  target: string
  /** The service the row points to (structural, not copy). The last row has none. */
  service?: ServiceSlug
}

export interface WhoWeWorkWithContent {
  meta: PageMeta
  hero: HeroContent
  /** "Start with the business need, not a predefined package." */
  intro: TextSection
  /** Five audiences: `body` + `items`. TR also keeps its approved running sentence in `condensed`. */
  audiences: Section[]
  seekingBrands: TextSection
  /** EN "Businesses without a full internal procurement team"; TR "Dış kaynaklı satın alma". */
  noInternalProcurement: TextSection
  selectionGuide: { title: string; rows: GuideRow[] }
  notSure: TextSection
  finalCta: FinalCtaContent
}

/** Verbatim from MOESA_Website_Package_v1.0/content/en/who-we-work-with.md */
const content: WhoWeWorkWithContent = {
  meta: {
    path: '/who-we-work-with',
    title: 'Who We Work With | MOESA Ltd.',
    description: 'MOESA works with corporate buyers, retailers, wholesalers, distributors, brands, manufacturers and digital commerce businesses across sourcing, product development and operations.',
  },
  hero: {
    title: 'Different business models. One coordinated operating partner.',
    body: 'MOESA works with companies that need products, suppliers, procurement capacity, private-label development, market access or continuing commercial operations.',
  },
  intro: {
    title: 'Start with the business need, not a predefined package.',
    body: 'A retail group, manufacturer, distributor and digital commerce business may require different commercial structures. MOESA begins with the client’s objective and structures the appropriate operating model around it.',
  },
  audiences: [
    {
      title: 'Retail Groups & Corporate Buyers',
      body: 'For retail groups, chain-store organisations, hospitality companies, healthcare and care organisations, facility-management companies, industrial buyers, service groups and procurement departments.',
      items: [
        'Category and assortment development',
        'Private-label portfolios',
        'Managed procurement',
        'Multi-supplier coordination',
        'Continuity of supply',
        'International logistics and delivery',
      ],
    },
    {
      title: 'Wholesalers & Distributors',
      body: 'For national or regional distributors, category specialists, importers, B2B suppliers, cash-and-carry operators and multi-brand portfolio businesses.',
      items: [
        'International brand sourcing',
        'Portfolio expansion',
        'Commercial and territory agreements',
        'Exclusive or own-brand products',
        'Purchasing and logistics',
        'Inventory and replenishment',
      ],
    },
    {
      title: 'Brands & Brand Owners',
      body: 'For established brands, new brand owners, private-label businesses, marketplace-native brands, D2C brands and corporate-owned product brands.',
      items: [
        'New product and category development',
        'Product-family architecture',
        'Supplier and manufacturer coordination',
        'Packaging and positioning',
        'Commerce operations',
        'Customer-feedback and portfolio improvement',
      ],
    },
    {
      title: 'Manufacturers',
      body: 'For finished-goods manufacturers, OEM and private-label producers, component suppliers and export-focused manufacturers seeking European buyers or operations.',
      items: [
        'European market entry',
        'Distributor and retailer development',
        'Commercial representation',
        'Market-specific portfolio preparation',
        'Import, warehousing and local operations',
      ],
    },
    {
      title: 'Digital Commerce Businesses',
      body: 'For Amazon operators, multi-marketplace businesses, D2C brands, online retailers, omnichannel companies and cross-border e-commerce operators.',
      items: [
        'Product sourcing and private label',
        'Listing and catalog operations',
        'Marketplace and D2C management',
        'Inventory and replenishment',
        'Performance and customer intelligence',
      ],
    },
  ],
  seekingBrands: {
    title: 'Buyers seeking international brands',
    body: 'A client may already know the brand or product it wants to buy. MOESA identifies the relevant commercial party, initiates contact and coordinates sourcing, negotiation and purchasing.',
  },
  noInternalProcurement: {
    title: 'Businesses without a full internal procurement team',
    body: 'MOESA can operate as an external procurement and product-operations function within a defined mandate while the client retains strategy, budget and approvals.',
  },
  selectionGuide: {
    title: 'Engagement selection guide',
    rows: [
      {
        need: 'Need a specific brand or supplier',
        target: 'Sourcing & Managed Procurement',
        service: 'sourcing-managed-procurement',
      },
      {
        need: 'Need a product or category under your own brand',
        target: 'Product & Private Label Development',
        service: 'product-private-label-development',
      },
      {
        need: 'Need European buyers or local representation',
        target: 'Market Access & Commercial Representation',
        service: 'market-access-commercial-representation',
      },
      {
        need: 'Need production, logistics, inventory or delivery',
        target: 'Operations & Supply Chain',
        service: 'operations-supply-chain',
      },
      {
        need: 'Need marketplace, D2C, catalog or performance management',
        target: 'Digital Commerce & Commercial Intelligence',
        service: 'digital-commerce-commercial-intelligence',
      },
      {
        need: 'Need several connected functions',
        target: 'Integrated Operations Partnership',
      },
    ],
  },
  notSure: {
    title: 'Not sure yet?',
    body: 'Describe the business problem, current position and desired result. MOESA can help identify the correct starting point without forcing the project into an unnecessary service package.',
  },
  finalCta: {
    title: 'Which business objective are you working on?',
    body: 'Tell us the current situation and the result you want. We will help identify the appropriate partnership model.',
    cta: {
      label: 'Discuss Your Business Need',
      href: '/contact',
    },
  },
}

export default content
