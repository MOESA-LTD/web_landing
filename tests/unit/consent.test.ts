import { flushPromises } from '@vue/test-utils'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { CONSENT_COOKIE, CONSENT_MAX_AGE, consentCookieOptions, parseConsent, useConsent } from '~/composables/useConsent'
import CookieConsent from '~/components/legal/CookieConsent.vue'

const clearCookie = () => {
  document.cookie = `${CONSENT_COOKIE}=; Max-Age=0; Path=/`
}
const cookieValue = () =>
  document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`))
    ?.slice(CONSENT_COOKIE.length + 1)

const config = () => useRuntimeConfig().public as Record<string, unknown>

beforeEach(() => {
  clearCookie()
  useConsent().reset()
})
afterEach(() => {
  config().analyticsId = ''
})

describe('useConsent', () => {
  it('starts as null (no choice made yet)', () => {
    expect(useConsent().state.value).toBeNull()
  })

  it('stores a choice in the moesa_consent cookie for 180 days and shares the state', async () => {
    expect(CONSENT_COOKIE).toBe('moesa_consent')
    expect(CONSENT_MAX_AGE).toBe(180 * 24 * 60 * 60)
    useConsent().save({ analytics: true })
    await flushPromises()
    expect(useConsent().state.value).toEqual({ necessary: true, analytics: true })
    expect(decodeURIComponent(cookieValue() ?? '')).toContain('"analytics":true')
  })

  it('"Reject non-essential" keeps analytics off', () => {
    const { save, state } = useConsent()
    save('reject')
    expect(state.value).toEqual({ necessary: true, analytics: false })
  })

  it('"Accept all" turns analytics on; necessary is always true', () => {
    const { save, state } = useConsent()
    save('accept')
    expect(state.value).toEqual({ necessary: true, analytics: true })
  })

  it('reset() forgets the choice', () => {
    const { save, reset, state } = useConsent()
    save('accept')
    reset()
    expect(state.value).toBeNull()
  })

  it('marks the cookie Secure over HTTPS only (e2e and dev run on http)', () => {
    expect(consentCookieOptions('https:')).toEqual({ maxAge: CONSENT_MAX_AGE, sameSite: 'lax', path: '/', secure: true })
    expect(consentCookieOptions('http:').secure).toBe(false)
  })

  it('parseConsent rejects a tampered or malformed cookie value, and ignores the retired "preferences" field', () => {
    expect(parseConsent(undefined)).toBeNull()
    expect(parseConsent('nonsense')).toBeNull()
    expect(parseConsent({ necessary: true, analytics: 'yes' })).toBeNull()
    expect(parseConsent({ analytics: true })).toEqual({ necessary: true, analytics: true })
    expect(parseConsent({ preferences: true, analytics: false })).toEqual({ necessary: true, analytics: false })
  })
})

describe('CookieConsent', () => {
  it('banner: renders nothing while analyticsId is unset (v1: no non-essential cookies)', async () => {
    config().analyticsId = ''
    const w = await mountSuspended(CookieConsent, { props: { mode: 'banner' }, route: '/' })
    await flushPromises()
    expect(w.find('[data-cookie-consent]').exists()).toBe(false)
  })

  it('banner: renders when analyticsId is set and no choice is made, and closes after a choice', async () => {
    config().analyticsId = 'G-TEST'
    const w = await mountSuspended(CookieConsent, { props: { mode: 'banner' }, route: '/' })
    await flushPromises()
    const panel = w.find('[data-cookie-consent]')
    expect(panel.exists()).toBe(true)
    expect(panel.attributes('role')).toBe('region')
    const buttons = panel.findAll('button').map((b) => b.text())
    expect(buttons).toEqual(expect.arrayContaining(['Reject non-essential', 'Accept all', 'Choose settings']))
    await panel.findAll('button').find((b) => b.text() === 'Reject non-essential')!.trigger('click')
    await flushPromises()
    expect(useConsent().state.value).toEqual({ necessary: true, analytics: false })
    expect(w.find('[data-cookie-consent]').exists()).toBe(false)
  })

  it('banner: hidden once a choice exists', async () => {
    config().analyticsId = 'G-TEST'
    useConsent().save('reject')
    const w = await mountSuspended(CookieConsent, { props: { mode: 'banner' }, route: '/' })
    await flushPromises()
    expect(w.find('[data-cookie-consent]').exists()).toBe(false)
  })

  it('panel (v1, no optional cookies): only Strictly necessary, locked on, a "nothing to choose" note and no buttons', async () => {
    config().analyticsId = ''
    const w = await mountSuspended(CookieConsent, { props: { mode: 'panel' }, route: '/cookie-policy' })
    await flushPromises()
    const panel = w.find('[data-cookie-consent]')
    expect(panel.exists()).toBe(true)
    const boxes = panel.findAll('input[type="checkbox"]')
    expect(boxes).toHaveLength(1)
    expect((boxes[0]!.element as HTMLInputElement).checked).toBe(true)
    expect(boxes[0]!.attributes('disabled')).toBeDefined()
    expect(panel.text()).toContain('Strictly necessary')
    expect(panel.text()).not.toContain('Preferences')
    expect(panel.text()).not.toContain('Analytics')
    expect(panel.find('[data-cookie-none]').text()).toBe('We currently use no preference, analytics or marketing cookies, so there is nothing to choose.')
    expect(panel.findAll('button')).toHaveLength(0)
    // Nothing to choose, so nothing is stored.
    expect(cookieValue()).toBeUndefined()
  })

  it('panel with an analytics id: Analytics can be ticked and saved, and the panel stays for later changes', async () => {
    config().analyticsId = 'G-TEST'
    useConsent().save('accept')
    const w = await mountSuspended(CookieConsent, { props: { mode: 'panel' }, route: '/cookie-policy' })
    await flushPromises()
    const panel = w.find('[data-cookie-consent]')
    const boxes = panel.findAll('input[type="checkbox"]')
    expect(boxes).toHaveLength(2)
    expect(boxes[0]!.attributes('disabled')).toBeDefined()
    // The panel shows the stored choice.
    expect((boxes[1]!.element as HTMLInputElement).checked).toBe(true)
    expect(panel.find('[data-cookie-none]').exists()).toBe(false)
    await boxes[1]!.setValue(false)
    await panel.findAll('button').find((b) => b.text() === 'Save choices')!.trigger('click')
    await flushPromises()
    expect(useConsent().state.value).toEqual({ necessary: true, analytics: false })
    expect(panel.find('[role="status"]').text()).not.toBe('')
    expect(w.find('[data-cookie-consent]').exists()).toBe(true)
  })

  it('panel: TR labels', async () => {
    const w = await mountSuspended(CookieConsent, { props: { mode: 'panel' }, route: '/tr/cerez-politikasi' })
    await flushPromises()
    expect(w.text()).toContain('Zorunlu')
    expect(w.text()).toContain('Şu anda tercih, analitik veya pazarlama çerezi kullanmıyoruz')
    expect(w.text()).not.toContain('Reject non-essential')
  })
})
