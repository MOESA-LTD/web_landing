import type { MessageContent } from '../en/message'

/** Verbatim from content/approved/tr/thank-you.md, plus the translations listed in ./unreviewed.ts. */
const content: MessageContent = {
  meta: {
    path: '/thank-you',
    title: 'Teşekkürler | MOESA Ltd.',
    description: 'Bilgileri inceleyip verdiğiniz iletişim bilgileri üzerinden dönüş yapacağız.',
  },
  hero: {
    title: 'Proje briefiniz alındı.',
    body: 'Bilgileri inceleyip verdiğiniz iletişim bilgileri üzerinden dönüş yapacağız.',
  },
  next: {
    title: 'Sonraki adım',
    condensed: 'Talep incelenir; ilgili alan belirlenir; eksik bilgi istenebilir; görüşme önerilebilir; kapsam ve ticari şartlar onaylanmadan çalışma başlamaz.',
    items: [
      'Talep incelenir',
      'İlgili hizmet alanı belirlenir',
      'Eksik bilgi istenebilir',
      'Bir discovery görüşmesi önerilebilir',
      'Kapsam ve ticari şartlar kararlaştırılmadan hiçbir çalışma başlamaz',
    ],
  },
  info: {
    title: 'Bilgi eklemeniz mi gerekiyor?',
    body: 'Ek ayrıntıları info@moesaltd.com adresine e-postayla gönderin ve formda kullandığınız şirket veya proje adını belirtin.',
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
