// @vitest-environment node
/**
 * Acceptance checks against the PRODUCTION BUILD (`.output/`). Run `npm run build` first: without `.output`
 * the suite fails with a message saying so (it never passes silently on a missing or partial build).
 *
 * 1. Forbidden claims (build spec §11, global constraints): no page of any locale (EN/TR/DE) contains a forbidden phrase,
 *    and claim-sensitive words (AI, platform, portal, dashboard, guarantee ...) only appear inside text that is
 *    approved copy (package md, EN or TR) or a flagged TR/DE translation of approved EN (content/{tr,de}/unreviewed.ts).
 *    Pages: the prerendered HTML in `.output/public/**` plus every one of the 45 routes rendered by the built
 *    server (`node .output/server/index.mjs`), since most pages are server-rendered on request, not prerendered.
 * 2. No source comment leaks: comment texts from app/**\/*.{vue,ts} (`<!-- -->`, `//`, `/* *\/`; licence
 *    comments `/*!` excluded) never appear in `.output/public/**\/*.{html,js}` or `.output/server/**\/*.mjs`.
 */
import { spawn, type ChildProcess } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { ROUTES } from '../../i18n/routes'
import { UNREVIEWED_TR } from '../../content/tr/unreviewed'
import { UNREVIEWED_DE } from '../../content/de/unreviewed'

const ROOT = resolve(import.meta.dirname, '../..')
const OUTPUT = join(ROOT, '.output')
const PUBLIC = join(OUTPUT, 'public')
const SERVER_ENTRY = join(OUTPUT, 'server', 'index.mjs')
const PKG_CONTENT = join(ROOT, 'MOESA_Website_Package_v1.0', 'MOESA_Website_Package_v1.0', 'content')
const PORT = 3191

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
      `No production build at ${OUTPUT}. These acceptance checks read the built site: run \`npm run build\` first, then \`npx vitest run tests/unit/claims.test.ts\`.`,
    )
  }
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
/** Case-insensitive with Turkish-safe folding (I/İ/ı/i all fold to i) so one phrase list fits both locales. */
const fold = (s: string) => normalise(s).toLowerCase().replace(/[İIı]/g, 'i').replace(/i̇/g, 'i')

