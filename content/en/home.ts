import type { FinalCtaContent, ListSection, PageMeta, TextSection } from '../types'

export interface HomeContent {
  meta: PageMeta
  hero: { title: string; body: string; tagline: string }
  /** "Your external product & procurement team." */
  team: { title: string; body: string; statement: string }
  operatingModel: ListSection
  businessNeeds: ListSection
  /** "You define the objective. We manage the execution." */
  process: ListSection
  partnership: ListSection
  audiences: ListSection
  capability: { title: string; paragraphs: string[] }
  euBase: TextSection
  finalCta: FinalCtaContent
}

/** Verbatim from content/approved/en/home.md */
const content: HomeContent = {
  meta: {
    path: '/',
    title: 'MOESA Ltd. | International Procurement, Product Development & Commercial Operations',
    description: 'MOESA manages international sourcing, product development, procurement, market access, supply chain and commercial operations for retailers, brands, manufacturers and businesses.',
  },
  hero: {
    title: 'From commercial objective to market-ready delivery.',
    body: 'MOESA acts as an external product, procurement and commercial operations partner for companies that want one coordinated team across sourcing, development, execution and delivery.',
    tagline: 'Based in the European Union. Operating internationally.',
  },
  team: {
    title: 'Your external product & procurement team.',
    body: 'Our partners define the commercial objective and retain the key decisions. MOESA coordinates execution across suppliers, products, procurement, market preparation, operations and delivery.',
    statement: 'One mandate. One coordinated operating partner.',
  },
  operatingModel: {
    title: 'One operating model across the commercial process.',
    items: [
      'Sourcing & Managed Procurement',
      'Product & Private Label Development',
      'Market Access & Commercial Representation',
      'Operations & Supply Chain',
      'Digital Commerce & Commercial Intelligence as a cross-functional capability',
    ],
  },
  businessNeeds: {
    title: 'Start with the business need.',
    items: [
      'Source a specific brand, product or manufacturer',
      'Develop a product or complete private-label portfolio',
      'Outsource recurring procurement operations',
      'Enter or expand in a European market',
      'Manage ongoing marketplace, D2C, catalog, inventory and performance operations',
    ],
  },
  process: {
    title: 'You define the objective. We manage the execution.',
    items: [
      'Define the commercial objective',
      'Source or develop the solution',
      'Prepare commercial, product, packaging and documentation requirements',
      'Execute purchasing, production, logistics and delivery',
      'Operate, measure and improve where required',
    ],
  },
  partnership: {
    title: 'Flexible partnership models.',
    items: [
      'Managed Procurement Partner',
      'Product Development Partner',
      'Trading Partner',
      'Market Entry & Commercial Representation Partner',
      'Managed Commerce or Integrated Operations Partner',
    ],
  },
  audiences: {
    title: 'Built for different commercial models.',
    items: [
      'Retail Groups & Corporate Buyers',
      'Wholesalers & Distributors',
      'Brands & Manufacturers',
      'Digital Commerce Businesses',
    ],
  },
  capability: {
    title: 'Commercial capability beyond sourcing.',
    paragraphs: [
      'MOESA can continue supporting the product after it reaches the warehouse - across marketplaces, direct-to-consumer websites and other digital sales channels.',
      'Digital commerce is a capability within our operating model, not a limitation on the businesses we serve.',
    ],
  },
  euBase: {
    title: 'Based in the European Union. Operating internationally.',
    body: 'MOESA Ltd. is based in Plovdiv, Bulgaria, providing an EU operating base for international sourcing, procurement, market access and commercial operations.',
  },
  finalCta: {
    title: 'Let us discuss what your business needs.',
    body: 'Whether you need to source an international brand, develop a private-label portfolio, outsource procurement or build a new commercial operation, start with the objective.',
    cta: {
      label: 'Discuss a Project',
      href: '/contact',
    },
  },
}

export default content
