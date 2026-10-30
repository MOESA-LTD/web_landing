import type { WhoWeWorkWithContent } from '../en/who-we-work-with'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/who-we-work-with.md, plus the translations listed in ./unreviewed.ts. */
const content: WhoWeWorkWithContent = {
  meta: {
    path: '/who-we-work-with',
    title: 'Kimlerle Çalışıyoruz | MOESA Ltd.',
    description: 'Ürün, supplier, satın alma kapasitesi, private-label, pazara giriş veya sürekli ticari operasyon ihtiyacı olan şirketlerle çalışırız.',
  },
  hero: {
    title: 'Farklı iş modelleri. Tek koordineli operasyon partneri.',
    body: 'Ürün, supplier, satın alma kapasitesi, private-label, pazara giriş veya sürekli ticari operasyon ihtiyacı olan şirketlerle çalışırız.',
  },
  intro: {
    title: 'Önceden tanımlanmış bir paketle değil, iş ihtiyacıyla başlayın.',
    body: 'Bir perakende grubu, bir üretici, bir distribütör ve bir dijital ticaret işletmesi farklı ticari yapılara ihtiyaç duyabilir. MOESA müşterinin hedefiyle başlar ve uygun çalışma modelini bu hedef etrafında yapılandırır.',
  },
  audiences: [
    {
      title: 'Perakende Grupları ve Kurumsal Alıcılar',
      condensed: 'Kategori, private label, yönetilen satın alma, çoklu supplier, süreklilik, lojistik ve teslimat.',
      body: 'Perakende grupları, zincir mağaza organizasyonları, konaklama şirketleri, sağlık ve bakım kuruluşları, tesis yönetimi şirketleri, endüstriyel alıcılar, hizmet grupları ve satın alma departmanları için.',
      items: [
        'Kategori ve ürün çeşitliliği geliştirme',
        'Private-label portföyler',
        'Yönetilen satın alma',
        'Çoklu tedarikçi koordinasyonu',
        'Tedarik sürekliliği',
        'Uluslararası lojistik ve teslimat',
      ],
    },
    {
      title: 'Toptancılar ve Distribütörler',
      condensed: 'Uluslararası marka sourcing, portföy genişletme, ticari anlaşmalar, özel/private-label ürünler, satın alma, stok ve replenishment.',
      body: 'Ulusal veya bölgesel distribütörler, kategori uzmanları, ithalatçılar, B2B tedarikçiler, cash-and-carry işletmecileri ve çok markalı portföy işletmeleri için.',
      items: [
        'Uluslararası marka tedariki',
        'Portföy genişletme',
        'Ticari ve bölge anlaşmaları',
        'Münhasır veya kendi markalı ürünler',
        'Satın alma ve lojistik',
        'Stok ve ikmal',
      ],
    },
    {
      title: 'Markalar ve Marka Sahipleri',
      condensed: 'Ürün/portföy geliştirme, üretici, ambalaj, konumlandırma, commerce operasyonları ve müşteri geri bildirimi.',
      body: 'Köklü markalar, yeni marka sahipleri, private-label işletmeleri, marketplace’te doğan markalar, D2C markaları ve kurumsal şirketlere ait ürün markaları için.',
      items: [
        'Yeni ürün ve kategori geliştirme',
        'Ürün ailesi mimarisi',
        'Tedarikçi ve üretici koordinasyonu',
        'Ambalaj ve konumlandırma',
        'Ticari operasyonlar',
        'Müşteri geri bildirimi ve portföy iyileştirme',
      ],
    },
    {
      title: 'Üreticiler',
      condensed: 'Avrupa pazara giriş, distribütör/perakendeci, ticari temsil, pazar uyarlaması, ithalat/depo ve yerel operasyon.',
      body: 'Avrupa’da alıcı veya operasyon arayan nihai ürün üreticileri, OEM ve private-label üreticileri, bileşen tedarikçileri ve ihracat odaklı üreticiler için.',
      items: [
        'Avrupa pazarına giriş',
        'Distribütör ve perakendeci geliştirme',
        'Ticari temsil',
        'Pazara özel portföy hazırlığı',
        'İthalat, depolama ve yerel operasyonlar',
      ],
    },
    {
      title: 'Dijital Ticaret İşletmeleri',
      condensed: 'Ürün/private label, listing/katalog, marketplace/D2C, stok/replenishment, performans ve müşteri içgörüsü.',
      body: 'Amazon üzerinde faaliyet gösteren işletmeler, çoklu marketplace işletmeleri, D2C markaları, online perakendeciler, omnichannel şirketler ve sınır ötesi e-ticaret işletmecileri için.',
      items: [
        'Ürün tedariki ve private label',
        'Listing ve katalog operasyonları',
        'Marketplace ve D2C yönetimi',
        'Stok ve ikmal',
        'Performans ve müşteri içgörüsü',
      ],
    },
  ],
  seekingBrands: {
    title: 'Uluslararası marka arayan alıcılar',
    body: 'Müşteri satın almak istediği markayı veya ürünü zaten biliyor olabilir. MOESA ilgili ticari tarafı belirler, iletişimi başlatır ve tedarik, görüşme ve satın alma süreçlerini koordine eder.',
  },
  noInternalProcurement: {
    title: 'Dış kaynaklı satın alma',
    body: 'Tam bir iç satın alma departmanı kurmadan tanımlı bir kapsamda dış operasyon kapasitesi.',
  },
  selectionGuide: {
    title: 'Çalışma modeli seçim rehberi',
    rows: [
      {
        need: 'Belirli bir marka veya tedarikçiye ihtiyacınız var',
        target: 'Tedarik ve Yönetilen Satın Alma',
        service: 'sourcing-managed-procurement',
      },
      {
        need: 'Kendi markanız altında bir ürün veya kategoriye ihtiyacınız var',
        target: 'Ürün ve Private Label Geliştirme',
        service: 'product-private-label-development',
      },
      {
        need: 'Avrupalı alıcılara veya yerel temsile ihtiyacınız var',
        target: 'Pazara Giriş ve Ticari Temsil',
        service: 'market-access-commercial-representation',
      },
      {
        need: 'Üretim, lojistik, stok veya teslimat koordinasyonuna ihtiyacınız var',
        target: 'Operasyon ve Tedarik Zinciri',
        service: 'operations-supply-chain',
      },
      {
        need: 'Marketplace, D2C, katalog veya performans yönetimine ihtiyacınız var',
        target: 'Dijital Ticaret ve Ticari İçgörü',
        service: 'digital-commerce-commercial-intelligence',
      },
      {
        need: 'Birbirine bağlı birden fazla fonksiyona ihtiyacınız var',
        target: 'Entegre Operasyon Partnerliği',
      },
    ],
  },
  notSure: {
    title: 'Henüz emin değil misiniz?',
    body: 'İş sorununu, mevcut durumu ve istenen sonucu anlatın. MOESA, projeyi gereksiz bir hizmet paketine zorlamadan doğru başlangıç noktasını belirlemenize yardımcı olabilir.',
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
