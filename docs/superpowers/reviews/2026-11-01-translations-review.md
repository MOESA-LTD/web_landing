# MOESA website v1 — TR / DE translation review (non-legal)

Date: 2026-11-01 · Branch: `feat/website-v1` · Read-only review, nothing changed in source.
Scope: all Turkish and German copy except the three legal pages (privacy-policy, cookie-policy, legal-notice), which are reviewed separately.
Sources compared: approved EN (`MOESA_Website_Package_v1.0/.../content/en/*.md` = `content/en/*.ts`), approved TR (`.../content/tr/*.md`), `content/{tr,de}/**/*.ts`, `i18n/locales/{tr,de}.json`, `content/de/site.ts`, `i18n/routes.ts`, the UNREVIEWED lists and the 2026-10-31 rulings.

## Summary

| Locale | Error | Should improve | Minor | Approved-text observations (not counted) |
| --- | --- | --- | --- | --- |
| TR | 1 | 15 | 16 | 9 |
| DE | 1 | 20 | 14 | — |

**Overall.** Both translations are faithful. I found no wrong numbers, emails, phone, address, company IDs, country lists or service names, and no added guarantees or overclaims. The "no guarantee", "not claimed as available" and "roles defined separately" disclaimers survive in both languages. TR is consistently in the "siz" form with correct Turkish characters. DE is consistently formal "Sie" (no du/dein anywhere).

The main problems are register and terminology:

- **DE:** the adjective *kommerziell* appears about 45 times as a word-for-word copy of the English "commercial" ("kommerzielles Ziel", "kommerzielle Machbarkeit", "kommerzielle Übergabe"). Idiomatic business German says *Geschäftsziel*, *wirtschaftliche Machbarkeit*, *kaufmännische Übergabe*. This one pattern does more than anything else to make the German read as translated. There is also some leftover "kommerzielle Vertretung" where the ruling standardised on "Vertriebsrepräsentanz", the Denglish "gemanagt", and 9 of 13 DE meta titles/descriptions are over the length limits.
- **TR:** the approved TR uses loanwords (sourcing, supplier, replenishment, PO), while our translations use Turkish terms (tedarik, tedarikçi, ikmal, satın alma siparişi). Because the approved `condensed` sentence is shown directly above the translated list, the two vocabularies appear side by side on the same section. The owner needs to pick one (see the TR glossary).

**Slugs.** All TR and DE slugs are lowercase ASCII and natural. The one exception is the DE slug `marktzugang-und-handelsvertretung`, which still uses the term the copy dropped. *Handelsvertretung* is also a legal status under German law (§ 84 HGB).

**Unreviewed lists.** My script check found them complete: every non-legal TR page string is either verbatim in the package TR md or listed, and every `de.json` key is listed. There are three small accuracy notes (see the last section).

---

## TR — Turkish

### Error (meaning wrong/missing)

| # | file:line | Current | Suggested | Reason |
| --- | --- | --- | --- | --- |
| TR-E1 | `content/tr/who-we-work-with.ts:54` | Ticari operasyonlar | E-ticaret operasyonları | EN "Commerce operations" (digital channel operations). Across the TR site "ticari operasyonlar" is the fixed rendering of "commercial operations", MOESA's whole operating scope. The two concepts get conflated. The approved condensed line above it (`:47`) says "commerce operasyonları". |

### Should improve (wording/register/consistency)

