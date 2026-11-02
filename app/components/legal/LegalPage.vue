<script setup lang="ts">
import type { LegalContent } from '#content/en/legal'
import type { Locale, LegalSection } from '#content/types'
import { brand } from '#content/site'

/**
 * Legal page body (bundle.js `LegalPage`, bundle.css `.ms-legal*`): breadcrumbs, then the 68ch article with the
 * status note, the h1, the lead and the last-updated line, one ruled section per md section, and an optional
 * "See also" link to the sibling policy.
 *
 * - The article sits inside `.container-site`, lined up with the breadcrumbs (the DS column hugs the viewport's
 *   left edge: DESIGN_NOTES §7.5).
 * - Status: the md `**Status:**` value is the Draft chip's text, the same in every locale. It stays until the lawyer
 *   signs the final text off.
 * - Last updated (legal review S5): `updated` (ISO, from `LEGAL_UPDATED`) formatted for the page locale.
 * - OPEN items: a paragraph starting "OPEN / AÇIK - " (the md marker, the same in every locale's content and only the
 *   detection key) renders as the DS open note: Chip kind="open" with the page locale's label (`status.open`: EN "Open",
 *   TR "Açık", DE "Offen", BG "Открито", uppercased by the chip), then the rest of the text. The chip conveys the marker, so the
 *   prefix is not repeated; a visually hidden " - " separates the two for screen readers. They mark owner facts that
 *   are still missing.
 * - TR `condensed` (an approved one-line form): an intro paragraph above the translated list or the per-line values
 *   (TR Legal Notice "İletişim"). Approved text is never hidden.
 * - Items render before paragraphs, so a section can list facts and then explain them.
 * - The company email is a mailto link wherever it appears in a paragraph; the text stays verbatim.
 *
 * Slots: `section-end` (scoped by `id`) appends to a section (Cookie Policy inventory table), `after` follows the
 * article inside the same band (Cookie Policy settings panel).
 */
const props = defineProps<{ content: LegalContent; updated: string; related?: { label: string; href: string } }>()
const { t, locale } = useI18n()

/** Detection key only: never displayed (the chip shows the locale's `status.open`). */
const OPEN_PREFIX = 'OPEN / AÇIK - '

const crumbs = computed(() => [{ label: t('breadcrumbs.home'), href: '/' }, { label: props.content.hero.title, href: '' }])

/** UTC on both sides, so the server and the browser print the same day. */
const updatedLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value as Locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${props.updated}T00:00:00Z`)),
)
const relatedHref = props.related ? useLocalizedHref(props.related.href) : ''

type Part = { open: boolean; text: string; before: string; email: string; after: string }
const parts = (s: LegalSection): Part[] =>
  (s.paragraphs ?? []).map((p) => {
    const open = p.startsWith(OPEN_PREFIX)
    const text = open ? p.slice(OPEN_PREFIX.length) : p
    const at = text.indexOf(brand.email)
    return at < 0
      ? { open, text, before: text, email: '', after: '' }
      : { open, text, before: text.slice(0, at), email: brand.email, after: text.slice(at + brand.email.length) }
  })
</script>

<template>
  <section data-legal class="bg-white">
    <div class="container-site pt-8 pb-24 max-[719.98px]:pb-16">
      <div data-legal-crumbs>
        <Breadcrumbs :items="crumbs" />
      </div>

      <article data-legal-page class="grid max-w-[68ch] gap-6 pt-16 max-[719.98px]:pt-12">
        <p data-legal-status role="note" class="m-0 flex items-center gap-3 rounded-sm border border-line bg-pale px-4 py-3">
          <Chip kind="draft" :label="props.content.status" />
        </p>

        <h1 class="text-h1 text-navy">{{ props.content.hero.title }}</h1>
        <p class="m-0 text-lead text-slate">{{ props.content.hero.body }}</p>
        <i18n-t keypath="legal.lastUpdated" tag="p" scope="global" data-legal-updated class="m-0 text-body-sm text-slate">
          <template #date>
            <time :datetime="props.updated">{{ updatedLabel }}</time>
          </template>
        </i18n-t>

        <section
          v-for="s in props.content.sections"
          :key="s.id"
          :data-legal-section="s.id"
          :aria-labelledby="`legal-${s.id}`"
          class="grid gap-3 border-t border-line pt-6"
        >
          <h2 :id="`legal-${s.id}`" class="text-h4 text-navy">{{ s.title }}</h2>
          <p v-if="s.condensed" data-condensed class="m-0 text-body text-slate">{{ s.condensed }}</p>
          <TickList v-if="s.items" :items="s.items" class="text-body text-slate" />
          <template v-for="(p, i) in parts(s)" :key="i">
            <p
              v-if="p.open"
              data-open
              class="m-0 flex items-start gap-3 rounded-sm border border-dashed border-line-strong bg-mist px-4 py-3 text-body-sm text-navy max-[479.98px]:flex-col max-[479.98px]:gap-2"
            >
              <Chip kind="open" /><span class="sr-only"> - </span><span>{{ p.text }}</span>
            </p>
            <p v-else class="m-0 text-body text-slate">
              {{ p.before }}<a v-if="p.email" :href="`mailto:${p.email}`" class="font-semibold text-blue underline hover:text-blue-dark">{{ p.email }}</a>{{ p.after }}
            </p>
          </template>
          <slot name="section-end" :id="s.id" />
        </section>

        <p v-if="props.related" data-legal-related class="m-0 border-t border-line pt-6 text-body text-slate">
          {{ t('legal.seeAlso') }}
          <NuxtLink :to="relatedHref" class="font-semibold text-blue underline hover:text-blue-dark">{{ props.related.label }}</NuxtLink>
        </p>
      </article>

      <slot name="after" />
    </div>
  </section>
</template>
