/**
 * Acceptance checks against the PRODUCTION BUILD (`.output/`). Not part of `npm test`: run
 * `npm run build && npm run test:acceptance`. Without `.output` the build-dependent tests fail with a message saying
 * so (they never pass silently on a missing build).
 *
 * 1. Forbidden claims (build spec §11, global constraints): no page of any locale (EN/TR/DE) contains a forbidden
 *    phrase, and claim-sensitive words (AI, platform, portal, dashboard, guarantee ...) only appear in text that is
 *    approved copy OF THAT PAGE: its package md (EN/TR, incl. Page Title / Meta Description), the flagged TR
 *    translations of its approved EN (content/tr/unreviewed.ts), or for DE (no package source) its flagged DE
 *    translations (content/de/unreviewed.ts). Checked: visible text runs, the `content`, `alt`, `aria-label` and
 *    `title` attributes, `<title>` and every JSON-LD string value.
 *    Pages: the prerendered HTML in `.output/public/**` plus all 45 routes rendered by the built server
 *    (`node .output/server/index.mjs` on a free port), since most pages are server-rendered on request.
 * 2. No source comment leaks: comment texts from app/, server/, i18n/ and content/ (`<!-- -->` in .vue, `//`,
 *    `/* *\/`; licence comments `/*!` excluded) never appear in `.output/public/**\/*.{html,js}`,
 *    `.output/server/**\/*.mjs` or the rendered pages.
 */
import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:net'
import { join, relative, resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ROUTES, routeNameForPath, type RouteName } from '../../i18n/routes'
import { UNREVIEWED_TR } from '../../content/tr/unreviewed'
import { UNREVIEWED_DE } from '../../content/de/unreviewed'
import { extractApprovedStrings, readPageMeta } from '../e2e/fidelity/extract'

const ROOT = resolve(import.meta.dirname, '../..')
const OUTPUT = join(ROOT, '.output')
const PUBLIC = join(OUTPUT, 'public')
const SERVER_ENTRY = join(OUTPUT, 'server', 'index.mjs')
const PKG = join(ROOT, 'MOESA_Website_Package_v1.0', 'MOESA_Website_Package_v1.0')
const PKG_CONTENT = join(PKG, 'content')

type Locale = 'en' | 'tr' | 'de'

function walk(dir: string, keep: (file: string) => boolean, skip: (dir: string) => boolean = () => false): string[] {
  if (!existsSync(dir)) return []
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      if (!skip(full)) out.push(...walk(full, keep, skip))
    } else if (keep(full)) out.push(full)
  }
  return out
}

function requireBuild() {
  if (!existsSync(SERVER_ENTRY) || !existsSync(PUBLIC)) {
    throw new Error(
      `No production build at ${OUTPUT}. These acceptance checks read the built site: run \`npm run build\` first, then \`npm run test:acceptance\`.`,
    )
  }
}

/** A port nobody is listening on (so a stale server can never answer for the build under test). */
function freePort(): Promise<number> {
  return new Promise((ok, fail) => {
    const srv = createServer()
    srv.once('error', fail)
    srv.listen(0, '127.0.0.1', () => {
      const { port } = srv.address() as { port: number }
      srv.close(() => ok(port))
    })
  })
}

const decode = (s: string) =>
  s
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;|&#34;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
const normalise = (s: string) => s.replace(/\s+/g, ' ').trim()
/** Case-insensitive with Turkish-safe folding (I/İ/ı/i all fold to i) so one phrase list fits all locales. */
const fold = (s: string) => normalise(s).toLowerCase().replace(/[İIı]/g, 'i').replace(/i̇/g, 'i')

/** The visible text runs of a page: the text between tags, outside <head>, <script>, <style> and <template>. */
function textRuns(html: string): string[] {
  const body = html.replace(/<head[\s\S]*?<\/head>/i, '').replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, '')
  return body
    .split(/<[^>]*>/)
    .map((t) => normalise(decode(t)))
    .filter(Boolean)
}

/** Text that is not a text node: `content`/`alt`/`aria-label`/`title` attribute values, `<title>`, JSON-LD strings. */
function attributeTexts(html: string): string[] {
  const out: string[] = []
  for (const m of html.matchAll(/\s(?:content|alt|aria-label|title)="([^"]*)"/gi)) out.push(m[1]!)
  for (const m of html.matchAll(/<title[^>]*>([\s\S]*?)<\/title>/gi)) out.push(m[1]!)
  for (const m of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    const walkJson = (v: unknown): void => {
      if (typeof v === 'string') out.push(v)
      else if (Array.isArray(v)) v.forEach(walkJson)
      else if (v && typeof v === 'object') Object.values(v).forEach(walkJson)
    }
    walkJson(JSON.parse(m[1]!))
  }
  return out.map((t) => normalise(decode(t))).filter(Boolean)
}

