import type { LegalContent } from '../en/legal'

/**
 * Translated by us from content/en/privacy-policy.ts (approved EN); every string is listed in ./unreviewed.ts.
 * Draft: the status chip keeps the md status value and the open items keep the md marker "OPEN / AÇIK - ".
 * A German privacy policy needs its own legal review before the DE launch (README "Before launch").
 */
const content: LegalContent = {
  meta: {
    path: '/privacy-policy',
    title: 'Datenschutzerklärung | MOESA Ltd.',
    description: 'Informationen darüber, wie MOESA Ltd. über ihre Website personenbezogene Daten verarbeitet.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Datenschutzerklärung',
    body: 'Entwurf für die Umsetzung. Die endgültige Erklärung muss aktualisiert werden, sobald Hosting, Analyse, Formular, E-Mail, Cookies und Drittanbieterdienste feststehen, und muss vor der Veröffentlichung rechtlich geprüft werden.',
  },
  sections: [
    {
      id: 'controller',
      title: 'Verantwortlicher',
      paragraphs: [
        'MOESA LTD.',
        '1 Petyofi Str., Plovdiv 4000, Bulgaria',
        'E-Mail: info@moesaltd.com',
      ],
    },
    {
      id: 'dataCollected',
      title: 'Erhobene Daten',
      items: [
        'Daten aus dem Kontaktformular',
        'Von Nutzern übermittelte Dateien',
        'Technische Server-Logs',
        'Cookie- und Analysedaten, sofern aktiviert',
        'Geschäftskorrespondenz',
      ],
    },
    {
      id: 'purposes',
      title: 'Zwecke',
      items: [
        'Beantwortung von Anfragen',
        'Vorbereitung und Verwaltung einer möglichen Geschäftsbeziehung',
        'Sicherheit und Betrieb der Website',
        'Rechtliche Pflichten und Aufbewahrungspflichten',
        'Analyse nur bei rechtmäßiger Umsetzung',
      ],
    },
    {
      id: 'legalBases',
      title: 'Rechtsgrundlagen',
      paragraphs: [
        'OPEN / AÇIK - Die endgültigen Rechtsgrundlagen müssen für jede Verarbeitungstätigkeit mit einem Rechtsbeistand bestätigt werden.',
      ],
    },
    {
      id: 'recipients',
      title: 'Empfänger und Auftragsverarbeiter',
      paragraphs: [
        'OPEN / AÇIK - Hosting-Anbieter, Formularanbieter, E-Mail-Anbieter, Analysetools, CRM und weitere Auftragsverarbeiter ergänzen, sobald der technische Stack feststeht.',
      ],
    },
    {
      id: 'transfers',
      title: 'Internationale Übermittlungen',
      paragraphs: [
        'OPEN / AÇIK - Bestätigen, ob ein Anbieter Daten außerhalb des EWR verarbeitet, und den Übermittlungsmechanismus dokumentieren.',
      ],
    },
    {
      id: 'retention',
      title: 'Speicherdauer',
      paragraphs: [
        'OPEN / AÇIK - Speicherfristen für Anfragen, Dateien, Logs, Analysedaten und Geschäftskorrespondenz festlegen.',
      ],
    },
    {
      id: 'rights',
      title: 'Rechte der betroffenen Personen',
      items: [
        'Auskunft',
        'Berichtigung',
        'Löschung',
        'Einschränkung der Verarbeitung',
        'Widerspruch',
        'Datenübertragbarkeit, soweit anwendbar',
        'Beschwerde bei einer zuständigen Aufsichtsbehörde',
      ],
    },
    {
      id: 'security',
      title: 'Sicherheit',
      paragraphs: [
        'Geeignete technische und organisatorische Maßnahmen einsetzen. Die endgültige Formulierung muss dem tatsächlichen System entsprechen.',
      ],
    },
    {
      id: 'privacyContact',
      title: 'Kontakt für Datenschutzanfragen',
      paragraphs: [
        'info@moesaltd.com',
      ],
    },
    {
      id: 'updates',
      title: 'Aktualisierungen der Erklärung',
      paragraphs: [
        'Das Datum des Inkrafttretens angeben und erläutern, dass die Erklärung aktualisiert werden kann, wenn sich Dienste oder rechtliche Anforderungen ändern.',
      ],
    },
  ],
  finalCta: {
    title: 'Eine Frage zum Datenschutz?',
    body: 'Kontaktieren Sie info@moesaltd.com.',
    cta: {
      label: 'MOESA kontaktieren',
      href: '/contact',
    },
  },
}

export default content
