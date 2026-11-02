<script setup lang="ts">
import { LEGAL_UPDATED } from '#content/en/legal'

/**
 * Privacy Policy (EN `/privacy-policy`, TR `/tr/gizlilik-politikasi`): PrivacyPolicy.dc.html. The privacy-policy.md
 * as a draft LegalPage (rewritten after the legal review, see content/legal-revisions.ts; status chip, OPEN notes for
 * missing owner facts), a "See also" link to the Cookie Policy, then the md's final CTA. The canvas's own intro and
 * section copy are not used.
 */
const { t } = useI18n()
const page = useContent('privacy-policy')
usePageSeo(page.meta)
</script>

<template>
  <div>
    <LegalPage
      :content="page"
      :updated="LEGAL_UPDATED['privacy-policy']"
      :related="{ label: t('footer.legal.cookiePolicy'), href: '/cookie-policy' }"
    />
    <FinalCTA :content="page.finalCta" />
  </div>
</template>
