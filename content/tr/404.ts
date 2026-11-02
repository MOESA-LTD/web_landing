import type { MessageContent } from '../en/message'

/** Verbatim from content/approved/tr/404.md. `next.items` are the page names from its approved "Buradan devam edin" line. */
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
    condensed: 'Ana Sayfa; Hizmetler; Nasıl Çalışıyoruz; İletişim.',
    items: [
      'Ana Sayfa',
      'Hizmetler',
      'Nasıl Çalışıyoruz',
      'İletişim',
    ],
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
