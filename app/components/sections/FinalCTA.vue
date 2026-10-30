<script setup lang="ts">
import type { FinalCtaContent } from '#content/types'

/**
 * Final call to action (bundle.js `FinalCTA`): navy band with the profile back cover's two bars (`bars` motif,
 * hidden at a container width of 1000px or less), white title, mist body, inverse buttons.
 */
const props = defineProps<{ content: FinalCtaContent }>()
</script>

<template>
  <section class="surface-inverse @container relative overflow-hidden bg-navy-dark py-24 text-white @max-[860.98px]:py-16">
    <LineMotif variant="bars" class="absolute -right-10 bottom-16 h-auto w-[min(40%,480px)] @max-[1000.98px]:hidden" />
    <div class="relative mx-auto box-border flex max-w-[1200px] flex-col items-start gap-4 px-6 @max-[860.98px]:px-4">
      <h2 class="max-w-[20ch] text-h2 text-white">{{ props.content.title }}</h2>
      <p class="max-w-[56ch] text-body text-mist-blue">{{ props.content.body }}</p>
      <div class="mt-4 flex flex-wrap items-center gap-4">
        <Button :to="props.content.cta.href" inverse>{{ props.content.cta.label }}</Button>
        <Button v-if="props.content.secondary" :to="props.content.secondary.href" variant="secondary" inverse>
          {{ props.content.secondary.label }}
        </Button>
      </div>
    </div>
  </section>
</template>
