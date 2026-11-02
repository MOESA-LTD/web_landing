import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Button from '~/components/ui/Button.vue'

describe('Button', () => {
  it('renders an <a href> when `to` is given', async () => {
    const w = await mountSuspended(Button, { props: { to: '/contact' }, slots: { default: () => 'Discuss a Project' } })
    const a = w.find('a')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('/contact')
    expect(a.text()).toContain('Discuss a Project')
    expect(w.find('button').exists()).toBe(false)
  })

  it('localises an EN `to` path in TR and keeps the query', async () => {
    // The locale follows the route (prefix_except_default), so mount on a TR route.
    try {
      const w = await mountSuspended(Button, {
        route: '/tr',
        props: { to: '/contact?service=operations-supply-chain' },
        slots: { default: () => 'x' },
      })
      expect(w.find('a').attributes('href')).toBe('/tr/iletisim?service=operations-supply-chain')
    } finally {
      await useNuxtApp().$i18n.setLocale('en')
      await navigateTo('/')
    }
  })

  it('renders a <button type="button"> without `to`', async () => {
    const w = await mountSuspended(Button, { slots: { default: () => 'Send' } })
    const b = w.find('button')
    expect(b.exists()).toBe(true)
    expect(b.attributes('type')).toBe('button')
    expect(w.find('a').exists()).toBe(false)
  })

  it('honours type="submit"', async () => {
    const w = await mountSuspended(Button, { props: { type: 'submit' }, slots: { default: () => 'Send Project Brief' } })
    expect(w.find('button').attributes('type')).toBe('submit')
  })

  it('appends a decorative arrow glyph only to the text variant', async () => {
    const text = await mountSuspended(Button, { props: { variant: 'text', to: '/how-we-work' }, slots: { default: () => 'See how' } })
    const svg = text.find('svg')
    expect(svg.exists()).toBe(true)
    expect(svg.attributes('aria-hidden')).toBe('true')
    const primary = await mountSuspended(Button, { slots: { default: () => 'Go' } })
    expect(primary.find('svg').exists()).toBe(false)
  })
})
