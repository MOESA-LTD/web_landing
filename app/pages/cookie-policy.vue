<script setup lang="ts">
import { CONSENT_COOKIE } from '~/composables/useConsent'
import { LEGAL_UPDATED } from '#content/en/legal'

/**
 * Cookie Policy (EN `/cookie-policy`, TR `/tr/cerez-politikasi`): CookiePolicy.dc.html. The cookie-policy.md as a
 * draft LegalPage (rewritten after the legal review, see content/legal-revisions.ts), then the md's final CTA.
 * - "Cookie inventory" is followed by the table of everything the site stores or runs on the visitor's device
 *   (legal review B2): the first-party `moesa_consent` cookie (strictly necessary, 180 days) and Cloudflare Turnstile
 *   on the contact page (third party, strictly necessary for spam protection).
 * - The in-page CookieConsent settings panel (expanded, max 640, as in the canvas) is always shown here, at
 *   `#cookie-settings`, so a choice can be made or changed whether or not the global banner is enabled.
 */
const { t } = useI18n()
const page = useContent('cookie-policy')
usePageSeo(page.meta)

const TURNSTILE_PRIVACY = 'https://www.cloudflare.com/privacypolicy/'

type Row = { term: string; value: string; code?: boolean; href?: string }
const inventory = computed<{ id: string; rows: Row[] }[]>(() => [
  {
    id: 'consent',
    rows: [
      { term: t('cookie.inventory.name'), value: CONSENT_COOKIE, code: true },
      { term: t('cookie.inventory.provider'), value: t('cookie.inventory.consentProvider') },
      { term: t('cookie.inventory.category'), value: t('cookie.strictlyNecessary') },
      { term: t('cookie.inventory.purpose'), value: t('cookie.inventory.consentPurpose') },
      { term: t('cookie.inventory.duration'), value: t('cookie.inventory.consentDuration') },
    ],
  },
  {
    id: 'turnstile',
    rows: [
      { term: t('cookie.inventory.name'), value: 'Cloudflare Turnstile' },
      { term: t('cookie.inventory.provider'), value: t('cookie.inventory.turnstileProvider') },
      { term: t('cookie.inventory.category'), value: t('cookie.strictlyNecessary') },
      { term: t('cookie.inventory.purpose'), value: t('cookie.inventory.turnstilePurpose') },
      { term: t('cookie.inventory.duration'), value: t('cookie.inventory.turnstileDuration') },
      { term: t('cookie.inventory.privacy'), value: TURNSTILE_PRIVACY, href: TURNSTILE_PRIVACY },
    ],
  },
])
</script>

<template>
  <div>
    <LegalPage
      :content="page"
      :updated="LEGAL_UPDATED['cookie-policy']"
      :related="{ label: t('footer.legal.privacyPolicy'), href: '/privacy-policy' }"
    >
      <template #section-end="{ id }">
        <div v-if="id === 'inventory'" data-cookie-inventory class="grid gap-3 rounded-sm border border-line px-4 py-3">
          <p class="m-0 text-body-sm font-semibold text-navy">{{ t('cookie.inventory.caption') }}</p>
          <dl
            v-for="(item, i) in inventory"
            :key="item.id"
            :data-cookie-item="item.id"
            class="m-0 grid grid-cols-[max-content_1fr] gap-x-6 gap-y-1 text-body-sm max-[479.98px]:grid-cols-1"
            :class="i > 0 && 'border-t border-line pt-3'"
          >
            <template v-for="row in item.rows" :key="row.term">
              <dt class="font-semibold text-navy">{{ row.term }}</dt>
              <dd class="m-0 text-slate">
                <code v-if="row.code" class="font-mono text-[14px] text-navy">{{ row.value }}</code>
                <a v-else-if="row.href" :href="row.href" rel="noopener" class="break-all text-blue underline hover:text-blue-dark">{{ row.value }}</a>
                <template v-else>{{ row.value }}</template>
              </dd>
            </template>
          </dl>
        </div>
      </template>
      <template #after>
        <div id="cookie-settings" class="mt-16 max-w-[640px] scroll-mt-24">
          <CookieConsent mode="panel" />
        </div>
      </template>
    </LegalPage>
    <FinalCTA :content="page.finalCta" />
  </div>
</template>
