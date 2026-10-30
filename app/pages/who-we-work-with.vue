<script setup lang="ts">
/**
 * Who We Work With (EN `/who-we-work-with`, TR `/tr/kimlerle-calisiyoruz`). Skeleton of the canvas artboard
 * WhoWeWorkWith.dc.html: page hero, audience cards (mist), selection guide (white), final CTA.
 * Copy comes only from who-we-work-with.md via useContent: the approved intro heads the audience grid (the canvas's
 * drafted "Three client profiles." is not used), all 5 approved audiences are shown with their text and bullets,
 * and the selection guide is the approved need → target list as a ruled list (the canvas reuses the Home need cards).
 * The two buyer sections and "Not sure yet?" have no canvas layout and use the DS patterns.
 * Backgrounds alternate from the white hero on: mist, white, mist, white, navy.
 */
const { t } = useI18n()
const page = useContent('who-we-work-with')
const enPage = useContent('who-we-work-with', 'en')

usePageSeo(page.meta)

const crumbs = [{ label: t('breadcrumbs.home'), href: '/' }, { label: t('nav.whoWeWorkWith') }]
const heroActions = [
  { label: t('cta.discussProject'), href: '/contact' },
  { label: t('cta.exploreServices'), href: '/services' },
]
const finalCta = { ...page.finalCta, cta: { label: page.finalCta.cta.label, href: enPage.finalCta.cta.href } }

/** need → target; a target that is a service links to its page (the row's `service` is structure, not copy). */
const guide = page.selectionGuide.rows.map((r) => ({ term: r.need, text: r.target, to: r.service ? serviceHref(r.service) : undefined }))
</script>

<template>
  <div>
    <PageHero :crumbs="crumbs" :title="page.hero.title" :intro="page.hero.body" :actions="heroActions" />

    <section data-audiences class="section bg-mist" aria-labelledby="www-intro">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="www-intro" :title="page.intro.title" :intro="page.intro.body" title-max="24ch" />
        <ul class="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6 p-0">
          <li v-for="(a, i) in page.audiences" :key="i" class="grid">
            <AudienceCard :index="i + 1" :title="a.title" :text="a.body" :condensed="a.condensed" :points="a.items" />
          </li>
        </ul>
      </div>
    </section>

    <section data-buyers class="section bg-white">
      <div class="container-site grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-6">
        <NoteCard variant="heading" level="h2" tone="mist" :title="page.seekingBrands.title" :body="page.seekingBrands.body" />
        <NoteCard
          variant="heading"
          level="h2"
          tone="mist"
          accent
          :title="page.noInternalProcurement.title"
          :body="page.noInternalProcurement.body"
        />
      </div>
    </section>

    <section data-guide class="section bg-mist" aria-labelledby="www-guide">
      <div class="container-site flex flex-col gap-12">
        <SectionHeader title-id="www-guide" :title="page.selectionGuide.title" />
        <RuledList :items="guide" />
      </div>
    </section>

    <section data-not-sure class="section bg-white" aria-labelledby="www-not-sure">
      <div class="container-site">
        <SectionHeader title-id="www-not-sure" :title="page.notSure.title" :intro="page.notSure.body" />
      </div>
    </section>

    <FinalCTA :content="finalCta" />
  </div>
</template>
