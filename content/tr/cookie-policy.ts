import type { LegalContent } from '../en/legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/cookie-policy.md, plus the translations listed in ./unreviewed.ts. Legal pages stay drafts until legal review. */
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
      condensed: 'Zorunlu; tercih; analytics; marketing yalnızca uygulanırsa.',
      items: [
        'Zorunlu',
        'Tercihler',
        'Analitik',
        'Pazarlama - yalnızca uygulanırsa',
      ],
    },
    {
      id: 'consentModel',
      title: 'Onay modeli',
      paragraphs: [
        'Onayın yasal olarak gerekli olduğu durumlarda zorunlu olmayan çerezler geçerli onaydan önce etkinleştirilmemelidir. Kullanıcılar tercihlerini reddedebilmeli ve daha sonra değiştirebilmelidir.',
      ],
    },
    {
      id: 'inventory',
      title: 'Çerez envanteri',
      paragraphs: [
        'OPEN / AÇIK - Hosting, analitik, gömülü medya, formlar ve üçüncü taraf hizmetler seçildikten sonra nihai çerez tablosunu oluşturun.',
      ],
    },
    {
      id: 'thirdParties',
      title: 'Üçüncü taraf hizmetler',
      paragraphs: [
        'OPEN / AÇIK - Her üçüncü taraf sağlayıcıyı, amacını, çerez süresini ve gizlilik bağlantısını listeleyin.',
      ],
    },
    {
      id: 'managing',
      title: 'Çerezlerin yönetimi',
      paragraphs: [
        'Tarayıcı kontrollerini ve web sitesinin onay tercihi mekanizmasını açıklayın.',
      ],
    },
    {
      id: 'effectiveDate',
      title: 'Yürürlük tarihi',
      paragraphs: [
        'OPEN / AÇIK - Yayın tarihini ekleyin.',
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
