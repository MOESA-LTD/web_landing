import type { LegalContent } from '../en/legal'

/**
 * From content/approved/tr/legal-notice.md, plus the translations listed in ./unreviewed.ts.
 * The draft notes were rewritten after the legal review of 2026-11-01, in step with EN, and the register labels are
 * Turkish: those strings are listed in ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md), as are the removed package
 * strings. Legal pages stay drafts until legal review.
 */
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
        'MOESA LTD.',
        '1 Petyofi Str., Plovdiv 4000, Bulgaria',
        'Şirket sicil no (EIK): 207200475',
        'KDV no: BG207200475',
        'OPEN / AÇIK - Hukuki şekil (EOOD veya OOD) ve Bulgaristan Tescil Ajansı Ticaret Sicili’ndeki kayıt teyit edilecek.',
      ],
    },
    {
      id: 'contact',
      title: 'İletişim',
      condensed: 'info@moesaltd.com | +359 88 501 661',
      paragraphs: [
        'E-posta: info@moesaltd.com',
        'Telefon: +359 88 501 661',
        'OPEN / AÇIK - Telefon numarası teyit edilecek.',
      ],
    },
    {
      id: 'representative',
      title: 'Yasal temsilci',
      paragraphs: [
        'OPEN / AÇIK - Genel müdür (upravitel) teyit edilecek.',
      ],
    },
    {
      id: 'externalLinks',
      title: 'Harici bağlantılar',
      paragraphs: [
        'MOESA, üçüncü tarafların kontrolündeki harici web sitelerinin içeriğinden sorumlu değildir.',
      ],
    },
    {
      id: 'intellectualProperty',
      title: 'Fikri mülkiyet',
      paragraphs: [
        'Web sitesinin içeriği, tasarımı ve marka varlıkları, uygulanacak hukukun izin verdiği durumlar dışında izinsiz çoğaltılamaz.',
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
