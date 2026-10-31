<script setup lang="ts">
import type { NuxtError } from '#app'
import type { Cta } from '#content/types'
import { buildPageSeo } from '~~/i18n/seo'
import { errorLocale } from '~/utils/error-locale'

/**
 * Error page, inside the default layout (header, `<main id="main">`, footer).
 * - 404 (NotFound.dc.html): `MessageState kind="notFound"` with the approved 404.md copy in the locale of the
 *   requested path (`/tr/*` → TR, everything else EN), the "Continue from here" link list, then the approved
 *   final CTA. The response keeps its HTTP 404 status (Nuxt sets it for unmatched routes and `createError`s).
 * - Any other status: a generic message (`error.*` microcopy) with a Home link; no internals are shown.
 * No canonical or hreflang alternates (404 is not a route, see buildPageSeo), and noindex.
 */
const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const route = useRoute()
const { enableTr } = useRuntimeConfig().public

const requestPath = (() => {
  const raw = props.error?.url || route.path || '/'
  try {
    return new URL(raw, 'http://localhost').pathname
  } catch {
    return route.path
  }
})()
const locale = errorLocale(requestPath, { enableTr: enableTr !== false })
const statusCode = Number(props.error?.statusCode) || 500
const is404 = statusCode === 404

const page = useContent('404', locale)
const LINK_TARGETS = ['/', '/services', '/how-we-work', '/contact']
const links: Cta[] = (page.next.items ?? []).map((label, i) => ({ label, href: LINK_TARGETS[i] ?? '/' }))

const head = is404
  ? buildPageSeo(page.meta, locale, { enableTr: enableTr !== false })
  : { title: `${t('error.title')} | MOESA Ltd.`, htmlAttrs: { lang: locale }, meta: [], link: [] }
useHead({
  ...(head as Parameters<typeof useHead>[0] & object),
  meta: [...head.meta, { name: 'robots', content: 'noindex, follow' }],
})
</script>

<template>
  <NuxtLayout>
    <div>
      <MessageState
        v-if="is404"
        kind="notFound"
        :title="page.hero.title"
        :body="page.hero.body"
        :list-title="page.next.title"
        :condensed="page.next.condensed"
        :links="links"
      />
      <MessageState
        v-else
        kind="notFound"
        :code="String(statusCode)"
        :title="t('error.title')"
        :body="t('error.body')"
        :actions="[{ label: t('nav.home'), href: '/' }]"
      />
      <FinalCTA v-if="is404" :content="page.finalCta" />
    </div>
  </NuxtLayout>
</template>
