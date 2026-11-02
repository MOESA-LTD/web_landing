import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { addPageStubs } from './helpers/page-stubs'
import ErrorPage from '~/error.vue'
import { content as en } from '#content/en'
import { content as tr } from '#content/tr'
import { errorLocale } from '~/utils/error-locale'

beforeAll(addPageStubs)

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

const mountError = async (statusCode: number, url: string) => {
  const w = await mountSuspended(ErrorPage as never, {
    props: { error: { statusCode, statusMessage: 'x', url, message: 'x' } },
    route: url.startsWith('/tr') ? '/tr' : '/',
  })
  await flushPromises()
  return w
}

describe('errorLocale', () => {
  it('is TR for /tr and /tr/* only', () => {
    expect(errorLocale('/tr/olmayan-sayfa')).toBe('tr')
    expect(errorLocale('/tr')).toBe('tr')
    expect(errorLocale('/tr/')).toBe('tr')
    expect(errorLocale('/tracking')).toBe('en')
    expect(errorLocale('/this-does-not-exist')).toBe('en')
    expect(errorLocale('/tr/x', { enableTr: false })).toBe('en')
  })

  it('is DE for /de and /de/* only, unless DE is disabled', () => {
    expect(errorLocale('/de/gibt-es-nicht')).toBe('de')
    expect(errorLocale('/de')).toBe('de')
    expect(errorLocale('/demo')).toBe('en')
    expect(errorLocale('/de/x', { enableDe: false })).toBe('en')
    expect(errorLocale('/de/x', { enableTr: false })).toBe('de')
  })
})

describe('error.vue', () => {
  it('404 EN: MessageState with the 404.md copy, link list and the approved final CTA', async () => {
    const w = await mountError(404, '/this-does-not-exist')
    const c = en['404']
    expect(w.findAll('h1')).toHaveLength(1)
    expect(norm(w.find('h1').text())).toBe(c.hero.title)
    expect(w.text()).toContain(c.hero.body)
    expect(w.find('[data-message-state]').text()).toContain('404')
    const links = w.findAll('[data-message-list] a').map((a) => [norm(a.text()), a.attributes('href')])
    expect(links).toEqual([
      ['Return to Home', '/'],
      ['Explore Services', '/services'],
      ['How We Work', '/how-we-work'],
      ['Contact MOESA', '/contact'],
    ])
    expect(w.text()).toContain(c.finalCta.title)
    expect(w.text()).toContain(c.finalCta.body)
    expect(w.findAll('a').some((a) => norm(a.text()) === 'Return Home' && a.attributes('href') === '/')).toBe(true)
  })

  it('404 TR: the TR 404 copy for /tr/* with TR links', async () => {
    const w = await mountError(404, '/tr/olmayan-sayfa')
    const c = tr['404']
    expect(norm(w.find('h1').text())).toBe(c.hero.title)
    expect(w.find('[data-condensed]').text()).toBe(c.next.condensed)
    const links = w.findAll('[data-message-list] a').map((a) => [norm(a.text()), a.attributes('href')])
    expect(links).toEqual([
      ['Ana Sayfa', '/tr'],
      ['Hizmetler', '/tr/hizmetler'],
      ['Nasıl Çalışıyoruz', '/tr/nasil-calisiyoruz'],
      ['İletişim', '/tr/iletisim'],
    ])
    expect(w.findAll('a').some((a) => norm(a.text()) === c.finalCta.cta.label && a.attributes('href') === '/tr/iletisim')).toBe(true)
  })

  it('500: a generic message, not the 404 copy', async () => {
    const w = await mountError(500, '/services')
    expect(w.findAll('h1')).toHaveLength(1)
    expect(norm(w.find('h1').text())).not.toBe(en['404'].hero.title)
    expect(w.text()).toContain('500')
    expect(w.text()).not.toContain(en['404'].next.title)
  })
})

/**
 * I1: with a locale switched off, a 404 under its prefix (`/tr/...` with enableTr false, `/de/...` with enableDe
 * false) is rendered entirely in EN: page copy, layout chrome (skip link, header, footer), the in-page links and the
 * switcher. No link may lead back into the disabled locale (every such path answers 404 too).
 */
describe('error.vue with a locale disabled', () => {
  const config = () => useRuntimeConfig().public
  afterEach(() => {
    config().enableTr = true
    config().enableDe = true
    useNuxtApp().$i18n.locale.value = 'en'
    document.documentElement.removeAttribute('lang')
  })

  it.each([
    ['tr', '/tr/hakkimizda', 'enableTr'],
    ['de', '/de/ueber-uns', 'enableDe'],
  ] as const)('%s off: the 404 at %s is EN throughout, with no link into the disabled locale', async (code, url, flag) => {
    config()[flag] = false
    const w = await mountSuspended(ErrorPage as never, {
      props: { error: { statusCode: 404, statusMessage: 'x', url, message: 'x' } },
      route: url,
    })
    await flushPromises()
    expect(norm(w.find('h1').text())).toBe(en['404'].hero.title)
    expect(w.find('a[href="#main"]').text()).toBe('Skip to content')
    const hrefs = w.findAll('a').map((a) => a.attributes('href') ?? '')
    expect(hrefs.length).toBeGreaterThan(5)
    const prefix = `/${code}`
    expect(hrefs.filter((h) => h === prefix || h.startsWith(`${prefix}/`))).toEqual([])
    expect(w.findAll('[lang]').map((el) => el.attributes('lang'))).not.toContain(code)
    await vi.waitFor(() => expect(document.documentElement.getAttribute('lang')).toBe('en'))
  })
})

