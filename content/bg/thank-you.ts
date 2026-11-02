import type { MessageContent } from '../en/message'

/** Translated by us from content/en/thank-you.ts (approved EN); every string is listed in ./unreviewed.ts. */
const content: MessageContent = {
  meta: {
    path: '/thank-you',
    title: 'Благодарим Ви | MOESA Ltd.',
    description: 'Вашето запитване е изпратено до MOESA Ltd.',
  },
  hero: {
    title: 'Благодарим Ви. Описанието на Вашия проект е получено.',
    body: 'Ще разгледаме информацията и ще Ви отговорим, като използваме посочените данни за контакт.',
  },
  next: {
    title: 'Какво следва',
    items: [
      'Запитването се разглежда',
      'Определя се съответната област на услугите',
      'Може да бъде поискана липсваща информация',
      'Може да бъде предложен проучвателен разговор',
      'Работата не започва, преди да бъдат договорени обхватът и търговските условия',
    ],
  },
  info: {
    title: 'Искате да добавите информация?',
    body: 'Изпратете допълнителните подробности на info@moesaltd.com и посочете името на компанията или проекта, използвано във формуляра.',
  },
  finalCta: {
    title: 'Научете повече за MOESA.',
    body: 'Прегледайте нашите услуги или се върнете на началната страница.',
    cta: {
      label: 'Разгледайте услугите',
      href: '/services',
    },
  },
}

export default content
