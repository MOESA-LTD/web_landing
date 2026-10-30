import type { LegalContent } from './legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/en/legal-notice.md */
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
        'Company ID: 207200475',
        'VAT: BG207200475',
      ],
    },
    {
      id: 'contact',
      title: 'Contact',
      paragraphs: [
        'Email: info@moesaltd.com',
        'Phone: +359 88 501 661',
      ],
    },
    {
      id: 'representative',
      title: 'Legal representative',
      paragraphs: [
        'OPEN / AÇIK - Confirm the legal representative or managing director before publication.',
      ],
    },
    {
      id: 'contentResponsibility',
      title: 'Content responsibility',
      paragraphs: [
        'OPEN / AÇIK - Confirm the wording required for the publication countries and applicable law.',
      ],
    },
    {
      id: 'externalLinks',
      title: 'External links',
      paragraphs: [
        'MOESA is not responsible for the content of external websites controlled by third parties. Final wording requires legal review.',
      ],
    },
    {
      id: 'intellectualProperty',
      title: 'Intellectual property',
      paragraphs: [
        'Website content, design and brand assets may not be reproduced without permission, except where permitted by applicable law. Final wording requires legal review.',
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