/** The visible text runs of a page: the text between tags, outside <script>, <style> and <head>. */
function textRuns(html: string): string[] {
  const body = html.replace(/<head[\s\S]*?<\/head>/i, '').replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, '')
  return body
    .split(/<[^>]*>/)
    .map((t) => normalise(decode(t)))
    .filter(Boolean)
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
 * Claim-sensitive words. A text run containing one must be approved text, i.e. occur verbatim in the approved
 * corpus (package md EN/TR, or our flagged TR translation of an approved EN string). The approved md only uses
 * them as roadmap or disclaimer wording ("AI-assisted analysis ... roadmap capabilities", "Not a software
 * platform", "cannot be guaranteed").
 */
const SENSITIVE = /\bAI\b|yapay zek|\bplatform|plattform|portal|dashboard|guarant|garanti|\bcertif|sertifika|zertifi/i
/** German "KI" (AI), case-sensitive so that the Turkish word "ki" does not count. */
const SENSITIVE_CASED = /\bKI\b/
const isSensitive = (run: string) => SENSITIVE.test(run) || SENSITIVE_CASED.test(run)

const mdFiles = (locale: 'en' | 'tr') =>
  readdirSync(join(PKG_CONTENT, locale))
    .filter((f) => f.endsWith('.md'))
    .map((f) => join(PKG_CONTENT, locale, f))
const approvedMd = [...mdFiles('en'), ...mdFiles('tr')].map((f) => readFileSync(f, 'utf8'))
/** md with its markup removed (emphasis, link targets, list markers), folded. */
const approvedCorpus = fold(
  [
    ...approvedMd.map((md) =>
      md
        .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
        .replace(/\*\*|__|`/g, '')
        .replace(/^\s*(?:[-*]|\d+\.|#+)\s+/gm, ''),
    ),
    ...UNREVIEWED_TR.map((u) => u.tr),
    ...UNREVIEWED_DE.map((u) => u.de),
  ].join('\n'),
)

const PAGE_PATHS = Object.values(ROUTES).flatMap((p) => [p.en, p.tr, p.de])

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
  server = spawn(process.execPath, [SERVER_ENTRY], {
    env: { ...process.env, PORT: String(PORT), NITRO_PORT: String(PORT), NITRO_HOST: '127.0.0.1' },
    stdio: 'ignore',
  })
  const base = `http://127.0.0.1:${PORT}`
  const deadline = Date.now() + 30_000
  for (;;) {
    try {
      await fetch(base + '/robots.txt')
      break
    } catch {
      if (Date.now() > deadline) throw new Error(`The built server did not start on port ${PORT}.`)
      await new Promise((r) => setTimeout(r, 250))
    }
  }
  for (const path of PAGE_PATHS) {
    const res = await fetch(base + path)
    if (res.status !== 200) throw new Error(`GET ${path} returned ${res.status}`)
    pages.set(`ssr:${path}`, await res.text())
  }
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
    const md = fold(approvedMd.join('\n'))
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

  it('claim-sensitive words (AI, platform, portal, guarantee ...) appear only inside approved text', () => {
    if (buildError) throw buildError
    const hits = new Set<string>()
    let checked = 0
    for (const [name, html] of pages) {
      for (const run of textRuns(html)) {
        if (!isSensitive(run)) continue
        checked++
        if (!approvedCorpus.includes(fold(run))) hits.add(`${name}: "${run}"`)
      }
    }
    expect([...hits]).toEqual([])
    // The approved roadmap/disclaimer sentences are on the pages, so the check is not vacuous.
    expect(checked).toBeGreaterThan(0)
  })
})

/** Minimum length of a comment line that is checked (shorter ones are too generic to be evidence). */
const MIN_COMMENT = 16

/** Comment texts of a source file: each trimmed line of every comment, longer than MIN_COMMENT - 1. */
function commentTexts(source: string, isVue: boolean): string[] {
  const out: string[] = []
  const add = (block: string) => {
    for (const raw of block.split(/\r?\n/)) {
      const line = normalise(raw.replace(/^\s*\*+\s?/, ''))
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

describe('no source comment leaks into the build', () => {
  it('extracts comments from app sources', () => {
    expect(commentTexts('<!-- Visually hidden: the form -->\nconst a = 1 // trailing comment text\n', true)).toEqual([
      'Visually hidden: the form',
      'trailing comment text',
    ])
    expect(commentTexts("const u = 'https://www.moesaltd.com/x' /*! licence text kept */", false)).toEqual([])
  })

  it('no comment text from app/**/*.{vue,ts} appears in .output public html/js or server mjs', () => {
    if (buildError) throw buildError
    const sources = walk(join(ROOT, 'app'), (f) => /\.(vue|ts)$/.test(f))
    const comments = new Map<string, string>()
    for (const file of sources) {
      for (const c of commentTexts(readFileSync(file, 'utf8'), file.endsWith('.vue'))) {
        if (!comments.has(c)) comments.set(c, relative(ROOT, file).replace(/\\/g, '/'))
      }
    }
    expect(comments.size).toBeGreaterThan(50)

    const outputs = [
      ...walk(PUBLIC, (f) => /\.(html|js)$/.test(f)),
      ...walk(join(OUTPUT, 'server'), (f) => f.endsWith('.mjs'), (d) => d.endsWith('node_modules')),
    ].map((f) => ({ file: relative(OUTPUT, f).replace(/\\/g, '/'), text: normalise(readFileSync(f, 'utf8')) }))
    // Server-rendered pages are not files in .output: include the rendered HTML of all 30 routes too.
    for (const [name, html] of pages) if (name.startsWith('ssr:')) outputs.push({ file: name, text: normalise(html) })

    const leaks: string[] = []
    for (const [comment, src] of comments) {
      const at = outputs.find((o) => o.text.includes(comment))
      if (at) leaks.push(`${src}: "${comment}" -> ${at.file}`)
    }
    expect(leaks).toEqual([])
  })
})
