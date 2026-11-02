# MOESA website v1 — decisions taken during implementation

Rulings made on the user's behalf while executing docs/superpowers/plans/2026-10-30-moesa-website.md, in order, each with its cost if wrong. Review and override any of them.

- T10 sitemap expects 14 public routes (all except /thank-you; 404 is not a route) — plan arithmetic error — cost if wrong: one test number.
- content modules (T2) may be extended additively by page tasks, verbatim copy only — page layouts reveal needs T2 can't foresee — cost if wrong: minor churn in content types.
- no-two-adjacent-same-background rule applies to every page, not only Home — DESIGN_NOTES §7.5 flags About too — cost if wrong: small visual deviation from canvas.
- i18n scope = EN + TR both built and enabled (user answered only the slug question; choosing Turkish slugs implies TR goes public), with a runtime flag to hide TR — cost if wrong: flip one flag.
- do not hard-code nitro.preset='vercel' in nuxt.config; Vercel auto-detects the preset at build, local preview/e2e uses default node-server output — resolves reviewer ⚠️ on Playwright webServer — cost if wrong: add NITRO_PRESET env on Vercel.
- DE not built in v1 — no approved DE copy in package; infra allows adding — cost if wrong: add content/de + locale later.
- TR copy from PKG/content/tr only, not canvas i18n.js — same rule as EN copy (approved package is source of truth) — cost if wrong: copy swap per string.
- TR slugs derived from TR md page titles (table in plan) — user chose Turkish slugs, asked me to derive — cost if wrong: edit i18n/routes.ts.
- language switcher = links (URL-based) styled like canvas bar, not canvas's localStorage buttons — SEO/hreflang + spec "prepare for multilingual" — cost if wrong: none functional.
- switcher items are links (hreflang/aria-current) not aria-pressed buttons; EN+TR only; hover added (#EBF5FB/#0069B2) since canvas defines none — cost if wrong: CSS tweak.
- legal status chip keeps package text "DRAFT / TASLAK - LEGAL REVIEW REQUIRED" (canvas now "DRAFT - LEGAL REVIEW REQUIRED") — package is copy source — cost if wrong: one string.
- TR CTA hrefs derive from the EN CTA href (incl. ?service= and #project-form) localized via localizeHref, with TR label — hrefs are not copy; TR md just writes /contact — cost if wrong: TR CTAs prefill service (harmless).
- TR display of collapsed lists — pages render the translated `items` (EN layout) AND the approved `condensed` sentence as the section intro paragraph above the list (no hiding approved TR, no fidelity exclusion); where the sentence merely enumerates the same items verbatim, still show it — approved text beats de-duplication — cost if wrong: some TR sections read slightly redundant until the user approves translations and drops `condensed`.
- TR terminology — new translations keep Turkish terms; loanword mismatch with approved TR (supplier/sourcing/replenishment) is surfaced to the user in the UNREVIEWED review rather than auto-aligned — cost if wrong: a terminology pass on 388 strings.
- band mobile padding — CapabilityStrip/EUBaseSection/FinalCTA must drop to 64px vertical ≤860 (DS intent per DESIGN_NOTES §1.5; DS container rule is dead, same as hero stack ruling) — fix carried into Task 6 dispatch — cost if wrong: canvas-identical 96px on mobile.
- scope to #main — cost if wrong: none.
- home capability line rendered as DS eyebrow "Cross-functional capability" + service title (approved line "…as a cross-functional capability" not verbatim) — accept as DS presentation, disclosed to user — cost if wrong: render approved line verbatim on the card.
- keep TR nav labels from approved TR page titles — package is copy source — cost if wrong: two JSON strings. Amended 2026-10-31 by user decision: the site header uses the short canvas labels "Müşterilerimiz"/"Hakkımızda" (`nav.header.*`, listed in UNREVIEWED_TR); the footer keeps the page titles.
- language dropdown gets Escape/outside-click/route-change close (canvas lacks) — a11y parity with Services disclosure — cost if wrong: none.
- raise header mobile breakpoint to ~1160px so nav never wraps in either locale — wrapped nav is a defect; hamburger on tablets/small laptops is standard — cost if wrong: desktop nav hidden at 960–1160px.
- home hero at ≤859px gives text full width (canvas keeps an empty 37% column due to dead stack rule) — follows 'text only' intent — cost if wrong: CSS tweak.
- no separate task review, covered by final whole-branch review — cost if wrong: none (final review sees it).
- DE slugs derived by controller (table in plan; legal-notice → /de/impressum, privacy → /de/datenschutz) — cost if wrong: edit routes map.
- NUXT_PUBLIC_ENABLE_DE defaults true (consistent with TR) — DE legal pages are unreviewed drafts; README before-launch flags German Impressum/Datenschutz legal review — cost if wrong: flip flag.
- "01" numeral on cyan-ruled cards changed cyan→primary blue for 4.5:1 contrast (DS cyan numeral 2.74:1) — accessibility constraint beats DS decoration — cost if wrong: revert one class (A11y 96). Listed for user.
- Task 11 fix round deferred until Task 12 completes (Task 12 edits claims.test.ts for DE) — then resume Task 11 implementer with I1–I3 + fix mobile DOM order to match visual order — cost if wrong: short delay.
- after Task 11 fix round, run a Task 12 polish round: fix DE minors 2,3,4,5,7,8, Firmennummer→"Unternehmens-ID (EIK)", "Handelsvertretung"→"Vertriebsrepräsentanz" in copy (slug unchanged), header label "Zielgruppen" if it fits else keep, per-locale OPEN chip label in LegalPage (content prefix stays detection key), and 404 for /tr/* and /de/* when that locale is disabled — reviewer judgement + makes ENABLE flags real — cost if wrong: wording swaps.
- no separate re-review of the Task 12 polish round — covered by the final whole-branch review (new middleware explicitly named there) — cost if wrong: none.
- single final fix dispatch covers I1–I3 + README + S2–S6 (all small, reduce launch risk); S1 surfaced to user — cost if wrong: minor extra changes.

## Waiting for user review
- `i18n/UNREVIEWED_TR.md` — TR translations of sections missing from the package + TR UI strings (incl. short header labels "Müşterilerimiz", "Hakkımızda").
- `i18n/UNREVIEWED_DE.md` — all German copy (our translation of approved EN) + DE UI strings (header labels "Zielgruppen", "Über uns").
- Legal drafts (EN/TR/DE): Privacy, Cookie (incl. new `moesa_consent` inventory row), Legal Notice / Impressum (§ 5 DDG fields missing: Geschäftsführer, Registergericht/-nummer; "Unternehmens-ID (EIK)").
- Design deviations: cyan→blue "01" numeral (contrast), home capability card eyebrow presentation, About hero note reuse, /services reuses home needs + capability strip, WWWW guide links, header mobile menu below 1160px, home hero text full-width ≤859px.
- Launch gate: decide the Vercel production env before merging to main (recommended `NUXT_PUBLIC_ENABLE_DE=false` until German legal review; or keep production disconnected).
- Provide an SVG logo; verify Resend domain, Turnstile keys, and run the README post-deploy checklist on the first Vercel preview.
