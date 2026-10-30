<script setup lang="ts">
import { brand, navigation } from '#content/site'
import { localizeHref, routeNameForPath, type RouteName } from '~~/i18n/routes'

/**
 * Site footer (bundle.js `Footer`, bundle.css `.ms-footer*`): brand + descriptor (+ optional CTA), Services,
 * Company, Contact, then the legal bar with company ID, VAT and the three legal links. The layout passes
 * `showCta` on Home and About only. `surface-inverse` switches the focus ring to cyan.
 */
const props = withDefaults(defineProps<{ showCta?: boolean }>(), { showCta: false })

const { t, locale } = useI18n()
const loc = (href: string) => localizeHref(href, locale.value as 'en' | 'tr')

const NAV_LABEL_KEY: Partial<Record<RouteName, string>> = {
  services: 'nav.services',
  'how-we-work': 'nav.howWeWork',
  'who-we-work-with': 'nav.whoWeWorkWith',
  about: 'nav.about',
  contact: 'nav.contact',
}
const LEGAL_LABEL_KEY: Partial<Record<RouteName, string>> = {
  'privacy-policy': 'footer.legal.privacyPolicy',
  'cookie-policy': 'footer.legal.cookiePolicy',
  'legal-notice': 'footer.legal.legalNotice',
}

const descriptor = computed(() => (locale.value === 'tr' ? brand.descriptor_tr : brand.descriptor_en))
const serviceLinks = computed(() =>
  navigation.services.map((s) => ({
    href: loc(s.href),
    label: t(`nav.serviceLinks.${s.href.replace('/services/', '')}`),
  })),
)
// Company: the primary navigation without Home.
const companyLinks = computed(() =>
  navigation.primary
    .filter((i) => i.href !== '/')
    .map((i) => ({ href: loc(i.href), label: t(NAV_LABEL_KEY[routeNameForPath(i.href)!]!) })),
)
const legalLinks = computed(() =>
  navigation.legal.map((l) => ({ href: loc(l.href), label: t(LEGAL_LABEL_KEY[routeNameForPath(l.href)!]!) })),
)
const phoneHref = `tel:${brand.phone.replace(/\s+/g, '')}`

const container = 'mx-auto box-border max-w-[1200px] px-6 @max-[860.98px]:px-4'
const columnTitle = 'mb-4 text-h4 text-white'
const list = 'm-0 grid list-none gap-3 p-0 text-body-sm'
const link = 'text-mist-blue no-underline hover:text-white hover:underline'
</script>

<template>
  <footer class="surface-inverse @container bg-navy-dark font-sans text-mist-blue">
    <div
      :class="container"
      class="grid grid-cols-[1.4fr_1.3fr_1fr_1.1fr] gap-12 py-16 @max-[960px]:grid-cols-2 @max-[960px]:gap-8 @max-[560px]:grid-cols-1"
    >
      <div class="grid max-w-[300px] content-start justify-items-start gap-4">
        <Logo tone="inverse" :height="24" />
        <p class="m-0 text-body-sm">{{ descriptor }}</p>
        <Button v-if="props.showCta" to="/contact" inverse size="sm" data-footer-cta>{{ t('cta.discussProject') }}</Button>
      </div>

      <div data-footer-col>
        <h2 :class="columnTitle">{{ t('footer.servicesTitle') }}</h2>
        <ul :class="list">
          <li v-for="l in serviceLinks" :key="l.href">
            <NuxtLink :to="l.href" :class="link">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div data-footer-col>
        <h2 :class="columnTitle">{{ t('footer.companyTitle') }}</h2>
        <ul :class="list">
          <li v-for="l in companyLinks" :key="l.href">
            <NuxtLink :to="l.href" :class="link">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </div>

      <div data-footer-col>
        <h2 :class="columnTitle">{{ t('footer.contactTitle') }}</h2>
        <address class="grid gap-4 text-body-sm not-italic">
          <span class="grid gap-1">
            <span class="text-eyebrow text-cyan">{{ t('footer.email') }}</span>
            <a :href="`mailto:${brand.email}`" :class="link">{{ brand.email }}</a>
          </span>
          <span class="grid gap-1">
            <span class="text-eyebrow text-cyan">{{ t('footer.phone') }}</span>
            <a :href="phoneHref" :class="link">{{ brand.phone }}</a>
          </span>
          <span class="grid gap-1">
            <span class="text-eyebrow text-cyan">{{ t('footer.address') }}</span>
            <span>{{ brand.address }}</span>
          </span>
        </address>
      </div>
    </div>

    <div data-footer-bar class="border-t border-navy-line bg-navy-dark">
      <div :class="container" class="flex flex-wrap items-center justify-between gap-4 py-4">
        <p class="m-0 text-caption">{{ t('footer.companyLine', { companyId: brand.company_id, vat: brand.vat }) }}</p>
        <ul class="m-0 flex list-none flex-wrap gap-6 p-0 text-caption">
          <li v-for="l in legalLinks" :key="l.href">
            <NuxtLink :to="l.href" :class="link">{{ l.label }}</NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
