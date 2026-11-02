<script setup lang="ts">
import type { Locale, Section, ServiceSlug, TextSection } from '#content/types'
import { localeOfPath, localeSlugForService, serviceSlugFromLocaleSlug } from '~~/i18n/routes'

/**
 * Service page (EN `/services/[slug]`, TR `/tr/hizmetler/[slug]`, DE `/de/leistungen/[slug]`, with the Turkish or
 * German slug from ROUTES).
 * Skeleton of the canvas artboards Service*.dc.html: page hero (crumbs Home / Services / name, the service CTA),
 * Scope (statement split + Typical mandates panel), "How the work runs", related services, final CTA.
 * The approved md sections the canvas has no layout for are built from the DS patterns between Scope and
 * "How the work runs": "What MOESA manages" (ruled list), models (numbered cards), audiences, the boundary
 * texts (note cards, like the canvas's "You retain" cards). Operations shows its own operating flow and Digital
 * its intelligence framework instead of the generic 5 steps. Copy comes only from the content modules.
 * Backgrounds alternate from the hero on (white, mist, white, ...), so no two neighbouring sections share one.
 */
definePageMeta({
  validate: (route) => {
    return serviceSlugFromLocaleSlug(localeOfPath(route.path), String(route.params.slug ?? '')) !== null
  },
})

const { t } = useI18n()
const route = useRoute()
const locale = useNuxtApp().$i18n.locale.value as Locale

const found = serviceSlugFromLocaleSlug(locale, String(route.params.slug ?? ''))
if (!found) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
const slug: ServiceSlug = found

const page = useContent(`services/${slug}`)
const services = useContent('services')
/** CTA hrefs come from the EN module (`/contact?service=<slug>`); components localise them. */
const enPage = useContent(`services/${slug}`, 'en')

usePageSeo(page.meta)

const setI18nParams = useSetI18nParams()
setI18nParams({
  en: { slug: localeSlugForService('en', slug) },
  tr: { slug: localeSlugForService('tr', slug) },
  de: { slug: localeSlugForService('de', slug) },
})

const DIGITAL: ServiceSlug = 'digital-commerce-commercial-intelligence'
const isDigital = slug === DIGITAL

const summaryOf = (s: ServiceSlug) => services.services.find((x) => x.slug === s)!
const serviceCta = { label: page.finalCta.cta.label, href: enPage.finalCta.cta.href }
const finalCta = { ...page.finalCta, cta: serviceCta }

const crumbs = [
  { label: t('breadcrumbs.home'), href: '/' },
  { label: t('breadcrumbs.services'), href: '/services' },
  { label: summaryOf(slug).title },
]

const related = RELATED_SERVICES[slug].map((s) => ({ title: summaryOf(s).title, summary: summaryOf(s).summary, to: serviceHref(s) }))

/** "How the work runs" (canvas `c.objectiveExecution` + `c.steps5`): the approved home.md process section. */
const process = useContent('home').process

type Note = { section: TextSection & Partial<Section>; accent?: boolean }
type Block =
  | { kind: 'scope' }
  | { kind: 'manages' }
  | { kind: 'models' }
  | { kind: 'audiences'; section: Section }
  | { kind: 'architecture' }
  | { kind: 'flow' }
  | { kind: 'visibility' }
  | { kind: 'framework' }
  | { kind: 'run'; notes: Note[] }
  | { kind: 'notes'; notes: Note[] }
  | { kind: 'related' }

const note = (section: Section | undefined, accent = false): Note[] =>
  section ? [{ section: section as TextSection & Partial<Section>, accent }] : []

