import type { LegalContent } from './legal'

/**
 * From MOESA_Website_Package_v1.0/content/en/cookie-policy.md, with the draft sections rewritten after the legal
 * review of 2026-11-01 (B2, S3, B4) to describe the cookies and similar technologies the website actually uses. Every
 * string that is not verbatim package text is listed in ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md) for the
 * lawyer; the removed package strings are listed there too. The inventory table itself is rendered by
 * app/pages/cookie-policy.vue (`cookie.inventory.*`).
 */
const content: LegalContent = {
  meta: {
    path: '/cookie-policy',
    title: 'Cookie Policy | MOESA Ltd.',
    description: 'Information about cookies and similar technologies used on the MOESA website.',
  },
  status: 'DRAFT / TASLAK - LEGAL & TECHNICAL REVIEW REQUIRED',
  hero: {
    title: 'Cookie Policy',
    body: 'This website uses one first-party cookie and no analytics, advertising or social-media cookies. This page explains what is stored on your device and how you can control it.',
  },
  sections: [
    {
      id: 'categories',
      title: 'Cookie categories',
      items: [
        'Strictly necessary',
      ],
      paragraphs: [
        'We currently use no preference, analytics or marketing cookies.',
      ],
    },
    {
      id: 'consentModel',
      title: 'Consent model',
      paragraphs: [
        'Strictly necessary cookies and similar technologies do not require your consent. We do not set any non-essential cookie. If we introduce one, we will ask for your consent first, and you will be able to refuse it and to change your choice later.',
      ],
    },
    {
      id: 'inventory',
      title: 'Cookie inventory',
      paragraphs: [
        'The table below lists every cookie and similar technology used on this website.',
      ],
    },
    {
      id: 'thirdParties',
      title: 'Third-party services',
      paragraphs: [
        'Cloudflare Turnstile (Cloudflare, Inc., USA) runs on the contact page only, to protect the form from spam. Privacy policy: https://www.cloudflare.com/privacypolicy/',
        'We do not embed social-media, video, map or advertising services.',
      ],
    },
    {
      id: 'managing',
      title: 'Managing cookies',
      paragraphs: [
        'You can delete or block cookies in your browser settings at any time. If you block the Turnstile check, the contact form cannot be sent; you can email us instead.',
        'If we introduce optional cookies, you will be able to give, change or withdraw your consent at any time in the cookie settings on this page.',
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
