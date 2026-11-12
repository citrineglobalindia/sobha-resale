// Static site generator for Sobha Resales. Usage:
//   SITE_URL=https://www.example.com LEAD_ENDPOINT=https://... GA4_ID=G-XXXX node build.mjs
// Output: ./dist (deploy as static site)
import fs from 'node:fs';
import path from 'node:path';
import { SITE, AREAS, PROJECTS, FAQS, GUIDES } from './src/data.mjs';

const OUT = path.resolve('dist');
const TODAY = new Date().toISOString().slice(0, 10);
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync('public', OUT, { recursive: true });

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const abs = (p) => SITE.url + p;
const P0 = SITE.phones[0];
const wa = (t = 'Hi Sobha Resales, I would like to know more about Sobha resale homes.') => `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t)}`;
const areaOf = (p) => AREAS[p.area];
const pages = []; // for sitemap

// ── Icons ────────────────────────────────────────────────────
const I = {
  logo: '<svg viewBox="0 0 40 40" fill="none" stroke="#c9a45c" stroke-width="1.6" aria-hidden="true"><path d="M4 37h32M8 37V17l6-4v24M14 37V9l7-5v33M21 37V12l6 3v22M27 37V19l5 2v16"/><path d="M11 21v2M11 27v2M17 15v2M17 21v2M17 27v2M24 19v2M24 25v2M30 24v2"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4ZM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  bldg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 21h18M5 21V8l5-3v16M10 21V3l6 3v15M16 21V10l4 2v9"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 21h18M6 21v-6M11 21v-9M16 21v-6M21 21V8"/><path d="m4 11 6-5 4 3 6-6M16 3h4v4"/></svg>',
  hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1.4 1.4 0 0 1-2-2l2.8-2.8a5 5 0 0 1 5.6-1L21 7"/><path d="m21 3 1 11h-2M3 3 2 14l6.5 6.5a1.4 1.4 0 0 0 2-2M3 4h8"/></svg>',
  coins: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><ellipse cx="9" cy="6" rx="6" ry="3"/><path d="M3 6v4c0 1.7 2.7 3 6 3s6-1.3 6-3V6M3 10v4c0 1.7 2.7 3 6 3 1 0 2-.1 2.8-.3"/><ellipse cx="17" cy="15" rx="5" ry="2.5"/><path d="M12 15v3.5c0 1.4 2.2 2.5 5 2.5s5-1.1 5-2.5V15"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8Z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20a7 7 0 0 1 14 0M15 14.5a5 5 0 0 1 7 4.5"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m12 2 10 5-10 5L2 7l10-5Z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8Z"/><circle cx="7" cy="7" r="1.5"/></svg>',
  doc: '<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M40 6H14a4 4 0 0 0-4 4v44a4 4 0 0 0 4 4h20"/><path d="M40 6l10 10v14M40 6v10h10M18 22h20M18 30h24M18 38h14"/><circle cx="46" cy="46" r="11"/><path d="m41 46 4 4 7-7"/></svg>',
  cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.9L3 20l1.3-4A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
};

// ── Shared fragments ─────────────────────────────────────────
const img = (name, alt, { w = 1100, h = 620, eager = false, cls = '' } = {}) =>
  `<img src="/img/${name}.webp" alt="${esc(alt)}" width="${w}" height="${h}"${eager ? ' fetchpriority="high"' : ' loading="lazy" decoding="async"'}${cls ? ` class="${cls}"` : ''}>`;

const NAV = [['/', 'Home'], ['/about/', 'About'], ['/properties/', 'Properties'], ['/sell-sobha-property/', 'Sell'], ['/gallery/', 'Gallery'], ['/faqs/', 'FAQs'], ['/contact/', 'Contact']];

const header = (cur) => `<a class="skip" href="#main">Skip to content</a>
<header class="hdr"><div class="wrap">
<a class="logo" href="/" aria-label="Sobha Resales — home">${I.logo}<span class="bar"></span><span><b>SOBHA RESALES</b><small>Powered by SS Homes</small></span></a>
<button class="menu-btn" aria-label="Open menu" aria-expanded="false" aria-controls="nav"><svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>
<nav id="nav" class="nav" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}"${cur === h ? ' aria-current="page"' : ''}>${t}</a>`).join('')}<a class="btn btn-gold btn-sm" href="/request-visit/">Enquire Now</a></nav>
</div></header>`;

const footer = () => `<footer class="ftr"><div class="wrap">
<div class="cols">
<div><a class="logo" href="/">${I.logo}<span class="bar"></span><span><b>SOBHA RESALES</b><small>Powered by SS Homes</small></span></a>
<p style="margin-top:18px">Premium and luxury resale apartments &amp; villas across Sobha communities in Bengaluru. Buy, sell and visit with a team that knows every project.</p></div>
<div><h3>Quick Links</h3><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}<li><a href="/request-visit/">Request a Visit</a></li></ul></div>
<div><h3>Sobha Resale by Location</h3><ul>${Object.entries(AREAS).map(([k, a]) => `<li><a href="/locations/${k}/">Sobha resale in ${a.name}</a></li>`).join('')}</ul></div>
<div><h3>Get in Touch</h3><ul class="clist">
${SITE.phones.map((p) => `<li>${I.phone}<a href="tel:${p.tel}">${p.display}</a></li>`).join('')}
${SITE.emails.map((e) => `<li>${I.mail}<a href="mailto:${e}">${e}</a></li>`).join('')}
<li>${I.pin}<span>SS Homes, ${esc(SITE.address.street)}, Bengaluru – ${SITE.address.postalCode}</span></li>
<li>${I.clock}<span>${SITE.hours} · ${SITE.hoursNote}</span></li></ul></div>
</div>
<div class="base"><span>© ${new Date().getFullYear()} Sobha Resales. Powered by SS Homes. All rights reserved.</span>
<span class="disclaimer">Sobha Resales is an independent resale brokerage operated by SS Homes and is not affiliated with or endorsed by Sobha Limited. Project names belong to their respective owners. Images are illustrative.</span></div>
</div></footer>
<div class="fab"><a class="wa" href="${wa()}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${I.wa}</a><a class="call" href="tel:${P0.tel}" aria-label="Call ${P0.display}">${I.phone}</a></div>`;

const crumbsHtml = (list) => `<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${list.map(([h, t], i) => `<span class="sep">/</span>${i === list.length - 1 ? `<span aria-current="page">${esc(t)}</span>` : `<a href="${h}">${esc(t)}</a>`}`).join('')}</nav>`;
const crumbsLd = (list) => ({ '@type': 'BreadcrumbList', itemListElement: [['/', 'Home'], ...list].map(([h, t], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: abs(h) })) });

const ORG_ID = abs('/#organization');
const orgLd = {
  '@type': ['RealEstateAgent', 'LocalBusiness'], '@id': ORG_ID,
  name: 'Sobha Resales', alternateName: ['Sobha Resales by SS Homes', 'SS Homes'],
  url: abs('/'), logo: abs('/favicon.svg'), image: abs('/img/og-image.jpg'),
  description: 'Sobha Resales, powered by SS Homes, specializes in premium and luxury resale apartments and villas across Sobha communities in Bengaluru — for buyers and sellers.',
  telephone: P0.tel, email: SITE.emails[0],
  address: { '@type': 'PostalAddress', streetAddress: SITE.address.street, addressLocality: SITE.address.locality, addressRegion: SITE.address.region, postalCode: SITE.address.postalCode, addressCountry: SITE.address.country },
  areaServed: [{ '@type': 'City', name: 'Bengaluru' }, ...Object.values(AREAS).map((a) => ({ '@type': 'Place', name: `${a.full}, Bengaluru` }))],
  openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], opens: '09:00', closes: '18:00' }],
  contactPoint: SITE.phones.map((p) => ({ '@type': 'ContactPoint', telephone: p.tel, contactType: 'sales', areaServed: 'IN', availableLanguage: ['English', 'Kannada', 'Hindi'] })),
  founder: [{ '@type': 'Person', name: 'Krishnan A', jobTitle: 'Founder' }, { '@type': 'Person', name: 'Deepa Krishnan', jobTitle: 'Co-Founder' }],
  priceRange: '₹₹₹₹',
  knowsAbout: ['Sobha resale flats', 'Resale apartments in Bangalore', 'Luxury villas in Bangalore', 'Assignment Agreement', ...PROJECTS.map((p) => p.name)],
  sameAs: [],
};
const websiteLd = { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: 'Sobha Resales', inLanguage: 'en-IN', publisher: { '@id': ORG_ID } };
const faqLd = (items) => ({ '@type': 'FAQPage', mainEntity: items.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) });

