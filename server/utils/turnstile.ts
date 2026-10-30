/**
 * Cloudflare Turnstile server-side check (https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).
 */
import { $fetch } from 'ofetch'

export const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

/**
 * The local-development bypass: only inside `nuxt dev` AND with `CONTACT_DEV_BYPASS_TURNSTILE=true`.
 * A production build passes `dev: false` (`import.meta.dev` is compiled to false), so the flag has no effect there.
 */
export function shouldBypassTurnstile(opts: { dev: boolean; flag: string | undefined }): boolean {
  return opts.dev === true && opts.flag === 'true'
}

/** True only when Cloudflare confirms the token. A missing token, secret or network failure is a failed check. */
export async function verifyTurnstile(token: string, secret: string | undefined, remoteip?: string): Promise<boolean> {
  if (!token || !secret) return false
  try {
    const res = await $fetch<{ success?: boolean }>(SITEVERIFY_URL, {
      method: 'POST',
      body: { secret, response: token, ...(remoteip ? { remoteip } : {}) },
      timeout: 8_000,
    })
    return res?.success === true
  } catch (err) {
    console.error('[contact] Turnstile verification request failed', err)
    return false
  }
}