/** Phrases that must never appear anywhere in a built page (raw HTML incl. payload) or a client chunk. */
const FORBIDDEN = [
  // EN (spec §11, global constraints, Task 11 brief)
  'full compliance guaranteed',
  'guarantee full compliance',
  'assume all legal responsibility',
  'all legal responsibility',
  'every country',
  'Flexible on Details',
  'lorem',
  'ipsum',
  'MOESA OS',
  'client portal',
  'customer portal',
  // TR equivalents
  'tam uyum garanti',
  'tam uyumu garanti',
  'tüm yasal sorumluluğu',
  'tüm yasal sorumluluk',
  'her ülkede',
  'müşteri portal',
  // DE equivalents (our translation of the EN claims)
  'volle Compliance garantiert',
  'vollständige Compliance garantiert',
  'Compliance wird garantiert',
  'Konformität garantiert',
  'gesamte rechtliche Verantwortung',
  'sämtliche rechtliche Verantwortung',
  'jegliche rechtliche Verantwortung',
  'alle rechtliche Verantwortung',
  'in jedem Land',
  'in allen Ländern',
  'Kundenportal',
]

/**
 * Claim-sensitive words. A text containing one must be approved text of its own page (see the file header). The
 * approved md only uses them as roadmap or disclaimer wording ("AI-assisted analysis ... roadmap capabilities",
 * "Not a software platform", "cannot be guaranteed").
 */
const SENSITIVE = /\bAI\b|yapay zek|\bplatform|plattform|portal|dashboard|guarant|garanti|\bcertif|sertifika|zertifi/i
/** German "KI" (AI), case-sensitive so that the Turkish word "ki" does not count. */
const SENSITIVE_CASED = /\bKI\b/
const isSensitive = (run: string) => SENSITIVE.test(run) || SENSITIVE_CASED.test(run)

/**
 * A text matches when it IS one approved string, or is a sentence-sized part of one (at least MIN_PART characters:
 * pages split an approved paragraph at a sentence boundary, e.g. the Home team cards). A short run like "AI" or
 * "Platform" therefore only passes as a whole approved string, never because the word occurs somewhere.
 */
const MIN_PART = 25
function isApproved(text: string, approved: string[]): boolean {
  const t = fold(text)
  return approved.some((a) => a === t || (t.length >= MIN_PART && a.includes(t)))
}

const PAGE_MAP: { URL: string; 'English File': string; 'Turkish File': string }[] = JSON.parse(
  readFileSync(join(PKG, 'data', 'page_map.json'), 'utf8'),
)
const mdOf = (name: RouteName, locale: 'en' | 'tr') => {
  const row = PAGE_MAP.find((r) => routeNameForPath(r.URL) === name)
  if (!row) throw new Error(`page_map.json has no row for ${name}`)
  return join(PKG_CONTENT, locale, locale === 'en' ? row['English File'] : row['Turkish File'])
}

/**
 * Pages that show approved sections of another page (documented in the task reports): Services reuses the Home
 * needs and capability strip; service pages reuse the Home process section; About's hero note is the Home EU line.
 */
const SHARED: Partial<Record<RouteName, RouteName[]>> = {
  services: ['home'],
  'services/sourcing-managed-procurement': ['home', 'services'],
  'services/product-private-label-development': ['home', 'services'],
  'services/market-access-commercial-representation': ['home', 'services'],
  'services/operations-supply-chain': ['home', 'services'],
  'services/digital-commerce-commercial-intelligence': ['home', 'services'],
  about: ['home'],
}

function ownApproved(name: RouteName, locale: Locale): string[] {
  if (locale === 'de') return UNREVIEWED_DE.filter((u) => u.page === name).map((u) => u.de)
  const md = mdOf(name, locale)
  const meta = readPageMeta(md)
  const strings = [...extractApprovedStrings(md), meta.title, meta.description]
  if (locale === 'tr') strings.push(...UNREVIEWED_TR.filter((u) => u.page === name).map((u) => u.tr))
  return strings
}

/** The approved strings a page may show: its own plus those of the pages it reuses, folded. */
function approvedFor(name: RouteName, locale: Locale): string[] {
  const site = locale === 'de' ? UNREVIEWED_DE.filter((u) => u.page === 'site').map((u) => u.de) : []
  return [name, ...(SHARED[name] ?? [])].flatMap((n) => ownApproved(n, locale)).concat(site).map(fold)
}

const PAGE_LIST = (Object.entries(ROUTES) as [RouteName, Record<Locale, string>][]).flatMap(([name, p]) =>
  (['en', 'tr', 'de'] as const).map((locale) => ({ name, locale, path: p[locale] })),
)
const PAGE_PATHS = PAGE_LIST.map((p) => p.path)

let server: ChildProcess | undefined
const pages = new Map<string, string>()
let buildError: Error | undefined

