import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeAll, describe, expect, it } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import ServicesPage from '~/pages/services/index.vue'
import ServicePage from '~/pages/services/[slug].vue'
import { content as en } from '#content/en'
import { content as tr } from '#content/tr'
import type { Section, ServiceSlug } from '#content/types'
import type { ServicePageContent } from '#content/en'
import { serviceSlugs } from '#content/site'
import { ROUTES } from '~~/i18n/routes'

beforeAll(addPageStubs)

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>

const mountAt = async (component: unknown, route: string) => {
  const w = await mountSuspended(component as never, { route })
  await flushPromises()
  return w
}

const BG = ['bg-white', 'bg-mist', 'bg-navy-dark'] as const
/** The page's top-level sections (the page root is one wrapper element). */
const sections = (w: Wrapper) => [...w.element.children].filter((el) => el.tagName === 'SECTION')
const bgOf = (el: Element) => BG.find((c) => el.classList.contains(c)) ?? 'none'
const expectAlternatingBackgrounds = (w: Wrapper) => {
  const bgs = sections(w).map(bgOf)
  expect(bgs.length).toBeGreaterThan(3)
  expect(bgs, bgs.join(', ')).not.toContain('none')
  for (let i = 1; i < bgs.length; i++) expect(bgs[i], `sections ${i - 1} and ${i}: ${bgs.join(', ')}`).not.toBe(bgs[i - 1])
}
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
const links = (el: { findAll: Wrapper['findAll'] }) => el.findAll('a').map((a) => [norm(a.text()), a.attributes('href')])

describe('services overview (EN /services)', () => {
  const s = en.services
  const home = en.home

  it('renders one h1 (the approved hero title) and no <main> of its own', async () => {
    const w = await mountAt(ServicesPage, '/services')
    expect(w.findAll('h1')).toHaveLength(1)
    expect(w.find('h1').text()).toBe(s.hero.title)
    expect(w.find('main').exists()).toBe(false)
  })

  it('has the page hero: crumbs Home / Services, the approved intro, Discuss a Project + How We Work', async () => {
    const w = await mountAt(ServicesPage, '/services')
    const hero = w.find('section')
    const crumbs = hero.find('nav')
    expect(links(crumbs)).toEqual([['Home', '/']])
    expect(crumbs.find('[aria-current="page"]').text()).toBe('Services')
    expect(hero.text()).toContain(s.hero.body)
    expect(links(hero).slice(1)).toEqual([
      ['Discuss a Project', '/contact'],
      ['How We Work', '/how-we-work'],
    ])
  })

  it('follows the Services artboard: core services (headed by the integrated mandate), needs, capability, final CTA', async () => {
    const w = await mountAt(ServicesPage, '/services')
    expect(w.findAll('h2').map((h) => norm(h.text()))).toEqual([
      s.integrated.title,
      home.businessNeeds.title,
      home.capability.title,
      s.finalCta.title,
    ])
    expect(w.text()).toContain(s.integrated.body)
  })

  it('never puts two sections with the same background next to each other', async () => {
    expectAlternatingBackgrounds(await mountAt(ServicesPage, '/services'))
  })

  it('renders the 5 approved services as service cards (the 5th the capability card) linked to their pages', async () => {
    const w = await mountAt(ServicesPage, '/services')
    const cards = w.findAll('article')
    expect(cards).toHaveLength(5)
    s.services.forEach((svc, i) => {
      const card = cards[i]!
      expect(card.find('h3').text()).toBe(svc.title)
      expect(card.text()).toContain(svc.summary)
      for (const item of svc.items) expect(card.text()).toContain(item)
      expect(card.find('a').attributes('href')).toBe(`/services/${svc.slug}`)
    })
    expect(cards[4]!.text()).toContain('Cross-functional capability')
  })

  it('renders the 5 business needs and the approved final CTA', async () => {
    const w = await mountAt(ServicesPage, '/services')
    for (const need of home.businessNeeds.items) expect(w.text()).toContain(need)
    const last = sections(w).at(-1)!
    expect(last.textContent).toContain(s.finalCta.body)
    expect([...last.querySelectorAll('a')].map((a) => [norm(a.textContent!), a.getAttribute('href')])).toEqual([
      ['Discuss a Project', '/contact'],
    ])
  })
})

