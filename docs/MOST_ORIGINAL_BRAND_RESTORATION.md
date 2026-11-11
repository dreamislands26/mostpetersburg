# MOST Petersburg — Original Brand Restoration (2026-11-11)

## Source of truth
Use the supplied 2022 MOST map, MOST Petersburg DMO deck, and MOST Petersburg Club media kit as **primary** editorial and brand sources. Do not invent brand heritage or substitute generated images for original archive photographs.

## Brand
- Historical line: **YOU ARE THE MOST® WELCOME IN ST. PETERSBURG**.
- Preserve the original MOST wordmark where rights and source assets permit.
- Historical materials use bold condensed sans-serif typography, violet/pink blocks, white space, and direct editorial language. Color swatches must be sampled from original source files before locking design tokens.
- Do not present MOST as an official city-government tourism board without current evidence.
- Avoid generic luxury-travel clichés, AI city illustrations, fake photography and fabricated claims.

## Homepage design direction
1. Header: authentic MOST logo, Discover, Walks & Map, What's On, Experiences, Plan Your Visit, Travel Trade, language switch.
2. Hero: original documentary Petersburg photograph, decisive bold headline and original welcome tagline; direct editorial CTA and itinerary CTA.
3. Current city stories and seasonal features with verified dates and credited original imagery.
4. **Five walks through the Golden Triangle**, derived from the 2022 printed map. Each route: numbered POIs, historical context, approximate walking time, map, accessibility and a clear route CTA.
5. Real neighborhoods and local voices: Kolomna, historic centre, literary Petersburg, Peterhof; do not treat Peterhof as a city district.
6. Events and experiences, with clear separation between editorial recommendations and purchasable offers.
7. Travel trade / DMC: verified services, request brief, no unverified promises.

## Initial route from 2022 archive
'From the Church of the Savior on Spilled Blood to Pestel Street' — the printed guide lists approximately 2 km / 60 minutes. Historical POIs include Mikhailovsky Garden, Mikhailovsky Castle, Panteleimonovsky Bridge, Summer Garden and associated cultural sites. Recheck access, opening hours and transit before publication.

## Engineering / release requirements
- First locate the **actual Cloudflare production entrypoint**, assets, and build configuration. The repository root index.html currently appears to be an older minimal landing page, not the supplied production screenshot; do not overwrite it assuming it is the live homepage.
- Inventory the user-supplied MOST_MAP.zip and original PDF image assets, inspect license/provenance and optimize web variants. Keep originals unchanged.
- Build accessible responsive layouts with correct alt text and image credits.
- Keep existing working routes, locale variants, sitemap, metadata, lead capture, and quote-first Stripe policy.
- Run route, mobile, SEO, i18n and Cloudflare build checks before promoting.
- Avoid publishing historical audience numbers as current performance.
