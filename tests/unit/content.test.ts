import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { useContent } from '../../app/composables/useContent'
import { brand, contactForm, navigation, serviceLabelBySlug, serviceSlugs, PAGE_KEYS } from '../../content/site'
import type { Locale, PageKey } from '../../content/types'

const root = resolve(__dirname, '../..')
const PKG = resolve(root, 'MOESA_Website_Package_v1.0/MOESA_Website_Package_v1.0')

interface PageMapRow {
  URL: string
  'English File': string
  'Turkish File': string
}

const readJson = <T>(rel: string): T => JSON.parse(readFileSync(resolve(PKG, rel), 'utf8')) as T
const pageMap = readJson<PageMapRow[]>('data/page_map.json')
const navigationJson = readJson<{
  primary: { label: string; href: string }[]
  services: { label: string; href: string }[]
  legal: { label: string; href: string }[]
}>('data/navigation.json')

const keyOf = (url: string): PageKey => (url === '/' ? 'home' : url.slice(1)) as PageKey
const locales: Locale[] = ['en', 'tr']

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

function readMd(locale: Locale, key: PageKey) {
  const row = pageMap.find((r) => keyOf(r.URL) === key)!
  const file = locale === 'en' ? row['English File'] : row['Turkish File']
  return readFileSync(resolve(PKG, 'content', locale, file), 'utf8')
}

function metaField(md: string, label: string): string {
  const m = md.match(new RegExp(`^\\*\\*${label}:\\*\\*\\s*(.+?)\\s*$`, 'm'))
  if (!m) throw new Error(`md has no ${label}`)
  return m[1]!
}

/** Every heading, paragraph, list item and CTA label of a package md, as the display copy units (arrow lines split). */
function mdUnits(md: string): string[] {
  const units: string[] = []
  const lines = md.split(/\r?\n/)
  lines.forEach((raw, i) => {
    const line = raw.trim()
    if (!line || i === 0) return
    if (/^\*\*(URL|Status|Version|Page Title|Meta Description):\*\*/.test(line)) return
    if (line === '## Hero' || line === '## Final CTA') return
    const cta = line.match(/^\*\*Primary CTA:\*\*\s*\[(.+?)\]\((.+?)\)$/)
    if (cta) {
      units.push(norm(cta[1]!))
      return
    }
    const text = line.replace(/^#{1,6}\s+/, '').replace(/^-\s+/, '')
    for (const part of text.split(' → ')) units.push(norm(part))
  })
  return units
}

/** Leaf strings of a content module, skipping keys that are structural ids rather than copy. */
const NON_COPY_KEYS = new Set(['id', 'slug', 'service'])
function leaves(value: unknown, key = ''): string[] {
  if (typeof value === 'string') return NON_COPY_KEYS.has(key) ? [] : [norm(value)]
  if (Array.isArray(value)) return value.flatMap((v) => leaves(v, key))
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => leaves(v, k))
  }
  return []
}

