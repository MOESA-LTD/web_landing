<script setup lang="ts">
/**
 * Related services (bundle.js `RelatedServices`): an h2 "Related services" over hairline-separated link rows
 * (name, summary, arrow). Hover turns the name blue and nudges the arrow.
 */
const props = defineProps<{ items: { title: string; summary: string; to: string }[] }>()
const { t } = useI18n()
const headingId = useId()
</script>

<template>
  <section :aria-labelledby="headingId">
    <h2 :id="headingId" class="mb-4 text-h4 text-navy">{{ t('related.services') }}</h2>
    <ul class="m-0 list-none border-t border-line p-0">
      <li v-for="(item, i) in props.items" :key="i" class="border-b border-line">
        <NuxtLink :to="useLocalizedHref(item.to)" class="group flex items-center justify-between gap-6 py-6 text-blue no-underline">
          <span class="grid gap-1">
            <span class="text-h4 text-navy group-hover:text-blue">{{ item.title }}</span>
            <span class="text-body-sm text-slate">{{ item.summary }}</span>
          </span>
          <Glyph name="arrow" :size="20" class="transition-transform duration-150 group-hover:translate-x-[3px]" />
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
