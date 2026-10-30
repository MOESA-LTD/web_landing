import type { ServicePageContent } from '../../en/service-page'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/services__product-private-label-development.md */
const content: ServicePageContent = {
  meta: {
    path: '/services/product-private-label-development',
    title: 'Ürün ve Private Label Geliştirme | MOESA Ltd.',
    description: 'Bireysel ürünleri ve komple private-label portföyleri; ticari hedef, ürün mimarisi, supplier, teknik hazırlık, ambalaj ve üretime hazırlıkla bağlarız.',
  },
  slug: 'product-private-label-development',
  hero: {
    title: 'Kategori fırsatından pazara hazır ürüne.',
    body: 'Bireysel ürünleri ve komple private-label portföyleri; ticari hedef, ürün mimarisi, supplier, teknik hazırlık, ambalaj ve üretime hazırlıkla bağlarız.',
  },
  typicalMandates: {
    title: 'Tipik görevler',
    body: 'Yeni private-label ürün; ürün ailesi; üretici standardı ürünün uyarlanması; mevcut ürünün iyileştirilmesi; belirli satış kanalına ürün geliştirme.',
  },
  manages: {
    title: 'MOESA neyi yönetir?',
    body: 'Ticari/ürün briefi; kategori ve pazar değerlendirmesi; ürün mimarisi; üretici seçimi; teknik hazırlık; numune turları; QA/uygunluk koordinasyonu; ambalaj; fizibilite; üretime hazırlık.',
  },
  architecture: {
    title: 'Ürün mimarisi',
    steps: [
      'Kategori',
      'Ürün Ailesi',
      'Marka/Kalite Seviyesi',
      'Model',
      'Malzeme/Tasarım',
      'Ölçü',
      'Paket Adedi',
      'Pazar Statüsü.',
    ],
  },
  openFacts: {
    title: 'Temel kural',
    body: 'Doğrulanmamış teknik bilgi, belgeyi veya listingi tamamlamak için varsayıma dönüştürülmez; açık gereklilik olarak kalır.',
  },
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
