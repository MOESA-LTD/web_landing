import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, expect, it } from 'vitest'
import ProcessTimeline from '~/components/sections/ProcessTimeline.vue'
import home from '#content/en/home'
import howWeWork from '#content/en/how-we-work'

const steps = home.process.items

describe('ProcessTimeline', () => {
  it('renders an ol with one li per step', async () => {
    const w = await mountSuspended(ProcessTimeline, { props: { steps } })
    expect(w.findAll('ol > li')).toHaveLength(steps.length)
    expect(w.findAll('ol > li').map((li) => li.text())).toEqual(steps.map((s, i) => `${i + 1}${s}`))
  })

  it('numbers the aria-hidden markers 1..N', async () => {
    const w = await mountSuspended(ProcessTimeline, { props: { steps } })
    const markers = w.findAll('[data-step-marker]')
    expect(markers.map((m) => m.text())).toEqual(steps.map((_, i) => String(i + 1)))
    for (const m of markers) expect(m.attributes('aria-hidden')).toBe('true')
  })

  it('renders the loop line only when given', async () => {
    const without = await mountSuspended(ProcessTimeline, { props: { steps } })
    expect(without.find('[data-loop]').exists()).toBe(false)
    const loop = howWeWork.nonLinear.body!
    const withLoop = await mountSuspended(ProcessTimeline, { props: { steps, layout: 'column', loop } })
    expect(withLoop.find('[data-loop]').text()).toBe(loop)
  })

  it('highlights the last step by default', async () => {
    const w = await mountSuspended(ProcessTimeline, { props: { steps } })
    const items = w.findAll('ol > li')
    expect(items.at(-1)!.attributes('data-last')).toBe('true')
    const off = await mountSuspended(ProcessTimeline, { props: { steps, highlightLast: false } })
    expect(off.findAll('ol > li').at(-1)!.attributes('data-last')).toBeUndefined()
  })
})
