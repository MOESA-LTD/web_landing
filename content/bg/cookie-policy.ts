import type { LegalContent } from '../en/legal'

/**
 * Translated by us from content/en/cookie-policy.ts; every string is listed in ./unreviewed.ts, except the sections
 * rewritten after the legal review of 2026-11-01, which are listed in ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md).
 * Draft: the status chip keeps the md status value.
 */
const content: LegalContent = {
  meta: {
    path: '/cookie-policy',
    title: 'Политика за бисквитките | MOESA Ltd.',
    description: 'Информация за бисквитките и сходните технологии, използвани на уебсайта на MOESA.',
  },
  status: 'DRAFT / TASLAK - LEGAL & TECHNICAL REVIEW REQUIRED',
  hero: {
    title: 'Политика за бисквитките',
    body: 'Този уебсайт използва една собствена бисквитка и не използва бисквитки за анализ, реклама или социални мрежи. Тази страница обяснява какво се съхранява на Вашето устройство и как можете да го контролирате.',
  },
  sections: [
    {
      id: 'categories',
      title: 'Категории бисквитки',
      items: [
        'Строго необходими',
      ],
      paragraphs: [
        'Понастоящем не използваме бисквитки за предпочитания, анализ или маркетинг.',
      ],
    },
    {
      id: 'consentModel',
      title: 'Модел на съгласие',
      paragraphs: [
        'Строго необходимите бисквитки и сходните технологии не изискват Вашето съгласие. Не поставяме бисквитки, които не са строго необходими. Ако въведем такава, първо ще поискаме съгласието Ви, като ще можете да откажете и по-късно да промените избора си.',
      ],
    },
    {
      id: 'inventory',
      title: 'Списък на бисквитките',
      paragraphs: [
        'В таблицата по-долу са посочени всички бисквитки и сходни технологии, използвани на този уебсайт.',
      ],
    },
    {
      id: 'thirdParties',
      title: 'Услуги на трети страни',
      paragraphs: [
        'Cloudflare, Inc. (САЩ) хоства този уебсайт и го доставя чрез глобалната си мрежа; хостингът не поставя бисквитки. Cloudflare Turnstile работи само на страницата за контакт, за да защитава формуляра от спам. Политика за поверителност: https://www.cloudflare.com/privacypolicy/',
        'Не вграждаме услуги на социални мрежи, видео, карти или реклама.',
      ],
    },
    {
      id: 'managing',
      title: 'Управление на бисквитките',
      paragraphs: [
        'Можете по всяко време да изтриете или блокирате бисквитките от настройките на браузъра си. Ако блокирате проверката Turnstile, формулярът за контакт не може да бъде изпратен; вместо това можете да ни пишете по имейл.',
        'Ако въведем незадължителни бисквитки, ще можете по всяко време да дадете, промените или оттеглите съгласието си от настройките за бисквитки на тази страница.',
      ],
    },
  ],
  finalCta: {
    title: 'Въпрос относно бисквитките?',
    body: 'Пишете ни на info@moesaltd.com.',
    cta: {
      label: 'Свържете се с MOESA',
      href: '/contact',
    },
  },
}

export default content
