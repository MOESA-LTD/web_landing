import type { MessageContent } from '../en/message'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/thank-you.md */
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
    body: 'Talep incelenir; ilgili alan belirlenir; eksik bilgi istenebilir; görüşme önerilebilir; kapsam ve ticari şartlar onaylanmadan çalışma başlamaz.',
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
