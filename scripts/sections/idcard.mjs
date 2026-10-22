// W3 — "OPERATOR ID" card: premium circuit-board style for dunedev.
// Palette: #0D0221 bg, #7209B7/#3A0CA3 violet, #F72585 pink, #00F5D4 mint,
// #E6E6FA text, #8A8AA3 muted. No Orbitron, no banned neon colors.
import { C, esc, MONO, DISPLAY, sharedDefs } from '../lib/theme.mjs';

const {
  bg = '#0D0221',
  violet = '#7209B7',
  violetDeep = '#3A0CA3',
  pink = '#F72585',
  mint = '#00F5D4',
  text = '#E6E6FA',
  muted = '#8A8AA3',
} = C;

const PANEL = '#120A33';   // card body — deep violet-black
const PANEL2 = '#0E0628';  // inner shading

const hexPts = (cx, cy, r, rot = Math.PI / 6) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = rot + (Math.PI / 3) * i;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

// L-shaped neon corner bracket; (sx,sy) point the arms inward.
const bracket = (x, y, sx, sy, s = 30) =>
  `<path d="M${x + s * sx} ${y} H${x} V${y + s * sy}" fill="none" stroke="${mint}" ` +
  `stroke-width="4" stroke-linecap="square" filter="url(#idc-glowM)" opacity="0.9"/>`;

// Faint background circuit trace with pads at both ends.
const trace = (d, color, op = 0.14) =>
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="2" opacity="${op}"/>`;

// Deterministic fake barcode strip.
const barcode = (x, y, h) => {
  let cx = x, out = '';
  for (let i = 0; i < 16; i++) {
    const w = 2 + ((i * 7) % 3) * 2;
    const col = i % 3 === 0 ? mint : violet;
    out += `<rect x="${cx}" y="${y}" width="${w}" height="${h}" fill="${col}" opacity="0.45"/>`;
    cx += w + 3 + ((i * 5) % 3);
  }
  return out;
};

const css = `
.f{font-family:${MONO}}
.d{font-family:${DISPLAY}}
.rise{opacity:0;animation:rise .8s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.blink{animation:blink 1.1s steps(1,end) infinite}
@keyframes blink{0%,55%{opacity:1}56%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important;transform:none!important}}
`;

const defs = `
${sharedDefs}
<radialGradient id="idc-hexfill" cx="50%" cy="38%" r="75%">
  <stop offset="0%" stop-color="#241159"/>
  <stop offset="60%" stop-color="${PANEL}"/>
  <stop offset="100%" stop-color="${PANEL2}"/>
</radialGradient>
<linearGradient id="idc-holo" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0%" stop-color="${violet}" stop-opacity="0"/>
  <stop offset="42%" stop-color="${violet}" stop-opacity="0.38"/>
  <stop offset="58%" stop-color="${mint}" stop-opacity="0.30"/>
  <stop offset="100%" stop-color="${mint}" stop-opacity="0"/>
</linearGradient>
<linearGradient id="idc-sheen" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0%" stop-color="${violet}" stop-opacity="0.16"/>
  <stop offset="45%" stop-color="${violet}" stop-opacity="0"/>
  <stop offset="100%" stop-color="${pink}" stop-opacity="0.08"/>
</linearGradient>
<filter id="idc-glowV" x="-40%" y="-40%" width="180%" height="180%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="b"/>
  <feFlood flood-color="${violet}" flood-opacity="0.9"/>
  <feComposite in2="b" operator="in" result="g"/>
  <feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="idc-glowM" x="-40%" y="-40%" width="180%" height="180%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="b"/>
  <feFlood flood-color="${mint}" flood-opacity="0.9"/>
  <feComposite in2="b" operator="in" result="g"/>
  <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<pattern id="idc-dots" width="26" height="26" patternUnits="userSpaceOnUse">
  <circle cx="2" cy="2" r="1.4" fill="${violet}" opacity="0.5"/>
</pattern>
`;

function cardFrame(x, y, w, h, rx, clipId) {
  return `
<clipPath id="${clipId}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/></clipPath>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${PANEL}"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#idc-sheen)"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="url(#idc-dots)" opacity="0.25"/>
<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="none" stroke="${violetDeep}" stroke-width="1.5" opacity="0.9"/>
${bracket(x - 14, y - 14, 1, 1)}
${bracket(x + w + 14, y - 14, -1, 1)}
${bracket(x - 14, y + h + 14, 1, -1)}
${bracket(x + w + 14, y + h + 14, -1, -1)}
<g clip-path="url(#${clipId})">
  <g transform="translate(${(x + w / 2).toFixed(0)},0) skewX(-18)">
    <rect x="-80" y="${y - 20}" width="160" height="${h + 40}" fill="url(#idc-holo)" opacity="0.55">
      <animateTransform attributeName="transform" type="translate" values="${-(w / 2 + 160)} 0;${w / 2 + 160} 0" dur="9s" repeatCount="indefinite"/>
    </rect>
  </g>
