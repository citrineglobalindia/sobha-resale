# Sobha Resales — static SEO website

The site is pre-rendered static HTML, with no framework or backend. Every page is crawlable HTML with its own title, meta description, canonical URL, Open Graph and Twitter tags, and JSON-LD schema.

## Build
```bash
SITE_URL=https://www.yourdomain.com \
LEAD_ENDPOINT=https://your-leadrat-or-email-webhook \
GA4_ID=G-XXXXXXX \
GSC_VERIFICATION=xxxxxxxx \
node build.mjs           # → ./dist
```
All of these variables are optional. `SITE_URL` must be the final live domain, because canonicals, the sitemap and schema use it.

## Deploy on Vercel
Import the repo with Framework set to **Other**, Build Command `node build.mjs`, and Output Directory `dist`. Add the env vars above in Project → Settings → Environment Variables.

## Lead forms (Leadrat / email)
Every form sends a JSON `POST` to `LEAD_ENDPOINT`:
`form_type` (enquiry | visit | sell | property | callback), `full_name`, `phone`, `email`, `project`, `location`, `interest`, `preferred_date`, `preferred_time`, `message`, `whatsapp_consent`, `page_url`, `utm{}`, `referrer`, `submitted_at`, `source`.
If `LEAD_ENDPOINT` is empty, or the request fails, the form opens WhatsApp (+91 99011 40164) with the lead pre-filled, so no lead is lost.
GA4 records a `generate_lead` event on each submit, plus `click_call` and `click_whatsapp` events.

## Pages (28)
Home, About, Properties, 10 project pages (`/properties/<slug>/`), 8 location pages (`/locations/<area>/`), Sell, Request a Visit, Gallery, FAQs, Contact, 2 guides, 404.
SEO files: `sitemap.xml`, `robots.txt`, `llms.txt`, `site.webmanifest`.

## Edit content
Contacts, projects, areas, FAQs and brokerage terms are all in `src/data.mjs`. Images are in `public/img/` (WebP, cropped from the approved mockups).
