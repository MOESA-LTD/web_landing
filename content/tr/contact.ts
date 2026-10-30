import type { ContactContent } from '../en/contact'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/contact.md */
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
    body: 'Marka/ürün sourcing; yönetilen satın alma; private label; pazara giriş; ticari temsil; supply chain; digital commerce; entegre hizmetler; emin değilim.',
  },
  formFields: {
    title: 'Form',
    body: 'Ad; Şirket; İş e-postası; Ülke; Hizmet; Kısa proje briefi; opsiyonel kategori/pazar/hacim/zaman/dosya.',
  },
  next: {
    title: 'Sonraki adım',
    body: 'Talep incelenir; ilgili hizmet alanı belirlenir; eksik bilgi istenir; gerekirse discovery görüşmesi yapılır; kapsam ve ticari şartlar tanımlanmadan iş başlamaz.',
  },
  direct: {
    title: 'Doğrudan iletişim',
    body: 'info@moesaltd.com | +359 88 501 661 | 1 Petyofi Str., Plovdiv 4000, Bulgaria',
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
