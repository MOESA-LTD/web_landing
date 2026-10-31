import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { addPageStubs } from '../helpers/page-stubs'
import { ROUTES } from '~~/i18n/routes'
import { serviceSlugs } from '#content/site'
import LanguageSwitcher from '~/components/layout/LanguageSwitcher.vue'

beforeAll(addPageStubs)

const mount = async (route: string, props: Record<string, unknown> = {}) => {
  const w = await mountSuspended(LanguageSwitcher, { route, props, attachTo: document.body })
  await flushPromises()
  mounted.push(w)
  return w
}
type Wrapper = Awaited<ReturnType<typeof mount>>
let mounted: Wrapper[] = []
afterEach(() => {
  mounted.forEach((w) => w.unmount())
  mounted = []
})

const button = (w: Wrapper) => w.find('button#lang-button')
const menu = (w: Wrapper) => w.find('#lang-menu')
const links = (w: Wrapper) => menu(w).findAll('a')
const hrefs = (w: Wrapper) => links(w).map((a) => a.attributes('href'))
const open = async (w: Wrapper) => {
  await button(w).trigger('click')
  return w
}

describe('LanguageSwitcher dropdown button', () => {
  it('is a closed disclosure button showing the current code, with aria-controls and a descriptive label', async () => {
    const w = await mount('/')
    const btn = button(w)
    expect(btn.attributes('type')).toBe('button')
    expect(btn.attributes('aria-expanded')).toBe('false')
    expect(btn.attributes('aria-controls')).toBe('lang-menu')
    expect(btn.attributes('aria-label')).toBe('Language: English')
    expect(btn.text()).toBe('EN')
    expect(btn.find('svg').attributes('aria-hidden')).toBe('true')
    expect(menu(w).attributes('hidden')).toBeDefined()
  })

  it('is no longer the grey bar: no group role, no visible "Language" label, no bar ground or border', async () => {
    const w = await mount('/')
    expect(w.find('[role="group"]').exists()).toBe(false)
    expect(w.text()).not.toContain('Language')
    expect(w.classes()).not.toEqual(expect.arrayContaining(['bg-mist', 'border-b']))
  })

  it('shows the TR code and a Turkish label on a TR page', async () => {
    const w = await mount('/tr')
    expect(button(w).text()).toBe('TR')
    expect(button(w).attributes('aria-label')).toBe('Dil: Türkçe')
  })

  it('shows the DE code and a German label on a DE page', async () => {
    const w = await mount('/de')
    expect(button(w).text()).toBe('DE')
    expect(button(w).attributes('aria-label')).toBe('Sprache: Deutsch')
  })

  it('has the canvas spec: 44px button, min 64px, 2px radius, line border; absolute 76px slot, 64px / 68px on mobile', async () => {
    const w = await mount('/')
    expect(button(w).classes()).toEqual(
      expect.arrayContaining(['h-11', 'min-w-16', 'rounded-sm', 'border', 'border-line', 'bg-white', 'px-2.5', 'gap-1.5', 'text-[13px]', 'font-bold', 'tracking-[0.08em]']),
    )
    expect(w.classes()).toEqual(
      expect.arrayContaining([
        'absolute',
        'top-0',
        'z-40',
        'h-[76px]',
        'right-[max(24px,calc((100%-1200px)/2+24px))]',
        '@max-[1159.98px]:h-16',
        '@max-[1159.98px]:right-[68px]',
      ]),
    )
  })
})