/** Sections in page order (related services sits on white as in the canvas, except on Digital, which has one block fewer). */
const BLOCKS: Record<ServiceSlug, Block[]> = {
  'sourcing-managed-procurement': [
    { kind: 'scope' },
    { kind: 'manages' },
    { kind: 'models' },
    { kind: 'audiences', section: page.suitableFor! },
    { kind: 'run', notes: [...note(page.responsibilities), ...note(page.managedModel, true)] },
    { kind: 'related' },
  ],
  'product-private-label-development': [
    { kind: 'scope' },
    { kind: 'manages' },
    { kind: 'architecture' },
    { kind: 'models' },
    { kind: 'run', notes: [...note(page.responsibilities), ...note(page.openFacts, true)] },
    { kind: 'related' },
  ],
  'market-access-commercial-representation': [
    { kind: 'scope' },
    { kind: 'audiences', section: page.twoSides! },
    { kind: 'manages' },
    { kind: 'models' },
    { kind: 'run', notes: [...note(page.responsibilities), ...note(page.europeanBase, true)] },
    { kind: 'related' },
  ],
  'operations-supply-chain': [
    { kind: 'scope' },
    { kind: 'manages' },
    { kind: 'flow' },
    { kind: 'visibility' },
    { kind: 'notes', notes: [...note(page.exceptions), ...note(page.legalBoundary, true)] },
    { kind: 'related' },
  ],
  'digital-commerce-commercial-intelligence': [
    { kind: 'scope' },
    { kind: 'manages' },
    { kind: 'framework' },
    { kind: 'notes', notes: [...note(page.productTruth), ...note(page.managedModel), ...note(page.technology, true)] },
    { kind: 'related' },
  ],
}

const blocks = BLOCKS[slug].map((block, i) => ({ ...block, mist: i % 2 === 0, id: `${block.kind}-${i}` }))
</script>

