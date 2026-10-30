import type { FinalCtaContent, HeroContent, ListSection, PageMeta, Section, TextSection } from '../types'

export interface ContactContent {
  meta: PageMeta
  hero: HeroContent
  /** "How can we support you?": display copy for the service choice: `items` (the form option labels without "Other"); TR also keeps its approved running sentence in `condensed`. */
  serviceOptions: Section
  /**
   * BUILDER INSTRUCTION, not display copy: the md "Project form" field list. The form labels live in
   * i18n/locales/*.json. Do not render this section.
   */
  formFields: Section
  /** "What happens next": `items`; TR also keeps its approved running sentence in `condensed`. */
  next: Section
  /** "Direct contact": one line per item ("Email: ..."); TR also keeps its approved one-line form in `condensed`. */
  direct: Section
  /** "Company details": `Company ID: ...` and `VAT: ...`. */
  company: ListSection
  /**
   * BUILDER INSTRUCTION, not display copy: the md "Privacy note". It is implemented as the consent
   * checkbox. Do not render this section.
   */
  privacyNote: TextSection
  finalCta: FinalCtaContent
}

/** Verbatim from MOESA_Website_Package_v1.0/content/en/contact.md */
const content: ContactContent = {
  meta: {
    path: '/contact',
    title: 'Contact MOESA Ltd. | Discuss a Product, Procurement or Market Project',
    description: 'Contact MOESA Ltd. to discuss sourcing, procurement, private-label development, market access, supply chain or digital commerce operations.',
  },
  hero: {
    title: 'Start with the objective.',
    body: 'Tell us what the business needs, what is already confirmed and what remains open. We will help structure the next step.',
  },
  serviceOptions: {
    title: 'How can we support you?',
    items: [
      'Brand or Product Sourcing',
      'Managed Procurement',
      'Product & Private Label Development',
      'Market Access',
      'Commercial Representation',
      'Operations & Supply Chain',
      'Digital Commerce Operations',
      'Integrated / Multiple Services',
      'Not Sure Yet',
    ],
  },
  formFields: {
    title: 'Project form',
    items: [
      'Name',
      'Company',
      'Work Email',
      'Country',
      'How Can We Support You?',
      'Short Project Brief',
      'Product Category - optional',
      'Target Market - optional',
      'Estimated Volume - optional',
      'Target Timeline - optional',
      'File Upload - optional',
    ],
  },
  next: {
    title: 'What happens next',
    items: [
      'MOESA reviews the request and identifies the relevant service area',
      'We may request missing project information',
      'A discovery discussion is arranged where appropriate',
      'Scope, responsibilities and commercial terms are defined before work begins',
    ],
  },
  direct: {
    title: 'Direct contact',
    items: [
      'Email: info@moesaltd.com',
      'Phone: +359 88 501 661',
      'Registered address: 1 Petyofi Str., Plovdiv 4000, Bulgaria',
    ],
  },
  company: {
    title: 'Company details',
    items: [
      'Company ID: 207200475',
      'VAT: BG207200475',
    ],
  },
  privacyNote: {
    title: 'Privacy note',
    body: 'The form must include consent to process the submitted information for the purpose of responding to the enquiry. Users must not be added to marketing communications without separate consent.',
  },
  finalCta: {
    title: 'Ready to discuss the project?',
    body: 'Use the form or contact MOESA directly. A submitted form does not create a contractual engagement.',
    cta: {
      label: 'Send Project Brief',
      href: '/contact#project-form',
    },
  },
}

export default content
