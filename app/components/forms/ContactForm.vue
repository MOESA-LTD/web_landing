<script setup lang="ts">
import { serviceOptions } from '#content/site'
import type { Locale } from '#content/types'
import { localizeHref } from '~~/i18n/routes'
import {
  LIMITS,
  REQUIRED_FIELDS,
  serviceOptionForSlug,
  validateContactClient,
  type ContactErrorCode,
  type ContactErrors,
  type ContactFailure,
  type ContactField,
} from '#shared/contact'

/**
 * The project-brief form (bundle.js `ContactForm`, DESIGN_NOTES §4 Contact), progressively enhanced:
 * - Without JS it is a plain `<form method="post" action="/api/contact">` (urlencoded); the server answers with 303
 *   to the thank-you page, or back to the contact page with `?error=…`, where a generic summary is shown.
 * - With JS it validates on the client, posts JSON with `$fetch` and navigates to the locale's thank-you page.
 *   Errors (client or server codes) appear in a focused summary with anchor links, and on each field.
 * Labels, help and error texts come from i18n/locales. The service options show the locale's labels, but every
 * `value` is the EN contact_form.json option (the only values the API accepts). No file input (v1).
 * `?service=<slug>` and `?error=…` are read after mount: the page is prerendered and its HTML is the same for every
 * query, so reading them during SSR/hydration would mismatch.
 * Turnstile renders only when NUXT_PUBLIC_TURNSTILE_SITE_KEY is set (the page loads its script); without it the form
 * still works, and the server rejects the missing token unless the dev-only bypass is on (see .env.example).
 */
const { t, locale } = useI18n()
const route = useRoute()
const siteKey = String(useRuntimeConfig().public.turnstileSiteKey ?? '')

const OPTIONAL = ['product_category', 'target_market', 'estimated_volume', 'target_timeline'] as const
/** Form order, which is also the error-summary order. */
const FORM_ORDER: ContactField[] = [...REQUIRED_FIELDS.filter((f) => f !== 'privacy_consent'), ...OPTIONAL, 'privacy_consent']

const LABEL_KEY = {
  name: 'name',
  company: 'company',
  work_email: 'workEmail',
  country: 'country',
  service: 'service',
  project_brief: 'projectBrief',
  product_category: 'productCategory',
  target_market: 'targetMarket',
  estimated_volume: 'estimatedVolume',
  target_timeline: 'targetTimeline',
} as const
const REQUIRED_ERROR_KEY: Partial<Record<ContactField, string>> = {
  name: 'name',
  company: 'company',
  work_email: 'workEmail',
  country: 'country',
  service: 'service',
  project_brief: 'projectBrief',
  privacy_consent: 'consent',
}
const MAX: Partial<Record<ContactField, number>> = { work_email: LIMITS.email, project_brief: LIMITS.briefMax }
const FAILURE_KEY: Record<ContactFailure | 'generic', string> = {
  rate_limited: 'form.errors.rateLimited',
  verification_failed: 'form.errors.verificationFailed',
  send_failed: 'form.errors.sendFailed',
  generic: 'form.errors.generic',
}

const fieldId = (f: string) => `contact-${f}`

const values = reactive({
  name: '',
  company: '',
  work_email: '',
  country: '',
  service: '',
  project_brief: '',
  product_category: '',
  target_market: '',
  estimated_volume: '',
  target_timeline: '',
  privacy_consent: false,
  website: '',
})

/** Field errors as codes (client or server); texts are derived in the current locale. */
const errors = ref<ContactErrors>({})
/** A form-level failure (rate limit, spam check, sending, or the non-JS generic error). */
const failure = ref<ContactFailure | 'generic' | null>(null)
const sending = ref(false)
const summaryEl = ref<HTMLElement | null>(null)
const formEl = ref<HTMLFormElement | null>(null)
const turnstileEl = ref<HTMLElement | null>(null)

function message(field: ContactField, code: ContactErrorCode): string {
  if (code === 'too_long') return t('form.errors.tooLong', { max: MAX[field] ?? LIMITS.text })
  if (code === 'too_short') return t('form.errors.briefTooShort', { min: LIMITS.briefMin })
  const key = REQUIRED_ERROR_KEY[field]
  return key ? t(`form.errors.${key}`) : t('form.errors.generic')
}

const errorText = (field: ContactField) => {
  const code = errors.value[field]
  return code ? message(field, code) : undefined
}

