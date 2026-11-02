# Legal pages review: Privacy Policy, Cookie Policy, Legal Notice / Impressum (EN, TR, DE)

Date: 2026-11-01 · Branch: `feat/website-v1` · Scope: read-only review of what the code actually does and what the legal pages say about it.

> This is a practical pre-launch compliance check to prepare the conversation with a lawyer. It is **not legal advice**.

## Summary

- **The pages render correctly and faithfully.** EN matches the approved package text word for word. DE is a faithful translation of EN (one accurate addition, "(EIK)"). TR is the approved TR package text plus translated EN sections, with the TR-only `condensed` field rendered as designed. Draft chips, OPEN chips, mailto links and localized CTA links all work (`tests/unit/legal-pages.test.ts` and `tests/unit/consent.test.ts`: 51/51 pass).
- **The content itself is not publishable.** The approved EN source is an *implementation draft*. It contains internal drafting instructions ("Use appropriate technical and organisational measures…", "Explain browser controls…", "State the effective date…") and OPEN placeholders where GDPR Art. 13 requires actual information (legal bases, recipients, transfers, retention). The site is live-capable: the contact form collects personal data and sends it through US processors. Publishing these pages as they are would not meet Art. 13 in any locale.
- **The technical stack is clean and simple to describe.** There is no analytics, no marketing, no Google Fonts and no CDN other than Vercel. There is one first-party cookie (`moesa_consent`), and the only third-party script is Cloudflare Turnstile on the contact pages. The final text can therefore be short and accurate. Ready-to-adapt wording is included below.
- **Company identification is incomplete** for a Bulgarian company (Bulgarian E-Commerce Act Art. 4 / e-Commerce Directive Art. 5) and for the German "Impressum" label (§ 5 DDG). The legal form, the managing director and the register entry are missing. The phone number also looks one digit short.

Counts: **Blocker 4 · Should fix 9 · Nice to have 7 · Needs owner/lawyer input 9**

Company facts used for this review (package `legal-notice.md`, `content/*/contact.ts`): MOESA LTD., 1 Petyofi Str., Plovdiv 4000, **Bulgaria**; Company ID (UIC/EIK) 207200475; VAT BG207200475; info@moesaltd.com; +359 88 501 661. Lead supervisory authority for an establishment in Bulgaria: **Commission for Personal Data Protection (CPDP, Комисия за защита на личните данни)**, 2 Prof. Tsvetan Lazarov Blvd., 1592 Sofia, www.cpdp.bg, kzld@cpdp.bg.

---

## Blocker before launch

### B1. Privacy Policy lacks the information GDPR Art. 13 requires (all locales)
- **Files:** `content/en/privacy-policy.ts:51` (legal bases), `:58` (recipients), `:65` (transfers), `:72` (retention), `:78-86` (rights). TR: `content/tr/privacy-policy.ts:52,59,66,73,79-87`. DE: `content/de/privacy-policy.ts:55,62,69,76,82-90`.
- **What's wrong:** Every mandatory Art. 13 element except controller identity and contact is OPEN or missing:
  - no legal basis per purpose (Art. 13(1)(c));
  - no recipients or processors (13(1)(e));
  - no third-country transfer safeguard (13(1)(f));
  - no retention period (13(2)(a));
  - no right to withdraw consent, although the contact form relies on consent (13(2)(c));
  - no named supervisory authority (13(2)(d), see S4);
  - no statement on whether providing data is required (13(2)(e));
  - no automated decision-making statement (13(2)(f)).
- **Evidence (what the site actually processes):**
  - Contact form fields, validated in `server/utils/contact-schema.ts:184-207`: name, company, country, work_email, service, project_brief, privacy_consent, optional product_category / target_market / estimated_volume / target_timeline, the Turnstile token, a honeypot and the locale.
  - The enquiry is emailed through **Resend** to `CONTACT_TO` (default info@moesaltd.com), with the visitor's address as Reply-To (`server/utils/email.ts:79-92`).
  - **Cloudflare Turnstile** receives the token and the visitor **IP** (`server/api/contact.post.ts:110`, `server/utils/turnstile.ts:113-116`).
  - The visitor IP is held in memory for 10 minutes for rate limiting (`contact.post.ts:80`, `server/utils/rate-limit.ts`).
  - **Vercel** hosts the site and runs the function. `vercel.json` sets no `regions`, so functions run in Vercel's default US region (iad1). Vercel keeps request logs (README "Third-party inventory").
  - The mailbox that receives info@moesaltd.com is a further processor (provider unknown, see O3).
