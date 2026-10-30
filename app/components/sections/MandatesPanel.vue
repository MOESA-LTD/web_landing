<script setup lang="ts">
/**
 * "Typical mandates" panel of the service pages (canvas Service*.dc.html): a quiet bordered panel with an h3
 * and a list with 6px cyan round dots (CANVAS_UPDATE_NOTES §1.2). `tone="pale"` uses the tinted ground.
 */
const props = withDefaults(defineProps<{ title: string; items: string[]; tone?: 'mist' | 'pale' }>(), { tone: 'mist' })
</script>

<template>
  <div class="flex flex-col gap-4 rounded-sm border border-line p-8" :class="props.tone === 'pale' ? 'bg-pale' : 'bg-mist'">
    <h3 class="text-h4 text-navy">{{ props.title }}</h3>
    <ul class="m-0 flex list-none flex-col gap-3 p-0">
      <li v-for="(item, i) in props.items" :key="i" class="flex items-start gap-3 text-body text-navy">
        <span aria-hidden="true" class="mt-[11px] size-1.5 flex-none rounded-full bg-cyan" />
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>