| # | file:line | Current | Suggested | Reason |
| --- | --- | --- | --- | --- |
| TR-S1 | systemic: `services/sourcing-managed-procurement.ts:32↔39, :57↔59`; `services/operations-supply-chain.ts:32↔42`; `services/digital-commerce-commercial-intelligence.ts:25,36↔31,47`; `who-we-work-with.ts:34↔37,42`; `how-we-work.ts:55↔59` | e.g. condensed "Proje bazlı sourcing" above item "Proje Bazlı Tedarik"; "PO ve supplier koordinasyonu" above "Satın alma siparişi ve tedarikçi koordinasyonu"; "stok/replenishment" above "Stok ve ikmal"; "mevcut supplier" above "Mevcut tedarikçi" | Choose one vocabulary (glossary below). Recommendation: keep Turkish terms in running text (tedarikçi, satın alma siparişi, stok yenileme) and the loanword only in parentheses at first use, e.g. "tedarik (sourcing)". If the owner prefers loanwords, swap the items to match instead. | The same section shows two terms for one concept, one directly above the other. The rulings flagged this as an owner decision. It is the most visible TR issue. |
| TR-S2 | `services.ts:56`, `services/operations-supply-chain.ts:42`, `services/digital-commerce-commercial-intelligence.ts:47`, `who-we-work-with.ts:42,78` | Stok ve ikmal (koordinasyonu) | Stok yönetimi ve stok yenileme (koordinasyonu) | "İkmal" reads as military/logistics supply. Turkish retail and e-commerce say "stok yenileme" for replenishment. |
| TR-S3 | `i18n/locales/tr.json:94` | … kabul ediyorum. {link}'na bakın. | Bu talebe yanıt verebilmesi için MOESA'nın gönderdiğim bilgileri işlemesini kabul ediyorum. Ayrıntılar için {link} metnini inceleyin. | The hard-coded case suffix sits outside the link and depends on the link text ("Gizlilik Politikası'na"). The apostrophe is also not standard for a common-noun title. The rephrase needs no suffix. |
| TR-S4 | `i18n/locales/tr.json:151-152` (rendered after "15" / "10" by `app/pages/about.vue:29-30`) | yıllık dijital ticaret / yıllık profesyonel e-ticaret operasyonları | yıl dijital ticaret deneyimi / yıl profesyonel e-ticaret operasyonu deneyimi | The label currently renders as "15 yıllık dijital ticaret" ("15-year digital commerce"), a fragment without "deneyim". |
| TR-S5 | `services/digital-commerce-commercial-intelligence.ts:55-59` | Ölç / Anla / Öner / Uygula / Gözden geçir | Ölçüm / Analiz / Öneri / Uygulama / Gözden geçirme | Bare imperatives use the informal "sen" form. Noun labels keep the siz register and read as a framework. See also TR-M15. |
| TR-S6 | `content/tr/contact.ts:68-69` | Company ID: 207200475 / VAT: BG207200475 | Şirket sicil no (EIK): 207200475 / KDV no: BG207200475 | These lines are English on the Turkish page (listed as unreviewed with tr = en). The suggestion mirrors the DE ruling "Unternehmens-ID (EIK)". The same terms in `tr.json:65,73,74` come from the approved legal-notice; see TR-A7. |
| TR-S7 | `services/operations-supply-chain.ts:16` | Ticari bir anlaşma yine de operasyonel uygulama gerektirir. | Ticari bir anlaşmanın da operasyonel olarak hayata geçirilmesi gerekir. | "yine de" copies the English "still"; the sentence reads as translated. |
| TR-S8 | `services.ts:44`, `who-we-work-with.ts:64` | Distribütör ve perakendeci geliştirme | Distribütör ve perakendeci ağı geliştirme | Without "ağı", the line reads as "developing the distributors themselves". |
| TR-S9 | `services/sourcing-managed-procurement.ts:27` | Birden fazla tedarikçide satın almayı koordine etmek | Birden fazla tedarikçiyle yürütülen satın almayı koordine etmek | The locative "tedarikçide" is unidiomatic here. |
| TR-S10 | `services.ts:73` | Bir proje her noktadan başlayabilir. | Bir proje herhangi bir aşamadan başlayabilir. | More natural. Keeps the meaning of "at any point". |
| TR-S11 | `i18n/locales/tr.json:88`, `content/tr/contact.ts:42` | Hedef Zaman Çizelgesi | Hedef takvim | "Zaman çizelgesi" means a schedule or Gantt chart. A form field asking for the target timing is "hedef takvim" (or "hedeflenen süre"). |
| TR-S12 | `services/digital-commerce-commercial-intelligence.ts:63-64` | Envanter ve stok riski / Değerlendirmeler ve iadeler | Stok seviyesi ve stoksuz kalma riski / Müşteri yorumları ve iadeler | "Envanter" and "stok" are synonyms. "Değerlendirmeler" alone can mean assessments. |
| TR-S13 | `i18n/locales/tr.json:96` | Gönderilen bir form sözleşmesel bir taahhüt oluşturmaz. | Form gönderimi sözleşmeye dayalı bir ilişki doğurmaz. | More natural legal-business phrasing. "engagement" here means a contractual relationship, not a pledge. |
| TR-S14 | `content/tr/about.ts:67` | Mevzuatın belirlediği ekonomik operatörlerin hukuki ikamesi değil | Mevzuatın öngördüğü ekonomik operatörlerin yerine geçen hukuki bir yapı değil | "hukuki ikamesi" is opaque to non-lawyers. |
| TR-S15 | `i18n/locales/tr.json:24` (header only) | Müşterilerimiz | Kimler İçin | This is a user decision, so flag only. "Müşterilerimiz" ("our clients") suggests a client and reference list, which is a possible overclaim on a page that describes target segments. "Kimler İçin" is equally short (11 chars). |

### Minor (typo/style)

