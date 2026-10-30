/**
 * Shared content types. Every page module (content/en/*.ts and content/tr/*.ts) is typed by an
 * interface declared next to the EN module; TR modules reuse the EN interface.
 *
 * Copy rule: strings in the page modules are transcribed verbatim from
 * MOESA_Website_Package_v1.0/content/<locale>/*.md. Never take copy from design-reference/.
 */

export type Locale = 'en' | 'tr'

export interface Cta {
  label: string
  /** An EN path (e.g. `/contact?service=operations-supply-chain`). Localise it at render time with `useLocalizedHref`. */
  href: string
}

export interface PageMeta {
  /** EN path of the page (the md `**URL:**`). */
  path: string
  /** The md `**Page Title:**`. */
  title: string
  /** The md `**Meta Description:**`. */
  description: string
}

export interface FinalCtaContent {
  title: string
  body: string
  cta: Cta
  secondary?: Cta
}

export type ServiceSlug =
  | 'sourcing-managed-procurement'
  | 'product-private-label-development'
  | 'market-access-commercial-representation'
  | 'operations-supply-chain'
  | 'digital-commerce-commercial-intelligence'

export type PageKey =
  | 'home'
  | 'services'
  | 'how-we-work'
  | 'who-we-work-with'
  | 'about'
  | 'contact'
  | 'thank-you'
  | '404'
  | 'privacy-policy'
  | 'cookie-policy'
  | 'legal-notice'
  | `services/${ServiceSlug}`

/** The md `## Hero`: its H1 and the paragraph below it. */
export interface HeroContent {
  title: string
  body: string
}

/** An md `##` section that is a heading with one paragraph. */
export interface TextSection {
  title: string
  body: string
}

/** An md `##` section that is a heading with a bullet list. */
export interface ListSection {
  title: string
  items: string[]
}

/**
 * A general md `##` section: a heading plus any of one paragraph (`body`), a bullet list (`items`)
 * and an arrow line `A → B → C` split into `steps`. Used where the shape differs between pages or
 * between EN and TR (a TR md often gives as running text what the EN md gives as a list).
 */
export interface Section {
  title: string
  body?: string
  items?: string[]
  steps?: string[]
}

/** A section of a legal page; legal pages vary a lot, so they are an ordered list keyed by `id`. */
export interface LegalSection {
  /** Stable id used to pair EN and TR sections. Not display copy. */
  id: string
  title: string
  paragraphs?: string[]
  items?: string[]
}
