<script setup lang="ts">
/**
 * Ruled numbered columns (DS README "Rules, not boxes"; same anatomy as the ruled ServiceCard without a link):
 * 4px top rule in the sequence cyan, blue, dark blue, navy, a decorative numeral, title and optional body.
 * For approved sections without a canvas layout: principles, engagement models, responsibilities.
 * The list is an <ol>, so the numerals are aria-hidden. `min` is the column minimum in px (default 300;
 * 250 puts four short titles in one row of the 1200px container, as the canvas service grid does).
 */
const props = withDefaults(defineProps<{ items: { title: string; body?: string }[]; min?: number }>(), { min: 300 })
</script>

<template>
  <ol
    class="m-0 grid list-none gap-x-8 gap-y-12 p-0"
    :style="{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${props.min}px), 1fr))` }"
  >
    <li
      v-for="(item, i) in props.items"
      :key="i"
      class="flex flex-col gap-3 border-t-4 border-(--rule) pt-6"
      :style="{ '--rule': ruleColor(i + 1) }"
    >
      <p aria-hidden="true" class="mb-1 text-numeral" :style="{ color: numeralColor(i + 1) }">{{ numeral(i + 1) }}</p>
      <h3 class="text-h3 text-navy">{{ item.title }}</h3>
      <p v-if="item.body" class="text-body-sm text-slate">{{ item.body }}</p>
    </li>
  </ol>
</template>
