import type { MessageContent } from '../en/message'

/** Translated by us from content/en/404.ts (approved EN); every string is listed in ./unreviewed.ts. */
const content: MessageContent = {
  meta: {
    path: '/404',
    title: 'Страницата не е намерена | MOESA Ltd.',
    description: 'Търсената от Вас страница не може да бъде намерена.',
  },
  hero: {
    title: 'Страницата не може да бъде намерена.',
    body: 'Адресът може да е променен или връзката да е непълна.',
  },
  next: {
    title: 'Продължете оттук',
    items: [
      'Към началната страница',
      'Разгледайте услугите',
      'Как работим',
      'Свържете се с MOESA',
    ],
  },
  finalCta: {
    title: 'Нужна Ви е помощ, за да намерите точната информация?',
    body: 'Започнете от началната страница или се свържете директно с нас.',
    cta: {
      label: 'Към началната страница',
      href: '/',
    },
  },
}

export default content
