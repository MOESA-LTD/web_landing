<script setup lang="ts">
/**
 * Approved figure (bundle.js `Stat`): a 72px numeral in ink-strong over a blue label.
 */
const props = defineProps<{ value: string; label: string }>()
</script>

<template>
  <div class="grid gap-2">
    <p class="m-0 flex items-baseline gap-4"><span class="text-stat text-blue-dark">{{ props.value }}</span></p>
    <p class="text-h4 text-blue">{{ props.label }}</p>
  </div>
</template>
