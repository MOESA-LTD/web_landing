import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { addPageStubs } from '../helpers/page-stubs'
import { navigation } from '#content/site'
import SiteHeader from '~/components/layout/SiteHeader.vue'

beforeAll(addPageStubs)

const mount = (route = '/') => mountSuspended(SiteHeader, { route, attachTo: document.body })
type Wrapper = Awaited<ReturnType<typeof mount>>
const desktopNav = (w: Wrapper) => w.find('[data-nav="desktop"]')

let mounted: Wrapper[] = []
const track = async (route?: string) => {
  const w = await mount(route)
  mounted.push(w)
  return w
}
afterEach(() => {
  mounted.forEach((w) => w.unmount())
  mounted = []
})

describe('SiteHeader', () => {
  it('renders the 5 primary labels from navigation.json (EN), without Home: the logo is the way home', async () => {
    const w = await track()
    const items = desktopNav(w).findAll(':scope > ul > li')
    const labels = navigation.primary.filter((i) => i.href !== '/').map((i) => i.label)
    expect(items.map((li) => li.find('a, button').text())).toEqual(labels)
    expect(labels).toEqual(['Services', 'How We Work', 'Who We Work With', 'About MOESA', 'Contact'])
    expect(items).toHaveLength(5)
    expect(desktopNav(w).find('a[href="/"]').exists()).toBe(false)
    expect(desktopNav(w).text()).not.toContain('Home')
  })

  it('is a header with a labelled primary nav, and is not sticky', async () => {
    const w = await track()
    expect(w.element.tagName).toBe('HEADER')
    expect(desktopNav(w).attributes('aria-label')).toBe('Primary')
    expect(w.classes().join(' ')).not.toMatch(/sticky|fixed/)
  })

  it('links the primary items, the logo and the CTA to EN paths', async () => {
    const w = await track()
    const hrefs = desktopNav(w)
      .findAll(':scope > ul > li > a')
      .map((a) => a.attributes('href'))
    expect(hrefs).toEqual(['/how-we-work', '/who-we-work-with', '/about', '/contact'])
    expect(w.find('a[aria-label="MOESA Ltd. home"]').attributes('href')).toBe('/')
    const cta = w.find('[data-header-cta] a')
    expect(cta.text()).toBe('Discuss a Project')
    expect(cta.attributes('href')).toBe('/contact')
  })

  it('has Services as a closed disclosure button, not a link', async () => {
    const w = await track()
    const btn = desktopNav(w).find('button')
    expect(btn.text()).toBe('Services')
    expect(btn.attributes('aria-expanded')).toBe('false')
    expect(btn.attributes('aria-controls')).toBe('services-menu')
    expect(w.find('#services-menu').attributes('hidden')).toBeDefined()
  })

  it('opens on click: aria-expanded true, 5 service links plus All services', async () => {
    const w = await track()
    const btn = desktopNav(w).find('button')
    await btn.trigger('click')
    expect(btn.attributes('aria-expanded')).toBe('true')
    const menu = w.find('#services-menu')
    expect(menu.attributes('hidden')).toBeUndefined()
    const links = menu.findAll(':scope > ul > li > a')
    expect(links).toHaveLength(6)
    expect(links.slice(0, 5).map((a) => a.text())).toEqual(navigation.services.map((s) => s.label))
    expect(links.slice(0, 5).map((a) => a.attributes('href'))).toEqual(navigation.services.map((s) => s.href))
    expect(links[5]!.text()).toBe('All services')
    expect(links[5]!.attributes('href')).toBe('/services')
  })

  it('does not open on hover', async () => {
    const w = await track()
    const btn = desktopNav(w).find('button')
    await btn.trigger('mouseenter')
    await btn.trigger('mouseover')
    expect(btn.attributes('aria-expanded')).toBe('false')
  })

  it('toggles closed on a second click', async () => {
    const w = await track()
    const btn = desktopNav(w).find('button')
    await btn.trigger('click')
    await btn.trigger('click')
    expect(btn.attributes('aria-expanded')).toBe('false')
  })

  it('closes on Escape and returns focus to the button', async () => {
    const w = await track()
    const btn = desktopNav(w).find('button')
    await btn.trigger('click')
    const firstLink = w.find('#services-menu a')
    ;(firstLink.element as HTMLElement).focus()
    await firstLink.trigger('keydown', { key: 'Escape' })
    expect(btn.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(btn.element)
  })

  it('closes on a mousedown outside, and stays open on a mousedown inside', async () => {
    const w = await track()
    const btn = desktopNav(w).find('button')
    await btn.trigger('click')
    await w.find('#services-menu a').trigger('mousedown')
    expect(btn.attributes('aria-expanded')).toBe('true')
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    await flushPromises()
    expect(btn.attributes('aria-expanded')).toBe('false')
  })

  it('marks Services current (aria-current + is-current) on a service page, and only Services', async () => {
    const w = await track('/services/operations-supply-chain')
    const btn = desktopNav(w).find('button')
    expect(btn.attributes('aria-current')).toBeDefined()
    expect(btn.classes()).toContain('is-current')
    expect(desktopNav(w).findAll(':scope > ul > li > [aria-current]')).toHaveLength(1)
    await btn.trigger('click')
    const current = w.find('#services-menu a[aria-current="page"]')
    expect(current.text()).toBe('Operations & Supply Chain')
  })

  it('marks an exact match aria-current="page", and nothing on Home (no menu item to highlight)', async () => {
    const w = await track('/about')
    const current = desktopNav(w).find('a[aria-current="page"]')
    expect(current.text()).toBe('About MOESA')
    expect(current.classes()).toContain('is-current')
    expect(desktopNav(w).findAll(':scope > ul > li > [aria-current]')).toHaveLength(1)
    const home = await track('/')
    expect(desktopNav(home).findAll('[aria-current]')).toHaveLength(0)
    expect(desktopNav(home).findAll('.is-current')).toHaveLength(0)
  })

  it('closes both menus on a route change', async () => {
    const w = await track()
    const btn = desktopNav(w).find('button')
    const menuBtn = w.find('[data-menu-button]')
    await btn.trigger('click')
    await menuBtn.trigger('click')
    expect(btn.attributes('aria-expanded')).toBe('true')
    expect(menuBtn.attributes('aria-expanded')).toBe('true')
    await useRouter().push('/contact')
    await flushPromises()
    expect(btn.attributes('aria-expanded')).toBe('false')
    expect(menuBtn.attributes('aria-expanded')).toBe('false')
  })
})

describe('SiteHeader mobile menu', () => {
  it('toggles the menu button label, aria-expanded and the in-flow panel', async () => {
    const w = await track()
    const menuBtn = w.find('[data-menu-button]')
    expect(menuBtn.attributes('aria-expanded')).toBe('false')
    expect(menuBtn.attributes('aria-controls')).toBe('mobile-menu')
    expect(menuBtn.text()).toBe('Open menu')
    expect(w.find('#mobile-menu').attributes('hidden')).toBeDefined()
    await menuBtn.trigger('click')
    expect(menuBtn.attributes('aria-expanded')).toBe('true')
    expect(menuBtn.text()).toBe('Close menu')
    expect(w.find('#mobile-menu').attributes('hidden')).toBeUndefined()
  })

  it('lists the 5 items (no Home, as in the canvas) with the five services nested under Services, then a full-width CTA', async () => {
    const w = await track()
    const panel = w.find('#mobile-menu')
    expect(panel.find('nav').attributes('aria-label')).toBe('Primary')
    expect(panel.findAll('nav > ul > li')).toHaveLength(5)
    expect(panel.find('nav > ul > li > a[href="/"]').exists()).toBe(false)
    const sub = panel.find('ul ul')
    expect(sub.findAll('a')).toHaveLength(6)
    expect(sub.findAll('a').at(-1)!.text()).toBe('All services')
    const cta = panel.find('[data-mobile-cta]')
    expect(cta.text()).toBe('Discuss a Project')
    expect(cta.attributes('href')).toBe('/contact')
    expect(cta.classes()).toContain('w-full')
  })

  it('closes on Escape and returns focus to the menu button', async () => {
    const w = await track()
    const menuBtn = w.find('[data-menu-button]')
    await menuBtn.trigger('click')
    const link = w.find('#mobile-menu a')
    ;(link.element as HTMLElement).focus()
    await link.trigger('keydown', { key: 'Escape' })
    expect(menuBtn.attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(menuBtn.element)
  })

  it('is not an overlay: the panel is in the header flow with no shadow or absolute positioning', async () => {
    const w = await track()
    const panel = w.find('#mobile-menu')
    expect(panel.classes().join(' ')).not.toMatch(/absolute|fixed|shadow/)
  })
})

describe('SiteHeader (TR)', () => {
  it('shows TR labels and Turkish paths on /tr', async () => {
    const w = await track('/tr')
    expect(
      desktopNav(w)
        .findAll(':scope > ul > li')
        .map((li) => li.find('a, button').text()),
    ).toEqual(['Hizmetler', 'Nasıl Çalışıyoruz', 'Müşterilerimiz', 'Hakkımızda', 'İletişim'])
    expect(
      desktopNav(w)
        .findAll(':scope > ul > li > a')
        .map((a) => a.attributes('href')),
    ).toEqual(['/tr/nasil-calisiyoruz', '/tr/kimlerle-calisiyoruz', '/tr/hakkimizda', '/tr/iletisim'])
    expect(w.find('[data-header-cta] a').attributes('href')).toBe('/tr/iletisim')
    expect(w.find('[data-header-cta] a').text()).toBe('Projeyi Görüşelim')
    await desktopNav(w).find('button').trigger('click')
    const links = w.findAll('#services-menu a')
    expect(links[0]!.text()).toBe('Tedarik ve Yönetilen Satın Alma')
    expect(links[0]!.attributes('href')).toBe('/tr/hizmetler/tedarik-ve-yonetilen-satin-alma')
    expect(links.at(-1)!.text()).toBe('Tüm hizmetler')
    expect(links.at(-1)!.attributes('href')).toBe('/tr/hizmetler')
  })

  it('marks Services current on a TR service page', async () => {
    const w = await track('/tr/hizmetler/operasyon-ve-tedarik-zinciri')
    expect(desktopNav(w).find('button').classes()).toContain('is-current')
    expect(desktopNav(w).findAll(':scope > ul > li > [aria-current]')).toHaveLength(1)
  })
})

describe('SiteHeader language dropdown', () => {
  const langBtn = (w: Wrapper) => w.find('button#lang-button')
  const servicesBtn = (w: Wrapper) => desktopNav(w).find('button#services-button')

  it('puts the language dropdown inside the header bar and nothing above the header', async () => {
    const w = await track()
    expect(w.find('[data-lang-dd]').exists()).toBe(true)
    expect(langBtn(w).text()).toBe('EN')
    expect(w.find('[role="group"]').exists()).toBe(false)
    // bar gap 24px (canvas .mo-hdr), CTA keeps 76px for the dropdown, hidden below 960px
    const bar = w.find('header > div')
    expect(bar.classes()).toContain('gap-6')
    expect(bar.classes()).not.toContain('gap-8')
    expect(w.find('[data-header-cta]').classes()).toEqual(expect.arrayContaining(['mr-[76px]', '@min-[1200px]:shrink-0', '@max-[959.98px]:hidden']))
    // above page content (canvas .mo-hdr z-index 30)
    expect(w.classes()).toContain('z-30')
  })

  it('opening the language menu closes the Services menu, and vice versa', async () => {
    const w = await track()
    await servicesBtn(w).trigger('click')
    expect(servicesBtn(w).attributes('aria-expanded')).toBe('true')
    await langBtn(w).trigger('click')
    expect(langBtn(w).attributes('aria-expanded')).toBe('true')
    expect(servicesBtn(w).attributes('aria-expanded')).toBe('false')
    await servicesBtn(w).trigger('click')
    expect(servicesBtn(w).attributes('aria-expanded')).toBe('true')
    expect(langBtn(w).attributes('aria-expanded')).toBe('false')
  })

  it('Escape closes the language menu and returns focus to its button', async () => {
    const w = await track()
    await langBtn(w).trigger('click')
    const link = w.find('#lang-menu a')
    ;(link.element as HTMLElement).focus()
    await link.trigger('keydown', { key: 'Escape' })
    expect(langBtn(w).attributes('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(langBtn(w).element)
  })

  it('a route change closes the language menu', async () => {
    const w = await track()
    await langBtn(w).trigger('click')
    await useRouter().push('/contact')
    await flushPromises()
    expect(langBtn(w).attributes('aria-expanded')).toBe('false')
  })

  it('lists the TR counterpart of the current page, and is Turkish on /tr/*', async () => {
    const w = await track('/about')
    expect(w.findAll('#lang-menu a').map((a) => a.attributes('href'))).toEqual(['/about', '/tr/hakkimizda'])
    const tr = await track('/tr/hakkimizda')
    expect(langBtn(tr).attributes('aria-label')).toBe('Dil: Türkçe')
  })
})
