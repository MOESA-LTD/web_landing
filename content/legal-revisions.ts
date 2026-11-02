/**
 * Legal text we wrote ourselves after the legal-pages review of 2026-11-01
 * (docs/superpowers/reviews/2026-11-01-legal-pages-review.md). None of it is owner-approved package copy: the EN is
 * our draft for the lawyer, TR and DE translate that draft. `npm run unreviewed:legal` renders every entry with its
 * EN, TR and DE text (read from the content modules and the locale json files) to i18n/UNREVIEWED_LEGAL.md.
 *
 * Tests hold the lists to the content (tests/unit/legal-revisions.test.ts): every listed path exists in all three
 * locales and its EN is not package text; the content tests accept a non-package legal string only when its path is
 * listed here; every removed package string below is really gone from the page and is the only package text a legal
 * page may drop (tests/unit/content.test.ts, tests/e2e/fidelity/extract.ts).
 */
export type LegalPageKey = 'privacy-policy' | 'cookie-policy' | 'legal-notice'

export interface LegalRevision {
  page: LegalPageKey
  /** Dotted content path, legal sections by id, e.g. `sections[legalBases].paragraphs[0]`. */
  path: string
  /** Review finding id (B = blocker, S = should fix, N = nice to have, O = owner input still needed). */
  finding: string
}

