<script setup lang="ts">
/**
 * Status chip (bundle.css `.ms-chip`): "Draft" (navy, legal status line) or "Open" (dashed outline,
 * open-information notes). The label is UI microcopy (`status.*`).
 */
const props = defineProps<{ kind: 'draft' | 'open' }>()
const { t } = useI18n()
</script>

<template>
  <span
    class="inline-flex h-6 flex-none items-center rounded-sm px-2 text-[12px] leading-none font-bold tracking-[.06em] uppercase"
    :class="props.kind === 'draft' ? 'bg-navy text-white' : 'border border-dashed border-navy bg-white text-navy'"
  >{{ t(`status.${props.kind}`) }}</span>
</template>
