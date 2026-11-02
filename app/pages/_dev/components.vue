<script setup lang="ts">
/**
 * Dev-only component gallery: every Task 3 component with approved content (never placeholder copy).
 * Production builds drop this route (nuxt.config.ts), and the guard below makes it a 404 anyway.
 * Not prerendered, not in the sitemap, noindex.
 */
import type { Cta } from '#content/types'
import { navigation } from '#content/site'

if (!import.meta.dev) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}

useHead({ title: 'Component gallery (dev)', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { t } = useI18n()
const home = useContent('home')
const services = useContent('services')
const operations = useContent('services/operations-supply-chain')
const howWeWork = useContent('how-we-work')
const www = useContent('who-we-work-with')
const about = useContent('about')
const contact = useContent('contact')

const glyphs = ['arrow', 'chevronDown', 'chevronRight', 'menu', 'close', 'check', 'alert', 'loop', 'upload'] as const

const serviceHref = (slug: string) => `/services/${slug}`
const serviceLabel = (slug: string) => t(`nav.serviceLinks.${slug}`)

const crumbs = computed<Cta[]>(() => [
  { label: t('breadcrumbs.home'), href: '/' },
  { label: t('breadcrumbs.services'), href: '/services' },
  { label: serviceLabel(operations.slug), href: serviceHref(operations.slug) },
])

/** Home "Start with the business need": each need points to the service that covers it. */
const needSlugs = [
  'sourcing-managed-procurement',
  'product-private-label-development',
  'sourcing-managed-procurement',
  'market-access-commercial-representation',
  'digital-commerce-commercial-intelligence',
] as const
const needs = computed(() =>
  home.businessNeeds.items.map((text, i) => ({ text, service: serviceLabel(needSlugs[i]!), to: serviceHref(needSlugs[i]!) })),
)

/** "Label: value" lines of the approved Contact page, split into fact rows. */
const euRows = computed(() =>
  [contact.direct.items!.at(-1)!, ...contact.company.items].map((line) => {
    const at = line.indexOf(': ')
    return { label: line.slice(0, at), value: line.slice(at + 2) }
  }),
)

/** The two approved experience figures, cut from the Experience paragraph (EN wording; TR falls back to the title). */
const stats = computed(() => {
  const m = /(15) (.+?) and (10) (.+?),/.exec(about.experience.body)
  return m
    ? [{ value: m[1]!, label: m[2]! }, { value: m[3]!, label: m[4]! }]
    : [{ value: '15', label: about.experience.title }, { value: '10', label: about.experience.title }]
})

const guide = computed(() => www.selectionGuide.rows.map((r) => ({ term: r.need, text: r.target })))

const related = computed(() =>
  services.services
    .filter((s) => s.slug === 'sourcing-managed-procurement' || s.slug === 'market-access-commercial-representation')
    .map((s) => ({ title: s.title, summary: s.summary, to: serviceHref(s.slug) })),
)
</script>

<template>
  <div class="bg-white text-slate">
    <header class="container-site py-12">
      <p class="text-eyebrow text-blue">Dev only</p>
      <h1 class="text-h1 text-navy">Component gallery</h1>
      <p class="mt-3 text-body-sm">
        Task 3 components fed with approved content from <code>content/</code>. Not shipped in production.
      </p>
    </header>

    <!-- Brand -->
    <section class="container-site grid gap-8 border-t border-line py-12" data-gallery="brand">
      <h2 class="text-h4 text-navy">Glyph</h2>
      <div class="flex flex-wrap items-center gap-6 text-navy">
        <span v-for="g in glyphs" :key="g" class="inline-flex flex-col items-center gap-2 text-caption">
          <Glyph :name="g" />{{ g }}
        </span>
      </div>
      <h2 class="text-h4 text-navy">Logo</h2>
      <div class="flex flex-wrap items-center gap-8">
        <Logo href="/" />
        <Logo :height="40" />
        <div class="surface-inverse bg-navy-dark p-6"><Logo tone="inverse" :height="24" href="/" /></div>
      </div>
      <h2 class="text-h4 text-navy">LineMotif</h2>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
        <div class="surface-inverse relative h-72 overflow-hidden bg-navy-dark"><LineMotif variant="chevron" /></div>
        <div class="surface-inverse flex h-72 items-center bg-navy-dark p-6"><LineMotif variant="bars" class="w-full" /></div>
      </div>
    </section>

    <!-- UI -->
    <section class="container-site grid gap-8 border-t border-line py-12" data-gallery="ui">
      <h2 class="text-h4 text-navy">Button</h2>
      <div class="flex flex-wrap items-center gap-4">
        <Button :to="home.finalCta.cta.href">{{ home.finalCta.cta.label }}</Button>
        <Button variant="secondary" to="/services">{{ t('nav.allServices') }}</Button>
        <Button variant="text" to="/how-we-work">{{ t('nav.howWeWork') }}</Button>
        <Button size="sm" :to="home.finalCta.cta.href">{{ home.finalCta.cta.label }}</Button>
        <Button variant="secondary" size="sm">{{ t('cookie.acceptAll') }}</Button>
        <Button type="submit">{{ t('form.submit') }}</Button>
      </div>
      <div class="max-w-sm"><Button block :to="home.finalCta.cta.href">{{ home.finalCta.cta.label }}</Button></div>
      <div class="surface-inverse flex flex-wrap items-center gap-4 bg-navy-dark p-6">
        <Button inverse :to="home.finalCta.cta.href">{{ home.finalCta.cta.label }}</Button>
        <Button inverse variant="secondary" to="/services">{{ t('nav.allServices') }}</Button>
        <Button inverse variant="text" to="/how-we-work">{{ t('nav.howWeWork') }}</Button>
      </div>
      <h2 class="text-h4 text-navy">Breadcrumbs</h2>
      <Breadcrumbs :items="crumbs" />
      <h2 class="text-h4 text-navy">TickList</h2>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-12">
        <TickList :items="operations.typicalMandates.items!" class="text-body text-slate" />
        <TickList :items="www.audiences[0]!.items!" :columns="2" class="text-body-sm text-navy" />
      </div>
      <h2 class="text-h4 text-navy">Chip</h2>
      <div class="flex flex-wrap items-center gap-4"><Chip kind="draft" /><Chip kind="open" /></div>
    </section>

    <!-- Heroes -->
    <PageHero
      variant="display"
      :title="home.hero.title"
      :intro="home.hero.body"
      :note="home.hero.tagline"
      :actions="[home.finalCta.cta, { label: t('nav.services'), href: '/services' }]"
    />
    <PageHero :crumbs="crumbs" :title="operations.hero.title" :intro="operations.hero.body" :actions="[operations.finalCta.cta]" />

    <!-- Statement split + mandates -->
    <section class="section bg-mist">
      <div class="container-site">
        <StatementSplit>
          <template #left>
            <SectionHeader :title="home.team.title" :intro="home.team.body" title-max="20ch" />
          </template>
          <template #right>
            <MandatesPanel :title="operations.typicalMandates.title" :items="operations.typicalMandates.items!" />
          </template>
        </StatementSplit>
      </div>
    </section>

    <!-- Needs + services -->
    <section class="section bg-white">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader :title="home.businessNeeds.title" />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
          <NeedCard v-for="(n, i) in needs" :key="i" v-bind="n" />
        </div>
      </div>
    </section>
    <section class="section bg-mist">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader :title="home.operatingModel.title" title-max="24ch" :action="{ label: t('nav.allServices'), href: '/services' }" />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-8">
          <ServiceCard
            v-for="(s, i) in services.services"
            :key="s.slug"
            :index="i < 4 ? String(i + 1).padStart(2, '0') : undefined"
            :capability="i === 4"
            :title="s.title"
            :summary="s.summary"
            :points="s.items"
            :to="serviceHref(s.slug)"
          />
        </div>
      </div>
    </section>

    <!-- Navy band: process row + partnership rows -->
    <section class="section surface-inverse bg-navy-dark">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader
          inverse
          :title="home.process.title"
          title-max="24ch"
          :action="{ label: t('nav.howWeWork'), href: '/how-we-work', variant: 'text' }"
        />
        <ProcessTimeline :steps="home.process.items" inverse />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-x-12">
          <PartnershipCard v-for="(m, i) in home.partnership.items" :key="i" :index="String(i + 1)" :title="m" inverse />
        </div>
      </div>
    </section>

    <!-- Light process column + loop, flow line -->
    <section class="section bg-white">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader :title="howWeWork.operatingFlow.title" />
        <ProcessTimeline :steps="howWeWork.operatingFlow.items!" layout="column" :loop="howWeWork.nonLinear.body" />
        <ProcessTimeline :steps="home.process.items" />
        <SectionHeader :title="howWeWork.nonLinear.title" />
        <FlowLine :steps="howWeWork.nonLinear.steps!" />
      </div>
    </section>

    <CapabilityStrip
      :title="home.capability.title"
      :body="home.capability.paragraphs[0]!"
      :note="home.capability.paragraphs[1]"
      :items="services.services[4]!.items"
    />

    <!-- Audiences + partnership rows (light) -->
    <section class="section bg-white">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader :title="home.audiences.title" title-max="24ch" :action="{ label: t('nav.whoWeWorkWith'), href: '/who-we-work-with', variant: 'text' }" />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
          <AudienceCard
            v-for="(a, i) in www.audiences.slice(0, 3)"
            :key="i"
            :index="i + 1"
            :title="a.title"
            :text="a.body"
            :points="a.items"
            to="/who-we-work-with"
          />
        </div>
        <SectionHeader :title="home.partnership.title" />
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] gap-x-12">
          <PartnershipCard v-for="(m, i) in home.partnership.items" :key="i" :index="String(i + 1)" :title="m" />
        </div>
      </div>
    </section>

    <!-- About patterns -->
    <section class="section bg-mist">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader :title="about.principles.title" />
        <NumberedCards :items="about.principles.items.map((title) => ({ title }))" />
      </div>
    </section>
    <section class="section bg-white">
      <div class="container-site">
        <StatementSplit align="center">
          <template #left><SectionHeader :title="about.experience.title" :intro="about.experience.body" title-max="20ch" /></template>
          <template #right>
            <div class="flex flex-wrap gap-x-18 gap-y-12 border-l-4 border-navy bg-pale p-8">
              <Stat v-for="s in stats" :key="s.value" :value="s.value" :label="s.label" />
            </div>
          </template>
        </StatementSplit>
      </div>
    </section>

    <!-- Ruled lists -->
    <section class="section bg-white">
      <div class="container-site grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-12">
        <div class="flex flex-col gap-6">
          <SectionHeader :title="operations.manages.title" />
          <RuledList :items="operations.manages.items!" />
        </div>
        <div class="flex flex-col gap-6">
          <SectionHeader :title="www.selectionGuide.title" />
          <RuledList :items="guide" />
        </div>
      </div>
    </section>

    <section class="section bg-white">
      <div class="container-site"><RelatedServices :items="related" /></div>
    </section>

    <EUBaseSection :title="home.euBase.title" :body="home.euBase.body" :rows="euRows" />
    <FinalCTA :content="home.finalCta" />
  </div>
</template>