| # | file:line | Current | Suggested | Reason |
| --- | --- | --- | --- | --- |
| TR-M1 | `tr.json:85-88` | Ürün Kategorisi / Hedef Pazar / Tahmini Hacim | Ürün kategorisi / Hedef pazar / Tahmini hacim | Match the sentence case of the approved labels above ("İş e-postası", "Kısa proje briefi"). |
| TR-M2 | `tr.json:91` | (opsiyonel) | (isteğe bağlı) | More native. Note that the approved contact.md uses "opsiyonel", so this is the owner's call. |
| TR-M3 | `services/product-private-label-development.ts:63`; `how-we-work.ts:36` | Pazar Statüsü. / Ölç ve geliştir. | Pazar Statüsü / Ölç ve geliştir | A trailing period inside an arrow-step label (an artefact of splitting the approved sentence). |
| TR-M4 | content (9×, e.g. `about.ts`, `services/*.ts`) vs `tr.json` | ’ (curly) vs ' (straight) | one style site-wide | Inconsistent apostrophes, e.g. "MOESA’nın" vs "MOESA'nın". |
| TR-M5 | `services/digital-commerce-commercial-intelligence.ts:49` | Müşterinin sesi | Müşteri sesi | Match the approved condensed line at `:36`. |
| TR-M6 | `services/operations-supply-chain.ts:69,71`; `how-we-work.ts:83` | Tedarikçi aksiyonu / Tahmini tamamlanma | Tedarikçiden beklenen aksiyon / Tahmini tamamlanma tarihi | Parallel with "Müşteriden beklenen aksiyon". Completes the phrase. |
| TR-M7 | `services/digital-commerce-commercial-intelligence.ts:80`; `how-we-work.ts:115` | AI platformu / AI destekli | yapay zekâ (AI) platformu / yapay zekâ destekli | Turkish corporate copy normally says "yapay zekâ". |
| TR-M8 | `how-we-work.ts:105`; `services/digital-commerce-commercial-intelligence.ts:76` | Tekrarlayan Yönetilen Hizmet / tekrarlayan ticari operasyonu | Sürekli Yönetilen Hizmet / düzenli ticari operasyonu | "Tekrarlayan" (repeating) sounds mechanical in a service name. |
| TR-M9 | `services/sourcing-managed-procurement.ts:76`; `services/product-private-label-development.ts:81`; `services/digital-commerce-commercial-intelligence.ts:76` | final iş kararları / final onaylar / final risk kararları | nihai … | "nihai" is the corporate register. The approved TR uses "final", so align both or leave both. |
| TR-M10 | `who-we-work-with.ts:127` | İş sorununu, mevcut durumu ve istenen sonucu anlatın. | Karşılaştığınız iş sorununu, mevcut durumunuzu ve hedeflediğiniz sonucu anlatın. | Warmer and more natural in the siz form. |
| TR-M11 | `services/product-private-label-development.ts:25` | Eksiksiz bir ürün ailesi | Komple bir ürün ailesi | Match the approved hero ("komple private-label portföyler"). |
| TR-M12 | `tr.json:138` | Ayarları seç | Tercihleri yönet | Standard wording for a cookie banner. |
| TR-M13 | `tr.json:116` | ad@sirket.com gibi bir iş e-postası adresi girin. | Geçerli bir iş e-postası adresi girin (ör. ad@sirket.com). | Better order: the instruction first, then the example. |
| TR-M14 | `who-we-work-with.ts:48` | marketplace’te doğan markalar | marketplace odaklı markalar | "doğan" ("born on") is a calque of "marketplace-native". |
| TR-M15 | `how-we-work.ts:43-49` (unreviewed) | Tedarik Et veya Geliştir / Geliştir, Yeniden Sipariş Ver veya Büyüt | keep, or move to nouns together with approved `:30-36` | These match the approved steps' imperative ("sen") style. If TR-S5 is adopted, convert both lists to noun labels for consistency. |
| TR-M16 | `who-we-work-with.ts:110` | … teslimat koordinasyonuna ihtiyacınız var | … teslimat desteğine ihtiyacınız var | "koordinasyon" is added and slightly narrows EN "Need production, logistics, inventory or delivery". Optional. |

### Approved-text observations (package TR; not changed, owner may wish to revisit)

These lines are owner-approved, so they are out of the fix list. They are noted because a reader will notice them.

- **TR-A1** `services/operations-supply-chain.ts:81`: "importer, customs declarant, responsible economic operator" are left in English inside a Turkish legal-boundary sentence. Suggested: "ithalatçı, gümrük beyan sahibi, sorumlu ekonomik operatör".
- **TR-A2** `who-we-work-with.ts:60` (condensed): "Avrupa pazara giriş" is ungrammatical. Suggested: "Avrupa pazarına giriş".
- **TR-A3** `about.ts:16`: the second EN sentence is dropped ("We support defined projects as well as long-term external operating functions.").
- **TR-A4** `services/digital-commerce-commercial-intelligence.ts:20-21`: "Daha fazlası" / "…yalnızca e-ticaret şirketleriyle sınırlı değildir" says something different from EN ("More than an e-commerce agency" / "can operate alone or connect with…").
- **TR-A5** Every TR service page and other page ends with the generic "Projeyi görüşelim. / İletişime Geçin" instead of a service-specific CTA. On the thank-you page (`thank-you.ts:29-34`) it asks a user who has just submitted to make contact again.
- **TR-A6** Meta lengths: home title 73 and description 176; sourcing description 172 (`home.ts:7-8`, `services/sourcing-managed-procurement.ts:8`). Both will be truncated in search results.
- **TR-A7** English left in TR UI: "Company ID"/"VAT" (`tr.json:65,73,74`) and the "Digital commerce" dropdown option (`tr.json:106`, `contact.ts:24`).
- **TR-A8** Approved step labels use "sen" imperatives ("Tanımla", "Hazırla", `how-we-work.ts:30-36`).
- **TR-A9** `services/market-access-commercial-representation.ts:66-67`: "Kontrol" condenses EN "Clear mandate and control" and drops "partner approval".

