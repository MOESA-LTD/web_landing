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

  it('emits hreflang en, tr, de, bg and x-default (= EN) on every locale', () => {
    for (const locale of ['en', 'tr', 'de', 'bg'] as const) {
      const alt = buildPageSeo(meta, locale).link.filter((l) => l.rel === 'alternate')
      expect(alt.map((l) => [l.hreflang, l.href])).toEqual([
        ['en', 'https://www.moesaltd.com/contact'],
        ['tr', 'https://www.moesaltd.com/tr/iletisim'],
        ['de', 'https://www.moesaltd.com/de/kontakt'],
        ['bg', 'https://www.moesaltd.com/bg/kontakti'],
        ['x-default', 'https://www.moesaltd.com/contact'],
      ])
    }
  })

  it('uses a self-referencing DE canonical, DE html lang and the German slug', () => {
    const head = buildPageSeo(meta, 'de')
    expect(head.htmlAttrs).toEqual({ lang: 'de' })
    expect(head.link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/de/kontakt')
    expect(metaContent(head, 'og:url')).toBe('https://www.moesaltd.com/de/kontakt')
    const svc = buildPageSeo({ ...meta, path: '/services/operations-supply-chain' }, 'de')
    expect(svc.link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/de/leistungen/operations-und-lieferkette')
    expect(buildPageSeo({ ...meta, path: '/' }, 'de').link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/de')
  })

  it('drops the DE alternate when DE is disabled, and all when all are disabled', () => {
    const noDe = buildPageSeo(meta, 'en', { enableDe: false }).link.filter((l) => l.rel === 'alternate')
    expect(noDe.map((l) => l.hreflang)).toEqual(['en', 'tr', 'bg', 'x-default'])
    const none = buildPageSeo(meta, 'en', { enableTr: false, enableDe: false, enableBg: false }).link.filter((l) => l.rel === 'alternate')
    expect(none.map((l) => l.hreflang)).toEqual(['en', 'x-default'])
  })

  it('drops the BG alternate and og:locale:alternate when BG is disabled', () => {
    const head = buildPageSeo(meta, 'en', { enableBg: false })
    expect(head.link.filter((l) => l.rel === 'alternate').map((l) => l.hreflang)).toEqual(['en', 'tr', 'de', 'x-default'])
    expect(head.meta.filter((m) => m.property === 'og:locale:alternate').map((m) => m.content)).toEqual(['tr_TR', 'de_DE'])
  })

  it('uses a self-referencing BG canonical, BG html lang and the Bulgarian slug', () => {
    const head = buildPageSeo(meta, 'bg')
    expect(head.htmlAttrs).toEqual({ lang: 'bg' })
    expect(head.link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/bg/kontakti')
    expect(metaContent(head, 'og:url')).toBe('https://www.moesaltd.com/bg/kontakti')
    const svc = buildPageSeo({ ...meta, path: '/services/operations-supply-chain' }, 'bg')
    expect(svc.link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/bg/uslugi/operatsii-i-veriga-na-dostavki')
    expect(buildPageSeo({ ...meta, path: '/' }, 'bg').link.find((l) => l.rel === 'canonical')?.href).toBe('https://www.moesaltd.com/bg')
  })

  it('sets og:locale for the page locale (bg_BG on BG pages) and og:locale:alternate for the other enabled locales', () => {
    expect(metaContent(buildPageSeo(meta, 'en'), 'og:locale')).toBe('en_GB')
    expect(metaContent(buildPageSeo(meta, 'tr'), 'og:locale')).toBe('tr_TR')
    expect(metaContent(buildPageSeo(meta, 'de'), 'og:locale')).toBe('de_DE')
    const bg = buildPageSeo(meta, 'bg')
    expect(metaContent(bg, 'og:locale')).toBe('bg_BG')
    expect(bg.meta.filter((m) => m.property === 'og:locale:alternate').map((m) => m.content)).toEqual(['en_GB', 'tr_TR', 'de_DE'])
    // A page that is not a route (404) has no alternates of any kind.
    expect(buildPageSeo({ ...meta, path: '/404' }, 'bg').meta.some((m) => m.property === 'og:locale:alternate')).toBe(false)
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
    expect(alt.map((l) => l.hreflang)).toEqual(['en', 'de', 'bg', 'x-default'])
  })

  it('emits no canonical or alternates for a path that is not a route (404)', () => {
    const head = buildPageSeo({ ...meta, path: '/404' }, 'en')
    expect(head.link).toEqual([])
    expect(metaContent(head, 'og:url')).toBeUndefined()
  })
})
