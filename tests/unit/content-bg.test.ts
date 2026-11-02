import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { useContent } from '../../app/composables/useContent'
import { siteBg } from '../../content/bg/site'
import { UNREVIEWED_BG } from '../../content/bg/unreviewed'
import { LEGAL_REVISIONS } from '../../content/legal-revisions'
import { PAGE_KEYS, brand, serviceOptionKeys } from '../../content/site'
import { renderUnreviewedBgMd } from '../../scripts/unreviewed-bg'
import { allLeaves, flattenMessages, getAt, norm, shapeDiff, type Leaf } from './helpers/content-tree'

/**
 * Bulgarian content: our translation of the approved EN (there is no approved BG source). Every BG page string and
 * every BG UI string is flagged for review: the page copy in content/bg/unreviewed.ts (`UNREVIEWED_BG`, with its EN
 * source), the UI microcopy as the whole of i18n/locales/bg.json. Both are rendered to i18n/UNREVIEWED_BG.md. The legal
 * text written after the legal review is listed in content/legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md) instead.
 */
const root = resolve(__dirname, '../..')

/** Structural strings that are not translated: they must equal EN (paths are EN paths, localised at render time). */
const STRUCTURAL_KEYS = new Set(['id', 'slug', 'service', 'href'])
const isStructural = (l: Leaf) => STRUCTURAL_KEYS.has(l.key) || l.path === 'meta.path'

/**
 * BG strings that are deliberately identical to EN: names, the package address, emails and the md status value of the
 * legal draft chip. Anything else equal to EN is an untranslated string.
 */
const SAME_AS_EN = new Set([
  'MOESA LTD.',
  '1 Petyofi Str., Plovdiv 4000, Bulgaria',
  'info@moesaltd.com',
  'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  'DRAFT / TASLAK - LEGAL & TECHNICAL REVIEW REQUIRED',
])

/** Bulgarian informal "you" (ти, теб, твой …): the site addresses the reader with the formal "Вие". */
const INFORMAL = /(^|[^\p{L}])(ти|теб|тебе|твой|твоя|твоят|твое|твоето|твои|твоите)(?![\p{L}])/iu
/** The formal pronoun of direct address is capitalised throughout (Вие, Ви, Вашият …), never lowercase. */
const LOWERCASE_FORMAL = /(^|[^\p{L}])(вие|ви|ваш\p{L}*)(?![\p{L}])/u
/** Latin letters that look like Cyrillic ones, inside a Cyrillic word (a mixed-script typo). */
const MIXED_SCRIPT = /\p{Script=Cyrillic}[aceopxyABCEHKMOPTXy]|[aceopxyABCEHKMOPTXy]\p{Script=Cyrillic}/u

const key = (page: string, path: string) => `${page}|${path}`
const byKey = new Map(UNREVIEWED_BG.map((e) => [key(e.page, e.path), e]))
/** Legal strings written after the legal review (content/legal-revisions.ts, i18n/UNREVIEWED_LEGAL.md), not UNREVIEWED_BG. */
const revised = new Set(LEGAL_REVISIONS.map((r) => key(r.page, r.path)))

/** The EN and BG trees of every flagged unit: the 16 pages plus the site-wide strings (`site`). */
const UNITS: { page: string; en: unknown; bg: unknown }[] = [
  ...PAGE_KEYS.map((page) => ({ page, en: useContent(page, 'en'), bg: useContent(page, 'bg') })),
  { page: 'site', en: { descriptor: brand.descriptor_en }, bg: siteBg },
]

