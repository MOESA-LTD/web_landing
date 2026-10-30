import type { ServicePageContent } from '../../en/service-page'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/services__operations-supply-chain.md, plus the translations listed in ../unreviewed.ts. */
const content: ServicePageContent = {
  meta: {
    path: '/services/operations-supply-chain',
    title: 'Operasyon ve Tedarik Zinciri | MOESA Ltd.',
    description: 'Satın alma, üretim, ürün ve belge koordinasyonu, uluslararası lojistik, ithalat, depo, stok ve teslimat operasyonlarını tek akışta bağlarız.',
  },
  slug: 'operations-supply-chain',
  hero: {
    title: 'Satın alma siparişinden varış noktasına.',
    body: 'Satın alma, üretim, ürün ve belge koordinasyonu, uluslararası lojistik, ithalat, depo, stok ve teslimat operasyonlarını tek akışta bağlarız.',
  },
  intro: {
    title: 'Ticari bir anlaşma yine de operasyonel uygulama gerektirir.',
    body: 'Ürün, tedarikçi ve satın alma koşulları kararlaştırıldıktan sonra proje üretim, dokümantasyon, sevkiyat, ithalat, depolama ve teslimat aşamalarından geçmelidir. MOESA bu aşamaları tek bir operasyon görünümünde birleştirir.',
  },
  typicalMandates: {
    title: 'Tipik görevler',
    condensed: 'Satın alma sonrası üretim; uluslararası teslimat; ithalat/depo yapısı; tekrarlayan tedarik; çoklu supplier koordinasyonu.',
    items: [
      'Satın alma sonrasında üretimi yönetmek',
      'Uluslararası teslimatı koordine etmek',
      'İthalat ve depolama yapısı kurmak',
      'Tekrarlayan tedarik operasyonlarını yönetmek',
      'Birden fazla tedarikçiyi konsolide etmek',
    ],
  },
  manages: {
    title: 'MOESA neyi yönetir?',
    condensed: 'Ticari devir; PO; üretim takibi; kalite ve belge koordinasyonu; sevkiyat hazırlığı; lojistik; ithalat/gümrük akışı; depo; stok/replenishment; final teslimat.',
    items: [
      'Ticari devir',
      'Satın alma siparişi koordinasyonu',
      'Üretim planlama ve takibi',
      'Kalite ve dokümantasyon koordinasyonu',
      'Sevkiyata hazırlık',
      'Uluslararası lojistik',
      'İthalat ve gümrük koordinasyonu',
      'Depolama ve mal kabul operasyonları',
      'Stok ve ikmal koordinasyonu',
      'Final teslimat',
    ],
  },
  flow: {
    title: 'Uçtan uca operasyon akışı',
    steps: [
      'Ticari Onay',
      'Satın Alma Siparişi',
      'Üretim',
      'Ürün ve Belge Kontrolleri',
      'Sevkiyata Hazırlık',
      'Uluslararası Lojistik',
      'İthalat Koordinasyonu',
      'Depolama',
      'Stok',
      'Teslimat',
    ],
  },
  visibility: {
    title: 'Görünürlük',
    condensed: 'Mevcut durum; sonraki kilometre taşı; açık kararlar; müşteri ve supplier aksiyonları; risk/gecikme; belgeler.',
    items: [
      'Mevcut durum',
      'Sonraki kilometre taşı',
      'Açık kararlar',
      'Müşteriden beklenen aksiyon',
      'Tedarikçi aksiyonu',
      'Risk veya gecikme',
      'Tahmini tamamlanma',
      'Destekleyici belgeler',
    ],
  },
  exceptions: {
    title: 'İstisna yönetimi',
    body: 'MOESA olguları, sorumlu tarafları, iletişimi, eskalasyonu, kararları ve düzeltici takibi koordine eder. Üçüncü taraflardan kaynaklanan gecikme veya kayıplara karşı garanti verilemez.',
  },
  legalBoundary: {
    title: 'Hukuki rol sınırı',
    body: 'MOESA otomatik olarak importer, customs declarant, responsible economic operator veya sözleşmeli alıcı rolünü üstlenmez; roller işlem bazında tanımlanır.',
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