describe('LanguageSwitcher dropdown menu', () => {
  it('opens on click and lists native name plus code as EN / TR / DE links only', async () => {
    const w = await mount('/')
    await open(w)
    expect(button(w).attributes('aria-expanded')).toBe('true')
    expect(menu(w).attributes('hidden')).toBeUndefined()
    expect(links(w).map((a) => a.findAll('span').map((s) => s.text()))).toEqual([
      ['English', 'EN'],
      ['Türkçe', 'TR'],
      ['Deutsch', 'DE'],
    ])
    expect(links(w).map((a) => a.attributes('lang'))).toEqual(['en', 'tr', 'de'])
    expect(links(w).map((a) => a.attributes('hreflang'))).toEqual(['en', 'tr', 'de'])
    expect(menu(w).findAll('button')).toHaveLength(0)
  })

  it('marks the current locale aria-current="true" (bold, pale ground) and not the other', async () => {
    const w = await open(await mount('/'))
    const [en, tr] = links(w)
    expect(en!.attributes('aria-current')).toBe('true')
    expect(en!.classes()).toEqual(expect.arrayContaining(['font-bold', 'bg-pale', 'text-blue-dark']))
    expect(tr!.attributes('aria-current')).toBeUndefined()
    expect(tr!.classes()).toEqual(expect.arrayContaining(['font-medium', 'bg-transparent', 'text-navy']))
  })

  it('on a TR page marks TR current and links EN back', async () => {
    const w = await open(await mount('/tr/iletisim?service=operations-supply-chain'))
    const [en, tr] = links(w)
    expect(tr!.attributes('aria-current')).toBe('true')
    expect(en!.attributes('aria-current')).toBeUndefined()
    expect(en!.attributes('href')).toBe('/contact?service=operations-supply-chain')
  })

  it('on a DE page marks DE current and links EN and TR', async () => {
    const w = await open(await mount('/de/kontakt?service=operations-supply-chain'))
    const [en, tr, de] = links(w)
    expect(de!.attributes('aria-current')).toBe('true')
    expect(en!.attributes('aria-current')).toBeUndefined()
    expect(tr!.attributes('aria-current')).toBeUndefined()
    expect(en!.attributes('href')).toBe('/contact?service=operations-supply-chain')
    expect(tr!.attributes('href')).toBe('/tr/iletisim?service=operations-supply-chain')
  })

  it('has the canvas menu spec: right-aligned under the button, min 168px, 4px padding, menu shadow, 44px rows', async () => {
    const w = await open(await mount('/'))
    expect(menu(w).classes()).toEqual(
      expect.arrayContaining(['absolute', 'right-0', 'top-[calc(50%+28px)]', 'min-w-[168px]', 'box-content', 'p-1', 'shadow-menu', 'border', 'border-line', 'bg-white', 'rounded-sm']),
    )
    for (const a of links(w)) expect(a.classes()).toEqual(expect.arrayContaining(['h-11', 'px-3', 'justify-between', 'text-[15px]']))
  })
})

describe('LanguageSwitcher links', () => {
  it('link to the other locale of the current page', async () => {
    expect(hrefs(await mount('/about'))).toEqual(['/about', '/tr/hakkimizda', '/de/ueber-uns'])
    expect(hrefs(await mount('/de/ueber-uns'))).toEqual(['/about', '/tr/hakkimizda', '/de/ueber-uns'])
  })

  it('render the same hrefs in the closed (server-rendered) menu', async () => {
    const w = await mount('/how-we-work')
    expect(menu(w).attributes('hidden')).toBeDefined()
    expect(hrefs(w)).toEqual(['/how-we-work', '/tr/nasil-calisiyoruz', '/de/so-arbeiten-wir'])
  })

  it('keep the query on the TR link of /contact?service=...', async () => {
    const w = await mount('/contact?service=operations-supply-chain')
    expect(hrefs(w)).toEqual([
      '/contact?service=operations-supply-chain',
      '/tr/iletisim?service=operations-supply-chain',
      '/de/kontakt?service=operations-supply-chain',
    ])
  })

  // The layout renders the switcher before the page's setup (and its useSetI18nParams) runs on the server, so the
  // counterpart must come from ROUTES for every service page, in both directions.
  it.each(serviceSlugs)('link service page %s to its counterpart slug in every direction (en/tr/de), without any i18n params set', async (slug) => {
    const name = `services/${slug}` as keyof typeof ROUTES
    const { en, tr, de } = ROUTES[name]
    expect(hrefs(await mount(en))).toEqual([en, tr, de])
    expect(hrefs(await mount(tr))).toEqual([en, tr, de])
    expect(hrefs(await mount(de))).toEqual([en, tr, de])
  })

  it('cover exactly the five service pages', () => {
    expect(serviceSlugs).toHaveLength(5)
  })
})

