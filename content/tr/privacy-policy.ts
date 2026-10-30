import type { LegalContent } from '../en/legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/privacy-policy.md */
const content: LegalContent = {
  meta: {
    path: '/privacy-policy',
    title: 'Gizlilik Politikası | MOESA Ltd.',
    description: 'Teknik altyapı, form, hosting, analytics ve üçüncü taraflar kesinleşince güncellenecek uygulama taslağı.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Gizlilik Politikası',
    body: 'Teknik altyapı, form, hosting, analytics ve üçüncü taraflar kesinleşince güncellenecek uygulama taslağı.',
  },
  sections: [
    {
      id: 'dataCollected',
      title: 'Kapsam',
      paragraphs: [
        'Form verileri; dosyalar; teknik loglar; analytics/cookie verileri varsa; iş yazışmaları.',
      ],
    },
    {
      id: 'openFields',
      title: 'Açık alanlar',
      paragraphs: [
        'Hukuki dayanak; processors; EEA dışı transfer; retention; güvenlik; yürürlük tarihi; legal review.',
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
