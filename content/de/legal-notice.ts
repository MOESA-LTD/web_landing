import type { LegalContent } from '../en/legal'

/**
 * Translated by us from content/en/legal-notice.ts (approved EN); every string is listed in ./unreviewed.ts.
 * Draft: the status chip keeps the md status value and the open items keep the md marker "OPEN / AÇIK - ".
 * A German Impressum has its own statutory requirements and needs legal review before the DE launch
 * (README "Before launch").
 */
const content: LegalContent = {
  meta: {
    path: '/legal-notice',
    title: 'Impressum | MOESA Ltd.',
    description: 'Rechtliche Angaben und Registerinformationen zu MOESA Ltd.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Impressum',
    body: 'Diese Seite enthält die Registerangaben des Unternehmens und Angaben zum Betreiber der Website.',
  },
  sections: [
    {
      id: 'operator',
      title: 'Betreiber der Website',
      paragraphs: [
        'MOESA LTD.',
        '1 Petyofi Str., Plovdiv 4000, Bulgaria',
        'Firmennummer: 207200475',
        'USt-IdNr.: BG207200475',
      ],
    },
    {
      id: 'contact',
      title: 'Kontakt',
      paragraphs: [
        'E-Mail: info@moesaltd.com',
        'Telefon: +359 88 501 661',
      ],
    },
    {
      id: 'representative',
      title: 'Gesetzlicher Vertreter',
      paragraphs: [
        'OPEN / AÇIK - Den gesetzlichen Vertreter oder Geschäftsführer vor der Veröffentlichung bestätigen.',
      ],
    },
    {
      id: 'contentResponsibility',
      title: 'Verantwortlichkeit für Inhalte',
      paragraphs: [
        'OPEN / AÇIK - Die für die Veröffentlichungsländer und das anwendbare Recht erforderliche Formulierung bestätigen.',
      ],
    },
    {
      id: 'externalLinks',
      title: 'Externe Links',
      paragraphs: [
        'MOESA ist nicht für die Inhalte externer Websites verantwortlich, die von Dritten kontrolliert werden. Die endgültige Formulierung erfordert eine rechtliche Prüfung.',
      ],
    },
    {
      id: 'intellectualProperty',
      title: 'Geistiges Eigentum',
      paragraphs: [
        'Inhalte, Gestaltung und Markenelemente der Website dürfen ohne Genehmigung nicht vervielfältigt werden, soweit dies nicht nach geltendem Recht zulässig ist. Die endgültige Formulierung erfordert eine rechtliche Prüfung.',
      ],
    },
  ],
  finalCta: {
    title: 'Fragen zu den Unternehmensangaben?',
    body: 'Kontaktieren Sie info@moesaltd.com.',
    cta: {
      label: 'MOESA kontaktieren',
      href: '/contact',
    },
  },
}

export default content
