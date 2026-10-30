<script setup lang="ts">
/**
 * Flow line ("Not a linear process"): the steps as tinted chips joined by chevron separators, wrapping onto
 * further lines on narrow screens (DS README imagery: "category → concept flows with blue chips and hairline
 * connectors"). An <ol>, so the order is announced; the chevrons are decorative.
 */
const props = defineProps<{ steps: string[] }>()
</script>

<template>
  <ol class="m-0 flex list-none flex-wrap items-center gap-x-2 gap-y-3 p-0">
    <li v-for="(step, i) in props.steps" :key="i" class="inline-flex items-center gap-2">
      <span class="inline-flex min-h-10 items-center rounded-sm border border-line bg-pale px-4 py-2 text-label text-navy">{{ step }}</span>
      <Glyph v-if="i < props.steps.length - 1" name="chevronRight" :size="16" class="text-blue" />
    </li>
  </ol>
</template>
