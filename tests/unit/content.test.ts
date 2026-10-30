import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { useContent } from '../../app/composables/useContent'
import { brand, contactForm, navigation, serviceLabelBySlug, serviceOptionKeys, serviceSlugs, PAGE_KEYS } from '../../content/site'
import { UNREVIEWED_TR } from '../../content/tr/unreviewed'
import type { Locale, PageKey } from '../../content/types'
import { UNREVIEWED_UI_KEYS } from '../../i18n/unreviewed-ui'
import { renderUnreviewedMd } from '../../scripts/unreviewed-tr'

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

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)
/** Arrays whose elements all carry a string `id` (legal sections) are addressed by id, other arrays by index. */
const byId = (a: unknown[]) => a.length > 0 && a.every((x) => isObj(x) && typeof x.id === 'string')

interface Leaf {
  /** Dotted content path in the `UNREVIEWED_TR` format, e.g. `audiences[0].items[2]` or `sections[controller].paragraphs[0]`. */
  path: string
  value: string
}

function leafPaths(value: unknown, path = '', key = ''): Leaf[] {
  if (typeof value === 'string') return NON_COPY_KEYS.has(key) ? [] : [{ path, value: norm(value) }]
  if (Array.isArray(value)) {
    const ids = byId(value)
    return value.flatMap((v, i) => leafPaths(v, `${path}[${ids ? (v as { id: string }).id : i}]`, key))
  }
  if (isObj(value)) return Object.entries(value).flatMap(([k, v]) => leafPaths(v, path ? `${path}.${k}` : k, k))
  return []
}

/** The value at a `Leaf` path (see `leafPaths`), or undefined. */
function getAt(root: unknown, path: string): unknown {
  let cur: unknown = root
  for (const m of path.matchAll(/([^.[\]]+)|\[([^\]]+)\]/g)) {
    if (m[1] !== undefined) cur = isObj(cur) ? cur[m[1]] : undefined
    else if (Array.isArray(cur)) cur = byId(cur) ? cur.find((x) => (x as { id: string }).id === m[2]) : cur[Number(m[2])]
    else cur = undefined
  }
  return cur
}

const leaves = (value: unknown) => leafPaths(value).map((l) => l.value)

const unreviewedKey = (page: string, path: string) => `${page}|${path}`
const unreviewedByKey = new Map(UNREVIEWED_TR.map((e) => [unreviewedKey(e.page, e.path), e]))

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
      const rule = locale === 'en' ? 'is in the md' : 'is in the md or is a listed UNREVIEWED_TR translation'
      it(`${locale} ${key}: every md unit is in the content module, and every string in it ${rule}`, () => {
        const md = readMd(locale, key)
        const mdText = norm(md)
        const units = mdUnits(md)
        expect(units.length).toBeGreaterThan(3)
        const own = leafPaths(useContent(key, locale))
        const values = own.map((l) => l.value)

        const missing = units.filter((u) => !values.includes(u))
        expect(missing, 'md units missing from the content module').toEqual([])

        const listed = (l: Leaf) => locale === 'tr' && unreviewedByKey.has(unreviewedKey(key, l.path))
        const invented = own.filter((l) => !mdText.includes(l.value) && !listed(l)).map((l) => `${l.path}: ${l.value}`)
        expect(invented, 'content strings that are neither in the md nor listed in UNREVIEWED_TR').toEqual([])
      })
    }
  }
})

describe('UNREVIEWED_TR lists every translated TR string exactly', () => {
  it('has unique (page, path) entries on known pages, with non-empty text and no exclamation marks', () => {
    expect(UNREVIEWED_TR.length).toBeGreaterThan(0)
    expect(unreviewedByKey.size, 'duplicate (page, path) entries').toBe(UNREVIEWED_TR.length)
    for (const e of UNREVIEWED_TR) {
      expect(PAGE_KEYS, e.page).toContain(e.page)
      expect(e.en.trim(), `${e.page} ${e.path} en`).not.toBe('')
      expect(e.tr.trim(), `${e.page} ${e.path} tr`).not.toBe('')
      expect(e.tr, `${e.page} ${e.path} tr`).not.toContain('!')
    }
  })

  for (const key of PAGE_KEYS) {
    it(`${key}: each entry is the TR string at its path, translates the EN string at the same path, and is not approved md text`, () => {
      const tr = useContent(key, 'tr')
      const en = useContent(key, 'en')
      const mdText = norm(readMd('tr', key))
      for (const e of UNREVIEWED_TR.filter((x) => x.page === key)) {
        expect(getAt(tr, e.path), `${key} ${e.path} TR`).toBe(e.tr)
        expect(getAt(en, e.path), `${key} ${e.path} EN`).toBe(e.en)
        expect(mdText.includes(norm(e.tr)), `${key} ${e.path} is approved md text, do not list it`).toBe(false)
      }
    })
  }
})

interface ShapeDiff {
  path: string
  kind: 'EN only' | 'TR only' | 'length' | 'type'
}

