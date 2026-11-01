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
    title: 'So geht es weiter',
    items: [
      'Zur Startseite',
      'Leistungen entdecken',
      'So arbeiten wir',
      'MOESA kontaktieren',
    ],
  },
  finalCta: {
    title: 'Benötigen Sie Hilfe bei der Suche nach den richtigen Informationen?',
    body: 'Beginnen Sie auf der Startseite oder kontaktieren Sie uns direkt.',
    cta: {
      label: 'Zur Startseite',
      href: '/',
    },
  },
}

export default content
