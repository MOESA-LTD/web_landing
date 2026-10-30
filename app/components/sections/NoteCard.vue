<script setup lang="ts">
/**
 * Bordered text card of the canvas service pages' "How the work runs" grid ("You retain" / second card):
 * padding 32, gap 8, a title in the canvas card-label style (13/16 700 uppercase blue) and 17/28 ink text,
 * optional dot list. `accent` adds the 2px cyan top of the canvas's second card.
 * `level` is the heading level of the title: h3 under a section h2, h2 when the cards are the section.
 * `tone` is the card ground: white on a mist section (canvas), mist on a white section.
 */
const props = withDefaults(
  defineProps<{
    title: string
    body?: string
    items?: string[]
    accent?: boolean
    level?: 'h2' | 'h3'
    tone?: 'white' | 'mist'
  }>(),
  { body: undefined, items: () => [], accent: false, level: 'h3', tone: 'white' },
)
</script>

<template>
  <div
    class="box-border flex flex-col gap-2 rounded-sm border border-line p-8"
    :class="[props.tone === 'mist' ? 'bg-mist' : 'bg-white', props.accent && 'border-t-2 border-t-cyan']"
  >
    <component :is="props.level" class="text-eyebrow text-blue">{{ props.title }}</component>
    <p v-if="props.body" class="text-body text-navy">{{ props.body }}</p>
    <TickList v-if="props.items.length" :items="props.items" class="mt-2 text-body text-navy" />
  </div>
</template>
