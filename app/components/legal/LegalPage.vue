<script setup lang="ts">
import type { LegalContent } from '#content/en/legal'
import type { LegalSection } from '#content/types'
import { brand } from '#content/site'

/**
 * Legal page body (bundle.js `LegalPage`, bundle.css `.ms-legal*`): breadcrumbs, then the 68ch article with the
 * status note, the h1 and lead, and one ruled section per md section.
 *
 * - The article sits inside `.container-site`, lined up with the breadcrumbs (the DS column hugs the viewport's
 *   left edge: DESIGN_NOTES §7.5).
 * - Status: the md `**Status:**` value is the Draft chip's text, the same in both locales.
 * - OPEN items: a paragraph starting "OPEN / AÇIK - " renders as the DS open note: Chip kind="open" carrying the md's
 *   own marker "OPEN / AÇIK", then the rest of the md text. A visually hidden " - " keeps the md sentence whole for
 *   screen readers and copy. Nothing replaces an open item.
 * - TR "Açık alanlar" (`openFields`, approved TR) is shown once, as the open-items summary under the status, and is
 *   not repeated as a section. The translated sections below keep their own OPEN notes: the summary names the
 *   topics, the sections give the item text, so nothing is shown twice.
 * - TR `condensed` (approved one-line form): above a translated list as an intro paragraph. On paragraph sections
 *   (TR Legal Notice "Şirket" / "İletişim") the paragraphs are the same values line by line, so the line itself is
 *   not repeated (see the fidelity exclusions).
 * - The company email is a mailto link wherever it appears; the text stays verbatim.
 *
 * Slots: `section-end` (scoped by `id`) appends to a section (Cookie Policy inventory row), `after` follows the
 * article inside the same band (Cookie Policy settings panel).
 */
const props = defineProps<{ content: LegalContent }>()
const { t } = useI18n()

const OPEN_MARKER = 'OPEN / AÇIK'
const OPEN_PREFIX = `${OPEN_MARKER} - `

const openFields = computed(() => props.content.sections.find((s) => s.id === 'openFields'))
const sections = computed(() => props.content.sections.filter((s) => s.id !== 'openFields'))

const crumbs = computed(() => [{ label: t('breadcrumbs.home'), href: '/' }, { label: props.content.hero.title, href: '' }])

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

        <section
          v-if="openFields"
          data-open-fields
          :aria-labelledby="`legal-${openFields.id}`"
          class="grid gap-2 rounded-sm border border-dashed border-line-strong bg-mist px-4 py-3"
        >
          <div class="flex flex-wrap items-center gap-3">
            <Chip kind="open" :label="OPEN_MARKER" aria-hidden="true" />
            <h2 :id="`legal-${openFields.id}`" class="text-h4 text-navy">{{ openFields.title }}</h2>
          </div>
          <p v-for="(p, i) in openFields.paragraphs ?? []" :key="i" class="m-0 text-body-sm text-navy">{{ p }}</p>
        </section>

        <section
          v-for="s in sections"
          :key="s.id"
          :data-legal-section="s.id"
          :aria-labelledby="`legal-${s.id}`"
          class="grid gap-3 border-t border-line pt-6"
        >
          <h2 :id="`legal-${s.id}`" class="text-h4 text-navy">{{ s.title }}</h2>
          <p v-if="s.condensed && s.items" data-condensed class="m-0 text-body text-slate">{{ s.condensed }}</p>
          <TickList v-if="s.items" :items="s.items" class="text-body text-slate" />
          <template v-for="(p, i) in parts(s)" :key="i">
            <p
              v-if="p.open"
              data-open
              class="m-0 flex items-start gap-3 rounded-sm border border-dashed border-line-strong bg-mist px-4 py-3 text-body-sm text-navy max-[479.98px]:flex-col max-[479.98px]:gap-2"
            >
              <Chip kind="open" :label="OPEN_MARKER" /><span class="sr-only"> - </span><span>{{ p.text }}</span>
            </p>
            <p v-else class="m-0 text-body text-slate">
              {{ p.before }}<a v-if="p.email" :href="`mailto:${p.email}`" class="font-semibold text-blue underline hover:text-blue-dark">{{ p.email }}</a>{{ p.after }}
            </p>
          </template>
          <slot name="section-end" :id="s.id" />
        </section>
      </article>

      <slot name="after" />
    </div>
  </section>
</template>
