<script setup lang="ts">
/**
 * UI glyphs of the MOESA design system (bundle.js `Glyph`): 24px grid, 1.75px square-capped strokes
 * in currentColor. Always decorative. Paths: DESIGN_NOTES §2.
 */
export type GlyphName = 'arrow' | 'chevronDown' | 'chevronRight' | 'menu' | 'close' | 'check' | 'alert' | 'loop' | 'upload'

const props = withDefaults(defineProps<{ name: GlyphName; size?: number }>(), { size: 24 })

const PATHS: Record<GlyphName, string> = {
  arrow: 'M5 12h14M13 6l6 6-6 6',
  chevronDown: 'M6 9l6 6 6-6',
  chevronRight: 'M9 6l6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  alert: 'M12 8v5M12 16.5v.5M12 3l10 18H2z',
  loop: 'M4 12a8 8 0 0 1 14-5.3M20 4v4h-4M20 12a8 8 0 0 1-14 5.3M4 20v-4h4',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
}
</script>

<template>
  <svg
    class="flex-none"
    :width="props.size"
    :height="props.size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="square"
    stroke-linejoin="miter"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="PATHS[props.name]" />
  </svg>
</template>
