<script setup lang="ts">
/**
 * Process timeline (bundle.js `ProcessTimeline`, newer DS): numbered 44px blue discs joined by a 2px blue
 * connector, the last disc cyan (`highlightLast`, default on). `row` lays the steps out in equal columns and
 * becomes a vertical list at a container width of 720px or less; `column` is always vertical.
 * `loop` adds the closing loop line. `inverse` for navy bands. Connector geometry: `.timeline-*` in main.css (@layer components).
 */
const props = withDefaults(
  defineProps<{ steps: string[]; layout?: 'row' | 'column'; loop?: string; inverse?: boolean; highlightLast?: boolean }>(),
  { layout: 'row', loop: undefined, inverse: false, highlightLast: true },
)
</script>

<template>
  <div class="@container" :class="props.inverse && 'surface-inverse'">
    <ol
      class="m-0 grid list-none gap-6 p-0"
      :class="props.layout === 'row' ? 'timeline-row' : 'timeline-column'"
      :style="{ '--steps': props.steps.length }"
    >
      <li
        v-for="(step, i) in props.steps"
        :key="i"
        class="timeline-step relative flex gap-4"
        :data-last="props.highlightLast && i === props.steps.length - 1 ? 'true' : undefined"
      >
        <span
          data-step-marker
          aria-hidden="true"
          class="relative z-[1] inline-flex size-11 flex-none items-center justify-center rounded-full text-[16px] leading-none font-bold"
          :class="props.highlightLast && i === props.steps.length - 1 ? 'bg-cyan text-navy-dark' : 'bg-blue text-white'"
        >{{ i + 1 }}</span>
        <span class="timeline-text flex flex-col gap-2">
          <span class="text-body font-bold" :class="props.inverse ? 'text-white' : 'text-navy'">{{ step }}</span>
        </span>
      </li>
    </ol>
    <p
      v-if="props.loop"
      data-loop
      class="mt-8 inline-flex items-center gap-2 rounded-sm px-4 py-3 text-body-sm font-semibold"
      :class="props.inverse ? 'bg-navy-line text-white' : 'bg-pale text-navy'"
    >
      <Glyph name="loop" :size="20" :class="props.inverse ? 'text-cyan' : 'text-blue'" />
      <span>{{ props.loop }}</span>
    </p>
  </div>
</template>