- **Fix:** Replace the OPEN and instruction paragraphs with real text. Wording to adapt with counsel (EN; DE and TR to be translated from the final EN):
  - *Legal bases:* "We process enquiry data to answer your request and to take steps before a possible contract (Art. 6(1)(b) GDPR) and on the basis of our legitimate interest in responding to business enquiries (Art. 6(1)(f)). Server logs, spam protection (Cloudflare Turnstile) and rate limiting are based on our legitimate interest in operating a secure website (Art. 6(1)(f)). We keep records where the law requires it (Art. 6(1)(c))." *(See S2 for the consent checkbox.)*
  - *Recipients / processors:* "Vercel Inc. (hosting, content delivery, server logs; USA); Resend / Plus Five Five, Inc. (email delivery of form enquiries; USA); Cloudflare, Inc. (Turnstile spam protection on the contact page; USA); [mailbox provider] (our email). Each acts as our processor under a data processing agreement."
  - *Transfers:* "These providers may process data in the United States. Transfers rely on the EU–US Data Privacy Framework where the provider is certified, and otherwise on the European Commission's Standard Contractual Clauses (Art. 46(2)(c) GDPR)." Verify each provider on dataprivacyframework.gov.
  - *Retention:* "Enquiries and related correspondence: [24 months after the last contact] unless a business relationship follows, in which case statutory retention periods apply. Server logs: per Vercel's log retention for our plan [x days]. Rate-limit data: in server memory for up to 10 minutes."
  - *Provision:* "Fields marked as required are necessary to answer your enquiry. Without them we cannot respond. Providing data is not a statutory or contractual requirement."
  - *Automated decisions:* "We do not use automated decision-making or profiling."
  - *Rights list:* add "Withdraw consent at any time, without affecting the lawfulness of processing before withdrawal" (if any consent remains) and "Object to processing based on legitimate interests (Art. 21)" as an explicit, separately highlighted sentence.

### B2. Cookie Policy has no operative content and does not mention Turnstile (all locales)
- **Files:** `content/en/cookie-policy.ts:17-24` (categories), `:30` (consent model), `:37` (inventory OPEN), `:44` (third parties OPEN), `:51` (managing = instruction), `:58` (effective date OPEN). TR `content/tr/cookie-policy.ts:17-24,31,38,45,52,59`. DE `content/de/cookie-policy.ts:21-26,33,40,47,54,61`.
- **What's wrong:**
  - The only concrete content is the `moesa_consent` row injected by `app/pages/cookie-policy.vue:32-37`. It is correct: first party, strictly necessary, 180 days, matching `CONSENT_MAX_AGE` in `app/composables/useConsent.ts:17`.
  - The **Cloudflare Turnstile** script and iframe from `challenges.cloudflare.com` load on `/contact` (`app/pages/contact.vue:21-22`, CSP `nuxt.config.ts:26-27`). They read browser and device signals, which is access to terminal equipment under ePrivacy Art. 5(3) / Bulgarian Electronic Communications Act. Turnstile is not disclosed anywhere.
  - The "Consent model" and "Managing cookies" sections read as obligations for the developer, not as information for the user.
