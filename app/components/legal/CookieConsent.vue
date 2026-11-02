<script setup lang="ts">
/**
 * Cookie consent (bundle.js `CookieConsent`, bundle.css `.ms-cookie`): title, category checkboxes (Strictly
 * necessary locked on), and the equal-weight "Reject non-essential" / "Accept all" buttons, plus "Save choices"
 * when expanded or "Choose settings" when collapsed.
 *
 * Only categories that exist are offered (legal review S3): Strictly necessary always, Analytics only when
 * `runtimeConfig.public.analyticsId` is set. Without an optional category there is nothing to choose, so the panel
 * shows the necessary category and a note ("We currently use no preference, analytics or marketing cookies"), with no
 * buttons, and the `moesa_consent` cookie is never written.
 *
 * - `mode="banner"` (layout): shown **only** when `analyticsId` is set and no choice is stored, and only after
 *   mount, because prerendered pages were rendered without the visitor's cookie. It disappears after a choice.
 *   v1 sets no analytics id, so v1 never shows it.
 * - `mode="panel"` (Cookie Policy): always shown and expanded, ticked from the stored choice, so a choice can be
 *   changed later. A polite status line confirms the save.
 *
 * Labels are UI microcopy (`cookie.*`).
 */
const props = withDefaults(defineProps<{ mode?: 'banner' | 'panel' }>(), { mode: 'banner' })

const { t } = useI18n()
const { state, save } = useConsent()
const { analyticsId } = useRuntimeConfig().public
const id = useId()

/** Analytics is the only optional category, and it exists only once an analytics id is configured. */
const hasChoice = !!analyticsId

const mounted = ref(false)
const expanded = ref(props.mode === 'panel')
const chosen = reactive({ analytics: false })
const saved = ref(false)

const syncFromState = () => {
  chosen.analytics = state.value?.analytics ?? false
}

onMounted(() => {
  mounted.value = true
  syncFromState()
})

const visible = computed(() => (props.mode === 'panel' ? true : mounted.value && hasChoice && state.value === null))

function choose(kind: 'reject' | 'accept' | 'save') {
  save(kind === 'save' ? { ...chosen } : kind)
  syncFromState()
  saved.value = true
}
</script>

<template>
  <div
    v-if="visible"
    data-cookie-consent
    role="region"
    :aria-labelledby="`${id}-t`"
    :class="props.mode === 'banner' && 'fixed inset-x-4 bottom-4 z-40 mx-auto max-h-[calc(100vh-2rem)] w-auto overflow-y-auto'"
    class="@container box-border grid w-full max-w-[960px] grid-cols-[1fr_auto] items-center gap-x-8 gap-y-4 rounded-sm border border-t-[3px] border-line border-t-navy bg-white p-6 font-sans shadow-menu @max-[720.98px]:grid-cols-1"
  >
    <div class="grid justify-items-start gap-2">
      <h2 :id="`${id}-t`" class="text-h4 text-navy">{{ t('cookie.title') }}</h2>
      <NuxtLink v-if="props.mode === 'banner'" :to="useLocalizedHref('/cookie-policy')" class="text-body-sm text-blue underline hover:text-blue-dark">
        {{ t('footer.legal.cookiePolicy') }}
      </NuxtLink>
    </div>

    <ul v-if="expanded" class="col-span-full m-0 flex list-none flex-wrap gap-x-8 gap-y-3 border-t border-line p-0 pt-4">
      <li>
        <label class="flex items-start gap-2 text-body-sm font-semibold text-navy">
          <input type="checkbox" class="mt-0.5 size-5 flex-none accent-blue" checked disabled>
          <span>{{ t('cookie.strictlyNecessary') }}<span class="ml-1 font-medium text-slate">{{ t('cookie.alwaysOn') }}</span></span>
        </label>
      </li>
      <li v-if="hasChoice">
        <label class="flex items-start gap-2 text-body-sm font-semibold text-navy">
          <input v-model="chosen.analytics" type="checkbox" class="mt-0.5 size-5 flex-none accent-blue">
          <span>{{ t('cookie.analytics') }}</span>
        </label>
      </li>
    </ul>

    <p v-if="!hasChoice" data-cookie-none class="col-span-full m-0 text-body-sm text-slate">{{ t('cookie.noOptional') }}</p>

    <div v-if="hasChoice" class="flex flex-wrap justify-end gap-3 @max-[720.98px]:justify-start" :class="expanded && 'col-span-full'">
      <Button variant="secondary" size="sm" @click="choose('reject')">{{ t('cookie.rejectNonEssential') }}</Button>
      <Button variant="secondary" size="sm" @click="choose('accept')">{{ t('cookie.acceptAll') }}</Button>
      <Button v-if="expanded" size="sm" @click="choose('save')">{{ t('cookie.saveChoices') }}</Button>
      <Button v-else variant="text" size="sm" :aria-expanded="false" @click="expanded = true">{{ t('cookie.chooseSettings') }}</Button>
    </div>

    <p v-if="hasChoice && props.mode === 'panel'" role="status" class="col-span-full m-0 text-body-sm text-slate empty:hidden">{{ saved ? t('cookie.saved') : '' }}</p>
  </div>
</template>
