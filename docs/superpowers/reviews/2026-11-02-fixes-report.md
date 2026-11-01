# Review fixes report: legal pages and TR/DE translations

Date: 2026-11-02 · Branch: `feat/website-v1` (from `dca303d`) · Inputs:
`2026-11-01-legal-pages-review.md`, `2026-11-01-translations-review.md`, the 2026-10-31 rulings.

Status legend: **done** · **partly** (what is left) · **skipped** (why) · **owner** (needs an owner decision or fact,
not changed).

## Commits

| sha | subject |
| --- | --- |
| `1be14e3` | docs: add legal and translation review reports |
| `11049bd` | fix(i18n): apply the TR and DE translation review |
| `afe86fa` | test(e2e): expect the revised DE 404 help heading |
| `81ae4d7` | fix(contact): keep form data out of logs and label the privacy acknowledgement |
| `5d07528` | fix(legal): make the legal pages describe what the site really does |
| `da9821c` | docs(readme): align the cookie, logging and before-launch notes with the code |
| `052696c` | fix(i18n): keep the DE product-development meta description under 160 characters |
| (this file) | docs: add the review fixes report |

## Test results (final tree)

| Check | Result |
| --- | --- |
| `npm run lint` | not defined in package.json (no linter configured) |
| `npm run typecheck` (`nuxt typecheck`) | exit 0 |
| `npx vitest run` | 30 files, **636 passed** |
| `npm run build` | exit 0 |
| `npm run test:acceptance` (built site) | 1 file, **11 passed** |
| `npx playwright test` (port 3100, desktop + mobile) | **521 passed, 0 failed, 31 skipped** (the skips are the existing per-project `test.skip`s; same count as before) |
| re-run after the last DE meta commit: `playwright test content-fidelity-de seo` | 178 passed |

Node 22.16 prints an "unsupported version" warning from Nuxt (wants ^22.21); it does not affect the results.

## How the legal text is tracked

- `content/legal-revisions.ts` lists every legal path whose text we wrote (`LEGAL_REVISIONS`, 40 paths × EN/TR/DE),
  the legal UI keys (`LEGAL_REVISION_UI_KEYS`, 13), and the approved package strings the legal pages dropped
  (`LEGAL_REMOVED`, 41, each with its finding id).
- `npm run unreviewed:legal` renders `i18n/UNREVIEWED_LEGAL.md` (EN/TR/DE side by side, by file and path) for the
  lawyer; a unit test fails if the committed file is stale.
- Tests: `tests/unit/legal-revisions.test.ts` (every listed path exists in all locales, its EN is not package text,
  no double listing with UNREVIEWED_TR/DE, OPEN markers stay in sync); `content.test.ts` / `content-de.test.ts` accept
  a non-package legal string only at a listed path; the e2e fidelity oracle (`tests/e2e/fidelity/extract.ts`) skips
  only the `LEGAL_REMOVED` strings of the three legal md files (commented, scoped exception; unit test proves other
  pages are untouched). The TR privacy/cookie meta descriptions were draft text; the e2e meta check accepts their
  translated replacement only where `LEGAL_REMOVED` lists the md description.
- The "DRAFT / TASLAK - LEGAL REVIEW REQUIRED" chip is unchanged on all nine pages.

## Legal pages review