---

## DE — German

### Error (meaning wrong/missing)

| # | file:line | Current | Suggested | Reason |
| --- | --- | --- | --- | --- |
| DE-E1 | `content/de/home.ts:12` | MOESA ist externer Partner für Produkt, Beschaffung und Commercial Operations für Unternehmen, die ein koordiniertes Team für Sourcing, Entwicklung, Umsetzung und Lieferung wünschen. | MOESA ist der externe Partner für Produkt, Beschaffung und Commercial Operations – für Unternehmen, die ein einziges, koordiniertes Team für Sourcing, Entwicklung, Umsetzung und Lieferung wünschen. | EN "**one** coordinated team" is the core claim of the hero and is dropped. The current sentence also has a clumsy double "für … für". |

### Should improve (wording/register/consistency)

| # | file:line | Current | Suggested | Reason |
| --- | --- | --- | --- | --- |
| DE-S1 | systemic, ~45 occurrences: `home.ts:11,17,21,43,45,70,82`; `how-we-work.ts:12,15,21,23,26,33,47,51,108`; `services.ts:67,77`; `services/sourcing-managed-procurement.ts:17,36`; `services/product-private-label-development.ts:13,17,32,40`; `services/market-access-commercial-representation.ts:17,41,43,46,64`; `services/operations-supply-chain.ts:16,32,47`; `services/digital-commerce-commercial-intelligence.ts:13,74,82`; `about.ts:36,43`; `contact.ts:50`; `thank-you.ts:21`; `who-we-work-with.ts:16` | kommerziell* | Replace by context: commercial objective → **Geschäftsziel**; commercial process → **Geschäftsprozess**; commercial terms → **kaufmännische Konditionen**; commercial feasibility → **wirtschaftliche Machbarkeit**; commercial handover/approval → **kaufmännische Übergabe/Freigabe**; commercial and product brief → **Geschäfts- und Produktbriefing**; commercial positioning → **Marktpositionierung**; commercial outreach → **Vertriebsansprache**; commercial coordination → **vertriebliche Koordination**; commercial idea → **Geschäftsidee**; commercial operation/activity → **Geschäftsbetrieb / Geschäftstätigkeit** (or the term "Commercial Operations"); commercial analysis → **Geschäftsanalyse**; commercial realism → **wirtschaftlicher Realismus**; commercial result → **geschäftliches Ergebnis**; commercial challenges → **geschäftliche Herausforderungen**; commercial structure(s) → **Geschäftsstruktur(en)**; commercial capability → **Vertriebs- und Handelskompetenz**; commercial preparation → **kaufmännische Vorbereitung**. | "kommerziell" in German leans towards "profit-driven / mass-market" and is rarely used for these concepts. This one pattern is the biggest reason the DE reads as translated. |
| DE-S2 | `services.ts:40`; `services/market-access-commercial-representation.ts:8,31,53` | kommerzielle Vertretung / Eine kommerzielle Vertretung aufbauen / Laufende kommerzielle Vertretung | Vertriebsrepräsentanz / Eine Vertriebsrepräsentanz aufbauen / Laufende Vertriebsrepräsentanz | Left over from before the ruling. The service name says "Vertriebsrepräsentanz", but these lines say something else. |
| DE-S3 | `i18n/routes.ts:85` | /de/leistungen/marktzugang-und-handelsvertretung | /de/leistungen/marktzugang-und-vertriebsrepraesentanz (+ 301 from the old path) | The slug contradicts the copy term. *Handelsvertreter* is a defined legal status (§ 84 ff. HGB), which conflicts with the site's own "legal-role boundary" statements. The site is pre-launch, so changing it costs almost nothing now. (The ruling deliberately kept the slug; this asks for that to be reconsidered.) |
| DE-S4 | `services.ts:66`; `services/sourcing-managed-procurement.ts:12,57`; `how-we-work.ts:94` | Gemanagte Marktplatz- oder D2C-Operations / zum gemanagten Einkauf / Gemanagte Beschaffung als Service / Wiederkehrender gemanagter Service | Betreute Marktplatz- oder D2C-Operations / zum Beschaffungsmanagement / Beschaffungsmanagement als Service / Laufender Managed Service | "gemanagt" is Denglish. Use the glossary term (Beschaffungsmanagement) or the established loan "Managed Service". |
| DE-S5 | meta (see table below) | 9 of 13 pages over 60 (title) or 160 (description) characters | see table | Truncation in search results. The EN is long too, but German makes it worse. |
| DE-S6 | `services/market-access-commercial-representation.ts:22` | Für Hersteller und Markeninhaber, die in Europa eintreten oder expandieren | Für Hersteller und Markeninhaber, die in den europäischen Markt eintreten oder in Europa expandieren | "in Europa eintreten" is ungrammatical. |
| DE-S7 | `services/market-access-commercial-representation.ts:17` | MOESA handelt als lokaler kommerzieller und operativer Partner … | MOESA agiert als lokaler Vertriebs- und operativer Partner … | "handelt" is ambiguous ("trades") on a page about trading arrangements. Also removes a "kommerziell". |
| DE-S8 | `services/market-access-commercial-representation.ts:64,67` | koordiniert die vereinbarten Aktivitäten zur Marktentwicklung und die kommerziellen Aktivitäten / Welchen Markt möchten Sie entwickeln? | koordiniert die vereinbarten Aktivitäten in Markterschließung und Vertrieb. / Welchen Markt möchten Sie erschließen? | Removes the repeated "Aktivitäten". Germans "erschließen" a market rather than "develop" one. |
| DE-S9 | `services.ts:44`; `who-we-work-with.ts:60` | Aufbau von Distributoren und Händlern | Aufbau von Distributoren- und Händlernetzwerken | Currently reads as "building up the distributors themselves". |
| DE-S10 | `how-we-work.ts:59`; `services/digital-commerce-commercial-intelligence.ts:69` | Eine kontrollierte Produktwahrheit / Eine einheitliche Produktwahrheit | Eine verbindliche, kontrollierte Produktdatenbasis / Eine einheitliche Produktdatenbasis | "Produktwahrheit" is a calque that German readers will not recognise. ("Single Source of Truth" is also understood in B2B.) |
| DE-S11 | `how-we-work.ts:24,26` | Die Entscheidungen vor der Verpflichtung freigeben / Die fortlaufende kommerzielle Tätigkeit bei Bedarf betreiben | Entscheidungen freigeben, bevor Verbindlichkeiten eingegangen werden / Bei Bedarf das laufende Geschäft operativ betreuen | "Verpflichtung" (duty/obligation) blurs the meaning of "commitment" (binding orders or spend). |
| DE-S12 | `home.ts:61` | Für unterschiedliche Geschäftsmodelle gebaut. | Ausgerichtet auf unterschiedliche Geschäftsmodelle. | "gebaut" is a calque of "built for". |
| DE-S13 | `services/product-private-label-development.ts:12` | Von der Kategoriechance zum marktreifen Produkt. | Vom Marktpotenzial einer Kategorie zum marktreifen Produkt. | "Kategoriechance" is not idiomatic. |
| DE-S14 | `services/operations-supply-chain.ts:16,77`; `how-we-work.ts:99` | Eine kommerzielle Vereinbarung erfordert weiterhin eine operative Umsetzung. / Grenze der rechtlichen Rolle / Grenze der Verantwortung | Auch eine getroffene Handelsvereinbarung muss operativ umgesetzt werden. / Abgrenzung der rechtlichen Rolle / Abgrenzung der Verantwortung | "weiterhin" is a calque of "still". "Abgrenzung" is the idiomatic word for "boundary" in this sense. |
| DE-S15 | `who-we-work-with.ts:16,80,87` | … baut das passende Betriebsmodell darum herum auf / ermittelt die zuständige Geschäftspartei / Leitfaden zur Wahl der Zusammenarbeit | … richtet das passende Betriebsmodell daran aus / ermittelt den zuständigen Geschäftspartner / Wegweiser: Welche Leistung passt? | Calques; "Geschäftspartei" is unusual. The EN heading "Engagement selection guide" does not translate literally into good German. |
| DE-S16 | `services/digital-commerce-commercial-intelligence.ts:74,81` | Der Kunde behält die Inhaberschaft der Konten, … / Was sollte Ihr digitaler Betrieb besser machen? | Der Kunde bleibt Inhaber der Konten und behält Markenstrategie, … / Was soll Ihr digitales Geschäft künftig besser leisten? | Stiff noun style. The CTA title currently reads oddly. |
| DE-S17 | `thank-you.ts:29` | Entdecken Sie MOESA weiter. | Erfahren Sie mehr über MOESA. | Unidiomatic. |
| DE-S18 | layout: no `hyphens:auto` anywhere in `app/` CSS | long compounds: Vertriebsrepräsentanz, Beschaffungsmanagement, Bereichsübergreifende Kompetenz (card eyebrow, `de.json:52`), Distributoren- und Händlernetzwerke | add `hyphens: auto` (`<html lang>` is already set per locale) on headings, cards and chips | German compounds can overflow narrow cards and mobile headings. Also longer than EN: `about.ts:74` final-CTA title (80 chars vs EN 56); `how-we-work.ts:40` arrow step "Verbessern, nachbestellen oder ausbauen" (39 vs 26). TR has the same issue at `how-we-work.ts:49` (40 chars). |
| DE-S19 | `de.json:24` (header only) | Zielgruppen | Für wen (or keep) | User decision, so flag only. "Zielgruppen" is marketing-internal jargon; visitors do not think of themselves as a "target group". |
| DE-S20 | `services.ts:62`; `services/digital-commerce-commercial-intelligence.ts:8,13,47`; `who-we-work-with.ts:74` | Kundenerkenntnisse / Stimme des Kunden | Kundeneinblicke (or "Customer Insights") / Voice of the Customer | "Kundenerkenntnisse" is unusual. "Stimme des Kunden" is too literal; German practice uses the English VoC term. |

