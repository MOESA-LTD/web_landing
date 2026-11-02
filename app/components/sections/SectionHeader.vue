<script setup lang="ts">
import type { Cta } from '#content/types'

/**
 * Section header block of the canvas artboards: eyebrow, h2 and an optional intro, with an optional action
 * (secondary or text button, default secondary) aligned to the bottom right ("header row with action").
 * On a navy band pass `inverse` (cyan eyebrow, white title, mist intro, inverse button).
 * `titleMax` caps the h2 width (e.g. "24ch"); `titleId` lets the section use aria-labelledby.
 * `condensed` is the approved TR running sentence of the section's list (`Section.condensed`), shown below the intro.
 */
const props = withDefaults(
  defineProps<{
    eyebrow?: string
    title: string
    intro?: string
    action?: Cta & { variant?: 'secondary' | 'text' }
    titleMax?: string
    titleId?: string
    inverse?: boolean
    condensed?: string
  }>(),
  {
    eyebrow: undefined,
    intro: undefined,
    action: undefined,
    titleMax: undefined,
    titleId: undefined,
    inverse: false,
    condensed: undefined,
  },
)
</script>

<template>
  <div class="flex flex-wrap items-end justify-between gap-6">
    <div class="flex flex-col gap-3">
      <p v-if="props.eyebrow" class="text-eyebrow" :class="props.inverse ? 'text-cyan' : 'text-blue'">{{ props.eyebrow }}</p>
      <h2 :id="props.titleId" class="text-h2" :class="props.inverse ? 'text-white' : 'text-navy'" :style="props.titleMax ? { maxWidth: props.titleMax } : undefined">
        {{ props.title }}
      </h2>
      <p v-if="props.intro" class="mt-3 max-w-[68ch] text-body" :class="props.inverse ? 'text-mist-blue' : 'text-slate'">{{ props.intro }}</p>
      <p v-if="props.condensed" data-condensed class="mt-3 max-w-[68ch] text-body" :class="props.inverse ? 'text-mist-blue' : 'text-slate'">
        {{ props.condensed }}
      </p>
    </div>
    <Button v-if="props.action" :to="props.action.href" :variant="props.action.variant ?? 'secondary'" :inverse="props.inverse">
      {{ props.action.label }}
    </Button>
  </div>
</template>