- **Fix (EN wording to adapt):**
  - *Intro:* "This website uses one first-party cookie and no analytics, advertising or social-media cookies."
  - *Table rows:*
    - `moesa_consent` (first party, strictly necessary, stores your cookie choices, 180 days, set only when you save a choice).
    - "Cloudflare Turnstile (third party, challenges.cloudflare.com, contact page only): checks that a form submission comes from a human. Turnstile evaluates technical browser signals and your IP address and may store short-lived technical data in its frame. This is strictly necessary to protect the form from spam. Privacy: https://www.cloudflare.com/privacypolicy/". Before writing durations, confirm in DevTools (Application tab, frame `challenges.cloudflare.com`) whether any `cf_chl_*` or other storage is set.
  - *Managing:* "You can change your choice at any time in the Cookie preferences panel on this page [link #cookie-settings] and delete cookies in your browser settings."
  - *Effective date:* the real date.
  - Have the lawyer confirm that Turnstile without prior consent is defensible as strictly necessary. That is the usual position, but the German TDDDG § 25(2) and Bulgarian practice should be confirmed.

### B3. Legal Notice / Impressum is missing mandatory company identification (all locales, DE most acute)
- **Files:** `content/en/legal-notice.ts:20-23` (operator), `:38` (representative OPEN), `:45` (content responsibility OPEN). TR `content/tr/legal-notice.ts:19-24,40,47`. DE `content/de/legal-notice.ts:25-28,43,50` (page title "Impressum", `:12`).
- **What's wrong:**
  - **No legal form.** "MOESA LTD." does not say whether it is an ООД (OOD) or ЕООД (EOOD).
  - **No representative.** The managing director (управител / Geschäftsführer) is not named.
  - **No register.** The page should say: Commercial Register and Register of Non-Profit Legal Entities, Registry Agency (Агенция по вписванията), UIC/EIK 207200475.
  - These are required by the Bulgarian E-Commerce Act (ЗЕК) Art. 4, which transposes e-Commerce Directive Art. 5 and governs a Bulgarian provider under the country-of-origin principle. For the German page, § 5(1) Nos. 1, 4 DDG require the same items. The VAT ID (§ 5(1) No. 6 DDG) and email are present.
  - § 18(2) MStV: likely **not** required while the site has no journalistic/editorial content (no blog or news). Recheck if a news or insights section is added.
  - An **EU ODR platform link is not present** (good: the ODR platform closed on 20 July 2025, so do not add one).
- **Fix (EN; DE in brackets):**
  ```
  MOESA [EOOD/OOD — confirm] (MOESA LTD.)
  Registered office: 1 Petyofi Str., 4000 Plovdiv, Bulgaria
  Managing director [Geschäftsführer]: [name]
  Registered in the Commercial Register of the Registry Agency of the Republic of Bulgaria, UIC (EIK) 207200475
  [Eingetragen im Handelsregister der Agentur für Eintragungen (Agentsia po vpisvaniyata), Bulgarien, EIK 207200475]
  VAT ID [USt-IdNr.]: BG207200475
  Email: info@moesaltd.com · Phone: [verified number]
  ```
  Replace the "Content responsibility" OPEN note with nothing (delete the section), or with a sentence the lawyer approves.

### B4. User-facing pages publish internal drafting instructions and "DRAFT / OPEN" chips (all locales)
- **Files:**
  - Hero: EN privacy `:13` ("Implementation draft… must receive legal review before publication"), EN cookie `:13`.
  - Security: EN privacy `:92` ("Use appropriate technical and organisational measures. Final wording must match the actual system."); TR `:93` ("…önlemler alın"); DE `:96` ("…einsetzen").
  - Updates: EN privacy `:106` ("State the effective date and explain…"); TR `:107`; DE `:110`.
  - External links / IP: EN legal-notice `:44,51` ("Final wording requires legal review."); same in TR `:47,54`, DE `:56,63`.
  - Rendered as chips in `app/components/legal/LegalPage.vue:58-60,89-95`. TR "Açık alanlar" box at `:65-76`.