DE-S5 meta suggestions (title ≤ ~60, description ≤ ~160):

| file:line | Now (chars) | Suggested |
| --- | --- | --- |
| `home.ts:7-8` | T 83 / D 191 | T: `MOESA Ltd. \| Beschaffung, Produktentwicklung & Operations` (57) · D: `MOESA steuert Sourcing, Produktentwicklung, Beschaffung, Marktzugang, Lieferkette und Commercial Operations für Händler, Marken und Hersteller.` (~150) |
| `services.ts:8` | D 169 | `Leistungen von MOESA: Sourcing, Beschaffungsmanagement, Produktentwicklung, Marktzugang, Lieferkette und Digital-Commerce-Operations.` (~140) |
| `services/sourcing-managed-procurement.ts:7` | T 61 | `Sourcing & Beschaffungsmanagement \| MOESA Ltd.` |
| `services/product-private-label-development.ts:7-8` | T 64 / D 173 | `Produkt- & Private-Label-Entwicklung \| MOESA Ltd.` · D: `MOESA entwickelt Produkte und Private-Label-Portfolios – von Kategoriestrategie und Produktarchitektur bis Lieferantenauswahl, Verpackung und Produktionsreife.` |
| `services/market-access-commercial-representation.ts:7-8` | T 61 / D 191 | `Marktzugang & Vertriebsrepräsentanz in Europa \| MOESA Ltd.` (~57) · D: `MOESA unterstützt Marken, Hersteller und Einkäufer bei Markteintritt, Vertriebsrepräsentanz, Kanalentwicklung und lokaler Koordination in Europa.` (~145) |
| `services/operations-supply-chain.ts:7` | T 67 | `Internationale Operations & Lieferkette \| MOESA Ltd.` |
| `services/digital-commerce-commercial-intelligence.ts:7` | T 66 | `Digital Commerce & Commercial Intelligence \| MOESA Ltd.` |
| `about.ts:7-8` | T 65 / D 181 | `Über MOESA Ltd. \| Beschaffung & Product Operations` · D: `MOESA Ltd. mit Sitz in Bulgarien ist Partner für internationale Beschaffung, Produktentwicklung und Commercial Operations.` |
| `contact.ts:7` | T 78 | `Kontakt \| MOESA Ltd. – Projekt besprechen` (~42) |
| `who-we-work-with.ts:8` | D 182 | `MOESA arbeitet mit Einkäufern, Händlern, Distributoren, Marken, Herstellern und Digital-Commerce-Unternehmen – von Sourcing bis Operations.` |