describe('BG page modules', () => {
  for (const { page, en, bg } of UNITS) {
    it(`${page}: same shape as EN (no gaps, no extra or TR-only fields)`, () => {
      expect(shapeDiff(en, bg)).toEqual([])
    })

    it(`${page}: structural strings (ids, slugs, hrefs, meta.path) equal EN`, () => {
      for (const l of allLeaves(bg).filter(isStructural)) expect(l.value, l.path).toBe(getAt(en, l.path))
    })

    it(`${page}: every copy string is listed in UNREVIEWED_BG (or LEGAL_REVISIONS) with its EN source, and nothing else is listed`, () => {
      const copy = allLeaves(bg).filter((l) => !isStructural(l) && !revised.has(key(page, l.path)))
      expect(copy.length).toBeGreaterThan(0)
      const unlisted = copy.filter((l) => !byKey.has(key(page, l.path))).map((l) => `${l.path}: ${l.value}`)
      expect(unlisted, 'BG strings missing from UNREVIEWED_BG').toEqual([])
      const entries = UNREVIEWED_BG.filter((e) => e.page === page)
      expect(entries.map((e) => e.path).sort()).toEqual(copy.map((l) => l.path).sort())
      for (const e of entries) {
        expect(getAt(bg, e.path), `${page} ${e.path} BG`).toBe(e.bg)
        expect(getAt(en, e.path), `${page} ${e.path} EN`).toBe(e.en)
      }
    })

    it(`${page}: every copy string is translated (identical to EN only for names, the address and the email)`, () => {
      const same = allLeaves(bg)
        .filter((l) => !isStructural(l) && l.value === getAt(en, l.path) && !SAME_AS_EN.has(l.value))
        .map((l) => `${l.path}: ${l.value}`)
      expect(same).toEqual([])
    })
  }

  it('UNREVIEWED_BG has unique entries on known pages, non-empty, without exclamation marks', () => {
    expect(UNREVIEWED_BG.length).toBeGreaterThan(500)
    expect(byKey.size, 'duplicate (page, path) entries').toBe(UNREVIEWED_BG.length)
    const pages = new Set(UNITS.map((u) => u.page))
    for (const e of UNREVIEWED_BG) {
      expect(pages.has(e.page), e.page).toBe(true)
      expect(e.en.trim(), `${e.page} ${e.path}`).not.toBe('')
      expect(e.bg.trim(), `${e.page} ${e.path}`).not.toBe('')
      expect(e.bg, `${e.page} ${e.path}`).not.toContain('!')
    }
  })

  it('every page module is in Bulgarian (Cyrillic) apart from names, addresses and fixed terms', () => {
    const latinOnly = UNREVIEWED_BG.filter((e) => e.bg !== e.en && !/\p{Script=Cyrillic}/u.test(e.bg)).map((e) => `${e.page} ${e.path}: ${e.bg}`)
    expect(latinOnly).toEqual([])
  })

  it('meta titles stay within 60 and descriptions within 160 characters (search-result truncation)', () => {
    for (const page of PAGE_KEYS) {
      const { title, description } = useContent(page, 'bg').meta
      expect(title.length, `${page} title`).toBeLessThanOrEqual(60)
      expect(description.length, `${page} description`).toBeLessThanOrEqual(160)
    }
  })

  it('the legal pages keep the md status value (draft chip) and every OPEN marker of the EN page', () => {
    for (const page of ['privacy-policy', 'cookie-policy', 'legal-notice'] as const) {
      const en = useContent(page, 'en')
      const bg = useContent(page, 'bg')
      expect(bg.status).toBe(en.status)
      const open = (c: unknown) => allLeaves(c).filter((l) => l.value.startsWith('OPEN / AÇIK - ')).map((l) => l.path)
      expect(open(bg), page).toEqual(open(en))
      if (page !== 'cookie-policy') expect(open(bg).length).toBeGreaterThan(0)
    }
  })

  it('keeps the company facts of the EN pages (EIK, VAT number, phone, email, address)', () => {
    const all = PAGE_KEYS.map((page) => JSON.stringify(useContent(page, 'bg'))).join('\n')
    for (const fact of ['207200475', 'BG207200475', '+359 88 501 661', 'info@moesaltd.com', '1 Petyofi Str., Plovdiv 4000, Bulgaria']) {
      expect(all, fact).toContain(fact)
    }
    const notice = useContent('legal-notice', 'bg')
    const operator = notice.sections.find((s) => s.id === 'operator')!.paragraphs!
    expect(operator).toContain('ЕИК: 207200475')
    expect(operator).toContain('ИН по ДДС: BG207200475')
  })

  it('names the Bulgarian supervisory authority in Bulgarian and cites the GDPR as ОРЗД', () => {
    const rights = useContent('privacy-policy', 'bg').sections.find((s) => s.id === 'rights')!.paragraphs!.join(' ')
    expect(rights).toContain('Комисията за защита на личните данни (КЗЛД)')
    expect(rights).toContain('www.cpdp.bg')
    expect(rights).toContain('чл. 21 от ОРЗД')
    const bases = useContent('privacy-policy', 'bg').sections.find((s) => s.id === 'legalBases')!.paragraphs!.join(' ')
    expect(bases).toContain('чл. 6, пар. 1, буква „б“ от ОРЗД')
    expect(bases).not.toMatch(/GDPR|DSGVO/)
  })

  it('uses the formal "Вие" register: no informal pronouns, and the formal pronoun is always capitalised', () => {
    expect(UNREVIEWED_BG.filter((e) => INFORMAL.test(e.bg)).map((e) => `${e.page} ${e.path}: ${e.bg}`)).toEqual([])
    expect(UNREVIEWED_BG.filter((e) => LOWERCASE_FORMAL.test(e.bg)).map((e) => `${e.page} ${e.path}: ${e.bg}`)).toEqual([])
    const legal = (['privacy-policy', 'cookie-policy', 'legal-notice'] as const).flatMap((p) => allLeaves(useContent(p, 'bg')).map((l) => l.value))
    expect(legal.filter((v) => INFORMAL.test(v) || LOWERCASE_FORMAL.test(v))).toEqual([])
  })

  it('has no Latin look-alike letters inside Cyrillic words', () => {
    const all = PAGE_KEYS.flatMap((p) => allLeaves(useContent(p, 'bg')).map((l) => l.value))
    expect(all.filter((v) => MIXED_SCRIPT.test(v))).toEqual([])
  })

  it('keeps the claims and scope of the EN copy', () => {
    const bg = (page: (typeof PAGE_KEYS)[number]) => JSON.stringify(useContent(page, 'bg'))
    // "Third-party delays or losses cannot be guaranteed against." stays a negation.
    expect(useContent('services/operations-supply-chain', 'bg').exceptions!.body).toContain(
      'Не може да бъде дадена гаранция срещу забавяния или загуби, причинени от трети страни.',
    )
    // Legal-role boundary: MOESA does not automatically assume the legal roles.
    expect(useContent('services/operations-supply-chain', 'bg').legalBoundary!.body).toMatch(/^MOESA не поема автоматично/)
    // Roadmap wording stays roadmap.
    expect(useContent('how-we-work', 'bg').evolve.body).toContain('Това са планирани възможности, докато наличността им не бъде потвърдена отделно.')
    expect(useContent('services/digital-commerce-commercial-intelligence', 'bg').technology!.body).toContain('Не се твърди')
    expect(useContent('about', 'bg').direction.body).toContain('едва когато действително са налични')
    // No forbidden claim in any BG page.
    const forbidden = [
      /гарант\p{L}* (пълно|изцяло)\p{L}* съответствие/iu,
      /(пълно|изцяло)\p{L}* съответствие[^.]*гарант/iu,
      /(цялата|пълната|всяка) (правна|юридическа|законова) отговорност/iu,
      /във всички (държави|страни)/iu,
      /MOESA OS|клиентски портал|client portal/iu,
    ]
    for (const page of PAGE_KEYS) for (const re of forbidden) expect(bg(page), `${page} ${re}`).not.toMatch(re)
  })
})

