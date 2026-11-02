<script setup lang="ts">
/**
 * Status chip (bundle.css `.ms-chip`): "Draft" (navy, legal status line) or "Open" (dashed outline,
 * open-information notes). The default label is UI microcopy (`status.*`); `label` replaces it with page copy,
 * e.g. the md `**Status:**` value of the legal pages' draft chip. A long label wraps
 * (min height 24 instead of a fixed 24).
 */
const props = defineProps<{ kind: 'draft' | 'open'; label?: string }>()
const { t } = useI18n()
</script>

<template>
  <span
    :data-chip="props.kind"
    class="inline-flex min-h-6 max-w-full shrink-0 items-center rounded-sm px-2 py-1 text-[12px] leading-[1.25] font-bold tracking-[.06em] uppercase"
    :class="props.kind === 'draft' ? 'bg-navy text-white' : 'border border-dashed border-navy bg-white text-navy'"
  >{{ props.label ?? t(`status.${props.kind}`) }}</span>
</template>
