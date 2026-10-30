import type { MessageContent } from './message'

/** Verbatim from MOESA_Website_Package_v1.0/content/en/thank-you.md */
const content: MessageContent = {
  meta: {
    path: '/thank-you',
    title: 'Thank You | MOESA Ltd.',
    description: 'Your enquiry has been sent to MOESA Ltd.',
  },
  hero: {
    title: 'Thank you. Your project brief has been received.',
    body: 'We will review the information and respond using the contact details provided.',
  },
  next: {
    title: 'What happens next',
    items: [
      'The enquiry is reviewed',
      'The relevant service area is identified',
      'Missing information may be requested',
      'A discovery discussion may be proposed',
      'No engagement begins until scope and commercial terms are agreed',
    ],
  },
  info: {
    title: 'Need to add information?',
    body: 'Email additional details to info@moesaltd.com and reference the company or project name used in the form.',
  },
  finalCta: {
    title: 'Continue exploring MOESA.',
    body: 'Review our services or return to the home page.',
    cta: {
      label: 'Explore Services',
      href: '/services',
    },
  },
}

export default content
