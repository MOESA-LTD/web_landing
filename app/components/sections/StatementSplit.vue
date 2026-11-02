<script setup lang="ts">
/**
 * Two-column statement grid of the canvas artboards: `repeat(auto-fit, minmax(min(100%, 420px), 1fr))`, gap 48
 * (2 x 552px inside the 1200px container, one column below ~890px). Slots `#left` and `#right`.
 * `align="center"` is the About "Experience" variant; the default is start.
 */
const props = withDefaults(defineProps<{ align?: 'start' | 'center' }>(), { align: 'start' })
</script>

<template>
  <div
    class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-12"
    :class="props.align === 'center' ? 'items-center' : 'items-start'"
  >
    <div><slot name="left" /></div>
    <div><slot name="right" /></div>
  </div>
</template>
