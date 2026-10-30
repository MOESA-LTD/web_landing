import type { FinalCtaContent, HeroContent, LegalSection, PageMeta } from '../types'

/** privacy-policy, cookie-policy and legal-notice. */
export interface LegalContent {
  meta: PageMeta
  /** The md `**Status:**`, e.g. "DRAFT / TASLAK - LEGAL REVIEW REQUIRED". Shown in the Draft status chip. */
  status: string
  hero: HeroContent
  /** In md order. Pair EN and TR sections by `id`; TR has every EN section plus its approved "Açık alanlar" (`openFields`). */
  sections: LegalSection[]
  finalCta: FinalCtaContent
}
