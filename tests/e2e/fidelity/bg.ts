/**
 * Content-fidelity oracle for the Bulgarian pages. There is no approved BG md, so the oracle is the BG content module
 * itself (content/bg/*.ts, every string flagged in content/bg/unreviewed.ts or content/legal-revisions.ts): every copy leaf of the page's module
 * must be visible text inside `<main id="main">`. Structural strings (ids, slugs, hrefs, meta.path) are not copy; the
 * meta title and description are checked against the document head instead.
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { content as bg } from '../../../content/bg/index'
import type { PageKey } from '../../../content/types'
import { OPEN_PREFIX, type FidelityExclusion } from './extract'

const here: string = import.meta.dirname ?? __dirname
const bgJson = JSON.parse(readFileSync(resolve(here, '../../../i18n/locales/bg.json'), 'utf8'))

const STRUCTURAL_KEYS = new Set(['id', 'slug', 'service', 'href'])
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
const normalise = (s: string) => s.replace(/\s+/g, ' ').trim()

interface Leaf {
  path: string
  key: string
  value: string
}

function leaves(value: unknown, path = '', key = ''): Leaf[] {
  if (typeof value === 'string') return [{ path, key, value: normalise(value) }]
  if (Array.isArray(value)) {
    const ids = value.length > 0 && value.every((x) => isObj(x) && typeof x.id === 'string')
    return value.flatMap((v, i) => leaves(v, `${path}[${ids ? (v as { id: string }).id : i}]`, key))
  }
  if (isObj(value)) return Object.entries(value).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k, k))
  return []
}

/**
 * BG module strings that are not checked as visible page text, keyed by page, with the leaf path. The same
 * exclusions as the EN pages (tests/e2e/fidelity/extract.ts), for the same reasons.
 */
export const BG_FIDELITY_EXCLUSIONS: Partial<Record<PageKey, (FidelityExclusion & { path: RegExp })[]>> = {
  home: [
    {
      path: /^operatingModel\.items\[4\]$/,
      text: 'Дигитална търговия и бизнес анализи като междуфункционална компетентност',
      reason: 'As EN: rendered as the DS capability ServiceCard, eyebrow (cards.capability) above the service title.',
      renderedAs: [bgJson.cards.capability, 'Дигитална търговия и бизнес анализи'],
    },
  ],
  contact: [
    {
      path: /^formFields\.items\[\d+\]$/,
      text: 'Формуляр за проект field list',
      reason: 'As EN: the project-form field list is rendered as the form labels ("(по избор)" suffix); file upload is disabled in v1.',
      renderedAs: Object.values(bgJson.form.labels as Record<string, string>),
    },
    {
      path: /^privacyNote\./,
      text: 'Бележка за поверителността',
      reason: 'As EN: the privacy note is a builder instruction, implemented as the consent checkbox.',
    },
  ],
}

/** The strings a BG page must show inside `<main>`: every copy leaf of its module, minus exclusions, plus their renderedAs. */
export function bgStringsFor(page: PageKey): string[] {
  const exclusions = BG_FIDELITY_EXCLUSIONS[page] ?? []
  const copy = leaves(bg[page]).filter(
    (l) => !STRUCTURAL_KEYS.has(l.key) && !l.path.startsWith('meta.') && !exclusions.some((e) => e.path.test(l.path)),
  )
  // Legal OPEN items show the "Открито" chip instead of the md marker "OPEN / AÇIK - " (see approvedStringsFor).
  const shown = copy.map((l) => (l.value.startsWith(OPEN_PREFIX) ? l.value.slice(OPEN_PREFIX.length) : l.value))
  return [...new Set([...shown, ...exclusions.flatMap((e) => e.renderedAs ?? [])])]
}

/** The BG meta title and description of a page. */
export const bgMeta = (page: PageKey) => bg[page].meta
