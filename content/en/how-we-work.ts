import type { FinalCtaContent, HeroContent, ListSection, PageMeta, Section, TextSection } from '../types'

/**
 * Optional fields exist only in the EN md; the TR md is shorter (see the task 2 report).
 * Where EN has a bullet list and TR a running paragraph or an arrow line, the field is a `Section`.
 */
export interface HowWeWorkContent {
  meta: PageMeta
  hero: HeroContent
  /** "One operating model across different commercial needs." */
  intro?: TextSection
  /** "The MOESA operating flow": EN `items` (7), TR `steps` (7, from an arrow line). */
  operatingFlow: Section
  /** "Not a linear process": `steps` (8) plus the closing line in `body`. */
  nonLinear?: Section
  startAnywhere: Section
  governance: TextSection
  productTruth: TextSection
  openQuestions?: TextSection
  visibility?: ListSection
  partnershipModels: Section
  engagementLevels?: ListSection
  responsibility?: TextSection
  evolve?: TextSection
  finalCta: FinalCtaContent
}

/** Verbatim from MOESA_Website_Package_v1.0/content/en/how-we-work.md */
const content: HowWeWorkContent = {
  meta: {
    path: '/how-we-work',
    title: 'How We Work | MOESA Ltd.',
    description: 'Learn how MOESA connects sourcing, product development, procurement, market access, supply chain and digital commerce from objective to execution.',
  },
  hero: {
    title: 'You define the objective. We manage the execution.',
    body: 'MOESA connects the commercial decision with the product, supplier, market, operational and delivery requirements needed to turn it into a controlled business project.',
  },
  intro: {
    title: 'One operating model across different commercial needs.',
    body: 'A project may begin with a product, a brand, a supplier, a private-label concept, a new market or an operational challenge. The starting point may differ, but the decisions are connected.',
  },
  operatingFlow: {
    title: 'The MOESA operating flow',
    items: [
      'Define the commercial objective',
      'Source or develop the solution',
      'Prepare commercial, product, packaging and documentation requirements',
      'Approve the decisions before commitment',
      'Execute purchasing, production, logistics and delivery',
      'Operate the continuing commercial activity where required',
      'Measure, improve, reorder or expand',
    ],
  },
  nonLinear: {
    title: 'Not a linear process',
    steps: [
      'Commercial Objective',
      'Source or Develop',
      'Prepare',
      'Approve',
      'Execute',
      'Operate',
      'Measure',
      'Improve, Reorder or Expand',
    ],
    body: 'Every completed project should improve the next one.',
  },
  startAnywhere: {
    title: 'Start at any point',
    items: [
      'Commercial idea',
      'Known product or brand',
      'Existing supplier',
      'Existing product requiring improvement',
      'Active commercial operation requiring management',
    ],
  },
  governance: {
    title: 'Decision governance',
    body: 'The client retains business strategy, brand ownership, budget authority and final approvals. MOESA prepares information, coordinates work and executes within the agreed mandate.',
  },
  productTruth: {
    title: 'One controlled product truth',
    body: 'MOESA structures approved facts, decisions, open questions and supporting records so supplier, packaging, catalog and channel information remain aligned.',
  },
  openQuestions: {
    title: 'Open questions and risks',
    body: 'An open question is not a finished fact. Each unresolved matter is connected to required evidence, responsible party, target decision date and controlled update.',
  },
  visibility: {
    title: 'Project visibility',
    items: [
      'Current stage',
      'Completed actions',
      'Open decisions',
      'Required client action',
      'Supplier action',
      'Documents and samples',
      'Production or shipment status',
      'Risks and next milestone',
    ],
  },
  partnershipModels: {
    title: 'Partnership models',
    items: [
      'Managed Procurement Partner',
      'Product Development Partner',
      'Trading Partner',
      'Market Entry & Commercial Representation Partner',
      'Managed Commerce Partner',
      'Integrated Operations Partner',
    ],
  },
  engagementLevels: {
    title: 'Engagement levels',
    items: [
      'Defined Project',
      'Recurring Managed Service',
      'Integrated Partnership',
    ],
  },
  responsibility: {
    title: 'Responsibility boundary',
    body: 'MOESA coordinates the process. Legal and contractual roles remain assigned according to the product, market, transaction and agreed mandate.',
  },
  evolve: {
    title: 'Built to evolve',
    body: 'The operating model is designed for structured data, future client visibility, workflow automation and AI-assisted analysis. These are roadmap capabilities until separately confirmed as available.',
  },
  finalCta: {
    title: 'Where should we begin?',
    body: 'Tell us what is already confirmed, what remains open and what commercial result you want to achieve. We will help structure the next stage.',
    cta: {
      label: 'Discuss a Project',
      href: '/contact',
    },
  },
}

export default content
