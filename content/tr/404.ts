import type { MessageContent } from '../en/message'

/** Verbatim from MOESA_Website_Package_v1.0/content/tr/404.md */
const content: MessageContent = {
  meta: {
    path: '/404',
    title: '404 | MOESA Ltd.',
    description: 'Adres değişmiş veya bağlantı eksik olabilir.',
  },
  hero: {
    title: 'Sayfa bulunamadı.',
    body: 'Adres değişmiş veya bağlantı eksik olabilir.',
  },
  next: {
    title: 'Buradan devam edin',
    body: 'Ana Sayfa; Hizmetler; Nasıl Çalışıyoruz; İletişim.',
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
