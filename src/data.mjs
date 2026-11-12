// ─────────────────────────────────────────────────────────────
// Sobha Resales — site data. Edit here, then `node build.mjs`.
// ─────────────────────────────────────────────────────────────
export const SITE = {
  url: (process.env.SITE_URL || 'https://www.sobha-resale.com').replace(/\/$/, ''),
  name: 'Sobha Resales',
  legalName: 'SS Homes',
  tagline: 'Premium & Luxury Sobha Resale Homes in Bengaluru',
  phones: [
    { display: '+91 99011 40164', tel: '+919901140164' },
    { display: '+91 91488 40164', tel: '+919148840164' },
    { display: '+91 78992 66001', tel: '+917899266001' },
  ],
  // Footer "Get in Touch" contacts
  footerPhones: [
    { display: '+91 97396 12117', tel: '+919739612117' },
    { display: '+91 98452 90699', tel: '+919845290699' },
  ],
  footerEmails: ['info@waytonest.in'],
  channelPartner: 'WaytoNest Pvt. Ltd.',
  footerAddress: '3rd Floor, 201, Swamy Vivekananda Rd, 2nd Cross Rd, Narayana Nagar 1st Block, BCMC Layout, Kanakapura Road, Bengaluru, Karnataka 560062',
  whatsapp: '919901140164',
  emails: ['ickrishh@gmail.com', 'Deepa@sshomesblr.com'],
  address: {
    street: '9, 1st Cross, Obel Reddy Layout, Dodda Banaswadi, Opp. Asha Nursing Home',
    locality: 'Bengaluru',
    region: 'Karnataka',
    regionCode: 'KA',
    postalCode: '560043',
    country: 'IN',
  },
  hours: 'Mon–Sun: 9am–6pm',
  hoursNote: 'On appointments only',
  brokerage: '2% brokerage fee on the final sale value + 18% GST. Payable before or on the day of signing the Assignment Agreement.',
  // Lead capture: set LEAD_ENDPOINT at build time (Leadrat webhook / email notifier).
  // Forms POST JSON there. If empty, forms hand off to WhatsApp so no lead is lost.
  leadEndpoint: process.env.LEAD_ENDPOINT || '',
  ga4: process.env.GA4_ID || '',
  gscVerification: process.env.GSC_VERIFICATION || '',
  founded: '2024',
};

