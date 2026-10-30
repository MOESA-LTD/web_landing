/**
 * Keys of i18n/locales/{en,tr}.json whose TR value has no source in MOESA_Website_Package_v1.0/content/tr:
 * we translated them, and they are listed in i18n/UNREVIEWED_TR.md for the user to review.
 * The rendered file takes the EN and TR values from the json files, so it cannot drift from them.
 */
export const UNREVIEWED_UI_KEYS: string[] = [
  'skipLink',
  'language.label',
  // Native language names ("English", "Türkçe"), same in both locales.
  'language.names.en',
  'language.names.tr',
  // EN is the approved thank-you.md CTA; the TR thank-you.md has no counterpart.
  'cta.exploreServices',
  'nav.label',
  // Short header-only labels (user decision 2026-10-31, from the canvas draft) so the TR nav fits the bar.
  'nav.header.whoWeWorkWith',
  'nav.header.about',
  'nav.allServices',
  'nav.openMenu',
  'nav.closeMenu',
  'logo.homeLabel',
  'breadcrumbs.label',
  'breadcrumbs.allServices',
  'related.services',
  'cards.exploreService',
  // Cut from the approved TR home.md line "Yatay yetkinlik olarak Dijital Ticaret ve Ticari İçgörü".
  'cards.capability',
  'footer.companyTitle',
  'footer.email',
  'footer.phone',
  'footer.address',
  'form.labels.productCategory',
  'form.labels.targetMarket',
  'form.labels.estimatedVolume',
  'form.labels.targetTimeline',
  'form.projectDetails',
  'form.optional',
  'form.servicePlaceholder',
  'form.consent',
  'form.submit',
  'form.serviceOptions.other',
  'form.errorSummaryOne',
  'form.errorSummaryMany',
  'form.errors.name',
  'form.errors.company',
  'form.errors.workEmail',
  'form.errors.country',
  'form.errors.service',
  'form.errors.projectBrief',
  'form.errors.consent',
  'cookie.title',
  'cookie.alwaysOn',
  'cookie.preferences',
  'cookie.analytics',
  'cookie.rejectNonEssential',
  'cookie.acceptAll',
  'cookie.saveChoices',
  'cookie.chooseSettings',
  // About Experience Stat labels, cut from the approved Experience sentence (TR: "... operasyonlarının" without its case ending).
  'stats.digitalCommerce',
  'stats.ecommerceOperations',
]
