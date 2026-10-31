import type { ServicesContent } from '../en/services'

/** Translated by us from content/en/services.ts (approved EN); every string is listed in ./unreviewed.ts. */
const content: ServicesContent = {
  meta: {
    path: '/services',
    title: 'Leistungen | MOESA Ltd.',
    description: 'Entdecken Sie die Leistungen von MOESA in internationalem Sourcing, Beschaffungsmanagement, Produktentwicklung, Marktzugang, Lieferkette und Digital-Commerce-Operations.',
  },
  hero: {
    title: 'Vernetzte Leistungen für internationale Produktunternehmen.',
    body: 'Nutzen Sie eine Leistung für einen definierten Bedarf oder verbinden Sie mehrere Leistungen in einer langfristigen operativen Partnerschaft.',
  },
  services: [
    {
      slug: 'sourcing-managed-procurement',
      title: 'Sourcing & Beschaffungsmanagement',
      summary: 'Internationales Marken- und Produkt-Sourcing, Identifizierung von Herstellern und Lieferanten, kaufmännische Verhandlungen, Einkauf und Management wiederkehrender Beschaffung.',
      items: [
        'Sourcing bestimmter Marken oder Produkte',
        'Aufbau alternativer Lieferanten',
        'Ausgelagerte Beschaffungskapazität',
        'Lieferanten- und Bestellmanagement',
      ],
    },
    {
      slug: 'product-private-label-development',
      title: 'Produkt- & Private-Label-Entwicklung',
      summary: 'Produktkonzepte, Architektur von Produktfamilien, Spezifikationen, Varianten, Verpackung, Koordination von QS und Compliance sowie Produktionsreife.',
      items: [
        'Einzelne Produkte',
        'Private-Label-Portfolios',
        'Anpassung bestehender Produkte',
        'Produktverbesserung und Lieferantenwechsel',
      ],
    },
    {
      slug: 'market-access-commercial-representation',
      title: 'Marktzugang & Handelsvertretung',
      summary: 'Vorbereitung auf europäische Märkte, Handelsvertretung, Beziehungen zu Distributoren und Händlern, Kanalentwicklung und lokale operative Koordination.',
      items: [
        'Eintritt in europäische Märkte',
        'Handelsvertretung',
        'Aufbau von Distributoren und Händlern',
        'Vertretung internationaler Einkäufer',
      ],
    },
    {
      slug: 'operations-supply-chain',
      title: 'Operations & Lieferkette',
      summary: 'Einkauf, Produktionsverfolgung, Produkt- und Dokumentenkoordination, internationale Logistik, Importabwicklung, Lagerhaltung, Bestandsführung und Lieferung.',
      items: [
        'Koordination einzelner Bestellungen',
        'Wiederkehrende Produktion und Logistik',
        'Operations mit mehreren Lieferanten',
        'Koordination von Bestand und Nachschub',
      ],
    },
    {
      slug: 'digital-commerce-commercial-intelligence',
      title: 'Digital Commerce & Commercial Intelligence',
      summary: 'Produktpositionierung, Kreativkoordination, SEO, Listings, Katalog-, Marktplatz- und D2C-Operations, Bestandsplanung, Reporting und Kundenerkenntnisse.',
      items: [
        'Vorbereitung digitaler Markteinführungen',
        'Katalog- und Content-Operations',
        'Gemanagte Marktplatz- oder D2C-Operations',
        'Kommerzielle Analyse und Verbesserung',
      ],
    },
  ],
  integrated: {
    title: 'Eine Leistung oder ein integriertes Mandat.',
    body: 'Ein Projekt kann an jedem Punkt beginnen. MOESA stellt fest, was bereits bestätigt ist, was offen bleibt und welche Leistungen tatsächlich erforderlich sind.',
  },
  finalCta: {
    title: 'Nicht sicher, welche Leistung passt?',
    body: 'Beschreiben Sie das kommerzielle Ziel, die aktuelle Situation und die zentrale Herausforderung. Wir helfen Ihnen, den passenden Ausgangspunkt zu strukturieren.',
    cta: {
      label: 'Projekt besprechen',
      href: '/contact',
    },
  },
}

export default content
