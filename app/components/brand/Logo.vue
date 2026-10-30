<script setup lang="ts">
import { NuxtLink } from '#components'

/**
 * MOESA lockup (bundle.js `Logo`, variant "lockup"): the mark plus "MOESA LTD." set in bold capitals.
 * On navy (`tone="inverse"`) the mark loses contrast at logo size, so it is the typeset name only.
 * With `href` (an EN path) it links home with an accessible name.
 */
const props = withDefaults(defineProps<{ tone?: 'default' | 'inverse'; height?: number; href?: string }>(), {
  tone: 'default',
  height: 26,
  href: undefined,
})

const { t } = useI18n()
const MARK_RATIO = 1855 / 531
const markWidth = computed(() => Math.round(props.height * MARK_RATIO))
const link = computed(() => (props.href ? useLocalizedHref(props.href) : undefined))
</script>

<template>
  <component
    :is="link ? NuxtLink : 'span'"
    v-bind="link ? { to: link, 'aria-label': t('logo.homeLabel') } : {}"
    class="inline-flex items-center leading-none no-underline"
    :style="{ gap: `${props.height * 0.5}px` }"
  >
    <img
      v-if="props.tone !== 'inverse'"
      class="block w-auto"
      :style="{ height: `${props.height}px` }"
      src="/moesa_mark.png"
      :width="markWidth"
      :height="props.height"
      alt=""
    >
    <span
      class="font-sans font-bold tracking-[0.03em] whitespace-nowrap"
      :class="props.tone === 'inverse' ? 'text-white' : 'text-navy'"
      :style="{ fontSize: `${props.height * 0.7}px` }"
    >MOESA LTD.</span>
  </component>
</template>
