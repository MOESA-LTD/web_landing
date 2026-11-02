import about from './about'
import contact from './contact'
import cookiePolicy from './cookie-policy'
import home from './home'
import howWeWork from './how-we-work'
import legalNotice from './legal-notice'
import notFound from './404'
import privacyPolicy from './privacy-policy'
import services from './services'
import digital from './services/digital-commerce-commercial-intelligence'
import marketAccess from './services/market-access-commercial-representation'
import operations from './services/operations-supply-chain'
import product from './services/product-private-label-development'
import sourcing from './services/sourcing-managed-procurement'
import thankYou from './thank-you'
import whoWeWorkWith from './who-we-work-with'

export type { HomeContent } from './home'
export type { ServicesContent, ServiceSummary } from './services'
export type { ServicePageContent } from './service-page'
export type { HowWeWorkContent } from './how-we-work'
export type { WhoWeWorkWithContent, GuideRow } from './who-we-work-with'
export type { AboutContent } from './about'
export type { ContactContent } from './contact'
export type { MessageContent } from './message'
export type { LegalContent } from './legal'

/** Every page of the site, keyed by `PageKey`. */
export const content = {
  home,
  services,
  'services/sourcing-managed-procurement': sourcing,
  'services/product-private-label-development': product,
  'services/market-access-commercial-representation': marketAccess,
  'services/operations-supply-chain': operations,
  'services/digital-commerce-commercial-intelligence': digital,
  'how-we-work': howWeWork,
  'who-we-work-with': whoWeWorkWith,
  about,
  contact,
  'thank-you': thankYou,
  '404': notFound,
  'privacy-policy': privacyPolicy,
  'cookie-policy': cookiePolicy,
  'legal-notice': legalNotice,
}

export type ContentMap = typeof content
