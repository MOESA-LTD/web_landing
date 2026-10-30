<script setup lang="ts">
/**
 * The corporate profile's two navy-panel compositions (bundle.js `LineMotif`). Decorative, only on navy.
 * - chevron: the mark's bands enlarged and bleeding off the panel (display hero). Fills its positioned parent.
 * - bars: two slanted bars, cyan over blue (Final CTA). Size it from outside.
 * Geometry: DESIGN_NOTES §3.5 (newer DS).
 */
const props = defineProps<{ variant: 'chevron' | 'bars' }>()
</script>

<template>
  <svg
    v-if="props.variant === 'chevron'"
    class="pointer-events-none absolute inset-0 block h-full w-full"
    viewBox="0 0 734 1125"
    preserveAspectRatio="xMinYMid slice"
    aria-hidden="true"
    focusable="false"
  >
    <polygon class="fill-cyan" points="-693,825 307,248 1307,825 1307,938 307,361 -693,938" />
    <polygon class="fill-blue" points="-379,825 621,248 1621,825 1621,938 621,361 -379,938" />
  </svg>
  <svg
    v-else
    class="pointer-events-none block"
    viewBox="0 0 696 142"
    preserveAspectRatio="xMaxYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <polygon class="fill-cyan" points="75,0 535,0 520,59 60,59" />
    <polygon class="fill-blue" points="156,83 616,83 601,142 141,142" />
  </svg>
</template>
