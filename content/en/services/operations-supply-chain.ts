import type { ServicePageContent } from '../service-page'

/** Verbatim from MOESA_Website_Package_v1.0/content/en/services__operations-supply-chain.md */
const content: ServicePageContent = {
  meta: {
    path: '/services/operations-supply-chain',
    title: 'International Operations & Supply Chain Services | MOESA Ltd.',
    description: 'MOESA coordinates purchasing, production follow-up, documentation, international logistics, import operations, warehousing, inventory and delivery.',
  },
  slug: 'operations-supply-chain',
  hero: {
    title: 'From purchase order to destination.',
    body: 'MOESA coordinates the operational process across purchasing, production, product documentation, international logistics, import, warehousing, inventory and delivery.',
  },
  intro: {
    title: 'A commercial agreement still requires operational execution.',
    body: 'After the product, supplier and purchasing conditions have been agreed, the project must move through production, documentation, shipment, import, storage and delivery. MOESA connects these stages in one operating view.',
  },
  typicalMandates: {
    title: 'Typical mandates',
    items: [
      'Manage production after purchase',
      'Coordinate international delivery',
      'Build an import and warehousing structure',
      'Manage recurring supply operations',
      'Consolidate multiple suppliers',
    ],
  },
  manages: {
    title: 'What MOESA manages',
    items: [
      'Commercial handover',
      'Purchase-order coordination',
      'Production planning and follow-up',
      'Quality and documentation coordination',
      'Shipment readiness',
      'International logistics',
      'Import and customs coordination',
      'Warehousing and inbound operations',
      'Inventory and replenishment coordination',
      'Final delivery',
    ],
  },
  flow: {
    title: 'End-to-end operating flow',
    steps: [
      'Commercial Approval',
      'Purchase Order',
      'Production',
      'Product and Document Checks',
      'Shipment Readiness',
      'International Logistics',
      'Import Coordination',
      'Warehousing',
      'Inventory',
      'Delivery',
    ],
  },
  visibility: {
    title: 'Operational visibility',
    items: [
      'Current status',
      'Next milestone',
      'Open decisions',
      'Required client action',
      'Supplier action',
      'Risk or delay',
      'Estimated completion',
      'Supporting documents',
    ],
  },
  exceptions: {
    title: 'Exception management',
    body: 'MOESA coordinates facts, responsible parties, communication, escalation, decisions and corrective follow-up. Third-party delays or losses cannot be guaranteed against.',
  },
  legalBoundary: {
    title: 'Legal-role boundary',
    body: 'MOESA does not automatically assume the legal role of importer, customs declarant, responsible economic operator or contracting purchaser. These roles are defined separately for each transaction.',
  },
  finalCta: {
    title: 'Where does the product need to go?',
    body: 'Tell us the product, supplier, origin, destination and operational challenge. We will help structure the process from order to delivery.',
    cta: {
      label: 'Discuss an Operations Project',
      href: '/contact?service=operations-supply-chain',
    },
  },
}

export default content