### Minor (typo/style)

| # | file:line | Current | Suggested | Reason |
| --- | --- | --- | --- | --- |
| DE-M1 | `home.ts:72`; `contact.ts:37-41` | " - " | " – " (en dash) | German typography. |
| DE-M2 | `services/product-private-label-development.ts:17` | zur vorgesehenen Kundschaft, Marktposition, zum Kanal | zur vorgesehenen Kundschaft, zur Marktposition, zum Kanal | The preposition/article is missing before "Marktposition". |
| DE-M3 | `services/product-private-label-development.ts:46` | Packungsanzahl | Stückzahl pro Packung | "pack count" means units per pack. |
| DE-M4 | `de.json:64`; `contact.ts:58` | Eingetragene Anschrift | Eingetragener Sitz (or Geschäftsanschrift) | Usual wording for a registered address. |
| DE-M5 | `contact.ts:58` | … Plovdiv 4000, Bulgaria | … Plovdiv 4000, Bulgarien | Running copy, not a postal label. (Keep "Bulgaria" only if it is meant as a verbatim postal address.) |
| DE-M6 | `thank-you.ts:19-20` | gegebenenfalls … Gegebenenfalls … | Fehlende Informationen fragen wir bei Bedarf an / Gegebenenfalls schlagen wir ein erstes Sondierungsgespräch vor | The same word on two consecutive lines. |
| DE-M7 | `404.ts:15,24` | Von hier aus weiter / Brauchen Sie Hilfe, die richtigen Informationen zu finden? | So geht es weiter / Benötigen Sie Hilfe bei der Suche nach den richtigen Informationen? | Smoother. |
| DE-M8 | `services/operations-supply-chain.ts:81` | Wohin muss das Produkt? | Wohin soll das Produkt geliefert werden? | Colloquial. |
| DE-M9 | `who-we-work-with.ts:84` | Product-Operations-Funktion | Produkt-Operations-Funktion | A mixed half-English compound. |
| DE-M10 | `services/operations-supply-chain.ts:74` | korrigierende Nachverfolgung | Nachverfolgung von Korrekturmaßnahmen | Idiomatic. |
| DE-M11 | `how-we-work.ts:45` | Beginnen Sie an jedem Punkt | Einstieg an jedem Punkt möglich | Reads more naturally as a heading. |
| DE-M12 | `services.ts:11` | Vernetzte Leistungen für internationale Produktunternehmen. | Vernetzte Leistungen für Unternehmen im internationalen Produktgeschäft. | "Produktunternehmen" is unusual. |
| DE-M13 | `de.json:48` | Verwandte Leistungen | Passende Leistungen | "verwandt" sounds like "kin". |
| DE-M14 | `de.json:152` | Jahre in professionellen E-Commerce-Operations | Jahre professionelle E-Commerce-Operations | Smoother as a stat label after the number. |

