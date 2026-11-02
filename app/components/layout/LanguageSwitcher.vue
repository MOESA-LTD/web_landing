<script setup lang="ts">
import type { Locale } from '#content/types'
import { ROUTES, enabledLocales, routeNameForLocalePath } from '~~/i18n/routes'

/**
 * Language dropdown at the right end of the header bar (CANVAS_UPDATE_1793393437 §1; it replaces the grey
 * "Language EN TR" bar above the header). The button shows the current code plus a chevron; the menu lists the
 * native name and the code. Canvas visual, but real links instead of the canvas's JS buttons, and a disclosure:
 * `aria-expanded` / `aria-controls`, Escape closes and returns focus to the button, a mousedown outside and a
 * route change close it (all three are additions to the canvas, which lacks them). The current locale is
 * `aria-current="true"`. A locale switched off (`enableTr` / `enableDe` / `enableBg` false) is not listed; with only EN left the
 * dropdown is not rendered at all. The header owns the `open` state (v-model:open) so that
 * opening this menu closes the Services menu and vice versa.
 *
 * Positioned over the header bar: the parent `<header>` is the (relative) positioning context and the
 * `@container` the mobile variants query. Offsets are the canvas's `.mo-lang`.
 *
 * Pages in ROUTES (all of them, including the five service pages) get their counterpart from ROUTES, the single
 * source of page paths: the layout renders the header before the page's setup runs, so on the server the
 * service page's `useSetI18nParams` comes too late for `switchLocalePath` (the SSR HTML would keep the EN slug
 * under /tr/hizmetler/, /de/leistungen/ or /bg/uslugi/). Other paths fall back to `switchLocalePath`, and a path without any
 * counterpart (the 404 page) to the locale's home, so every link keeps a real href.
 */
const open = defineModel<boolean>('open', { default: false })
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const available = new Set(enabledLocales(useLocaleOptions()))
const root = useTemplateRef<HTMLElement>('root')

// A prerendered page is served for any query string, so the server-rendered hrefs cannot carry the query.
// Render them without query/hash until mounted, then with, so hydration never disagrees with the markup.
const mounted = ref(false)

const items = computed(() => {
  const page = routeNameForLocalePath(route.path)
  const suffix = route.fullPath.replace(/^[^?#]*/, '')
  const codes = locales.value.map((l) => (typeof l === 'string' ? l : l.code) as Locale).filter((c) => available.has(c))
  return codes.map((code) => {
    // An unmatched path (the 404 page) has no counterpart: switchLocalePath gives '' there, so use the locale's home.
    const full = page ? ROUTES[page][code] + suffix : switchLocalePath(code) || ROUTES.home[code]
    return {
      code,
      label: code.toUpperCase(),
      name: t(`language.names.${code}`),
      href: mounted.value ? full : full.replace(/[?#].*$/, ''),
      current: code === locale.value,
    }
  })
})
const current = computed(() => items.value.find((i) => i.current) ?? items.value[0]!)

function focusButton() {
  ;(root.value?.querySelector('#lang-button') as HTMLElement | null)?.focus()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape' || !open.value) return
  open.value = false
  focusButton()
}

function onMousedown(e: MouseEvent) {
  if (!open.value) return
  if (!(e.target as Element | null)?.closest?.('[data-lang-dd]')) open.value = false
}

// Tabbing out of the dropdown closes it (a null relatedTarget is a click on non-focusable content: mousedown handles it).
function onFocusout(e: FocusEvent) {
  const next = e.relatedTarget as Node | null
  if (open.value && next && !root.value?.contains(next)) open.value = false
}

onMounted(() => {
  mounted.value = true
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('mousedown', onMousedown)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('mousedown', onMousedown)
})

watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
</script>

<template>
  <div
    v-if="items.length > 1"
    ref="root"
    data-lang-dd
    @focusout="onFocusout"
    class="absolute top-0 right-[max(24px,calc((100%-1200px)/2+24px))] z-40 flex h-[76px] items-center @max-[1159.98px]:right-[68px] @max-[1159.98px]:h-16"
  >
    <button
      id="lang-button"
      type="button"
      class="box-border inline-flex h-11 min-w-16 cursor-pointer items-center gap-1.5 rounded-sm border border-line bg-white px-2.5 text-[13px] leading-[normal] font-bold tracking-[0.08em] text-navy hover:border-blue hover:text-blue"
      :aria-expanded="open"
      aria-controls="lang-menu"
      :aria-label="`${t('language.label')}: ${current.name}`"
      @click="open = !open"
    >
      {{ current.label }}
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" class="flex-none">
        <path d="M6 9 L12 15 L18 9" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="square" />
      </svg>
    </button>
    <ul
      id="lang-menu"
      :hidden="!open"
      class="absolute top-[calc(50%+28px)] right-0 z-40 m-0 box-content min-w-[168px] list-none rounded-sm border border-line bg-white p-1 shadow-menu"
    >
      <li v-for="item in items" :key="item.code">
        <NuxtLink
          :to="item.href"
          :lang="item.code"
          :hreflang="item.code"
          :aria-current="item.current ? 'true' : undefined"
          class="box-border flex h-11 w-full items-center justify-between gap-4 rounded-sm px-3 text-[15px] leading-[normal] no-underline"
          :class="item.current ? 'bg-pale font-bold text-blue-dark' : 'bg-transparent font-medium text-navy hover:bg-pale hover:text-blue'"
          @click="open = false"
        >
          <span>{{ item.name }}</span>
          <span class="text-[13px] font-bold tracking-[0.08em] text-slate">{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
