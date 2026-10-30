<script setup lang="ts">
import type { ServiceSlug } from '#content/types'
import { brand } from '#content/site'

/**
 * Home (EN `/`, TR `/tr`). Section order follows the current canvas artboard Main.dc.html
 * (CANVAS_UPDATE_NOTES §1.3): hero, team statement, business needs, services, process (navy band),
 * capability, audiences, partnership models, EU base, final CTA. Copy comes only from home.md / services.md
 * via useContent; the canvas eyebrows and drafted headings are not used.
 * Backgrounds alternate so that no two neighbouring sections share one (DESIGN_NOTES §7.5).
 */
const { t } = useI18n()
const home = useContent('home')
const services = useContent('services')

usePageSeo(home.meta)

const heroActions = computed(() => [
  { label: t('cta.discussProject'), href: '/contact' },
  { label: t('cta.exploreServices'), href: '/services' },
])

/**
 * "Your external product & procurement team.": the approved paragraph is split at its sentence boundary into
 * the You card (what partners define and retain) and the MOESA card (what MOESA coordinates). The cards hold
 * nothing else, so the two sentences still read as the one approved paragraph.
 */
const teamCards = computed(() => home.team.body.split(/(?<=\.)\s+(?=\S)/))

const serviceTitle = (slug: ServiceSlug) => services.services.find((s) => s.slug === slug)!.title
/** Each business need points to the service that covers it (NEED_SERVICES, structure only; the label is the service title). */
const needs = computed(() =>
  home.businessNeeds.items.map((text, i) => {
    const slug = NEED_SERVICES[i]!
    return { text, service: serviceTitle(slug), to: serviceHref(slug) }
  }),
)

const euRows = computed(() => [
  { label: t('footer.address'), value: brand.address },
  { label: t('company.companyId'), value: brand.company_id },
  { label: t('company.vat'), value: brand.vat },
])
</script>

<template>
  <div>
    <PageHero
      variant="display"
      :title="home.hero.title"
      :intro="home.hero.body"
      :note="home.hero.tagline"
      :actions="heroActions"
      :panel-label="brand.name"
    />

    <section class="section bg-mist" aria-labelledby="home-team">
      <div class="container-site">
        <StatementSplit>
          <template #left>
            <div class="flex flex-col gap-3">
              <h2 id="home-team" class="max-w-[20ch] text-h2 text-navy">{{ home.team.title }}</h2>
              <p class="mt-3 max-w-[68ch] text-body text-slate">{{ home.team.statement }}</p>
            </div>
          </template>
          <template #right>
            <div class="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
              <p
                v-for="(sentence, i) in teamCards"
                :key="i"
                data-team-card
                class="m-0 box-border rounded-sm border border-line bg-white p-8 text-h4 text-navy"
                :class="i === 1 && 'border-t-2 border-t-cyan'"
              >
                {{ sentence }}
              </p>
            </div>
          </template>
        </StatementSplit>
      </div>
    </section>

    <section class="section bg-white" aria-labelledby="home-needs">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="home-needs" :title="home.businessNeeds.title" />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
          <NeedCard v-for="(n, i) in needs" :key="i" :text="n.text" :service="n.service" :to="n.to" />
        </div>
      </div>
    </section>

    <section class="section bg-mist" aria-labelledby="home-services">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader
          title-id="home-services"
          :title="home.operatingModel.title"
          title-max="24ch"
          :action="{ label: t('cta.exploreServices'), href: '/services', variant: 'secondary' }"
        />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-8">
          <ServiceCard
            v-for="(s, i) in services.services"
            :key="s.slug"
            :index="s.slug === 'digital-commerce-commercial-intelligence' ? undefined : String(i + 1)"
            :capability="s.slug === 'digital-commerce-commercial-intelligence'"
            :title="s.title"
            :summary="s.summary"
            :points="s.items"
            :to="serviceHref(s.slug)"
          />
        </div>
      </div>
    </section>

    <section class="section surface-inverse bg-navy-dark" aria-labelledby="home-process">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader
          title-id="home-process"
          :title="home.process.title"
          title-max="24ch"
          inverse
          :action="{ label: t('nav.howWeWork'), href: '/how-we-work', variant: 'text' }"
        />
        <ProcessTimeline :steps="home.process.items" layout="row" inverse />
      </div>
    </section>

    <CapabilityStrip
      tone="mist"
      :title="home.capability.title"
      :body="home.capability.paragraphs[0]!"
      :items="home.capability.paragraphs.slice(1)"
    />

    <section class="section bg-white" aria-labelledby="home-audiences">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader
          title-id="home-audiences"
          :title="home.audiences.title"
          title-max="24ch"
          :action="{ label: t('nav.whoWeWorkWith'), href: '/who-we-work-with', variant: 'text' }"
        />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-6">
          <AudienceCard v-for="(a, i) in home.audiences.items" :key="i" :index="i + 1" :title="a" to="/who-we-work-with" />
        </div>
      </div>
    </section>

    <section class="section bg-mist" aria-labelledby="home-partnership">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="home-partnership" :title="home.partnership.title" />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-x-12 gap-y-0">
          <PartnershipCard v-for="(m, i) in home.partnership.items" :key="i" :index="String(i + 1)" :title="m" />
        </div>
      </div>
    </section>

    <EUBaseSection :title="home.euBase.title" :body="home.euBase.body" :rows="euRows" />

    <FinalCTA :content="home.finalCta" />
  </div>
</template>
