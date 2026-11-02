<script setup lang="ts">
import { LEGAL_UPDATED } from '#content/en/legal'

/**
 * Legal Notice (EN `/legal-notice`, TR `/tr/yasal-bildirim`): LegalNotice.dc.html. The legal-notice.md (including
 * External links and Intellectual property, which the canvas drops; rewritten after the legal review, see
 * content/legal-revisions.ts) as a draft LegalPage, then the md's final CTA.
 */
const page = useContent('legal-notice')
usePageSeo(page.meta)
</script>

<template>
  <div>
    <LegalPage :content="page" :updated="LEGAL_UPDATED['legal-notice']" />
    <FinalCTA :content="page.finalCta" />
  </div>
</template>
