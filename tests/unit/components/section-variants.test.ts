import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import NoteCard from '~/components/sections/NoteCard.vue'
import AudienceCard from '~/components/sections/AudienceCard.vue'
import RuledList from '~/components/sections/RuledList.vue'
import EUBaseSection from '~/components/sections/EUBaseSection.vue'
import about from '#content/en/about'
import trWho from '#content/tr/who-we-work-with'

/** Additive props added for the How We Work, Who We Work With and About pages. */
describe('NoteCard variants', () => {
  it('keeps the label title by default and offers a heading title (canvas rights-card h3 style)', async () => {
    const label = await mountSuspended(NoteCard, { props: { title: 'T', body: 'B' } })
    expect(label.find('h3').classes()).toContain('text-eyebrow')
    const heading = await mountSuspended(NoteCard, { props: { title: 'T', body: 'B', variant: 'heading', level: 'h2' } })
    expect(heading.find('h2').classes()).toContain('text-h3')
    expect(heading.find('h2').classes()).not.toContain('text-eyebrow')
  })

  it('has a pale tone (the canvas tinted third card)', async () => {
    const w = await mountSuspended(NoteCard, { props: { title: 'T', body: 'B', tone: 'pale' } })
    expect(w.find('div').classes()).toContain('bg-pale')
  })
})

describe('AudienceCard condensed', () => {
  it('shows the TR condensed sentence after the text and before the points', async () => {
    const a = trWho.audiences[0]!
    const w = await mountSuspended(AudienceCard, { props: { title: a.title, text: a.body, condensed: a.condensed, points: a.items } })
    const p = w.find('[data-condensed]')
    expect(p.text()).toBe(a.condensed)
    const html = w.html()
    expect(html.indexOf(a.body!)).toBeLessThan(html.indexOf(a.condensed!))
    expect(html.indexOf(a.condensed!)).toBeLessThan(html.indexOf(a.items![0]!))
  })
})

describe('RuledList linked pairs', () => {
  it('links the text of a pair that has `to`, localised; pairs without `to` stay plain text', async () => {
    const w = await mountSuspended(RuledList, {
      props: {
        items: [
          { term: 'Need A', text: 'Operations & Supply Chain', to: '/services/operations-supply-chain' },
          { term: 'Need B', text: 'Integrated Operations Partnership' },
        ],
      },
      route: '/tr',
    })
    const dds = w.findAll('dd')
    expect(dds[0]!.find('a').attributes('href')).toBe('/tr/hizmetler/operasyon-ve-tedarik-zinciri')
    expect(dds[0]!.find('a').text()).toBe('Operations & Supply Chain')
    expect(dds[1]!.find('a').exists()).toBe(false)
    expect(dds[1]!.text()).toBe('Integrated Operations Partnership')
  })
})

describe('EUBaseSection tone', () => {
  const props = { title: about.europeanBase.title, body: about.europeanBase.body, rows: [{ label: 'VAT', value: 'BG' }] }
  it('is white by default and mist with tone="mist"', async () => {
    expect((await mountSuspended(EUBaseSection, { props })).find('section').classes()).toContain('bg-white')
    const mist = await mountSuspended(EUBaseSection, { props: { ...props, tone: 'mist' as const } })
    expect(mist.find('section').classes()).toContain('bg-mist')
    expect(mist.find('section').classes()).not.toContain('bg-white')
  })
})
