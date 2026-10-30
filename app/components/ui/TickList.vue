<script setup lang="ts">
/**
 * Bullet list with the design system's small cyan disc marker (bundle.css `.ms-dots`; the newer DS and the
 * current canvas replaced the old caret ticks with round dots). `columns: 2` flows the items into
 * auto-fill columns of at least 200px (`.ms-dots-2`).
 * Text size, colour and outer margin come from the caller (e.g. `class="mt-1 text-body-sm text-slate"`).
 */
const props = withDefaults(defineProps<{ items: string[]; columns?: 1 | 2 }>(), { columns: 1 })
</script>

<template>
  <ul class="m-0 grid list-none gap-2 p-0" :class="props.columns === 2 && 'grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-6'">
    <li
      v-for="(item, i) in props.items"
      :key="i"
      class="relative pl-5 before:absolute before:top-[.6em] before:left-0 before:size-2 before:rounded-full before:bg-cyan"
    >
      {{ item }}
    </li>
  </ul>
</template>
