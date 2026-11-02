import type { FinalCtaContent, HeroContent, LegalSection, PageMeta } from '../types'

/** privacy-policy, cookie-policy and legal-notice. */
export interface LegalContent {
  meta: PageMeta
  /** The md `**Status:**`, e.g. "DRAFT / TASLAK - LEGAL REVIEW REQUIRED". Shown in the Draft status chip. */
  status: string
  hero: HeroContent
  /** In md order. Pair EN, TR and DE sections by `id`; every locale has the same sections. */
  sections: LegalSection[]
  finalCta: FinalCtaContent
}

/**
 * Last-updated date of each legal page (ISO, legal review S5), shown under the lead in every locale from this one
 * place, so EN, TR and DE cannot diverge. Set it to the publication date when the lawyer signs the final text off.
 */
export const LEGAL_UPDATED = {
  'privacy-policy': '2026-11-02',
  'cookie-policy': '2026-11-02',
  'legal-notice': '2026-11-02',
} as const