- **What's wrong:** These sentences tell the visitor that the policy is not final and give orders ("Use…", "State…", "Explain…"). A policy that says it is unreviewed provides no reliable information, and a regulator or competitor will read it that way. This is the publication gate the package itself sets (Build Spec §11 and §166, `LEGAL_IMPLEMENTATION_NOTES.md`).
- **Fix:** Do not point production traffic at these pages until B1–B3 are resolved and the text is final. Then remove the status chip, all `OPEN / AÇIK - ` paragraphs and the TR `openFields` sections (the README already lists this step).
  - *Security wording:* "We protect data with encryption in transit (HTTPS/HSTS), restrictive security headers, access-restricted accounts at our providers, spam protection and rate limiting."
  - *Updates wording:* "Effective date: [date]. We may update this policy when our services or legal requirements change. The current version is always published on this page."
  - If go-live cannot wait: keep production disconnected or noindex, per rulings line 40.

---

## Should fix

### S1. The privacy policy lists data and processing the site does not do (all locales)
- **Files:** EN privacy `:30` "Files submitted by users", `:32` "Cookie and analytics data if enabled", `:44` "Analytics only if lawfully implemented". TR `:31,33,45`. DE `:34,36,48`.
- **Evidence:**
  - There is no file input. See `app/components/forms/ContactForm.vue:23` ("No file input (v1)"); the schema has no file field.
  - No analytics loader exists. `nuxt.config.ts:16,104` sets `analyticsId` empty, the CSP has no analytics origin, and `package.json` has no analytics dependency.
- **Fix:** Replace the list with: "Contact-form data (name, company, work email, country, service of interest, project brief and, if you provide them, product category, target market, estimated volume and target timeline); technical data (IP address, browser user agent, time of request) in server logs and for spam protection; correspondence that follows your enquiry. We do not use analytics or advertising tools." Add file upload and analytics back only when they are implemented.

### S2. The contact-form checkbox is framed as consent and is mandatory, but no withdrawal is described (all locales)
- **Files:** `i18n/locales/{en,tr,de}.json` `form.consent`; `server/utils/contact-schema.ts:198` (required); `server/utils/email.ts:33` ("Privacy consent: given (to respond to this enquiry only)").
- **What's wrong:** Answering an enquiry is better based on Art. 6(1)(b)/(f). A mandatory consent checkbox bundles consent with the service (Art. 7(4)). If consent stays the basis, the policy must describe withdrawal (Art. 7(3), 13(2)(c)).
- **Fix (lawyer to choose):** Reword the checkbox as an acknowledgement:
  - EN: "I have read the {link} and understand that MOESA will use my details to respond to this enquiry."
  - TR: "{link}'nı okudum; MOESA'nın bilgilerimi bu talebe yanıt vermek için kullanacağını anlıyorum."
  - DE: "Ich habe die {link} gelesen und weiß, dass MOESA meine Angaben zur Beantwortung dieser Anfrage verwendet."
  
  Align the email label in `email.ts:33` with the new wording. Keep "no marketing without separate consent" (`contact_form.json` rule) and say so in the policy.

### S3. The consent panel offers toggles that do nothing, and the categories list cookies that do not exist (all locales)
- **Files:** `app/components/legal/CookieConsent.vue:146-150` (Preferences, Analytics toggles); `app/pages/cookie-policy.vue:57-61` (panel always shown); cookie-policy categories EN `:17-24` (Preferences, Analytics, Marketing).
- **What's wrong:** No preference or analytics cookie exists (`useConsent.ts:1-6`). Asking users to consent to non-existent categories is misleading and invites "what are these?" questions. The categories section suggests these cookies are used.
- **Fix:** Until a non-essential tool exists, show only "Strictly necessary (always on)" in the panel and policy, plus the sentence "We currently use no preference, analytics or marketing cookies." Alternatively, keep the toggles but label them "(not currently used)". Re-introduce the categories together with the first analytics loader.

### S4. No supervisory authority is named (all locales)
- **Files:** EN privacy `:85`, TR `:86`, DE `:89`.
- **Fix:** "You can lodge a complaint with the Bulgarian Commission for Personal Data Protection (CPDP), 2 Prof. Tsvetan Lazarov Blvd., 1592 Sofia, www.cpdp.bg, or with the supervisory authority of your EU country of residence or work." For DE add: "…z. B. bei der für Ihren Wohnsitz zuständigen deutschen Landesdatenschutzbehörde."

