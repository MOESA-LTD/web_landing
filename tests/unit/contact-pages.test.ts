import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import ContactPage from '~/pages/contact.vue'
import ThankYouPage from '~/pages/thank-you.vue'
import { content as en } from '#content/en'
import { content as tr } from '#content/tr'
import { brand } from '#content/site'

beforeAll(addPageStubs)

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>

const mountAt = async (component: unknown, route: string) => {
  const w = await mountSuspended(component as never, { route })
  await flushPromises()
  return w
}

const BG = ['bg-white', 'bg-mist', 'bg-pale', 'bg-navy-dark'] as const
const sections = (w: Wrapper) => [...w.element.children].filter((el) => el.tagName === 'SECTION')
const bgOf = (el: Element) => BG.find((c) => el.classList.contains(c)) ?? 'none'
const expectAlternatingBackgrounds = (w: Wrapper) => {
  const bgs = sections(w).map(bgOf)
  expect(bgs.length).toBeGreaterThan(1)
  expect(bgs, bgs.join(', ')).not.toContain('none')
  for (let i = 1; i < bgs.length; i++) expect(bgs[i], bgs.join(', ')).not.toBe(bgs[i - 1])
}
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
/** Text of an element with its block children separated by spaces (as the browser's innerText would show it). */
const blockText = (el: Element) => norm([...el.querySelectorAll('h2, h3, p, a')].map((e) => e.textContent).join(' '))
const lastSectionLinks = (w: Wrapper) =>
  [...sections(w).at(-1)!.querySelectorAll('a')].map((a) => [norm(a.textContent!), a.getAttribute('href')])

