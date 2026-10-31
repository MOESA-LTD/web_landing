<script setup lang="ts">
/**
 * Privacy Policy (EN `/privacy-policy`, TR `/tr/gizlilik-politikasi`): PrivacyPolicy.dc.html. The full approved
 * privacy-policy.md as a draft LegalPage (status chip, OPEN notes), then the md's final CTA. The canvas's own intro
 * and section copy are not used.
 */
const page = useContent('privacy-policy')
usePageSeo(page.meta)
</script>

<template>
  <div>
    <LegalPage :content="page" />
    <FinalCTA :content="page.finalCta" />
  </div>
</template>
