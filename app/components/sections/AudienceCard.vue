<script setup lang="ts">
/**
 * Audience card (bundle.js `AudienceCard`, newer DS): tinted, with a 4px top rule in the DS colour sequence
 * (`index`, default 1 = cyan), title in ink-strong, optional text and 2-column points under a hairline.
 * With `to` the whole card is a link (stretched title link) (as in the DS, the title keeps its colour on hover).
 * `condensed` is the approved TR running sentence of the points (`Section.condensed`), shown above them.
 */
const props = withDefaults(
  defineProps<{ title: string; text?: string; condensed?: string; points?: string[]; to?: string; index?: number | string }>(),
  { text: undefined, condensed: undefined, points: () => [], to: undefined, index: 1 },
)
</script>

<template>
  <article
    class="relative box-border flex flex-col gap-3 border-t-4 border-(--rule) bg-pale px-6 pt-6 pb-8"
    :style="{ '--rule': ruleColor(props.index) }"
  >
    <h3 class="text-h3 text-blue-dark">
      <NuxtLink v-if="props.to" :to="useLocalizedHref(props.to)" class="text-inherit no-underline after:absolute after:inset-0">{{ props.title }}</NuxtLink>
      <template v-else>{{ props.title }}</template>
    </h3>
    <p v-if="props.text" class="text-body-sm text-slate">{{ props.text }}</p>
    <p v-if="props.condensed" data-condensed class="text-body-sm text-slate">{{ props.condensed }}</p>
    <TickList
      v-if="props.points.length"
      :items="props.points"
      :columns="2"
      class="mt-2 border-t border-line pt-4 text-body-sm text-navy"
    />
  </article>
</template>
