import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { useContent } from '../../app/composables/useContent'
import { siteDe } from '../../content/de/site'
import { UNREVIEWED_DE } from '../../content/de/unreviewed'
import { LEGAL_REVISIONS } from '../../content/legal-revisions'
import { PAGE_KEYS, brand, serviceOptionKeys } from '../../content/site'
import { renderUnreviewedDeMd } from '../../scripts/unreviewed-de'
import { allLeaves, flattenMessages, getAt, norm, shapeDiff, type Leaf } from './helpers/content-tree'

/**
 * German content: our translation of the approved EN (there is no approved DE source). Every DE page string and
 * every DE UI string is flagged for review: the page copy in content/de/unreviewed.ts (`UNREVIEWED_DE`, with its EN
 * source), the UI microcopy as the whole of i18n/locales/de.json. Both are rendered to i18n/UNREVIEWED_DE.md.
 */
const root = resolve(__dirname, '../..')

/** Structural strings that are not translated: they must equal EN (paths are EN paths, localised at render time). */
const STRUCTURAL_KEYS = new Set(['id', 'slug', 'service', 'href'])
const isStructural = (l: Leaf) => STRUCTURAL_KEYS.has(l.key) || l.path === 'meta.path'

/**
 * DE strings that are deliberately identical to EN: names, addresses, emails, the md status value of the legal
 * draft chip, and established English B2B terms used in German. Anything else equal to EN is an untranslated string.
 */
const SAME_AS_EN = new Set([
  'MOESA LTD.',
  '1 Petyofi Str., Plovdiv 4000, Bulgaria',
  'info@moesaltd.com',
  'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  'DRAFT / TASLAK - LEGAL & TECHNICAL REVIEW REQUIRED',
  'Digital Commerce & Commercial Intelligence',
  'Name',
])

const key = (page: string, path: string) => `${page}|${path}`
const byKey = new Map(UNREVIEWED_DE.map((e) => [key(e.page, e.path), e]))
/** Legal strings written after the legal review (content/legal-revisions.ts, i18n/UNREVIEWED_LEGAL.md), not UNREVIEWED_DE. */
const revised = new Set(LEGAL_REVISIONS.map((r) => key(r.page, r.path)))

/** The EN and DE trees of every flagged unit: the 16 pages plus the site-wide strings (`site`). */
const UNITS: { page: string; en: unknown; de: unknown }[] = [
  ...PAGE_KEYS.map((page) => ({ page, en: useContent(page, 'en'), de: useContent(page, 'de') })),
  { page: 'site', en: { descriptor: brand.descriptor_en }, de: siteDe },
]

