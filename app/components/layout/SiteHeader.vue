<script setup lang="ts">
import { navigation } from '#content/site'
import { localizeHref, routeNameForPath, type RouteName } from '~~/i18n/routes'

/**
 * Site header (bundle.js `Header`, DESIGN_NOTES §3.1): logo, primary nav with the Services disclosure,
 * "Discuss a Project" CTA; below 960px of its own width a menu button opens an in-flow panel that pushes the
 * content down (no overlay). Not sticky. Labels come from i18n/locales, links from navigation.json localised
 * to the current locale. Services is a disclosure button, not a link and not a hover menu: it closes on
 * Escape (focus returns to the button), on a mousedown outside and on route change.
 */
const { t, locale } = useI18n()
const route = useRoute()
const root = useTemplateRef<HTMLElement>('root')

const NAV_LABEL_KEY: Partial<Record<RouteName, string>> = {
  home: 'nav.home',
  services: 'nav.services',
  'how-we-work': 'nav.howWeWork',
  'who-we-work-with': 'nav.whoWeWorkWith',
  about: 'nav.about',
  contact: 'nav.contact',
}

const trimSlash = (p: string) => (p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p)
const currentPath = computed(() => trimSlash(route.path))

const items = computed(() =>
  // Home is not a menu item (canvas v1793393437): the logo is the way home.
  navigation.primary.filter((item) => item.href !== '/').map((item) => {
    const href = localizeHref(item.href, locale.value as 'en' | 'tr')
    const exact = currentPath.value === href
    // `/services/*` marks Services.
    const ancestor = currentPath.value.startsWith(href + '/')
    return {
      href,
      label: t(NAV_LABEL_KEY[routeNameForPath(item.href)!]!),
      isServices: item.href === '/services',
      current: exact || ancestor,
      ariaCurrent: exact ? ('page' as const) : ancestor ? ('true' as const) : undefined,
    }
  }),
)

const services = computed(() =>
  navigation.services.map((s) => {
    const href = localizeHref(s.href, locale.value as 'en' | 'tr')
    return {
      href,
      label: t(`nav.serviceLinks.${s.href.replace('/services/', '')}`),
      ariaCurrent: currentPath.value === href ? ('page' as const) : undefined,
    }
  }),
)
const allServicesHref = computed(() => localizeHref('/services', locale.value as 'en' | 'tr'))

const servicesOpen = ref(false)
const langOpen = ref(false)
const menuOpen = ref(false)

// One desktop menu at a time: opening the language menu closes Services, and vice versa.
watch(servicesOpen, (v) => {
  if (v) langOpen.value = false
})
watch(langOpen, (v) => {
  if (v) servicesOpen.value = false
})

const focusById = (id: string) => (root.value?.querySelector(`#${id}`) as HTMLElement | null)?.focus()

function onKeydown(e: KeyboardEvent) {
  if (e.key !== 'Escape') return
  if (servicesOpen.value) {
    servicesOpen.value = false
    focusById('services-button')
  }
  if (menuOpen.value) {
    menuOpen.value = false
    focusById('menu-button')
  }
}

function onMousedown(e: MouseEvent) {
  if (!servicesOpen.value) return
  if (!(e.target as Element | null)?.closest?.('[data-nav-dd]')) servicesOpen.value = false
}

onMounted(() => {
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
    servicesOpen.value = false
    menuOpen.value = false
  },
)

// The 76px reserved for the language dropdown leaves the five TR labels (approved page titles, wider than the
// canvas draft labels) about 0.4px short at the 1152px bar content width. From 1200px up keep them on one line
// (they then overlap the 24px gap by under a pixel); below that the DS wrapping behaviour stays.
const navLink =
  'relative inline-flex h-10 cursor-pointer items-center gap-1 rounded-sm border-0 bg-transparent px-3 text-label text-navy no-underline hover:text-blue @min-[1200px]:whitespace-nowrap'
const currentUnderline = 'after:absolute after:inset-x-3 after:bottom-0.5 after:h-0.5 after:bg-blue after:content-[\'\']'
const mobileLink = 'block border-b border-line py-4 text-[17px]/6 font-bold no-underline'
</script>

