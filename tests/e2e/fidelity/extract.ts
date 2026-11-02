/**
 * Content-fidelity oracle: the approved strings of a package md (MOESA_Website_Package_v1.0/content/{en,tr}/*.md)
 * that a rendered page must contain. Used by tests/e2e/content-fidelity.spec.ts for every route.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { LEGAL_REMOVED } from '../../../content/legal-revisions'

export type FidelityLocale = 'en' | 'tr'

/** `import.meta.dirname` under Node/Playwright; vitest's nuxt environment provides `__dirname` instead. */
const here: string = import.meta.dirname ?? __dirname
const PKG_CONTENT = resolve(here, '../../../MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0/content')

/** Absolute path of a package md, e.g. `mdPath('tr', 'home.md')`. */
export function mdPath(locale: FidelityLocale, file: string): string {
  return resolve(PKG_CONTENT, locale, file)
}

const normalise = (s: string) => s.replace(/\s+/g, ' ').trim()

/** Metadata lines: `**URL:**`, `**Status:**`, `**Version:**`, `**Page Title:**`, `**Meta Description:**`. */
const METADATA = /^\*\*(URL|Status|Version|Page Title|Meta Description):\*\*/
/** `**Primary CTA:** [Label](href)` (any `... CTA:` line). */
const CTA = /^\*\*[^*]*CTA:\*\*\s*\[([^\]]+)\]\([^)]*\)\s*$/
/** Structural headings that name a section of the template, not display copy. */
const STRUCTURAL = new Set(['Hero', 'Final CTA'])

const readLines = (mdFile: string) => readFileSync(mdFile, 'utf8').replace(/\r\n?/g, '\n').split('\n')

/**
 * Every heading, paragraph, list item and CTA label of a package md, whitespace-normalised.
 * Skips line 1 (`# PageName`), the metadata lines and the structural headings `Hero` and `Final CTA`.
 * Arrow lines (`A → B → C`) are split into separate strings.
 */
export function extractApprovedStrings(mdFile: string): string[] {
  const out: string[] = []
  const push = (text: string) => {
    for (const part of text.split(' → ')) {
      const s = normalise(part)
      if (s) out.push(s)
    }
  }

  let paragraph: string[] = []
  const flush = () => {
    if (paragraph.length) push(paragraph.join(' '))
    paragraph = []
  }

  for (const raw of readLines(mdFile).slice(1)) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    if (METADATA.test(line)) {
      flush()
      continue
    }
    const cta = CTA.exec(line)
    if (cta) {
      flush()
      push(cta[1]!)
      continue
    }
    const heading = /^#{1,6}\s+(.*)$/.exec(line)
    if (heading) {
      flush()
      if (!STRUCTURAL.has(normalise(heading[1]!))) push(heading[1]!)
      continue
    }
    const item = /^(?:[-*]|\d+\.)\s+(.*)$/.exec(line)
    if (item) {
      flush()
      push(item[1]!)
      continue
    }
    paragraph.push(line)
  }
  flush()
  return out
}

/** The md `**Page Title:**` and `**Meta Description:**`. */
export function readPageMeta(mdFile: string): { title: string; description: string } {
  const value = (label: string) => {
    const line = readLines(mdFile).find((l) => l.startsWith(`**${label}:**`))
    if (!line) throw new Error(`${mdFile}: no **${label}:** line`)
    return normalise(line.slice(label.length + 5))
  }
  return { title: value('Page Title'), description: value('Meta Description') }
}

export interface FidelityExclusion {
  text: string
  reason: string
  /** When the text is shown in a different form: the strings the page must contain instead. */
  renderedAs?: string[]
}

/**
 * Approved strings that are not checked as visible page text, keyed `<locale>/<file>`. Each one needs a reason
 * and is listed in the task report for the user's review. Only builder instructions or text rendered in a
 * deliberately different form belong here.
 */
