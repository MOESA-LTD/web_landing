import { describe, expect, it } from 'vitest'
import {
  FIDELITY_EXCLUSIONS,
  approvedStringsFor,
  extractApprovedStrings,
  mdPath,
  readPageMeta,
} from '../e2e/fidelity/extract'

const enHome = mdPath('en', 'home.md')

describe('extractApprovedStrings', () => {
  const strings = extractApprovedStrings(enHome)

  it('returns headings, paragraphs, list items and the CTA label of home.md', () => {
    expect(strings).toContain('From commercial objective to market-ready delivery.')
    expect(strings).toContain('One mandate. One coordinated operating partner.')
    expect(strings).toContain('Retail Groups & Corporate Buyers')
    expect(strings).toContain('Discuss a Project')
    expect(strings).toContain('Let us discuss what your business needs.')
    expect(strings).toContain(
      'MOESA Ltd. is based in Plovdiv, Bulgaria, providing an EU operating base for international sourcing, procurement, market access and commercial operations.',
    )
  })

  it('skips the page title line, metadata lines and the structural headings', () => {
    expect(strings).not.toContain('Home')
    expect(strings).not.toContain('Hero')
    expect(strings).not.toContain('Final CTA')
    expect(strings.some((s) => s.includes('MOESA manages international sourcing'))).toBe(false)
    expect(strings.some((s) => /\*\*|URL:|Status:|Version:|Page Title:|APPROVED/.test(s))).toBe(false)
  })

  it('keeps markdown syntax out of the strings and normalises whitespace', () => {
    for (const s of strings) {
      expect(s).not.toMatch(/^(#|-\s|\d+\.\s)/)
      expect(s).not.toMatch(/\[|\]\(/)
      expect(s).toBe(s.replace(/\s+/g, ' ').trim())
      expect(s.length).toBeGreaterThan(0)
    }
  })

  it('splits arrow lines on " → " into separate strings', () => {
    const flow = extractApprovedStrings(mdPath('en', 'how-we-work.md'))
    expect(flow).toContain('Commercial Objective')
    expect(flow).toContain('Improve, Reorder or Expand')
    expect(flow.some((s) => s.includes('→'))).toBe(false)
    const guide = extractApprovedStrings(mdPath('en', 'who-we-work-with.md'))
    expect(guide).toContain('Need a specific brand or supplier')
    expect(guide).toContain('Sourcing & Managed Procurement')
  })

  it('reads the TR md the same way', () => {
    const tr = extractApprovedStrings(mdPath('tr', 'home.md'))
    expect(tr).toContain('Ticari hedeften pazara hazır teslimata.')
    expect(tr).toContain('Projeyi Görüşelim')
    expect(tr).not.toContain('Ana Sayfa')
  })
})

describe('readPageMeta', () => {
  it('returns the md Page Title and Meta Description', () => {
    expect(readPageMeta(enHome)).toEqual({
      title: 'MOESA Ltd. | International Procurement, Product Development & Commercial Operations',
      description:
        'MOESA manages international sourcing, product development, procurement, market access, supply chain and commercial operations for retailers, brands, manufacturers and businesses.',
    })
  })
})

describe('FIDELITY_EXCLUSIONS', () => {
  it('gives every exclusion a reason and a text that exists in its md', () => {
    for (const [key, entries] of Object.entries(FIDELITY_EXCLUSIONS)) {
      const [locale, file] = key.split('/') as ['en' | 'tr', string]
      const all = extractApprovedStrings(mdPath(locale, file))
      for (const e of entries) {
        expect(e.reason.length, `${key}: ${e.text}`).toBeGreaterThan(10)
        expect(all, `${key}: ${e.text}`).toContain(e.text)
      }
    }
  })

  it('removes excluded strings from approvedStringsFor', () => {
    const contact = approvedStringsFor('en', 'contact.md')
    expect(contact).not.toContain('File Upload - optional')
    expect(contact).not.toContain('Product Category - optional')
    expect(contact.some((s) => s.startsWith('The form must include consent'))).toBe(false)
    expect(contact).toContain('Start with the objective.')
    expect(contact).toContain('Send Project Brief')
  })

  it('replaces an exclusion with its renderedAs strings', () => {
    const home = approvedStringsFor('en', 'home.md')
    expect(home).not.toContain('Digital Commerce & Commercial Intelligence as a cross-functional capability')
    expect(home).toContain('Cross-functional capability')
    expect(home).toContain('Digital Commerce & Commercial Intelligence')
  })
})
