import type { LegalContent } from './legal'

/**
 * From MOESA_Website_Package_v1.0/content/en/privacy-policy.md, with the draft sections rewritten after the legal
 * review of 2026-11-01 (B1, S1, S4, B4) to describe what the website actually does. Every string that is not
 * verbatim package text is listed in ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md) for the lawyer; the removed
 * package strings are listed there too. OPEN items still need owner facts.
 */
const content: LegalContent = {
  meta: {
    path: '/privacy-policy',
    title: 'Privacy Policy | MOESA Ltd.',
    description: 'Information about how MOESA Ltd. processes personal data through its website.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Privacy Policy',
    body: 'This policy explains how MOESA LTD. processes personal data when you visit this website or contact us through it.',
  },
  sections: [
    {
      id: 'controller',
      title: 'Controller',
      paragraphs: [
        'MOESA LTD.',
        '1 Petyofi Str., Plovdiv 4000, Bulgaria',
        'Email: info@moesaltd.com',
      ],
    },
    {
      id: 'dataCollected',
      title: 'Data collected',
      items: [
        'Contact-form data: name, company, work email, country, service of interest and project brief, and, if you provide them, product category, target market, estimated volume and target timeline',
        'Technical data: IP address, browser user agent and time of request, in server logs and for spam protection',
        'Business correspondence',
      ],
      paragraphs: [
        'We do not use analytics or advertising tools.',
      ],
    },
    {
      id: 'purposes',
      title: 'Purposes',
      items: [
        'Responding to enquiries',
        'Preparing and managing a potential business relationship',
        'Website security and operation',
        'Legal and record-keeping obligations',
      ],
    },
    {
      id: 'legalBases',
      title: 'Legal bases',
      paragraphs: [
        'We process enquiry data to answer your request and to take steps before a possible contract (Art. 6(1)(b) GDPR), and on the basis of our legitimate interest in responding to business enquiries (Art. 6(1)(f) GDPR).',
        'Server logs, spam protection (Cloudflare Turnstile) and rate limiting are based on our legitimate interest in operating a secure website (Art. 6(1)(f) GDPR).',
        'Where the law requires us to keep records, we do so to meet our legal obligations (Art. 6(1)(c) GDPR).',
        'We do not use your details for marketing without your separate consent.',
      ],
    },
    {
      id: 'recipients',
      title: 'Recipients and processors',
      items: [
        'Cloudflare, Inc. (USA): website hosting and content delivery through its global network (Cloudflare Pages and Workers), server logs, and Turnstile spam protection on the contact page',
        'Plus Five Five, Inc. (Resend, USA): delivery of contact-form enquiries by email',
      ],
      paragraphs: [
        'Each provider acts as our processor under a data processing agreement.',
        'The info@moesaltd.com mailbox, which receives your enquiry, is hosted by Namecheap, Inc. (Private Email, USA).',
      ],
    },
    {
      id: 'transfers',
      title: 'International transfers',
      paragraphs: [
        'These providers may process data in the United States, and Cloudflare serves the website from data centres in many countries, including outside the EU. Transfers rely on the EU–US Data Privacy Framework where the provider participates in it, and otherwise on the European Commission’s Standard Contractual Clauses (Art. 46(2)(c) GDPR).',
        'You can request a copy of the Standard Contractual Clauses we rely on at info@moesaltd.com.',
      ],
    },
    {
      id: 'retention',
      title: 'Retention',
      paragraphs: [
        'We keep enquiries and related correspondence only as long as needed to answer them and to manage a business relationship that follows, and longer only where statutory retention periods apply.',
        'The IP address used for rate limiting is held in server memory for up to 10 minutes.',
        'OPEN / AÇIK - Retention periods for enquiries without follow-up, server logs (Cloudflare) and sent emails (Resend) are to be confirmed.',
      ],
    },
    {
      id: 'provision',
      title: 'Required data and automated decisions',
      paragraphs: [
        'Fields marked as required are necessary to answer your enquiry; without them we cannot respond. Providing data is not a statutory or contractual requirement.',
        'We do not use automated decision-making or profiling.',
      ],
    },
    {
      id: 'rights',
      title: 'Data-subject rights',
      items: [
        'Access',
        'Rectification',
        'Erasure',
        'Restriction',
        'Objection',
        'Data portability where applicable',
        'Withdrawal of consent at any time, where processing is based on consent, without affecting the lawfulness of processing before the withdrawal',
        'Complaint to a competent supervisory authority',
      ],
      paragraphs: [
        'You can object at any time, on grounds relating to your particular situation, to processing based on our legitimate interests (Art. 21 GDPR).',
        'You can lodge a complaint with the Bulgarian Commission for Personal Data Protection (CPDP), 2 Prof. Tsvetan Lazarov Blvd., 1592 Sofia, www.cpdp.bg, or with the supervisory authority of your EU country of residence or work.',
      ],
    },
    {
      id: 'security',
      title: 'Security',
      paragraphs: [
        'We protect data with encryption in transit (HTTPS/HSTS), restrictive security headers, access-restricted accounts at our providers, spam protection and rate limiting.',
      ],
    },
    {
      id: 'privacyContact',
      title: 'Contact for privacy requests',
      paragraphs: [
        'info@moesaltd.com',
      ],
    },
    {
      id: 'updates',
      title: 'Policy updates',
      paragraphs: [
        'We may update this policy when our services or legal requirements change. The current version is always published on this page, with the date of the last update at the top.',
      ],
    },
  ],
  finalCta: {
    title: 'Privacy question?',
    body: 'Contact info@moesaltd.com.',
    cta: {
      label: 'Contact MOESA',
      href: '/contact',
    },
  },
}

export default content
