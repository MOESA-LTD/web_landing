import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LEGAL_REMOVED, LEGAL_REVISION_UI_KEYS, LEGAL_REVISIONS } from '../../content/legal-revisions'
import { UNREVIEWED_DE } from '../../content/de/unreviewed'
import { UNREVIEWED_BG } from '../../content/bg/unreviewed'
import { UNREVIEWED_TR } from '../../content/tr/unreviewed'
import { UNREVIEWED_UI_KEYS } from '../../i18n/unreviewed-ui'
import { legalAt, renderUnreviewedLegalMd } from '../../scripts/unreviewed-legal'
import { flattenMessages } from './helpers/content-tree'

/**
 * The legal text we wrote after the legal review of 2026-11-01 (content/legal-revisions.ts) is listed completely and
 * exactly, so the lawyer sees every authored string in i18n/UNREVIEWED_LEGAL.md. (The content tests check the other
 * direction: a non-package legal string must be listed here.)
 */
const root = resolve(__dirname, '../..')
const PKG = resolve(root, 'MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0/content')
const key = (page: string, path: string) => `${page}|${path}`
const messages = (l: string) => flattenMessages(JSON.parse(readFileSync(resolve(root, `i18n/locales/${l}.json`), 'utf8')))

describe('LEGAL_REVISIONS', () => {
  it('has unique paths that exist, as text, in EN, TR, DE and BG', () => {
    expect(new Set(LEGAL_REVISIONS.map((r) => key(r.page, r.path))).size).toBe(LEGAL_REVISIONS.length)
    for (const r of LEGAL_REVISIONS) {
      for (const l of ['en', 'tr', 'de', 'bg'] as const) {
        const v = legalAt(r.page, l, r.path)
        expect(typeof v === 'string' && v.trim() !== '', `${l} ${r.page} ${r.path}`).toBe(true)
      }
    }
  })

  it('lists only text we wrote: the EN is not package text, and TR/DE/BG differ from EN', () => {
    for (const r of LEGAL_REVISIONS) {
      // Whole md lines (headings, list items, paragraphs), so a shortened package sentence still counts as ours.
      const mdLines = readFileSync(resolve(PKG, 'en', `${r.page}.md`), 'utf8')
        .split(/\r?\n/)
        .map((l) => l.replace(/^(#{1,6}|-)\s+/, '').trim())
      const en = legalAt(r.page, 'en', r.path) as string
      expect(mdLines, `${r.page} ${r.path} is package text`).not.toContain(en)
      expect(legalAt(r.page, 'tr', r.path), `${r.page} ${r.path} TR`).not.toBe(en)
      expect(legalAt(r.page, 'de', r.path), `${r.page} ${r.path} DE`).not.toBe(en)
      expect(legalAt(r.page, 'bg', r.path), `${r.page} ${r.path} BG`).not.toBe(en)
    }
  })

  it('is not also listed in UNREVIEWED_TR, UNREVIEWED_DE or UNREVIEWED_BG (one list per string)', () => {
    const revised = new Set(LEGAL_REVISIONS.map((r) => key(r.page, r.path)))
    expect(UNREVIEWED_TR.filter((e) => revised.has(key(e.page, e.path))).map((e) => e.path)).toEqual([])
    expect(UNREVIEWED_DE.filter((e) => revised.has(key(e.page, e.path))).map((e) => e.path)).toEqual([])
    expect(UNREVIEWED_BG.filter((e) => revised.has(key(e.page, e.path))).map((e) => e.path)).toEqual([])
  })

  it('keeps an OPEN marker in every locale where EN has one (owner facts still missing)', () => {
    for (const r of LEGAL_REVISIONS) {
      const open = (l: 'en' | 'tr' | 'de' | 'bg') => (legalAt(r.page, l, r.path) as string).startsWith('OPEN / AÇIK - ')
      expect([open('tr'), open('de'), open('bg')], `${r.page} ${r.path}`).toEqual([open('en'), open('en'), open('en')])
    }
  })
})

describe('LEGAL_REVISION_UI_KEYS', () => {
  it('exist in every locale json, and their TR is flagged as unreviewed', () => {
    const [en, tr, de, bg] = ['en', 'tr', 'de', 'bg'].map(messages)
    for (const { key: k } of LEGAL_REVISION_UI_KEYS) {
      expect(en![k], k).toBeTruthy()
      expect(tr![k], k).toBeTruthy()
      expect(de![k], k).toBeTruthy()
      expect(bg![k], k).toBeTruthy()
      expect(UNREVIEWED_UI_KEYS, k).toContain(k)
    }
  })
})

describe('LEGAL_REMOVED', () => {
  it('names package strings of that locale and page', () => {
    for (const r of LEGAL_REMOVED) {
      const md = readFileSync(resolve(PKG, r.locale, `${r.page}.md`), 'utf8')
      expect(md.includes(r.text), `${r.locale} ${r.page}: ${r.text}`).toBe(true)
    }
  })
})

describe('i18n/UNREVIEWED_LEGAL.md', () => {
  it('is the committed output of scripts/unreviewed-legal.ts (run `npm run unreviewed:legal` after changing legal copy)', () => {
    const committed = readFileSync(resolve(root, 'i18n/UNREVIEWED_LEGAL.md'), 'utf8').replace(/\r\n/g, '\n')
    expect(committed).toBe(renderUnreviewedLegalMd())
  })
})