DE checks that passed: formal "Sie" throughout (0 du-forms). "Unternehmens-ID (EIK)" and "USt-IdNr." are used as ruled. Service names in nav, cards, dropdown and the selection guide are consistent. The form/error/cookie strings are correct and idiomatic. The consent sentence fits "in der {link}" (Datenschutzerklärung). The decisions' header labels fit.

---

## Glossary

### TR (proposed; ✱ = needs owner choice vs approved loanword)

| EN | TR (recommended) | Notes |
| --- | --- | --- |
| Sourcing | tedarik ✱ (approved also uses "sourcing") | Service name: "Tedarik ve Yönetilen Satın Alma" (approved). |
| Managed Procurement | Yönetilen Satın Alma | approved |
| procurement / purchasing | satın alma | approved uses "procurement" once (About) |
| supplier | tedarikçi ✱ (approved: "supplier") | |
| purchase order (PO) | satın alma siparişi ✱ (approved: "PO") | |
| replenishment | stok yenileme ✱ (approved: "replenishment"; ours: "ikmal") | |
| inventory | stok | avoid "envanter" next to "stok" |
| private label | private label (noun) / private-label (modifier) | approved |
| Market Access | Pazara Giriş | approved |
| market entry | pazara giriş | |
| Commercial Representation | Ticari Temsil | approved |
| Operations & Supply Chain | Operasyon ve Tedarik Zinciri | approved |
| Digital Commerce | Dijital Ticaret | approved title; avoid "Digital commerce" in UI |
| Commercial Intelligence | Ticari İçgörü | approved |
| commercial operations | ticari operasyonlar | not for "commerce operations" (= e-ticaret operasyonları) |
| mandate | görev | approved |
| engagement / partnership models | çalışma modelleri | approved |
| negotiation | ticari görüşme (approved) / müzakere | keep "görüşme" for consistency |
| discovery discussion | discovery görüşmesi (approved) | |
| project brief | proje briefi (approved) | |
| final approval | final onay (approved) / nihai onay | pick one |
| CTA "Discuss a Project" | Projeyi Görüşelim | approved |
| CTA "Contact" | İletişime Geçin | approved |
| CTA "Explore Services" | Hizmetleri İnceleyin | |
| CTA "Send Project Brief" | Proje Briefini Gönder | |

### DE (proposed)

