<script setup lang="ts">
import { ROUTES, routeNameForLocalePath } from '~~/i18n/routes'

/**
 * Language bar above the header on every page (CANVAS_UPDATE_NOTES "Update 1793392616", U1).
 * Canvas visual, but real links instead of the canvas's JS buttons: `useSwitchLocalePath()` keeps the
 * query and hash, the active locale is `aria-current="true"`. Hidden when TR is disabled.
 *
 * Pages in ROUTES (all of them, including the five service pages) get their counterpart from ROUTES, the single
 * source of page paths: the layout renders this bar before the page's setup runs, so on the server the
 * service page's `useSetI18nParams` comes too late for `switchLocalePath` (the SSR HTML would keep the EN slug
 * under /tr/hizmetler/). Other paths fall back to `switchLocalePath`.
 */
const { t, locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const route = useRoute()
const { enableTr } = useRuntimeConfig().public

// A prerendered page is served for any query string, so the server-rendered hrefs cannot carry the query.
// Render them without query/hash until mounted, then with, so hydration never disagrees with the markup.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

const items = computed(() => {
  const page = routeNameForLocalePath(route.path)
  const suffix = route.fullPath.replace(/^[^?#]*/, '')
  return locales.value.map((l) => {
    const code = typeof l === 'string' ? l : l.code
    const name = typeof l === 'string' ? l.toUpperCase() : (l.name ?? code.toUpperCase())
    const full = page ? ROUTES[page][code as 'en' | 'tr'] + suffix : switchLocalePath(code as 'en' | 'tr')
    return { code, name, href: mounted.value ? full : full.replace(/[?#].*$/, ''), active: code === locale.value }
  })
})
</script>

<template>
  <div v-if="enableTr !== false" class="border-b border-line bg-mist">
    <div
      role="group"
      :aria-label="t('language.label')"
      class="mx-auto box-border flex max-w-[1200px] items-center justify-end gap-1 px-6"
    >
      <span class="mr-2 text-caption text-slate">{{ t('language.label') }}</span>
      <NuxtLink
        v-for="item in items"
        :key="item.code"
        :to="item.href"
        :lang="item.code"
        :hreflang="item.code"
        :aria-current="item.active ? 'true' : undefined"
        class="box-border inline-flex h-11 min-w-11 items-center justify-center rounded-sm px-2 text-[13px] leading-[normal] font-bold tracking-[0.08em] no-underline transition-colors duration-150"
        :class="item.active ? 'bg-blue text-white' : 'bg-transparent text-navy hover:bg-pale hover:text-blue'"
      >{{ item.name }}</NuxtLink>
    </div>
  </div>
</template>
