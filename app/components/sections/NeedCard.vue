<script setup lang="ts">
/**
 * "Start with the business need" card (bundle.js `NeedCard`): the whole card is a link; the need on top,
 * the service it leads to at the bottom with an arrow.
 */
const props = defineProps<{ text: string; service: string; to: string }>()
</script>

<template>
  <NuxtLink
    :to="useLocalizedHref(props.to)"
    class="group relative box-border flex min-h-[168px] flex-col justify-between gap-6 rounded-sm border border-line bg-white p-6 no-underline transition-colors duration-150 hover:border-blue"
  >
    <span class="text-h4 text-navy">{{ props.text }}</span>
    <span class="inline-flex items-center gap-2 text-label text-blue group-hover:text-blue-dark">
      {{ props.service }}
      <Glyph name="arrow" :size="18" />
    </span>
  </NuxtLink>
</template>
