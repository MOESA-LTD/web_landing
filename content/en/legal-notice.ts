import type { LegalContent } from './legal'

/**
 * From content/approved/en/legal-notice.md, with the draft notes rewritten after the legal review
 * of 2026-11-01 (B3, B4, N5). Every string that is not verbatim package text is listed in ../legal-revisions.ts
 * (i18n/UNREVIEWED_LEGAL.md) for the lawyer; the removed package strings are listed there too. The OPEN items need
 * owner facts (legal form, register entry, managing director, phone number).
 */
const content: LegalContent = {
  meta: {
    path: '/legal-notice',
    title: 'Legal Notice | MOESA Ltd.',
    description: 'Legal and registered company information for MOESA Ltd.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Legal Notice',
    body: 'This page provides registered company and website-operator information.',
  },
  sections: [
    {
      id: 'operator',
      title: 'Website operator',
      paragraphs: [
        'MOESA LTD.',
        '1 Petyofi Str., Plovdiv 4000, Bulgaria',
        'UIC (EIK): 207200475',
        'VAT: BG207200475',
        'OPEN / AÇIK - The legal form (EOOD or OOD) and the entry in the Commercial Register of the Registry Agency of the Republic of Bulgaria are to be confirmed.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      paragraphs: [
        'Email: info@moesaltd.com',
        'Phone: +359 88 501 661',
        'OPEN / AÇIK - The phone number is to be confirmed.',
      ],
    },
    {
      id: 'representative',
      title: 'Legal representative',
      paragraphs: [
        'OPEN / AÇIK - The managing director (upravitel) is to be confirmed.',
      ],
    },
    {
      id: 'externalLinks',
      title: 'External links',
      paragraphs: [
        'MOESA is not responsible for the content of external websites controlled by third parties.',
      ],
    },
    {
      id: 'intellectualProperty',
      title: 'Intellectual property',
      paragraphs: [
        'Website content, design and brand assets may not be reproduced without permission, except where permitted by applicable law.',
      ],
    },
  ],
  finalCta: {
    title: 'Questions about the company information?',
    body: 'Contact info@moesaltd.com.',
    cta: {
      label: 'Contact MOESA',
      href: '/contact',
    },
  },
}

export default content
