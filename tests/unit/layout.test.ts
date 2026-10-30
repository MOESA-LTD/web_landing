import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import App from '~/app.vue'
import DefaultLayout from '~/layouts/default.vue'

beforeAll(addPageStubs)

const mountLayout = async (route: string) => {
  const w = await mountSuspended(DefaultLayout, { route, slots: { default: () => h('h1', { id: 'page-h1' }, 'Page') } })
  await flushPromises()
  return w
}

describe('default layout', () => {
  it('starts with a skip link to #main, then the header (language dropdown inside it), main and footer', async () => {
    const w = await mountLayout('/')
    const skip = w.find('a[href="#main"]')
    expect(skip.exists()).toBe(true)
    expect(skip.text()).toBe('Skip to content')
    expect(w.element.querySelector('a')).toBe(skip.element)
    const order = ['header', 'main', 'footer'].map((sel) => w.find(sel).element)
    for (let i = 1; i < order.length; i++) {
      expect(order[i - 1]!.compareDocumentPosition(order[i]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
    expect([...w.element.children].map((el) => el.tagName)).toEqual(['A', 'HEADER', 'MAIN', 'FOOTER'])
  })

  it('has no language bar above the header: the switcher lives in the header bar', async () => {
    const w = await mountLayout('/')
    expect(w.find('[role="group"]').exists()).toBe(false)
    expect(w.find('header [data-lang-dd] button#lang-button').exists()).toBe(true)
    expect(w.findAll('[data-lang-dd]')).toHaveLength(1)
  })

  it('wraps the slot in <main id="main"> with exactly one main landmark', async () => {
    const w = await mountLayout('/')
    expect(w.findAll('main')).toHaveLength(1)
    expect(w.find('main#main #page-h1').exists()).toBe(true)
    expect(w.find('main').attributes('tabindex')).toBe('-1')
  })

  it('translates the skip link in TR', async () => {
    const w = await mountLayout('/tr')
    expect(w.find('a[href="#main"]').text()).toBe('İçeriğe geç')
  })

  it.each(['/', '/tr', '/about', '/tr/hakkimizda'])('shows the footer CTA on %s', async (route) => {
    const w = await mountLayout(route)
    expect(w.find('[data-footer-cta]').exists()).toBe(true)
  })

  it.each(['/contact', '/tr/iletisim', '/services', '/tr/hizmetler/operasyon-ve-tedarik-zinciri', '/how-we-work'])(
    'does not show the footer CTA on %s',
    async (route) => {
      const w = await mountLayout(route)
      expect(w.find('[data-footer-cta]').exists()).toBe(false)
    },
  )
})

describe('<html lang>', () => {
  const lang = () => document.documentElement.getAttribute('lang')
  // unhead writes <html lang> to the DOM asynchronously; with a real page (Home calls usePageSeo) the
  // write lands after flushPromises, so wait for it.
  const expectLang = (value: string) => vi.waitFor(() => expect(lang()).toBe(value))
  afterEach(() => document.documentElement.removeAttribute('lang'))

  it('is "en" on EN pages', async () => {
    await mountSuspended(App, { route: '/' })
    await flushPromises()
    await expectLang('en')
  })

  // /tr/iletisim has no real page yet (a stub route), so only app.vue sets the lang here.
  it('is "tr" on TR pages, set globally by the app without any page calling usePageSeo', async () => {
    await mountSuspended(App, { route: '/tr/iletisim' })
    await flushPromises()
    await expectLang('tr')
  })

  it('follows the locale when navigating between EN and TR', async () => {
    await mountSuspended(App, { route: '/' })
    await useRouter().push('/tr/iletisim')
    await flushPromises()
    await expectLang('tr')
    await useRouter().push('/contact')
    await flushPromises()
    await expectLang('en')
  })
})