describe('DE page modules', () => {
  for (const { page, en, de } of UNITS) {
    it(`${page}: same shape as EN (no gaps, no extra or TR-only fields)`, () => {
      expect(shapeDiff(en, de)).toEqual([])
    })

    it(`${page}: structural strings (ids, slugs, hrefs, meta.path) equal EN`, () => {
      for (const l of allLeaves(de).filter(isStructural)) expect(l.value, l.path).toBe(getAt(en, l.path))
    })

    it(`${page}: every copy string is listed in UNREVIEWED_DE (or LEGAL_REVISIONS) with its EN source, and nothing else is listed`, () => {
      const copy = allLeaves(de).filter((l) => !isStructural(l) && !revised.has(key(page, l.path)))
      expect(copy.length).toBeGreaterThan(0)
      const unlisted = copy.filter((l) => !byKey.has(key(page, l.path))).map((l) => `${l.path}: ${l.value}`)
      expect(unlisted, 'DE strings missing from UNREVIEWED_DE').toEqual([])
      const entries = UNREVIEWED_DE.filter((e) => e.page === page)
      expect(entries.map((e) => e.path).sort()).toEqual(copy.map((l) => l.path).sort())
      for (const e of entries) {
        expect(getAt(de, e.path), `${page} ${e.path} DE`).toBe(e.de)
        expect(getAt(en, e.path), `${page} ${e.path} EN`).toBe(e.en)
      }
    })

    it(`${page}: every copy string is translated (identical to EN only for names, addresses and established terms)`, () => {
      const same = allLeaves(de)
        .filter((l) => !isStructural(l) && l.value === getAt(en, l.path) && !SAME_AS_EN.has(l.value))
        .map((l) => `${l.path}: ${l.value}`)
      expect(same).toEqual([])
    })
  }

  it('UNREVIEWED_DE has unique entries on known pages, non-empty, without exclamation marks', () => {
    expect(UNREVIEWED_DE.length).toBeGreaterThan(500)
    expect(byKey.size, 'duplicate (page, path) entries').toBe(UNREVIEWED_DE.length)
    const pages = new Set(UNITS.map((u) => u.page))
    for (const e of UNREVIEWED_DE) {
      expect(pages.has(e.page), e.page).toBe(true)
      expect(e.en.trim(), `${e.page} ${e.path}`).not.toBe('')
      expect(e.de.trim(), `${e.page} ${e.path}`).not.toBe('')
      expect(e.de, `${e.page} ${e.path}`).not.toContain('!')
    }
  })

  it('the legal pages keep the md status value (draft chip) and every OPEN marker of the EN page', () => {
    for (const page of ['privacy-policy', 'cookie-policy', 'legal-notice'] as const) {
      const en = useContent(page, 'en')
      const de = useContent(page, 'de')
      expect(de.status).toBe(en.status)
      const open = (c: unknown) => allLeaves(c).filter((l) => l.value.startsWith('OPEN / AÇIK - ')).map((l) => l.path)
      expect(open(de), page).toEqual(open(en))
      // The cookie policy has none left (its inventory is complete); the privacy policy and legal notice still miss owner facts.
      if (page !== 'cookie-policy') expect(open(de).length).toBeGreaterThan(0)
    }
  })

  it('uses the formal "Sie" register (no du/dein/dich/dir/euch/euer)', () => {
    const informal = /(^|[^\p{L}])(du|dein\p{L}*|dich|dir|euch|euer\p{L}*)(?![\p{L}])/iu
    const hits = UNREVIEWED_DE.filter((e) => informal.test(e.de)).map((e) => `${e.page} ${e.path}: ${e.de}`)
    expect(hits).toEqual([])
  })

  it('keeps the claims and scope of the EN copy', () => {
    const de = (page: (typeof PAGE_KEYS)[number]) => JSON.stringify(useContent(page, 'de'))
    // "Third-party delays or losses cannot be guaranteed against." stays a negation.
    expect(useContent('services/operations-supply-chain', 'de').exceptions!.body).toContain(
      'Gegen Verzögerungen oder Verluste durch Dritte kann keine Garantie übernommen werden.',
    )
    // Legal-role boundary: MOESA does not automatically assume the legal roles.
    expect(useContent('services/operations-supply-chain', 'de').legalBoundary!.body).toMatch(/^MOESA übernimmt nicht automatisch/)
    // Roadmap wording stays roadmap.
    expect(useContent('how-we-work', 'de').evolve.body).toContain('Fähigkeiten auf der Roadmap, bis ihre Verfügbarkeit gesondert bestätigt ist')
    expect(useContent('services/digital-commerce-commercial-intelligence', 'de').technology!.body).toContain('Es wird nicht behauptet')
    expect(useContent('about', 'de').direction.body).toContain('erst vorgestellt, wenn sie tatsächlich verfügbar sind')
    // No forbidden claim in any DE page.
    const forbidden = [
      /volle?n? (Compliance|Konformität)[^.]*garantiert/i,
      /garantier\p{L}* (volle|vollständige) (Compliance|Konformität)/iu,
      /(gesamte|sämtliche|alle|jegliche) (rechtliche|gesetzliche)\p{L}* Verantwortung/iu,
      /in (jedem|allen) Ländern?/i,
      /MOESA OS|Kundenportal|client portal/i,
    ]
    for (const page of PAGE_KEYS) for (const re of forbidden) expect(de(page), `${page} ${re}`).not.toMatch(re)
  })
})