describe('BG UI microcopy (i18n/locales/bg.json)', () => {
  const read = (l: string) => flattenMessages(JSON.parse(readFileSync(resolve(root, `i18n/locales/${l}.json`), 'utf8')))
  const en = read('en')
  const bg = read('bg')

  /** UI strings that are the same in Bulgarian: the native language names. */
  const SAME_AS_EN_UI = new Set(['language.names.en', 'language.names.tr', 'language.names.de', 'language.names.bg'])

  it('has exactly the keys of en.json, none empty', () => {
    expect(Object.keys(bg).sort()).toEqual(Object.keys(en).sort())
    for (const [k, v] of Object.entries(bg)) expect(v.trim(), k).not.toBe('')
  })

  it('keeps every interpolation placeholder of the EN message', () => {
    const ph = (s: string) => [...s.matchAll(/\{[^}]*\}/g)].map((m) => m[0]).sort()
    for (const k of Object.keys(en)) expect(ph(bg[k]!), k).toEqual(ph(en[k]!))
  })

  it('translates every UI string (identical to EN only for the language names)', () => {
    const same = Object.keys(en).filter((k) => bg[k] === en[k] && !SAME_AS_EN_UI.has(k))
    expect(same).toEqual([])
  })

  it('names the four languages natively', () => {
    expect(bg['language.names.en']).toBe('English')
    expect(bg['language.names.tr']).toBe('Türkçe')
    expect(bg['language.names.de']).toBe('Deutsch')
    expect(bg['language.names.bg']).toBe('Български')
  })

  it('the BG contact page service list equals the BG form option labels (minus "Other")', () => {
    const labels = serviceOptionKeys.filter((k) => k !== 'other').map((k) => bg[`form.serviceOptions.${k}`])
    expect(useContent('contact', 'bg').serviceOptions.items).toEqual(labels)
  })

  it('the BG service link labels equal the BG services page titles', () => {
    for (const s of useContent('services', 'bg').services) expect(bg[`nav.serviceLinks.${s.slug}`]).toBe(s.title)
  })

  it('uses Bulgarian register labels for the company ID and VAT number', () => {
    expect(bg['company.companyId']).toBe('ЕИК')
    expect(bg['company.vat']).toBe('ИН по ДДС')
    expect(bg['footer.companyLine']).toBe('MOESA Ltd. · ЕИК {companyId} · ИН по ДДС {vat}')
  })

  it('uses the formal "Вие" register', () => {
    expect(Object.entries(bg).filter(([, v]) => INFORMAL.test(v) || LOWERCASE_FORMAL.test(v))).toEqual([])
  })
})

