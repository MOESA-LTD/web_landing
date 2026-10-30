<script setup lang="ts">
/**
 * "Typical mandates" panel of the service pages (canvas Service*.dc.html): a quiet bordered panel with an h3
 * and a list with 6px cyan round dots (CANVAS_UPDATE_NOTES §1.2). Tones: `mist` (canvas, on a white section),
 * `white` (the same panel on a mist section), `pale` (the tinted Digital variant).
 * `condensed` is the approved TR running sentence of the list (`Section.condensed`), shown above the list.
 */
const props = withDefaults(
  defineProps<{ title: string; items: string[]; tone?: 'mist' | 'white' | 'pale'; condensed?: string }>(),
  { tone: 'mist', condensed: undefined },
)
const TONE = { mist: 'bg-mist', white: 'bg-white', pale: 'bg-pale' } as const
</script>

<template>
  <div class="flex flex-col gap-4 rounded-sm border border-line p-8" :class="TONE[props.tone]">
    <h3 class="text-h4 text-navy">{{ props.title }}</h3>
    <p v-if="props.condensed" data-condensed class="text-body text-slate">{{ props.condensed }}</p>
    <ul class="m-0 flex list-none flex-col gap-3 p-0">
      <li v-for="(item, i) in props.items" :key="i" class="flex items-start gap-3 text-body text-navy">
        <span aria-hidden="true" class="mt-[11px] size-1.5 flex-none rounded-full bg-cyan" />
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>
