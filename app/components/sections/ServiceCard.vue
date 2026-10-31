<script setup lang="ts">
/**
 * Service card (bundle.js `ServiceCard`): a ruled card (4px top rule in the DS colour sequence by `index`),
 * numeral "01" (decorative) or, for the capability card, the "Cross-functional capability" eyebrow.
 * The whole card is one link: the title link's ::after stretches over the card. "Explore service" is
 * decorative (aria-hidden); the link's name is the title.
 */
const props = withDefaults(
  defineProps<{ index?: string; capability?: boolean; title: string; summary: string; points: string[]; to: string }>(),
  { index: undefined, capability: false },
)
const { t } = useI18n()
const rule = computed(() => ruleColor(props.capability ? (props.index ?? 1) : props.index))
</script>

<template>
  <article
    class="group relative box-border flex flex-col gap-3 border-t-4 border-solid border-(--rule) pt-6"
    :style="{ '--rule': rule }"
  >
    <p v-if="props.capability" class="mb-1 flex min-h-12 items-end text-eyebrow text-blue">{{ t('cards.capability') }}</p>
    <p v-else-if="props.index" data-numeral aria-hidden="true" class="mb-1 text-numeral" :style="{ color: numeralColor(props.index) }">{{ numeral(props.index) }}</p>
    <h3 class="text-h3 text-navy group-hover:text-blue">
      <NuxtLink :to="useLocalizedHref(props.to)" class="text-inherit no-underline after:absolute after:inset-0">{{ props.title }}</NuxtLink>
    </h3>
    <p class="text-body-sm text-slate">{{ props.summary }}</p>
    <TickList v-if="props.points.length" :items="props.points" class="mt-1 text-body-sm text-slate" />
    <span aria-hidden="true" class="mt-auto inline-flex items-center gap-2 pt-3 text-label text-blue">
      {{ t('cards.exploreService') }}
      <Glyph name="arrow" :size="18" class="transition-transform duration-150 group-hover:translate-x-[3px]" />
    </span>
  </article>
</template>
