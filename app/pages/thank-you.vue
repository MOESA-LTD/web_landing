<script setup lang="ts">
import { brand } from '#content/site'

/**
 * Thank you (EN `/thank-you`, TR `/tr/tesekkurler`): ThankYou.dc.html. `MessageState` with the approved thank-you.md
 * copy (h1, lead, "What happens next", "Need to add information?"), then the approved final CTA on navy instead of
 * the canvas's in-message actions: Explore Services (EN; TR: its own approved CTA) plus a secondary Home link,
 * the canvas's "Return Home" action. Reached after a form post only, so it is noindex (here and in routeRules).
 */
const { t } = useI18n()
const page = useContent('thank-you')

usePageSeo(page.meta)
useHead({ meta: [{ name: 'robots', content: 'noindex, follow' }] })

const finalCta = { ...page.finalCta, secondary: { label: t('nav.home'), href: '/' } }
</script>

<template>
  <div>
    <MessageState
      kind="thanks"
      :title="page.hero.title"
      :body="page.hero.body"
      :list-title="page.next.title"
      :steps="page.next.items ?? []"
      :condensed="page.next.condensed"
      :info="page.info"
      :email="brand.email"
    />
    <FinalCTA :content="finalCta" />
  </div>
</template>