function page({ path: p, title, desc, keywords, h1Img, body, ld = [], cur, ogImg = '/img/og-image.jpg', type = 'website', priority = 0.7, preload }) {
  const url = abs(p);
  const graph = { '@context': 'https://schema.org', '@graph': [websiteLd, orgLd, { '@type': 'WebPage', '@id': url + '#webpage', url, name: title, description: desc, isPartOf: { '@id': abs('/#website') }, about: { '@id': ORG_ID }, inLanguage: 'en-IN', primaryImageOfPage: abs(ogImg) }, ...ld] };
  const html = `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
${keywords ? `<meta name="keywords" content="${esc(keywords)}">` : ''}
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="en-IN" href="${url}">
<link rel="alternate" hreflang="x-default" href="${url}">
<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
<meta name="geo.region" content="IN-KA"><meta name="geo.placename" content="Bengaluru">
<meta name="theme-color" content="#0b1629">
<meta property="og:type" content="${type}"><meta property="og:site_name" content="Sobha Resales"><meta property="og:locale" content="en_IN">
<meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${url}">
<meta property="og:image" content="${abs(ogImg)}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Sobha Resales — premium Sobha resale homes in Bengaluru">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${abs(ogImg)}">
${SITE.gscVerification ? `<meta name="google-site-verification" content="${esc(SITE.gscVerification)}">` : ''}
<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/source-serif-4-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/mulish-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
${preload ? `<link rel="preload" as="image" href="/img/${preload}.webp" fetchpriority="high">` : ''}
<link rel="stylesheet" href="/css/styles.css">
<script type="application/ld+json">${JSON.stringify(graph)}</script>
${SITE.ga4 ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${SITE.ga4}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${SITE.ga4}');</script>` : ''}
</head>
<body>
${header(cur)}
<main id="main">
${body}
</main>
${footer()}
<script>window.SR=${JSON.stringify({ endpoint: SITE.leadEndpoint, wa: SITE.whatsapp })}</script>
<script src="/js/main.js" defer></script>
</body>
</html>`;
  const file = path.join(OUT, p === '/' ? 'index.html' : p.replace(/^\//, '') + (p.endsWith('/') ? 'index.html' : ''));
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html.replace(/\n{2,}/g, '\n'));
  if (p !== '/404.html') pages.push({ loc: url, priority });
}

const hero = ({ image, h1, lead, crumbs, eyebrow, ctas = '', small = false, alt }) => `<section class="hero${small ? ' sm' : ''}" style="padding:0">
${img(image, alt || h1, { eager: true })}
<div class="wrap">${crumbs ? crumbsHtml(crumbs) : ''}${eyebrow ? `<div class="eyebrow">${eyebrow}</div>` : ''}<h1>${h1}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}<hr class="rule">${ctas}</div></section>`;

const projOptions = (sel = '') => `<option value="">Choose a project</option>${PROJECTS.map((p) => `<option value="${esc(p.name)}"${sel === p.name ? ' selected' : ''}>${esc(p.name)} — ${esc(areaOf(p).full)}</option>`).join('')}<option value="Other Sobha project">Other Sobha project</option>`;
const consent = `<label class="chk"><input type="checkbox" name="whatsapp_consent" value="yes"> I agree to receive messages for communication via RCS / WhatsApp.</label>`;
const hp = `<label class="hp" aria-hidden="true">Company<input name="company" tabindex="-1" autocomplete="off"></label>`;
const fmsg = `<div class="form-msg" aria-live="polite"></div>`;

const pcard = (p, { big = false } = {}) => {
  const a = areaOf(p);
  return `<article class="pcard" data-area="${p.area}">
<a class="ph" href="/properties/${p.slug}/" tabindex="-1" aria-hidden="true">${img(p.img, `${p.name} resale apartments, ${a.full}, Bengaluru — illustrative visual`, { w: 640, h: 360 })}</a>
<div class="bd"><h3><a href="/properties/${p.slug}/">${esc(p.name)}</a></h3><div class="loc">${I.pin}${esc(a.full)}</div></div>
<div class="acts"><a class="btn btn-gold btn-sm" href="/request-visit/?project=${encodeURIComponent(p.name)}">Enquire for Availability</a><a class="btn btn-line btn-sm" href="/properties/${p.slug}/">View Property ${I.arrow}</a></div>
</article>`;
};

const focusList = () => {
  const half = Math.ceil(PROJECTS.length / 2);
  const li = (p) => `<li><a href="/properties/${p.slug}/">${esc(p.name)}</a><span>${esc(areaOf(p).name)}</span></li>`;
  return `<div class="focus-list"><ul>${PROJECTS.slice(0, half).map(li).join('')}</ul><ul>${PROJECTS.slice(half).map(li).join('')}</ul></div>`;
};

const whyItems = [
  [I.pin, 'Prime Listings', 'Curated resale homes in Bengaluru’s top Sobha communities.'],
  [I.shield, 'Trusted Brand', 'Backed by SS Homes with a strong track record and reliability.'],
  [I.chart, 'Market Experts', 'Deep understanding of Sobha projects and Bengaluru’s resale market.'],
  [I.hand, 'Smooth Transactions', 'End-to-end support for a hassle-free buying or selling experience.'],
  [I.coins, 'Fair Pricing', 'Transparent terms and a clear brokerage structure.'],
  [I.heart, 'Personalized Care', 'A focused, high-touch approach tailored to your unique needs.'],
];
const whySection = () => `<section class="bg-navy"><div class="wrap"><h2 class="title-lines">Why Choose Sobha Resales</h2><hr class="rule c">
<div class="why">${whyItems.map(([i, t, d]) => `<div>${i}<h3>${t}</h3><p>${d}</p></div>`).join('')}</div></div></section>`;

const team = () => `<div class="team">
<div><h3>Krishnan A</h3><div class="role">Founder</div><ul><li>Market expert</li><li>Wealth Consultant · AMFI registered Mutual Fund Distributor</li><li>Deep knowledge of Bangalore’s real estate evolution</li></ul></div>
<div><h3>Deepa Krishnan</h3><div class="role">Co-Founder</div><ul><li>Client relationship &amp; operations</li><li>Manages customer experience</li><li>Ensures honesty &amp; professionalism</li></ul></div></div>`;

const contactPanel = (title = 'Let Us Help You Plan') => `<aside class="panel-navy"><h2 style="font-size:1.9rem">${title}</h2><hr class="rule">
<ul class="clist" style="margin-bottom:22px">
<li>${I.chat}<span>Discuss your preferences</span></li><li>${I.cal}<span>Check current availability</span></li><li>${I.bldg}<span>Arrange a property showing</span></li></ul>
<hr style="border:0;border-top:1px solid rgba(201,164,92,.4);margin:0 0 20px">
<ul class="clist">${SITE.phones.map((p) => `<li>${I.phone}<a href="tel:${p.tel}">${p.display}</a></li>`).join('')}${SITE.emails.map((e) => `<li>${I.mail}<a href="mailto:${e}">${e}</a></li>`).join('')}</ul>
<div style="display:grid;gap:10px;margin-top:22px"><a class="btn btn-gold btn-block" href="tel:${P0.tel}">${I.phone} Call Our Team</a><a class="btn btn-line btn-block" href="${wa()}" target="_blank" rel="noopener">${I.wa} WhatsApp Us</a></div></aside>`;

const hoursBox = () => `<div class="hours"><h3>${I.clock} Office Hours</h3><hr class="rule" style="margin:8px 0 14px"><strong>${SITE.hours}</strong><br><em class="muted">${SITE.hoursNote}.</em></div>`;

const ctaBand = (h, btns, image = 'cta-band') => `<section class="band">${img(image, 'Landscaped walkway in a premium Sobha community, Bengaluru — illustrative', { w: 1100, h: 382 })}<div class="wrap"><h2>${h}</h2><hr class="rule"><div class="ctas">${btns}</div></div></section>`;
const callBtns = `<a class="btn btn-gold" href="tel:${P0.tel}">${I.phone} Call ${P0.display}</a><a class="btn btn-line" href="${wa()}" target="_blank" rel="noopener">${I.wa} WhatsApp Us</a>`;

const finder = () => `<form class="finder" data-finder role="search" aria-label="Find Sobha resale homes">
<h2>Find your<br>next address</h2>
<div><label for="f-loc">Location</label><select id="f-loc" name="location"><option value="">Select Location</option>${Object.entries(AREAS).map(([k, a]) => `<option value="${k}">${a.full}</option>`).join('')}</select></div>
<div><label for="f-proj">Project</label><select id="f-proj" name="project"><option value="">Select Sobha Project</option>${PROJECTS.map((p) => `<option value="${p.slug}">${esc(p.name)}</option>`).join('')}</select></div>
<button class="btn btn-gold" type="submit">Explore Homes ${I.arrow}</button></form>`;

const enquiryForm = ({ type = 'enquiry', project = '', compact = false, interest = true } = {}) => `<form class="form" data-lead="${type}" novalidate>
${compact ? '' : '<div class="row">'}<div><label for="${type}-name">Full Name <span class="req">*</span></label><input id="${type}-name" name="full_name" autocomplete="name" required minlength="2" placeholder="Enter your full name"></div>
<div><label for="${type}-phone">Phone Number <span class="req">*</span></label><input id="${type}-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required pattern="[0-9+ \\-]{10,15}" placeholder="Enter your phone number"></div>${compact ? '' : '</div>'}
<div><label for="${type}-email">Email Address</label><input id="${type}-email" name="email" type="email" autocomplete="email" placeholder="Enter your email address"></div>
${project ? `<input type="hidden" name="project" value="${esc(project)}">` : ''}
${interest && !project ? `<div><label for="${type}-int">Interested In</label><select id="${type}-int" name="interest"><option>Buying a resale home</option><option>Selling my property</option><option>Property visit</option><option>General enquiry</option></select></div>` : ''}
${compact ? '' : `<div><label for="${type}-msg">Your Message</label><textarea id="${type}-msg" name="message" placeholder="Tell us about your preferred property, budget or timeline"></textarea></div>`}
${hp}${compact ? '' : consent}
<button class="btn btn-gold btn-block" type="submit">${type === 'property' ? 'Request Details' : 'Send Enquiry'} ${I.arrow}</button>${fmsg}</form>`;

// ═════════════════════════════ PAGES ═════════════════════════════

// HOME
page({
  path: '/', cur: '/', priority: 1.0, preload: 'hero-home',
  title: 'Sobha Resale Flats & Villas in Bangalore | Sobha Resales',
  desc: 'Buy or sell verified Sobha resale apartments & villas in Bengaluru — Dream Acres, Windsor, Sentosa, Town Park, Victoria Park & more. Call +91 99011 40164.',
  keywords: 'sobha resale, sobha resale flats bangalore, sobha resale apartments, sobha resale villas, resale flats in bangalore, sobha apartments for sale bangalore, sobha dream acres resale, sobha windsor resale, sobha sentosa resale, luxury resale homes bangalore',
  body: `${hero({ image: 'hero-home', eyebrow: 'Sobha Resales', h1: 'Premium &amp; Luxury Sobha Resale Homes in Bengaluru', alt: 'Premium Sobha residential towers with pool at dusk, Bengaluru — illustrative',
    lead: 'Discover verified resale apartments &amp; villas in Bengaluru’s most prestigious Sobha communities — or sell your Sobha home with expert, end-to-end support.',
    ctas: `<div class="ctas"><a class="btn btn-gold" href="/properties/">Explore Properties ${I.arrow}</a><a class="btn btn-line" href="/request-visit/">${I.cal} Request a Visit</a></div>` })}