describe('page meta comes straight from the package md', () => {
  for (const locale of locales) {
    it(`${locale}: every PageKey has the md title, description and URL`, () => {
      expect(PAGE_KEYS).toHaveLength(16)
      for (const key of PAGE_KEYS) {
        const md = readMd(locale, key)
        const { meta } = useContent(key, locale)
        expect(meta.title, `${locale} ${key} title`).toBe(metaField(md, 'Page Title'))
        expect(meta.description, `${locale} ${key} description`).toBe(metaField(md, 'Meta Description'))
        expect(meta.path, `${locale} ${key} path`).toBe(metaField(md, 'URL').replace(/`/g, ''))
      }
    })
  }

  it('PAGE_KEYS equals the page_map.json URLs', () => {
    expect([...PAGE_KEYS].sort()).toEqual(pageMap.map((r) => keyOf(r.URL)).sort())
  })
})

describe('content is verbatim and complete against the md', () => {
  for (const locale of locales) {
    for (const key of PAGE_KEYS) {
      it(`${locale} ${key}: every md unit is in the content module, and every string in it is in the md`, () => {
        const md = readMd(locale, key)
        const mdText = norm(md)
        const units = mdUnits(md)
        expect(units.length).toBeGreaterThan(3)
        const own = leaves(useContent(key, locale))

        const missing = units.filter((u) => !own.includes(u))
        expect(missing, 'md units missing from the content module').toEqual([])

        const invented = own.filter((s) => !mdText.includes(s))
        expect(invented, 'content strings that are not in the md').toEqual([])
      })
    }
  }
})

/**
 * Structural differences between a TR md and its EN md. The task rules say: do not invent text,
 * record the difference, make the field optional. This table pins the differences exactly, so
 * a new, unexpected divergence fails the test, and so does filling a gap without updating the list.
 */
const KNOWN_TR_GAPS: Record<string, string[]> = {
  '404': [
    '.next.body: TR only',
    '.next.items: EN only',
  ],
  'services': [
    '.integrated: EN only',
    '.services[].items: EN only',
  ],
  'services/sourcing-managed-procurement': [
    '.intro: EN only',
    '.managedModel.items: EN only',
    '.manages.body: TR only',
    '.manages.items: EN only',
    '.models.body: TR only',
    '.models.items: EN only',
    '.responsibilities: EN only',
    '.suitableFor: EN only',
    '.typicalMandates.body: TR only',
    '.typicalMandates.items: EN only',
  ],
  'services/product-private-label-development': [
    '.architecture.body: EN only',
    '.architecture.items: EN only',
    '.architecture.steps: TR only',
    '.intro: EN only',
    '.manages.body: TR only',
    '.manages.items: EN only',
    '.models: EN only',
    '.responsibilities: EN only',
    '.typicalMandates.body: TR only',
    '.typicalMandates.items: EN only',
  ],
  'services/market-access-commercial-representation': [
    '.europeanBase: EN only',
    '.intro: EN only',
    '.manages.body: TR only',
    '.manages.items: EN only',
    '.models: EN only',
    '.twoSides.body: TR only',
    '.twoSides.items: EN only',
    '.typicalMandates.body: TR only',
    '.typicalMandates.items: EN only',
  ],
  'services/operations-supply-chain': [
    '.exceptions: EN only',
    '.flow: EN only',
    '.intro: EN only',
    '.manages.body: TR only',
    '.manages.items: EN only',
    '.typicalMandates.body: TR only',
    '.typicalMandates.items: EN only',
    '.visibility.body: TR only',
    '.visibility.items: EN only',
  ],
  'services/digital-commerce-commercial-intelligence': [
    '.framework: EN only',
    '.intro: EN only',
    '.managedModel: EN only',
    '.manages.body: TR only',
    '.manages.items: EN only',
    '.technology: EN only',
    '.typicalMandates.body: TR only',
    '.typicalMandates.items: EN only',
  ],
  'how-we-work': [
    '.engagementLevels: EN only',
    '.evolve: EN only',
    '.intro: EN only',
    '.nonLinear: EN only',
    '.openQuestions: EN only',
    '.operatingFlow.items: EN only',
    '.operatingFlow.steps: TR only',
    '.partnershipModels.body: TR only',
    '.partnershipModels.items: EN only',
    '.responsibility: EN only',
    '.startAnywhere.body: TR only',
    '.startAnywhere.items: EN only',
    '.visibility: EN only',
  ],
  'who-we-work-with': [
    '.audiences[].items: EN only',
    '.intro: EN only',
    '.notSure: EN only',
    '.seekingBrands: EN only',
    '.selectionGuide: EN only',
  ],
  'about': [
    '.europeanBase: EN only',
    '.isNot.body: TR only',
    '.isNot.items: EN only',
    '.manages: EN only',
    '.principles: EN only',
    '.why.body: TR only',
    '.why.items: EN only',
  ],
  'contact': [
    '.company: EN only',
    '.direct.body: TR only',
    '.direct.items: EN only',
    '.formFields.body: TR only',
    '.formFields.items: EN only',
    '.next.body: TR only',
    '.next.items: EN only',
    '.privacyNote: EN only',
    '.serviceOptions.body: TR only',
    '.serviceOptions.items: EN only',
  ],
  'thank-you': [
    '.info: EN only',
    '.next.body: TR only',
    '.next.items: EN only',
  ],
  'legal-notice': [
    '.sections[contact].paragraphs: length 2 != 1',
    '.sections[contentResponsibility]: EN only',
    '.sections[externalLinks]: EN only',
    '.sections[intellectualProperty]: EN only',
    '.sections[openFields]: TR only',
    '.sections[operator].paragraphs: length 4 != 1',
    '.sections[representative]: EN only',
  ],
  'privacy-policy': [
    '.sections[controller]: EN only',
    '.sections[dataCollected].items: EN only',
    '.sections[dataCollected].paragraphs: TR only',
    '.sections[legalBases]: EN only',
    '.sections[openFields]: TR only',
    '.sections[privacyContact]: EN only',
    '.sections[purposes]: EN only',
    '.sections[recipients]: EN only',
    '.sections[retention]: EN only',
    '.sections[rights]: EN only',
    '.sections[security]: EN only',
    '.sections[transfers]: EN only',
    '.sections[updates]: EN only',
  ],
  'cookie-policy': [
    '.sections[categories].items: EN only',
    '.sections[categories].paragraphs: TR only',
    '.sections[consentModel]: EN only',
    '.sections[effectiveDate]: EN only',
    '.sections[inventory]: EN only',
    '.sections[managing]: EN only',
    '.sections[openFields]: TR only',
    '.sections[thirdParties]: EN only',
  ],
}

function shapeDiff(en: unknown, tr: unknown, path: string, out: Set<string>) {
  const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
  if (Array.isArray(en) || Array.isArray(tr)) {
    if (!(Array.isArray(en) && Array.isArray(tr))) {
      out.add(`${path}: ${Array.isArray(en) ? 'EN list, TR not' : 'TR list, EN not'}`)
      return
    }
    const byId = (a: unknown[]) => a.every((x) => isObj(x) && typeof x.id === 'string') && a.length > 0
    if (byId(en) && byId(tr)) {
      const e = new Map((en as { id: string }[]).map((x) => [x.id, x]))
      const t = new Map((tr as { id: string }[]).map((x) => [x.id, x]))
      for (const id of e.keys()) if (!t.has(id)) out.add(`${path}[${id}]: EN only`)
      for (const id of t.keys()) if (!e.has(id)) out.add(`${path}[${id}]: TR only`)
      for (const [id, x] of e) if (t.has(id)) shapeDiff(x, t.get(id), `${path}[${id}]`, out)
      return
    }
    if (en.length !== tr.length) out.add(`${path}: length ${en.length} != ${tr.length}`)
    for (let i = 0; i < Math.min(en.length, tr.length); i++) shapeDiff(en[i], tr[i], `${path}[]`, out)
    return
  }
  if (isObj(en) && isObj(tr)) {
    for (const k of Object.keys(en)) {
      if (!(k in tr)) out.add(`${path}.${k}: EN only`)
      else shapeDiff(en[k], tr[k], `${path}.${k}`, out)
    }
    for (const k of Object.keys(tr)) if (!(k in en)) out.add(`${path}.${k}: TR only`)
    return
  }
  if (typeof en !== typeof tr) out.add(`${path}: type ${typeof en} != ${typeof tr}`)
}

describe('TR modules have the same shape as EN, apart from the recorded md differences', () => {
  for (const key of PAGE_KEYS) {
    it(`${key}`, () => {
      const out = new Set<string>()
      shapeDiff(useContent(key, 'en'), useContent(key, 'tr'), '', out)
      expect([...out].sort()).toEqual([...(KNOWN_TR_GAPS[key] ?? [])].sort())
    })
  }
})

describe('useContent', () => {
  it('defaults to the current i18n locale (en) and takes an explicit locale', () => {
    expect(useContent('home').hero.title).toBe('From commercial objective to market-ready delivery.')
    expect(useContent('home', 'tr').hero.title).toBe('Ticari hedeften pazara hazır teslimata.')
  })

  it('is typed per service page', () => {
    expect(useContent('services/operations-supply-chain').slug).toBe('operations-supply-chain')
    expect(useContent('services/operations-supply-chain', 'tr').slug).toBe('operations-supply-chain')
  })
})

describe('site data', () => {
  it('brand comes from brand_tokens.json', () => {
    expect(brand.email).toBe('info@moesaltd.com')
    expect(brand.phone).toBe('+359 88 501 661')
    expect(brand.domain).toBe('https://www.moesaltd.com')
    expect(brand.company_id).toBe('207200475')
  })

  it('navigation and contactForm mirror the package json', () => {
    expect(navigation).toEqual(navigationJson)
    expect(contactForm.recipient).toBe('info@moesaltd.com')
    expect(contactForm.service_options).toHaveLength(10)
  })

  it('serviceSlugs are the navigation.json service slugs, in order', () => {
    const fromNav = navigationJson.services.map((s) => s.href.replace('/services/', ''))
    expect(serviceSlugs).toEqual(fromNav)
    expect(serviceSlugs).toHaveLength(5)
  })

  it('serviceLabelBySlug maps each slug to its navigation label', () => {
    for (const s of navigationJson.services) {
      expect(serviceLabelBySlug[s.href.replace('/services/', '') as keyof typeof serviceLabelBySlug]).toBe(s.label)
    }
  })

  it('every service slug has a service page module whose slug matches', () => {
    for (const slug of serviceSlugs) {
      expect(useContent(`services/${slug}`).slug).toBe(slug)
    }
  })
})

describe('UI microcopy json', () => {
  const flatten = (o: unknown, prefix = ''): Record<string, string> =>
    Object.entries(o as Record<string, unknown>).reduce<Record<string, string>>((acc, [k, v]) => {
      const p = prefix ? `${prefix}.${k}` : k
      if (typeof v === 'string') acc[p] = v
      else Object.assign(acc, flatten(v, p))
      return acc
    }, {})

  const en = flatten(JSON.parse(readFileSync(resolve(root, 'i18n/locales/en.json'), 'utf8')))
  const tr = flatten(JSON.parse(readFileSync(resolve(root, 'i18n/locales/tr.json'), 'utf8')))

  const unreviewed = new Map<string, { en: string; tr: string }>()
  for (const line of readFileSync(resolve(root, 'i18n/UNREVIEWED_TR.md'), 'utf8').split(/\r?\n/)) {
    const parts = line.split(' | ')
    if (parts.length !== 3 || parts[0] === 'key') continue
    unreviewed.set(parts[0]!.trim(), { en: parts[1]!.trim(), tr: parts[2]!.trim() })
  }

  const trCorpus = readdirSync(resolve(PKG, 'content/tr'))
    .map((f) => readFileSync(resolve(PKG, 'content/tr', f), 'utf8'))
    .join('\n')
    .toLowerCase()

  /** Same string in both languages on purpose (a company-register line that the TR md also gives in English). */
  const LANGUAGE_NEUTRAL = new Set(['footer.companyLine'])

  it('EN and TR have identical key sets and no empty values', () => {
    expect(Object.keys(tr).sort()).toEqual(Object.keys(en).sort())
    for (const [k, v] of [...Object.entries(en), ...Object.entries(tr)]) expect(v.trim(), k).not.toBe('')
  })

  it('has the required UI groups', () => {
    for (const k of [
      'skipLink',
      'language.label',
      'nav.home',
      'nav.allServices',
      'breadcrumbs.home',
      'breadcrumbs.allServices',
      'footer.servicesTitle',
      'footer.companyTitle',
      'footer.contactTitle',
      'form.labels.name',
      'form.briefHelp',
      'form.errorSummaryMany',
      'cookie.acceptAll',
    ]) {
      expect(en[k], k).toBeTruthy()
    }
    expect(Object.keys(en).filter((k) => k.startsWith('form.errors.'))).toHaveLength(7)
  })

  it('EN nav labels equal navigation.json', () => {
    const labels = navigationJson.primary.map((p) => p.label)
    expect([en['nav.home'], en['nav.services'], en['nav.howWeWork'], en['nav.whoWeWorkWith'], en['nav.about'], en['nav.contact']]).toEqual(labels)
    for (const s of navigationJson.services) {
      expect(en[`nav.serviceLinks.${s.href.replace('/services/', '')}`]).toBe(s.label)
    }
    expect([en['footer.legal.privacyPolicy'], en['footer.legal.cookiePolicy'], en['footer.legal.legalNotice']]).toEqual(
      navigationJson.legal.map((l) => l.label),
    )
  })

  it('TR service link labels equal the TR services page titles', () => {
    const services = useContent('services', 'tr').services
    for (const s of services) expect(tr[`nav.serviceLinks.${s.slug}`]).toBe(s.title)
  })

  it('every UNREVIEWED_TR.md row matches the json values (no drift)', () => {
    expect(unreviewed.size).toBeGreaterThan(20)
    for (const [k, row] of unreviewed) {
      expect(en[k], `${k} exists`).toBeDefined()
      expect(row.en, `${k} EN column`).toBe(en[k])
      expect(row.tr, `${k} TR column`).toBe(tr[k])
    }
  })

  it('every TR value is either listed as unreviewed or found verbatim in the TR package md', () => {
    const offenders: string[] = []
    for (const [k, v] of Object.entries(tr)) {
      if (unreviewed.has(k) || LANGUAGE_NEUTRAL.has(k)) continue
      if (!trCorpus.includes(v.toLowerCase())) offenders.push(`${k} = ${v}`)
    }
    expect(offenders).toEqual([])
  })
})
