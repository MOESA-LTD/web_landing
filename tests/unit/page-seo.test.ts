import { describe, expect, it } from 'vitest'
import { buildPageSeo } from '../../i18n/seo'

const meta = { path: '/contact', title: 'Contact | MOESA Ltd.', description: 'Desc.' }

function metaContent(head: ReturnType<typeof buildPageSeo>, key: string) {
  return head.meta.find((m) => m.name === key || m.property === key)?.content
}

describe('buildPageSeo', () => {
  it('sets title, description, canonical and html lang (EN)', () => {
    const head = buildPageSeo(meta, 'en')
    expect(head.title).toBe('Contact | MOESA Ltd.')
    expect(head.htmlAttrs).toEqual({ lang: 'en' })
    expect(metaContent(head, 'description')).toBe('Desc.')
    expect(head.link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/contact')
  })

  it('uses a self-referencing TR canonical and TR html lang', () => {
    const head = buildPageSeo(meta, 'tr')
    expect(head.htmlAttrs).toEqual({ lang: 'tr' })
    expect(head.link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/tr/iletisim')
    expect(metaContent(head, 'og:url')).toBe('https://www.moesaltd.com/tr/iletisim')
  })

  it('emits hreflang en, tr and x-default (= EN) on both locales', () => {
    for (const locale of ['en', 'tr'] as const) {
      const alt = buildPageSeo(meta, locale).link.filter((l) => l.rel === 'alternate')
      expect(alt.map((l) => [l.hreflang, l.href])).toEqual([
        ['en', 'https://www.moesaltd.com/contact'],
        ['tr', 'https://www.moesaltd.com/tr/iletisim'],
        ['x-default', 'https://www.moesaltd.com/contact'],
      ])
    }
  })

  it('keeps "/" as the only path with a trailing slash; TR home has none', () => {
    const en = buildPageSeo({ ...meta, path: '/' }, 'en')
    expect(en.link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/')
    const tr = buildPageSeo({ ...meta, path: '/' }, 'tr')
    expect(tr.link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/tr')
  })

  it('maps a service page to its Turkish slug', () => {
    const head = buildPageSeo({ ...meta, path: '/services/operations-supply-chain' }, 'tr')
    expect(head.link.find((l) => l.rel === 'canonical')?.href).toBe(
      'https://www.moesaltd.com/tr/hizmetler/operasyon-ve-tedarik-zinciri',
    )
  })

  it('sets OG and Twitter tags', () => {
    const head = buildPageSeo(meta, 'en')
    expect(metaContent(head, 'og:title')).toBe('Contact | MOESA Ltd.')
    expect(metaContent(head, 'og:description')).toBe('Desc.')
    expect(metaContent(head, 'og:type')).toBe('website')
    expect(metaContent(head, 'og:site_name')).toBe('MOESA Ltd.')
    expect(metaContent(head, 'og:image')).toBe('https://www.moesaltd.com/og-default.png')
    expect(metaContent(head, 'twitter:card')).toBe('summary_large_image')
    expect(metaContent(head, 'twitter:title')).toBe('Contact | MOESA Ltd.')
    expect(metaContent(head, 'twitter:description')).toBe('Desc.')
    expect(metaContent(head, 'twitter:image')).toBe('https://www.moesaltd.com/og-default.png')
  })

  it('drops the TR alternate when TR is disabled', () => {
    const alt = buildPageSeo(meta, 'en', { enableTr: false }).link.filter((l) => l.rel === 'alternate')
    expect(alt.map((l) => l.hreflang)).toEqual(['en', 'x-default'])
  })

  it('emits no canonical or alternates for a path that is not a route (404)', () => {
    const head = buildPageSeo({ ...meta, path: '/404' }, 'en')
    expect(head.link).toEqual([])
    expect(metaContent(head, 'og:url')).toBeUndefined()
  })
})