beforeAll(async () => {
  try {
    requireBuild()
  } catch (e) {
    buildError = e as Error
    return
  }
  for (const file of walk(PUBLIC, (f) => f.endsWith('.html'))) {
    pages.set(`public/${relative(PUBLIC, file).replace(/\\/g, '/')}`, readFileSync(file, 'utf8'))
  }
  const port = await freePort()
  const base = `http://127.0.0.1:${port}`
  // Nothing may answer on the port before we start the build under test.
  const stale = await fetch(base + '/robots.txt').then(
    () => true,
    () => false,
  )
  if (stale) throw new Error(`Port ${port} already answers: refusing to test a server that is not this build.`)
  let exited: string | undefined
  let stderr = ''
  server = spawn(process.execPath, [SERVER_ENTRY], {
    env: { ...process.env, PORT: String(port), NITRO_PORT: String(port), NITRO_HOST: '127.0.0.1' },
    stdio: ['ignore', 'ignore', 'pipe'],
  })
  server.stderr?.on('data', (d) => (stderr += String(d)))
  server.once('exit', (code, signal) => (exited = `exited (code ${code}, signal ${signal})`))
  const deadline = Date.now() + 30_000
  for (;;) {
    if (exited) throw new Error(`The built server ${exited} before answering on port ${port}.\n${stderr}`)
    try {
      await fetch(base + '/robots.txt')
      break
    } catch {
      if (Date.now() > deadline) throw new Error(`The built server did not start on port ${port}.\n${stderr}`)
      await new Promise((r) => setTimeout(r, 250))
    }
  }
  for (const path of PAGE_PATHS) {
    const res = await fetch(base + path)
    if (res.status !== 200) throw new Error(`GET ${path} returned ${res.status}`)
    pages.set(`ssr:${path}`, await res.text())
  }
  if (exited) throw new Error(`The built server ${exited} during the run.\n${stderr}`)
}, 120_000)

afterAll(() => {
  server?.kill()
})

describe('forbidden claims (built site, EN + TR + DE)', () => {
  it('the production build exists', () => {
    if (buildError) throw buildError
    expect(pages.size).toBeGreaterThanOrEqual(PAGE_PATHS.length)
  })

  it('renders all 45 routes from the built server', () => {
    if (buildError) throw buildError
    expect(PAGE_PATHS).toHaveLength(45)
    for (const p of PAGE_PATHS) expect(pages.has(`ssr:${p}`), p).toBe(true)
  })

  it('the forbidden phrases are not approved copy (so zero matches is the expectation)', () => {
    const md = fold(
      walk(PKG_CONTENT, (f) => f.endsWith('.md'))
        .map((f) => readFileSync(f, 'utf8'))
        .join('\n'),
    )
    expect(FORBIDDEN.filter((p) => md.includes(fold(p)))).toEqual([])
  })

  it('no page contains a forbidden phrase', () => {
    if (buildError) throw buildError
    const hits: string[] = []
    for (const [name, html] of pages) {
      const text = fold(decode(html))
      for (const phrase of FORBIDDEN) if (text.includes(fold(phrase))) hits.push(`${name}: "${phrase}"`)
    }
    expect(hits).toEqual([])
  })

  it('no client chunk contains a forbidden phrase', () => {
    if (buildError) throw buildError
    const hits: string[] = []
    for (const file of walk(PUBLIC, (f) => f.endsWith('.js'))) {
      const text = fold(readFileSync(file, 'utf8'))
      for (const phrase of FORBIDDEN) if (text.includes(fold(phrase))) hits.push(`${relative(OUTPUT, file)}: "${phrase}"`)
    }
    expect(hits).toEqual([])
  })

  it('the approved-text matcher is run-level, not a corpus substring', () => {
    const approved = ['the operating model is designed for ai-assisted analysis. these are roadmap capabilities.']
    expect(isApproved('The operating model is designed for AI-assisted analysis.', approved)).toBe(true)
    expect(isApproved('AI', approved)).toBe(false)
    expect(isApproved('AI-assisted', approved)).toBe(false)
    expect(isApproved('Our AI platform is available now.', approved)).toBe(false)
  })

  it('claim-sensitive words appear only in approved text of the same page (text, attributes, JSON-LD)', () => {
    if (buildError) throw buildError
    const hits = new Set<string>()
    let checked = 0
    for (const { name, locale, path } of PAGE_LIST) {
      const html = pages.get(`ssr:${path}`)!
      const approved = approvedFor(name, locale)
      for (const [kind, texts] of [
        ['text', textRuns(html)],
        ['attr', attributeTexts(html)],
      ] as const) {
        for (const t of texts) {
          if (!isSensitive(t)) continue
          checked++
          if (!isApproved(t, approved)) hits.add(`${path} (${kind}): "${t}"`)
        }
      }
    }
    expect([...hits]).toEqual([])
    // The approved roadmap/disclaimer sentences are on the pages, so the check is not vacuous.
    expect(checked).toBeGreaterThan(0)
  })
})