export const LEGAL_REVISIONS: LegalRevision[] = [
  { page: 'privacy-policy', path: 'hero.body', finding: 'B4' },
  { page: 'privacy-policy', path: 'sections[dataCollected].items[0]', finding: 'S1' },
  { page: 'privacy-policy', path: 'sections[dataCollected].items[1]', finding: 'S1' },
  { page: 'privacy-policy', path: 'sections[dataCollected].paragraphs[0]', finding: 'S1' },
  { page: 'privacy-policy', path: 'sections[legalBases].paragraphs[0]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[legalBases].paragraphs[1]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[legalBases].paragraphs[2]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[legalBases].paragraphs[3]', finding: 'B1/S2' },
  { page: 'privacy-policy', path: 'sections[recipients].items[0]', finding: 'B1/S6' },
  { page: 'privacy-policy', path: 'sections[recipients].items[1]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[recipients].paragraphs[0]', finding: 'B1/O9' },
  { page: 'privacy-policy', path: 'sections[recipients].paragraphs[1]', finding: 'B1/O3' },
  { page: 'privacy-policy', path: 'sections[transfers].paragraphs[0]', finding: 'B1/O9' },
  { page: 'privacy-policy', path: 'sections[transfers].paragraphs[1]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[retention].paragraphs[0]', finding: 'B1/O4' },
  { page: 'privacy-policy', path: 'sections[retention].paragraphs[1]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[retention].paragraphs[2]', finding: 'B1/O4 (OPEN)' },
  { page: 'privacy-policy', path: 'sections[provision].title', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[provision].paragraphs[0]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[provision].paragraphs[1]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[rights].items[6]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[rights].paragraphs[0]', finding: 'B1' },
  { page: 'privacy-policy', path: 'sections[rights].paragraphs[1]', finding: 'S4' },
  { page: 'privacy-policy', path: 'sections[security].paragraphs[0]', finding: 'B4' },
  { page: 'privacy-policy', path: 'sections[updates].paragraphs[0]', finding: 'B4/S5' },

  { page: 'cookie-policy', path: 'hero.body', finding: 'B2/B4' },
  { page: 'cookie-policy', path: 'sections[categories].paragraphs[0]', finding: 'S3' },
  { page: 'cookie-policy', path: 'sections[consentModel].paragraphs[0]', finding: 'B2' },
  { page: 'cookie-policy', path: 'sections[inventory].paragraphs[0]', finding: 'B2' },
  { page: 'cookie-policy', path: 'sections[thirdParties].paragraphs[0]', finding: 'B2' },
  { page: 'cookie-policy', path: 'sections[thirdParties].paragraphs[1]', finding: 'B2' },
  { page: 'cookie-policy', path: 'sections[managing].paragraphs[0]', finding: 'B2' },
  { page: 'cookie-policy', path: 'sections[managing].paragraphs[1]', finding: 'B2/S3' },

  { page: 'legal-notice', path: 'sections[operator].paragraphs[2]', finding: 'N5' },
  { page: 'legal-notice', path: 'sections[operator].paragraphs[4]', finding: 'B3/O1 (OPEN)' },
  { page: 'legal-notice', path: 'sections[contact].paragraphs[2]', finding: 'O2 (OPEN)' },
  { page: 'legal-notice', path: 'sections[representative].paragraphs[0]', finding: 'B3/O1 (OPEN)' },
  { page: 'legal-notice', path: 'sections[externalLinks].paragraphs[0]', finding: 'B4' },
  { page: 'legal-notice', path: 'sections[intellectualProperty].paragraphs[0]', finding: 'B4' },
]

/**
 * UI microcopy keys (i18n/locales/{en,tr,de}.json) written for the legal fixes: the contact-form acknowledgement (S2),
 * the cookie inventory rows and settings note (B2, S3), the last-updated line (S5) and the cross-links (N3).
 */
export const LEGAL_REVISION_UI_KEYS: { key: string; finding: string }[] = [
  { key: 'form.consent', finding: 'S2' },
  { key: 'form.errors.consent', finding: 'S2' },
  { key: 'cookie.noOptional', finding: 'S3' },
  { key: 'cookie.inventory.caption', finding: 'B2' },
  { key: 'cookie.inventory.provider', finding: 'B2' },
  { key: 'cookie.inventory.privacy', finding: 'B2' },
  { key: 'cookie.inventory.consentProvider', finding: 'B2' },
  { key: 'cookie.inventory.consentPurpose', finding: 'B2/S7' },
  { key: 'cookie.inventory.turnstileProvider', finding: 'B2' },
  { key: 'cookie.inventory.turnstilePurpose', finding: 'B2' },
  { key: 'cookie.inventory.turnstileDuration', finding: 'B2' },
  { key: 'legal.lastUpdated', finding: 'S5' },
  { key: 'legal.seeAlso', finding: 'N3' },
]

/** An approved package string that a legal page no longer shows (`meta`: the md Meta Description, not page text). */
export interface LegalRemoved {
  locale: 'en' | 'tr'
  page: LegalPageKey
  /** Exactly as in the package md, including an "OPEN / AÇIK - " marker. */
  text: string
  finding: string
  meta?: true
}

const removed = (locale: 'en' | 'tr', page: LegalPageKey, finding: string, texts: string[]): LegalRemoved[] =>
  texts.map((text) => ({ locale, page, text, finding }))

/**
 * The only approved package strings the legal pages may drop: draft instructions, OPEN notes now answered, and claims
 * about things the website does not do (file uploads, analytics, preference/marketing cookies). The TR "Açık alanlar"
 * summaries and the TR one-line `condensed` forms of rewritten sections go with them.
 */
export const LEGAL_REMOVED: LegalRemoved[] = [
  ...removed('en', 'privacy-policy', 'B4', [
    'Implementation draft. The final policy must be updated after hosting, analytics, form, email, cookie and third-party services are confirmed and must receive legal review before publication.',
    'Use appropriate technical and organisational measures. Final wording must match the actual system.',
    'State the effective date and explain that the policy may be updated when services or legal requirements change.',
  ]),
  ...removed('en', 'privacy-policy', 'S1', [
    'Contact-form data',
    'Files submitted by users',
    'Technical server logs',
    'Cookie and analytics data if enabled',
    'Analytics only if lawfully implemented',
  ]),
  ...removed('en', 'privacy-policy', 'B1', [
    'OPEN / AÇIK - Final legal bases must be confirmed with counsel for each processing activity.',
    'OPEN / AÇIK - Add hosting provider, form provider, email provider, analytics tools, CRM and other processors after the technical stack is final.',
    'OPEN / AÇIK - Confirm whether any provider processes data outside the EEA and document the transfer mechanism.',
    'OPEN / AÇIK - Define retention periods for enquiries, files, logs, analytics and business correspondence.',
  ]),
  ...removed('en', 'cookie-policy', 'B2/B4', [
    'Implementation draft. The final policy and consent banner depend on the technologies actually used on the website.',
    'Non-essential cookies must not be activated before valid consent where consent is legally required. Users must be able to reject and later change their choices.',
    'OPEN / AÇIK - Create the final cookie table after hosting, analytics, embedded media, forms and third-party services are selected.',
    'OPEN / AÇIK - List each third-party provider, purpose, cookie duration and privacy link.',
    'Explain browser controls and the website consent-preference mechanism.',
  ]),
  ...removed('en', 'cookie-policy', 'S3', ['Preferences', 'Analytics', 'Marketing - only if implemented']),
  ...removed('en', 'cookie-policy', 'S5', ['Effective date', 'OPEN / AÇIK - Add the publication date.']),
  ...removed('en', 'legal-notice', 'N5', ['Company ID: 207200475']),
  ...removed('en', 'legal-notice', 'B3/B4', [
    'OPEN / AÇIK - Confirm the legal representative or managing director before publication.',
    'Content responsibility',
    'OPEN / AÇIK - Confirm the wording required for the publication countries and applicable law.',
    'MOESA is not responsible for the content of external websites controlled by third parties. Final wording requires legal review.',
    'Website content, design and brand assets may not be reproduced without permission, except where permitted by applicable law. Final wording requires legal review.',
  ]),

  ...removed('tr', 'privacy-policy', 'B4', [
    'Teknik altyapı, form, hosting, analytics ve üçüncü taraflar kesinleşince güncellenecek uygulama taslağı.',
    'Açık alanlar',
    'Hukuki dayanak; processors; EEA dışı transfer; retention; güvenlik; yürürlük tarihi; legal review.',
  ]),
  { locale: 'tr', page: 'privacy-policy', finding: 'B4', meta: true, text: 'Teknik altyapı, form, hosting, analytics ve üçüncü taraflar kesinleşince güncellenecek uygulama taslağı.' },
  ...removed('tr', 'privacy-policy', 'S1', ['Form verileri; dosyalar; teknik loglar; analytics/cookie verileri varsa; iş yazışmaları.']),
  ...removed('tr', 'cookie-policy', 'B4', [
    'Sitede gerçekten kullanılacak teknolojiler kesinleşince tamamlanacak uygulama taslağı.',
    'Açık alanlar',
    'Cookie inventory; provider; amaç; süre; consent mekanizması; yürürlük tarihi; legal/technical review.',
  ]),
  { locale: 'tr', page: 'cookie-policy', finding: 'B4', meta: true, text: 'Sitede gerçekten kullanılacak teknolojiler kesinleşince tamamlanacak uygulama taslağı.' },
  ...removed('tr', 'cookie-policy', 'S3', ['Zorunlu; tercih; analytics; marketing yalnızca uygulanırsa.']),
  ...removed('tr', 'legal-notice', 'B3/N4', ['MOESA LTD. | 1 Petyofi Str., Plovdiv 4000, Bulgaria | Company ID 207200475 | VAT BG207200475']),
  ...removed('tr', 'legal-notice', 'B4', ['Açık alanlar', 'Yasal temsilci ve ülke bazlı zorunlu metinler yayından önce doğrulanmalı.']),
]
