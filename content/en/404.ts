import type { MessageContent } from './message'

/** Verbatim from MOESA_Website_Package_v1.0/content/en/404.md */
const content: MessageContent = {
  meta: {
    path: '/404',
    title: 'Page Not Found | MOESA Ltd.',
    description: 'The page you requested could not be found.',
  },
  hero: {
    title: 'The page could not be found.',
    body: 'The address may have changed, or the link may be incomplete.',
  },
  next: {
    title: 'Continue from here',
    items: [
      'Return to Home',
      'Explore Services',
      'How We Work',
      'Contact MOESA',
    ],
  },
  finalCta: {
    title: 'Need help finding the right information?',
    body: 'Start from the home page or contact us directly.',
    cta: {
      label: 'Return Home',
      href: '/',
    },
  },
}

export default content
