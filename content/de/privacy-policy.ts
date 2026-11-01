import type { LegalContent } from '../en/legal'

/**
 * Translated by us from content/en/privacy-policy.ts; every string is listed in ./unreviewed.ts, except the sections
 * rewritten after the legal review of 2026-11-01, which are listed in ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md).
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
    body: 'Diese Erklärung beschreibt, wie MOESA LTD. personenbezogene Daten verarbeitet, wenn Sie diese Website besuchen oder uns über sie kontaktieren.',
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
        'Daten aus dem Kontaktformular: Name, Unternehmen, geschäftliche E-Mail-Adresse, Land, gewünschte Leistung und Projektbeschreibung sowie, falls angegeben, Produktkategorie, Zielmarkt, geschätztes Volumen und gewünschter Zeitrahmen',
        'Technische Daten: IP-Adresse, Browserkennung (User Agent) und Zeitpunkt der Anfrage, in Server-Logs und für den Spamschutz',
        'Geschäftskorrespondenz',
      ],
      paragraphs: [
        'Wir setzen keine Analyse- oder Werbetools ein.',
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
      ],
    },
    {
      id: 'legalBases',
      title: 'Rechtsgrundlagen',
      paragraphs: [
        'Wir verarbeiten Anfragedaten, um Ihre Anfrage zu beantworten und vorvertragliche Maßnahmen durchzuführen (Art. 6 Abs. 1 lit. b DSGVO), sowie auf Grundlage unseres berechtigten Interesses an der Beantwortung geschäftlicher Anfragen (Art. 6 Abs. 1 lit. f DSGVO).',
        'Server-Logs, Spamschutz (Cloudflare Turnstile) und Ratenbegrenzung beruhen auf unserem berechtigten Interesse am sicheren Betrieb der Website (Art. 6 Abs. 1 lit. f DSGVO).',
        'Soweit wir gesetzlich zur Aufbewahrung verpflichtet sind, erfolgt sie zur Erfüllung dieser rechtlichen Pflichten (Art. 6 Abs. 1 lit. c DSGVO).',
        'Ohne Ihre gesonderte Einwilligung verwenden wir Ihre Angaben nicht für Werbezwecke.',
      ],
    },
    {
      id: 'recipients',
      title: 'Empfänger und Auftragsverarbeiter',
      items: [
        'Vercel Inc. (USA): Hosting der Website, Auslieferung der Inhalte und Server-Logs',
        'Plus Five Five, Inc. (Resend, USA): Zustellung der Kontaktformular-Anfragen per E-Mail',
        'Cloudflare, Inc. (USA): Turnstile-Spamschutz auf der Kontaktseite',
      ],
      paragraphs: [
        'Jeder Anbieter ist auf Grundlage eines Auftragsverarbeitungsvertrags für uns tätig.',
        'OPEN / AÇIK - Der Anbieter des Postfachs info@moesaltd.com, bei dem Ihre Anfrage eingeht, ist noch zu bestätigen.',
      ],
    },
    {
      id: 'transfers',
      title: 'Internationale Übermittlungen',
      paragraphs: [
        'Diese Anbieter können Daten in den USA verarbeiten. Übermittlungen stützen sich auf das EU-US Data Privacy Framework, soweit der Anbieter daran teilnimmt, und andernfalls auf die Standardvertragsklauseln der Europäischen Kommission (Art. 46 Abs. 2 lit. c DSGVO).',
        'Eine Kopie der von uns verwendeten Standardvertragsklauseln können Sie unter info@moesaltd.com anfordern.',
      ],
    },
    {
      id: 'retention',
      title: 'Speicherdauer',
      paragraphs: [
        'Anfragen und die zugehörige Korrespondenz speichern wir nur so lange, wie es für ihre Beantwortung und die Abwicklung einer daraus entstehenden Geschäftsbeziehung erforderlich ist, und darüber hinaus nur, soweit gesetzliche Aufbewahrungsfristen bestehen.',
        'Die für die Ratenbegrenzung verwendete IP-Adresse wird bis zu 10 Minuten im Arbeitsspeicher des Servers gehalten.',
        'OPEN / AÇIK - Die Speicherfristen für Anfragen ohne weiteren Kontakt, Server-Logs (Vercel) und versendete E-Mails (Resend) sind noch zu bestätigen.',
      ],
    },
    {
      id: 'provision',
      title: 'Pflichtangaben und automatisierte Entscheidungen',
      paragraphs: [
        'Die als Pflichtfeld gekennzeichneten Angaben benötigen wir, um Ihre Anfrage zu beantworten; ohne sie können wir nicht antworten. Eine gesetzliche oder vertragliche Pflicht zur Bereitstellung besteht nicht.',
        'Wir setzen keine automatisierte Entscheidungsfindung und kein Profiling ein.',
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
        'Widerruf einer Einwilligung jederzeit, soweit die Verarbeitung auf einer Einwilligung beruht, ohne dass die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung berührt wird',
        'Beschwerde bei einer zuständigen Aufsichtsbehörde',
      ],
      paragraphs: [
        'Sie können der Verarbeitung auf Grundlage unserer berechtigten Interessen aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO).',
        'Sie können sich bei der bulgarischen Kommission für den Schutz personenbezogener Daten (CPDP), 2 Prof. Tsvetan Lazarov Blvd., 1592 Sofia, www.cpdp.bg, oder bei der Aufsichtsbehörde des EU-Staates Ihres Wohnsitzes oder Arbeitsplatzes beschweren, z. B. bei der für Ihren Wohnsitz zuständigen deutschen Landesdatenschutzbehörde.',
      ],
    },
    {
      id: 'security',
      title: 'Sicherheit',
      paragraphs: [
        'Wir schützen Daten durch Transportverschlüsselung (HTTPS/HSTS), restriktive Sicherheits-Header, zugriffsbeschränkte Konten bei unseren Anbietern, Spamschutz und Ratenbegrenzung.',
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
        'Wir können diese Erklärung anpassen, wenn sich unsere Leistungen oder rechtliche Anforderungen ändern. Die aktuelle Fassung ist stets auf dieser Seite veröffentlicht, mit dem Datum der letzten Aktualisierung oben auf der Seite.',
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
