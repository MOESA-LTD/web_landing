/**
 * The visitor's cookie choice, stored in the strictly necessary `moesa_consent` cookie for 180 days (listed in
 * the Cookie Policy inventory). `state` is `null` until a choice is made. v1 sets no non-essential cookies and
 * loads no analytics, so there is nothing to choose and the cookie is never written: the choice (analytics only)
 * is offered only when `runtimeConfig.public.analyticsId` is set, and any future analytics loader must also check
 * `state.value?.analytics === true`. There is no "preferences" category: no such cookie exists (legal review S3).
 */
export interface ConsentState {
  necessary: true
  analytics: boolean
}

/** "Reject non-essential", "Accept all", or the ticked category ("Save choices"). */
export type ConsentChoice = 'reject' | 'accept' | { analytics: boolean }

export const CONSENT_COOKIE = 'moesa_consent'
export const CONSENT_MAX_AGE = 180 * 24 * 60 * 60

/** A stored value back to a `ConsentState`, or `null` when it is missing or not well formed (e.g. edited by hand). */
export function parseConsent(value: unknown): ConsentState | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  if (typeof v.analytics !== 'boolean') return null
  return { necessary: true, analytics: v.analytics }
}

function stateFor(choice: ConsentChoice): ConsentState {
  if (choice === 'accept') return { necessary: true, analytics: true }
  if (choice === 'reject') return { necessary: true, analytics: false }
  return { necessary: true, analytics: !!choice.analytics }
}

/** Cookie attributes; `Secure` whenever the page is served over HTTPS (production), not on plain-http dev/e2e. */
export function consentCookieOptions(protocol: string) {
  return { maxAge: CONSENT_MAX_AGE, sameSite: 'lax' as const, path: '/', secure: protocol === 'https:' }
}

export function useConsent() {
  const cookie = useCookie<ConsentState | null>(CONSENT_COOKIE, {
    default: () => null,
    ...consentCookieOptions(useRequestURL().protocol),
  })
  // One shared value per app instance, so the banner and the Cookie Policy panel stay in step. Deliberately not
  // `useState`: that would carry the server's value in the payload, and a prerendered page was rendered without
  // the visitor's cookie. Each side reads the cookie itself (the client reads document.cookie).
  const nuxtApp = useNuxtApp() as ReturnType<typeof useNuxtApp> & { _moesaConsent?: Ref<ConsentState | null> }
  nuxtApp._moesaConsent ??= ref(parseConsent(cookie.value))
  const shared = nuxtApp._moesaConsent
  const state = computed(() => shared.value)

  function save(choice: ConsentChoice) {
    const next = stateFor(choice)
    shared.value = next
    cookie.value = next
  }

  function reset() {
    shared.value = null
    cookie.value = null
  }

  return { state, save, reset }
}