export const AREAS = {
  hennur: {
    name: 'Hennur', full: 'Hennur Road', zone: 'North Bengaluru',
    intro: 'Hennur Road is one of North Bengaluru’s most sought-after residential corridors, linking the Outer Ring Road to the Bagalur side and giving residents a quick run towards Kempegowda International Airport and Manyata Tech Park.',
    why: ['Fast access to the Outer Ring Road and Manyata Tech Park', 'Airport-side growth along the Hennur–Bagalur corridor', 'Established schools, hospitals and retail around Kalyan Nagar and HRBR Layout', 'Strong end-user demand keeps resale homes moving quickly'],
  },
  whitefield: {
    name: 'Whitefield', full: 'Whitefield', zone: 'East Bengaluru',
    intro: 'Whitefield is East Bengaluru’s IT capital, home to ITPL and dozens of tech parks, with Namma Metro’s Purple Line now running through the area.',
    why: ['Walk-to-work proximity to ITPL and EPIP tech parks', 'Purple Line metro connectivity', 'Mature social infrastructure — international schools, hospitals and malls', 'Deep rental and resale demand from IT professionals'],
  },
  panathur: {
    name: 'Panathur', full: 'Panathur Road', zone: 'East Bengaluru',
    intro: 'Panathur sits just off the Outer Ring Road between Marathahalli and Bellandur — minutes from the Kadubeesanahalli tech parks that anchor Bengaluru’s busiest office corridor.',
    why: ['Minutes from the ORR tech corridor (Kadubeesanahalli, Bellandur, Marathahalli)', 'Large integrated Sobha communities with extensive amenities', 'Consistent buyer demand from tech professionals', 'Good access to Whitefield and Sarjapur Road'],
  },
  sarjapur: {
    name: 'Sarjapur', full: 'Sarjapur Road', zone: 'South-East Bengaluru',
    intro: 'Sarjapur Road is a fast-growing tech and residential corridor connecting the Outer Ring Road with Sarjapur town, lined with IT campuses, international schools and premium communities.',
    why: ['Direct link to the ORR and Electronic City side', 'Cluster of international schools and hospitals', 'Large IT campuses along the corridor', 'Premium gated communities with strong long-term appreciation'],
  },
  thanisandra: {
    name: 'Thanisandra', full: 'Thanisandra Main Road', zone: 'North Bengaluru',
    intro: 'Thanisandra is a well-connected North Bengaluru neighbourhood next to Manyata Tech Park, with easy access to Hebbal, the Outer Ring Road and the airport road.',
    why: ['Next door to Manyata Tech Park', 'Quick access to Hebbal and the airport expressway', 'Established schools, hospitals and malls nearby', 'High end-user demand for ready-to-move homes'],
  },
  devanahalli: {
    name: 'Devanahalli', full: 'Devanahalli', zone: 'North Bengaluru',
    intro: 'Devanahalli is Bengaluru’s airport city — the region around Kempegowda International Airport, where planned infrastructure and business parks are shaping a premium residential destination.',
    why: ['Closest premium address to Kempegowda International Airport', 'Planned growth: business parks, aerospace and IT investment', 'Low-density, green layouts and larger plot-led communities', 'Long-term appreciation potential for investors and end-users'],
  },
  rajajinagar: {
    name: 'Rajajinagar', full: 'Rajajinagar', zone: 'West Bengaluru',
    intro: 'Rajajinagar is one of West Bengaluru’s most established addresses, with Namma Metro’s Green Line, landmark retail and decades of civic infrastructure already in place.',
    why: ['Central, established neighbourhood with mature infrastructure', 'Green Line metro connectivity', 'Close to Malleswaram, Yeshwanthpur and the CBD', 'Rare luxury inventory in a built-out location'],
  },
  'hosur-road': {
    name: 'Hosur Road', full: 'Hosur Road', zone: 'South Bengaluru',
    intro: 'Hosur Road is the gateway to Electronic City and Bengaluru’s southern industrial and IT belt, with the elevated expressway and Yellow Line metro improving connectivity.',
    why: ['Close to Electronic City’s IT and manufacturing hubs', 'Elevated expressway and metro connectivity', 'Large township-style communities', 'Good value per sq. ft. for premium Sobha homes'],
  },
};

// The 10 focus projects (from the client brief). Specs intentionally not invented:
// availability, pricing and configurations are "request current details".
export const PROJECTS = [
  { slug: 'sobha-victoria-park', name: 'Sobha Victoria Park', area: 'hennur', img: 'p-victoria-park', featured: true },
  { slug: 'sobha-dream-gardens', name: 'Sobha Dream Gardens', area: 'thanisandra', img: 'p-dream-gardens', featured: true },
  { slug: 'sobha-windsor', name: 'Sobha Windsor', area: 'whitefield', img: 'p-windsor', featured: true },
  { slug: 'sobha-sentosa', name: 'Sobha Sentosa', area: 'panathur', img: 'p-sentosa', featured: true },
  { slug: 'sobha-dream-acres', name: 'Sobha Dream Acres', area: 'panathur', img: 'p-dream-acres', featured: true },
  { slug: 'sobha-town-park', name: 'Sobha Town Park', area: 'hosur-road', img: 'hero-sell' },
  { slug: 'sobha-royal-pavilion', name: 'Sobha Royal Pavilion', area: 'sarjapur', img: 'hero-about' },
  { slug: 'sobha-indraprastha', name: 'Sobha Indraprastha', area: 'rajajinagar', img: 'p-indraprastha' },
  { slug: 'sobha-lifestyle-legacy', name: 'Sobha Lifestyle Legacy', area: 'devanahalli', img: 'p-lifestyle-legacy' },
  { slug: 'sobha-oakshire', name: 'Sobha Oakshire', area: 'devanahalli', img: 'p-oakshire' },
];

