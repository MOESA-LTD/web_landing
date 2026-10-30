import type { FinalCtaContent, HeroContent, ListSection, PageMeta, Section, TextSection } from '../types'

export interface AboutContent {
  meta: PageMeta
  hero: HeroContent
  whoWeAre: TextSection
  manages: ListSection
  /** `items`; TR also keeps its approved running sentence in `condensed`. */
  why: Section
  principles: ListSection
  experience: TextSection
  europeanBase: TextSection
  /** "What MOESA is not": `items`; TR also keeps its approved running sentence in `condensed`. */
  isNot: Section
  direction: TextSection
  finalCta: FinalCtaContent
}

/** Verbatim from MOESA_Website_Package_v1.0/content/en/about.md */
const content: AboutContent = {
  meta: {
    path: '/about',
    title: 'About MOESA Ltd. | International Procurement & Product Operations',
    description: 'Learn about MOESA Ltd., a Bulgaria-based international procurement, product development and commercial operations partner serving international businesses.',
  },
  hero: {
    title: 'An external product, procurement and commercial operations team.',
    body: 'MOESA Ltd. is based in Plovdiv, Bulgaria, and works with international businesses across sourcing, product development, market access, supply chain and digital commerce.',
  },
  whoWeAre: {
    title: 'Who we are',
    body: 'MOESA combines international trade, product development, procurement, operational execution and market experience within one coordinated company model. We support defined projects as well as long-term external operating functions.',
  },
  manages: {
    title: 'What we manage',
    items: [
      'International brand and product sourcing',
      'Managed procurement',
      'Product and private-label development',
      'Market access and commercial representation',
      'Operations and supply chain',
      'Digital commerce and commercial intelligence',
    ],
  },
  why: {
    title: 'Why MOESA',
    items: [
      'One coordinated view across product, supplier, market and operation',
      'Flexible partnership models rather than one fixed service package',
      'Client decision rights remain clear',
      'Open questions are controlled instead of hidden by assumptions',
      'Commercial preparation is connected with operational delivery',
      'Product and customer feedback return to the next business decision',
    ],
  },
  principles: {
    title: 'Our operating principles',
    items: [
      'Commercial realism',
      'Structured execution',
      'Clear responsibilities',
      'Controlled product information',
      'Long-term partnership',
      'Continuous improvement',
    ],
  },
  experience: {
    title: 'Experience',
    body: 'Our team’s experience includes 15 years in digital commerce and 10 years in professional e-commerce operations, combined with warehousing, inventory, shipping and international trade experience.',
  },
  europeanBase: {
    title: 'European base, international scope',
    body: 'MOESA Ltd. is registered in Plovdiv, Bulgaria, providing an EU operating base for international sourcing, market access and commercial operations. Work outside the EU is structured according to the project, market and responsible parties.',
  },
  isNot: {
    title: 'What MOESA is not',
    items: [
      'Not limited to e-commerce companies',
      'Not only a sourcing agent',
      'Not only a trading company',
      'Not a legal substitute for the economic operators assigned by law',
      'Not a software platform unless a separate technology service is confirmed',
    ],
  },
  direction: {
    title: 'Our direction',
    body: 'MOESA is developing a structured operating model that can support future client dashboards, workflow automation and AI-assisted operational analysis. Public technology capabilities will be presented only when they are actually available.',
  },
  finalCta: {
    title: 'Let us discuss the role MOESA can play in your operation.',
    body: 'Start with a product, category, market, supplier or operational challenge.',
    cta: {
      label: 'Discuss a Project',
      href: '/contact',
    },
  },
}

export default content
