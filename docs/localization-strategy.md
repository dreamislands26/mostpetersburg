# MOST Petersburg — International Localization Foundation
Date: 2026-11-10
Status: phase 1 scaffolding, not full localization or production QA.

## Immutable brand
Brand: MOST Petersburg.
Original slogan: **You Are the MOST Welcome.** Preserve in English on every locale until brand-approved transcreation. Independent destination experience and travel partner; never imply official government DMO status.

## Routes and market hypotheses
| Locale | URL | Script | Primary market hypothesis | Priority content |
| zh-CN | /zh-CN/ | Simplified Chinese, LTR | Mainland China | Group travel, private tours, payment, visas, B2B |
| ar | /ar/ | Arabic, RTL | GCC first; distinguish UAE/Saudi/other countries | Premium FIT, family journeys, halal-aware preferences, payment, visas |
| id | /id/ | Indonesian, LTR | Indonesia | First-time Russia, visas, group journeys, seasons |
| vi | /vi/ | Vietnamese, LTR | Vietnam | Group itineraries, seasonal journeys, travel logistics, visas |

These are testable positioning hypotheses, not verified demand forecasts. Do not assume religion, spending power or travel preferences from nationality.

## Implemented
Four localized entry pages, translated title/description/hero/sections, language switching, locale HTML lang, Arabic RTL, self canonical, home-page hreflang cluster, homepage links, and sitemap URLs. Links to detailed English pages and English-only enquiry form are clearly marked. No new payment or form backend.

## Next engineering phase
1. Shared header/footer and locale dictionaries, with source English content as canonical editorial source. Static build or templating to avoid duplicating page code.
2. Fully localized contact form with tested delivery, consent text, privacy policy, response language selection and CRM locale tag.
3. Localized core pages: private tours, Scarlet Sails, White Nights, travel trade, how to travel, visas, payment guide.
4. Add reciprocal hreflang clusters only for genuinely equivalent translated pages; ensure each canonical is self-referencing. Locale-aware 404 and navigation.
5. Test Arabic RTL (logical CSS, forms, punctuation, numerals, mobile, accessible focus), Chinese line breaks/fonts, Vietnamese diacritics and Indonesian copy.
6. Native-speaker review of all commercial, visa and legal language. Verify claims and event availability. Use official country-specific visa sources.
7. Technical QA: deployment 200 status, canonical, hreflang reciprocity, XML validity, indexing and analytics segmentation.

## Localization workflow
English source → translation draft → terminology/brand QA → local cultural/editorial QA → legal/supplier verification → production QA → publish → Search Console + lead analytics.

## SEO guidelines
Do not translate keywords word-for-word without local search research. Use locale-specific query research and competitor analysis; choose Baidu/Google and local discovery channels based on evidence. No fabricated search volumes. Use UTF-8, lang, dir, hreflang, locale self-canonical and accurate translated metadata. Do not mass-publish low-quality machine translation.

## Market funnel
Local discovery → locale landing page → matching program → qualified inquiry → reply in requested language → confirmed supplier quotation → booking. Metrics by locale: indexed pages, qualified sessions, inquiries, reply SLA, quote rate, booking rate, gross profit.

## Critical limitations
The initial landing pages are lightweight. Most deep links lead to English content, and contact is not yet an operational sending form. Production deployment and actual live URLs have not been verified. This is localization groundwork, not launch readiness.