<div class="wrap">${finder()}</div>
<section><div class="wrap">
<div class="sec-head"><div><hr class="rule" style="margin-top:0"><h2>Premium Sobha Resale Apartments</h2></div><p>Explore a curated selection of premium resale apartments and villas in Bengaluru’s most sought-after Sobha communities.</p></div>
<div class="grid g3">${PROJECTS.filter((p) => p.featured).slice(0, 3).map((p) => pcard(p)).join('')}</div>
<div class="grid g2" style="margin-top:22px">${PROJECTS.filter((p) => p.featured).slice(3, 5).map((p) => pcard(p)).join('')}</div>
<p class="center" style="margin-top:30px"><a class="btn btn-line dark" href="/properties/">View all Sobha resale projects ${I.arrow}</a></p>
</div></section>
<section class="bg-paper"><div class="wrap split">
${img('clubhouse', 'Clubhouse and water feature at a luxury Sobha community, Bengaluru — illustrative', { w: 714, h: 704 })}
<div><div class="eyebrow">About Sobha Resales</div><h2>Your Trusted Partner for Premium Sobha Resale Homes in Bengaluru</h2>
<p>Sobha Resales, powered by SS Homes, specializes in premium and luxury resale homes across Sobha’s top communities in Bengaluru. With verified listings and expert knowledge, we help homebuyers access high-quality, high-value resale properties built by Sobha — and help owners sell theirs at the right price.</p>
<details class="acc"><summary>Resale Market Reality</summary><div class="ans"><p>Supply-driven inventory. Limited availability. Fast movement. Quick decision-making required.</p></div></details>
<details class="acc" open><summary>Brokerage Terms</summary><div class="ans"><p><strong>2%</strong> brokerage fee on the final sale value + <strong>18% GST</strong>. Payable before or on the day of signing the Assignment Agreement.</p></div></details>
<details class="acc"><summary>Our Focus Projects</summary><div class="ans"><p>${PROJECTS.map((p) => `<a href="/properties/${p.slug}/">${p.name}</a>`).join(' · ')}</p></div></details>
<details class="acc"><summary>Sell Your Sobha Property</summary><div class="ans"><p>Accurate pricing · Listing &amp; marketing · Buyer sourcing · Property showings · Negotiation · Documentation &amp; assignment support. <a href="/sell-sobha-property/">Learn more</a>.</p></div></details>
</div></div></section>
${whySection()}
<section><div class="wrap"><h2 class="center">Meet Our Dedicated Team</h2><p class="center muted">A hands-on, experienced team committed to helping you buy or sell your Sobha home with confidence.</p><hr class="rule c">${team()}</div></section>
<section class="bg-paper"><div class="wrap"><h2 class="title-lines">Sobha Resale Homes by Location</h2><hr class="rule c">
<p class="center muted" style="max-width:720px;margin:0 auto 26px">Looking for a Sobha resale flat in a specific part of Bengaluru? Browse resale homes by neighbourhood.</p>
<div class="chips" style="justify-content:center">${Object.entries(AREAS).map(([k, a]) => `<a href="/locations/${k}/">Sobha resale in ${a.name}</a>`).join('')}</div></div></section>
<section><div class="wrap split">
<div><hr class="rule" style="margin-top:0"><h2>Let’s find your next home.</h2><p class="muted">Get in touch with us for verified Sobha resale options, site visits and a personalized consultation.</p>${enquiryForm({ type: 'enquiry' })}</div>
<div>${img('walkway', 'Evening walkway lined with gardens at a Sobha apartment community, Bengaluru — illustrative', { w: 798, h: 868 })}
<ul class="clist" style="margin-top:22px">${SITE.phones.map((p) => `<li>${I.phone}<a href="tel:${p.tel}">${p.display}</a></li>`).join('')}${SITE.emails.map((e) => `<li>${I.mail}<a href="mailto:${e}">${e}</a></li>`).join('')}<li>${I.pin}<span>SS Homes, ${esc(SITE.address.street)}, Bangalore – ${SITE.address.postalCode}</span></li><li>${I.clock}<span>${SITE.hours} · Appointments only</span></li></ul></div>
</div></section>`,
  ld: [{ '@type': 'ItemList', name: 'Sobha resale projects in Bengaluru', itemListElement: PROJECTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/properties/${p.slug}/`), name: p.name })) }],
});

// ABOUT
page({
  path: '/about/', cur: '/about/', priority: 0.8, preload: 'hero-about',
  title: 'About Sobha Resales — Sobha Resale Experts in Bangalore',
  desc: 'Sobha Resales, powered by SS Homes, specializes in premium Sobha resale homes in Bengaluru. Meet founders Krishnan A & Deepa Krishnan.',
  keywords: 'sobha resales, ss homes bangalore, sobha resale agent, sobha resale broker bangalore, real estate consultant bangalore, krishnan a ss homes',
  body: `${hero({ image: 'hero-about', h1: 'Your Trusted Partner in Sobha Resales', crumbs: [['/about/', 'About Us']], alt: 'Entrance of a premium Sobha community at dusk — illustrative' })}
<section><div class="wrap split">${img('pergola', 'Landscaped pergola and gardens in a premium Sobha community — illustrative', { w: 992, h: 552 })}
<div><hr class="rule" style="margin-top:0"><h2>Premium homes.<br>Personal expertise.</h2><p>Sobha Resales, powered by SS Homes, specializes in premium and luxury resale homes across Sobha’s top communities in Bengaluru. With verified listings and expert knowledge, we help homebuyers access high-quality and high-value resale properties built by Sobha.</p>
<p>From Hennur and Thanisandra in the north to Whitefield, Panathur and Sarjapur in the east, Rajajinagar in the west and Devanahalli near the airport, we track the resale market in every community we serve — so our clients get realistic prices, genuine inventory and a smooth transaction.</p></div></div></section>
${whySection()}
<section><div class="wrap"><h2 class="center">The Team Behind Sobha Resales</h2><hr class="rule c">${team()}</div></section>
<section class="bg-paper"><div class="wrap" style="max-width:900px">
<details class="acc" open><summary>Resale Market Reality</summary><div class="ans"><p>Supply-driven inventory. Limited availability. Fast movement. Quick decision-making required.</p></div></details>
<details class="acc" open><summary>Brokerage Terms</summary><div class="ans"><p>${SITE.brokerage}</p></div></details>
<details class="acc" open><summary>Sell Your Sobha Property</summary><div class="ans"><p>Accurate pricing · Listing &amp; marketing · Buyer sourcing · Property showings · Negotiation · Documentation &amp; Assignment support</p></div></details>
<p class="center" style="margin-top:28px"><a class="btn btn-gold" href="/contact/">Speak to Our Team ${I.arrow}</a></p></div></section>`,
  ld: [crumbsLd([['/about/', 'About Us']]), { '@type': 'AboutPage', url: abs('/about/'), mainEntity: { '@id': ORG_ID } }],
});

