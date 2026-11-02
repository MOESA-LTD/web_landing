import type { ServicesContent } from '../en/services'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/services.md, plus the translations listed in ./unreviewed.ts. */
const content: ServicesContent = {
  meta: {
    path: '/services',
    title: 'Hizmetler | MOESA Ltd.',
    description: 'Tek bir ihtiyaca yönelik hizmet alın veya uzun vadeli bir operasyonda birden fazla hizmeti bağlayın.',
  },
  hero: {
    title: 'Bağlantılı uluslararası ürün ve ticaret hizmetleri.',
    body: 'Tek bir ihtiyaca yönelik hizmet alın veya uzun vadeli bir operasyonda birden fazla hizmeti bağlayın.',
  },
  services: [
    {
      slug: 'sourcing-managed-procurement',
      title: 'Tedarik ve Yönetilen Satın Alma',
      summary: 'Marka/ürün tedariki, üretici ve tedarikçi bulma, ticari görüşme, satın alma ve sürekli satın alma yönetimi.',
      items: [
        'Belirli bir marka veya ürün için sourcing',
        'Alternatif supplier geliştirme',
        'Dış kaynaklı satın alma kapasitesi',
        'Supplier ve PO yönetimi',
      ],
    },
    {
      slug: 'product-private-label-development',
      title: 'Ürün ve Private Label Geliştirme',
      summary: 'Ürün konsepti, ürün ailesi, teknik gereklilikler, varyantlar, ambalaj, kalite/uygunluk koordinasyonu ve üretime hazırlık.',
      items: [
        'Bireysel ürünler',
        'Private-label portföyler',
        'Mevcut ürünlerin uyarlanması',
        'Ürün iyileştirme ve supplier geçişi',
      ],
    },
    {
      slug: 'market-access-commercial-representation',
      title: 'Pazara Giriş ve Ticari Temsil',
      summary: 'Avrupa pazar hazırlığı, ticari temsil, distribütör/perakendeci ilişkileri, kanal geliştirme ve yerel operasyon.',
      items: [
        'Avrupa pazarına giriş',
        'Ticari temsil',
        'Distribütör ve perakendeci ağı geliştirme',
        'Uluslararası alıcı temsili',
      ],
    },
    {
      slug: 'operations-supply-chain',
      title: 'Operasyon ve Tedarik Zinciri',
      summary: 'Satın alma, üretim takibi, dokümantasyon, uluslararası lojistik, ithalat, depo, stok ve teslimat.',
      items: [
        'Tek sipariş koordinasyonu',
        'Tekrarlayan üretim ve lojistik',
        'Çoklu supplier operasyonları',
        'Stok ve replenishment koordinasyonu',
      ],
    },
    {
      slug: 'digital-commerce-commercial-intelligence',
      title: 'Dijital Ticaret ve Ticari İçgörü',
      summary: 'Konumlandırma, creative koordinasyonu, SEO, listing, katalog, marketplace/D2C, stok, raporlama ve müşteri içgörüsü.',
      items: [
        'Dijital lansman hazırlığı',
        'Katalog ve içerik operasyonları',
        'Yönetilen marketplace veya D2C operasyonları',
        'Ticari analiz ve iyileştirme',
      ],
    },
  ],
  integrated: {
    title: 'Tek hizmet veya entegre bir görev.',
    body: 'Bir proje herhangi bir aşamadan başlayabilir. MOESA nelerin kesinleştiğini, nelerin açık kaldığını ve hangi hizmetlerin gerçekten gerektiğini belirler.',
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
