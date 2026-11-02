import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const root = resolve(__dirname, '../..')
const css = readFileSync(resolve(root, 'app/assets/css/main.css'), 'utf8')
const cssLower = css.toLowerCase()

const brand = JSON.parse(
  readFileSync(
    resolve(root, 'content/data/brand_tokens.json'),
    'utf8',
  ),
) as { colors: Record<string, string> }

const hexes: Record<string, string> = {
  navy: '#19324A',
  'navy-dark': '#102C49',
  'blue-dark': '#003B72',
  blue: '#0069B2',
  cyan: '#14A3DB',
  slate: '#536B7D',
  pale: '#EBF5FB',
  mist: '#F7FAFC',
  line: '#D5E3ED',
  'line-strong': '#748CA0',
  'mist-blue': '#B4CFE0',
  'navy-line': '#1B4264',
  danger: '#B42318',
  'danger-tint': '#FEF3F2',
}

const typeUtilities = [
  'text-display',
  'text-h1',
  'text-h2',
  'text-h3',
  'text-h4',
  'text-lead',
  'text-body',
  'text-body-sm',
  'text-label',
  'text-eyebrow',
  'text-caption',
  'text-numeral',
  'text-stat',
]

describe('design tokens in main.css', () => {
  it.each(Object.entries(hexes))('defines --color-%s as %s', (name, hex) => {
    expect(cssLower).toContain(hex.toLowerCase())
    expect(css).toMatch(new RegExp(`--color-${name}\s*:`))
  })

  it.each(typeUtilities)('defines @utility %s', (name) => {
    expect(css).toMatch(new RegExp(String.raw`@utility\s+${name}\s*\{`))
  })

  it.each(Object.entries(brand.colors))('contains brand_tokens.json color %s (%s)', (_name, hex) => {
    expect(cssLower).toContain(hex.toLowerCase())
  })

  it('defines font, radius, shadow, container and section helpers', () => {
    expect(css).toContain('--font-sans: "Manrope Variable", Manrope, Arial, "Segoe UI", sans-serif')
    expect(css).toContain('--radius-sm: 2px')
    expect(css).toContain('--shadow-menu: 0 12px 32px rgba(16,44,73,.14)')
    expect(css).toMatch(/@utility\s+container-site\s*\{/)
    expect(css).toMatch(/@utility\s+section\s*\{/)
  })
})
