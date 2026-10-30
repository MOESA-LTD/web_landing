import { flushPromises } from '@vue/test-utils'
import { mountSuspended, registerEndpoint } from '@nuxt/test-utils/runtime'
import { readBody, setResponseStatus } from 'h3'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { addPageStubs } from '../helpers/page-stubs'
import ContactForm from '~/components/forms/ContactForm.vue'
import { contactForm } from '#content/site'
import { SERVICE_SLUG_TO_OPTION } from '#shared/contact'

beforeAll(addPageStubs)

type Wrapper = Awaited<ReturnType<typeof mountSuspended>>
const mounted: Wrapper[] = []
afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount()
})

const mountAt = async (route: string) => {
  const w = await mountSuspended(ContactForm, { route, attachTo: document.body })
  mounted.push(w)
  await flushPromises()
  return w
}

const norm = (s: string) => s.replace(/\s+/g, ' ').trim()

const fill = async (w: Wrapper, values: Record<string, string>) => {
  for (const [name, value] of Object.entries(values)) await w.find(`[name="${name}"]`).setValue(value)
}
const VALID = {
  name: 'Ada Lovelace',
  company: 'Analytical Ltd',
  work_email: 'ada@analytical.example',
  country: 'Bulgaria',
  service: 'Operations & Supply Chain',
  project_brief: 'We need a supplier for kitchen textiles in the EU.',
}

