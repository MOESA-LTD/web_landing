import type { LegalContent } from '../en/legal'

/**
 * Translated by us from content/en/legal-notice.ts; every string is listed in ./unreviewed.ts, except the notes
 * rewritten after the legal review of 2026-11-01, which are listed in ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md).
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
        'Unternehmens-ID (EIK): 207200475',
        'USt-IdNr.: BG207200475',
        'OPEN / AÇIK - Die Rechtsform (EOOD oder OOD) und der Eintrag im Handelsregister der bulgarischen Agentur für Eintragungen (Agentsia po vpisvaniyata) sind noch zu bestätigen.',
      ],
    },
    {
      id: 'contact',
      title: 'Kontakt',
      paragraphs: [
        'E-Mail: info@moesaltd.com',
        'Telefon: +359 88 501 661',
        'OPEN / AÇIK - Die Telefonnummer ist noch zu bestätigen.',
      ],
    },
    {
      id: 'representative',
      title: 'Gesetzlicher Vertreter',
      paragraphs: [
        'OPEN / AÇIK - Der Geschäftsführer (upravitel) ist noch zu bestätigen.',
      ],
    },
    {
      id: 'externalLinks',
      title: 'Externe Links',
      paragraphs: [
        'MOESA ist nicht für die Inhalte externer Websites verantwortlich, die von Dritten kontrolliert werden.',
      ],
    },
    {
      id: 'intellectualProperty',
      title: 'Geistiges Eigentum',
      paragraphs: [
        'Inhalte, Gestaltung und Markenelemente der Website dürfen ohne Genehmigung nicht vervielfältigt werden, soweit dies nicht nach geltendem Recht zulässig ist.',
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
