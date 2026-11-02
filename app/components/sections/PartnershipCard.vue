<script setup lang="ts">
/**
 * Partnership-model row (bundle.js `PartnershipCard`, newer DS): a ruled list row with a numbered disc and
 * the title, not a boxed card. Lay rows out in a 2-column grid with row-gap 0. `inverse` for navy bands.
 */
const props = withDefaults(defineProps<{ index: string; title: string; inverse?: boolean }>(), { inverse: false })
</script>

<template>
  <article
    class="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-x-4 gap-y-2 border-t py-4"
    :class="props.inverse ? 'border-navy-line' : 'border-line'"
  >
    <span
      aria-hidden="true"
      class="inline-flex size-8 items-center justify-center rounded-full text-[12px] leading-none font-bold"
      :class="props.inverse ? 'bg-navy-line text-mist-blue' : 'bg-pale text-blue'"
    >{{ numeral(props.index) }}</span>
    <h3 class="text-h4" :class="props.inverse ? 'text-white' : 'text-navy'">{{ props.title }}</h3>
  </article>
</template>