const summary = computed(() => {
  const fields = FORM_ORDER.filter((f) => errors.value[f])
  const extra = (Object.keys(errors.value) as ContactField[]).filter((f) => !FORM_ORDER.includes(f))
  if (fields.length) {
    return {
      title: fields.length === 1 ? t('form.errorSummaryOne') : t('form.errorSummaryMany', { count: fields.length }),
      items: fields.map((f) => ({ id: fieldId(f), text: message(f, errors.value[f]!) })),
    }
  }
  if (extra.length || failure.value) return { title: t(FAILURE_KEY[failure.value ?? 'generic']), items: [] }
  return null
})

async function focusSummary() {
  await nextTick()
  summaryEl.value?.focus()
}

function focusField(id: string) {
  const el = document.getElementById(id)
  el?.focus()
  el?.scrollIntoView({ block: 'center' })
}

/* ---- Turnstile (explicit render; the script is loaded by the contact page) ---- */
interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id?: string) => void
  remove: (id: string) => void
}
let widgetId: string | undefined
let stopWaiting = false
function turnstileApi(): TurnstileApi | undefined {
  return (window as unknown as { turnstile?: TurnstileApi }).turnstile
}
async function renderTurnstile() {
  for (let i = 0; i < 200 && !stopWaiting; i++) {
    const api = turnstileApi()
    if (api && turnstileEl.value) {
      widgetId = api.render(turnstileEl.value, {
        sitekey: siteKey,
        language: locale.value,
        'response-field-name': 'cf-turnstile-response',
      })
      return
    }
    await new Promise((r) => setTimeout(r, 100))
  }
}
function resetTurnstile() {
  if (widgetId !== undefined) turnstileApi()?.reset(widgetId)
}

onMounted(() => {
  const preselect = serviceOptionForSlug(route.query.service)
  if (preselect && !values.service) values.service = preselect

  const err = route.query.error
  if (typeof err === 'string' && err) {
    failure.value = err in FAILURE_KEY ? (err as ContactFailure) : 'generic'
    focusSummary()
  }
  if (siteKey) renderTurnstile()
})
onBeforeUnmount(() => {
  stopWaiting = true
  if (widgetId !== undefined) turnstileApi()?.remove(widgetId)
})

async function onSubmit(event: Event) {
  event.preventDefault()
  if (sending.value) return
  failure.value = null
  const clientErrors = validateContactClient(values)
  errors.value = clientErrors
  if (Object.keys(clientErrors).length) {
    focusSummary()
    return
  }

  const token = formEl.value ? new FormData(formEl.value).get('cf-turnstile-response') : null
  const body = {
    ...values,
    privacy_consent: 'on',
    locale: locale.value,
    'cf-turnstile-response': typeof token === 'string' ? token : '',
  }

  sending.value = true
  try {
    await $fetch('/api/contact', { method: 'POST', body })
    await navigateTo(localizeHref('/thank-you', locale.value as Locale))
  } catch (err) {
    const e = err as { statusCode?: number; status?: number; data?: { errors?: ContactErrors; error?: string } }
    const status = e.statusCode ?? e.status
    if (status === 422 && e.data?.errors && Object.keys(e.data.errors).length) {
      errors.value = e.data.errors
    } else {
      failure.value = status === 429 ? 'rate_limited' : status === 400 ? 'verification_failed' : 'send_failed'
    }
    resetTurnstile()
    focusSummary()
  } finally {
    sending.value = false
  }
}

const options = computed(() => serviceOptions.map((o) => ({ value: o.value, label: t(`form.serviceOptions.${o.key}`) })))
</script>