describe('i18n/UNREVIEWED_BG.md', () => {
  it('is the committed output of scripts/unreviewed-bg.ts (run `npm run unreviewed:bg` after changing a translation)', () => {
    const committed = readFileSync(resolve(root, 'i18n/UNREVIEWED_BG.md'), 'utf8').replace(/\r\n/g, '\n')
    expect(committed).toBe(renderUnreviewedBgMd())
  })

  it('lists every page-copy entry and every BG UI key with its EN source', () => {
    const md = renderUnreviewedBgMd()
    const bg = flattenMessages(JSON.parse(readFileSync(resolve(root, 'i18n/locales/bg.json'), 'utf8')))
    for (const e of UNREVIEWED_BG) expect(md, `${e.page} ${e.path}`).toContain(`\`${e.path}\``)
    for (const k of Object.keys(bg)) expect(md, k).toContain(`| \`${k}\` |`)
  })
})

describe('useContent (BG)', () => {
  it('returns the Bulgarian module for locale bg', () => {
    expect(useContent('home', 'bg').hero.title).toBe('От бизнес целта до доставка, готова за пазара.')
    expect(useContent('services/operations-supply-chain', 'bg').slug).toBe('operations-supply-chain')
    expect(norm(useContent('legal-notice', 'bg').hero.title)).toBe('Правна информация')
  })
})
