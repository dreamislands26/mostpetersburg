# MOST Petersburg — image CDN migration inventory

Status: inventory only. **No image URLs have been replaced**, because the original bytes, usage rights and Cloudflare delivery have not yet been verified.

## Currently identified external image dependencies

| Drive file ID | Current use | Source file |
| --- | --- | --- |
| `1tRCIzZ9Wseh1dSze5S_Qr9zqnT3a3a4h` | Homepage hero poster / background | `public/index.html`, `public/styles.css` |
| `1YPXc649xPy3lNor1zZPmZuB9xv0_NQVV` | About page / image background | `public/about.html`, `public/styles.css` |
| `1UI6xZBSQIdaqTp0z4NTOwa197ugEDbxB` | Homepage image background | `public/styles.css` |
| `12h8CvO9N-ITZr1eRze6o3SLjLp6z1PmZ` | District Kolomna | `public/styles.css` |
| `1IYwPKoxADC5IajE_z6fDCBYT-gCS7RmA` | Literary district | `public/styles.css` |
| `1Bw7MdPmDnqtYBno34XGHIggzQvCGi2zA` | Historic centre | `public/styles.css` |
| `19n_94sR1tQip0q3EiGL04YXN2OCsW6WH` | Peterhof | `public/styles.css` |

These are seven unique IDs across the inspected homepage, shared styles, and About page, **not a full-site inventory**. Other HTML files and stylesheets still need scanning.

## Release gate

1. Retrieve original source images and confirm permission to publish on MOST Petersburg.
2. Record attribution and intended usage. Verify image actually depicts the named place.
3. Export responsive WebP files (e.g. 640 / 1200 / 1600 px) with sensible quality, retaining aspect ratio.
4. Add files to `public/assets/photos/` (Cloudflare Worker static assets); verify 200 and image content-type on production.
5. Replace references by exact Drive ID across HTML and CSS. Include width/height, `loading="lazy"` for below-fold HTML images, descriptive alt text.
6. Test mobile layout, image quality, caching, and Core Web Vitals; only then remove the Google Drive dependencies.

## Important

Do not substitute stock or AI-generated imagery and label it as a historical MOST archive photo. Do not assume public Drive access grants reuse rights.
