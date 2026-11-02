import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeAll, describe, expect, it } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import HomePage from '~/pages/index.vue'
import enHome from '#content/en/home'
import trHome from '#content/tr/home'
import enServices from '#content/en/services'
import { brand } from '#content/site'

beforeAll(addPageStubs)

const mountHome = async (route: string) => {
  const w = await mountSuspended(HomePage, { route })
  await flushPromises()
  return w
}

const BG = ['bg-white', 'bg-mist', 'bg-navy-dark'] as const
/** The page's top-level sections (the page root is one wrapper element). */
const sections = (w: Awaited<ReturnType<typeof mountHome>>) => [...w.element.children].filter((el) => el.tagName === 'SECTION')
const bgOf = (el: Element) => BG.find((c) => el.classList.contains(c)) ?? 'none'

describe('home page (EN)', () => {
  it('renders one h1 (the hero title) and no <main> of its own', async () => {
    const w = await mountHome('/')
    expect(w.findAll('h1')).toHaveLength(1)
    expect(w.find('h1').text()).toBe(enHome.hero.title)
    expect(w.find('main').exists()).toBe(false)
  })

  it('follows the section order of the current Main artboard, approved headings in place', async () => {
    const w = await mountHome('/')
    const h2s = w.findAll('h2').map((h) => h.text())
    expect(h2s).toEqual([
      enHome.team.title,
      enHome.businessNeeds.title,
      enHome.operatingModel.title,
      enHome.process.title,
      enHome.capability.title,
      enHome.audiences.title,
      enHome.partnership.title,
      enHome.euBase.title,
      enHome.finalCta.title,
    ])
  })

  it('never puts two sections with the same background next to each other', async () => {
    const w = await mountHome('/')
    const bgs = sections(w).map(bgOf)
    expect(bgs).toHaveLength(10)
    expect(bgs).not.toContain('none')
    for (let i = 1; i < bgs.length; i++) expect(bgs[i], `sections ${i - 1} and ${i}: ${bgs.join(', ')}`).not.toBe(bgs[i - 1])
  })

  it('splits the team statement into the You / MOESA cards without changing the approved paragraph', async () => {
    const w = await mountHome('/')
    const cards = w.findAll('[data-team-card]').map((c) => c.text())
    expect(cards).toHaveLength(2)
    expect(cards.join(' ')).toBe(enHome.team.body)
    expect(w.text()).toContain(enHome.team.statement)
  })

  it('shows the hero actions, note and the MOESA LTD. panel label', async () => {
    const w = await mountHome('/')
    const hero = w.find('section')
    const links = hero.findAll('a')
    expect(links.map((a) => [a.text(), a.attributes('href')])).toEqual([
      ['Discuss a Project', '/contact'],
      ['Explore Services', '/services'],
    ])
    expect(hero.text()).toContain(enHome.hero.tagline)
    expect(hero.find('[data-panel-label]').text()).toBe(brand.name)
  })

  it('renders 5 need cards, each linked to the service that covers it', async () => {
    const w = await mountHome('/')
    const section = w.find('section[aria-labelledby="home-needs"]')
    const cards = section.findAll('a')
    expect(cards.map((a) => a.attributes('href'))).toEqual([
      '/services/sourcing-managed-procurement',
      '/services/product-private-label-development',
      '/services/sourcing-managed-procurement',
      '/services/market-access-commercial-representation',
      '/services/digital-commerce-commercial-intelligence',
    ])
    enHome.businessNeeds.items.forEach((need, i) => expect(cards[i]!.text()).toContain(need))
  })

  it('renders the 5 service cards from services.md, the 5th as the capability card', async () => {
    const w = await mountHome('/')
    const section = w.find('section[aria-labelledby="home-services"]')
    const titles = section.findAll('article h3').map((h) => h.text())
    expect(titles).toEqual(enServices.services.map((s) => s.title))
    enServices.services.forEach((s) => expect(section.text()).toContain(s.summary))
    expect(section.findAll('article')[4]!.text()).toContain('Cross-functional capability')
  })

  it('renders the process as a 5-step inverse timeline on a navy band', async () => {
    const w = await mountHome('/')
    const section = w.find('section[aria-labelledby="home-process"]')
    expect(section.classes()).toContain('surface-inverse')
    expect(section.findAll('li').map((li) => li.text().replace(/^\d+/, ''))).toEqual(enHome.process.items)
    expect(section.find('a').attributes('href')).toBe('/how-we-work')
  })

  it('renders the 5 partnership models and 4 title-only audience cards', async () => {
    const w = await mountHome('/')
    const partners = w.find('section[aria-labelledby="home-partnership"]')
    expect(partners.findAll('h3').map((h) => h.text())).toEqual(enHome.partnership.items)
    const audiences = w.find('section[aria-labelledby="home-audiences"]')
    const cards = audiences.findAll('article')
    expect(cards.map((c) => c.find('h3').text())).toEqual(enHome.audiences.items)
    for (const c of cards) {
      expect(c.find('a').attributes('href')).toBe('/who-we-work-with')
      expect(c.findAll('p, li')).toHaveLength(0)
    }
  })

  it('renders the EU base with the company facts from brand', async () => {
    const w = await mountHome('/')
    const dl = w.find('dl')
    expect(dl.findAll('dt').map((d) => d.text())).toEqual(['Registered address', 'Company ID', 'VAT'])
    expect(dl.findAll('dd').map((d) => d.text())).toEqual([brand.address, brand.company_id, brand.vat])
  })
})

describe('home page (TR)', () => {
  it('renders the approved TR copy with localised links', async () => {
    const w = await mountHome('/tr')
    expect(w.find('h1').text()).toBe(trHome.hero.title)
    expect(w.findAll('h2').map((h) => h.text())).toContain(trHome.team.title)
    expect(w.findAll('[data-team-card]').map((c) => c.text()).join(' ')).toBe(trHome.team.body)
    const hero = w.find('section')
    expect(hero.findAll('a').map((a) => [a.text(), a.attributes('href')])).toEqual([
      ['Projeyi Görüşelim', '/tr/iletisim'],
      ['Hizmetleri İnceleyin', '/tr/hizmetler'],
    ])
    const finalCta = w.findAll('section').at(-1)!
    expect(finalCta.find('a').text()).toBe(trHome.finalCta.cta.label)
    expect(finalCta.find('a').attributes('href')).toBe('/tr/iletisim')
    expect(w.find('dl').findAll('dt').map((d) => d.text())).toEqual(['Kayıtlı adres', 'Şirket sicil no (EIK)', 'KDV no'])
  })

  it('has no `condensed` sections to show (TR home.md is complete)', () => {
    expect(JSON.stringify(trHome)).not.toContain('"condensed"')
  })
})