### S5. No effective or last-updated date on any legal page (all locales)
- **Files:** EN cookie `:58` (OPEN), EN privacy `:106` (instruction), legal notice none; TR and DE same.
- **Fix:** Add one "Effective date / Yürürlük tarihi / Stand" line per page, with the same date in all three locales and set on the day the final text goes live. Optionally render it from one constant so EN, TR and DE cannot diverge.

### S6. Processing location: functions run in the US by default
- **File:** `vercel.json` (no `regions`).
- **What's wrong:** The `/api/contact` function, which handles all form data, runs in Vercel's default region, Washington DC (iad1).
- **Fix:** Add `"regions": ["fra1"]` to `vercel.json` (Frankfurt) so form data is processed in the EU. Vercel, Resend and Cloudflare remain US companies, so B1's transfer wording is still needed. Also check whether Resend is using its EU sending region.

### S7. The README contradicts the code about when `moesa_consent` is written
- **File:** `README.md` "Third-party inventory" ("only written when the consent banner is enabled via `NUXT_PUBLIC_ANALYTICS_ID`").
- **Evidence:** The Cookie Policy page always renders `<CookieConsent mode="panel">` (`app/pages/cookie-policy.vue:59`). Its buttons call `save()`, which writes the cookie (`useConsent.ts:51-55`), whatever the analytics id.
- **Fix:** Change the README to "written when a visitor saves a choice (Cookie Policy panel, or the banner once enabled)". Use the same fact in the cookie table (B2).

### S8. German launch gate: DE legal pages are unreviewed but enabled by default
- **Files:** `nuxt.config.ts:8-9` (`localeOptionsFromEnv`), rulings line 28 (`NUXT_PUBLIC_ENABLE_DE` defaults true), rulings line 40, README "German legal review before the DE launch".
- **Fix:** Set `NUXT_PUBLIC_ENABLE_DE=false` in Vercel Production until the German Impressum and Datenschutzerklärung are reviewed. Apply the same reasoning to TR if KVKK questions (O5) are open.

### S9. Server logs: check what the error logs contain
- **Files:** `server/api/contact.post.ts:123` (`console.error(..., err)` on a Resend failure), `server/utils/turnstile.ts:120`.
- **What's wrong:** Vercel runtime logs keep these entries. The Resend error object normally holds no form data, but confirm on a preview deploy. The dev-only `console.info` with the full form data (`contact.post.ts:117`) is guarded by `isDev()` and is fine.
- **Fix:** No code change needed if the preview check confirms this. State the log retention in B1's retention text.

---

## Nice to have

- **N1. Translate or localize the draft chip** (all non-EN): the chip always shows the English/Turkish package string "DRAFT / TASLAK - LEGAL REVIEW REQUIRED". On `/de/*` that reads oddly (`LegalPage.vue:59`, DE `privacy-policy.ts:14`). This is moot once B4 removes the chips.
- **N2. Cookie settings link:** Add a "Cookie settings" footer link (`app/components/layout/SiteFooter.vue:45-46`) pointing at an anchor on the panel, e.g. `/cookie-policy#cookie-settings`. Give the panel wrapper `id="cookie-settings"` in `cookie-policy.vue:58`. This makes withdrawal "as easy as giving" visible from every page.
- **N3. Cross-links:** Privacy policy → Cookie Policy ("see our Cookie Policy") and Cookie Policy → Privacy Policy, both via `useLocalizedHref`. Currently neither page links to the other.
- **N4. TR legal notice labels** (`content/tr/legal-notice.ts:21-23,227` condensed): the approved TR text keeps "Company ID" / "VAT" in English with no colon. Consider "Şirket sicil no (EIK): 207200475", "KDV no: BG207200475" once the TR text is reviewed.
- **N5. EN "Company ID":** consider "UIC (EIK)" to match the DE "Unternehmens-ID (EIK)" (`content/en/legal-notice.ts:22`). The DE addition is accurate and approved in rulings line 31.
- **N6. DPO statement:** One line, "We have not appointed a data protection officer, as this is not required for our processing. Contact info@moesaltd.com for all privacy requests.", avoids follow-up questions. Lawyer to confirm Art. 37 does not apply.
- **N7. TR final CTA:** TR legal pages end with the generic "Projeyi görüşelim." CTA from the approved TR md (`content/tr/privacy-policy.ts:119`), while EN and DE end with "Privacy question? Contact info@…". This is by design (approved TR source), but a privacy-specific CTA would be more consistent.