| EN | DE |
| --- | --- |
| Sourcing | Sourcing |
| Managed Procurement | Beschaffungsmanagement (never "gemanagte Beschaffung") |
| procurement / purchasing | Beschaffung / Einkauf |
| supplier | Lieferant |
| purchase order | Bestellung |
| replenishment / inventory | Nachschub / Bestand |
| Private Label | Private Label; compounds "Private-Label-…" |
| Market Access / market entry | Marktzugang / Markteintritt; "einen Markt erschließen" |
| Commercial Representation | Vertriebsrepräsentanz (never "kommerzielle Vertretung" / "Handelsvertretung") |
| Operations & Supply Chain | Operations & Lieferkette |
| Digital Commerce & Commercial Intelligence | unchanged (EN terms) |
| commercial (adj.) | geschäftlich / kaufmännisch / wirtschaftlich / vertrieblich by context (see DE-S1); avoid "kommerziell" |
| commercial operations | Commercial Operations (term) / Geschäftsbetrieb |
| managed (adj.) | Managed … (established loan) or betreut; never "gemanagt" |
| mandate | Mandat |
| engagement models / partnership models | Zusammenarbeitsmodelle / Partnerschaftsmodelle |
| discovery discussion | Sondierungsgespräch |
| project brief | Projektbriefing |
| QA / compliance | QS / Compliance |
| customer intelligence / voice of customer | Kundeneinblicke / Voice of the Customer |
| product truth | verbindliche Produktdatenbasis |
| Company ID / VAT | Unternehmens-ID (EIK) / USt-IdNr. |
| CTA Discuss a Project / Explore Services / Send Project Brief / Contact | Projekt besprechen / Leistungen entdecken / Projektbriefing senden / Kontakt |

---

## Slugs (`i18n/routes.ts`)

- TR (`:64-120`): `hizmetler`, `tedarik-ve-yonetilen-satin-alma`, `urun-ve-private-label-gelistirme`, `pazara-giris-ve-ticari-temsil`, `operasyon-ve-tedarik-zinciri`, `dijital-ticaret-ve-ticari-icgoru`, `nasil-calisiyoruz`, `kimlerle-calisiyoruz`, `hakkimizda`, `iletisim`, `tesekkurler`. All are correct ASCII transliterations, lowercase and natural. No issues.
- DE (`:65-120`): `leistungen`, `sourcing-und-beschaffungsmanagement`, `produkt-und-private-label-entwicklung`, `operations-und-lieferkette`, `digital-commerce-und-commercial-intelligence`, `so-arbeiten-wir`, `fuer-wen-wir-arbeiten`, `ueber-uns`, `kontakt`, `danke`. All correct (ü→ue, ä→ae). The only issue is `marktzugang-und-handelsvertretung` (`:85`); see DE-S3.

## UI chrome notes (both locales)

- **Alt text:** the only image alt is the logo (`app/components/brand/Logo.vue:43` "MOESA Ltd.", locale-neutral). This is fine.
- **OG image** (`scripts/og-image.ts:53`): it prints `descriptor_en` for every locale, so TR and DE shares show English text. Optional: generate per-locale images from `descriptor_tr` and `siteDe.descriptor`.
- **Contact page:** `serviceOptions`, `formFields` and `privacyNote` in `content/{tr,de}/contact.ts` are **not rendered** (`app/pages/contact.vue` uses only hero/direct/company/next/finalCta). Their translations matter little, and `privacyNote` is an implementation instruction rather than visitor copy.
- **TR form labels:** "Hizmet" (`tr.json:83`) and "Form" (`:77`) are much shorter than EN "How Can We Support You?" / "Project form", but they are approved package text. No layout risk.

---

## Notes on the UNREVIEWED lists

1. **Completeness, TR.** I scripted a check: every non-legal string in `content/tr/**/*.ts` (except path/href/slug) is either verbatim in the package TR md or listed in `content/tr/unreviewed.ts` (410 entries). No unlisted machine translation found. The 70 UI keys in `i18n/unreviewed-ui.ts` cover every TR locale key that is not package-derived.
2. **Completeness, DE.** All 112 `de.json` keys appear in the UI table of `UNREVIEWED_DE.md`. The page copy is enforced by `tests/unit/content-de.test.ts` (637 entries).
3. **Accuracy of the TR UI note** (`UNREVIEWED_TR.md` "Not listed here…"):
   - It says `form.serviceOptions.*` come from "the TR contact.md service list". `productPrivateLabel` ("Ürün ve Private Label Geliştirme") and `operations` ("Operasyon ve Tedarik Zinciri") actually come from the approved service titles; contact.md says "private label" / "supply chain". They are still approved text, but the note should say so.
   - `company.companyId` / `company.vat` ("Company ID"/"VAT") are not mentioned; only `footer.companyLine` is.
4. **Intro claim, TR md.** The intro says new translations use "the terminology of the approved TR files". They deliberately use Turkish terms (tedarikçi, ikmal) where the approved files use loanwords (supplier, replenishment), as the rulings acknowledge. Reword the intro so the reviewer knows to make the TR-S1 decision.
5. **Rulings file inconsistency.** One line says the canvas header labels "Müşterilerimiz"/"Hakkımızda" were *not adopted*; the "Waiting for user review" section and `tr.json:24-25` show they *were* (user decision 2026-10-31). Delete or amend the stale line.
6. **Low-value entries.** The contact `serviceOptions` / `formFields` / `privacyNote` entries (TR 21, DE ~25) are not rendered (see UI chrome notes). Reviewers can approve them in bulk.
