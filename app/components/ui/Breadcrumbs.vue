<script setup lang="ts">
import type { Crumb } from '#content/types'

/**
 * Breadcrumb trail (bundle.js `Breadcrumbs`, bundle.css `.ms-crumbs`). The last item is the current page:
 * `aria-current="page"`, no link. Separators are decorative.
 */
const props = defineProps<{ items: Crumb[] }>()
const { t } = useI18n()
</script>

<template>
  <nav :aria-label="t('breadcrumbs.label')">
    <ol class="m-0 flex list-none flex-wrap p-0 text-[14px]/5 font-medium">
      <li v-for="(item, i) in props.items" :key="i" class="flex items-center text-slate">
        <span v-if="i > 0" data-crumb-sep aria-hidden="true" class="mx-2 text-line-strong">/</span>
        <span v-if="i === props.items.length - 1" aria-current="page" class="font-semibold text-navy">{{ item.label }}</span>
        <span v-else-if="!item.href">{{ item.label }}</span>
        <NuxtLink v-else :to="useLocalizedHref(item.href)" class="text-blue no-underline hover:underline underline-offset-3">{{ item.label }}</NuxtLink>
      </li>
    </ol>
  </nav>
</template>
