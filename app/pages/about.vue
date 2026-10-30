<script setup lang="ts">
import { brand } from '#content/site'

/**
 * About (EN `/about`, TR `/tr/hakkimizda`). Skeleton of the canvas artboard About.dc.html: page hero with note,
 * position split, principles, Experience (stat panel), EU base, final CTA; the layout adds the footer CTA.
 * Copy comes only from about.md via useContent. The hero note is the approved home.md EU line, as in the canvas
 * (`c.euTitle`). The canvas's drafted position heading, its three invented principles and its Home EU/CTA texts are
 * replaced by the approved sections: "Who we are" + "What we manage", "Why MOESA", the 6 operating principles,
 * Experience, "European base, international scope", "What MOESA is not", "Our direction", the About final CTA.
 * Backgrounds alternate from the white hero on: mist, white, mist, white, mist, white, mist, navy.
 */
const { t } = useI18n()
const page = useContent('about')
const enPage = useContent('about', 'en')
const home = useContent('home')

usePageSeo(page.meta)

const crumbs = [{ label: t('breadcrumbs.home'), href: '/' }, { label: t('nav.about') }]
const heroActions = [
  { label: t('cta.discussProject'), href: '/contact' },
  { label: t('nav.howWeWork'), href: '/how-we-work' },
]
const finalCta = { ...page.finalCta, cta: { label: page.finalCta.cta.label, href: enPage.finalCta.cta.href } }

/** The two figures of the approved Experience sentence ("15 years in digital commerce and 10 years in ..."). */
const stats = [
  { value: '15', label: t('stats.digitalCommerce') },
  { value: '10', label: t('stats.ecommerceOperations') },
]

const euRows = [
  { label: t('footer.address'), value: brand.address },
  { label: t('company.companyId'), value: brand.company_id },
  { label: t('company.vat'), value: brand.vat },
]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :title="page.hero.title" :intro="page.hero.body" :note="home.euBase.title" :actions="heroActions" />

    <!-- Canvas "position": heading and lead on the left, what MOESA manages on the right. -->
    <section data-position class="section bg-mist" aria-labelledby="about-who">
      <div class="container-site">
        <StatementSplit>
          <template #left>
            <div class="flex flex-col gap-3">
              <h2 id="about-who" class="max-w-[20ch] text-h2 text-navy">{{ page.whoWeAre.title }}</h2>
              <p class="mt-3 max-w-[56ch] text-lead text-navy">{{ page.whoWeAre.body }}</p>
            </div>
          </template>
          <template #right>
            <MandatesPanel data-manages :title="page.manages.title" :items="page.manages.items" tone="white" />
          </template>
        </StatementSplit>
      </div>
    </section>

    <section data-why class="section bg-white" aria-labelledby="about-why">
      <div class="container-site">
        <StatementSplit>
          <template #left>
            <SectionHeader title-id="about-why" :title="page.why.title" :intro="page.why.body" :condensed="page.why.condensed" title-max="20ch" />
          </template>
          <template #right>
            <TickList :items="page.why.items ?? []" class="gap-4 text-body text-navy" />
          </template>
        </StatementSplit>
      </div>
    </section>

    <section data-principles class="section bg-mist" aria-labelledby="about-principles">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="about-principles" :title="page.principles.title" />
        <NumberedCards :items="page.principles.items.map((title) => ({ title }))" />
      </div>
    </section>

    <!-- Canvas "Experience": statement grid centred, tinted stat panel with the 4px navy left rule. -->
    <section data-experience class="section bg-white" aria-labelledby="about-experience">
      <div class="container-site">
        <StatementSplit align="center">
          <template #left>
            <SectionHeader title-id="about-experience" :title="page.experience.title" :intro="page.experience.body" title-max="20ch" />
          </template>
          <template #right>
            <div data-stats class="flex flex-wrap gap-x-18 gap-y-12 border-l-4 border-navy bg-pale p-8">
              <!-- Capped so the two figures sit side by side as in the canvas (the approved labels are longer). -->
              <Stat v-for="s in stats" :key="s.value" class="max-w-[200px]" :value="s.value" :label="s.label" />
            </div>
          </template>
        </StatementSplit>
      </div>
    </section>

    <EUBaseSection tone="mist" :title="page.europeanBase.title" :body="page.europeanBase.body" :rows="euRows" />

    <section data-is-not class="section bg-white" aria-labelledby="about-is-not">
      <div class="container-site">
        <StatementSplit>
          <template #left>
            <SectionHeader title-id="about-is-not" :title="page.isNot.title" :intro="page.isNot.body" :condensed="page.isNot.condensed" title-max="20ch" />
          </template>
          <template #right>
            <TickList :items="page.isNot.items ?? []" class="gap-4 text-body text-navy" />
          </template>
        </StatementSplit>
      </div>
    </section>

    <section data-direction class="section bg-mist" aria-labelledby="about-direction">
      <div class="container-site">
        <SectionHeader title-id="about-direction" :title="page.direction.title" :intro="page.direction.body" />
      </div>
    </section>

    <FinalCTA :content="finalCta" />
  </div>
</template>
