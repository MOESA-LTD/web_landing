import type { ServicePageContent } from '../service-page'

/** Verbatim from content/approved/en/services__sourcing-managed-procurement.md */
const content: ServicePageContent = {
  meta: {
    path: '/services/sourcing-managed-procurement',
    title: 'Sourcing & Managed Procurement Services | MOESA Ltd.',
    description: 'MOESA manages international product and brand sourcing, supplier assessment, commercial negotiation, purchasing and ongoing procurement operations.',
  },
  slug: 'sourcing-managed-procurement',
  hero: {
    title: 'From sourcing mandate to managed procurement.',
    body: 'Whether you are looking for a specific international brand, a new supplier or an external team to manage recurring purchasing operations, MOESA turns the requirement into an executable procurement process.',
  },
  intro: {
    title: 'You define what the business needs. We manage how it gets sourced.',
    body: 'A sourcing project may begin with a specific brand, a known product, a target category or a commercial objective. The client retains strategic decisions and approvals; MOESA manages research, communication, negotiation and operational follow-through.',
  },
  typicalMandates: {
    title: 'Typical mandates',
    items: [
      'Source a specific international brand',
      'Find a product or manufacturer',
      'Replace or diversify a supplier',
      'Outsource recurring procurement operations',
      'Coordinate purchasing across multiple suppliers',
    ],
  },
  manages: {
    title: 'What MOESA manages',
    items: [
      'Sourcing brief and requirement structure',
      'Brand, product, manufacturer and supplier research',
      'Supplier assessment',
      'Commercial negotiation',
      'Samples and commercial feasibility',
      'Purchase-order and supplier coordination',
      'Supply-chain handover',
    ],
  },
  managedModel: {
    title: 'Managed procurement model',
    body: 'MOESA can operate as an external procurement function while the client retains strategy, budget authority, final supplier approval and final purchasing approval.',
    items: [
      'Ongoing supplier communication',
      'Purchase-order follow-up',
      'Pricing and term coordination',
      'Production-status monitoring',
      'Documentation follow-up',
      'Reorder and continuity planning',
    ],
  },
  models: {
    title: 'Engagement models',
    items: [
      'Project-Based Sourcing',
      'Managed Procurement Service',
      'Trading Arrangement',
      'Commercial Representation',
    ],
  },
  suitableFor: {
    title: 'Suitable for',
    items: [
      'Retail groups and corporate buyers',
      'Wholesalers and distributors',
      'Brands and manufacturers',
      'Digital commerce businesses',
    ],
  },
  responsibilities: {
    title: 'Clear responsibilities',
    body: 'Final business decisions, supplier approvals and purchasing authority remain with the client unless a separate trading arrangement has been agreed. Where technical or regulatory requirements apply, MOESA coordinates the workflow with the relevant parties.',
  },
  finalCta: {
    title: 'What do you need to source?',
    body: 'Tell us the product, brand, category or procurement challenge. We will help structure the next steps.',
    cta: {
      label: 'Discuss a Sourcing Project',
      href: '/contact?service=sourcing-managed-procurement',
    },
  },
}

export default content