</g>`;
}

function monogram(cx, cy, r, delay) {
  return `
<g class="rise" style="animation-delay:${delay}s">
  <circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="none" stroke="${mint}" stroke-width="1.5" opacity="0.28"/>
  <polygon points="${hexPts(cx, cy, r)}" fill="url(#idc-hexfill)" stroke="${violet}" stroke-width="2.5" filter="url(#idc-glowV)"/>
  <polygon points="${hexPts(cx, cy, r - 13)}" fill="none" stroke="${mint}" stroke-width="1.5" opacity="0.55"/>
  <text x="${cx}" y="${cy}" text-anchor="middle" dominant-baseline="central" class="d" font-size="${Math.round(r * 0.92)}" letter-spacing="2" fill="${text}">${esc('DV')}</text>
</g>`;
}

function dataRow(x, y, label, valueHtml, size, delay) {
  return `<text x="${x}" y="${y}" class="f rise" style="animation-delay:${delay}s" font-size="${size}">` +
    `<tspan fill="${muted}">${esc(label)}</tspan><tspan fill="${violet}"> :: </tspan>${valueHtml}</text>`;
}

function statusValue() {
  return `<tspan fill="${mint}">●<animate attributeName="opacity" values="1;.25;1" dur="1.6s" repeatCount="indefinite"/></tspan>` +
    `<tspan fill="${text}"> ${esc('Learning & Building')}</tspan>`;
}

function desktop() {
  const x = 120, y = 64, w = 960, h = 292;
  const rows = [
    ['ROLE', `<tspan fill="${text}">${esc('Backend Developer')}</tspan>`],
    ['FOCUS', `<tspan fill="${text}">${esc('Java & Spring Boot')}</tspan>`],
    ['STACK', `<tspan fill="${text}">${esc('Spring Boot · MongoDB · React')}</tspan>`],
    ['STATUS', statusValue()],
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 420" role="img">
<title>${esc('dunedev — operator ID card')}</title>
<defs>${defs}</defs>
<style>${css}</style>
<rect width="1200" height="420" fill="${bg}"/>
${trace('M36 330 L36 210 L96 150 L96 40', violet)}
${trace('M1164 90 L1164 210 L1104 270 L1104 380', violet)}
${trace('M300 24 H540 L580 44 H760', mint, 0.10)}
<circle cx="96" cy="40" r="4" fill="${mint}" opacity="0.4"/>
<circle cx="36" cy="330" r="4" fill="${violet}" opacity="0.4"/>
<circle cx="1164" cy="90" r="4" fill="${violet}" opacity="0.4"/>
<g class="rise" style="animation-delay:.05s">
${cardFrame(x, y, w, h, 20, 'idc-cardclip')}
</g>
<path d="M${x + 30} ${y + 20} H${x + 280} L${x + 310} ${y + 36} H${x + 580} L${x + 610} ${y + 20} H${x + w - 30}" fill="none" stroke="${mint}" stroke-width="1.5" opacity="0.22"/>
<path d="M${x + 30} ${y + h - 20} H${x + 240} L${x + 270} ${y + h - 36} H${x + 540} L${x + 570} ${y + h - 20} H${x + w - 30}" fill="none" stroke="${violet}" stroke-width="1.5" opacity="0.20"/>
<circle cx="${x + 30}" cy="${y + 20}" r="3.5" fill="${mint}" opacity="0.5"/>
<circle cx="${x + w - 30}" cy="${y + 20}" r="3.5" fill="${mint}" opacity="0.5"/>
<text x="${x + 48}" y="${y + 50}" class="f rise" style="animation-delay:.25s" font-size="20" letter-spacing="3" fill="${mint}">${esc('DUNEDEV // OPERATOR ID')}</text>
<g class="rise" style="animation-delay:.3s">
  <rect x="${x + w - 208}" y="${y + 26}" width="176" height="36" rx="18" fill="${mint}" opacity="0.07"/>
  <rect x="${x + w - 208}" y="${y + 26}" width="176" height="36" rx="18" fill="none" stroke="${mint}" stroke-width="1.5" opacity="0.7"/>
  <text x="${x + w - 120}" y="${y + 50}" text-anchor="middle" class="f" font-size="16" fill="${text}">${esc('ID: DV-2026')}</text>
</g>
<line x1="${x + 48}" y1="${y + 76}" x2="${x + w - 32}" y2="${y + 76}" stroke="${violetDeep}" stroke-width="1" opacity="0.6"/>
<circle cx="${(x * 2 + w) / 2}" cy="${y + 76}" r="5" fill="${violet}" filter="url(#idc-glowV)"/>
${monogram(x + 180, y + 172, 60, 0.4)}
<text x="${x + 180}" y="${y + 256}" text-anchor="middle" class="f rise" style="animation-delay:.55s" font-size="19" fill="${mint}">${esc('@phamdung2301')}</text>
<circle cx="${x + 128}" cy="${y + 272}" r="4" fill="${mint}" class="blink"/>
<text x="${x + 140}" y="${y + 277}" class="f rise" style="animation-delay:.6s" font-size="12" letter-spacing="2" fill="${muted}">${esc('SYS.ONLINE')}</text>
${rows.map(([label, val], i) => dataRow(x + 320, y + 126 + i * 42, label, val, 23, 0.5 + i * 0.14)).join('')}
<g class="rise" style="animation-delay:1.1s">${barcode(x + w - 210, y + h - 44, 20)}</g>
</svg>`;
}

