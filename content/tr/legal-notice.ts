import type { LegalContent } from '../en/legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/legal-notice.md, plus the translations listed in ./unreviewed.ts. Legal pages stay drafts until legal review. */
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
      condensed: 'MOESA LTD. | 1 Petyofi Str., Plovdiv 4000, Bulgaria | Company ID 207200475 | VAT BG207200475',
      paragraphs: [
        'MOESA LTD.',
        '1 Petyofi Str., Plovdiv 4000, Bulgaria',
        'Company ID 207200475',
        'VAT BG207200475',
      ],
    },
    {
      id: 'contact',
      title: 'İletişim',
      condensed: 'info@moesaltd.com | +359 88 501 661',
      paragraphs: [
        'E-posta: info@moesaltd.com',
        'Telefon: +359 88 501 661',
      ],
    },
    {
      id: 'representative',
      title: 'Yasal temsilci',
      paragraphs: [
        'OPEN / AÇIK - Yayından önce yasal temsilciyi veya genel müdürü teyit edin.',
      ],
    },
    {
      id: 'contentResponsibility',
      title: 'İçerik sorumluluğu',
      paragraphs: [
        'OPEN / AÇIK - Yayın yapılan ülkeler ve uygulanacak hukuk için gerekli ifadeyi teyit edin.',
      ],
    },
    {
      id: 'externalLinks',
      title: 'Harici bağlantılar',
      paragraphs: [
        'MOESA, üçüncü tarafların kontrolündeki harici web sitelerinin içeriğinden sorumlu değildir. Nihai ifade hukuki inceleme gerektirir.',
      ],
    },
    {
      id: 'intellectualProperty',
      title: 'Fikri mülkiyet',
      paragraphs: [
        'Web sitesinin içeriği, tasarımı ve marka varlıkları, uygulanacak hukukun izin verdiği durumlar dışında izinsiz çoğaltılamaz. Nihai ifade hukuki inceleme gerektirir.',
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
