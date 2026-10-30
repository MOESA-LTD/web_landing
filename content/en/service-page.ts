import type { FinalCtaContent, HeroContent, PageMeta, Section, ServiceSlug, TextSection } from '../types'

/**
 * The five service pages share this interface but not their sections: each page has a few
 * page-specific ones. Fields are optional where only some pages (or only the EN md) have them.
 * The keys of a page object are in md order.
 */
export interface ServicePageContent {
  meta: PageMeta
  /** Structural: the service this page is about. */
  slug: ServiceSlug
  hero: HeroContent
  /** The first section after the hero (EN only). */
  intro?: TextSection
  /** Market access: "Two sides of international trade". */
  twoSides?: Section
  typicalMandates: Section
  manages: Section
  /** Sourcing: "Managed procurement model". Digital: "Managed commerce model". */
  managedModel?: Section
  /** Sourcing: "Engagement models". Product: "Development models". Market access: "Representation structures". */
  models?: Section
  /** Sourcing: "Suitable for". */
  suitableFor?: Section
  /** Product: "Product architecture". EN: `body` + `items`; TR: `steps` (arrow line). */
  architecture?: Section
  /** Operations: "End-to-end operating flow" (`steps`). */
  flow?: Section
  /** Operations: "Operational visibility". */
  visibility?: Section
  /** Operations: "Exception management". */
  exceptions?: Section
  /** Operations: "Legal-role boundary". */
  legalBoundary?: Section
  /** Digital: "More than an e-commerce agency." */
  broader?: Section
  /** Digital: "Commercial intelligence framework" (`steps` + `items`). */
  framework?: Section
  /** Digital: "One product truth". */
  productTruth?: Section
  /** Digital: "Current technology position". */
  technology?: Section
  /** Product: "Unknown facts remain open." */
  openFacts?: Section
  /** Sourcing: "Clear responsibilities". Product: "Client and MOESA responsibilities". Market access: "Clear mandate and control". */
  responsibilities?: Section
  /** Market access: "European operating base". */
  europeanBase?: Section
  finalCta: FinalCtaContent
}
