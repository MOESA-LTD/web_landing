<script setup lang="ts">
import { routeNameForLocalePath } from '~~/i18n/routes'

/**
 * Default layout: skip link, language bar, header, `<main id="main">`, footer. The footer CTA shows on
 * Home and About only (DESIGN_NOTES §3.2), in both locales.
 */
const { t } = useI18n()
const route = useRoute()
const showCta = computed(() => {
  const name = routeNameForLocalePath(route.path)
  return name === 'home' || name === 'about'
})
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-sm focus:bg-navy focus:px-4 focus:py-3 focus:text-label focus:text-white focus:no-underline focus:[--focus-ring:var(--color-cyan)]"
    >{{ t('skipLink') }}</a>
    <LanguageSwitcher />
    <SiteHeader />
    <main id="main" tabindex="-1" class="flex-1 focus:outline-none">
      <slot />
    </main>
    <SiteFooter :show-cta="showCta" />
  </div>
</template>