describe('ContactForm', () => {
  it('is a progressive-enhancement form: POST to /api/contact, id project-form, urlencoded', async () => {
    const w = await mountAt('/contact')
    const form = w.find('form')
    expect(form.attributes('method')).toBe('post')
    expect(form.attributes('action')).toBe('/api/contact')
    expect(form.attributes('id')).toBe('project-form')
    expect(form.attributes('enctype') ?? 'application/x-www-form-urlencoded').toBe('application/x-www-form-urlencoded')
    expect(form.find('input[type="hidden"][name="locale"]').attributes('value')).toBe('en')
  })

  it('has no file input (file upload is disabled in v1)', async () => {
    const w = await mountAt('/contact')
    expect(w.find('input[type="file"]').exists()).toBe(false)
    expect(w.text()).not.toMatch(/file upload/i)
  })

  it('has a hidden honeypot field `website`, out of the tab order', async () => {
    const w = await mountAt('/contact')
    const hp = w.find('input[name="website"]')
    expect(hp.exists()).toBe(true)
    expect(hp.attributes('tabindex')).toBe('-1')
    expect(hp.attributes('autocomplete')).toBe('off')
    expect(hp.element.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('labels the optional fields with "(optional)" and the required ones without', async () => {
    const w = await mountAt('/contact')
    const label = (name: string) => norm(w.find(`label[for="${w.find(`[name="${name}"]`).attributes('id')}"]`).text())
    for (const name of ['product_category', 'target_market', 'estimated_volume', 'target_timeline']) {
      expect(label(name)).toMatch(/\(optional\)$/)
    }
    expect(label('product_category')).toBe('Product Category (optional)')
    for (const name of ['name', 'company', 'work_email', 'country', 'service', 'project_brief']) {
      expect(label(name)).not.toContain('(optional)')
    }
  })

  it('offers the 10 contact_form.json options as values after a disabled placeholder', async () => {
    const w = await mountAt('/contact')
    const options = w.findAll('select[name="service"] option')
    expect(options[0]!.attributes('value')).toBe('')
    expect(options[0]!.attributes('disabled')).toBeDefined()
    expect(options[0]!.text()).toBe('Select a service')
    expect(options.slice(1).map((o) => o.attributes('value'))).toEqual(contactForm.service_options)
    expect(options.slice(1).map((o) => o.text())).toEqual(contactForm.service_options)
  })

  it('shows TR labels on TR pages but keeps the EN option values', async () => {
    const w = await mountAt('/tr/iletisim')
    const options = w.findAll('select[name="service"] option').slice(1)
    expect(options.map((o) => o.attributes('value'))).toEqual(contactForm.service_options)
    expect(options[5]!.text()).toBe('Operasyon ve Tedarik Zinciri')
    expect(options[0]!.text()).toBe('Marka/ürün sourcing')
    expect(w.find('input[name="locale"]').attributes('value')).toBe('tr')
    expect(w.text()).toContain('(opsiyonel)')
  })

  it('preselects the service from ?service=operations-supply-chain', async () => {
    const w = await mountAt('/contact?service=operations-supply-chain')
    const select = w.find('select[name="service"]').element as HTMLSelectElement
    expect(select.value).toBe('Operations & Supply Chain')
  })

  it('preselects from the EN slug on the TR page too', async () => {
    const w = await mountAt('/tr/iletisim?service=market-access-commercial-representation')
    expect((w.find('select[name="service"]').element as HTMLSelectElement).value).toBe('Market Access')
  })

  it('maps every service slug to an existing option', () => {
    for (const option of Object.values(SERVICE_SLUG_TO_OPTION)) expect(contactForm.service_options).toContain(option)
    expect(Object.keys(SERVICE_SLUG_TO_OPTION)).toHaveLength(5)
  })

  it('keeps the placeholder selected for ?service=bogus', async () => {
    const w = await mountAt('/contact?service=bogus')
    const select = w.find('select[name="service"]').element as HTMLSelectElement
    expect(select.value).toBe('')
    expect(select.selectedIndex).toBe(0)
  })

  it('an empty submit shows a focused error summary "Please check 7 fields" with anchor links', async () => {
    const w = await mountAt('/contact')
    await w.find('form').trigger('submit')
    await flushPromises()
    const summary = w.find('[data-error-summary]')
    expect(summary.exists()).toBe(true)
    expect(summary.attributes('role')).toBe('alert')
    expect(summary.attributes('tabindex')).toBe('-1')
    expect(document.activeElement).toBe(summary.element)
    expect(norm(summary.find('p').text())).toBe('Please check 7 fields')
    const links = summary.findAll('a')
    expect(links.map((a) => norm(a.text()))).toEqual([
      'Enter your name.',
      'Enter your company name.',
      'Enter a work email address, like name@company.com.',
      'Enter your country.',
      'Choose how we can support you.',
      'Describe the project briefly.',
      'Confirm consent so we can respond to your enquiry.',
    ])
    for (const a of links) {
      const target = w.find(a.attributes('href')!)
      expect(target.exists(), a.attributes('href')).toBe(true)
    }
  })

  it('marks invalid fields with aria-invalid and aria-describedby pointing at the written error', async () => {
    const w = await mountAt('/contact')
    await w.find('form').trigger('submit')
    await flushPromises()
    for (const name of ['name', 'company', 'work_email', 'country', 'service', 'project_brief', 'privacy_consent']) {
      const el = w.find(`[name="${name}"]`)
      expect(el.attributes('aria-invalid'), name).toBe('true')
      const ids = el.attributes('aria-describedby')!.split(' ')
      const err = ids.map((id) => w.find(`#${id}`)).find((e) => e.classes().includes('ms-error') || e.attributes('data-error') !== undefined)
      expect(err?.exists(), `${name} error`).toBe(true)
      expect(norm(err!.text()).length).toBeGreaterThan(0)
    }
    // Optional fields stay valid.
    expect(w.find('[name="product_category"]').attributes('aria-invalid')).toBeUndefined()
  })

  it('keeps the brief help text in aria-describedby', async () => {
    const w = await mountAt('/contact')
    const brief = w.find('[name="project_brief"]')
    const help = w.find(`#${brief.attributes('aria-describedby')}`)
    expect(norm(help.text())).toBe('What the business needs, what is already confirmed and what remains open.')
  })

  it('validates the email format and the brief length on the client', async () => {
    const w = await mountAt('/contact')
    await fill(w, { ...VALID, work_email: 'nope', project_brief: 'short' })
    await w.find('[name="privacy_consent"]').setValue(true)
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(norm(w.find('[data-error-summary] p').text())).toBe('Please check 2 fields')
    expect(w.find('[data-error-summary]').text()).toContain('Enter a work email address, like name@company.com.')
  })

  it('shows the TR error texts on the TR page', async () => {
    const w = await mountAt('/tr/iletisim')
    await w.find('form').trigger('submit')
    await flushPromises()
    expect(norm(w.find('[data-error-summary] p').text())).toBe('Lütfen 7 alanı kontrol edin')
    expect(w.find('[data-error-summary]').text()).toContain('Adınızı girin.')
  })

  it('shows a generic error summary after a non-JS redirect to ?error=1', async () => {
    const w = await mountAt('/contact?error=1')
    const summary = w.find('[data-error-summary]')
    expect(summary.exists()).toBe(true)
    expect(summary.attributes('role')).toBe('alert')
  })

  it('maps server error codes (422) to the i18n texts', async () => {
    registerEndpoint('/api/contact', {
      method: 'POST',
      // As the real route answers: status 422 with `{ errors: { field: code } }`.
      handler: (event) => {
        setResponseStatus(event, 422)
        return { errors: { service: 'invalid_option', project_brief: 'too_long' } }
      },
    })
    const w = await mountAt('/contact')
    await fill(w, VALID)
    await w.find('[name="privacy_consent"]').setValue(true)
    await w.find('form').trigger('submit')
    await flushPromises()
    await vi.waitFor(() => expect(w.find('[data-error-summary]').exists()).toBe(true))
    const text = w.find('[data-error-summary]').text()
    expect(text).toContain('Choose how we can support you.')
    expect(text).toContain('5000')
  })

  it('a successful JS submit posts JSON with the EN service value and goes to the thank-you page', async () => {
    let received: Record<string, unknown> | undefined
    registerEndpoint('/api/contact', {
      method: 'POST',
      handler: async (event) => {
        received = await readBody(event)
        return { ok: true }
      },
    })
    const w = await mountAt('/tr/iletisim')
    await fill(w, VALID)
    await w.find('[name="privacy_consent"]').setValue(true)
    await w.find('form').trigger('submit')
    await vi.waitFor(() => expect(useRoute().path).toBe('/tr/tesekkurler'))
    expect(received).toMatchObject({ ...VALID, privacy_consent: 'on', locale: 'tr', website: '' })
  })
})
