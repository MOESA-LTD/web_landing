<script setup lang="ts">
/**
 * Bordered text card of the canvas service pages' "How the work runs" grid ("You retain" / second card):
 * padding 32, gap 8, a title in the canvas card-label style (13/16 700 uppercase blue) and 17/28 ink text,
 * optional dot list. `accent` adds the 2px cyan top of the canvas's second card.
 * `level` is the heading level of the title: h3 under a section h2, h2 when the cards are the section.
 * `tone` is the card ground: white on a mist section (canvas), mist on a white section, pale for the canvas's
 * tinted card (How We Work rights grid, third card).
 * `variant="heading"` sets the title in the canvas rights-card heading style (22/30 700 navy) with slate body text,
 * for cards whose title is the section heading; the default `label` keeps the card-label style.
 */
const props = withDefaults(
  defineProps<{
    title: string
    body?: string
    items?: string[]
    accent?: boolean
    level?: 'h2' | 'h3'
    tone?: 'white' | 'mist' | 'pale'
    variant?: 'label' | 'heading'
  }>(),
  { body: undefined, items: () => [], accent: false, level: 'h3', tone: 'white', variant: 'label' },
)
const TONE = { white: 'bg-white', mist: 'bg-mist', pale: 'bg-pale' } as const
const heading = computed(() => props.variant === 'heading')
</script>

<template>
  <div
    class="box-border flex flex-col rounded-sm border border-line p-8"
    :class="[TONE[props.tone], heading ? 'gap-3' : 'gap-2', props.accent && 'border-t-2 border-t-cyan']"
  >
    <component :is="props.level" :class="heading ? 'text-h3 text-navy' : 'text-eyebrow text-blue'">{{ props.title }}</component>
    <p v-if="props.body" class="text-body" :class="heading ? 'text-slate' : 'text-navy'">{{ props.body }}</p>
    <TickList v-if="props.items.length" :items="props.items" class="mt-2 text-body text-navy" />
  </div>
</template>
