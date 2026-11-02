import type { LegalContent } from '../en/legal'

/**
 * Translated by us from content/en/cookie-policy.ts; every string is listed in ./unreviewed.ts, except the sections
 * rewritten after the legal review of 2026-11-01, which are listed in ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md).
 * Draft: the status chip keeps the md status value.
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
    body: 'Diese Website verwendet ein einziges First-Party-Cookie und keine Analyse-, Werbe- oder Social-Media-Cookies. Diese Seite erklärt, was auf Ihrem Gerät gespeichert wird und wie Sie es steuern können.',
  },
  sections: [
    {
      id: 'categories',
      title: 'Cookie-Kategorien',
      items: [
        'Unbedingt erforderlich',
      ],
      paragraphs: [
        'Wir verwenden derzeit keine Präferenz-, Analyse- oder Marketing-Cookies.',
      ],
    },
    {
      id: 'consentModel',
      title: 'Einwilligungsmodell',
      paragraphs: [
        'Unbedingt erforderliche Cookies und ähnliche Technologien benötigen keine Einwilligung. Wir setzen keine nicht erforderlichen Cookies. Sollten wir solche Cookies einführen, holen wir vorher Ihre Einwilligung ein; Sie können sie ablehnen und Ihre Auswahl später ändern.',
      ],
    },
    {
      id: 'inventory',
      title: 'Cookie-Übersicht',
      paragraphs: [
        'Die folgende Tabelle führt alle Cookies und ähnlichen Technologien auf, die auf dieser Website eingesetzt werden.',
      ],
    },
    {
      id: 'thirdParties',
      title: 'Drittanbieterdienste',
      paragraphs: [
        'Cloudflare, Inc. (USA) hostet diese Website und liefert sie über sein globales Netzwerk aus; das Hosting setzt keine Cookies. Cloudflare Turnstile läuft nur auf der Kontaktseite und schützt das Formular vor Spam. Datenschutzerklärung: https://www.cloudflare.com/privacypolicy/',
        'Wir binden keine Social-Media-, Video-, Karten- oder Werbedienste ein.',
      ],
    },
    {
      id: 'managing',
      title: 'Cookies verwalten',
      paragraphs: [
        'Sie können Cookies jederzeit in Ihren Browsereinstellungen löschen oder blockieren. Wenn Sie die Turnstile-Prüfung blockieren, kann das Kontaktformular nicht gesendet werden; Sie können uns stattdessen eine E-Mail schreiben.',
        'Sollten wir optionale Cookies einführen, können Sie Ihre Einwilligung jederzeit in den Cookie-Einstellungen auf dieser Seite erteilen, ändern oder widerrufen.',
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
