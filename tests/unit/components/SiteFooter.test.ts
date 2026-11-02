import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import { brand, navigation } from '#content/site'
import SiteFooter from '~/components/layout/SiteFooter.vue'

const mount = (route = '/', props: { showCta?: boolean } = {}) => mountSuspended(SiteFooter, { route, props })

describe('SiteFooter', () => {
  it('is a footer on the inverse surface (cyan focus ring)', async () => {
    const w = await mount()
    expect(w.element.tagName).toBe('FOOTER')
    expect(w.classes()).toContain('surface-inverse')
  })

  it('shows the brand email as a mailto link and the phone as a tel link', async () => {
    const w = await mount()
    const mail = w.find(`a[href="mailto:${brand.email}"]`)
    expect(mail.exists()).toBe(true)
    expect(mail.text()).toBe(brand.email)
    const tel = w.find('a[href="tel:+35988501661"]')
    expect(tel.exists()).toBe(true)
    expect(tel.text()).toBe(brand.phone)
  })

  it('labels the contact details and shows the registered address', async () => {
    const w = await mount()
    const addr = w.find('address')
    expect(addr.text()).toContain('Email')
    expect(addr.text()).toContain('Phone')
    expect(addr.text()).toContain('Registered address')
    expect(addr.text()).toContain(brand.address)
  })

  it('shows the company ID and VAT line', async () => {
    const w = await mount()
    expect(w.text()).toContain(`MOESA Ltd. · Company ID ${brand.company_id} · VAT ${brand.vat}`)
  })

  it('has the 3 legal links, localised', async () => {
    const w = await mount()
    const links = w.find('[data-footer-bar]').findAll('a')
    expect(links.map((a) => a.text())).toEqual(navigation.legal.map((l) => l.label))
    expect(links.map((a) => a.attributes('href'))).toEqual(navigation.legal.map((l) => l.href))
  })

  it('bottom bar is navy-dark with a 1px navy-line top border', async () => {
    const w = await mount()
    expect(w.find('[data-footer-bar]').classes()).toEqual(
      expect.arrayContaining(['bg-navy-dark', 'border-t', 'border-navy-line']),
    )
  })

  it('lists the 5 services and the Company links without Home', async () => {
    const w = await mount()
    const cols = w.findAll('[data-footer-col]')
    expect(cols.map((c) => c.find('h2').text())).toEqual(['Services', 'Company', 'Contact'])
    expect(cols[0]!.findAll('a').map((a) => a.text())).toEqual(navigation.services.map((s) => s.label))
    expect(cols[1]!.findAll('a').map((a) => a.text())).toEqual(navigation.primary.slice(1).map((s) => s.label))
  })

  it('shows the descriptor, and the inverse CTA only when showCta', async () => {
    const without = await mount('/', { showCta: false })
    expect(without.find('[data-footer-cta]').exists()).toBe(false)
    expect(without.text()).toContain(brand.descriptor_en)
    const withCta = await mount('/', { showCta: true })
    const cta = withCta.find('[data-footer-cta]')
    expect(cta.text()).toBe('Discuss a Project')
    expect(cta.attributes('href')).toBe('/contact')
  })

  it('renders TR labels, descriptor and Turkish paths on /tr', async () => {
    const w = await mount('/tr', { showCta: true })
    expect(w.text()).toContain(brand.descriptor_tr)
    expect(w.find('[data-footer-cta]').attributes('href')).toBe('/tr/iletisim')
    expect(
      w
        .find('[data-footer-bar]')
        .findAll('a')
        .map((a) => a.attributes('href')),
    ).toEqual(['/tr/gizlilik-politikasi', '/tr/cerez-politikasi', '/tr/yasal-bildirim'])
    expect(w.findAll('[data-footer-col]').map((c) => c.find('h2').text())).toEqual(['Hizmetler', 'Şirket', 'İletişim'])
    expect(w.text()).toContain(brand.company_id)
    expect(w.text()).toContain(brand.vat)
  })
})