---

## Needs owner/lawyer input

| # | Question | Why it matters / where |
|---|---|---|
| O1 | **Exact legal form and registered name** (ЕООД or ООД; Bulgarian name in Cyrillic), **managing director(s)**, and confirmation that the register entry is the Registry Agency Commercial Register under EIK 207200475 | B3; all three legal-notice files and the privacy "Controller" section |
| O2 | **Phone number:** `+359 88 501 661` has 6 digits after the mobile prefix 88; Bulgarian mobile numbers have 7 (e.g. +359 88 XXX XXXX). Please confirm the number | `content/*/legal-notice.ts` (EN `:31`), `content/*/contact.ts`, footer; the package source has the same value |
| O3 | **Who hosts the info@moesaltd.com mailbox** (Google Workspace, Microsoft 365, a Bulgarian host…) and is `CONTACT_TO` = info@moesaltd.com in production? | Recipient/processor and transfer disclosure (B1) |
| O4 | **Retention periods:** enquiries with no follow-up, correspondence after a deal, Vercel log retention on your plan, Resend's stored-email retention on your plan | B1 retention section |
| O5 | **KVKK (Turkey):** does MOESA actively target Turkish data subjects via `/tr`? If yes, the lawyer should advise on (a) a KVKK Art. 10 *aydınlatma metni* (controller identity and representative, purposes, to whom and why data is transferred, collection method and legal basis, Art. 11 rights), (b) cross-border transfer under amended KVKK Art. 9 (standard contract plus notification to the Board), and (c) whether VERBİS registration applies to a foreign controller. If the GDPR policy is extended instead, the TR page should at least name the controller, purposes, legal bases, recipients abroad and Art. 11 rights in Turkish | TR privacy policy; S8 gate |
| O6 | **Which Impressum regime:** a Bulgarian provider is governed by Bulgarian ZEK Art. 4 under the country-of-origin rule. Does the lawyer still want the full German § 5 DDG format and the "Impressum" label on `/de/impressum`? The content needed is nearly identical (B3) | DE legal notice |
| O7 | **Legal basis for the form:** consent vs. Art. 6(1)(b)/(f) (S2) | Checkbox wording in all three locales |
| O8 | **B2B only?** Is the site aimed only at businesses? If consumers can use it, consumer-information duties increase (still no ODR link; that platform has been closed since 20 July 2025) | Legal notice, privacy |
| O9 | **Transfer mechanism per provider:** confirm the DPF certification or SCCs in the signed DPAs of Vercel, Resend and Cloudflare, and that each DPA is accepted in the account | B1 transfers |

---

## Translation fidelity (TR, DE vs approved EN)

- **EN vs package:** identical text for all three pages (status, hero, sections, CTA). Verified against `MOESA_Website_Package_v1.0/.../content/en/*.md`.
- **DE vs EN:** all obligations, names, emails, numbers and section order match. Differences:
  - "Unternehmens-ID (EIK)" and "USt-IdNr." (accurate; rulings line 31);
  - "Impressum" as the title of "Legal Notice";
  - hero "Diese Seite enthält die Registerangaben…" (faithful).
  - No added or dropped obligations.
