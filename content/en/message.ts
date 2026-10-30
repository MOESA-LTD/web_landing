import type { FinalCtaContent, HeroContent, PageMeta, Section, TextSection } from '../types'

/** The utility pages: thank-you and 404. */
export interface MessageContent {
  meta: PageMeta
  hero: HeroContent
  /** Thank-you "What happens next"; 404 "Continue from here": `items`; TR also keeps its approved running sentence in `condensed`. */
  next: Section
  /** Thank-you only: "Need to add information?". */
  info?: TextSection
  finalCta: FinalCtaContent
}
