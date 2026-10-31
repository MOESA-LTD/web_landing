import type { LegalContent } from '../en/legal'

/**
 * Translated by us from content/en/cookie-policy.ts (approved EN); every string is listed in ./unreviewed.ts.
 * Draft: the status chip keeps the md status value and the open items keep the md marker "OPEN / AÇIK - ".
 */
const content: LegalContent = {
  meta: {
    path: '/cookie-policy',
    title: 'Cookie-Richtlinie | MOESA Ltd.',
    description: 'Informationen über Cookies und ähnliche Technologien, die auf der Website von MOESA verwendet werden.',
  },
  status: 'DRAFT / TASLAK - LEGAL & TECHNICAL REVIEW REQUIRED',
  hero: {
    title: 'Cookie-Richtlinie',
    body: 'Entwurf für die Umsetzung. Die endgültige Richtlinie und das Einwilligungsbanner hängen von den Technologien ab, die auf der Website tatsächlich eingesetzt werden.',
  },
  sections: [
    {
      id: 'categories',
      title: 'Cookie-Kategorien',
      items: [
        'Unbedingt erforderlich',
        'Präferenzen',
        'Analyse',
        'Marketing - nur falls umgesetzt',
      ],
    },
    {
      id: 'consentModel',
      title: 'Einwilligungsmodell',
      paragraphs: [
        'Nicht erforderliche Cookies dürfen nicht vor einer wirksamen Einwilligung aktiviert werden, wo eine Einwilligung gesetzlich vorgeschrieben ist. Nutzer müssen ihre Auswahl ablehnen und später ändern können.',
      ],
    },
    {
      id: 'inventory',
      title: 'Cookie-Übersicht',
      paragraphs: [
        'OPEN / AÇIK - Die endgültige Cookie-Tabelle erstellen, sobald Hosting, Analyse, eingebettete Medien, Formulare und Drittanbieterdienste ausgewählt sind.',
      ],
    },
    {
      id: 'thirdParties',
      title: 'Drittanbieterdienste',
      paragraphs: [
        'OPEN / AÇIK - Jeden Drittanbieter mit Zweck, Cookie-Laufzeit und Link zur Datenschutzerklärung aufführen.',
      ],
    },
    {
      id: 'managing',
      title: 'Cookies verwalten',
      paragraphs: [
        'Die Browsereinstellungen und den Mechanismus der Website für Einwilligungspräferenzen erläutern.',
      ],
    },
    {
      id: 'effectiveDate',
      title: 'Datum des Inkrafttretens',
      paragraphs: [
        'OPEN / AÇIK - Das Veröffentlichungsdatum ergänzen.',
      ],
    },
  ],
  finalCta: {
    title: 'Eine Frage zu Cookies?',
    body: 'Kontaktieren Sie info@moesaltd.com.',
    cta: {
      label: 'MOESA kontaktieren',
      href: '/contact',
    },
  },
}

export default content