function shapeDiff(en: unknown, tr: unknown, path = '', out: ShapeDiff[] = []): ShapeDiff[] {
  const join = (k: string) => (path ? `${path}.${k}` : k)
  if (Array.isArray(en) || Array.isArray(tr)) {
    if (!(Array.isArray(en) && Array.isArray(tr))) {
      out.push({ path, kind: 'type' })
      return out
    }
    if (byId(en) && byId(tr)) {
      const e = new Map((en as { id: string }[]).map((x) => [x.id, x]))
      const t = new Map((tr as { id: string }[]).map((x) => [x.id, x]))
      for (const id of e.keys()) if (!t.has(id)) out.push({ path: `${path}[${id}]`, kind: 'EN only' })
      for (const id of t.keys()) if (!e.has(id)) out.push({ path: `${path}[${id}]`, kind: 'TR only' })
      for (const [id, x] of e) if (t.has(id)) shapeDiff(x, t.get(id), `${path}[${id}]`, out)
      return out
    }
    if (en.length !== tr.length) out.push({ path, kind: 'length' })
    for (let i = 0; i < Math.min(en.length, tr.length); i++) shapeDiff(en[i], tr[i], `${path}[${i}]`, out)
    return out
  }
  if (isObj(en) && isObj(tr)) {
    for (const k of Object.keys(en)) {
      if (!(k in tr)) out.push({ path: join(k), kind: 'EN only' })
      else shapeDiff(en[k], tr[k], join(k), out)
    }
    for (const k of Object.keys(tr)) if (!(k in en)) out.push({ path: join(k), kind: 'TR only' })
    return out
  }
  if (typeof en !== typeof tr) out.push({ path, kind: 'type' })
  return out
}

/**
 * TR has the same shape as EN: every EN section, field and list (with the same length) exists in TR.
 * The only allowed difference is an extra TR-only field that holds approved TR md text the EN md has no
 * slot for (the TR md's condensed sentence of a list in `condensed`, its arrow line in `steps`, the
 * legal "Açık alanlar" section). A TR-only field may never hold a translation.
 */
describe('TR modules have the same shape as EN (no gaps)', () => {
  for (const key of PAGE_KEYS) {
    it(`${key}`, () => {
      const tr = useContent(key, 'tr')
      const diffs = shapeDiff(useContent(key, 'en'), tr)
      expect(diffs.filter((d) => d.kind !== 'TR only').map((d) => `${d.path}: ${d.kind}`)).toEqual([])

      const mdText = norm(readMd('tr', key))
      for (const d of diffs) {
        const lastKey = d.path.match(/([^.[\]]+)$/)?.[1] ?? ''
        for (const leaf of leafPaths(getAt(tr, d.path), d.path, lastKey)) {
          expect(unreviewedByKey.has(unreviewedKey(key, leaf.path)), `${leaf.path} is TR-only but translated`).toBe(false)
          expect(mdText.includes(leaf.value), `${leaf.path} is TR-only but not approved md text`).toBe(true)
        }
      }
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

  const unreviewed = new Set<string>(UNREVIEWED_UI_KEYS)

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

  it('every UNREVIEWED_UI_KEYS key exists in both json files, once', () => {
    expect(unreviewed.size).toBeGreaterThan(20)
    expect(unreviewed.size).toBe(UNREVIEWED_UI_KEYS.length)
    for (const k of unreviewed) {
      expect(en[k], `${k} EN`).toBeDefined()
      expect(tr[k], `${k} TR`).toBeDefined()
    }
  })

  it('form.serviceOptions.<serviceOptionKeys[i]> (EN) is contact_form.json service_options[i]', () => {
    expect(serviceOptionKeys).toHaveLength(contactForm.service_options.length)
    serviceOptionKeys.forEach((key, i) => {
      expect(en[`form.serviceOptions.${key}`], key).toBe(contactForm.service_options[i])
    })
  })

  it('the contact page service list equals the form option labels (minus "Other"), in both locales', () => {
    const labels = (msgs: Record<string, string>) =>
      serviceOptionKeys.filter((k) => k !== 'other').map((k) => msgs[`form.serviceOptions.${k}`])
    expect(useContent('contact', 'en').serviceOptions.items).toEqual(labels(en))
    expect(useContent('contact', 'tr').serviceOptions.items).toEqual(labels(tr))
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

describe('i18n/UNREVIEWED_TR.md', () => {
  it('is the committed output of scripts/unreviewed-tr.ts (run `npm run unreviewed:tr` after changing a translation)', () => {
    const committed = readFileSync(resolve(root, 'i18n/UNREVIEWED_TR.md'), 'utf8').replace(/\r\n/g, '\n')
    expect(committed).toBe(renderUnreviewedMd())
  })

  it('lists every page-copy entry and every UI key', () => {
    const md = renderUnreviewedMd()
    for (const e of UNREVIEWED_TR) expect(md, `${e.page} ${e.path}`).toContain(`\`${e.path}\``)
    for (const k of UNREVIEWED_UI_KEYS) expect(md, k).toContain(`\`${k}\``)
  })
})
