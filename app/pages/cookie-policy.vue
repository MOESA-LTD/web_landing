<script setup lang="ts">
import { CONSENT_COOKIE } from '~/composables/useConsent'

/**
 * Cookie Policy (EN `/cookie-policy`, TR `/tr/cerez-politikasi`): CookiePolicy.dc.html. The full approved
 * cookie-policy.md as a draft LegalPage, then the md's final CTA.
 * - "Cookie inventory" keeps its OPEN note (the final table is still open) and lists the one cookie the site sets
 *   today: `moesa_consent`, strictly necessary, 180 days.
 * - The in-page CookieConsent settings panel (expanded, max 640, as in the canvas) is always shown here, so a
 *   choice can be made or changed whether or not the global banner is enabled.
 */
const { t } = useI18n()
const page = useContent('cookie-policy')
usePageSeo(page.meta)

const inventory = computed(() => [
  { term: t('cookie.inventory.name'), value: CONSENT_COOKIE, code: true },
  { term: t('cookie.inventory.category'), value: t('cookie.strictlyNecessary') },
  { term: t('cookie.inventory.purpose'), value: t('cookie.inventory.consentPurpose') },
  { term: t('cookie.inventory.duration'), value: t('cookie.inventory.consentDuration') },
])
</script>

<template>
  <div>
    <LegalPage :content="page">
      <template #section-end="{ id }">
        <div v-if="id === 'inventory'" data-cookie-inventory class="grid gap-2 rounded-sm border border-line px-4 py-3">
          <p class="m-0 text-body-sm font-semibold text-navy">{{ t('cookie.inventory.caption') }}</p>
          <dl class="m-0 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 text-body-sm">
            <template v-for="row in inventory" :key="row.term">
              <dt class="font-semibold text-navy">{{ row.term }}</dt>
              <dd class="m-0 text-slate">
                <code v-if="row.code" class="font-mono text-[14px] text-navy">{{ row.value }}</code>
                <template v-else>{{ row.value }}</template>
              </dd>
            </template>
          </dl>
        </div>
      </template>
      <template #after>
        <div class="mt-16 max-w-[640px]">
          <CookieConsent mode="panel" />
        </div>
      </template>
    </LegalPage>
    <FinalCTA :content="page.finalCta" />
  </div>
</template>