// PROPERTIES
page({
  path: '/properties/', cur: '/properties/', priority: 0.9, preload: 'hero-properties',
  title: 'Sobha Resale Properties in Bangalore — Apartments & Villas',
  desc: 'Browse Sobha resale apartments & villas in Bengaluru: Victoria Park, Dream Gardens, Windsor, Sentosa, Dream Acres, Town Park, Royal Pavilion & more.',
  keywords: 'sobha resale properties, sobha flats for sale bangalore, sobha resale apartments bangalore, sobha villas for sale, resale apartments whitefield, resale flats panathur, resale flats hennur',
  body: `${hero({ image: 'hero-properties', h1: 'Discover Your Next Address', lead: 'Premium Sobha resale apartments &amp; villas across Bengaluru.', crumbs: [['/properties/', 'Properties']], small: true, alt: 'Sobha apartment towers across Bengaluru skyline at dusk — illustrative' })}
<div class="wrap">${finder()}</div>
<section style="padding-top:40px"><div class="wrap">
<div class="chips" data-filter-chips style="margin-bottom:30px"><button class="on" data-v="all" aria-pressed="true">All Properties</button>${[...new Set(PROJECTS.map((p) => p.area))].map((k) => `<button data-v="${k}" aria-pressed="false">${AREAS[k].name}</button>`).join('')}</div>
<h2 class="title-lines">Premium Resale Apartments &amp; Villas</h2><hr class="rule c">
<div class="grid g3">${PROJECTS.map((p) => pcard(p)).join('')}</div>
</div></section>
<section class="bg-paper"><div class="wrap"><h2 class="title-lines">Our Focus Projects</h2><hr class="rule c">${focusList()}</div></section>
<section class="strip"><div class="wrap"><h2>Looking for a specific Sobha home?</h2><a class="btn btn-gold" href="/contact/">Speak to Our Team</a><a class="btn btn-line" href="tel:${P0.tel}">${I.phone} ${P0.display}</a></div></section>`,
  ld: [crumbsLd([['/properties/', 'Properties']]), { '@type': 'CollectionPage', url: abs('/properties/'), name: 'Sobha resale properties in Bengaluru' },
    { '@type': 'ItemList', itemListElement: PROJECTS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/properties/${p.slug}/`), name: `${p.name}, ${areaOf(p).full}` })) }],
});

// PROJECT PAGES
for (const p of PROJECTS) {
  const a = areaOf(p);
  const others = PROJECTS.filter((x) => x.slug !== p.slug && x.area === p.area).concat(PROJECTS.filter((x) => x.slug !== p.slug && x.area !== p.area)).slice(0, 2);
  const faqs = [
    [`Are resale flats available in ${p.name}?`, `Resale inventory in ${p.name}, ${a.full} is supply-driven and units move quickly. Contact Sobha Resales on ${P0.display} or WhatsApp for the current list of available resale units.`],
    [`What is the resale price of ${p.name}?`, `Resale prices at ${p.name} depend on configuration, floor, view, facing and condition, and change with market demand. Request current details and we will share live pricing and floor plans for available units.`],
    [`How do I visit ${p.name}?`, `Use our Request a Visit form or call ${P0.display}. Our team checks availability with owners and arranges a guided showing at ${p.name} at a time that suits you — Monday to Sunday, 9am–6pm.`],
    [`What is the brokerage for buying a resale flat in ${p.name}?`, SITE.brokerage],
    [`Can you help me sell my flat in ${p.name}?`, `Yes. We help owners at ${p.name} with accurate pricing, listing and marketing, buyer sourcing, showings, negotiation and documentation including the Assignment Agreement.`],
  ];
  const path_ = `/properties/${p.slug}/`;
  page({
    path: path_, cur: '/properties/', priority: 0.9, preload: p.img, type: 'website',
    title: `${p.name} Resale Flats in ${a.name}, Bangalore`,
    desc: `Buy or sell resale homes at ${p.name}, ${a.full}, Bengaluru. Live availability, resale price, floor plans & site visits. Call ${P0.display}.`,
    keywords: `${p.name.toLowerCase()} resale, ${p.name.toLowerCase()} resale price, ${p.name.toLowerCase()} flats for sale, ${p.name.toLowerCase()} ${a.name.toLowerCase()}, resale flats in ${a.name.toLowerCase()}, sobha resale ${a.name.toLowerCase()}, ${p.name.toLowerCase()} floor plan`,
    body: `<section class="hero sm" style="padding:0"><div class="wrap" style="padding-top:28px;padding-bottom:22px">
${crumbsHtml([['/properties/', 'Properties'], [path_, p.name]])}
<div style="display:flex;justify-content:space-between;align-items:center;gap:20px;flex-wrap:wrap"><div><h1 style="margin-bottom:6px">${esc(p.name)} Resale</h1><div class="loc" style="font-size:1.1rem">${I.pin}${esc(a.full)}, Bengaluru</div></div>
<a class="btn btn-gold" href="#enquire">Enquire Now ${I.arrow}</a></div></div></section>
<div class="wrap" style="padding-top:14px" id="gallery"><div class="dgal">
<figure>${img(p.img, `${p.name}, ${a.full} — exterior, illustrative visual`, { eager: true })}<figcaption class="tag">Illustrative visuals</figcaption></figure>
<figure>${img('d-living', `Living room in a premium resale apartment at ${p.name} — illustrative`, { w: 692, h: 340 })}</figure>
<figure>${img('d-dining', `Dining area in a Sobha resale home at ${p.name} — illustrative`, { w: 692, h: 324 })}</figure></div></div>
<section style="padding-top:36px"><div class="wrap">
<nav class="subnav" aria-label="On this page"><a href="#overview">Overview</a><a href="#gallery">Gallery</a><a href="#availability">Availability</a><a href="#faq">FAQs</a><a href="#enquire">Enquire</a></nav>
<div class="two"><div class="prose" id="overview">
<h2 style="margin-top:0">A premium address in ${esc(a.name)}</h2>
<p class="muted" style="font-size:1.08rem">Explore resale opportunities at ${esc(p.name)} on ${esc(a.full)}, Bengaluru, with Sobha Resales, powered by SS Homes.</p>
<div class="facts">
<div>${I.bldg}<b>Project</b><span>${esc(p.name)}</span></div>
<div>${I.pin}<b>Location</b><span>${esc(a.full)}, ${esc(a.zone)}</span></div>
<div>${I.layers}<b>Availability</b><span><a href="#enquire">Contact our team</a></span></div>
<div>${I.tag}<b>Price &amp; configuration</b><span><a href="#enquire">Request current details</a></span></div></div>
<h2>Why buy a resale home at ${esc(p.name)}?</h2>
<p>${esc(p.name)} is one of the Sobha communities buyers ask us about most in ${esc(a.zone)}. A resale home here is typically ready to move in — you see the finished apartment, the amenities and the neighbourhood before you commit, with no construction-delay risk and a price negotiated directly with the owner.</p>
<ul><li>Sobha’s in-house build quality and finishing</li><li>Established, gated community with amenities already operational</li><li>Ready-to-move inventory — no waiting for possession</li><li>Verified listings and transparent brokerage through Sobha Resales</li></ul>
<h2>About the ${esc(a.full)} location</h2>
<p>${esc(a.intro)}</p>
<ul>${a.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
<h2 id="availability">Resale guidance</h2>
<details class="acc"><summary>Current availability</summary><div class="ans"><p>Resale inventory at ${esc(p.name)} is limited and moves quickly. Share your preferred configuration and budget — we’ll send the units currently available.</p></div></details>
<details class="acc"><summary>Pricing &amp; floor plans</summary><div class="ans"><p>We share live resale pricing, floor plans and unit details for available homes at ${esc(p.name)} on request, benchmarked against recent transactions in the community.</p></div></details>
<details class="acc"><summary>Arrange a property visit</summary><div class="ans"><p>Pick a date and time on our <a href="/request-visit/?project=${encodeURIComponent(p.name)}">visit request form</a> and our team will confirm the showing.</p></div></details>
<details class="acc" open><summary>Brokerage Terms</summary><div class="ans"><p>${SITE.brokerage}</p></div></details>
<h2>Selling your home at ${esc(p.name)}?</h2>
<p>We help ${esc(p.name)} owners with accurate pricing, listing and marketing, buyer sourcing, showings, negotiation and documentation — including the Assignment Agreement. <a href="/sell-sobha-property/">See how we sell Sobha homes</a>.</p>
<h2 id="faq">${esc(p.name)} resale — FAQs</h2>
${faqs.map(([q, ans]) => `<details class="acc"><summary>${esc(q)}</summary><div class="ans"><p>${esc(ans)}</p></div></details>`).join('')}
<p class="disclaimer">Images are illustrative. Availability, prices and configurations are subject to owner confirmation.</p>
</div>
<aside class="sticky" id="enquire"><div class="panel-navy"><h2 style="font-size:1.8rem">Interested in this property?</h2><hr class="rule">${enquiryForm({ type: 'property', project: p.name, compact: true })}
<p class="center" style="margin:16px 0 0"><a href="tel:${P0.tel}" style="color:var(--gold-2);font-family:var(--serif);font-size:1.4rem;text-decoration:none">${I.phone.replace('<svg', '<svg width="20" height="20" style="display:inline;vertical-align:-3px"')} ${P0.display}</a></p></div></aside>
</div></div></section>
<section class="bg-paper"><div class="wrap"><div class="sec-head"><h2 style="margin:0">Explore Other Communities</h2><a class="btn btn-line dark btn-sm" href="/locations/${p.area}/">More Sobha resale in ${esc(a.name)}</a></div>
<div class="grid g2">${others.map((o) => pcard(o)).join('')}</div></div></section>`,
    ld: [crumbsLd([['/properties/', 'Properties'], [path_, p.name]]), faqLd(faqs),
      { '@type': 'ApartmentComplex', '@id': abs(path_) + '#place', name: p.name, url: abs(path_), image: abs(`/img/${p.img}.webp`),
        description: `Resale apartments and homes at ${p.name}, ${a.full}, Bengaluru — offered through Sobha Resales by SS Homes.`,
        address: { '@type': 'PostalAddress', streetAddress: a.full, addressLocality: 'Bengaluru', addressRegion: 'Karnataka', addressCountry: 'IN' },
        containedInPlace: { '@type': 'City', name: 'Bengaluru' } },
      { '@type': 'Service', name: `${p.name} resale brokerage`, serviceType: 'Real estate resale brokerage', provider: { '@id': ORG_ID }, areaServed: `${a.full}, Bengaluru`,
        offers: { '@type': 'Offer', description: SITE.brokerage } }],
  });
}

// LOCATION PAGES
for (const [k, a] of Object.entries(AREAS)) {
  const ps = PROJECTS.filter((p) => p.area === k);
  const path_ = `/locations/${k}/`;
  const faqs = [
    [`Which Sobha projects have resale flats in ${a.name}?`, `We focus on ${ps.map((p) => p.name).join(' and ')} in ${a.full}. Contact us for current resale availability.`],
    [`Is ${a.name} a good place to buy a resale flat in Bangalore?`, `${a.intro} Ready-to-move Sobha homes here see steady demand from end-users and investors.`],
    [`How do I book a site visit for Sobha resale homes in ${a.name}?`, `Request a visit online or call ${P0.display}. We confirm availability with owners and schedule a guided showing, Monday to Sunday, 9am–6pm.`],
  ];
  page({
    path: path_, cur: '/properties/', priority: 0.8, preload: 'hero-properties',
    title: `Sobha Resale Flats in ${a.name}, Bangalore | Sobha Resales`,
    desc: `Resale Sobha apartments & villas in ${a.full}, Bengaluru — ${ps.map((p) => p.name).join(', ')}. Verified listings & site visits. Call ${P0.display}.`,
    keywords: `sobha resale ${a.name.toLowerCase()}, resale flats in ${a.name.toLowerCase()}, resale apartments ${a.name.toLowerCase()} bangalore, ${ps.map((p) => p.name.toLowerCase() + ' resale').join(', ')}, flats for sale in ${a.name.toLowerCase()}`,
    body: `${hero({ image: 'hero-properties', h1: `Sobha Resale Homes in ${esc(a.full)}`, lead: `Verified resale apartments &amp; villas in ${esc(a.zone)}’s premium Sobha communities.`, crumbs: [['/properties/', 'Properties'], [path_, a.name]], small: true, alt: `Sobha apartments in ${a.full}, Bengaluru — illustrative` })}
<section><div class="wrap two"><div class="prose">
<h2 style="margin-top:0">Why ${esc(a.name)}?</h2><p>${esc(a.intro)}</p><ul>${a.why.map((w) => `<li>${esc(w)}</li>`).join('')}</ul>
<h2>Sobha resale projects in ${esc(a.name)}</h2>
<div class="grid g2" style="margin-top:18px">${ps.map((p) => pcard(p)).join('')}</div>
<h2>Buying a resale Sobha home in ${esc(a.name)}</h2>
<p>Resale inventory in ${esc(a.name)} is supply-driven and good units move fast. Tell us your preferred project, configuration and budget — we shortlist verified options, arrange showings, negotiate with owners and handle documentation through to the Assignment Agreement or registration.</p>
<h2>FAQs</h2>${faqs.map(([q, ans]) => `<details class="acc"><summary>${esc(q)}</summary><div class="ans"><p>${esc(ans)}</p></div></details>`).join('')}
</div><aside class="sticky"><div class="panel"><h2 style="font-size:1.6rem">Get ${esc(a.name)} resale options</h2><hr class="rule">${enquiryForm({ type: 'callback', compact: true })}</div><div style="margin-top:20px">${hoursBox()}</div></aside></div></section>
<section class="bg-paper"><div class="wrap"><h2 class="title-lines">Other Locations</h2><hr class="rule c"><div class="chips" style="justify-content:center">${Object.entries(AREAS).filter(([kk]) => kk !== k).map(([kk, aa]) => `<a href="/locations/${kk}/">Sobha resale in ${aa.name}</a>`).join('')}</div></div></section>`,
    ld: [crumbsLd([['/properties/', 'Properties'], [path_, a.name]]), faqLd(faqs),
      { '@type': 'ItemList', name: `Sobha resale projects in ${a.full}`, itemListElement: ps.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(`/properties/${p.slug}/`), name: p.name })) }],
  });
}

// SELL
const sellSteps = [['Accurate pricing', 'A realistic, market-aligned price based on current demand and project dynamics.'], ['Listing & marketing', 'A compelling listing with professional assets, showcased to the right audience.'], ['Buyer sourcing', 'Connecting your property with genuine, qualified buyers looking for Sobha homes.'], ['Property showings', 'Coordinated, thoughtful site visits with interested buyers for a smooth experience.'], ['Negotiation', 'Professional representation to help you secure the right outcome.'], ['Documentation & assignment support', 'End-to-end assistance with all paperwork, including the Assignment Agreement process.']];
page({
  path: '/sell-sobha-property/', cur: '/sell-sobha-property/', priority: 0.9, preload: 'hero-sell',
  title: 'Sell Your Sobha Flat in Bangalore — Expert Resale Support',
  desc: 'Sell your Sobha apartment or villa in Bengaluru with accurate pricing, marketing, qualified buyers, negotiation & Assignment Agreement support. 2% + GST brokerage.',
  keywords: 'sell sobha flat, sell sobha apartment bangalore, sell my flat in bangalore, sobha resale value, list property for sale bangalore, sobha property resale agent, assignment agreement sobha',
  body: `${hero({ image: 'hero-sell', eyebrow: 'For Property Owners', h1: 'Your Sobha Property.<br>Its Next Chapter.', lead: 'Complete assistance for sellers, from accurate pricing to documentation and assignment support.', crumbs: [['/sell-sobha-property/', 'Sell Your Property']], alt: 'Sobha residential towers and gardens at dusk — illustrative',
    ctas: `<div class="ctas"><a class="btn btn-gold" href="#sell-form">Request a Callback</a><a class="btn btn-line" href="tel:${P0.tel}">${I.phone} Speak to Our Team</a></div>` })}
<section><div class="wrap split" style="align-items:start">
<div><h2>A considered approach to selling.</h2><hr class="rule"><ol class="timeline">${sellSteps.map(([t, d], i) => `<li><span class="n">0${i + 1}</span><h3>${t}</h3><p>${d}</p></li>`).join('')}</ol></div>
<div class="panel" id="sell-form"><h2 style="font-size:1.8rem">Tell Us About Your Property</h2>
<form class="form" data-lead="sell" novalidate>
<div class="row"><div><label for="s-name">Full Name <span class="req">*</span></label><input id="s-name" name="full_name" autocomplete="name" required minlength="2"></div>
<div><label for="s-phone">Phone Number <span class="req">*</span></label><input id="s-phone" name="phone" type="tel" autocomplete="tel" required pattern="[0-9+ \\-]{10,15}"></div></div>
<div><label for="s-email">Email Address <span class="req">*</span></label><input id="s-email" name="email" type="email" autocomplete="email" required></div>
<div><label for="s-proj">Sobha Project Name <span class="req">*</span></label><select id="s-proj" name="project" required>${projOptions()}</select></div>
<div><label for="s-loc">Property Location <span class="req">*</span></label><select id="s-loc" name="location" required><option value="">Choose a location</option>${Object.values(AREAS).map((a) => `<option>${a.full}</option>`).join('')}<option>Other</option></select></div>
<div><label for="s-msg">Your Message</label><textarea id="s-msg" name="message" placeholder="Configuration, floor, expected price, timeline…"></textarea></div>
<div class="drop">${I.chat.replace('<svg', '<svg width="26" height="26" style="margin:0 auto 6px;color:#9c7a35"')}<strong>Property photos (optional)</strong><br>After submitting, share photos with us on <a href="${wa('Hi, sharing photos of my Sobha property for resale.')}" target="_blank" rel="noopener">WhatsApp</a>.</div>
${hp}${consent}<button class="btn btn-gold btn-block" type="submit">Request a Callback</button>${fmsg}</form></div>
</div></section>
<section class="bg-navy" style="padding:44px 0"><div class="wrap"><h2 class="center">Your property. Our personal attention.</h2><div class="feats" style="margin-top:26px">
<div>${I.chart}<div><h3>Market expertise</h3><p>In-depth understanding of Sobha projects and buyer demand.</p></div></div>
<div>${I.user}<div><h3>Personalized support</h3><p>A dedicated team that works closely with you, at every step.</p></div></div>
<div>${I.layers}<div><h3>End-to-end assistance</h3><p>From pricing to documentation and assignment, we take care of it all.</p></div></div></div></div></section>
<section><div class="wrap"><div class="terms"><div>${I.doc}</div><div><h2 style="font-size:1.9rem">Clear Brokerage Terms</h2><p style="font-size:1.1rem;margin:0"><strong>2% brokerage fee on the final sale value + 18% GST.</strong><br>Payable before or on the day of signing the Assignment Agreement.</p></div></div></div></section>
${ctaBand('Let’s plan your next move.', callBtns, 'g-landscape')}`,
  ld: [crumbsLd([['/sell-sobha-property/', 'Sell Your Property']]),
    { '@type': 'Service', name: 'Sell your Sobha property — resale brokerage', serviceType: 'Real estate seller representation', provider: { '@id': ORG_ID }, areaServed: { '@type': 'City', name: 'Bengaluru' },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: 'Seller services', itemListElement: sellSteps.map(([t, d]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: t, description: d } })) },
      offers: { '@type': 'Offer', description: SITE.brokerage } },
    { '@type': 'HowTo', name: 'How to sell your Sobha property in Bengaluru', step: sellSteps.map(([t, d], i) => ({ '@type': 'HowToStep', position: i + 1, name: t, text: d })) }],
});

// REQUEST VISIT
const times = ['9:00 AM – 11:00 AM', '11:00 AM – 1:00 PM', '1:00 PM – 3:00 PM', '3:00 PM – 5:00 PM', '5:00 PM – 6:00 PM'];
page({
  path: '/request-visit/', cur: '', priority: 0.8, preload: 'hero-visit',
  title: 'Book a Site Visit — Sobha Resale Homes Bangalore',
  desc: 'Request a property visit for Sobha resale apartments & villas in Bengaluru. Choose your project, date and time — our team confirms availability. Mon–Sun 9am–6pm.',
  keywords: 'sobha site visit, book property visit bangalore, sobha resale site visit, visit sobha apartment, property showing bangalore',
  body: `${hero({ image: 'hero-visit', h1: 'Experience Your Next Home.', lead: 'Request a property visit with the Sobha Resales team.', crumbs: [['/request-visit/', 'Request a Visit']], small: true, alt: 'Sobha apartment building with lit gardens at dusk — illustrative' })}
<section><div class="wrap two">
<div class="panel"><h2>Plan Your Property Visit</h2><p class="muted">Share your preferences. Our team will contact you to confirm availability and your visit.</p>
<form class="form" data-lead="visit" novalidate>
<div class="row"><div><label for="v-proj">Select Project <span class="req">*</span></label><select id="v-proj" name="project" required>${projOptions()}</select></div>
<div><label for="v-date">Preferred Date <span class="req">*</span></label><input id="v-date" name="preferred_date" type="date" required></div></div>
<div class="row"><div><label for="v-time">Preferred Time <span class="req">*</span></label><select id="v-time" name="preferred_time" required><option value="">Select time</option>${times.map((t) => `<option>${t}</option>`).join('')}</select></div>
<div><label for="v-name">Full Name <span class="req">*</span></label><input id="v-name" name="full_name" autocomplete="name" required minlength="2" placeholder="Enter your full name"></div></div>
<div class="row"><div><label for="v-phone">Phone Number <span class="req">*</span></label><input id="v-phone" name="phone" type="tel" autocomplete="tel" required pattern="[0-9+ \\-]{10,15}" placeholder="Enter your phone number"></div>
<div><label for="v-email">Email Address <span class="req">*</span></label><input id="v-email" name="email" type="email" autocomplete="email" required placeholder="Enter your email address"></div></div>
<div><label for="v-msg">Additional Notes</label><textarea id="v-msg" name="message" placeholder="Share any specific requirements or preferences (optional)"></textarea></div>
${hp}${consent}<button class="btn btn-gold btn-block" type="submit">Request a Visit ${I.arrow}</button>${fmsg}
<p class="note">This is a visit request. The team will confirm your appointment.</p></form></div>
<div>${contactPanel()}<div style="margin-top:22px">${hoursBox()}</div></div></div></section>
<section class="bg-paper"><div class="wrap"><h2 class="center">What Happens Next?</h2><hr class="rule c"><div class="steps">
<div><span class="num">01</span><div><h3>Share your preferences</h3><p class="muted">Tell us which property interests you.</p></div></div>
<div><span class="num">02</span><div><h3>Hear from our team</h3><p class="muted">Discuss current availability and a suitable visit time.</p></div></div>
<div><span class="num">03</span><div><h3>Explore the property</h3><p class="muted">View the home with guidance from our team.</p></div></div></div></div></section>
${ctaBand('Your next address<br>starts with a visit.', callBtns)}`,
  ld: [crumbsLd([['/request-visit/', 'Request a Visit']]), { '@type': 'ContactPage', url: abs('/request-visit/'), potentialAction: { '@type': 'ScheduleAction', name: 'Request a property visit', target: abs('/request-visit/') } }],
});

// GALLERY
const gal = [
  ['g-ext-garden', 'Exterior', 'ext', 'w7', 'Sobha apartment towers with landscaped lawns — exterior'],
  ['g-int-living', 'Interior', 'int', 'w5', 'Spacious living room with balcony view in a Sobha resale apartment'],
  ['g-ext-dusk', 'Exterior', 'ext', 'w7', 'Sobha residential towers lit at dusk'],
  ['g-int-dining', 'Interior', 'int', 'w5', 'Elegant dining room in a premium Sobha home'],
  ['g-landscape', 'Landscape', 'land', 'w6', 'Garden walkway with lighting in a Sobha community'],
  ['g-int-empty', 'Interior', 'int', 'w6', 'Bright, ready-to-move apartment with balcony'],
  ['d-living', 'Interior', 'int', 'w5', 'Living room with garden views'],
  ['g-carousel', 'Exterior', 'ext', 'w7', 'Sobha apartments with flowering trees and lawns'],
  ['clubhouse', 'Exterior', 'ext', 'w6', 'Clubhouse with reflecting pool'],
  ['garden-path', 'Landscape', 'land', 'w6', 'Lit garden path between apartment blocks'],
];
page({
  path: '/gallery/', cur: '/gallery/', priority: 0.6, preload: 'hero-gallery',
  title: 'Sobha Resale Homes Gallery — Interiors, Exteriors & Landscapes',
  desc: 'Explore the spaces: interiors, exteriors and landscaped grounds of premium Sobha resale homes in Bengaluru. Illustrative visuals by Sobha Resales.',
  keywords: 'sobha apartment photos, sobha interiors, sobha villa photos, luxury apartment interiors bangalore, sobha community amenities',
  body: `${hero({ image: 'hero-gallery', h1: 'Explore the Spaces.', lead: 'A closer look at premium homes and communities.', crumbs: [['/gallery/', 'Gallery']], small: true, alt: 'Sobha towers at twilight — illustrative' })}
<section><div class="wrap">
<div class="sec-head"><div><h2 style="margin:0">Property Gallery</h2><p class="muted" style="font-style:italic;margin:4px 0 0">Illustrative visuals for presentation.</p></div>
<div><label class="sr" for="gal-project">Choose a project</label><select id="gal-project" style="min-width:240px"><option value="">All Projects</option>${PROJECTS.map((p) => `<option value="${p.slug}">${esc(p.name)}</option>`).join('')}</select></div></div>
<div class="tabs" data-gal-tabs role="tablist" style="border:0;gap:0;margin-bottom:18px"><button role="tab" aria-selected="true" data-v="all">All Photos</button><button role="tab" aria-selected="false" data-v="ext">Exteriors</button><button role="tab" aria-selected="false" data-v="int">Interiors</button><button role="tab" aria-selected="false" data-v="land">Landscapes</button></div>
<div class="gal">${gal.map(([f, c, cat, w, alt]) => `<figure class="${w}" data-cat="${cat}">${img(f, alt + ' — illustrative', { w: 900, h: 400 })}<figcaption>${c}</figcaption></figure>`).join('')}</div>
<div class="lb" role="dialog" aria-label="Image viewer"><button aria-label="Close">×</button><img alt=""></div>
</div></section>
<section class="strip"><div class="wrap"><h2>See a home you like?</h2><span>Speak with our team to arrange a property visit.</span><a class="btn btn-gold" href="tel:${P0.tel}" style="margin-left:auto">${I.phone} Call ${P0.display}</a></div></section>`,
  ld: [crumbsLd([['/gallery/', 'Gallery']]), { '@type': 'ImageGallery', url: abs('/gallery/'), image: gal.map(([f, , , , alt]) => ({ '@type': 'ImageObject', contentUrl: abs(`/img/${f}.webp`), caption: alt })) }],
});

// FAQS
const allFaqs = Object.values(FAQS).flat();
page({
  path: '/faqs/', cur: '/faqs/', priority: 0.7, preload: 'hero-faq',
  title: 'Sobha Resale FAQs — Buying, Selling & Brokerage Terms',
  desc: 'Answers on buying and selling Sobha resale flats in Bengaluru: availability, site visits, documents, Assignment Agreement and brokerage terms (2% + 18% GST).',
  keywords: 'sobha resale faq, resale flat documents bangalore, assignment agreement brokerage, how to buy resale flat bangalore, sobha resale brokerage',
  body: `${hero({ image: 'hero-faq', h1: 'Clarity at Every Step.', lead: 'Your questions about buying and selling, answered.', crumbs: [['/faqs/', 'FAQs']], small: true, alt: 'Sobha community with pool at night — illustrative' })}
<section><div class="wrap">
<div class="sec-head"><h2 style="margin:0">How Can We Help?</h2><div style="flex:1;max-width:540px"><label class="sr" for="faq-search">Search your questions</label><input id="faq-search" type="search" placeholder="Search your questions"></div></div>
<div class="tabs" data-faq-tabs role="tablist"><button role="tab" aria-selected="true" data-v="all">All</button>${Object.keys(FAQS).map((k) => `<button role="tab" aria-selected="false" data-v="${esc(k)}">${esc(k)}</button>`).join('')}</div>
<div class="two"><div id="faqs">${Object.entries(FAQS).map(([g, qs]) => `<div data-faq-group="${esc(g)}"><h3 class="sr">${esc(g)}</h3>${qs.map(([q, ans], i) => `<details class="acc"${i === 0 && g === 'General' ? ' open' : ''}><summary>${esc(q)}</summary><div class="ans"><p>${esc(ans)}</p></div></details>`).join('')}</div>`).join('')}
<p class="disclaimer" style="border-left:2px solid var(--gold);padding-left:12px">Contact our team for property-specific information.</p></div>
<aside><div class="panel-navy"><h2 style="font-size:2rem">Still Have Questions?</h2><hr class="rule"><p>Speak with the Sobha Resales team.</p><ul class="clist"><li>${I.phone}<a href="tel:${P0.tel}">${P0.display}</a></li><li>${I.mail}<a href="mailto:${SITE.emails[0]}">${SITE.emails[0]}</a></li></ul>
<div style="display:grid;gap:10px;margin-top:20px"><a class="btn btn-gold" href="/contact/">Contact Our Team</a><a class="btn btn-line" href="${wa()}" target="_blank" rel="noopener">${I.wa} WhatsApp Us</a></div></div><div style="margin-top:20px">${hoursBox()}</div></aside></div>
</div></section>
<section class="bg-paper"><div class="wrap"><h2 class="title-lines">Support for Your Next Move</h2><hr class="rule c"><div class="grid g3">
<a class="card" href="/properties/" style="padding:26px;text-decoration:none">${I.bldg.replace('<svg', '<svg width="40" height="40" style="color:#c9a45c"')}<h3 style="margin-top:12px">Explore Properties</h3><p class="muted">Discover premium resale communities in Bengaluru.</p></a>
<a class="card" href="/sell-sobha-property/" style="padding:26px;text-decoration:none">${I.hand.replace('<svg', '<svg width="40" height="40" style="color:#c9a45c"')}<h3 style="margin-top:12px">Sell Your Property</h3><p class="muted">Assistance with pricing, marketing, buyer sourcing, showings, negotiation and documentation.</p></a>
<a class="card" href="/contact/" style="padding:26px;text-decoration:none">${I.users.replace('<svg', '<svg width="40" height="40" style="color:#c9a45c"')}<h3 style="margin-top:12px">Speak to Our Team</h3><p class="muted">Discuss your preferences and request current availability.</p></a></div>
<h3 style="margin-top:44px">Guides</h3><ul>${GUIDES.map((g) => `<li><a href="/guides/${g.slug}/">${esc(g.title)}</a></li>`).join('')}</ul></div></section>
${ctaBand('Let’s Find Your Next Home.', `<a class="btn btn-gold" href="/properties/">Explore Properties</a>`, 'g-landscape')}`,
  ld: [crumbsLd([['/faqs/', 'FAQs']]), faqLd(allFaqs)],
});

// CONTACT
page({
  path: '/contact/', cur: '/contact/', priority: 0.8, preload: 'hero-contact',
  title: 'Contact Sobha Resales — SS Homes, Banaswadi, Bangalore',
  desc: `Call ${P0.display}, WhatsApp or visit SS Homes at Dodda Banaswadi, Bengaluru 560043 for Sobha resale homes. Open Mon–Sun 9am–6pm, by appointment.`,
  keywords: 'contact sobha resales, ss homes banaswadi, real estate agent banaswadi, sobha resale contact number, property consultant bangalore',
  body: `${hero({ image: 'hero-contact', h1: 'Let’s Find Your Next Home.', crumbs: [['/contact/', 'Contact']], alt: 'Sobha apartment community with lit pergola at dusk — illustrative' })}
<section><div class="wrap">
<div class="grid g3">
<div class="card" style="padding:24px;flex-direction:row;gap:18px">${I.phone.replace('<svg', '<svg width="38" height="38" style="color:#c9a45c;flex:none"')}<div><h3>Call Us</h3>${SITE.phones.map((p) => `<a href="tel:${p.tel}" style="display:block;text-decoration:none">${p.display}</a>`).join('')}</div></div>
<div class="card" style="padding:24px;flex-direction:row;gap:18px">${I.mail.replace('<svg', '<svg width="38" height="38" style="color:#c9a45c;flex:none"')}<div><h3>Email Us</h3>${SITE.emails.map((e) => `<a href="mailto:${e}" style="display:block;text-decoration:none">${e}</a>`).join('')}</div></div>
<div class="card" style="padding:24px;flex-direction:row;gap:18px">${I.clock.replace('<svg', '<svg width="38" height="38" style="color:#c9a45c;flex:none"')}<div><h3>Office Hours</h3><strong>${SITE.hours}</strong><br>${SITE.hoursNote}</div></div></div>
<div class="split" style="margin-top:40px;align-items:stretch">
<div class="card" style="background:var(--navy);color:#e8e2d4">${img('walkway', 'Garden walkway at a premium Sobha community — illustrative', { w: 798, h: 868 })}
<div style="padding:26px"><h2 style="color:#fbf6ea;font-size:1.9rem">Visit SS Homes</h2><hr class="rule" style="margin:10px 0 16px"><address style="font-style:normal;display:flex;gap:12px">${I.pin.replace('<svg', '<svg width="22" height="22" style="color:#c9a45c;flex:none"')}<span>${esc(SITE.address.street)},<br>Bangalore, Karnataka – ${SITE.address.postalCode}</span></address>
<p style="margin-top:16px"><a class="btn btn-line btn-sm" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('SS Homes, 9 1st Cross Obel Reddy Layout Dodda Banaswadi Bangalore 560043')}" target="_blank" rel="noopener">Get directions</a></p></div></div>
<div class="panel"><h2>How can we help you?</h2><p class="muted">Tell us about your preferred property. Our team will guide you through your next step.</p>${enquiryForm({ type: 'enquiry' })}</div></div>
</div></section>
<section style="padding-top:0"><div class="wrap"><div class="strip" style="border-radius:12px;padding:30px"><div class="wrap" style="padding:0"><div><h2 style="border:0;padding:0">Prefer a conversation?</h2><span>Speak directly with our team.</span></div><div style="margin-left:auto;display:flex;gap:12px;flex-wrap:wrap">${callBtns}</div></div></div></div></section>`,
  ld: [crumbsLd([['/contact/', 'Contact']]), { '@type': 'ContactPage', url: abs('/contact/'), mainEntity: { '@id': ORG_ID } }],
});

// GUIDES
const guideBody = {
  'buying-sobha-resale-flat-bangalore': `
<p>Buying a resale Sobha apartment or villa is one of the fastest ways to move into a premium, finished home in Bengaluru. Here is the process our team follows with every buyer.</p>
<h2>1. Define your shortlist</h2><p>Start with location (office commute, schools, airport access), configuration and budget. Our focus projects span <a href="/locations/hennur/">Hennur</a>, <a href="/locations/thanisandra/">Thanisandra</a>, <a href="/locations/whitefield/">Whitefield</a>, <a href="/locations/panathur/">Panathur</a>, <a href="/locations/sarjapur/">Sarjapur Road</a>, <a href="/locations/hosur-road/">Hosur Road</a>, <a href="/locations/rajajinagar/">Rajajinagar</a> and <a href="/locations/devanahalli/">Devanahalli</a>.</p>
<h2>2. Check live availability</h2><p>Resale inventory is supply-driven — limited, and it moves fast. Ask for currently available units with price, floor, facing and condition so you compare like for like.</p>
<h2>3. Visit the shortlisted homes</h2><p>See the apartment, the tower, parking and amenities in person. <a href="/request-visit/">Request a visit</a> and we coordinate with owners.</p>
<h2>4. Negotiate and agree terms</h2><p>We benchmark against recent resale transactions in the same community and negotiate price, payment schedule, handover date and inclusions (fixtures, fittings, parking) on your behalf.</p>
<h2>5. Verify documents</h2><p>Typical checks for a resale flat in Bengaluru include:</p>
<ul><li>Sale deed, or allotment and Assignment Agreement for recently handed-over units</li><li>Mother deed / title chain</li><li>Encumbrance certificate (EC)</li><li>Khata certificate and extract</li><li>Occupancy certificate (OC)</li><li>Latest property-tax receipts and utility bills</li><li>Apartment association NOC and maintenance dues clearance</li><li>Loan-closure letter and original documents from the seller’s bank, if the flat is mortgaged</li></ul>
<p>Engage a property lawyer for title verification; we coordinate the paperwork end to end.</p>
<h2>6. Agreement, payment and registration</h2><p>Sign the sale agreement (or Assignment Agreement), arrange your home loan if needed, pay stamp duty and registration charges as applicable, and register at the sub-registrar office. Then transfer khata, utilities and association membership to your name.</p>
<h2>Brokerage</h2><p>${SITE.brokerage}</p>`,
  'sell-sobha-apartment-bangalore': `
<p>Selling a Sobha home well comes down to the right price, the right buyers and clean paperwork. Here is how we approach it.</p>
<h2>1. Price it right</h2><p>We set a realistic, market-aligned price from recent transactions in your community, current demand, floor, view, configuration and condition. Over-pricing is the most common reason resale listings go stale.</p>
<h2>2. Prepare the home</h2><p>Small fixes, a deep clean and good daylight photographs make a big difference. Gather your documents early — sale deed or allotment letter, EC, khata, OC, tax receipts, association NOC and, if applicable, your bank’s loan statement.</p>
<h2>3. Market to qualified buyers</h2><p>We list your home with professional assets and present it directly to genuine buyers already looking for Sobha homes in your area.</p>
<h2>4. Showings and negotiation</h2><p>We coordinate visits around your schedule and represent you in negotiation on price, timelines and inclusions.</p>
<h2>5. Documentation and the Assignment Agreement</h2><p>We assist with the sale agreement or Assignment Agreement, loan closure coordination and registration so the handover is smooth.</p>
<h2>Brokerage</h2><p>${SITE.brokerage}</p>
<p><a class="btn btn-gold" href="/sell-sobha-property/">Request a seller callback</a></p>`,
};
for (const g of GUIDES) {
  const path_ = `/guides/${g.slug}/`;
  page({
    path: path_, cur: '/faqs/', priority: 0.6, type: 'article', preload: g.img,
    title: g.title.length > 62 ? g.title.split(':')[0] + ' | Sobha Resales' : g.title, desc: g.desc, keywords: g.keywords,
    body: `<section class="hero sm" style="padding:0"><div class="wrap" style="padding-top:36px;padding-bottom:36px">${crumbsHtml([['/faqs/', 'Guides'], [path_, g.short]])}<h1 style="max-width:900px;font-size:clamp(1.9rem,3.6vw,2.8rem)">${esc(g.title)}</h1><p class="lead">${esc(g.desc)}</p></div></section>
<section><div class="wrap two"><article class="prose">${img(g.img, g.title + ' — illustrative', { w: 692, h: 340, eager: true })}${guideBody[g.slug]}<p class="disclaimer">This guide is general information, not legal or financial advice. Requirements can vary by property; consult a qualified lawyer for title verification.</p></article>
<aside class="sticky"><div class="panel"><h2 style="font-size:1.5rem">Talk to a Sobha resale expert</h2><hr class="rule">${enquiryForm({ type: 'callback', compact: true })}</div></aside></div></section>`,
    ld: [crumbsLd([['/faqs/', 'Guides'], [path_, g.short]]), { '@type': 'Article', headline: g.title, description: g.desc, image: abs(`/img/${g.img}.webp`), author: { '@type': 'Organization', name: 'Sobha Resales', url: abs('/') }, publisher: { '@id': ORG_ID }, datePublished: TODAY, dateModified: TODAY, mainEntityOfPage: abs(path_), inLanguage: 'en-IN' }],
  });
}

// 404
page({ path: '/404.html', title: 'Page not found | Sobha Resales', desc: 'The page you are looking for could not be found.',
  body: `<section><div class="wrap center"><h1>Page not found</h1><p class="muted">The page you’re looking for has moved or doesn’t exist.</p><p><a class="btn btn-gold" href="/properties/">Browse Sobha resale homes</a></p></div></section>` });
fs.writeFileSync(path.join(OUT, '404.html'), fs.readFileSync(path.join(OUT, '404.html'), 'utf8').replace('index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1', 'noindex,follow'));

// ── SEO files ────────────────────────────────────────────────
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${p.loc}</loc><lastmod>${TODAY}</lastmod><priority>${p.priority.toFixed(1)}</priority></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, 'llms.txt'), `# Sobha Resales (powered by SS Homes)\n\n> Independent resale brokerage for premium and luxury Sobha apartments and villas in Bengaluru, India. Helps buyers find verified resale homes and helps owners sell. Not affiliated with Sobha Limited.\n\n- Phone: ${SITE.phones.map((p) => p.display).join(', ')}\n- Email: ${SITE.emails.join(', ')}\n- Office: SS Homes, ${SITE.address.street}, Bengaluru ${SITE.address.postalCode}\n- Hours: ${SITE.hours} (${SITE.hoursNote})\n- Brokerage: ${SITE.brokerage}\n\n## Projects\n${PROJECTS.map((p) => `- [${p.name} — ${areaOf(p).full}](${abs(`/properties/${p.slug}/`)})`).join('\n')}\n\n## Pages\n- [Sell your Sobha property](${abs('/sell-sobha-property/')})\n- [Request a visit](${abs('/request-visit/')})\n- [FAQs](${abs('/faqs/')})\n- [Contact](${abs('/contact/')})\n`);
fs.writeFileSync(path.join(OUT, 'site.webmanifest'), JSON.stringify({ name: 'Sobha Resales', short_name: 'Sobha Resales', start_url: '/', display: 'standalone', background_color: '#f8f3ea', theme_color: '#0b1629', icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }, { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }] }));
console.log(`Built ${pages.length} pages → ${SITE.url}`);