<template>
  <header ref="root" class="@container relative z-30 border-b border-line bg-white font-sans">
    <div
      class="mx-auto box-border flex h-[76px] max-w-[1200px] items-center gap-6 px-6 @max-[959.98px]:h-16 @max-[959.98px]:px-4"
    >
      <Logo href="/" class="shrink-0" />

      <nav :aria-label="t('nav.label')" data-nav="desktop" class="flex-1 @max-[959.98px]:hidden">
        <ul class="m-0 flex list-none gap-1 p-0">
          <li v-for="item in items" :key="item.href" :data-nav-dd="item.isServices ? '' : undefined" :class="item.isServices && 'relative'">
            <template v-if="item.isServices">
              <button
                id="services-button"
                type="button"
                class="group"
                :class="[navLink, item.current && ['is-current', currentUnderline]]"
                :aria-expanded="servicesOpen"
                aria-controls="services-menu"
                :aria-current="item.ariaCurrent"
                @click="servicesOpen = !servicesOpen"
              >
                {{ item.label }}
                <Glyph name="chevronDown" :size="16" class="transition-transform duration-150 group-aria-expanded:rotate-180" />
              </button>
              <div
                id="services-menu"
                :hidden="!servicesOpen"
                class="absolute top-[calc(100%+14px)] left-0 box-content w-[340px] rounded-sm border border-line bg-white p-2 shadow-menu"
              >
                <ul class="m-0 list-none p-0">
                  <li v-for="s in services" :key="s.href">
                    <NuxtLink
                      :to="s.href"
                      :aria-current="s.ariaCurrent"
                      class="flex items-center justify-between gap-2 rounded-sm p-3 text-label text-navy no-underline hover:bg-pale hover:text-blue aria-[current=page]:bg-pale aria-[current=page]:text-blue"
                    >{{ s.label }}</NuxtLink>
                  </li>
                  <li data-all-services class="mt-2 border-t border-line pt-2">
                    <NuxtLink
                      :to="allServicesHref"
                      class="flex items-center justify-between gap-2 rounded-sm p-3 text-label text-blue no-underline hover:bg-pale"
                    >{{ t('nav.allServices') }}<Glyph name="arrow" :size="16" /></NuxtLink>
                  </li>
                </ul>
              </div>
            </template>
            <NuxtLink
              v-else
              :to="item.href"
              :class="[navLink, item.current && ['is-current', currentUnderline]]"
              :aria-current="item.ariaCurrent"
            >{{ item.label }}</NuxtLink>
          </li>
        </ul>
      </nav>

      <div data-header-cta class="ml-auto mr-[76px] shrink-0 @max-[959.98px]:hidden">
        <Button to="/contact" size="sm">{{ t('cta.discussProject') }}</Button>
      </div>

      <button
        id="menu-button"
        type="button"
        data-menu-button
        class="ml-auto hidden h-11 w-11 cursor-pointer items-center justify-center rounded-sm border border-line bg-white text-navy @max-[959.98px]:inline-flex"
        :aria-expanded="menuOpen"
        aria-controls="mobile-menu"
        @click="menuOpen = !menuOpen"
      >
        <Glyph :name="menuOpen ? 'close' : 'menu'" :size="22" />
        <span class="sr-only">{{ menuOpen ? t('nav.closeMenu') : t('nav.openMenu') }}</span>
      </button>
    </div>

    <!-- Over the right end of the bar (absolute, offsets from the canvas); owns its own open/close behaviour. -->
    <LanguageSwitcher v-model:open="langOpen" />

    <!-- In the document flow below the bar: opening it pushes the page content down. -->
    <div
      id="mobile-menu"
      :hidden="!menuOpen"
      class="box-border border-t border-line bg-white px-4 pt-2 pb-6"
      :class="menuOpen ? 'hidden @max-[959.98px]:block' : 'hidden'"
    >
      <nav :aria-label="t('nav.label')">
        <ul class="m-0 mb-6 list-none p-0">
          <li v-for="item in items" :key="item.href">
            <NuxtLink
              :to="item.href"
              :aria-current="item.ariaCurrent"
              :class="[mobileLink, item.current ? 'is-current text-blue' : 'text-navy']"
            >{{ item.label }}</NuxtLink>
            <ul v-if="item.isServices" class="m-0 list-none border-b border-line py-2 pr-0 pl-4">
              <li v-for="s in services" :key="s.href">
                <NuxtLink
                  :to="s.href"
                  :aria-current="s.ariaCurrent"
                  class="flex items-center gap-2 py-2 text-[15px]/[22px] font-medium text-slate no-underline"
                >{{ s.label }}</NuxtLink>
              </li>
              <li data-all-services>
                <NuxtLink
                  :to="allServicesHref"
                  class="flex items-center gap-2 py-2 text-[15px]/[22px] font-semibold text-blue no-underline"
                >{{ t('nav.allServices') }}<Glyph name="arrow" :size="16" /></NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <Button to="/contact" block data-mobile-cta>{{ t('cta.discussProject') }}</Button>
    </div>
  </header>
</template>
