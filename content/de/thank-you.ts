import type { MessageContent } from '../en/message'

/** Translated by us from content/en/thank-you.ts (approved EN); every string is listed in ./unreviewed.ts. */
const content: MessageContent = {
  meta: {
    path: '/thank-you',
    title: 'Vielen Dank | MOESA Ltd.',
    description: 'Ihre Anfrage wurde an MOESA Ltd. gesendet.',
  },
  hero: {
    title: 'Vielen Dank. Ihr Projektbriefing ist eingegangen.',
    body: 'Wir prüfen die Informationen und antworten Ihnen über die angegebenen Kontaktdaten.',
  },
  next: {
    title: 'Wie es weitergeht',
    items: [
      'Die Anfrage wird geprüft',
      'Der passende Leistungsbereich wird ermittelt',
      'Fehlende Informationen fragen wir bei Bedarf an',
      'Gegebenenfalls schlagen wir ein erstes Sondierungsgespräch vor',
      'Eine Zusammenarbeit beginnt erst, wenn Umfang und kaufmännische Konditionen vereinbart sind',
    ],
  },
  info: {
    title: 'Möchten Sie Informationen ergänzen?',
    body: 'Senden Sie weitere Details per E-Mail an info@moesaltd.com und nennen Sie dabei den Unternehmens- oder Projektnamen, den Sie im Formular verwendet haben.',
  },
  finalCta: {
    title: 'Erfahren Sie mehr über MOESA.',
    body: 'Sehen Sie sich unsere Leistungen an oder kehren Sie zur Startseite zurück.',
    cta: {
      label: 'Leistungen entdecken',
      href: '/services',
    },
  },
}

export default content
