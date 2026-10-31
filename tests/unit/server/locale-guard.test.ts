// @vitest-environment node
/**
 * Disabled locales answer 404: with NUXT_PUBLIC_ENABLE_TR=false (or NUXT_PUBLIC_ENABLE_DE=false) every request under
 * /tr (or /de) is a 404 instead of a rendered page. The Nitro middleware runs in a plain h3 app here.
 */
import { createApp, eventHandler, toWebHandler } from 'h3'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { disabledLocaleOfPath, localeOptionsFromEnv } from '../../../i18n/routes'

const { default: guard } = await import('../../../server/middleware/locale-guard')

const app = createApp()
app.use(guard)
app.use(eventHandler(() => 'page'))
const call = toWebHandler(app)
const get = (path: string) => call(new Request(`http://localhost${path}`))

afterEach(() => vi.unstubAllEnvs())

describe('disabledLocaleOfPath', () => {
  it('names the locale of a path only when that locale is disabled', () => {
    expect(disabledLocaleOfPath('/tr/hizmetler', { enableTr: false })).toBe('tr')
    expect(disabledLocaleOfPath('/tr', { enableTr: false })).toBe('tr')
    expect(disabledLocaleOfPath('/de/kontakt', { enableDe: false })).toBe('de')
    expect(disabledLocaleOfPath('/de/kontakt', { enableTr: false })).toBeNull()
    expect(disabledLocaleOfPath('/tracking', { enableTr: false })).toBeNull()
    expect(disabledLocaleOfPath('/demo', { enableDe: false })).toBeNull()
    expect(disabledLocaleOfPath('/tr/hizmetler', {})).toBeNull()
  })
})

describe('localeOptionsFromEnv (shared by the locale guard and the contact route)', () => {
  it('turns a locale off only for the exact value "false"; both default to on', () => {
    expect(localeOptionsFromEnv({})).toEqual({ enableTr: true, enableDe: true })
    expect(localeOptionsFromEnv({ NUXT_PUBLIC_ENABLE_TR: 'false' })).toEqual({ enableTr: false, enableDe: true })
    expect(localeOptionsFromEnv({ NUXT_PUBLIC_ENABLE_DE: 'false' })).toEqual({ enableTr: true, enableDe: false })
    expect(localeOptionsFromEnv({ NUXT_PUBLIC_ENABLE_TR: '0', NUXT_PUBLIC_ENABLE_DE: '' })).toEqual({ enableTr: true, enableDe: true })
  })

  it('reads process.env by default, at call time', () => {
    vi.stubEnv('NUXT_PUBLIC_ENABLE_DE', 'false')
    expect(localeOptionsFromEnv()).toEqual({ enableTr: true, enableDe: false })
  })
})

describe('server/middleware/locale-guard', () => {
  it('lets every locale through by default', async () => {
    for (const p of ['/', '/tr', '/tr/iletisim', '/de', '/de/kontakt?x=1']) expect((await get(p)).status, p).toBe(200)
  })

  it('answers 404 for /tr paths with NUXT_PUBLIC_ENABLE_TR=false, and leaves EN and DE alone', async () => {
    vi.stubEnv('NUXT_PUBLIC_ENABLE_TR', 'false')
    for (const p of ['/tr', '/tr/', '/tr/hizmetler/operasyon-ve-tedarik-zinciri', '/tr/_payload.json']) expect((await get(p)).status, p).toBe(404)
    for (const p of ['/', '/tracking', '/de/kontakt', '/api/contact']) expect((await get(p)).status, p).toBe(200)
  })

  it('answers 404 for /de paths with NUXT_PUBLIC_ENABLE_DE=false, and leaves EN and TR alone', async () => {
    vi.stubEnv('NUXT_PUBLIC_ENABLE_DE', 'false')
    for (const p of ['/de', '/de/leistungen', '/de/impressum']) expect((await get(p)).status, p).toBe(404)
    for (const p of ['/', '/demo', '/tr/iletisim']) expect((await get(p)).status, p).toBe(200)
  })
})
