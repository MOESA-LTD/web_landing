import type { ServicesContent } from '../en/services'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/services.md */
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
    },
    {
      slug: 'product-private-label-development',
      title: 'Ürün ve Private Label Geliştirme',
      summary: 'Ürün konsepti, ürün ailesi, teknik gereklilikler, varyantlar, ambalaj, kalite/uygunluk koordinasyonu ve üretime hazırlık.',
    },
    {
      slug: 'market-access-commercial-representation',
      title: 'Pazara Giriş ve Ticari Temsil',
      summary: 'Avrupa pazar hazırlığı, ticari temsil, distribütör/perakendeci ilişkileri, kanal geliştirme ve yerel operasyon.',
    },
    {
      slug: 'operations-supply-chain',
      title: 'Operasyon ve Tedarik Zinciri',
      summary: 'Satın alma, üretim takibi, dokümantasyon, uluslararası lojistik, ithalat, depo, stok ve teslimat.',
    },
    {
      slug: 'digital-commerce-commercial-intelligence',
      title: 'Dijital Ticaret ve Ticari İçgörü',
      summary: 'Konumlandırma, creative koordinasyonu, SEO, listing, katalog, marketplace/D2C, stok, raporlama ve müşteri içgörüsü.',
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