export const FIDELITY_EXCLUSIONS: Record<string, FidelityExclusion[]> = {
  'en/contact.md': [
    ...[
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
    ].map((text) => ({
      text,
      reason:
        'Project-form field list: rendered as form labels with the "(optional)" suffix instead of " - optional"; checked by the contact form test.',
    })),
    { text: 'File Upload - optional', reason: 'File upload is disabled in v1 (decision 2026-10-30).' },
    { text: 'Privacy note', reason: 'Heading of the builder instruction below; implemented as the consent checkbox.' },
    {
      text: 'The form must include consent to process the submitted information for the purpose of responding to the enquiry. Users must not be added to marketing communications without separate consent.',
      reason: 'Privacy note is an instruction to the builder, implemented as the consent checkbox.',
    },
  ],
  'tr/contact.md': [
    {
      text: 'Hizmet seçimi',
      reason:
        'The service choice is the form select: label "Hizmet" (TR contact.md form list) with the TR contact.md service options as visible option labels.',
      renderedAs: [
        'Marka/ürün sourcing',
        'Yönetilen satın alma',
        'Ürün ve Private Label Geliştirme',
        'Pazara giriş',
        'Ticari temsil',
        'Operasyon ve Tedarik Zinciri',
        'Digital commerce',
        'Entegre hizmetler',
        'Emin değilim',
      ],
    },
    {
      text: 'Marka/ürün sourcing; yönetilen satın alma; private label; pazara giriş; ticari temsil; supply chain; digital commerce; entegre hizmetler; emin değilim.',
      reason: 'The approved running sentence of the service list; the list is the select options (see "Hizmet seçimi").',
    },
    {
      text: 'Ad; Şirket; İş e-postası; Ülke; Hizmet; Kısa proje briefi; opsiyonel kategori/pazar/hacim/zaman/dosya.',
      reason:
        'Builder-instruction field list, rendered as the form labels (optional ones with "(opsiyonel)"); "dosya" (file upload) is disabled in v1.',
    },
    {
      text: 'info@moesaltd.com | +359 88 501 661 | 1 Petyofi Str., Plovdiv 4000, Bulgaria',
      reason:
        'The one-line form of the direct contact details; the card shows the same three values as labelled rows (E-posta / Telefon / Kayıtlı adres), as in the canvas.',
      renderedAs: ['info@moesaltd.com', '+359 88 501 661', '1 Petyofi Str., Plovdiv 4000, Bulgaria'],
    },
  ],
  'en/home.md': [
    {
      text: 'Digital Commerce & Commercial Intelligence as a cross-functional capability',
      reason:
        'Rendered as the DS capability ServiceCard: eyebrow "Cross-functional capability" (cards.capability) above the title "Digital Commerce & Commercial Intelligence" (services.md). Same words, DS layout.',
      renderedAs: ['Cross-functional capability', 'Digital Commerce & Commercial Intelligence'],
    },
  ],
  'tr/home.md': [
    {
      text: 'Yatay yetkinlik olarak Dijital Ticaret ve Ticari İçgörü',
      reason:
        'Rendered as the DS capability ServiceCard: eyebrow "Yatay yetkinlik" (cards.capability, cut from this line) above the title "Dijital Ticaret ve Ticari İçgörü" (TR services.md). Same words, DS layout.',
      renderedAs: ['Yatay yetkinlik', 'Dijital Ticaret ve Ticari İçgörü'],
    },
  ],
}

/** The md marker of an open item on the legal pages ("OPEN / AÇIK - Confirm …"). */
export const OPEN_PREFIX = 'OPEN / AÇIK - '

/**
 * Legal-page exception (legal review 2026-11-01, content/legal-revisions.ts `LEGAL_REMOVED`): the approved package
 * strings that the Privacy Policy, Cookie Policy and Legal Notice deliberately no longer show (draft instructions,
 * answered OPEN notes, claims about file uploads/analytics, the TR "Açık alanlar" summaries). Scoped to exactly those
 * strings of those three md files; every other approved string, legal or not, is still checked. Their replacements
 * are listed in i18n/UNREVIEWED_LEGAL.md and checked by tests/unit/legal-pages.test.ts.
 */
function legalRemoved(locale: FidelityLocale, file: string): string[] {
  return LEGAL_REMOVED.filter((r) => r.locale === locale && `${r.page}.md` === file && !r.meta).map((r) => r.text)
}

/** The md meta description a legal page replaced (draft text, legal review B4), or undefined. */
export function legalRemovedMetaDescription(locale: FidelityLocale, file: string): string | undefined {
  return LEGAL_REMOVED.find((r) => r.locale === locale && `${r.page}.md` === file && r.meta)?.text
}

/**
 * Legal review notes (NUXT_PUBLIC_LEGAL_REVIEW_NOTES, owner request 2026-11-02): the Draft status chip and the OPEN
 * notes are shown on Preview deployments only, never in production, and the e2e server runs the production default
 * (flag off). So an approved string marked "OPEN / AÇIK - " is not checked as page text. Exactly those strings: the md
 * status line is metadata and never checked anyway, and every other approved string is. Both notes, with the flag on
 * and off, are checked by tests/unit/legal-pages.test.ts and tests/e2e/legal-review-notes.spec.ts.
 */
export const isLegalReviewNote = (s: string) => s.startsWith(OPEN_PREFIX)

/**
 * `extractApprovedStrings` minus the `FIDELITY_EXCLUSIONS` of that locale and file and the legal review notes, plus
 * the `renderedAs` strings of those exclusions (what the page shows instead).
 */
export function approvedStringsFor(locale: FidelityLocale, file: string): string[] {
  const exclusions = FIDELITY_EXCLUSIONS[`${locale}/${file}`] ?? []
  const excluded = new Set([...exclusions.map((e) => e.text), ...legalRemoved(locale, file)])
  const kept = extractApprovedStrings(mdPath(locale, file)).filter((s) => !excluded.has(s) && !isLegalReviewNote(s))
  return [...kept, ...exclusions.flatMap((e) => e.renderedAs ?? [])]
}

/**
 * The strings of `strings` that `pageText` does not contain. Both sides are whitespace-normalised and
 * case-folded with the page locale's rules (eyebrows are uppercased by CSS and innerText reflects that;
 * Turkish folds İ→i and I→ı).
 */
export function findMissing(pageText: string, strings: string[], locale: FidelityLocale): string[] {
  const fold = (s: string) => normalise(s).toLocaleLowerCase(locale)
  const text = fold(pageText)
  return strings.filter((s) => !text.includes(fold(s)))
}
