<script setup lang="ts">
/**
 * Hairline-separated rows (DS "rows separated by hairlines": `.ms-related-list` / `.ms-linklist` anatomy).
 * Plain strings render as a <ul>; `{ term, text }` pairs render as a <dl> with the term beside the text
 * (stacked at a container width of 560px or less). For "What MOESA manages", "Project visibility", the selection guide.
 */
type Pair = { term: string; text: string }
const props = defineProps<{ items: string[] | Pair[] }>()

const pairs = computed(() => (props.items.length > 0 && typeof props.items[0] !== 'string' ? (props.items as Pair[]) : null))
</script>

<template>
  <div class="@container">
    <dl v-if="pairs" class="m-0 border-t border-line">
      <div
        v-for="(item, i) in pairs"
        :key="i"
        class="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-6 gap-y-1 border-b border-line py-4 @max-[560.98px]:grid-cols-1"
      >
        <dt class="text-h4 text-navy">{{ item.term }}</dt>
        <dd class="m-0 text-body text-slate">{{ item.text }}</dd>
      </div>
    </dl>
    <ul v-else class="m-0 list-none border-t border-line p-0">
      <li v-for="(item, i) in props.items as string[]" :key="i" class="border-b border-line py-4 text-body text-navy">{{ item }}</li>
    </ul>
  </div>
</template>