- **TR vs EN:**
  - The TR approved md has only "Kapsam" / "Kategoriler" / "Şirket" / "İletişim" plus "Açık alanlar". Every other TR section is a faithful translation of EN, listed in `content/tr/unreviewed.ts`. The `condensed` one-liners are the approved TR text (by design).
  - The **TR cookie status** reads "DRAFT / TASLAK - LEGAL REVIEW REQUIRED" (`content/tr/cookie-policy.ts:10`), while EN and DE read "…LEGAL **& TECHNICAL** REVIEW REQUIRED". This follows the approved TR md, so it is not a translation error. Moot after B4.
  - TR meta descriptions and final CTAs come from the approved TR md and differ in content from EN by design.
  - No numbers, emails, durations or names differ.

## Rendering

- Draft chip on all 9 pages; OPEN chips with locale labels (Open / Açık / Offen); TR "Açık alanlar" summary box. Correct per `LegalPage.vue`. Tests pass.
- Final CTA links localize: `/contact`, `/tr/iletisim`, `/de/kontakt` (asserted in `tests/unit/legal-pages.test.ts:74,118,160`). Email renders as a mailto link.
- Routes: `/privacy-policy`, `/tr/gizlilik-politikasi`, `/de/datenschutz`; `/cookie-policy`, `/tr/cerez-politikasi`, `/de/cookie-richtlinie`; `/legal-notice`, `/tr/yasal-bildirim`, `/de/impressum` (`i18n/routes.ts:122-135`). Footer legal links and the contact form's privacy link use `localizeHref`.
- No last-updated date on any page (S5). No cookie-settings deep link (N2). No privacy ↔ cookie cross-links (N3).

## Third-party / cookie / storage inventory

| Item | Used in code? | Evidence | Disclosed EN | Disclosed TR | Disclosed DE |
|---|---|---|---|---|---|
| Vercel (hosting, CDN, function, request logs; US, default region iad1) | Yes | README; `vercel.json`; `/api/contact` server route | No ("hosting provider" only as OPEN) | No | No |
| Resend (sends enquiry email; US) | Yes | `server/utils/email.ts:83-91` | No ("form/email provider" OPEN) | No | No |
| Cloudflare Turnstile (script + iframe on /contact; IP sent on verify) | Yes, when site key set | `app/pages/contact.vue:21-22`; `turnstile.ts:113-116`; CSP `nuxt.config.ts:26-27` | No | No | No |
| Mailbox provider for info@moesaltd.com | Yes (receives enquiries) | `email.ts:8`, `CONTACT_TO` | No | No | No |
| In-memory IP rate limit (10 min) | Yes | `contact.post.ts:80`; `rate-limit.ts` | No (only "Website security and operation" purpose) | No | No |
| `moesa_consent` cookie (1st party, strictly necessary, 180 d, SameSite=Lax, Secure on HTTPS) | Yes, written on saving a choice in the Cookie Policy panel (or banner, if enabled) | `useConsent.ts:16-17,34-36,51-55` | Yes (inventory row) | Yes | Yes |
| Turnstile frame storage / `cf_chl_*` (challenges.cloudflare.com) | Possibly (third-party frame), verify in DevTools | Turnstile iframe | No | No | No |
| i18n locale cookie | No (`detectBrowserLanguage: false`, `nuxt.config.ts:142`) | n/a | n/a | n/a | n/a |
| localStorage / sessionStorage / IndexedDB | No (grep: none in `app/`, `server/`, `shared/`) | n/a | n/a | n/a | n/a |
| Analytics (any) | No (`analyticsId` empty, no loader, no CSP origin) | `nuxt.config.ts:16,104` | Mentioned as "if enabled" (should be removed, S1) | Same | Same |
| Marketing cookies | No | — | Listed as category "only if implemented" (S3) | Same | Same |
| Google Fonts / font CDN | No (self-hosted `@fontsource-variable/manrope`, CSP `font-src 'self'`) | `package.json`; `nuxt.config.ts:31` | n/a | n/a | n/a |
| Other CDNs / embeds (YouTube, maps, social) | No (CSP `default-src 'self'`, `img-src 'self' data:`) | `nuxt.config.ts:24-35` | n/a | n/a | n/a |
| File upload | No (no file input in v1) | `ContactForm.vue:23`; schema | Disclosed as collected (wrong, S1) | Same | Same |
