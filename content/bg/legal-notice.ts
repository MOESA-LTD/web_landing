import type { LegalContent } from '../en/legal'

/**
 * Translated by us from content/en/legal-notice.ts; every string is listed in ./unreviewed.ts, except the sections
 * rewritten after the legal review of 2026-11-01, which are listed in ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md).
 * Draft: the status chip keeps the md status value and the open items keep the md marker "OPEN / AÇIK - ".
 * Company facts are unchanged; the address stays as in the package (Latin script) until the owner gives the register form.
 */
const content: LegalContent = {
  meta: {
    path: '/legal-notice',
    title: 'Правна информация | MOESA Ltd.',
    description: 'Правна информация и регистрационни данни за MOESA Ltd.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Правна информация',
    body: 'На тази страница са посочени регистрационните данни на компанията и информация за оператора на уебсайта.',
  },
  sections: [
    {
      id: 'operator',
      title: 'Оператор на уебсайта',
      paragraphs: [
        'MOESA LTD.',
        '1 Petyofi Str., Plovdiv 4000, Bulgaria',
        'ЕИК: 207200475',
        'ИН по ДДС: BG207200475',
        'OPEN / AÇIK - Правната форма (ЕООД или ООД) и вписването в Търговския регистър към Агенцията по вписванията предстои да бъдат потвърдени.',
      ],
    },
    {
      id: 'contact',
      title: 'Контакт',
      paragraphs: [
        'Имейл: info@moesaltd.com',
        'Телефон: +359 88 501 661',
        'OPEN / AÇIK - Телефонният номер предстои да бъде потвърден.',
      ],
    },
    {
      id: 'representative',
      title: 'Законен представител',
      paragraphs: [
        'OPEN / AÇIK - Управителят предстои да бъде потвърден.',
      ],
    },
    {
      id: 'externalLinks',
      title: 'Външни връзки',
      paragraphs: [
        'MOESA не носи отговорност за съдържанието на външни уебсайтове, контролирани от трети страни.',
      ],
    },
    {
      id: 'intellectualProperty',
      title: 'Интелектуална собственост',
      paragraphs: [
        'Съдържанието, дизайнът и елементите на марката на уебсайта не могат да бъдат възпроизвеждани без разрешение, освен когато това е позволено от приложимото законодателство.',
      ],
    },
  ],
  finalCta: {
    title: 'Въпроси относно данните на компанията?',
    body: 'Пишете ни на info@moesaltd.com.',
    cta: {
      label: 'Свържете се с MOESA',
      href: '/contact',
    },
  },
}

export default content
