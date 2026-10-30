/**
 * Content-fidelity oracle: the approved strings of a package md (MOESA_Website_Package_v1.0/content/{en,tr}/*.md)
 * that a rendered page must contain. Used by tests/e2e/content-fidelity.spec.ts for every route.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

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
    {
      text: 'The form must include consent to process the submitted information for the purpose of responding to the enquiry. Users must not be added to marketing communications without separate consent.',
      reason: 'Privacy note is an instruction to the builder, implemented as the consent checkbox.',
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

/**
 * `extractApprovedStrings` minus the `FIDELITY_EXCLUSIONS` of that locale and file, plus the `renderedAs`
 * strings of those exclusions (what the page shows instead).
 */
export function approvedStringsFor(locale: FidelityLocale, file: string): string[] {
  const exclusions = FIDELITY_EXCLUSIONS[`${locale}/${file}`] ?? []
  const excluded = new Set(exclusions.map((e) => e.text))
  const kept = extractApprovedStrings(mdPath(locale, file)).filter((s) => !excluded.has(s))
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