| Id | Status | What was done |
| --- | --- | --- |
| B1 | partly | Privacy Policy (EN/TR/DE): legal bases per purpose (6(1)(b), (f), (c)), no marketing without separate consent, recipients (Vercel, Plus Five Five/Resend, Cloudflare) as processors under DPAs, US transfers via DPF where the provider participates, otherwise SCCs (Art. 46(2)(c)), copy of the SCCs on request, retention principle + the 10-minute rate-limit memory, new "Required data and automated decisions" section, withdrawal item, Art. 21 objection sentence. **Left OPEN (owner facts):** mailbox provider of info@moesaltd.com (O3), retention periods for enquiries without follow-up, Vercel logs and Resend emails (O4). DPF/SCC status per provider to be confirmed (O9). |
| B2 | done | Cookie Policy: real hero, categories ("Strictly necessary" + "We currently use no preference, analytics or marketing cookies."), consent model, inventory table with `moesa_consent` and Cloudflare Turnstile (provider, category, purpose, duration, privacy link), third-party section, managing section. Turnstile durations are written as "set by Cloudflare"; verify in DevTools (see owner list). |
| B3 | partly | Legal Notice: "UIC (EIK): 207200475", VAT kept, "Content responsibility" section removed. **OPEN (owner facts):** legal form (EOOD/OOD) and the Commercial Register entry, managing director (O1). |
| B4 | done | All drafting instructions replaced by visitor-facing text (privacy/cookie hero, security, updates, "Final wording requires legal review" sentences, TR "Açık alanlar" boxes and the draft TR meta descriptions). Draft chip kept as instructed; remaining OPEN chips mark owner facts only. |
| S1 | done | Data list now matches the code (form fields, technical data, correspondence; "We do not use analytics or advertising tools."); file-upload and analytics claims removed, also from Purposes. |
| S2 | done | Checkbox reworded as an acknowledgement in EN/TR/DE (TR without a suffix after the link, also fixing TR-S3); error text, schema comment and enquiry-email label aligned. Field name `privacy_consent` kept (wire format). Lawyer still chooses the basis (O7). |
| S3 | done | `preferences` category removed from the consent model. Panel shows only Strictly necessary + note and **no buttons** while no analytics id is set, so `moesa_consent` is never written in v1; the Analytics toggle/buttons/banner appear only once `NUXT_PUBLIC_ANALYTICS_ID` is set. Old cookies with `preferences` still parse. Consent unit tests rewritten for both modes. |
| S4 | done | CPDP complaint sentence (address, www.cpdp.bg) in all locales; DE adds the Landesdatenschutzbehörde. |
| S5 | done | `LEGAL_UPDATED` (2026-11-02) in `content/en/legal.ts`, rendered as "Last updated / Son güncelleme / Stand" with `<time>`; cookie "Effective date" section replaced by it. |
| S6 | owner | `vercel.json` **not changed** (instruction). Transfer wording covers the US region either way. |
| S7 | done | README now says when `moesa_consent` is written (never in v1; only after saving a choice once analytics exists). |
| S8 | owner | Vercel env `NUXT_PUBLIC_ENABLE_DE=false` (and possibly TR) until legal review is a deploy decision. |
| S9 | done | Contact route and Turnstile check log only the error message; Resend errors carry only the error name. A preview-deploy log check is still recommended. |
| N1 | skipped | The chip text is the package status marker and is removed at sign-off; translating it now adds churn for no lasting gain. |
| N2 | partly | Panel wrapper has `id="cookie-settings"`. Footer "Cookie settings" link skipped: in v1 there is nothing to choose, so the link would lead to an empty choice. Add it with the first optional cookie. |
| N3 | done | "See also" link Privacy ↔ Cookie Policy in all locales (localised hrefs). |
| N4 | done | TR legal notice: "Şirket sicil no (EIK)", "KDV no"; the approved one-liner with English labels removed. |
| N5 | done | EN "UIC (EIK)". |
| N6 | owner | DPO statement needs the lawyer to confirm Art. 37 does not apply. |
| N7 | owner | TR legal final CTA is approved TR text. |
| O1–O9 | owner | See the list below. |

## Translation review

### TR

| Id | Status | Note |
| --- | --- | --- |
| TR-E1 | done | "E-ticaret operasyonları". |
| TR-S1 | owner | Loanword vs Turkish vocabulary; UNREVIEWED_TR intro now asks for this decision. |
| TR-S2 | done | "Stok yönetimi ve stok yenileme" (5 places). Improves our Turkish variant; if the owner picks loanwords in TR-S1 these change again. |
| TR-S3 | done | Superseded by the S2 acknowledgement sentence ("{link} metnini okudum; …"), no suffix after the link. |
| TR-S4 | done | "yıl dijital ticaret deneyimi" / "yıl profesyonel e-ticaret operasyonu deneyimi"; the stat test now checks whole phrases for TR, verbatim cut for EN. |
| TR-S5 | done | Ölçüm / Analiz / Öneri / Uygulama / Gözden geçirme. |
| TR-S6 | done | contact.ts lines, `company.companyId`/`company.vat` and `footer.companyLine` in tr.json now Turkish (moved to UNREVIEWED_UI_KEYS). |
| TR-S7 … TR-S14 | done | All applied as suggested. |
| TR-S15 | owner | Header label "Müşterilerimiz" vs "Kimler İçin". |
| TR-M1 | done | Sentence case in tr.json labels and the (unrendered) contact field list; "Hedef takvim". |
| TR-M2 | owner | "(opsiyonel)" is in the approved contact.md. |
| TR-M3 | skipped | "Pazar Statüsü." and "Ölç ve geliştir." are approved text fragments (fidelity-checked). |
| TR-M4 | done | Curly ’ is the style of the approved md and of our content; the one straight apostrophe in tr.json (consent) was replaced. |
| TR-M5 … TR-M8 | done | |
| TR-M9 | owner | "final" is approved TR wording; align both or neither. |
| TR-M10 … TR-M14, TR-M16 | done | |
| TR-M15 | done (keep) | Kept as the report allows; converting the approved steps is an owner decision. |
| TR-A1 … TR-A9 | owner | Approved package text, not changed (TR-A7 "Company ID/VAT" done via TR-S6; the "Digital commerce" option label is approved). |

