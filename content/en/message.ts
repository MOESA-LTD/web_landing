import type { FinalCtaContent, HeroContent, PageMeta, Section, TextSection } from '../types'

/** The utility pages: thank-you and 404. */
export interface MessageContent {
  meta: PageMeta
  hero: HeroContent
  /** Thank-you "What happens next"; 404 "Continue from here". EN list; TR running text. */
  next: Section
  /** Thank-you "Need to add information?" (EN only). */
  info?: TextSection
  finalCta: FinalCtaContent
}