describe('contact (EN /contact)', () => {
  const c = en.contact

  it('has one h1 (the hero), no <main>, alternating backgrounds and a navy final band', async () => {
    const w = await mountAt(ContactPage, '/contact')
    expect(w.findAll('h1')).toHaveLength(1)
    expect(norm(w.find('h1').text())).toBe(c.hero.title)
    expect(w.text()).toContain(c.hero.body)
    expect(w.find('main').exists()).toBe(false)
    expectAlternatingBackgrounds(w)
    expect(bgOf(sections(w).at(-1)!)).toBe('bg-navy-dark')
  })

  it('shows the breadcrumbs Home / Contact', async () => {
    const w = await mountAt(ContactPage, '/contact')
    const crumbs = w.find('nav[aria-label="Breadcrumb"]')
    expect(norm(crumbs.text())).toMatch(/Home.*Contact/)
  })

  it('renders the project form beside the aside', async () => {
    const w = await mountAt(ContactPage, '/contact')
    const section = w.find('[data-project-brief]')
    expect(section.find('form#project-form').exists()).toBe(true)
    expect(section.find('aside').exists()).toBe(true)
  })

  it('labels the band with the form card visually hidden h2 (h1 → h2 → h3) and the aside with "Direct contact"', async () => {
    const w = await mountAt(ContactPage, '/contact')
    const section = w.find('[data-project-brief]')
    const h2 = w.find('#contact-form-title')
    expect(h2.element.tagName).toBe('H2')
    expect(h2.classes()).toContain('sr-only')
    expect(norm(h2.text())).toBe('Project form')
    expect(section.attributes('aria-labelledby')).toBe('contact-form-title')
    // The h2 precedes the form (whose group heading is an h3).
    expect(h2.element.compareDocumentPosition(w.find('form h3').element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(w.find('aside').attributes('aria-labelledby')).toBe('contact-direct')
    expect(norm(w.find('#contact-direct').text())).toBe(c.direct.title)
  })

  it('aside: "Direct contact" with mailto and tel links, the address and the company details', async () => {
    const w = await mountAt(ContactPage, '/contact')
    const direct = w.find('[data-direct-contact]')
    expect(norm(direct.find('h2').text())).toBe(c.direct.title)
    expect(direct.find(`a[href="mailto:${brand.email}"]`).text()).toBe(brand.email)
    expect(direct.find('a[href="tel:+35988501661"]').text()).toBe(brand.phone)
    const text = blockText(direct.element)
    for (const item of c.direct.items!) expect(text).toContain(item)
    for (const item of c.company.items) expect(text).toContain(item)
  })

  it('aside: "What happens next" lists the 4 contact.md items in an ordered list', async () => {
    const w = await mountAt(ContactPage, '/contact')
    const next = w.find('[data-next]')
    expect(norm(next.find('h2').text())).toBe(c.next.title)
    expect(next.findAll('ol li').map((li) => norm(li.text()))).toEqual(c.next.items)
  })

  it('ends with the approved final CTA "Ready to discuss the project?" → Send Project Brief', async () => {
    const w = await mountAt(ContactPage, '/contact')
    const last = sections(w).at(-1)!
    expect(norm(last.querySelector('h2')!.textContent!)).toBe('Ready to discuss the project?')
    expect(last.textContent).toContain(c.finalCta.body)
    expect(lastSectionLinks(w)).toEqual([['Send Project Brief', '/contact#project-form']])
  })

  it('does not render the builder instructions (project form list, privacy note)', async () => {
    const w = await mountAt(ContactPage, '/contact')
    expect(w.text()).not.toContain(c.privacyNote.body)
    expect(w.text()).not.toContain('File Upload')
    expect(w.text()).not.toContain('Product Category - optional')
  })
})

describe('contact (TR /tr/iletisim)', () => {
  const c = tr.contact

  it('has the TR hero, the condensed next-steps sentence above its list, and the TR final CTA', async () => {
    const w = await mountAt(ContactPage, '/tr/iletisim')
    expect(norm(w.find('h1').text())).toBe(c.hero.title)
    const next = w.find('[data-next]')
    const condensed = next.find('[data-condensed]')
    expect(norm(condensed.text())).toBe(c.next.condensed)
    expect(next.findAll('ol li').map((li) => norm(li.text()))).toEqual(c.next.items)
    expect(lastSectionLinks(w)).toEqual([['İletişime Geçin', '/tr/iletisim#project-form']])
    expect(w.text()).toContain(c.finalCta.title)
    expectAlternatingBackgrounds(w)
  })

  it('shows the TR direct contact lines', async () => {
    const w = await mountAt(ContactPage, '/tr/iletisim')
    const text = blockText(w.find('[data-direct-contact]').element)
    for (const item of c.direct.items!) expect(text).toContain(item)
  })
})

describe('thank you', () => {
  const lastRobots = () => document.head.querySelector('meta[name="robots"]')?.getAttribute('content')

  it('EN: MessageState with the approved copy, "Need to add information?" and the final CTA', async () => {
    const c = en['thank-you']
    const w = await mountAt(ThankYouPage, '/thank-you')
    expect(w.findAll('h1')).toHaveLength(1)
    expect(norm(w.find('h1').text())).toBe(c.hero.title)
    expect(w.find('main').exists()).toBe(false)
    const msg = w.find('[data-message-state]')
    expect(msg.text()).toContain(c.hero.body)
    expect(msg.findAll('ol li').map((li) => norm(li.text()))).toEqual(c.next.items)
    expect(msg.text()).toContain(c.next.title)
    expect(msg.text()).toContain(c.info!.title)
    expect(norm(msg.text())).toContain(c.info!.body)
    expect(msg.find(`a[href="mailto:${brand.email}"]`).exists()).toBe(true)
    const last = sections(w).at(-1)!
    expect(norm(last.querySelector('h2')!.textContent!)).toBe('Continue exploring MOESA.')
    expect(last.textContent).toContain(c.finalCta.body)
    expect(lastSectionLinks(w)).toEqual([
      ['Explore Services', '/services'],
      ['Home', '/'],
    ])
    expectAlternatingBackgrounds(w)
  })

  it('EN: is noindex', async () => {
    await mountAt(ThankYouPage, '/thank-you')
    await vi.waitFor(() => expect(lastRobots()).toBe('noindex, follow'))
  })

  it('TR: approved TR copy, condensed sentence above the list, TR final CTA, noindex', async () => {
    const c = tr['thank-you']
    const w = await mountAt(ThankYouPage, '/tr/tesekkurler')
    expect(norm(w.find('h1').text())).toBe(c.hero.title)
    const msg = w.find('[data-message-state]')
    expect(norm(msg.find('[data-condensed]').text())).toBe(c.next.condensed)
    expect(msg.findAll('ol li').map((li) => norm(li.text()))).toEqual(c.next.items)
    expect(norm(msg.text())).toContain(c.info!.body)
    expect(lastSectionLinks(w)).toEqual([
      ['İletişime Geçin', '/tr/iletisim'],
      ['Ana Sayfa', '/tr'],
    ])
    await vi.waitFor(() => expect(lastRobots()).toBe('noindex, follow'))
  })
})
