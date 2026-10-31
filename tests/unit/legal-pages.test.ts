import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeAll, describe, expect, it } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import PrivacyPage from '~/pages/privacy-policy.vue'
import CookiePage from '~/pages/cookie-policy.vue'
import LegalNoticePage from '~/pages/legal-notice.vue'
import { content as en } from '#content/en'
import { content as tr } from '#content/tr'
import { content as de } from '#content/de'
import type { LegalContent } from '#content/en/legal'

beforeAll(addPageStubs)

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>

const mountAt = async (component: unknown, route: string) => {
  const w = await mountSuspended(component as never, { route })
  await flushPromises()
  return w
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
const sections = (w: Wrapper) => [...w.element.children].filter((el) => el.tagName === 'SECTION')
const BG = ['bg-white', 'bg-mist', 'bg-pale', 'bg-navy-dark'] as const
const bgOf = (el: Element) => BG.find((c) => el.classList.contains(c)) ?? 'none'
const OPEN_PREFIX = 'OPEN / AÇIK - '

const PAGES = [
  { key: 'privacy-policy', component: PrivacyPage, en: '/privacy-policy', tr: '/tr/gizlilik-politikasi', de: '/de/datenschutz' },
  { key: 'cookie-policy', component: CookiePage, en: '/cookie-policy', tr: '/tr/cerez-politikasi', de: '/de/cookie-richtlinie' },
  { key: 'legal-notice', component: LegalNoticePage, en: '/legal-notice', tr: '/tr/yasal-bildirim', de: '/de/impressum' },
] as const

/** The OPEN chip label per locale (`status.open`, uppercased by CSS): it stands in for the md marker "OPEN / AÇIK". */
const OPEN_LABEL = { en: 'Open', tr: 'Açık', de: 'Offen' } as const
/** An OPEN item is shown as the chip plus the md sentence after the marker. */
const display = (t: string) => (t.startsWith(OPEN_PREFIX) ? t.slice(OPEN_PREFIX.length) : t)
/** Every display string of a section, as the page must show it. */
const sectionStrings = (s: LegalContent['sections'][number]) => [s.title, ...(s.paragraphs ?? []), ...(s.items ?? [])].map(display)

/** Every OPEN item: one `[data-open]` note per md OPEN paragraph, chip in the page locale, then the md sentence. */
async function expectOpenNotes(w: Wrapper, c: LegalContent, locale: keyof typeof OPEN_LABEL) {
  const opens = c.sections.flatMap((s) => s.paragraphs ?? []).filter((t) => t.startsWith(OPEN_PREFIX))
  const rendered = w.findAll('[data-open]')
  expect(rendered).toHaveLength(opens.length)
  expect(opens.length).toBeGreaterThan(0)
  rendered.forEach((el, i) => {
    expect(el.find('[data-chip="open"]').text()).toBe(OPEN_LABEL[locale])
    expect(norm(el.text())).toBe(`${OPEN_LABEL[locale]} - ${display(opens[i]!)}`)
  })
}

for (const p of PAGES) {
  describe(`${p.key} (EN ${p.en})`, () => {
    const c = en[p.key] as LegalContent

    it('has one h1 (the md hero title), no <main>, and the lead', async () => {
      const w = await mountAt(p.component, p.en)
      expect(w.findAll('h1')).toHaveLength(1)
      expect(norm(w.find('h1').text())).toBe(c.hero.title)
      expect(norm(w.text())).toContain(c.hero.body)
      expect(w.find('main').exists()).toBe(false)
    })

    it('alternates backgrounds and ends with the navy final CTA of the md', async () => {
      const w = await mountAt(p.component, p.en)
      const bgs = sections(w).map(bgOf)
      expect(bgs).not.toContain('none')
      for (let i = 1; i < bgs.length; i++) expect(bgs[i]).not.toBe(bgs[i - 1])
      const last = sections(w).at(-1)!
      expect(bgOf(last)).toBe('bg-navy-dark')
      expect(norm(last.querySelector('h2')!.textContent!)).toBe(c.finalCta.title)
      expect(last.querySelector('a')!.getAttribute('href')).toBe('/contact')
    })

    it('shows the breadcrumbs Home / <title>', async () => {
      const w = await mountAt(p.component, p.en)
      expect(norm(w.find('[data-legal-crumbs] nav').text())).toBe(`Home/${c.hero.title}`)
    })

    it('shows the md status as the Draft chip text', async () => {
      const w = await mountAt(p.component, p.en)
      const status = w.find('[data-legal-status]')
      expect(status.attributes('role')).toBe('note')
      expect(norm(status.text())).toContain(c.status)
    })

    it('renders every approved md section (h2 + all text) in md order', async () => {
      const w = await mountAt(p.component, p.en)
      const h2s = w.findAll('[data-legal-section] h2').map((h) => norm(h.text()))
      expect(h2s).toEqual(c.sections.map((s) => s.title))
      const text = norm(w.find('[data-legal-page]').text())
      for (const s of c.sections) for (const str of sectionStrings(s)) expect(text).toContain(str)
    })

    it('marks every OPEN item with the EN "Open" chip (the md marker), followed by the md sentence', async () => {
      await expectOpenNotes(await mountAt(p.component, p.en), c, 'en')
    })

    it('centres the article in the site container (DESIGN_NOTES §7.5)', async () => {
      const w = await mountAt(p.component, p.en)
      const article = w.find('article[data-legal-page]')
      expect(article.element.closest('.container-site')).not.toBeNull()
    })
  })

  describe(`${p.key} (TR ${p.tr})`, () => {
    const c = tr[p.key] as LegalContent
    const openFields = c.sections.find((s) => s.id === 'openFields')!

    it('has the TR h1, the TR status, and the TR final CTA to /tr/iletisim', async () => {
      const w = await mountAt(p.component, p.tr)
      expect(w.findAll('h1')).toHaveLength(1)
      expect(norm(w.find('h1').text())).toBe(c.hero.title)
      expect(norm(w.find('[data-legal-status]').text())).toContain(c.status)
      const last = sections(w).at(-1)!
      expect(last.querySelector('a')!.getAttribute('href')).toBe('/tr/iletisim')
      expect(norm(w.find('[data-legal-crumbs] nav').text())).toBe(`Ana Sayfa/${c.hero.title}`)
    })

    it('shows the approved "Açık alanlar" once, as the summary block under the status, not as a section', async () => {
      const w = await mountAt(p.component, p.tr)
      const block = w.find('[data-open-fields]')
      expect(norm(block.find('h2').text())).toBe(openFields.title)
      expect(norm(block.text())).toContain(openFields.paragraphs![0])
      const text = norm(w.text())
      expect(text.split(openFields.paragraphs![0]!).length - 1).toBe(1)
      const h2s = w.findAll('[data-legal-section] h2').map((h) => norm(h.text()))
      expect(h2s).toEqual(c.sections.filter((s) => s.id !== 'openFields').map((s) => s.title))
    })

    it('renders the translated sections, with the approved condensed line above the translated list or values', async () => {
      const w = await mountAt(p.component, p.tr)
      const text = norm(w.find('[data-legal-page]').text())
      for (const s of c.sections.filter((x) => x.id !== 'openFields')) for (const str of sectionStrings(s)) expect(text).toContain(str)
      for (const s of c.sections.filter((x) => x.condensed)) {
        const sec = w.find(`[data-legal-section="${s.id}"]`)
        expect(norm(sec.find('[data-condensed]').text())).toBe(s.condensed)
      }
    })

    it('marks every OPEN item with the TR "Açık" chip', async () => {
      await expectOpenNotes(await mountAt(p.component, p.tr), c, 'tr')
      const w = await mountAt(p.component, p.tr)
      expect(w.find('[data-open-fields] [data-chip="open"]').text()).toBe('Açık')
    })
  })

  describe(`${p.key} (DE ${p.de})`, () => {
    const c = de[p.key] as LegalContent

    it('has the DE h1, the md status in the draft chip, every section, and the "Offen" chip on every OPEN item', async () => {
      const w = await mountAt(p.component, p.de)
      expect(norm(w.find('h1').text())).toBe(c.hero.title)
      expect(norm(w.find('[data-legal-status]').text())).toContain(c.status)
      const text = norm(w.find('[data-legal-page]').text())
      for (const s of c.sections) for (const str of sectionStrings(s)) expect(text).toContain(str)
      await expectOpenNotes(w, c, 'de')
      expect(sections(w).at(-1)!.querySelector('a')!.getAttribute('href')).toBe('/de/kontakt')
    })
  })
}

describe('TR legal notice approved one-line forms', () => {
  it('shows the approved "Şirket" and "İletişim" lines above the per-line values', async () => {
    const w = await mountAt(LegalNoticePage, '/tr/yasal-bildirim')
    expect(norm(w.find('[data-legal-section="operator"] [data-condensed]').text())).toBe(
      'MOESA LTD. | 1 Petyofi Str., Plovdiv 4000, Bulgaria | Company ID 207200475 | VAT BG207200475',
    )
    expect(norm(w.find('[data-legal-section="contact"] [data-condensed]').text())).toBe('info@moesaltd.com | +359 88 501 661')
  })
})

describe('cookie policy consent panel', () => {
  it('EN: the in-page settings panel is always shown, and the moesa_consent cookie is listed as strictly necessary', async () => {
    const w = await mountAt(CookiePage, '/cookie-policy')
    expect(w.find('[data-cookie-consent]').exists()).toBe(true)
    const inv = w.find('[data-cookie-inventory]')
    expect(inv.text()).toContain('moesa_consent')
    expect(inv.text()).toContain('Strictly necessary')
    expect(inv.text()).toContain('180')
    // The OPEN inventory marker stays: the final table is still open.
    expect(w.find('[data-legal-section="inventory"] [data-open]').exists()).toBe(true)
  })

  it('TR: the panel and the inventory row are shown in Turkish', async () => {
    const w = await mountAt(CookiePage, '/tr/cerez-politikasi')
    expect(w.find('[data-cookie-consent]').exists()).toBe(true)
    expect(w.find('[data-cookie-inventory]').text()).toContain('moesa_consent')
  })
})
