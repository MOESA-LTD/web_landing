<script setup lang="ts">
/**
 * MOESA button (bundle.js `Button`, bundle.css `.ms-btn*`). With `to` (an EN path, localised here) it is a
 * <NuxtLink>, otherwise a <button>. The text variant appends an arrow that nudges 3px on hover.
 * `inverse` is the navy-ground version (cyan primary, white secondary, cyan text) with a cyan focus ring.
 */
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'text'
    inverse?: boolean
    size?: 'md' | 'sm'
    block?: boolean
    to?: string
    type?: 'button' | 'submit'
  }>(),
  { variant: 'primary', inverse: false, size: 'md', block: false, to: undefined, type: 'button' },
)

const link = computed(() => (props.to ? useLocalizedHref(props.to) : undefined))

const VARIANT = {
  primary: 'border-transparent bg-blue text-white hover:bg-blue-dark hover:text-white',
  secondary: 'bg-transparent text-navy border-navy hover:bg-pale hover:text-navy',
  text: 'border-transparent bg-transparent text-blue hover:text-blue-dark hover:underline',
} as const

const INVERSE = {
  primary: 'border-transparent bg-cyan text-navy-dark hover:bg-white hover:text-navy',
  secondary: 'bg-transparent text-white border-white hover:bg-navy-line hover:text-white',
  text: 'border-transparent bg-transparent text-cyan hover:underline',
} as const

const classes = computed(() => [
  'group inline-flex items-center justify-center gap-2 box-border border border-solid rounded-sm',
  'font-sans text-label no-underline underline-offset-3 cursor-pointer transition-colors duration-150',
  // The text variant drops the box (bundle.css `.ms-btn-text` wins over `.ms-btn-sm`).
  props.variant === 'text' ? 'min-h-0 px-0 py-1' : props.size === 'sm' ? 'min-h-10 px-4 py-2' : 'min-h-12 px-6 py-3',
  props.inverse ? [INVERSE[props.variant], '[--focus-ring:var(--color-cyan)]'] : VARIANT[props.variant],
  props.block && 'w-full',
])
</script>

<template>
  <NuxtLink v-if="link" :to="link" :class="classes">
    <span><slot /></span>
    <Glyph v-if="props.variant === 'text'" name="arrow" :size="18" class="transition-transform duration-150 group-hover:translate-x-[3px]" />
  </NuxtLink>
  <button v-else :type="props.type" :class="classes">
    <span><slot /></span>
    <Glyph v-if="props.variant === 'text'" name="arrow" :size="18" class="transition-transform duration-150 group-hover:translate-x-[3px]" />
  </button>
</template>
