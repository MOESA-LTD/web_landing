/**
 * Ruled cards (DS README "Rules, not boxes"): a 4px top rule whose colour follows the sequence
 * cyan, primary blue, dark blue, navy by position (bundle.js `ruleStyle`). Index 1 is cyan.
 */
const RULES = ['var(--color-cyan)', 'var(--color-blue)', 'var(--color-blue-dark)', 'var(--color-navy)'] as const

export function ruleColor(index: number | string | undefined): string {
  const n = Number.parseInt(String(index ?? 1), 10)
  return RULES[((Number.isFinite(n) && n > 0 ? n : 1) - 1) % RULES.length]!
}

/**
 * Colour of the decorative numeral above a ruled card: the rule colour, except that the cyan of position 1
 * becomes primary blue. Cyan text on white/mist is 2.7-2.9:1, below the 4.5:1 text contrast of the global
 * constraints (Lighthouse/axe flag it); the 4px rule itself stays cyan. Deviation from bundle.css `.ms-numeral`.
 */
export function numeralColor(index: number | string | undefined): string {
  const rule = ruleColor(index)
  return rule === RULES[0] ? 'var(--color-blue)' : rule
}

/** Two-digit numeral as the profile sets it ("01"). Non-numeric input is returned as given. */
export function numeral(index: number | string): string {
  const s = String(index)
  return /^\d+$/.test(s) ? s.padStart(2, '0') : s
}
