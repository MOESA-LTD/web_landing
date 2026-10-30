/**
 * Sliding-window rate limit, in memory.
 *
 * Caveat (serverless): on Vercel each function instance has its own memory and instances come and go, so the
 * limit holds per warm instance, not globally. It stops bursts from one client against one instance; a global
 * limit would need a shared store (e.g. Vercel KV / Upstash). Turnstile is the main spam control.
 */
const hits = new Map<string, number[]>()

/** Above this many tracked keys, expired entries are swept so the map cannot grow without bound. */
const SWEEP_AT = 5_000

/** Records a hit for `key` and returns whether it is allowed (true) or over the limit (false). */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number } = { limit: 5, windowMs: 600_000 },
  now: number = Date.now(),
): boolean {
  const since = now - opts.windowMs
  const recent = (hits.get(key) ?? []).filter((t) => t > since)
  const allowed = recent.length < opts.limit
  if (allowed) recent.push(now)
  hits.set(key, recent)

  if (hits.size > SWEEP_AT) {
    for (const [k, times] of hits) if (!times.some((t) => t > since)) hits.delete(k)
  }
  return allowed
}

/** Test helper: forget every recorded hit. */
export function resetRateLimit(): void {
  hits.clear()
}
