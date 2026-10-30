<script setup lang="ts">
import type { Cta } from '#content/types'

/**
 * Page hero (bundle.js `Hero`, bundle.css `.ms-hero*`), the page's single <h1>.
 * - display: the Home cover. Two columns (text | 37% navy panel with the chevron motif), an 8px cyan
 *   left edge; the panel stacks under the text at a container width of 860px or less.
 * - page: every other page. Text only, no panel and no motif (the newer DS draws the motif only in the panel).
 * Order: crumbs, eyebrow, title, intro, actions (first primary, the rest secondary), note.
 * `panelLabel` (display only) sits at the bottom left of the navy panel (`.ms-hero-panel-label`; Home: "MOESA LTD.").
 */
const props = withDefaults(
  defineProps<{
    variant?: 'display' | 'page'
    eyebrow?: string
    title: string
    intro?: string
    note?: string
    crumbs?: Cta[]
    actions?: Cta[]
    panelLabel?: string
  }>(),
  {
    variant: 'page',
    eyebrow: undefined,
    intro: undefined,
    note: undefined,
    crumbs: undefined,
    actions: () => [],
    panelLabel: undefined,
  },
)

const display = computed(() => props.variant === 'display')
</script>

<template>
  <section class="@container relative overflow-hidden bg-white" :class="!display && 'border-b border-line'">
    <!--
      The grid sits one level inside the query container: a container query cannot restyle the container
      itself, which is why the DS's own `.ms-hero-split` never stacks. Here the panel does stack (the
      intent in CANVAS_UPDATE_NOTES §1.1).
    -->
    <div
      :class="
        display &&
        'relative grid grid-cols-[minmax(0,1fr)_37%] before:absolute before:inset-y-0 before:left-0 before:z-[1] before:w-2 before:bg-cyan @max-[860.98px]:grid-cols-1'
      "
    >
      <div
        class="relative box-border flex flex-col items-start gap-6 @max-[720.98px]:gap-4 @max-[720.98px]:pt-12 @max-[720.98px]:pr-4 @max-[720.98px]:pb-12 @max-[720.98px]:pl-6"
        :class="
          display
            ? 'm-0 max-w-[780px] pt-24 pr-12 pb-16 pl-16 @max-[860.98px]:pt-16 @max-[860.98px]:pr-6 @max-[860.98px]:pb-12 @max-[860.98px]:pl-8'
            : 'mx-auto w-full max-w-[1200px] px-6 py-16'
        "
      >
        <Breadcrumbs v-if="props.crumbs?.length" :items="props.crumbs" />
        <p v-if="props.eyebrow" class="text-eyebrow text-blue">{{ props.eyebrow }}</p>
        <h1
          :class="
            display
              ? 'text-display max-w-[20ch] @max-[720.98px]:text-[38px] @max-[720.98px]:leading-[44px]'
              : 'text-h1 max-w-[22ch] @max-[720.98px]:text-[34px] @max-[720.98px]:leading-10'
          "
        >
          {{ props.title }}
        </h1>
        <p v-if="props.intro" class="text-lead max-w-[56ch] text-slate @max-[720.98px]:text-[18px] @max-[720.98px]:leading-7">{{ props.intro }}</p>
        <div v-if="props.actions.length" class="mt-2 flex flex-wrap items-center gap-4">
          <Button v-for="(a, i) in props.actions" :key="i" :to="a.href" :variant="i === 0 ? 'primary' : 'secondary'">{{ a.label }}</Button>
        </div>
        <p
          v-if="props.note"
          class="mt-6 flex flex-col gap-4 text-[13px] leading-5 font-semibold tracking-[.06em] text-slate uppercase before:h-1 before:w-14 before:bg-cyan"
        >
          {{ props.note }}
        </p>
      </div>
      <div
        v-if="display"
        class="surface-inverse relative min-h-[520px] overflow-hidden bg-navy-dark @max-[860.98px]:min-h-[220px]"
      >
        <LineMotif variant="chevron" />
        <p v-if="props.panelLabel" data-panel-label class="absolute bottom-8 left-8 m-0 text-label tracking-[.03em] text-mist-blue">
          {{ props.panelLabel }}
        </p>
      </div>
    </div>
  </section>
</template>
