import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import Breadcrumbs from '~/components/ui/Breadcrumbs.vue'

const items = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Operations & Supply Chain', href: '/services/operations-supply-chain' },
]

describe('Breadcrumbs', () => {
  it('is a labelled nav with an ordered list', async () => {
    const w = await mountSuspended(Breadcrumbs, { props: { items } })
    expect(w.find('nav').attributes('aria-label')).toBe('Breadcrumb')
    expect(w.findAll('ol > li')).toHaveLength(3)
  })

  it('marks the last item aria-current="page" and does not link it', async () => {
    const w = await mountSuspended(Breadcrumbs, { props: { items } })
    const last = w.findAll('ol > li').at(-1)!
    expect(last.find('a').exists()).toBe(false)
    const current = last.find('[aria-current="page"]')
    expect(current.exists()).toBe(true)
    expect(current.text()).toBe('Operations & Supply Chain')
    expect(w.findAll('[aria-current]')).toHaveLength(1)
  })

  it('links the earlier items', async () => {
    const w = await mountSuspended(Breadcrumbs, { props: { items } })
    expect(w.findAll('a').map((a) => a.attributes('href'))).toEqual(['/', '/services'])
  })

  it('renders aria-hidden separators between items', async () => {
    const w = await mountSuspended(Breadcrumbs, { props: { items } })
    const seps = w.findAll('[data-crumb-sep]')
    expect(seps).toHaveLength(2)
    for (const s of seps) {
      expect(s.attributes('aria-hidden')).toBe('true')
      expect(s.text()).toBe('/')
    }
  })
})
