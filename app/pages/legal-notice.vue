<script setup lang="ts">
/**
 * Legal Notice (EN `/legal-notice`, TR `/tr/yasal-bildirim`): LegalNotice.dc.html. The full approved
 * legal-notice.md (including Content responsibility, External links and Intellectual property, which the canvas
 * drops) as a draft LegalPage, then the md's final CTA.
 */
const page = useContent('legal-notice')
usePageSeo(page.meta)
</script>

<template>
  <div>
    <LegalPage :content="page" />
    <FinalCTA :content="page.finalCta" />
  </div>
</template>
