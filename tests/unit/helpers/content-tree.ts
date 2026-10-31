/**
 * Walks a content module as a tree of string leaves, addressed by dotted paths in the UNREVIEWED_* format:
 * `audiences[0].items[2]`, legal sections by id: `sections[controller].paragraphs[0]`.
 */
export const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

export const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

/** Arrays whose elements all carry a string `id` (legal sections) are addressed by id, other arrays by index. */
export const byId = (a: unknown[]) => a.length > 0 && a.every((x) => isObj(x) && typeof x.id === 'string')

export interface Leaf {
  path: string
  /** The object key the string sits under (for array items: the key of the array). */
  key: string
  value: string
}

/** Every string leaf of `value`, with its path and key. */
export function allLeaves(value: unknown, path = '', key = ''): Leaf[] {
  if (typeof value === 'string') return [{ path, key, value }]
  if (Array.isArray(value)) {
    const ids = byId(value)
    return value.flatMap((v, i) => allLeaves(v, `${path}[${ids ? (v as { id: string }).id : i}]`, key))
  }
  if (isObj(value)) return Object.entries(value).flatMap(([k, v]) => allLeaves(v, path ? `${path}.${k}` : k, k))
  return []
}

/** The value at a leaf path, or undefined. */
export function getAt(root: unknown, path: string): unknown {
  let cur: unknown = root
  for (const m of path.matchAll(/([^.[\]]+)|\[([^\]]+)\]/g)) {
    if (m[1] !== undefined) cur = isObj(cur) ? cur[m[1]] : undefined
    else if (Array.isArray(cur)) cur = byId(cur) ? cur.find((x) => (x as { id: string }).id === m[2]) : cur[Number(m[2])]
    else cur = undefined
  }
  return cur
}

/** Paths where two trees differ in shape: a key or id on one side only, an array length, or a value type. */
export function shapeDiff(a: unknown, b: unknown, path = '', out: string[] = []): string[] {
  const join = (k: string) => (path ? `${path}.${k}` : k)
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!(Array.isArray(a) && Array.isArray(b))) return [...out, `${path}: type`]
    if (byId(a) && byId(b)) {
      const ma = new Map((a as { id: string }[]).map((x) => [x.id, x]))
      const mb = new Map((b as { id: string }[]).map((x) => [x.id, x]))
      for (const id of ma.keys()) if (!mb.has(id)) out.push(`${path}[${id}]: missing`)
      for (const id of mb.keys()) if (!ma.has(id)) out.push(`${path}[${id}]: extra`)
      for (const [id, x] of ma) if (mb.has(id)) shapeDiff(x, mb.get(id), `${path}[${id}]`, out)
      // Same order too: sections render in array order.
      if ([...ma.keys()].join() !== [...mb.keys()].join()) out.push(`${path}: order`)
      return out
    }
    if (a.length !== b.length) out.push(`${path}: length`)
    for (let i = 0; i < Math.min(a.length, b.length); i++) shapeDiff(a[i], b[i], `${path}[${i}]`, out)
    return out
  }
  if (isObj(a) && isObj(b)) {
    for (const k of Object.keys(a)) if (!(k in b)) out.push(`${join(k)}: missing`)
    for (const k of Object.keys(b)) if (!(k in a)) out.push(`${join(k)}: extra`)
    for (const k of Object.keys(a)) if (k in b) shapeDiff(a[k], b[k], join(k), out)
    return out
  }
  if (typeof a !== typeof b) out.push(`${path}: type`)
  return out
}

/** Flattens a vue-i18n message file to `{ 'a.b.c': value }`. */
export function flattenMessages(o: unknown, prefix = '', acc: Record<string, string> = {}): Record<string, string> {
  for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
    const p = prefix ? `${prefix}.${k}` : k
    if (typeof v === 'string') acc[p] = v
    else flattenMessages(v, p, acc)
  }
  return acc
}