<template>
  <div>
    <PageHero
      :crumbs="crumbs"
      :eyebrow="isDigital ? t('cards.capability') : undefined"
      :title="page.hero.title"
      :intro="page.hero.body"
      :actions="[serviceCta]"
    />

    <template v-for="block in blocks" :key="block.id">
      <section
        v-if="block.kind === 'scope'"
        class="section"
        :class="block.mist ? 'bg-mist' : 'bg-white'"
        :aria-labelledby="block.id"
      >
        <div class="container-site">
          <StatementSplit>
            <template #left>
              <div class="flex flex-col gap-3">
                <h2 :id="block.id" class="text-h2 text-navy">{{ page.intro.title }}</h2>
                <p class="mt-3 max-w-[60ch] text-body text-slate">{{ page.intro.body }}</p>
                <div v-if="isDigital && page.broader" data-broader class="mt-3 flex max-w-[60ch] flex-col gap-2 border-t border-line pt-4">
                  <h3 class="text-h4 text-navy">{{ page.broader.title }}</h3>
                  <p class="text-body-sm text-navy">{{ page.broader.body }}</p>
                </div>
              </div>
            </template>
            <template #right>
              <MandatesPanel
                data-mandates
                :title="page.typicalMandates.title"
                :items="page.typicalMandates.items ?? []"
                :condensed="page.typicalMandates.condensed"
                :tone="isDigital ? 'pale' : block.mist ? 'white' : 'mist'"
              />
            </template>
          </StatementSplit>
        </div>
      </section>

      <section
        v-else-if="block.kind === 'manages' || block.kind === 'visibility'"
        :data-manages="block.kind === 'manages' ? '' : undefined"
        :data-visibility="block.kind === 'visibility' ? '' : undefined"
        class="section"
        :class="block.mist ? 'bg-mist' : 'bg-white'"
        :aria-labelledby="block.id"
      >
        <div class="container-site">
          <StatementSplit>
            <template #left>
              <SectionHeader
                :title-id="block.id"
                :title="(block.kind === 'manages' ? page.manages : page.visibility!).title"
                :intro="(block.kind === 'manages' ? page.manages : page.visibility!).body"
                :condensed="(block.kind === 'manages' ? page.manages : page.visibility!).condensed"
                title-max="20ch"
              />
            </template>
            <template #right>
              <RuledList :items="(block.kind === 'manages' ? page.manages : page.visibility!).items ?? []" />
            </template>
          </StatementSplit>
        </div>
      </section>

      <section
        v-else-if="block.kind === 'models' && page.models"
        data-models
        class="section"
        :class="block.mist ? 'bg-mist' : 'bg-white'"
        :aria-labelledby="block.id"
      >
        <div class="container-site flex flex-col gap-12">
          <SectionHeader :title-id="block.id" :title="page.models.title" :intro="page.models.body" :condensed="page.models.condensed" />
          <NumberedCards :items="(page.models.items ?? []).map((title) => ({ title }))" :min="250" />
        </div>
      </section>

      <section
        v-else-if="block.kind === 'audiences'"
        data-audiences
        class="section"
        :class="block.mist ? 'bg-mist' : 'bg-white'"
        :aria-labelledby="block.id"
      >
        <div class="container-site flex flex-col gap-12">
          <SectionHeader :title-id="block.id" :title="block.section.title" :intro="block.section.body" :condensed="block.section.condensed" />
          <ul class="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-6 p-0">
            <li v-for="(a, i) in block.section.items ?? []" :key="i" class="grid">
              <AudienceCard :index="i + 1" :title="a" />
            </li>
          </ul>
        </div>
      </section>

      <section
        v-else-if="block.kind === 'architecture' && page.architecture"
        data-architecture
        class="section"
        :class="block.mist ? 'bg-mist' : 'bg-white'"
        :aria-labelledby="block.id"
      >
        <div class="container-site">
          <StatementSplit>
            <template #left>
              <div class="flex flex-col gap-6">
                <SectionHeader
                  :title-id="block.id"
                  :title="page.architecture.title"
                  :intro="page.architecture.body"
                  :condensed="page.architecture.condensed"
                  title-max="20ch"
                />
                <FlowLine v-if="page.architecture.steps?.length" :steps="page.architecture.steps" />
              </div>
            </template>
            <template #right>
              <RuledList :items="page.architecture.items ?? []" />
            </template>
          </StatementSplit>
        </div>
      </section>

      <section
        v-else-if="block.kind === 'flow' && page.flow"
        data-flow
        class="section"
        :class="block.mist ? 'bg-mist' : 'bg-white'"
        :aria-labelledby="block.id"
      >
        <div class="container-site">
          <StatementSplit>
            <template #left>
              <SectionHeader :title-id="block.id" :title="page.flow.title" :intro="page.flow.body" title-max="20ch" />
            </template>
            <template #right>
              <ProcessTimeline :steps="page.flow.steps ?? []" layout="column" />
            </template>
          </StatementSplit>
        </div>
      </section>

      <section
        v-else-if="block.kind === 'framework' && page.framework"
        data-framework
        class="section"
        :class="block.mist ? 'bg-mist' : 'bg-white'"
        :aria-labelledby="block.id"
      >
        <div class="container-site flex flex-col gap-12">
          <SectionHeader :title-id="block.id" :title="page.framework.title" :intro="page.framework.body" :condensed="page.framework.condensed" />
          <ProcessTimeline :steps="page.framework.steps ?? []" layout="row" />
          <!-- Three columns of the 200px minimum under the five steps, instead of five uneven ones across. -->
          <TickList :items="page.framework.items ?? []" :columns="2" class="max-w-[760px] text-body text-navy" />
        </div>
      </section>

      <section
        v-else-if="block.kind === 'run'"
        data-run
        class="section"
        :class="block.mist ? 'bg-mist' : 'bg-white'"
        :aria-labelledby="block.id"
      >
        <div class="container-site flex flex-col gap-12">
          <SectionHeader :title-id="block.id" :title="process.title" title-max="24ch" />
          <ProcessTimeline :steps="process.items" layout="row" />
          <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
            <NoteCard
              v-for="(n, i) in block.notes"
              :key="i"
              :title="n.section.title"
              :body="n.section.body"
              :items="n.section.items"
              :accent="n.accent"
              :tone="block.mist ? 'white' : 'mist'"
            />
          </div>
        </div>
      </section>

      <section v-else-if="block.kind === 'notes'" data-notes class="section" :class="block.mist ? 'bg-mist' : 'bg-white'">
        <div class="container-site grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
          <NoteCard
            v-for="(n, i) in block.notes"
            :key="i"
            level="h2"
            :title="n.section.title"
            :body="n.section.body"
            :items="n.section.items"
            :accent="n.accent"
            :tone="block.mist ? 'white' : 'mist'"
          />
        </div>
      </section>

      <section v-else-if="block.kind === 'related'" data-related class="section" :class="block.mist ? 'bg-mist' : 'bg-white'">
        <div class="container-site">
          <RelatedServices :items="related" />
        </div>
      </section>
    </template>

    <FinalCTA :content="finalCta" />
  </div>
</template>
