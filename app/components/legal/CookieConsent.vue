<script setup lang="ts">
/**
 * Cookie consent (bundle.js `CookieConsent`, bundle.css `.ms-cookie`): title, category checkboxes (Strictly
 * necessary locked on), and the equal-weight "Reject non-essential" / "Accept all" buttons, plus "Save choices"
 * when expanded or "Choose settings" when collapsed.
 *
 * - `mode="banner"` (layout): shown **only** when `runtimeConfig.public.analyticsId` is set and no choice is stored,
 *   and only after mount, because prerendered pages were rendered without the visitor's cookie. It disappears
 *   after a choice. v1 sets no analytics id, so v1 never shows it.
 * - `mode="panel"` (Cookie Policy): always shown and expanded, ticked from the stored choice, so a choice can be
 *   changed later. A polite status line confirms the save.
 *
 * Labels are UI microcopy (`cookie.*`); EN category names equal the approved cookie-policy.md categories.
 */
const props = withDefaults(defineProps<{ mode?: 'banner' | 'panel' }>(), { mode: 'banner' })

const { t } = useI18n()
const { state, save } = useConsent()
const { analyticsId } = useRuntimeConfig().public
const id = useId()

const mounted = ref(false)
const expanded = ref(props.mode === 'panel')
const chosen = reactive({ preferences: false, analytics: false })
const saved = ref(false)

const syncFromState = () => {
  chosen.preferences = state.value?.preferences ?? false
  chosen.analytics = state.value?.analytics ?? false
}

onMounted(() => {
  mounted.value = true
  syncFromState()
})

const visible = computed(() => (props.mode === 'panel' ? true : mounted.value && !!analyticsId && state.value === null))

const categories = computed(() => [
  { id: 'necessary', label: t('cookie.strictlyNecessary'), locked: true },
  { id: 'preferences' as const, label: t('cookie.preferences'), locked: false },
  { id: 'analytics' as const, label: t('cookie.analytics'), locked: false },
])

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
      <li v-for="c in categories" :key="c.id">
        <label class="flex items-start gap-2 text-body-sm font-semibold text-navy">
          <input
            v-if="c.locked"
            type="checkbox"
            class="mt-0.5 size-5 flex-none accent-blue"
            checked
            disabled
          >
          <input
            v-else
            v-model="chosen[c.id as 'preferences' | 'analytics']"
            type="checkbox"
            class="mt-0.5 size-5 flex-none accent-blue"
          >
          <span>{{ c.label }}<span v-if="c.locked" class="ml-1 font-medium text-slate">{{ t('cookie.alwaysOn') }}</span></span>
        </label>
      </li>
    </ul>

    <div class="flex flex-wrap justify-end gap-3 @max-[720.98px]:justify-start" :class="expanded && 'col-span-full'">
      <Button variant="secondary" size="sm" @click="choose('reject')">{{ t('cookie.rejectNonEssential') }}</Button>
      <Button variant="secondary" size="sm" @click="choose('accept')">{{ t('cookie.acceptAll') }}</Button>
      <Button v-if="expanded" size="sm" @click="choose('save')">{{ t('cookie.saveChoices') }}</Button>
      <Button v-else variant="text" size="sm" :aria-expanded="false" @click="expanded = true">{{ t('cookie.chooseSettings') }}</Button>
    </div>

    <p v-if="props.mode === 'panel'" role="status" class="col-span-full m-0 text-body-sm text-slate empty:hidden">{{ saved ? t('cookie.saved') : '' }}</p>
  </div>
</template>
