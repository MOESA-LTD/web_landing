<script setup lang="ts">
import { brand } from '#content/site'

/**
 * Contact (EN `/contact`, TR `/tr/iletisim`): Contact.dc.html. Page hero (crumbs, h1, intro, no actions), then the
 * "project brief" band (mist): the form card (white, flex 999 1 560) beside the aside (flex 1 1 320) with the stacked
 * logo, "Direct contact" (+ company details) and "What happens next" (the 4 contact.md items, not the canvas's 5).
 * Then the approved final CTA "Ready to discuss the project?" (the canvas has none). Copy comes from contact.md via
 * useContent; form microcopy from i18n. The md "Project form" list and "Privacy note" are builder instructions,
 * implemented as the form and its consent checkbox, and not rendered as text.
 * The Turnstile script loads only here, and only when NUXT_PUBLIC_TURNSTILE_SITE_KEY is set.
 */
const { t } = useI18n()
const page = useContent('contact')
const enPage = useContent('contact', 'en')

usePageSeo(page.meta)

const siteKey = String(useRuntimeConfig().public.turnstileSiteKey ?? '')
if (siteKey) {
  useHead({
    script: [{ key: 'turnstile', src: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit', async: true, defer: true }],
  })
}

const crumbs = [{ label: t('breadcrumbs.home'), href: '/' }, { label: t('nav.contact') }]
// The CTA target is the form on this page in both locales (TR's md CTA points at /contact itself).
const finalCta = { ...page.finalCta, cta: { label: page.finalCta.cta.label, href: enPage.finalCta.cta.href } }

/** "Email: info@…" → label "Email:" + value; the email and phone values become mailto/tel links. */
const directRows = (page.direct.items ?? []).map((line) => {
  const at = line.indexOf(': ')
  const label = line.slice(0, at + 1)
  const value = line.slice(at + 2)
  const href = value === brand.email ? `mailto:${brand.email}` : value === brand.phone ? `tel:${brand.phone.replace(/\s+/g, '')}` : undefined
  return { label, value, href }
})
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :title="page.hero.title" :intro="page.hero.body" />

    <section data-project-brief class="section bg-mist" aria-labelledby="contact-form-title">
      <div class="container-site flex flex-wrap items-start gap-12">
        <div class="box-border min-w-0 flex-[999_1_560px] rounded-sm border border-line bg-white p-8">
          <!-- Visually hidden: the form's section heading (approved md heading "Project form" / TR "Form"). -->
          <h2 id="contact-form-title" class="sr-only">{{ t('form.heading') }}</h2>
          <ContactForm />
        </div>

        <aside class="flex min-w-0 flex-[1_1_320px] flex-col gap-6" aria-labelledby="contact-direct">
          <div class="py-2">
            <Logo variant="stacked" :height="96" />
          </div>

          <div data-direct-contact class="flex flex-col gap-4 rounded-sm border border-line bg-white p-8">
            <h2 id="contact-direct" class="text-h4 text-navy">{{ page.direct.title }}</h2>
            <div v-for="row in directRows" :key="row.label" class="flex flex-col gap-1">
              <p class="text-caption text-slate">{{ row.label }}</p>
              <a v-if="row.href" :href="row.href" class="text-body font-semibold text-blue underline hover:text-blue-dark">{{ row.value }}</a>
              <p v-else class="text-body text-navy">{{ row.value }}</p>
            </div>
            <div class="mt-2 border-t border-line pt-4">
              <h3 class="text-caption font-semibold text-navy">{{ page.company.title }}</h3>
              <p class="text-caption text-slate">{{ page.company.items.join(' · ') }}</p>
            </div>
          </div>

          <div data-next class="flex flex-col gap-4 rounded-sm border border-line bg-pale p-8">
            <h2 class="text-h4 text-navy">{{ page.next.title }}</h2>
            <p v-if="page.next.condensed" data-condensed class="text-body-sm text-slate">{{ page.next.condensed }}</p>
            <ol class="m-0 flex list-decimal flex-col gap-2 pl-5 text-body-sm text-slate">
              <li v-for="item in page.next.items" :key="item">{{ item }}</li>
            </ol>
          </div>
        </aside>
      </div>
    </section>

    <FinalCTA :content="finalCta" />
  </div>
</template>
