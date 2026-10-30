import type { LegalContent } from '../en/legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/cookie-policy.md */
const content: LegalContent = {
  meta: {
    path: '/cookie-policy',
    title: 'Çerez Politikası | MOESA Ltd.',
    description: 'Sitede gerçekten kullanılacak teknolojiler kesinleşince tamamlanacak uygulama taslağı.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Çerez Politikası',
    body: 'Sitede gerçekten kullanılacak teknolojiler kesinleşince tamamlanacak uygulama taslağı.',
  },
  sections: [
    {
      id: 'categories',
      title: 'Kategoriler',
      paragraphs: [
        'Zorunlu; tercih; analytics; marketing yalnızca uygulanırsa.',
      ],
    },
    {
      id: 'openFields',
      title: 'Açık alanlar',
      paragraphs: [
        'Cookie inventory; provider; amaç; süre; consent mekanizması; yürürlük tarihi; legal/technical review.',
      ],
    },
  ],
  finalCta: {
    title: 'Projeyi görüşelim.',
    body: 'İhtiyacınızı ve mevcut durumu paylaşın.',
    cta: {
      label: 'İletişime Geçin',
      href: '/contact',
    },
  },
}

export default content
