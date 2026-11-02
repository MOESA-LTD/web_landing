import type { LegalContent } from '../en/legal'

/**
 * From content/approved/tr/cookie-policy.md, plus the translations listed in ./unreviewed.ts.
 * The draft sections were rewritten after the legal review of 2026-11-01, in step with EN: those strings are listed in
 * ../legal-revisions.ts (i18n/UNREVIEWED_LEGAL.md), as are the removed package strings. Legal pages stay drafts until
 * legal review.
 */
const content: LegalContent = {
  meta: {
    path: '/cookie-policy',
    title: 'Çerez Politikası | MOESA Ltd.',
    description: 'MOESA web sitesinde kullanılan çerezler ve benzer teknolojiler hakkında bilgiler.',
  },
  status: 'DRAFT / TASLAK - LEGAL REVIEW REQUIRED',
  hero: {
    title: 'Çerez Politikası',
    body: 'Bu web sitesi tek bir birinci taraf çerezi kullanır; analitik, reklam veya sosyal medya çerezi kullanmaz. Bu sayfa, cihazınızda neyin saklandığını ve bunu nasıl kontrol edebileceğinizi açıklar.',
  },
  sections: [
    {
      id: 'categories',
      title: 'Kategoriler',
      items: [
        'Zorunlu',
      ],
      paragraphs: [
        'Şu anda tercih, analitik veya pazarlama çerezi kullanmıyoruz.',
      ],
    },
    {
      id: 'consentModel',
      title: 'Onay modeli',
      paragraphs: [
        'Zorunlu çerezler ve benzer teknolojiler onayınızı gerektirmez. Zorunlu olmayan hiçbir çerez kullanmıyoruz. Böyle bir çerez eklersek önce onayınızı isteriz; onayı reddedebilir ve tercihinizi daha sonra değiştirebilirsiniz.',
      ],
    },
    {
      id: 'inventory',
      title: 'Çerez envanteri',
      paragraphs: [
        'Aşağıdaki tablo, bu web sitesinde kullanılan tüm çerezleri ve benzer teknolojileri listeler.',
      ],
    },
    {
      id: 'thirdParties',
      title: 'Üçüncü taraf hizmetler',
      paragraphs: [
        'Cloudflare, Inc. (ABD) bu web sitesini barındırır ve küresel ağı üzerinden sunar; barındırma çerez yerleştirmez. Cloudflare Turnstile yalnızca iletişim sayfasında, formu spama karşı korumak için çalışır. Gizlilik politikası: https://www.cloudflare.com/privacypolicy/',
        'Sosyal medya, video, harita veya reklam hizmetleri yerleştirmiyoruz.',
      ],
    },
    {
      id: 'managing',
      title: 'Çerezlerin yönetimi',
      paragraphs: [
        'Çerezleri tarayıcı ayarlarınızdan istediğiniz zaman silebilir veya engelleyebilirsiniz. Turnstile kontrolünü engellerseniz iletişim formu gönderilemez; bunun yerine bize e-posta gönderebilirsiniz.',
        'İsteğe bağlı çerezler eklersek onayınızı bu sayfadaki çerez ayarlarından istediğiniz zaman verebilir, değiştirebilir veya geri çekebilirsiniz.',
      ],
    },
  ],
  finalCta: {
    title: 'Projeyi görüşelim.',
    body: 'İhtiyacınızı ve mevcut durumu paylaşın.',
    cta: {
      label: 'İletişime Geçin',
      href: '/contact',
    },
  },
}

export default content
