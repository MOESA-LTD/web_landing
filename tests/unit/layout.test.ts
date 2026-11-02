import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import App from '~/app.vue'
import DefaultLayout from '~/layouts/default.vue'
import { CONSENT_COOKIE, useConsent } from '~/composables/useConsent'

/**
 * Dedicated stub-only routes for the <html lang> tests: no real page exists at these paths, so only app.vue
 * (not a page's usePageSeo) can set the lang. Named `<base>___<locale>` like the i18n module names routes.
 */
const LANG_STUB = { en: '/__lang-stub', tr: '/tr/__lang-stub', de: '/de/__lang-stub', bg: '/bg/__lang-stub' } as const

beforeAll(() => {
  addPageStubs()
  const router = useRouter()
  for (const locale of ['en', 'tr', 'de', 'bg'] as const) {
    router.addRoute({ name: `lang-stub___${locale}`, path: LANG_STUB[locale], component: { render: () => null } })
  }
})

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

  it('translates the skip link in DE', async () => {
    const w = await mountLayout('/de')
    expect(w.find('a[href="#main"]').text()).toBe('Zum Inhalt springen')
  })

  it('translates the skip link in BG', async () => {
    const w = await mountLayout('/bg')
    expect(w.find('a[href="#main"]').text()).toBe('Към съдържанието')
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

/**
 * I3: the layout mounts the global cookie banner (CookieConsent mode="banner"). It renders only when
 * runtimeConfig.public.analyticsId is set and no choice is stored, so v1 (no analytics id) shows no banner.
 */
describe('default layout cookie banner', () => {
  const config = () => useRuntimeConfig().public as Record<string, unknown>
  const clearConsent = () => {
    document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/`
    useConsent().reset()
  }
  beforeEach(clearConsent)
  afterEach(() => {
    config().analyticsId = ''
    clearConsent()
  })

  it('is absent by default (no analyticsId)', async () => {
    expect(config().analyticsId).toBe('')
    const w = await mountLayout('/')
    expect(w.find('[data-cookie-consent]').exists()).toBe(false)
  })

  it('is present when analyticsId is set and no consent choice is stored, after the footer', async () => {
    config().analyticsId = 'G-TEST'
    const w = await mountLayout('/')
    const banner = w.find('[data-cookie-consent]')
    expect(banner.exists()).toBe(true)
    expect(w.find('footer').element.compareDocumentPosition(banner.element) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('stays hidden once a choice is stored', async () => {
    config().analyticsId = 'G-TEST'
    useConsent().save('reject')
    const w = await mountLayout('/')
    expect(w.find('[data-cookie-consent]').exists()).toBe(false)
  })
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

  it('is "tr" on TR pages, set globally by the app without any page calling usePageSeo', async () => {
    expect(useRouter().resolve(LANG_STUB.tr).matched[0]?.name).toBe('lang-stub___tr')
    await mountSuspended(App, { route: LANG_STUB.tr })
    await flushPromises()
    await expectLang('tr')
  })

  it('is "de" on DE pages', async () => {
    expect(useRouter().resolve(LANG_STUB.de).matched[0]?.name).toBe('lang-stub___de')
    await mountSuspended(App, { route: LANG_STUB.de })
    await flushPromises()
    await expectLang('de')
  })

  it('is "bg" on BG pages', async () => {
    expect(useRouter().resolve(LANG_STUB.bg).matched[0]?.name).toBe('lang-stub___bg')
    await mountSuspended(App, { route: LANG_STUB.bg })
    await flushPromises()
    await expectLang('bg')
  })

  it('follows the locale when navigating between EN and TR', async () => {
    await mountSuspended(App, { route: '/' })
    await useRouter().push(LANG_STUB.tr)
    await flushPromises()
    await expectLang('tr')
    await useRouter().push(LANG_STUB.en)
    await flushPromises()
    await expectLang('en')
  })
})
