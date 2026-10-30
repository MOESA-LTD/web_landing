import type { LegalContent } from '../en/legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/privacy-policy.md, plus the translations listed in ./unreviewed.ts. Legal pages stay drafts until legal review. */
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
      id: 'controller',
      title: 'Veri sorumlusu',
      paragraphs: [
        'MOESA LTD.',
        '1 Petyofi Str., Plovdiv 4000, Bulgaria',
        'E-posta: info@moesaltd.com',
      ],
    },
    {
      id: 'dataCollected',
      title: 'Kapsam',
      condensed: 'Form verileri; dosyalar; teknik loglar; analytics/cookie verileri varsa; iş yazışmaları.',
      items: [
        'İletişim formu verileri',
        'Kullanıcıların gönderdiği dosyalar',
        'Teknik sunucu kayıtları',
        'Etkinleştirilmişse çerez ve analitik verileri',
        'İş yazışmaları',
      ],
    },
    {
      id: 'purposes',
      title: 'Amaçlar',
      items: [
        'Taleplere yanıt vermek',
        'Olası bir iş ilişkisini hazırlamak ve yönetmek',
        'Web sitesinin güvenliği ve işletilmesi',
        'Yasal yükümlülükler ve kayıt tutma yükümlülükleri',
        'Yalnızca hukuka uygun şekilde uygulanırsa analitik',
      ],
    },
    {
      id: 'legalBases',
      title: 'Hukuki dayanaklar',
      paragraphs: [
        'OPEN / AÇIK - Nihai hukuki dayanaklar her işleme faaliyeti için hukuk danışmanıyla teyit edilmelidir.',
      ],
    },
    {
      id: 'recipients',
      title: 'Alıcılar ve veri işleyenler',
      paragraphs: [
        'OPEN / AÇIK - Teknik altyapı kesinleştikten sonra hosting sağlayıcısını, form sağlayıcısını, e-posta sağlayıcısını, analitik araçlarını, CRM’i ve diğer veri işleyenleri ekleyin.',
      ],
    },
    {
      id: 'transfers',
      title: 'Uluslararası aktarımlar',
      paragraphs: [
        'OPEN / AÇIK - Herhangi bir sağlayıcının verileri EEA dışında işleyip işlemediğini teyit edin ve aktarım mekanizmasını belgeleyin.',
      ],
    },
    {
      id: 'retention',
      title: 'Saklama süreleri',
      paragraphs: [
        'OPEN / AÇIK - Talepler, dosyalar, kayıtlar, analitik verileri ve iş yazışmaları için saklama sürelerini tanımlayın.',
      ],
    },
    {
      id: 'rights',
      title: 'İlgili kişi hakları',
      items: [
        'Erişim',
        'Düzeltme',
        'Silme',
        'İşlemenin kısıtlanması',
        'İtiraz',
        'Uygulanabildiği durumlarda veri taşınabilirliği',
        'Yetkili denetim makamına şikâyet',
      ],
    },
    {
      id: 'security',
      title: 'Güvenlik',
      paragraphs: [
        'Uygun teknik ve organizasyonel önlemler alın. Nihai ifade gerçek sistemle uyumlu olmalıdır.',
      ],
    },
    {
      id: 'privacyContact',
      title: 'Gizlilik talepleri için iletişim',
      paragraphs: [
        'info@moesaltd.com',
      ],
    },
    {
      id: 'updates',
      title: 'Politika güncellemeleri',
      paragraphs: [
        'Yürürlük tarihini belirtin ve hizmetler veya yasal gereklilikler değiştiğinde politikanın güncellenebileceğini açıklayın.',
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