describe('LanguageSwitcher disclosure behaviour', () => {
  it('toggles closed on a second click', async () => {
    const w = await open(await mount('/'))
    await button(w).trigger('click')
    expect(button(w).attributes('aria-expanded')).toBe('false')
    expect(menu(w).attributes('hidden')).toBeDefined()
  })

  it('does not open on hover', async () => {
    const w = await mount('/')
    await button(w).trigger('mouseenter')
    await button(w).trigger('mouseover')
    expect(button(w).attributes('aria-expanded')).toBe('false')
  })

  it('closes on Escape and returns focus to the button', async () => {
    const w = await open(await mount('/'))
    const first = links(w)[0]!
    ;(first.element as HTMLElement).focus()
    await first.trigger('keydown', { key: 'Escape' })
    expect(button(w).attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(button(w).element)
  })

  it('leaves focus alone on Escape while closed', async () => {
    const w = await mount('/')
    const other = document.createElement('input')
    document.body.append(other)
    other.focus()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    expect(document.activeElement).toBe(other)
    expect(button(w).attributes('aria-expanded')).toBe('false')
    other.remove()
  })

  it('closes on a mousedown outside, and stays open on a mousedown inside', async () => {
    const w = await open(await mount('/'))
    await links(w)[0]!.trigger('mousedown')
    expect(button(w).attributes('aria-expanded')).toBe('true')
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await flushPromises()
    expect(button(w).attributes('aria-expanded')).toBe('false')
  })

  it('closes when focus leaves the dropdown, and stays open while focus moves inside it', async () => {
    const w = await open(await mount('/'))
    const outside = document.createElement('button')
    document.body.append(outside)
    const [first, second] = links(w)
    await first!.trigger('focusout', { relatedTarget: second!.element })
    expect(button(w).attributes('aria-expanded')).toBe('true')
    await first!.trigger('focusout', { relatedTarget: outside })
    expect(button(w).attributes('aria-expanded')).toBe('false')
    outside.remove()
  })

  it('closes on a route change', async () => {
    const w = await open(await mount('/'))
    await useRouter().push('/contact')
    await flushPromises()
    expect(button(w).attributes('aria-expanded')).toBe('false')
  })

  it('closes when the link of the current locale is picked (no route change then)', async () => {
    const w = await open(await mount('/'))
    await links(w)[0]!.trigger('click')
    await flushPromises()
    expect(button(w).attributes('aria-expanded')).toBe('false')
  })

  it('can be driven from outside with v-model:open (the header closes it when Services opens)', async () => {
    const w = await mount('/', { open: true })
    expect(button(w).attributes('aria-expanded')).toBe('true')
    await button(w).trigger('click')
    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
    await w.setProps({ open: false })
    expect(button(w).attributes('aria-expanded')).toBe('false')
  })
})

describe('LanguageSwitcher with TR disabled', () => {
  const config = () => useRuntimeConfig().public
  afterEach(() => {
    config().enableTr = true
    config().enableDe = true
  })

  it('lists only EN and DE when enableTr is false', async () => {
    config().enableTr = false
    const w = await mount('/about')
    expect(links(w).map((a) => a.attributes('hreflang'))).toEqual(['en', 'de'])
    expect(hrefs(w)).toEqual(['/about', '/de/ueber-uns'])
  })

  it('lists only EN and TR when enableDe is false', async () => {
    config().enableDe = false
    const w = await mount('/about')
    expect(links(w).map((a) => a.attributes('hreflang'))).toEqual(['en', 'tr'])
  })

  it('renders nothing when both enableTr and enableDe are false', async () => {
    config().enableTr = false
    config().enableDe = false
    const w = await mount('/')
    expect(w.find('button').exists()).toBe(false)
    expect(w.findAll('a')).toHaveLength(0)
  })
})
