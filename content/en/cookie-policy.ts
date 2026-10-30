import type { LegalContent } from './legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/en/cookie-policy.md */
const content: LegalContent = {
  meta: {
    path: '/cookie-policy',
    title: 'Cookie Policy | MOESA Ltd.',
    description: 'Information about cookies and similar technologies used on the MOESA website.',
  },
  status: 'DRAFT / TASLAK - LEGAL & TECHNICAL REVIEW REQUIRED',
  hero: {
    title: 'Cookie Policy',
    body: 'Implementation draft. The final policy and consent banner depend on the technologies actually used on the website.',
  },
  sections: [
    {
      id: 'categories',
      title: 'Cookie categories',
      items: [
        'Strictly necessary',
        'Preferences',
        'Analytics',
        'Marketing - only if implemented',
      ],
    },
    {
      id: 'consentModel',
      title: 'Consent model',
      paragraphs: [
        'Non-essential cookies must not be activated before valid consent where consent is legally required. Users must be able to reject and later change their choices.',
      ],
    },
    {
      id: 'inventory',
      title: 'Cookie inventory',
      paragraphs: [
        'OPEN / AÇIK - Create the final cookie table after hosting, analytics, embedded media, forms and third-party services are selected.',
      ],
    },
    {
      id: 'thirdParties',
      title: 'Third-party services',
      paragraphs: [
        'OPEN / AÇIK - List each third-party provider, purpose, cookie duration and privacy link.',
      ],
    },
    {
      id: 'managing',
      title: 'Managing cookies',
      paragraphs: [
        'Explain browser controls and the website consent-preference mechanism.',
      ],
    },
    {
      id: 'effectiveDate',
      title: 'Effective date',
      paragraphs: [
        'OPEN / AÇIK - Add the publication date.',
      ],
    },
  ],
  finalCta: {
    title: 'Cookie question?',
    body: 'Contact info@moesaltd.com.',
    cta: {
      label: 'Contact MOESA',
      href: '/contact',
    },
  },
}

export default content
