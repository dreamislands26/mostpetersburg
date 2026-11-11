# MOST Petersburg — SEO, GEO and design audit
Date: 2026-11-12
Scope: source-code inspection of 19 core pages and samples of localized and deep pages, plus sitemap and robots.txt. Not a full 142-URL live crawl.

## Confirmed
- sitemap.xml: 142 unique loc entries; 22 each for zh-CN, ar, id, vi.
- robots.txt permits crawling and references sitemap.
- Sampled core pages have canonical and meta description; privacy page lacked H1 (fixed).
- English homepage has Organization JSON-LD, Open Graph and six hreflang entries.
- Many sampled interior pages lack Open Graph, JSON-LD, and full hreflang clusters.
- Remaining Google Drive thumbnails observed on experiences, tours index, Vietnamese homepage and sampled localized private-journeys/travel-trade pages. Do not replace with unrelated photos.
- Several CSS layers historically used violet/pink; brand azure/amber/asphalt tokens restored in latest overrides.
- Mobile nav uses horizontal scroll; requires device/browser QA.

## Changes implemented
- Original archive WebP photographs migrated on homepage, about, destination-marketing, guides index and selected localized homepages.
- Shared visual tokens and accessible navigation refined.
- Privacy page H1 fixed.
- Earlier logo width/height corrected on homepages; interior pages still require systematic correction.

## Required verification
1. Crawl all 142 sitemap URLs in production: status, redirect chain, canonical, title, description, H1, hreflang, OG, schema, images, internal links.
2. Compare sitemap URLs to deployed files; check robots and actual HTTP responses.
3. Verify mobile at 320/375/768/1024 px and RTL Arabic; inspect horizontal overflow and keyboard focus.
4. Validate JSON-LD against actual content and schema.org; do not assert unverified offers, prices, availability, ratings or services.
5. Verify visa, transport, payment, event dates and business details against authoritative sources; add last-reviewed date to time-sensitive pages.
6. Review indexing/queries with Google Search Console and Yandex Webmaster; evaluate AI visibility using reproducible prompts and documented citations.
7. Migrate remaining Drive thumbnails after confirming photo subject and usage rights.
8. Run Lighthouse/Core Web Vitals on deployed pages; no performance score has been measured yet.

## GEO content guidelines
- Give clear answers to visitor questions in page headings and lead paragraphs.
- Use descriptive place names, factual itinerary scope, author/organization attribution, cited official sources, and meaningful internal links.
- JSON-LD is descriptive metadata, not a guarantee of inclusion in AI answers.
- Keep localized content genuinely translated and culturally useful; hreflang only between equivalent available pages.
