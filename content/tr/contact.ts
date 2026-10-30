import type { ContactContent } from '../en/contact'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/contact.md, plus the translations listed in ./unreviewed.ts. */
const content: ContactContent = {
  meta: {
    path: '/contact',
    title: 'İletişim | MOESA Ltd.',
    description: 'İşletmenin neye ihtiyacı olduğunu, nelerin kesinleştiğini ve nelerin açık olduğunu anlatın. Sonraki adımı birlikte yapılandıralım.',
  },
  hero: {
    title: 'Hedefle başlayın.',
    body: 'İşletmenin neye ihtiyacı olduğunu, nelerin kesinleştiğini ve nelerin açık olduğunu anlatın. Sonraki adımı birlikte yapılandıralım.',
  },
  serviceOptions: {
    title: 'Hizmet seçimi',
    condensed: 'Marka/ürün sourcing; yönetilen satın alma; private label; pazara giriş; ticari temsil; supply chain; digital commerce; entegre hizmetler; emin değilim.',
    items: [
      'Marka/ürün sourcing',
      'Yönetilen satın alma',
      'Ürün ve Private Label Geliştirme',
      'Pazara giriş',
      'Ticari temsil',
      'Operasyon ve Tedarik Zinciri',
      'Digital commerce',
      'Entegre hizmetler',
      'Emin değilim',
    ],
  },
  formFields: {
    title: 'Form',
    condensed: 'Ad; Şirket; İş e-postası; Ülke; Hizmet; Kısa proje briefi; opsiyonel kategori/pazar/hacim/zaman/dosya.',
    items: [
      'Ad',
      'Şirket',
      'İş e-postası',
      'Ülke',
      'Hizmet',
      'Kısa proje briefi',
      'Ürün Kategorisi - opsiyonel',
      'Hedef Pazar - opsiyonel',
      'Tahmini Hacim - opsiyonel',
      'Hedef Zaman Çizelgesi - opsiyonel',
      'Dosya Yükleme - opsiyonel',
    ],
  },
  next: {
    title: 'Sonraki adım',
    condensed: 'Talep incelenir; ilgili hizmet alanı belirlenir; eksik bilgi istenir; gerekirse discovery görüşmesi yapılır; kapsam ve ticari şartlar tanımlanmadan iş başlamaz.',
    items: [
      'MOESA talebi inceler ve ilgili hizmet alanını belirler',
      'Eksik proje bilgilerini isteyebiliriz',
      'Uygun olduğunda bir discovery görüşmesi planlanır',
      'Çalışma başlamadan önce kapsam, sorumluluklar ve ticari şartlar tanımlanır',
    ],
  },
  direct: {
    title: 'Doğrudan iletişim',
    condensed: 'info@moesaltd.com | +359 88 501 661 | 1 Petyofi Str., Plovdiv 4000, Bulgaria',
    items: [
      'E-posta: info@moesaltd.com',
      'Telefon: +359 88 501 661',
      'Kayıtlı adres: 1 Petyofi Str., Plovdiv 4000, Bulgaria',
    ],
  },
  company: {
    title: 'Şirket bilgileri',
    items: [
      'Company ID: 207200475',
      'VAT: BG207200475',
    ],
  },
  privacyNote: {
    title: 'Gizlilik notu',
    body: 'Form, talebe yanıt verilmesi amacıyla gönderilen bilgilerin işlenmesine yönelik onay içermelidir. Kullanıcılar ayrı bir onay olmadan pazarlama iletişimlerine eklenmemelidir.',
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
