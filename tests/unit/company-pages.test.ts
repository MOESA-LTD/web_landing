import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { beforeAll, describe, expect, it } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import HowWeWorkPage from '~/pages/how-we-work.vue'
import WhoWeWorkWithPage from '~/pages/who-we-work-with.vue'
import AboutPage from '~/pages/about.vue'
import { content as en } from '#content/en'
import { content as tr } from '#content/tr'
import type { Section } from '#content/types'
import { brand } from '#content/site'
import { ROUTES } from '~~/i18n/routes'

beforeAll(addPageStubs)

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>

const mountAt = async (component: unknown, route: string) => {
  const w = await mountSuspended(component as never, { route })
  await flushPromises()
  return w
}

const BG = ['bg-white', 'bg-mist', 'bg-pale', 'bg-navy-dark'] as const
/** The page's top-level sections (the page root is one wrapper element). */
const sections = (w: Wrapper) => [...w.element.children].filter((el) => el.tagName === 'SECTION')
const bgOf = (el: Element) => BG.find((c) => el.classList.contains(c)) ?? 'none'
const expectAlternatingBackgrounds = (w: Wrapper) => {
  const bgs = sections(w).map(bgOf)
  expect(bgs.length).toBeGreaterThan(3)
  expect(bgs, bgs.join(', ')).not.toContain('none')
  for (let i = 1; i < bgs.length; i++) expect(bgs[i], `sections ${i - 1} and ${i}: ${bgs.join(', ')}`).not.toBe(bgs[i - 1])
}
/** Navy bands carry `surface-inverse` (cyan focus ring). */
const expectNavyBandsInverse = (w: Wrapper) => {
  for (const s of sections(w).filter((el) => el.classList.contains('bg-navy-dark'))) expect(s.classList.contains('surface-inverse')).toBe(true)
}
const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
const links = (el: { findAll: Wrapper['findAll'] }) => el.findAll('a').map((a) => [norm(a.text()), a.attributes('href')])

/** Every display string of a page module: all string leaves except meta, hrefs and structural keys. */
const approvedTexts = (c: object): string[] => {
  const out: string[] = []
  const walk = (v: unknown, key: string) => {
    if (typeof v === 'string') {
      if (!['href', 'path', 'service'].includes(key)) out.push(v)
    } else if (Array.isArray(v)) v.forEach((x) => walk(x, key))
    else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) if (k !== 'meta') walk(x, k)
  }
  walk(c, '')
  return out
}
const expectAllApproved = (w: Wrapper, c: object) => {
  const text = norm(w.text())
  expect(approvedTexts(c).filter((t) => !text.includes(norm(t)))).toEqual([])
}

