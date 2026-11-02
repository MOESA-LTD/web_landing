<script setup lang="ts">
/**
 * How We Work (EN `/how-we-work`, TR `/tr/nasil-calisiyoruz`). Skeleton of the canvas artboard HowWeWork.dc.html:
 * page hero, operating-flow split (text | column timeline), the three-card grid, partnership models on a navy band,
 * the tinted "open question" section, final CTA. Copy comes only from how-we-work.md via useContent: the canvas's
 * drafted headings ("Seven steps, one accountable team.", "Clear decision rights.", "An open question is not a
 * finished fact.") and its You / MOESA / Compliance cards are not used. The approved sections the canvas lacks
 * (start at any point, project visibility, engagement levels, built to evolve) use the DS patterns.
 * Backgrounds alternate from the white hero on: mist, white, mist, white, navy, white, pale, white, navy.
 */
const { t } = useI18n()
const page = useContent('how-we-work')
/** CTA hrefs come from the EN module; components localise them. */
const enPage = useContent('how-we-work', 'en')

usePageSeo(page.meta)

const crumbs = [{ label: t('breadcrumbs.home'), href: '/' }, { label: t('nav.howWeWork') }]
const heroActions = [{ label: t('cta.discussProject'), href: '/contact' }]
const finalCta = { ...page.finalCta, cta: { label: page.finalCta.cta.label, href: enPage.finalCta.cta.href } }

/** The canvas's three-card grid (white, white with the cyan top, tinted) holds three approved text sections. */
const cards = [
  { section: page.governance, tone: 'white' as const, accent: false },
  { section: page.productTruth, tone: 'white' as const, accent: true },
  { section: page.responsibility, tone: 'pale' as const, accent: false },
]
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :title="page.hero.title" :intro="page.hero.body" :actions="heroActions" />

    <!-- Canvas "flow": statement on the left, the 7-step column timeline on the right. -->
    <section class="section bg-mist" aria-labelledby="hww-intro">
      <div class="container-site">
        <StatementSplit>
          <template #left>
            <div class="flex flex-col gap-3">
              <h2 id="hww-intro" class="max-w-[20ch] text-h2 text-navy">{{ page.intro.title }}</h2>
              <p class="mt-3 max-w-[52ch] text-body text-slate">{{ page.intro.body }}</p>
              <div data-non-linear class="mt-9 flex flex-col gap-4 border-t border-line pt-6">
                <h3 class="text-h4 text-navy">{{ page.nonLinear.title }}</h3>
                <FlowLine :steps="page.nonLinear.steps ?? []" />
                <p data-loop class="inline-flex items-center gap-2 self-start rounded-sm bg-pale px-4 py-3 text-body-sm font-semibold text-navy">
                  <Glyph name="loop" :size="20" class="flex-none text-blue" />
                  <span>{{ page.nonLinear.body }}</span>
                </p>
              </div>
            </div>
          </template>
          <template #right>
            <div data-operating-flow class="flex flex-col gap-6">
              <h3 class="text-h4 text-navy">{{ page.operatingFlow.title }}</h3>
              <FlowLine v-if="page.operatingFlow.steps?.length" data-flow-line :steps="page.operatingFlow.steps" />
              <ProcessTimeline :steps="page.operatingFlow.items ?? []" layout="column" />
            </div>
          </template>
        </StatementSplit>
      </div>
    </section>

    <section data-start-anywhere class="section bg-white" aria-labelledby="hww-start">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="hww-start" :title="page.startAnywhere.title" :intro="page.startAnywhere.body" :condensed="page.startAnywhere.condensed" />
        <ul class="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-6 p-0">
          <li v-for="(item, i) in page.startAnywhere.items ?? []" :key="i" class="grid">
            <AudienceCard :index="i + 1" :title="item" />
          </li>
        </ul>
      </div>
    </section>

    <!-- Canvas "rights": three cards, the approved sections as their headings. -->
    <section data-cards class="section bg-mist">
      <div class="container-site grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
        <NoteCard
          v-for="(c, i) in cards"
          :key="i"
          variant="heading"
          level="h2"
          :title="c.section.title"
          :body="c.section.body"
          :tone="c.tone"
          :accent="c.accent"
        />
      </div>
    </section>

    <section data-visibility class="section bg-white" aria-labelledby="hww-visibility">
      <div class="container-site">
        <StatementSplit>
          <template #left>
            <SectionHeader title-id="hww-visibility" :title="page.visibility.title" title-max="20ch" />
          </template>
          <template #right>
            <RuledList :items="page.visibility.items" />
          </template>
        </StatementSplit>
      </div>
    </section>

    <section data-partnership class="section surface-inverse bg-navy-dark" aria-labelledby="hww-partnership">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader
          title-id="hww-partnership"
          :title="page.partnershipModels.title"
          :intro="page.partnershipModels.body"
          :condensed="page.partnershipModels.condensed"
          inverse
        />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-x-12 gap-y-0">
          <PartnershipCard v-for="(m, i) in page.partnershipModels.items ?? []" :key="i" :index="String(i + 1)" :title="m" inverse />
        </div>
      </div>
    </section>

    <section data-engagement class="section bg-white" aria-labelledby="hww-engagement">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="hww-engagement" :title="page.engagementLevels.title" />
        <NumberedCards :items="page.engagementLevels.items.map((title) => ({ title }))" />
      </div>
    </section>

    <!-- Canvas "open": tinted single column, h2 + lead. -->
    <section data-open class="section bg-pale" aria-labelledby="hww-open">
      <div class="container-site flex flex-col gap-3">
        <h2 id="hww-open" class="text-h2 text-navy">{{ page.openQuestions.title }}</h2>
        <p class="mt-3 max-w-[56ch] text-lead text-slate">{{ page.openQuestions.body }}</p>
      </div>
    </section>

    <section data-evolve class="section bg-white" aria-labelledby="hww-evolve">
      <div class="container-site">
        <SectionHeader title-id="hww-evolve" :title="page.evolve.title" :intro="page.evolve.body" />
      </div>
    </section>

    <FinalCTA :content="finalCta" />
  </div>
</template>
