<script setup lang="ts">
import type { ServiceSlug } from '#content/types'

/**
 * Services overview (EN `/services`, TR `/tr/hizmetler`). Layout follows the canvas artboard Services.dc.html:
 * page hero with crumbs, the core-services grid (4 + 1), business needs, capability strip, final CTA.
 * Copy: services.md (hero, the five services, "One service or an integrated mandate.", final CTA). The
 * canvas's drafted grid heading and intro are replaced by the approved "One service or an integrated mandate."
 * section; the needs and the capability strip use the approved home.md sections (as on Home).
 * Backgrounds alternate: hero white, services mist, needs white, capability mist, final CTA navy.
 */
const { t } = useI18n()
const services = useContent('services')
const home = useContent('home')

usePageSeo(services.meta)

const crumbs = computed(() => [
  { label: t('breadcrumbs.home'), href: '/' },
  { label: t('breadcrumbs.services'), href: '/services' },
])

const heroActions = computed(() => [
  { label: t('cta.discussProject'), href: '/contact' },
  { label: t('nav.howWeWork'), href: '/how-we-work' },
])

const CAPABILITY: ServiceSlug = 'digital-commerce-commercial-intelligence'

const serviceTitle = (slug: ServiceSlug) => services.services.find((s) => s.slug === slug)!.title
const needs = computed(() =>
  home.businessNeeds.items.map((text, i) => {
    const slug = NEED_SERVICES[i]!
    return { text, service: serviceTitle(slug), to: serviceHref(slug) }
  }),
)
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :title="services.hero.title" :intro="services.hero.body" :actions="heroActions" />

    <section class="section bg-mist" aria-labelledby="services-core">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="services-core" :title="services.integrated.title" :intro="services.integrated.body" title-max="24ch" />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-8">
          <ServiceCard
            v-for="(s, i) in services.services"
            :key="s.slug"
            :index="s.slug === CAPABILITY ? undefined : String(i + 1)"
            :capability="s.slug === CAPABILITY"
            :title="s.title"
            :summary="s.summary"
            :points="s.items"
            :to="serviceHref(s.slug)"
          />
        </div>
      </div>
    </section>

    <section class="section bg-white" aria-labelledby="services-needs">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="services-needs" :title="home.businessNeeds.title" />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
          <NeedCard v-for="(n, i) in needs" :key="i" :text="n.text" :service="n.service" :to="n.to" />
        </div>
      </div>
    </section>

    <CapabilityStrip
      tone="mist"
      :title="home.capability.title"
      :body="home.capability.paragraphs[0]!"
      :items="home.capability.paragraphs.slice(1)"
    />

    <FinalCTA :content="services.finalCta" />
  </div>
</template>
