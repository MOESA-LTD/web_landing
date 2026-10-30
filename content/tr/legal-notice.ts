import type { LegalContent } from '../en/legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/legal-notice.md */
const content: LegalContent = {
  meta: {
    path: '/legal-notice',
    title: 'Yasal Bildirim | MOESA Ltd.',
    description: 'MOESA Ltd. kayıtlı şirket ve site işletmecisi bilgileri.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Yasal Bildirim',
    body: 'MOESA Ltd. kayıtlı şirket ve site işletmecisi bilgileri.',
  },
  sections: [
    {
      id: 'operator',
      title: 'Şirket',
      paragraphs: [
        'MOESA LTD. | 1 Petyofi Str., Plovdiv 4000, Bulgaria | Company ID 207200475 | VAT BG207200475',
      ],
    },
    {
      id: 'contact',
      title: 'İletişim',
      paragraphs: [
        'info@moesaltd.com | +359 88 501 661',
      ],
    },
    {
      id: 'openFields',
      title: 'Açık alanlar',
      paragraphs: [
        'Yasal temsilci ve ülke bazlı zorunlu metinler yayından önce doğrulanmalı.',
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