<template>
  <form
    id="project-form"
    ref="formEl"
    class="@container grid max-w-[760px] gap-8"
    method="post"
    action="/api/contact"
    enctype="application/x-www-form-urlencoded"
    novalidate
    :aria-busy="sending ? 'true' : undefined"
    @submit="onSubmit"
  >
    <div
      v-if="summary"
      ref="summaryEl"
      data-error-summary
      role="alert"
      tabindex="-1"
      class="rounded-sm border-2 border-danger bg-danger-tint p-6"
    >
      <p class="text-h4 text-navy">{{ summary.title }}</p>
      <ul v-if="summary.items.length" class="mt-2 list-disc pl-6 text-body-sm">
        <li v-for="item in summary.items" :key="item.id">
          <a :href="`#${item.id}`" class="font-semibold text-danger hover:text-danger" @click.prevent="focusField(item.id)">{{ item.text }}</a>
        </li>
      </ul>
    </div>

    <input type="hidden" name="locale" :value="locale">

    <div class="grid grid-cols-2 gap-6 @max-[560.98px]:grid-cols-1">
      <FormField v-for="f in (['name', 'company', 'work_email', 'country'] as const)" :id="fieldId(f)" :key="f" v-slot="{ describedBy, invalid }" :label="t(`form.labels.${LABEL_KEY[f]}`)" :error="errorText(f)">
        <input
          :id="fieldId(f)"
          v-model="values[f]"
          :name="f"
          :type="f === 'work_email' ? 'email' : 'text'"
          :autocomplete="{ name: 'name', company: 'organization', work_email: 'email', country: 'country-name' }[f]"
          :maxlength="f === 'work_email' ? LIMITS.email : LIMITS.text"
          required
          class="form-control"
          :aria-invalid="invalid ? 'true' : undefined"
          :aria-describedby="describedBy"
        >
      </FormField>

      <FormField :id="fieldId('service')" v-slot="{ describedBy, invalid }" wide :label="t('form.labels.service')" :error="errorText('service')">
        <select
          :id="fieldId('service')"
          v-model="values.service"
          name="service"
          required
          class="form-control"
          :aria-invalid="invalid ? 'true' : undefined"
          :aria-describedby="describedBy"
        >
          <option value="" disabled>{{ t('form.servicePlaceholder') }}</option>
          <option v-for="o in options" :key="o.value" :value="o.value">{{ o.label }}</option>
        </select>
      </FormField>

      <FormField
        :id="fieldId('project_brief')"
        v-slot="{ describedBy, invalid }"
        wide
        :label="t('form.labels.projectBrief')"
        :help="t('form.briefHelp')"
        :error="errorText('project_brief')"
      >
        <textarea
          :id="fieldId('project_brief')"
          v-model="values.project_brief"
          name="project_brief"
          rows="5"
          :maxlength="LIMITS.briefMax"
          required
          class="form-control"
          :aria-invalid="invalid ? 'true' : undefined"
          :aria-describedby="describedBy"
        />
      </FormField>
    </div>

    <div role="group" aria-labelledby="contact-optional" class="grid gap-6 rounded-sm bg-mist p-6">
      <h3 id="contact-optional" class="text-h4 text-navy">{{ t('form.projectDetails') }}</h3>
      <div class="grid grid-cols-2 gap-6 @max-[560.98px]:grid-cols-1">
        <FormField v-for="f in OPTIONAL" :id="fieldId(f)" :key="f" v-slot="{ describedBy, invalid }" optional :label="t(`form.labels.${LABEL_KEY[f]}`)" :error="errorText(f)">
          <input
            :id="fieldId(f)"
            v-model="values[f]"
            :name="f"
            type="text"
            :maxlength="LIMITS.text"
            class="form-control"
            :aria-invalid="invalid ? 'true' : undefined"
            :aria-describedby="describedBy"
          >
        </FormField>
      </div>
    </div>

    <div class="grid grid-cols-[auto_1fr] items-start gap-x-3 gap-y-1 text-body-sm text-slate">
      <input
        :id="fieldId('privacy_consent')"
        v-model="values.privacy_consent"
        type="checkbox"
        name="privacy_consent"
        value="on"
        required
        class="mt-0.5 size-5 accent-blue"
        :class="errors.privacy_consent && 'outline-2 outline-offset-1 outline-danger outline-solid'"
        :aria-invalid="errors.privacy_consent ? 'true' : undefined"
        :aria-describedby="errors.privacy_consent ? `${fieldId('privacy_consent')}-err` : undefined"
      >
      <i18n-t keypath="form.consent" tag="label" scope="global" :for="fieldId('privacy_consent')">
        <template #link>
          <NuxtLink :to="localizeHref('/privacy-policy', locale as Locale)" class="text-blue underline hover:text-blue-dark">{{ t('footer.legal.privacyPolicy') }}</NuxtLink>
        </template>
      </i18n-t>
      <p
        v-if="errors.privacy_consent"
        :id="`${fieldId('privacy_consent')}-err`"
        data-error
        class="col-start-2 flex items-start gap-1 text-caption font-semibold text-danger"
      >
        <Glyph name="alert" :size="16" class="mt-0.5" />
        <span>{{ errorText('privacy_consent') }}</span>
      </p>
    </div>

    <!-- Honeypot: invisible to people and assistive tech; bots that fill it are dropped silently by the server. -->
    <div aria-hidden="true" class="absolute -left-[10000px] h-px w-px overflow-hidden">
      <label :for="fieldId('website')">{{ t('form.honeypot') }}</label>
      <input :id="fieldId('website')" v-model="values.website" type="text" name="website" tabindex="-1" autocomplete="off">
    </div>

    <div v-if="siteKey" ref="turnstileEl" data-turnstile class="min-h-[65px]" />

    <div class="flex flex-wrap items-center gap-6">
      <Button type="submit">{{ sending ? t('form.sending') : t('form.submit') }}</Button>
      <p class="text-caption text-slate">{{ t('form.disclaimer') }}</p>
    </div>
  </form>
</template>
