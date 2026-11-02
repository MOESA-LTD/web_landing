/**
 * Sliding-window rate limit, in memory.
 *
 * Caveat (serverless): on Vercel each function instance has its own memory and instances come and go, so the
 * limit holds per warm instance, not globally. It stops bursts from one client against one instance; a global
 * limit would need a shared store (e.g. Vercel KV / Upstash). Turnstile is the main spam control.
 */
const hits = new Map<string, number[]>()

/**
 * Records a hit for `key` and returns whether it is allowed (true) or over the limit (false).
 * Every call drops keys with no hit inside the window, so a key (the client IP) is kept no longer than `windowMs`
 * after its last hit, as the privacy policy states.
 */
export function rateLimit(
  key: string,
  opts: { limit: number; windowMs: number } = { limit: 5, windowMs: 600_000 },
  now: number = Date.now(),
): boolean {
  const since = now - opts.windowMs
  for (const [k, times] of hits) if (!times.some((t) => t > since)) hits.delete(k)

  const recent = (hits.get(key) ?? []).filter((t) => t > since)
  const allowed = recent.length < opts.limit
  if (allowed) recent.push(now)
  if (recent.length) hits.set(key, recent)
  return allowed
}

/** Test helper: the number of keys currently held. */
export function rateLimitSize(): number {
  return hits.size
}

/** Test helper: forget every recorded hit. */
export function resetRateLimit(): void {
  hits.clear()
}
