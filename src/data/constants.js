/* MRDS — constants & helpers */

export const BRAND = {
  name: 'MRDS ग्रुप ऑल राजस्थान प्रा. लि.',
  nameEn: 'MRDS GROUP ALL RAJSTHAN PVT. LTD.',
  phone: '917023272784',
  phoneText: '7023272784',
  email: 'vschhawari0786@gmail.com',
  address: 'प्लॉट नं. 121, होली हाउस, हीरा नगर "ए", अजमेर रोड, जयपुर – 302021, राजस्थान',
  addressEn: 'Plot No. 121, Holi House, Heera Nagar "A", Ajmer Road, Jaipur – 302021, Rajasthan',
  addressShort: 'Heera Nagar A, Ajmer Road, Jaipur',
  waLink: 'https://wa.me/917023272784',
  waApi: 'https://api.whatsapp.com/send?phone=917023272784',
  tel: 'tel:+917023272784',
  call: 'tel:7023272784',
  mail: 'mailto:vschhawari0786@gmail.com',
  site: 'https://mrds-28d50.web.app',
  maps: 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Plot No. 121, Holi House, Heera Nagar A, Ajmer Road, Jaipur, Rajasthan 302021'),
  mapsDir: 'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('Plot No. 121, Holi House, Heera Nagar A, Ajmer Road, Jaipur, Rajasthan 302021'),
  search: 'https://www.google.com/maps/search/MRDS+GROUP+ALL+RAJSTHAN+PVT+LTD+Jaipur',
};

export const ADMIN_EMAIL = 'vschhawari0786@gmail.com';

export const TYPES = {
  plot:      { label: 'प्लॉट',              icon: '📐', areaLbl: 'कुल प्लॉट क्षेत्रफल', lockUnit: false, quick: [600, 1200, 1800, 2400] },
  shop:      { label: 'दुकान',              icon: '🏪', areaLbl: 'कैरपेट / बिल्ट-अप क्षेत्रफल', lockUnit: false, quick: [150, 300, 600, 1000] },
  farmhouse: { label: 'फार्महाउस',          icon: '🌳', areaLbl: 'बिल्ट-अप क्षेत्रफल', lockUnit: true, quick: [500, 1000, 1500, 2000] },
  flat:      { label: 'फ्लैट / अपार्टमेंट', icon: '🏢', areaLbl: 'कैरपेट क्षेत्रफल', lockUnit: false, quick: [550, 850, 1200, 1650] },
  villa:     { label: 'विला',               icon: '🏡', areaLbl: 'बिल्ट-अप क्षेत्रफल', lockUnit: false, quick: [550, 850, 1200, 1650] },
};

export const UNITS = {
  sqft:  { label: 'वर्ग फुट',  inSqft: 1 },
  sqyd:  { label: 'वर्ग गज',   inSqft: 9 },
  sqm:   { label: 'वर्ग मीटर', inSqft: 10.7639 },
  acre:  { label: 'एकड़',      inSqft: 43560 },
  bigha: { label: 'बीघा',      inSqft: 27225 },
};

export const PAGE_SIZE = 9;
export const MAX_PHOTOS = 8;

/* ---------------- format ---------------- */
export const nf = (n) =>
  (Number(n) || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

export const inr = (n) => {
  n = Number(n) || 0;
  if (n >= 1e7) return '₹' + (n / 1e7).toFixed(2).replace(/\.00$/, '') + ' करोड़';
  if (n >= 1e5) return '₹' + (n / 1e5).toFixed(2).replace(/\.00$/, '') + ' लाख';
  return '₹' + n.toLocaleString('en-IN');
};

export const toSqft = (v, unit) => (Number(v) || 0) * (UNITS[unit]?.inSqft || 1);

export const priceText = (p) =>
  p.priceRange ? p.priceRange : inr(p.price) + (p.negotiable ? ' · मूल्य तय करने योग्य' : '');

export const placeText = (p) => [p.locality, p.city].filter(Boolean).join(', ');

export const sizeText = (p) => {
  const s = p.size || {};
  const u = UNITS[s.unit]?.label || '';
  if (!s.area) return 'क्षेत्रफल जानकारी हेतु संपर्क करें';
  let t = nf(s.area) + ' ' + u;
  if (p.type === 'plot' && s.length && s.width) t += ` (${s.length} × ${s.width})`;
  return t;
};

/* ---------------- video ---------------- */
export function videoId(url) {
  if (!url) return null;
  const u = String(url).trim();
  if (/(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/i.test(u)) {
    const m = u.match(/[?&]v=([\w-]{6,})/) || u.match(/youtu\.be\/([\w-]{6,})/) || u.match(/embed\/([\w-]{6,})/);
    if (m) return m[1];
  }
  return null;
}

export const hasVideo = (p) => !!p?.video;
export const isDirectVideo = (p) => hasVideo(p) && !videoId(p.video);
