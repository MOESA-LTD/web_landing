import type { ContactContent } from '../en/contact'

/** Translated by us from content/en/contact.ts (approved EN); every string is listed in ./unreviewed.ts. */
const content: ContactContent = {
  meta: {
    path: '/contact',
    title: 'MOESA Ltd. kontaktieren | Produkt-, Beschaffungs- oder Marktprojekt besprechen',
    description: 'Kontaktieren Sie MOESA Ltd., um Sourcing, Beschaffung, Private-Label-Entwicklung, Marktzugang, Lieferkette oder Digital-Commerce-Operations zu besprechen.',
  },
  hero: {
    title: 'Beginnen Sie mit dem Ziel.',
    body: 'Sagen Sie uns, was Ihr Unternehmen braucht, was bereits bestätigt ist und was offen bleibt. Wir helfen Ihnen, den nächsten Schritt zu strukturieren.',
  },
  serviceOptions: {
    title: 'Wie können wir Sie unterstützen?',
    items: [
      'Marken- oder Produkt-Sourcing',
      'Beschaffungsmanagement',
      'Produkt- & Private-Label-Entwicklung',
      'Marktzugang',
      'Vertriebsrepräsentanz',
      'Operations & Lieferkette',
      'Digital-Commerce-Operations',
      'Integriert / mehrere Leistungen',
      'Noch unklar',
    ],
  },
  formFields: {
    title: 'Projektformular',
    items: [
      'Name',
      'Unternehmen',
      'Geschäftliche E-Mail',
      'Land',
      'Wie können wir Sie unterstützen?',
      'Kurzes Projektbriefing',
      'Produktkategorie - optional',
      'Zielmarkt - optional',
      'Geschätztes Volumen - optional',
      'Gewünschter Zeitrahmen - optional',
      'Datei-Upload - optional',
    ],
  },
  next: {
    title: 'Wie es weitergeht',
    items: [
      'MOESA prüft die Anfrage und ermittelt den passenden Leistungsbereich',
      'Wir fragen gegebenenfalls fehlende Projektinformationen an',
      'Bei Bedarf wird ein erstes Sondierungsgespräch vereinbart',
      'Umfang, Verantwortlichkeiten und kommerzielle Bedingungen werden vor Beginn der Arbeit festgelegt',
    ],
  },
  direct: {
    title: 'Direkter Kontakt',
    items: [
      'E-Mail: info@moesaltd.com',
      'Telefon: +359 88 501 661',
      'Eingetragene Anschrift: 1 Petyofi Str., Plovdiv 4000, Bulgaria',
    ],
  },
  company: {
    title: 'Unternehmensangaben',
    items: [
      'Unternehmens-ID (EIK): 207200475',
      'USt-IdNr.: BG207200475',
    ],
  },
  privacyNote: {
    title: 'Datenschutzhinweis',
    body: 'Das Formular muss eine Einwilligung zur Verarbeitung der übermittelten Informationen zum Zweck der Beantwortung der Anfrage enthalten. Nutzer dürfen ohne gesonderte Einwilligung nicht in Marketingkommunikation aufgenommen werden.',
  },
  finalCta: {
    title: 'Bereit, das Projekt zu besprechen?',
    body: 'Nutzen Sie das Formular oder kontaktieren Sie MOESA direkt. Ein übermitteltes Formular begründet kein Vertragsverhältnis.',
    cta: {
      label: 'Projektbriefing senden',
      href: '/contact#project-form',
    },
  },
}

export default content
