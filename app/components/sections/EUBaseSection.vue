<script setup lang="ts">
/**
 * EU base band (bundle.js `EUBaseSection`): text on white beside the tinted company-facts panel
 * (blue eyebrow labels, navy values, hairlines between rows). Stacks at a container width of 860px or less.
 */
const props = withDefaults(
  defineProps<{ eyebrow?: string; title: string; body: string; rows: { label: string; value: string }[] }>(),
  { eyebrow: undefined },
)
</script>

<template>
  <section class="@container relative overflow-hidden bg-white py-24 @max-[860.98px]:py-16">
    <div
      class="mx-auto box-border grid max-w-[1200px] grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] items-stretch gap-16 px-6 @max-[860.98px]:grid-cols-1 @max-[860.98px]:gap-8 @max-[860.98px]:px-4"
    >
      <div class="self-center">
        <p v-if="props.eyebrow" class="text-eyebrow text-blue">{{ props.eyebrow }}</p>
        <h2 class="mt-3 max-w-[20ch] text-h2 text-navy">{{ props.title }}</h2>
        <p class="mt-6 max-w-[68ch] text-body text-slate">{{ props.body }}</p>
      </div>
      <dl class="m-0 grid content-center bg-pale p-8">
        <div v-for="(row, i) in props.rows" :key="i" class="grid gap-2 py-4" :class="i > 0 && 'border-t border-line'">
          <dt class="text-eyebrow text-blue">{{ row.label }}</dt>
          <dd class="m-0 text-h4 text-navy">{{ row.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