function mobile() {
  const x = 28, y = 24, w = 584, h = 612;
  const rows = [
    ['ROLE', `<tspan fill="${text}">${esc('Backend Developer')}</tspan>`],
    ['FOCUS', `<tspan fill="${text}">${esc('Java & Spring Boot')}</tspan>`],
    ['STACK', `<tspan fill="${text}">${esc('Spring Boot · MongoDB · React')}</tspan>`],
    ['STATUS', statusValue()],
  ];
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 660" role="img">
<title>${esc('dunedev — operator ID card')}</title>
<defs>${defs}</defs>
<style>${css}</style>
<rect width="640" height="660" fill="${bg}"/>
${trace('M14 560 L14 420 L50 384', violet)}
${trace('M626 100 L626 220 L592 254', violet)}
<g class="rise" style="animation-delay:.05s">
${cardFrame(x, y, w, h, 20, 'idc-cardclip-m')}
</g>
<text x="${x + 36}" y="${y + 62}" class="f rise" style="animation-delay:.25s" font-size="18" letter-spacing="2" fill="${mint}">${esc('DUNEDEV // OPERATOR ID')}</text>
<g class="rise" style="animation-delay:.3s">
  <rect x="${x + w - 164}" y="${y + 38}" width="128" height="34" rx="17" fill="${mint}" opacity="0.07"/>
  <rect x="${x + w - 164}" y="${y + 38}" width="128" height="34" rx="17" fill="none" stroke="${mint}" stroke-width="1.5" opacity="0.7"/>
  <text x="${x + w - 100}" y="${y + 61}" text-anchor="middle" class="f" font-size="14" fill="${text}">${esc('ID: DV-2026')}</text>
</g>
<line x1="${x + 36}" y1="${y + 86}" x2="${x + w - 36}" y2="${y + 86}" stroke="${violetDeep}" stroke-width="1" opacity="0.6"/>
${monogram(x + w / 2, y + 191, 58, 0.4)}
<text x="${x + w / 2}" y="${y + 276}" text-anchor="middle" class="f rise" style="animation-delay:.55s" font-size="19" fill="${mint}">${esc('@phamdung2301')}</text>
<circle cx="${x + w / 2 - 52}" cy="${y + 298}" r="4" fill="${mint}" class="blink"/>
<text x="${x + w / 2 - 40}" y="${y + 303}" class="f rise" style="animation-delay:.6s" font-size="12" letter-spacing="2" fill="${muted}">${esc('SYS.ONLINE')}</text>
<line x1="${x + 36}" y1="${y + 328}" x2="${x + w - 36}" y2="${y + 328}" stroke="${violetDeep}" stroke-width="1" opacity="0.6"/>
${rows.map(([label, val], i) => dataRow(x + 48, y + 376 + i * 42, label, val, 21, 0.65 + i * 0.14)).join('')}
<g class="rise" style="animation-delay:1.25s">${barcode(x + w / 2 - 70, y + h - 52, 20)}</g>
</svg>`;
}

export function render() {
  return { desktop: desktop(), mobile: mobile() };
}
