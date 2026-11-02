import { describe, expect, it } from 'vitest'
import {
  FIDELITY_EXCLUSIONS,
  approvedStringsFor,
  extractApprovedStrings,
  findMissing,
  mdPath,
  readPageMeta,
} from '../e2e/fidelity/extract'
import { deStringsFor } from '../e2e/fidelity/de'
import { content as de } from '#content/de'

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

  it('never checks an OPEN note (a legal review note, shown on Preview deployments only)', () => {
    for (const locale of ['en', 'tr'] as const) {
      for (const md of ['privacy-policy.md', 'cookie-policy.md', 'legal-notice.md']) {
        expect(approvedStringsFor(locale, md).some((s) => s.includes('OPEN / AÇIK') || s.includes('TASLAK')), `${locale}/${md}`).toBe(false)
      }
    }
  })

  it('skips exactly the package strings a legal page dropped after the legal review (LEGAL_REMOVED), nothing else', () => {
    const notice = approvedStringsFor('en', 'legal-notice.md')
    // Dropped: the draft OPEN note and the "Final wording requires legal review." sentences (legal review B3/B4).
    expect(notice).not.toContain('Confirm the legal representative or managing director before publication.')
    expect(notice).not.toContain('Content responsibility')
    // Still checked: the rest of the approved legal notice.
    expect(notice).toEqual(expect.arrayContaining(['Website operator', 'Legal representative', 'Phone: +359 88 501 661', 'VAT: BG207200475']))
    // Scoped to the three legal md files: the same kind of string on another page is still checked.
    expect(approvedStringsFor('en', 'contact.md')).toEqual(extractApprovedStrings(mdPath('en', 'contact.md')).filter((s) => !FIDELITY_EXCLUSIONS['en/contact.md']!.some((e) => e.text === s)))
  })
})

describe('findMissing', () => {
  const strings = approvedStringsFor('en', 'home.md')
  const page = strings.join('\n\n')

  it('reports nothing when every string is in the page text, whatever the whitespace', () => {
    expect(findMissing(page.replace(/ /g, '\n  '), strings, 'en')).toEqual([])
  })

  it('reports a string that the page does not show', () => {
    const removed = 'One operating model across the commercial process.'
    expect(findMissing(page.replace(removed, ''), strings, 'en')).toEqual([removed])
  })

  it('matches CSS-uppercased Turkish text with Turkish case folding (İ/i, I/ı)', () => {
    const tr = ['Yatay yetkinlik', 'Dijital Ticaret ve Ticari İçgörü', 'Işık']
    expect(findMissing('YATAY YETKİNLİK · DİJİTAL TİCARET VE TİCARİ İÇGÖRÜ · IŞIK', tr, 'tr')).toEqual([])
    expect(findMissing('DIJITAL TICARET', ['Dijital Ticaret'], 'tr')).toEqual(['Dijital Ticaret'])
  })

  it('matches CSS-uppercased English text case-insensitively', () => {
    expect(findMissing('CROSS-FUNCTIONAL CAPABILITY', ['Cross-functional capability'], 'en')).toEqual([])
  })
})

describe('deStringsFor (DE legal review notes)', () => {
  it('skips exactly the status chip text and the OPEN notes of the DE legal pages, and still checks the rest', () => {
    for (const page of ['privacy-policy', 'cookie-policy', 'legal-notice'] as const) {
      const strings = deStringsFor(page)
      expect(strings).not.toContain(de[page].status)
      expect(strings.some((s) => s.startsWith('OPEN / AÇIK') || s.includes('noch zu bestätigen')), page).toBe(false)
      expect(strings).toContain(de[page].hero.title)
      for (const sec of de[page].sections) expect(strings).toContain(sec.title)
    }
    expect(deStringsFor('privacy-policy')).toContain(
      'Das Postfach info@moesaltd.com, bei dem Ihre Anfrage eingeht, wird von Namecheap, Inc. (Private Email, USA) bereitgestellt.',
    )
  })
})