/** Minimum length of a comment line that is checked (shorter ones are too generic to be evidence). */
const MIN_COMMENT = 16
const QUOTED_ONLY = /^"[^"]*"$/

/** Comment texts of a source file: each trimmed line of every comment, at least MIN_COMMENT characters. */
function commentTexts(source: string, isVue: boolean): string[] {
  const out: string[] = []
  const add = (block: string) => {
    for (const raw of block.split(/\r?\n/)) {
      const line = normalise(raw.replace(/^\s*\*+\s?/, ''))
      // A comment that is only a quoted literal (`/** "One service or an integrated mandate." */` labelling a
      // content field) quotes the copy it sits on, which ships as page text by design: not comment prose.
      if (QUOTED_ONLY.test(line)) continue
      if (line.length >= MIN_COMMENT) out.push(line)
    }
  }
  if (isVue) for (const m of source.matchAll(/<!--([\s\S]*?)-->/g)) add(m[1]!)
  for (const m of source.matchAll(/\/\*(?!!)([\s\S]*?)\*\//g)) add(m[1]!)
  for (const line of source.split(/\r?\n/)) {
    // `//` at line start or after whitespace/punctuation; `https://` (preceded by ':') is not a comment.
    const m = /(?:^|[\s;{}(),])\/\/(?!\/)\s?(.*)$/.exec(line)
    if (m) add(m[1]!)
  }
  return out
}

interface Output {
  file: string
  text: string
}

/** Every comment (text → source file) that occurs in one of the outputs, as `src: "comment" -> output`. */
function findLeaks(comments: Map<string, string>, outputs: Output[]): string[] {
  const leaks: string[] = []
  for (const [comment, src] of comments) {
    const at = outputs.find((o) => o.text.includes(comment))
    if (at) leaks.push(`${src}: "${comment}" -> ${at.file}`)
  }
  return leaks
}

const SOURCE_DIRS = ['app', 'server', 'i18n', 'content']

describe('no source comment leaks into the build', () => {
  it('extracts comments from sources', () => {
    expect(commentTexts('<!-- Visually hidden: the form -->\nconst a = 1 // trailing comment text\n', true)).toEqual([
      'Visually hidden: the form',
      'trailing comment text',
    ])
    expect(commentTexts("const u = 'https://www.moesaltd.com/x' /*! licence text kept */", false)).toEqual([])
    expect(commentTexts('/** "One service or an integrated mandate." */', false)).toEqual([])
  })

  it('flags a planted comment that reaches an output, and only that one', () => {
    const source = [
      '/** Planted acceptance comment 7f3c9a: must be detected */',
      'export const x = 1 // another planted line that never ships',
    ].join('\n')
    const comments = new Map(commentTexts(source, false).map((c) => [c, 'planted.ts'] as const))
    const outputs: Output[] = [
      { file: 'public/_nuxt/chunk.js', text: 'var x=1;/* Planted acceptance comment 7f3c9a: must be detected */' },
      { file: 'server/chunks/a.mjs', text: 'const x=1;' },
    ]
    expect(findLeaks(comments, outputs)).toEqual([
      'planted.ts: "Planted acceptance comment 7f3c9a: must be detected" -> public/_nuxt/chunk.js',
    ])
  })

  it('no comment text from app/, server/, i18n/, content/ appears in .output public html/js, server mjs or pages', () => {
    if (buildError) throw buildError
    const sources = SOURCE_DIRS.flatMap((d) =>
      walk(join(ROOT, d), (f) => /\.(vue|ts|mjs|js)$/.test(f), (dir) => dir.endsWith('node_modules')),
    )
    const comments = new Map<string, string>()
    for (const file of sources) {
      for (const c of commentTexts(readFileSync(file, 'utf8'), file.endsWith('.vue'))) {
        if (!comments.has(c)) comments.set(c, relative(ROOT, file).replace(/\\/g, '/'))
      }
    }
    expect(comments.size).toBeGreaterThan(100)

    const outputs: Output[] = [
      ...walk(PUBLIC, (f) => /\.(html|js)$/.test(f)),
      ...walk(join(OUTPUT, 'server'), (f) => f.endsWith('.mjs'), (d) => d.endsWith('node_modules')),
    ].map((f) => ({ file: relative(OUTPUT, f).replace(/\\/g, '/'), text: normalise(readFileSync(f, 'utf8')) }))
    // Server-rendered pages are not files in .output: include the rendered HTML of all routes too.
    for (const [name, html] of pages) if (name.startsWith('ssr:')) outputs.push({ file: name, text: normalise(html) })

    expect(findLeaks(comments, outputs)).toEqual([])
  })
})
