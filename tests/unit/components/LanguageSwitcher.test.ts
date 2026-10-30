import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { addPageStubs } from '../helpers/page-stubs'
import LanguageSwitcher from '~/components/layout/LanguageSwitcher.vue'

beforeAll(addPageStubs)

const mount = async (route: string) => {
  const w = await mountSuspended(LanguageSwitcher, { route })
  await flushPromises()
  return w
}

describe('LanguageSwitcher', () => {
  it('is a labelled group with the Language label and EN / TR links only', async () => {
    const w = await mount('/')
    expect(w.find('[role="group"]').attributes('aria-label')).toBe('Language')
    expect(w.text()).toContain('Language')
    const links = w.findAll('a')
    expect(links.map((a) => a.text())).toEqual(['EN', 'TR'])
    expect(links.map((a) => a.attributes('lang'))).toEqual(['en', 'tr'])
    expect(links.map((a) => a.attributes('hreflang'))).toEqual(['en', 'tr'])
    expect(w.findAll('button')).toHaveLength(0)
  })

  it('marks the active locale link aria-current="true" and styles it blue/white', async () => {
    const w = await mount('/')
    const [en, tr] = w.findAll('a')
    expect(en!.attributes('aria-current')).toBe('true')
    expect(en!.classes()).toEqual(expect.arrayContaining(['bg-blue', 'text-white']))
    expect(tr!.attributes('aria-current')).toBeUndefined()
    expect(tr!.classes()).toEqual(
      expect.arrayContaining(['bg-transparent', 'text-navy', 'hover:bg-pale', 'hover:text-blue']),
    )
  })

  it('links to the other locale of the current page', async () => {
    const w = await mount('/about')
    expect(w.findAll('a').map((a) => a.attributes('href'))).toEqual(['/about', '/tr/hakkimizda'])
  })

  it('keeps the query on the TR link of /contact?service=...', async () => {
    const w = await mount('/contact?service=operations-supply-chain')
    const [en, tr] = w.findAll('a')
    expect(tr!.attributes('href')).toBe('/tr/iletisim?service=operations-supply-chain')
    expect(en!.attributes('href')).toBe('/contact?service=operations-supply-chain')
  })

  it('on a TR page marks TR active, labels the group in Turkish and links EN back', async () => {
    const w = await mount('/tr/iletisim?service=operations-supply-chain')
    expect(w.find('[role="group"]').attributes('aria-label')).toBe('Dil')
    const [en, tr] = w.findAll('a')
    expect(tr!.attributes('aria-current')).toBe('true')
    expect(en!.attributes('aria-current')).toBeUndefined()
    expect(en!.attributes('href')).toBe('/contact?service=operations-supply-chain')
  })

  it('has the bar spec: mist ground, line border, right-aligned 1200px container, 44px items', async () => {
    const w = await mount('/')
    expect(w.classes()).toEqual(expect.arrayContaining(['bg-mist', 'border-b', 'border-line']))
    expect(w.find('[role="group"]').classes()).toEqual(
      expect.arrayContaining(['max-w-[1200px]', 'justify-end', 'gap-1', 'px-6']),
    )
    for (const a of w.findAll('a')) expect(a.classes()).toEqual(expect.arrayContaining(['min-w-11', 'h-11', 'px-2']))
  })
})

describe('LanguageSwitcher with TR disabled', () => {
  const config = () => useRuntimeConfig().public
  afterEach(() => {
    config().enableTr = true
  })

  it('renders nothing when enableTr is false', async () => {
    config().enableTr = false
    const w = await mount('/')
    expect(w.find('[role="group"]').exists()).toBe(false)
    expect(w.findAll('a')).toHaveLength(0)
  })
})
