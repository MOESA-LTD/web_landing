import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import LineMotif from '~/components/brand/LineMotif.vue'

describe('LineMotif', () => {
  it('chevron: aria-hidden svg with the two DESIGN_NOTES §3.5 polygons', async () => {
    const w = await mountSuspended(LineMotif, { props: { variant: 'chevron' } })
    const svg = w.find('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('viewBox')).toBe('0 0 734 1125')
    expect(w.findAll('polygon').map((p) => p.attributes('points'))).toEqual([
      '-693,825 307,248 1307,825 1307,938 307,361 -693,938',
      '-379,825 621,248 1621,825 1621,938 621,361 -379,938',
    ])
  })

  it('bars: aria-hidden svg with the two DESIGN_NOTES §3.5 polygons', async () => {
    const w = await mountSuspended(LineMotif, { props: { variant: 'bars' } })
    const svg = w.find('svg')
    expect(svg.attributes('aria-hidden')).toBe('true')
    expect(svg.attributes('viewBox')).toBe('0 0 696 142')
    expect(w.findAll('polygon').map((p) => p.attributes('points'))).toEqual([
      '75,0 535,0 520,59 60,59',
      '156,83 616,83 601,142 141,142',
    ])
  })
})
