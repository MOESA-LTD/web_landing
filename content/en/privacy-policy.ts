import type { LegalContent } from './legal'

/** Verbatim from MOESA_Website_Package_v1.0/content/en/privacy-policy.md */
const content: LegalContent = {
  meta: {
    path: '/privacy-policy',
    title: 'Privacy Policy | MOESA Ltd.',
    description: 'Information about how MOESA Ltd. processes personal data through its website.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Privacy Policy',
    body: 'Implementation draft. The final policy must be updated after hosting, analytics, form, email, cookie and third-party services are confirmed and must receive legal review before publication.',
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
        'Contact-form data',
        'Files submitted by users',
        'Technical server logs',
        'Cookie and analytics data if enabled',
        'Business correspondence',
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
        'Analytics only if lawfully implemented',
      ],
    },
    {
      id: 'legalBases',
      title: 'Legal bases',
      paragraphs: [
        'OPEN / AÇIK - Final legal bases must be confirmed with counsel for each processing activity.',
      ],
    },
    {
      id: 'recipients',
      title: 'Recipients and processors',
      paragraphs: [
        'OPEN / AÇIK - Add hosting provider, form provider, email provider, analytics tools, CRM and other processors after the technical stack is final.',
      ],
    },
    {
      id: 'transfers',
      title: 'International transfers',
      paragraphs: [
        'OPEN / AÇIK - Confirm whether any provider processes data outside the EEA and document the transfer mechanism.',
      ],
    },
    {
      id: 'retention',
      title: 'Retention',
      paragraphs: [
        'OPEN / AÇIK - Define retention periods for enquiries, files, logs, analytics and business correspondence.',
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
        'Complaint to a competent supervisory authority',
      ],
    },
    {
      id: 'security',
      title: 'Security',
      paragraphs: [
        'Use appropriate technical and organisational measures. Final wording must match the actual system.',
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
        'State the effective date and explain that the policy may be updated when services or legal requirements change.',
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
