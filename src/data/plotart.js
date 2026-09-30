/* MRDS — khali plot image generator
   Khaali plot + pakka (tar) road + boundary wall + street light + ped + size labels.
   Offline chalti hai — data URI SVG. */
const W = 800, H = 520;

const UNITS = {
  sqft: 'वर्ग फुट', sqyd: 'वर्ग गज', sqm: 'वर्ग मीटर', acre: 'एकड़', bigha: 'बीघा',
};

const poly = (pts) => pts.map((p) => p.join(',')).join(' ');

const centroid = (pts) => [
  pts.reduce((a, p) => a + p[0], 0) / pts.length,
  pts.reduce((a, p) => a + p[1], 0) / pts.length,
];

const shrink = (pts, k) => {
  const c = centroid(pts);
  return pts.map(([x, y]) => [c[0] + (x - c[0]) * k, c[1] + (y - c[1]) * k]);
};

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const tree = (x, y, s = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})">
    <ellipse cx="0" cy="6" rx="20" ry="6" fill="#000" opacity=".16"/>
    <rect x="-3" y="-14" width="6" height="22" rx="2" fill="#6b4f2a"/>
    <circle cx="0" cy="-30" r="20" fill="#2f7a3d"/>
    <circle cx="-12" cy="-22" r="14" fill="#3b9149"/>
    <circle cx="13" cy="-24" r="13" fill="#276b33"/>
    <circle cx="0" cy="-42" r="13" fill="#48a558"/>
  </g>`;

const light = (x, baseY) => `
  <g>
    <ellipse cx="${x}" cy="${baseY}" rx="9" ry="3.5" fill="#000" opacity=".18"/>
    <rect x="${x - 3}" y="${baseY - 96}" width="6" height="96" rx="3" fill="#6b7280"/>
    <path d="M ${x} ${baseY - 96} q 16 0 20 10" stroke="#6b7280" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M ${x + 20} ${baseY - 86} l 12 4" stroke="#4b5563" stroke-width="6" stroke-linecap="round"/>
    <circle cx="${x + 33}" cy="${baseY - 82}" r="5" fill="#ffe9a8"/>
    <path d="M ${x + 33} ${baseY - 82} l 78 26 -156 0 z" fill="#fff3c4" opacity=".55"/>
  </g>`;

const dimH = (x1, x2, y, label) => `
  <g>
    <line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#fff" stroke-width="2.5" marker-start="url(#ar)" marker-end="url(#ar)"/>
    <rect x="${(x1 + x2) / 2 - 44}" y="${y - 17}" width="88" height="24" rx="7" fill="#0f172a" opacity=".72"/>
    <text x="${(x1 + x2) / 2}" y="${y}" fill="#fff" font-size="17" font-weight="700" font-family="Segoe UI,Arial" text-anchor="middle" dominant-baseline="central">${esc(label)}</text>
  </g>`;

const dimV = (x, y1, y2, label) => `
  <g>
    <line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" stroke="#fff" stroke-width="2.5" marker-start="url(#ar)" marker-end="url(#ar)"/>
    <g transform="translate(${x} ${(y1 + y2) / 2}) rotate(-90)">
      <rect x="-36" y="-16" width="72" height="23" rx="7" fill="#0f172a" opacity=".72"/>
      <text x="0" y="0" fill="#fff" font-size="16" font-weight="700" font-family="Segoe UI,Arial" text-anchor="middle" dominant-baseline="central">${esc(label)}</text>
    </g>
  </g>`;

const treeRow = (n, y, x1, x2) => {
  let s = '';
  for (let i = 0; i < n; i++) {
    const t = n === 1 ? 0.5 : i / (n - 1);
    s += tree(x1 + (x2 - x1) * t, y, 0.72 + (i % 2) * 0.12);
  }
  return s;
};

export function plotArt(opts = {}) {
  const o = {
    label: 'KHALI PLOT', width: 30, length: 40, area: 1200,
    areaUnit: 'sqft', road: '100 ft road', corner: true, tone: 0, ...opts,
  };

  const TL = [250, 150], TR = [552, 150], BR = [664, 398], BL = [138, 398];
  const outer = [TL, TR, BR, BL];
  const inner = shrink(outer, 0.9);
  const u = UNITS[o.areaUnit] || 'वर्ग फुट';

  const sky = [
    ['#cfe9f7', '#eaf6fd'],
    ['#d7ecff', '#f2f9ff'],
    ['#c8e4f5', '#e9f5fc'],
  ][Number(o.tone) % 3];

  const pillars = outer
    .map(([x, y]) => `<rect x="${x - 9}" y="${y - 9}" width="18" height="18" rx="3" fill="#8a7a5c" stroke="#6b5c42" stroke-width="2"/>`)
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${sky[0]}"/><stop offset="1" stop-color="${sky[1]}"/>
    </linearGradient>
    <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#3b4148"/><stop offset="1" stop-color="#22262b"/>
    </linearGradient>
    <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#c9a978"/><stop offset="1" stop-color="#a98a5d"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="#fff6cf" stop-opacity=".85"/>
      <stop offset="1" stop-color="#fff6cf" stop-opacity="0"/>
    </radialGradient>
    <marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#fff"/>
    </marker>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  ${treeRow(6, 132, 60, 740)}
  <rect x="0" y="392" width="${W}" height="${H - 392}" fill="#c2b487"/>
  <rect x="0" y="392" width="${W}" height="10" fill="#b0a077"/>
  <polygon points="${poly(outer)}" fill="url(#wall)"/>
  <polygon points="${poly(inner)}" fill="#cdae82"/>
  <polygon points="${poly(shrink(inner, 0.97))}" fill="#c4a173"/>
  ${pillars}
  ${o.corner ? `<polygon points="${poly([[138, 398], [40, 330], [70, 318], [176, 386]])}" fill="#2b3036"/>
      <polygon points="${poly([[40, 330], [70, 318], [70, 348], [40, 360]])}" fill="#c9c9c9"/>` : ''}
  ${dimH(TL[0], TR[0], TL[1] - 26, o.width + ' फुट')}
  ${dimV(TL[0] - 44, TL[1], BL[1], o.length + ' फुट')}
  <g>
    <rect x="290" y="246" width="220" height="76" rx="14" fill="#0f172a" opacity=".7"/>
    <text x="400" y="272" fill="#fff" font-size="17" font-weight="700" font-family="Segoe UI,Arial" text-anchor="middle">${esc(o.area)} ${esc(u)}</text>
    <text x="400" y="299" fill="#cbd5e1" font-size="14" font-family="Segoe UI,Arial" text-anchor="middle">${esc(o.width)} × ${esc(o.length)} फुट</text>
  </g>
  <circle cx="120" cy="316" r="86" fill="url(#glow)"/>
  ${light(93, 398)}
  <rect x="0" y="430" width="${W}" height="90" fill="url(#road)"/>
  <rect x="0" y="426" width="${W}" height="7" fill="#d8d8d8"/>
  <g stroke="#f5f5f5" stroke-width="5" stroke-dasharray="42 26">
    <line x1="0" y1="476" x2="${W}" y2="476"/>
  </g>
  <rect x="0" y="424" width="${W}" height="3" fill="#a3a3a3"/>
  <g>
    <rect x="${W / 2 - 145}" y="440" width="290" height="30" rx="9" fill="#0b1220" opacity=".78"/>
    <text x="${W / 2}" y="455" fill="#fff" font-size="15" font-weight="700" font-family="Segoe UI,Arial" text-anchor="middle" dominant-baseline="central">PAKKA ROAD — ${esc(o.road)}</text>
  </g>
  <g>
    <rect x="18" y="16" width="${o.label.length * 11 + 48}" height="34" rx="10" fill="#0f766e"/>
    <text x="42" y="33" fill="#fff" font-size="16" font-weight="700" font-family="Segoe UI,Arial" dominant-baseline="central">${esc(o.label)}</text>
  </g>
  <g>
    <rect x="18" y="60" width="360" height="30" rx="9" fill="#0f172a" opacity=".7"/>
    <text x="34" y="75" fill="#e2e8f0" font-size="14" font-weight="600" font-family="Segoe UI,Arial" dominant-baseline="central">Boundary · Light · Ped · Road</text>
  </g>
</svg>`;

  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}
