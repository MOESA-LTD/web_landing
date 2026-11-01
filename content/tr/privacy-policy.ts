import type { LegalContent } from '../en/legal'

/**
 * From MOESA_Website_Package_v1.0/content/tr/privacy-policy.md, plus the translations listed in ./unreviewed.ts.
 * The draft sections were rewritten after the legal review of 2026-11-01, in step with EN: those strings are listed in
 * ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md), as are the removed package strings. Legal pages stay drafts until
 * legal review.
 */
const content: LegalContent = {
  meta: {
    path: '/privacy-policy',
    title: 'Gizlilik Politikası | MOESA Ltd.',
    description: 'MOESA Ltd.’nin web sitesi üzerinden kişisel verileri nasıl işlediğine ilişkin bilgiler.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Gizlilik Politikası',
    body: 'Bu politika, MOESA LTD.’nin bu web sitesini ziyaret ettiğinizde veya site üzerinden bizimle iletişime geçtiğinizde kişisel verileri nasıl işlediğini açıklar.',
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
      items: [
        'İletişim formu verileri: ad, şirket, iş e-postası, ülke, ilgilenilen hizmet ve proje özeti; paylaşmanız hâlinde ürün kategorisi, hedef pazar, tahmini hacim ve hedef takvim',
        'Teknik veriler: sunucu kayıtlarında ve spam koruması için IP adresi, tarayıcı bilgisi (user agent) ve istek zamanı',
        'İş yazışmaları',
      ],
      paragraphs: [
        'Analitik veya reklam araçları kullanmıyoruz.',
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
      ],
    },
    {
      id: 'legalBases',
      title: 'Hukuki dayanaklar',
      paragraphs: [
        'Talep verilerini, talebinize yanıt vermek ve olası bir sözleşme öncesinde gerekli adımları atmak için (GDPR md. 6(1)(b)) ve iş taleplerine yanıt vermeye yönelik meşru menfaatimize dayanarak (GDPR md. 6(1)(f)) işleriz.',
        'Sunucu kayıtları, spam koruması (Cloudflare Turnstile) ve istek sınırlaması, güvenli bir web sitesi işletmeye yönelik meşru menfaatimize dayanır (GDPR md. 6(1)(f)).',
        'Mevzuatın kayıt tutmamızı gerektirdiği durumlarda bunu yasal yükümlülüklerimizi yerine getirmek için yaparız (GDPR md. 6(1)(c)).',
        'Ayrı onayınız olmadan bilgilerinizi pazarlama amacıyla kullanmayız.',
      ],
    },
    {
      id: 'recipients',
      title: 'Alıcılar ve veri işleyenler',
      items: [
        'Vercel Inc. (ABD): web sitesi barındırma, içerik dağıtımı ve sunucu kayıtları',
        'Plus Five Five, Inc. (Resend, ABD): iletişim formu taleplerinin e-postayla iletilmesi',
        'Cloudflare, Inc. (ABD): iletişim sayfasında Turnstile spam koruması',
      ],
      paragraphs: [
        'Her sağlayıcı, bir veri işleme sözleşmesi kapsamında veri işleyenimiz olarak hareket eder.',
        'OPEN / AÇIK - Talebinizin ulaştığı info@moesaltd.com posta kutusunu barındıran sağlayıcı teyit edilecek.',
      ],
    },
    {
      id: 'transfers',
      title: 'Uluslararası aktarımlar',
      paragraphs: [
        'Bu sağlayıcılar verileri Amerika Birleşik Devletleri’nde işleyebilir. Aktarımlar, sağlayıcının katıldığı durumlarda AB–ABD Veri Gizliliği Çerçevesi’ne (Data Privacy Framework), diğer durumlarda Avrupa Komisyonu’nun Standart Sözleşme Maddeleri’ne (GDPR md. 46(2)(c)) dayanır.',
        'Dayandığımız Standart Sözleşme Maddeleri’nin bir kopyasını info@moesaltd.com adresinden talep edebilirsiniz.',
      ],
    },
    {
      id: 'retention',
      title: 'Saklama süreleri',
      paragraphs: [
        'Talepleri ve ilgili yazışmaları yalnızca yanıtlamak ve ardından gelen bir iş ilişkisini yönetmek için gerektiği sürece, yasal saklama sürelerinin gerektirdiği durumlarda ise daha uzun süre saklarız.',
        'İstek sınırlaması için kullanılan IP adresi sunucu belleğinde en fazla 10 dakika tutulur.',
        'OPEN / AÇIK - Devamı gelmeyen talepler, sunucu kayıtları (Vercel) ve gönderilen e-postalar (Resend) için saklama süreleri teyit edilecek.',
      ],
    },
    {
      id: 'provision',
      title: 'Zorunlu veriler ve otomatik kararlar',
      paragraphs: [
        'Zorunlu olarak işaretlenen alanlar talebinize yanıt verebilmemiz için gereklidir; bunlar olmadan yanıt veremeyiz. Veri sağlamak yasal veya sözleşmesel bir zorunluluk değildir.',
        'Otomatik karar verme veya profilleme kullanmayız.',
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
        'İşlemenin onaya dayandığı durumlarda, geri çekmeden önceki işlemenin hukuka uygunluğunu etkilemeden onayı her zaman geri çekme',
        'Yetkili denetim makamına şikâyet',
      ],
      paragraphs: [
        'Meşru menfaatlerimize dayanan işlemeye, özel durumunuzdan kaynaklanan gerekçelerle her zaman itiraz edebilirsiniz (GDPR md. 21).',
        'Bulgaristan Kişisel Verileri Koruma Komisyonu’na (КЗЛД / CPDP), 2 Prof. Tsvetan Lazarov Blvd., 1592 Sofya, www.cpdp.bg, veya ikamet ettiğiniz ya da çalıştığınız AB ülkesinin denetim makamına şikâyette bulunabilirsiniz.',
      ],
    },
    {
      id: 'security',
      title: 'Güvenlik',
      paragraphs: [
        'Verileri aktarım sırasında şifreleme (HTTPS/HSTS), kısıtlayıcı güvenlik başlıkları, sağlayıcılarımızda erişimi sınırlandırılmış hesaplar, spam koruması ve istek sınırlaması ile koruruz.',
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
        'Hizmetlerimiz veya yasal gereklilikler değiştiğinde bu politikayı güncelleyebiliriz. Güncel sürüm, son güncelleme tarihiyle birlikte her zaman bu sayfada yayımlanır.',
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
