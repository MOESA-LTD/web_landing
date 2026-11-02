/**
 * The env a server route reads at request time.
 *
 * On Cloudflare Pages the project's variables and secrets reach the function as bindings (`event.context.cloudflare.env`,
 * set by Nitro's cloudflare-pages entry). Nitro also maps them into `process.env`, and the Workers runtime does too
 * with `nodejs_compat` and a compatibility date on or after 2025-04-01, but reading the bindings first keeps the
 * secrets working even if those runtime settings were missing. String bindings win over `process.env`; non-string
 * bindings (KV, R2 ...) are ignored. Anywhere else (`node .output/server`, `nuxt dev`, unit tests) this is `process.env`.
 *
 * h3 types only: the helper also runs in a plain h3 app (unit tests).
 */
import type { H3Event } from 'h3'

export type RuntimeEnv = Record<string, string | undefined>

/** The Cloudflare request context Nitro's cloudflare-pages entry puts on the event, if any. */
export function cloudflareContext(event: H3Event): { env?: Record<string, unknown> } | undefined {
  const cf = (event.context as { cloudflare?: unknown }).cloudflare
  return cf && typeof cf === 'object' ? (cf as { env?: Record<string, unknown> }) : undefined
}

export function runtimeEnv(event: H3Event): RuntimeEnv {
  const base: RuntimeEnv = globalThis.process?.env ?? {}
  const bindings = cloudflareContext(event)?.env
  if (!bindings) return base
  const env: RuntimeEnv = { ...base }
  for (const [key, value] of Object.entries(bindings)) if (typeof value === 'string') env[key] = value
  return env
}