describe('services overview (TR /tr/hizmetler)', () => {
  it('renders the TR copy with Turkish links', async () => {
    const w = await mountAt(ServicesPage, '/tr/hizmetler')
    expect(w.find('h1').text()).toBe(tr.services.hero.title)
    expect(w.text()).toContain(tr.services.integrated.body)
    const cardHrefs = w.findAll('article a').map((a) => a.attributes('href'))
    expect(cardHrefs).toEqual(serviceSlugs.map((slug) => ROUTES[`services/${slug}`].tr))
    const last = sections(w).at(-1)!
    expect([...last.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual(['/tr/iletisim'])
    expect(w.find('nav').findAll('a').map((a) => a.attributes('href'))).toEqual(['/tr'])
  })
})

/** Every heading, paragraph and list item of a service page module (what the md says the page shows). */
const approvedTexts = (c: ServicePageContent): string[] => {
  const out: string[] = [c.hero.title, c.hero.body, c.intro.title, c.intro.body, c.finalCta.title, c.finalCta.body]
  for (const v of Object.values(c)) {
    if (!v || typeof v !== 'object' || !('title' in v) || 'cta' in v || 'path' in v) continue
    const sec = v as Section
    out.push(sec.title)
    if (sec.body) out.push(sec.body)
    if (sec.condensed) out.push(sec.condensed)
    for (const x of sec.items ?? []) out.push(x)
    for (const x of sec.steps ?? []) out.push(x)
  }
  return out
}

const enPath = (slug: ServiceSlug) => ROUTES[`services/${slug}`].en
const trPath = (slug: ServiceSlug) => ROUTES[`services/${slug}`].tr

/** Related services per page: the canvas's structural pairs (i18n.js `related`). */
const RELATED: Record<ServiceSlug, ServiceSlug[]> = {
  'sourcing-managed-procurement': ['product-private-label-development', 'operations-supply-chain'],
  'product-private-label-development': ['sourcing-managed-procurement', 'operations-supply-chain'],
  'market-access-commercial-representation': ['operations-supply-chain', 'digital-commerce-commercial-intelligence'],
  'operations-supply-chain': ['sourcing-managed-procurement', 'market-access-commercial-representation'],
  'digital-commerce-commercial-intelligence': ['product-private-label-development', 'operations-supply-chain'],
}

describe.each(serviceSlugs)('service page %s (EN)', (slug) => {
  const c = en[`services/${slug}`]
  const title = en.services.services.find((x) => x.slug === slug)!.title

  it('renders one h1 (the hero title), no <main>, and alternating section backgrounds', async () => {
    const w = await mountAt(ServicePage, enPath(slug))
    expect(w.findAll('h1')).toHaveLength(1)
    expect(w.find('h1').text()).toBe(c.hero.title)
    expect(w.find('main').exists()).toBe(false)
    expectAlternatingBackgrounds(w)
  })

  it('has crumbs Home / Services / service name and the service CTA in the hero and the final CTA', async () => {
    const w = await mountAt(ServicePage, enPath(slug))
    const hero = w.find('section')
    expect(links(hero.find('nav'))).toEqual([
      ['Home', '/'],
      ['Services', '/services'],
    ])
    expect(hero.find('nav [aria-current="page"]').text()).toBe(title)
    const cta = [c.finalCta.cta.label, c.finalCta.cta.href]
    expect(c.finalCta.cta.href).toBe(`/contact?service=${slug}`)
    expect(links(hero).slice(2)).toEqual([cta])
    const last = sections(w).at(-1)!
    expect([...last.querySelectorAll('a')].map((a) => [norm(a.textContent!), a.getAttribute('href')])).toEqual([cta])
  })

  it('shows every approved heading, paragraph and list item of the page', async () => {
    const w = await mountAt(ServicePage, enPath(slug))
    const text = norm(w.text())
    const missing = approvedTexts(c).filter((t) => !text.includes(norm(t)))
    expect(missing).toEqual([])
  })

  it('renders the Typical mandates panel with the 5 approved mandates', async () => {
    const w = await mountAt(ServicePage, enPath(slug))
    const panel = w.find('[data-mandates]')
    expect(panel.find('h3').text()).toBe(c.typicalMandates.title)
    expect(panel.findAll('li').map((li) => norm(li.text()))).toEqual(c.typicalMandates.items)
  })

  it('renders "What MOESA manages" as a ruled list', async () => {
    const w = await mountAt(ServicePage, enPath(slug))
    const list = w.find('[data-manages] ul')
    expect(list.findAll('li').map((li) => norm(li.text()))).toEqual(c.manages.items)
  })

  it('links the two related services', async () => {
    const w = await mountAt(ServicePage, enPath(slug))
    const related = w.find('[data-related]')
    expect(related.findAll('a').map((a) => a.attributes('href'))).toEqual(RELATED[slug].map(enPath))
  })
})

describe('service page specifics (EN)', () => {
  const steps = (w: Wrapper, sel: string) => w.findAll(`${sel} ol > li`).map((li) => norm(li.text()).replace(/^\d+\s*/, ''))

  it('Sourcing, Product and Market Access show the 5-step "How the work runs" timeline', async () => {
    for (const slug of serviceSlugs.slice(0, 3)) {
      const w = await mountAt(ServicePage, enPath(slug))
      expect(w.find('[data-run] h2').text()).toBe(en.home.process.title)
      expect(steps(w, '[data-run]')).toEqual(en.home.process.items)
    }
  })

  it('Operations uses its own 10-step operating flow, not the generic 5 steps', async () => {
    const c = en['services/operations-supply-chain']
    const w = await mountAt(ServicePage, enPath('operations-supply-chain'))
    expect(steps(w, '[data-flow]')).toEqual(c.flow!.steps)
    expect(w.find('[data-run]').exists()).toBe(false)
    expect(w.text()).not.toContain(en.home.process.items[1])
  })

  it('Operations renders the legal-role boundary and the exception-management limit', async () => {
    const c = en['services/operations-supply-chain']
    const w = await mountAt(ServicePage, enPath('operations-supply-chain'))
    expect(norm(w.text())).toContain(
      'MOESA does not automatically assume the legal role of importer, customs declarant, responsible economic operator or contracting purchaser. These roles are defined separately for each transaction.',
    )
    expect(w.text()).toContain('Third-party delays or losses cannot be guaranteed against.')
    expect(w.text()).toContain(c.legalBoundary!.title)
  })

  it('uses the exact md CTA labels', async () => {
    const labels: Record<ServiceSlug, string> = {
      'sourcing-managed-procurement': 'Discuss a Sourcing Project',
      'product-private-label-development': 'Discuss a Product Project',
      'market-access-commercial-representation': 'Discuss a Market Project',
      'operations-supply-chain': 'Discuss an Operations Project',
      'digital-commerce-commercial-intelligence': 'Discuss a Commerce Project',
    }
    for (const slug of serviceSlugs) {
      const w = await mountAt(ServicePage, enPath(slug))
      const hero = w.find('section')
      expect(hero.findAll('a').at(-1)!.text()).toBe(labels[slug])
    }
  })

  it('Digital shows the capability eyebrow, a pale mandates panel and its 5-step intelligence framework', async () => {
    const c = en['services/digital-commerce-commercial-intelligence']
    const w = await mountAt(ServicePage, enPath('digital-commerce-commercial-intelligence'))
    expect(w.find('section').text()).toContain('Cross-functional capability')
    expect(w.find('[data-mandates]').classes()).toContain('bg-pale')
    expect(steps(w, '[data-framework]')).toEqual(c.framework!.steps)
    expect(w.find('[data-run]').exists()).toBe(false)
  })
})

describe('service pages (TR)', () => {
  it('render the TR copy, every TR condensed sentence above its translated list, and the localised CTA', async () => {
    for (const slug of serviceSlugs) {
      const c = tr[`services/${slug}`]
      const enCta = en[`services/${slug}`].finalCta.cta
      const w = await mountAt(ServicePage, trPath(slug))
      expect(w.find('h1').text()).toBe(c.hero.title)
      const text = norm(w.text())
      const missing = approvedTexts(c).filter((t) => !text.includes(norm(t)))
      expect(missing, slug).toEqual([])
      for (const sec of Object.values(c) as Section[]) {
        if (!sec || typeof sec !== 'object' || !sec.condensed || !sec.items?.length) continue
        const condensed = w.findAll('[data-condensed]').find((p) => norm(p.text()) === norm(sec.condensed!))
        expect(condensed, `${slug}: condensed "${sec.condensed}"`).toBeTruthy()
        // Same section, and the paragraph comes before the list item elements of that section.
        const section = condensed!.element.closest('section')!
        const firstItem = [...section.querySelectorAll('li')].find((li) => norm(li.textContent!).includes(norm(sec.items![0]!)))
        expect(firstItem, `${slug}: list of "${sec.title}" next to its condensed sentence`).toBeTruthy()
        expect(condensed!.element.compareDocumentPosition(firstItem!) & Node.DOCUMENT_POSITION_FOLLOWING, `${slug}: condensed before list`).toBeTruthy()
      }
      const href = enCta.href.replace('/contact', '/tr/iletisim')
      const hero = w.find('section')
      expect(links(hero).at(-1)).toEqual([c.finalCta.cta.label, href])
      const last = sections(w).at(-1)!
      expect([...last.querySelectorAll('a')].map((a) => a.getAttribute('href'))).toEqual([href])
      expect(links(hero.find('nav'))).toEqual([
        ['Ana Sayfa', '/tr'],
        ['Hizmetler', '/tr/hizmetler'],
      ])
    }
  })

  it('links related services to their Turkish URLs', async () => {
    const w = await mountAt(ServicePage, trPath('operations-supply-chain'))
    expect(w.find('[data-related]').findAll('a').map((a) => a.attributes('href'))).toEqual(
      RELATED['operations-supply-chain'].map(trPath),
    )
  })

  it('shows the approved TR legal-role boundary on Operations', async () => {
    const w = await mountAt(ServicePage, trPath('operations-supply-chain'))
    expect(norm(w.text())).toContain(
      'MOESA otomatik olarak importer, customs declarant, responsible economic operator veya sözleşmeli alıcı rolünü üstlenmez; roller işlem bazında tanımlanır.',
    )
  })
})