/** Each TR `condensed` sentence is shown as a paragraph above its translated list, in the same section. */
const expectCondensedAboveLists = (w: Wrapper, secs: Section[]) => {
  const withCondensed = secs.filter((s) => s.condensed && s.items?.length)
  expect(withCondensed.length).toBeGreaterThan(0)
  for (const sec of withCondensed) {
    const condensed = w.findAll('[data-condensed]').find((p) => norm(p.text()) === norm(sec.condensed!))
    expect(condensed, `condensed "${sec.condensed}"`).toBeTruthy()
    const scope = condensed!.element.closest('article') ?? condensed!.element.closest('section')!
    const firstItem = [...scope.querySelectorAll('li, h3')].find((el) => norm(el.textContent!).includes(norm(sec.items![0]!)))
    expect(firstItem, `list of "${sec.title}" next to its condensed sentence`).toBeTruthy()
    expect(condensed!.element.compareDocumentPosition(firstItem!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  }
}

const lastSectionLinks = (w: Wrapper) => {
  const last = sections(w).at(-1)!
  return [...last.querySelectorAll('a')].map((a) => [norm(a.textContent!), a.getAttribute('href')])
}

/* ------------------------------------------------------------------------------------------------ */

describe('how we work (EN /how-we-work)', () => {
  const c = en['how-we-work']

  it('renders one h1 (the hero title), no <main>, alternating backgrounds and inverse navy bands', async () => {
    const w = await mountAt(HowWeWorkPage, '/how-we-work')
    expect(w.findAll('h1')).toHaveLength(1)
    expect(w.find('h1').text()).toBe(c.hero.title)
    expect(w.find('main').exists()).toBe(false)
    expectAlternatingBackgrounds(w)
    expectNavyBandsInverse(w)
  })

  it('has the page hero: crumbs Home / How We Work, the approved intro and Discuss a Project', async () => {
    const w = await mountAt(HowWeWorkPage, '/how-we-work')
    const hero = w.find('section')
    expect(links(hero.find('nav'))).toEqual([['Home', '/']])
    expect(hero.find('nav [aria-current="page"]').text()).toBe('How We Work')
    expect(hero.text()).toContain(c.hero.body)
    expect(links(hero).slice(1)).toEqual([['Discuss a Project', '/contact']])
  })

  it('shows every approved string and no canvas-only copy', async () => {
    const w = await mountAt(HowWeWorkPage, '/how-we-work')
    expectAllApproved(w, c)
    for (const invented of ['Seven steps, one accountable team.', 'Every mandate follows the same sequence', 'Clear decision rights.']) {
      expect(w.text()).not.toContain(invented)
    }
    // The canvas cut the first approved sentence out as its h2; here it stays inside the approved paragraph.
    expect(w.findAll('h2').map((h) => h.text())).not.toContain('An open question is not a finished fact.')
  })

  it('renders the operating flow as a 7-step column timeline and "Not a linear process" as a flow line with the loop sentence', async () => {
    const w = await mountAt(HowWeWorkPage, '/how-we-work')
    const flow = w.find('[data-operating-flow]')
    expect(flow.find('.timeline-column').exists()).toBe(true)
    expect(flow.findAll('.timeline-column .timeline-text').map((li) => norm(li.text()))).toEqual(c.operatingFlow.items)
    const nonLinear = w.find('[data-non-linear]')
    expect(nonLinear.find('h3').text()).toBe(c.nonLinear.title)
    expect(nonLinear.findAll('ol > li').map((li) => norm(li.text()))).toEqual(c.nonLinear.steps)
    expect(nonLinear.find('[data-loop]').text()).toBe(c.nonLinear.body)
  })

  it('places the sections in canvas order with the approved sections added', async () => {
    const w = await mountAt(HowWeWorkPage, '/how-we-work')
    expect(w.findAll('h2').map((h) => norm(h.text()))).toEqual([
      c.intro.title,
      c.startAnywhere.title,
      c.governance.title,
      c.productTruth.title,
      c.responsibility.title,
      c.visibility.title,
      c.partnershipModels.title,
      c.engagementLevels.title,
      c.openQuestions.title,
      c.evolve.title,
      c.finalCta.title,
    ])
  })

  it('uses the DS patterns: visibility ruled list, 6 partnership rows on a navy band, engagement levels as numbered cards', async () => {
    const w = await mountAt(HowWeWorkPage, '/how-we-work')
    expect(w.find('[data-visibility] ul').findAll('li').map((li) => li.text())).toEqual(c.visibility.items)
    const band = w.find('[data-partnership]')
    expect(band.classes()).toContain('bg-navy-dark')
    expect(band.findAll('article h3').map((h) => h.text())).toEqual(c.partnershipModels.items)
    expect(w.find('[data-engagement] ol').findAll('h3').map((h) => h.text())).toEqual(c.engagementLevels.items)
    expect(w.findAll('[data-start-anywhere] article h3').map((h) => h.text())).toEqual(c.startAnywhere.items)
  })

  it('ends with the approved final CTA "Where should we begin?" → /contact', async () => {
    const w = await mountAt(HowWeWorkPage, '/how-we-work')
    const last = sections(w).at(-1)!
    expect(last.querySelector('h2')!.textContent!.trim()).toBe('Where should we begin?')
    expect(lastSectionLinks(w)).toEqual([['Discuss a Project', '/contact']])
  })
})

describe('how we work (TR /tr/nasil-calisiyoruz)', () => {
  const c = tr['how-we-work']

  it('renders the TR copy, the approved arrow line, condensed sentences above their lists and TR links', async () => {
    const w = await mountAt(HowWeWorkPage, ROUTES['how-we-work'].tr)
    expect(w.find('h1').text()).toBe(c.hero.title)
    expectAllApproved(w, c)
    expectAlternatingBackgrounds(w)
    expectCondensedAboveLists(w, [c.startAnywhere, c.partnershipModels])
    expect(w.find('[data-operating-flow] [data-flow-line]').findAll('li').map((li) => norm(li.text()))).toEqual(c.operatingFlow.steps)
    expect(links(w.find('section').find('nav'))).toEqual([['Ana Sayfa', '/tr']])
    expect(lastSectionLinks(w)).toEqual([[c.finalCta.cta.label, '/tr/iletisim']])
  })
})

/* ------------------------------------------------------------------------------------------------ */

describe('who we work with (EN /who-we-work-with)', () => {
  const c = en['who-we-work-with']

  it('renders one h1 (the hero title), no <main> and alternating backgrounds', async () => {
    const w = await mountAt(WhoWeWorkWithPage, '/who-we-work-with')
    expect(w.findAll('h1')).toHaveLength(1)
    expect(w.find('h1').text()).toBe(c.hero.title)
    expect(w.find('main').exists()).toBe(false)
    expectAlternatingBackgrounds(w)
  })

  it('has the page hero: crumbs, intro, Discuss a Project + Explore Services', async () => {
    const w = await mountAt(WhoWeWorkWithPage, '/who-we-work-with')
    const hero = w.find('section')
    expect(links(hero.find('nav'))).toEqual([['Home', '/']])
    expect(hero.find('nav [aria-current="page"]').text()).toBe('Who We Work With')
    expect(hero.text()).toContain(c.hero.body)
    expect(links(hero).slice(1)).toEqual([
      ['Discuss a Project', '/contact'],
      ['Explore Services', '/services'],
    ])
  })

  it('shows every approved string and no canvas-only copy', async () => {
    const w = await mountAt(WhoWeWorkWithPage, '/who-we-work-with')
    expectAllApproved(w, c)
    for (const invented of ['Three client profiles.', 'Two kinds of partner.', 'Buyers who need supply.']) expect(w.text()).not.toContain(invented)
  })

  it('renders the 5 audiences as AudienceCards with their text and approved bullets', async () => {
    const w = await mountAt(WhoWeWorkWithPage, '/who-we-work-with')
    const cards = w.findAll('[data-audiences] article')
    expect(cards).toHaveLength(5)
    c.audiences.forEach((a, i) => {
      const card = cards[i]!
      expect(card.find('h3').text()).toBe(a.title)
      expect(card.text()).toContain(a.body!)
      expect(card.findAll('li').map((li) => li.text())).toEqual(a.items)
    })
  })

  it('orders the sections: intro + audiences, the two buyer sections, the selection guide, not sure yet, final CTA', async () => {
    const w = await mountAt(WhoWeWorkWithPage, '/who-we-work-with')
    expect(w.findAll('h2').map((h) => norm(h.text()))).toEqual([
      c.intro.title,
      c.seekingBrands.title,
      c.noInternalProcurement.title,
      c.selectionGuide.title,
      c.notSure.title,
      c.finalCta.title,
    ])
  })

  it('renders the selection guide as a ruled term → text list, targets linked to their service pages', async () => {
    const w = await mountAt(WhoWeWorkWithPage, '/who-we-work-with')
    const rows = w.find('[data-guide] dl').findAll('dl > div')
    expect(rows).toHaveLength(6)
    c.selectionGuide.rows.forEach((r, i) => {
      expect(rows[i]!.find('dt').text()).toBe(r.need)
      expect(norm(rows[i]!.find('dd').text())).toBe(r.target)
      const a = rows[i]!.find('dd a')
      if (r.service) expect(a.attributes('href')).toBe(ROUTES[`services/${r.service}`].en)
      else expect(a.exists()).toBe(false)
    })
  })

  it('ends with the approved final CTA "Discuss Your Business Need" → /contact', async () => {
    const w = await mountAt(WhoWeWorkWithPage, '/who-we-work-with')
    expect(lastSectionLinks(w)).toEqual([['Discuss Your Business Need', '/contact']])
  })
})

describe('who we work with (TR /tr/kimlerle-calisiyoruz)', () => {
  const c = tr['who-we-work-with']

  it('renders the TR copy, each audience condensed sentence above its list, TR service links', async () => {
    const w = await mountAt(WhoWeWorkWithPage, ROUTES['who-we-work-with'].tr)
    expect(w.find('h1').text()).toBe(c.hero.title)
    expectAllApproved(w, c)
    expectAlternatingBackgrounds(w)
    expectCondensedAboveLists(w, c.audiences)
    expect(w.find('[data-guide]').findAll('a').map((a) => a.attributes('href'))).toEqual(
      c.selectionGuide.rows.filter((r) => r.service).map((r) => ROUTES[`services/${r.service!}`].tr),
    )
    expect(lastSectionLinks(w)).toEqual([[c.finalCta.cta.label, '/tr/iletisim']])
  })
})

/* ------------------------------------------------------------------------------------------------ */

describe('about (EN /about)', () => {
  const c = en.about

  it('renders one h1 (the hero title), no <main> and alternating backgrounds', async () => {
    const w = await mountAt(AboutPage, '/about')
    expect(w.findAll('h1')).toHaveLength(1)
    expect(w.find('h1').text()).toBe(c.hero.title)
    expect(w.find('main').exists()).toBe(false)
    expectAlternatingBackgrounds(w)
  })

  it('has the page hero: crumbs, intro, the note (approved EU line), Discuss a Project + How We Work', async () => {
    const w = await mountAt(AboutPage, '/about')
    const hero = w.find('section')
    expect(links(hero.find('nav'))).toEqual([['Home', '/']])
    expect(hero.find('nav [aria-current="page"]').text()).toBe('About MOESA')
    expect(hero.text()).toContain(c.hero.body)
    expect(hero.text()).toContain(en.home.euBase.title)
    expect(links(hero).slice(1)).toEqual([
      ['Discuss a Project', '/contact'],
      ['How We Work', '/how-we-work'],
    ])
  })

  it('shows every approved string and no canvas-only copy', async () => {
    const w = await mountAt(AboutPage, '/about')
    expectAllApproved(w, c)
    for (const invented of ['How we hold ourselves to account.', 'One coordinated team between objective and delivery.', 'Market experience behind every sourcing decision.']) {
      expect(w.text()).not.toContain(invented)
    }
  })

  it('orders the sections and renders the 6 principles as numbered cards', async () => {
    const w = await mountAt(AboutPage, '/about')
    expect(w.findAll('h2').map((h) => norm(h.text()))).toEqual([
      c.whoWeAre.title,
      c.why.title,
      c.principles.title,
      c.experience.title,
      c.europeanBase.title,
      c.isNot.title,
      c.direction.title,
      c.finalCta.title,
    ])
    expect(w.find('[data-principles] ol').findAll('h3').map((h) => h.text())).toEqual(c.principles.items)
    expect(w.find('[data-manages] h3').text()).toBe(c.manages.title)
    expect(w.find('[data-manages]').findAll('li').map((li) => li.text())).toEqual(c.manages.items)
  })

  it('shows Experience as two Stats with the about.md figures (15, 10)', async () => {
    const w = await mountAt(AboutPage, '/about')
    const panel = w.find('[data-stats]')
    expect(panel.findAll('.text-stat').map((s) => s.text())).toEqual(['15', '10'])
    expect(panel.findAll('.text-h4').map((s) => s.text())).toEqual(['years in digital commerce', 'years in professional e-commerce operations'])
  })

  it('takes each Stat (value + label) verbatim from the approved Experience sentence, in both locales', async () => {
    for (const [route, c] of [['/about', en.about], [ROUTES.about.tr, tr.about]] as const) {
      const w = await mountAt(AboutPage, route)
      const stats = w.find('[data-stats]').findAll('.grid')
      expect(stats).toHaveLength(2)
      for (const s of stats) expect(c.experience.body).toContain(`${s.find('.text-stat').text()} ${s.find('.text-h4').text()}`)
    }
  })

  it('uses EUBaseSection with the About text and the company rows', async () => {
    const w = await mountAt(AboutPage, '/about')
    const eu = w.findAll('[data-band]').find((s) => s.text().includes(c.europeanBase.title))!
    expect(eu.text()).toContain(c.europeanBase.body)
    for (const v of [brand.address, brand.company_id, brand.vat]) expect(eu.text()).toContain(v)
  })

  it('renders "What MOESA is not" as a tick list and ends with the approved final CTA', async () => {
    const w = await mountAt(AboutPage, '/about')
    expect(w.find('[data-is-not] ul').findAll('li').map((li) => li.text())).toEqual(c.isNot.items)
    expect(sections(w).at(-1)!.textContent).toContain(c.finalCta.body)
    expect(lastSectionLinks(w)).toEqual([['Discuss a Project', '/contact']])
  })
})

describe('about (TR /tr/hakkimizda)', () => {
  const c = tr.about

  it('renders the TR copy, the condensed sentences above their lists, the TR stats and TR links', async () => {
    const w = await mountAt(AboutPage, ROUTES.about.tr)
    expect(w.find('h1').text()).toBe(c.hero.title)
    expectAllApproved(w, c)
    expectAlternatingBackgrounds(w)
    expectCondensedAboveLists(w, [c.why, c.isNot])
    expect(w.find('section').text()).toContain(tr.home.euBase.title)
    expect(w.find('[data-stats]').findAll('.text-stat').map((s) => s.text())).toEqual(['15', '10'])
    expect(links(w.find('section')).slice(1)).toEqual([
      ['Projeyi Görüşelim', '/tr/iletisim'],
      ['Nasıl Çalışıyoruz', '/tr/nasil-calisiyoruz'],
    ])
    expect(lastSectionLinks(w)).toEqual([[c.finalCta.cta.label, '/tr/iletisim']])
  })
})
