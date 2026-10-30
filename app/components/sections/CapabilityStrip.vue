<script setup lang="ts">
/**
 * Capability band (bundle.js `CapabilityStrip`): text on white beside a tinted panel of items, each with a
 * 4px navy left rule (the profile's market-entry page). The split stacks at a container width of 860px or less.
 * `tone="mist"` puts the band on #F7FAFC where the page needs it to differ from a white neighbour.
 */
const props = withDefaults(
  defineProps<{ eyebrow?: string; title: string; body: string; note?: string; items: string[]; tone?: 'white' | 'mist' }>(),
  { eyebrow: undefined, note: undefined, tone: 'white' },
)
</script>

<template>
  <section
    class="@container relative overflow-hidden py-24 @max-[860.98px]:py-16"
    :class="props.tone === 'mist' ? 'bg-mist' : 'bg-white'"
  >
    <div
      class="mx-auto box-border grid max-w-[1200px] grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-stretch gap-16 px-6 @max-[860.98px]:grid-cols-1 @max-[860.98px]:gap-8 @max-[860.98px]:px-4"
    >
      <div class="self-center">
        <p v-if="props.eyebrow" class="text-eyebrow text-blue">{{ props.eyebrow }}</p>
        <h2 class="mt-3 max-w-[20ch] text-h2 text-navy">{{ props.title }}</h2>
        <p class="mt-6 max-w-[68ch] text-body text-slate">{{ props.body }}</p>
        <p v-if="props.note" class="mt-6 max-w-[68ch] border-t border-line pt-6 text-label text-navy">{{ props.note }}</p>
      </div>
      <ul v-if="props.items.length" class="m-0 grid list-none content-center gap-3 bg-pale p-8">
        <li v-for="(item, i) in props.items" :key="i" class="grid gap-1 border-l-4 border-navy bg-white px-6 py-4">
          <span class="text-h4 text-navy">{{ item }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>
