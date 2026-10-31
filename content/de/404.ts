import type { MessageContent } from '../en/message'

/** Translated by us from content/en/404.ts (approved EN); every string is listed in ./unreviewed.ts. */
const content: MessageContent = {
  meta: {
    path: '/404',
    title: 'Seite nicht gefunden | MOESA Ltd.',
    description: 'Die angeforderte Seite wurde nicht gefunden.',
  },
  hero: {
    title: 'Die Seite wurde nicht gefunden.',
    body: 'Die Adresse hat sich möglicherweise geändert, oder der Link ist unvollständig.',
  },
  next: {
    title: 'Von hier aus weiter',
    items: [
      'Zur Startseite',
      'Leistungen entdecken',
      'So arbeiten wir',
      'MOESA kontaktieren',
    ],
  },
  finalCta: {
    title: 'Brauchen Sie Hilfe, die richtigen Informationen zu finden?',
    body: 'Beginnen Sie auf der Startseite oder kontaktieren Sie uns direkt.',
    cta: {
      label: 'Zur Startseite',
      href: '/',
    },
  },
}

export default content