describe('DE UI microcopy (i18n/locales/de.json)', () => {
  const read = (l: string) => flattenMessages(JSON.parse(readFileSync(resolve(root, `i18n/locales/${l}.json`), 'utf8')))
  const en = read('en')
  const tr = read('tr')
  const de = read('de')

  /** UI strings that are the same in German: language names, and words German uses unchanged. */
  const SAME_AS_EN_UI = new Set(['language.names.en', 'language.names.tr', 'language.names.de', 'language.names.bg', 'form.labels.name', 'cookie.inventory.name', 'form.optional', 'nav.serviceLinks.digital-commerce-commercial-intelligence'])

  it('has exactly the keys of en.json (and tr.json), none empty', () => {
    expect(Object.keys(de).sort()).toEqual(Object.keys(en).sort())
    expect(Object.keys(tr).sort()).toEqual(Object.keys(en).sort())
    for (const [k, v] of Object.entries(de)) expect(v.trim(), k).not.toBe('')
  })

  it('keeps every interpolation placeholder of the EN message', () => {
    const ph = (s: string) => [...s.matchAll(/\{[^}]*\}/g)].map((m) => m[0]).sort()
    for (const k of Object.keys(en)) expect(ph(de[k]!), k).toEqual(ph(en[k]!))
  })

  it('translates every UI string (identical to EN only for language names and unchanged words)', () => {
    const same = Object.keys(en).filter((k) => de[k] === en[k] && !SAME_AS_EN_UI.has(k))
    expect(same).toEqual([])
  })

  it('names the four languages natively in every locale', () => {
    for (const msgs of [en, tr, de]) {
      expect(msgs['language.names.en']).toBe('English')
      expect(msgs['language.names.tr']).toBe('Türkçe')
      expect(msgs['language.names.de']).toBe('Deutsch')
      expect(msgs['language.names.bg']).toBe('Български')
    }
  })

  it('the DE contact page service list equals the DE form option labels (minus "Other")', () => {
    const labels = serviceOptionKeys.filter((k) => k !== 'other').map((k) => de[`form.serviceOptions.${k}`])
    expect(useContent('contact', 'de').serviceOptions.items).toEqual(labels)
  })

  it('the DE service link labels equal the DE services page titles', () => {
    for (const s of useContent('services', 'de').services) expect(de[`nav.serviceLinks.${s.slug}`]).toBe(s.title)
  })

  it('uses the formal "Sie" register', () => {
    const informal = /(^|[^\p{L}])(du|dein\p{L}*|dich|dir|euch|euer\p{L}*)(?![\p{L}])/iu
    expect(Object.entries(de).filter(([, v]) => informal.test(v))).toEqual([])
  })
})

describe('i18n/UNREVIEWED_DE.md', () => {
  it('is the committed output of scripts/unreviewed-de.ts (run `npm run unreviewed:de` after changing a translation)', () => {
    const committed = readFileSync(resolve(root, 'i18n/UNREVIEWED_DE.md'), 'utf8').replace(/\r\n/g, '\n')
    expect(committed).toBe(renderUnreviewedDeMd())
  })

  it('lists every page-copy entry and every DE UI key with its EN source', () => {
    const md = renderUnreviewedDeMd()
    const de = flattenMessages(JSON.parse(readFileSync(resolve(root, 'i18n/locales/de.json'), 'utf8')))
    for (const e of UNREVIEWED_DE) expect(md, `${e.page} ${e.path}`).toContain(`\`${e.path}\``)
    for (const k of Object.keys(de)) expect(md, k).toContain(`| \`${k}\` |`)
  })
})

describe('useContent (DE)', () => {
  it('returns the German module for locale de', () => {
    expect(useContent('home', 'de').hero.title).toBe('Vom Geschäftsziel zur marktreifen Lieferung.')
    expect(useContent('services/operations-supply-chain', 'de').slug).toBe('operations-supply-chain')
    expect(norm(useContent('legal-notice', 'de').hero.title)).toBe('Impressum')
  })
})