### DE

| Id | Status | Note |
| --- | --- | --- |
| DE-E1 | done | "ein einziges, koordiniertes Team". |
| DE-S1 | done | No "kommerziell" left in content/de or de.json; replacements by context per the report table. |
| DE-S2 | done | "Vertriebsrepräsentanz" in all copy. |
| DE-S3 | owner | Slug `marktzugang-und-handelsvertretung` unchanged (instruction). |
| DE-S4 | done | No "gemanagt". |
| DE-S5 | done | All 9 meta rows; every DE title ≤ 60 and description ≤ 160 characters (product page: "Serienreife" to fit). |
| DE-S6 … DE-S17 | done | |
| DE-S18 | done | `:lang(de)` hyphenation (`hyphens: auto`, `overflow-wrap`) on headings, list items, `dt` and chips; `<html lang>` is set per locale. |
| DE-S19 | owner | Header label "Zielgruppen" vs "Für wen". |
| DE-S20 | done | "Kundeneinblicke", "Voice of the Customer". |
| DE-M1 … DE-M14 | done | |

### UNREVIEWED notes and other items

| Item | Status |
| --- | --- |
| Note 3 (UNREVIEWED_TR accuracy: service options source, company labels) | done (script text; company keys now listed) |
| Note 4 (intro terminology claim) | done |
| Note 5 (stale rulings line on header labels) | done (amended in the rulings file) |
| Per-locale OG image | skipped (optional UI-chrome note, not a finding) |
| Unrendered contact `privacyNote`/`serviceOptions` | unchanged (bulk-approvable; not rendered) |

UNREVIEWED_TR.md, UNREVIEWED_DE.md and UNREVIEWED_LEGAL.md are regenerated and test-enforced.

## Needs owner decision / owner facts

1. **Legal facts (OPEN on the pages):** legal form (ЕООД/ООД) and Commercial Register entry, managing director (O1);
   phone number `+359 88 501 661` looks one digit short (O2); provider of the info@moesaltd.com mailbox and
   `CONTACT_TO` in production (O3); retention periods for enquiries, Vercel logs, Resend emails (O4).
2. **Lawyer:** review all of `i18n/UNREVIEWED_LEGAL.md`; legal basis of the form (acknowledgement vs consent, O7);
   DPF/SCCs per provider and accepted DPAs (O9); Turnstile as strictly necessary without consent (TDDDG § 25(2) /
   Bulgarian practice); DPO statement (N6); KVKK for `/tr` (O5); Impressum regime for `/de` (O6); B2B-only (O8).
3. **Vercel region (S6):** add `"regions": ["fra1"]` to `vercel.json` to run `/api/contact` in the EU, or keep iad1.
4. **Launch gate (S8):** `NUXT_PUBLIC_ENABLE_DE=false` (and maybe TR) in Production until legal review.
5. **Technical check:** DevTools on `/contact` (frame `challenges.cloudflare.com`) for Turnstile storage; adjust the
   inventory duration text if anything is stored. Confirm on a preview deploy that runtime logs hold no form data (S9).
6. **TR terminology (TR-S1):** loanwords (sourcing, supplier, PO, replenishment) or Turkish terms, site-wide.
7. **Header labels:** TR "Müşterilerimiz" vs "Kimler İçin" (TR-S15); DE "Zielgruppen" vs "Für wen" (DE-S19).
8. **DE slug (DE-S3):** rename `marktzugang-und-handelsvertretung` → `…-vertriebsrepraesentanz` with a 301, or keep.
9. **Approved TR text the reviewer flagged:** "(opsiyonel)" (TR-M2), "final" vs "nihai" (TR-M9), TR-A1…A9 incl. the
   generic TR final CTAs on legal pages (N7) and the "Digital commerce" option label.
10. **Footer "Cookie settings" link (N2)** once an optional cookie exists; at sign-off, set `LEGAL_UPDATED` to the
    publication date and remove the draft chip.
