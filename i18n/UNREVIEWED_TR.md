# Turkish UI microcopy awaiting review

Every Turkish UI string below has **no source** in `MOESA_Website_Package_v1.0/content/tr`. We translated it
(formal Turkish, "siz" form). Please review it before launch. Each row is the key, the EN text and the TR text, separated by vertical bars; keys are paths into
`i18n/locales/{en,tr}.json`. A unit test keeps this file and the json files in sync.

Not listed here, because they come from the package TR md:
- nav labels, footer legal links, breadcrumb "Home"/"Services" and the service names: the TR page titles
- header CTA: the TR home CTA label
- form labels (name, company, work email, country, service, brief) and `form.briefHelp`: TR contact.md
- `status.draft` / `status.open`: the "TASLAK" / "AÇIK" of the package status lines
- `form.serviceOptions.*` (except "other"): the TR contact.md service list, capitalised for use as option labels
- `cookie.strictlyNecessary`: the TR cookie-policy.md category "Zorunlu"
- `footer.companyLine`: the TR legal-notice.md also writes "Company ID" and "VAT" in English

key | EN | TR
skipLink | Skip to content | İçeriğe geç
language.label | Language | Dil
nav.label | Primary | Ana gezinme
nav.allServices | All services | Tüm hizmetler
nav.openMenu | Open menu | Menüyü aç
nav.closeMenu | Close menu | Menüyü kapat
breadcrumbs.label | Breadcrumb | Gezinti yolu
breadcrumbs.allServices | All services | Tüm hizmetler
related.services | Related services | İlgili hizmetler
footer.companyTitle | Company | Şirket
footer.email | Email | E-posta
footer.phone | Phone | Telefon
footer.address | Registered address | Kayıtlı adres
form.labels.productCategory | Product Category | Ürün Kategorisi
form.labels.targetMarket | Target Market | Hedef Pazar
form.labels.estimatedVolume | Estimated Volume | Tahmini Hacim
form.labels.targetTimeline | Target Timeline | Hedef Zaman Çizelgesi
form.projectDetails | Project details | Proje detayları
form.optional | (optional) | (opsiyonel)
form.servicePlaceholder | Select a service | Bir hizmet seçin
form.consent | I agree that MOESA may process the information I submit to respond to this enquiry. See the Privacy Policy. | Bu talebe yanıt verebilmesi için MOESA'nın gönderdiğim bilgileri işlemesini kabul ediyorum. Gizlilik Politikası'na bakın.
form.submit | Send Project Brief | Proje Briefini Gönder
form.serviceOptions.other | Other | Diğer
form.errorSummaryOne | Please check 1 field | Lütfen 1 alanı kontrol edin
form.errorSummaryMany | Please check {count} fields | Lütfen {count} alanı kontrol edin
form.errors.name | Enter your name. | Adınızı girin.
form.errors.company | Enter your company name. | Şirket adınızı girin.
form.errors.workEmail | Enter a work email address, like name{'@'}company.com. | ad{'@'}sirket.com gibi bir iş e-postası adresi girin.
form.errors.country | Enter your country. | Ülkenizi girin.
form.errors.service | Choose how we can support you. | Size nasıl destek olabileceğimizi seçin.
form.errors.projectBrief | Describe the project briefly. | Projeyi kısaca anlatın.
form.errors.consent | Confirm consent so we can respond to your enquiry. | Talebinize yanıt verebilmemiz için onay verin.
cookie.title | Cookie preferences | Çerez tercihleri
cookie.alwaysOn | (always on) | (her zaman açık)
cookie.preferences | Preferences | Tercihler
cookie.analytics | Analytics | Analitik
cookie.rejectNonEssential | Reject non-essential | Zorunlu olmayanları reddet
cookie.acceptAll | Accept all | Tümünü kabul et
cookie.saveChoices | Save choices | Seçimleri kaydet
cookie.chooseSettings | Choose settings | Ayarları seç
