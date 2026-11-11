# MOST Petersburg — DIT UX reference adaptation

Source: user-provided export **DIT · Design System v2 · M3.zip** (11 PDFs, November 2026). This is a UX pattern reference, not a license to copy Dream Islands branding.

## Verified reference screens
- **Вход и Wellness Journey.pdf**: desktop/mobile home, goal/location/duration search, onboarding and results.
- **Выбор программы.pdf**: catalog, tracks, guides, card rails, goal/duration/price/country filtering.
- **Направления.pdf**: destination landing and country overview.
- **China Flow · шаблон направления.pdf**: destination → place → program → booking; hero, chips, program rails, places, three-step process, featured mosaic.
- **Поиск.pdf**: mobile search, filter drawer, map/list combination.
- **Избранное.pdf**: saved items on device before login; account sync after login.
- **Кабинет и после поездки.pdf**: email-code login and journey dashboard.
- **Доверие и B2B.pdf**: about, trust, partner journey.
- **_Photos · generated (Figma AI).pdf**: generated references; must NOT be used as authentic Petersburg photography.

## MOST-specific information architecture
1. / — editorial hero, quick search, featured neighborhoods, walks, events, trust/partner CTA.
2. /discover/ — district and nearby destination directory.
3. /discover/{slug}/ — destination template: hero, editorial introduction, highlights, places, walking routes, practical information, related experiences.
4. /places/ and /places/{slug}/ — authentic museums, cultural venues, restaurants, hotels with real photos and sourced details.
5. /experiences/ and /experiences/{slug}/ — guided walks and experiences, dates/duration, availability status, enquiry.
6. /events/ and /events/{slug}/ — event calendar; dated entries only from verified sources.
7. /search/ — filterable search and map/list view.
8. /saved/ — locally saved places, routes and events, with optional later account sync.
9. /about/, /partners/, /contact/ — brand, DMO/B2B and enquiry.
10. /walks/golden-triangle.html — existing archive walk, eventually aligned with experience detail template.

## UX components to adapt
- App bar + responsive mobile navigation
- Hero image and compact contextual metadata
- Search with destination / interests / dates
- Filter chips, sorting and mobile filter sheet
- Photo-first cards with title, district, duration or category, verified badges only
- Editorial mosaic for featured neighborhoods
- Map/list toggle
- Save/favorite affordance
- Contextual enquiry CTA and lightweight inquiry form
- Related places, walks and events
- Localized breadcrumbs, metadata, canonical, hreflang and structured data

## Design principles
Reuse DIT layout rhythm, responsive patterns and component behavior. Preserve MOST's original violet/pink, editorial typography, 2022 map identity and “YOU ARE THE MOST WELCOME”. Do not carry over DIT mint, wellness scores, medical promises, invented ratings or prices. Use only authentic licensed city photos. Never represent a generated illustration as a real place.

## Rollout
P0: Homepage + destination listing + destination detail + experience detail + shared components.
P1: Search/filter/map + saved items + event calendar.
P2: Enquiry conversion + B2B + localized SEO/GEO.
P3: Optional account and payment integrations, only after content and commercial rules are verified.

## Acceptance criteria
- Desktop and mobile parity; no dead navigation or placeholders.
- All photographs are real and properly attributed/licensed.
- No invented events, prices, ratings, opening times or bookability.
- Each indexable page has unique title, description, canonical and appropriate structured data.
- Search and filters operate on real content.
- Enquiry flow works end-to-end before calling it live.
- Cloudflare deployment and visual checks verified separately from GitHub commits.
