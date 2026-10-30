<script setup lang="ts">
/**
 * One form field (bundle.js ContactForm `field()`, bundle.css `.ms-field`): label (+ " (optional)" in 500 slate),
 * optional help text, the control (default slot), and the written error with the alert glyph. The slot receives
 * `describedBy` (help + error ids) and `invalid`, which the control puts on `aria-describedby` / `aria-invalid`.
 * Errors are never shown by colour alone.
 */
const props = withDefaults(
  defineProps<{
    id: string
    label: string
    optional?: boolean
    help?: string
    error?: string
    wide?: boolean
  }>(),
  { optional: false, help: undefined, error: undefined, wide: false },
)

const { t } = useI18n()
const helpId = computed(() => `${props.id}-help`)
const errorId = computed(() => `${props.id}-err`)
const describedBy = computed(
  () => [props.help ? helpId.value : '', props.error ? errorId.value : ''].filter(Boolean).join(' ') || undefined,
)
</script>

<template>
  <div class="grid content-start gap-2" :class="props.wide && 'col-span-full'">
    <label :for="props.id" class="text-label text-navy">
      {{ props.label }}<span v-if="props.optional" class="font-medium text-slate">&nbsp;{{ t('form.optional') }}</span>
    </label>
    <p v-if="props.help" :id="helpId" class="text-caption text-slate">{{ props.help }}</p>
    <slot :described-by="describedBy" :invalid="Boolean(props.error)" />
    <p v-if="props.error" :id="errorId" data-error class="flex items-start gap-1 text-caption font-semibold text-danger">
      <Glyph name="alert" :size="16" class="mt-0.5" />
      <span>{{ props.error }}</span>
    </p>
  </div>
</template>