export const FAQS = {
  General: [
    ['What does Sobha Resales specialize in?', 'Sobha Resales specializes in premium and luxury resale homes across Sobha communities in Bengaluru — helping buyers find verified resale apartments and villas, and helping owners sell their Sobha property.'],
    ['Which Sobha projects do you focus on?', 'Our focus projects include Sobha Victoria Park (Hennur), Sobha Windsor (Whitefield), Sobha Town Park (Hosur Road), Sobha Dream Acres (Panathur), Sobha Lifestyle Legacy (Devanahalli), Sobha Royal Pavilion (Sarjapur), Sobha Sentosa (Panathur Road), Sobha Indraprastha (Rajajinagar), Sobha Dream Gardens (Thanisandra) and Sobha Oakshire (Devanahalli).'],
    ['When can I visit your office?', 'Our SS Homes office at Dodda Banaswadi, Bengaluru 560043 is open Monday to Sunday, 9am–6pm, on appointments only. Call +91 99011 40164 to book a time.'],
    ['Is Sobha Resales a Sobha channel partner?', 'Yes. Sobha Resales works through WaytoNest Pvt. Ltd., a Sobha Authorized Channel Partner, helping buyers and owners transact resale homes in Sobha-built communities across Bengaluru.'],
  ],
  'Buying a Home': [
    ['How does resale availability work?', 'Resale inventory is supply-driven. Availability is limited and units can move quickly, so quick decision-making helps. Contact our team for current options in your preferred Sobha community.'],
    ['How do I arrange a property visit?', 'Use the Request a Visit form, call +91 99011 40164 or message us on WhatsApp. Share your preferred project, date and time — our team confirms availability and schedules the showing.'],
    ['Why buy a resale Sobha flat instead of a new launch?', 'A resale home is usually ready to move in, so you see exactly what you are buying — finished construction, the community, amenities and neighbours — with no construction-delay risk. Prices are negotiated directly with the owner.'],
    ['What documents should I check before buying a resale flat in Bengaluru?', 'Typically the sale deed or allotment/assignment papers, mother deed chain, encumbrance certificate, khata, occupancy certificate, property tax receipts, society/association NOC and, if there is an existing home loan, the bank’s loan-closure documents. Our team assists with documentation end to end.'],
  ],
  'Selling a Property': [
    ['Can you help me sell my Sobha property?', 'Yes. We offer complete seller assistance — accurate pricing, listing and marketing, buyer sourcing, property showings, negotiation, and documentation and assignment support.'],
    ['How do you price my Sobha apartment for resale?', 'We arrive at a realistic, market-aligned price using current demand, recent transactions in your community, floor, view, configuration and condition.'],
    ['Do you help with the Assignment Agreement?', 'Yes. We support the full paperwork process, including the Assignment Agreement for under-construction or recently handed-over units.'],
  ],
  'Brokerage Terms': [
    ['What are the brokerage terms?', '2% brokerage fee on the final sale value + 18% GST. Payable before or on the day of signing the Assignment Agreement.'],
    ['Are there any hidden charges?', 'No. Our terms are transparent: 2% of the final sale value plus 18% GST, payable before or on the day of signing the Assignment Agreement.'],
  ],
};

export const GUIDES = [
  {
    slug: 'buying-sobha-resale-flat-bangalore',
    title: 'How to Buy a Sobha Resale Flat in Bengaluru: Step-by-Step Guide',
    short: 'Buying guide',
    desc: 'A practical step-by-step guide to buying a resale Sobha apartment or villa in Bengaluru — shortlisting, site visits, negotiation, documents and registration.',
    img: 'd-living',
    keywords: 'buy resale flat bangalore, sobha resale flat buying process, resale apartment documents bangalore',
  },
  {
    slug: 'sell-sobha-apartment-bangalore',
    title: 'Selling Your Sobha Apartment in Bengaluru: Pricing, Marketing & Paperwork',
    short: 'Seller guide',
    desc: 'How to sell a Sobha apartment or villa in Bengaluru for the right price — pricing, preparing the home, marketing, negotiation and the Assignment Agreement.',
    img: 'g-int-empty',
    keywords: 'sell sobha flat, sell apartment bangalore, sobha resale value, assignment agreement bangalore',
  },
];
