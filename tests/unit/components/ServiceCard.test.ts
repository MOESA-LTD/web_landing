import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ServiceCard from '~/components/sections/ServiceCard.vue'
import services from '#content/en/services'

const s = services.services[3]!

describe('ServiceCard', () => {
  const props = { index: '04', title: s.title, summary: s.summary, points: s.items, to: `/services/${s.slug}` }

  it('is one link whose href equals `to`', async () => {
    const w = await mountSuspended(ServiceCard, { props })
    const links = w.findAll('a')
    expect(links).toHaveLength(1)
    expect(links[0]!.attributes('href')).toBe('/services/operations-supply-chain')
  })

  it('puts the title inside an h3 and each point in an li', async () => {
    const w = await mountSuspended(ServiceCard, { props })
    expect(w.find('h3').text()).toBe(s.title)
    expect(w.find('h3 a').exists()).toBe(true)
    expect(w.findAll('li').map((li) => li.text())).toEqual(s.items)
  })

  it('shows the decorative numeral, aria-hidden', async () => {
    const w = await mountSuspended(ServiceCard, { props })
    const n = w.find('[data-numeral]')
    expect(n.text()).toBe('04')
    expect(n.attributes('aria-hidden')).toBe('true')
  })

  it('the numeral of the cyan-ruled first card is primary blue (text contrast); the rule stays cyan', async () => {
    const w = await mountSuspended(ServiceCard, { props: { ...props, index: 1 } })
    expect(w.find('[data-numeral]').attributes('style')).toContain('color: var(--color-blue)')
    expect(w.attributes('style')).toContain('--rule: var(--color-cyan)')
    const w2 = await mountSuspended(ServiceCard, { props: { ...props, index: 3 } })
    expect(w2.find('[data-numeral]').attributes('style')).toContain('color: var(--color-blue-dark)')
  })

  it('capability card shows the localised capability eyebrow instead of the numeral', async () => {
    const w = await mountSuspended(ServiceCard, { props: { ...props, index: undefined, capability: true } })
    expect(w.find('[data-numeral]').exists()).toBe(false)
    expect(w.text()).toContain('Cross-functional capability')
  })
})
