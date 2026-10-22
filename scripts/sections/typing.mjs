// Frosted terminal window — staged command lines fade/slide in with delays,
// mint/pink accents on deep navy, blinking block cursor at the end.
// Desktop 1200x300 / mobile 640x260 (re-laid-out, not scaled).
import { C, esc, MONO, DISPLAY, sharedDefs } from '../lib/theme.mjs';

const P = {
  bg: C.bg ?? C.navy ?? '#0D0221',
  violet: C.violet ?? '#7209B7',
  deepViolet: C.deepViolet ?? C.violetDeep ?? '#3A0CA3',
  pink: C.pink ?? '#F72585',
  mint: C.mint ?? '#00F5D4',
  text: C.text ?? '#E6E6FA',
  muted: C.muted ?? '#8A8AA3',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

function styleBlock() {
  return `<style>
.ty-line{opacity:0;animation:ty-in .55s ${EASE} forwards;animation-delay:var(--d,0s)}
@keyframes ty-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
.ty-cursor{animation:ty-blink 1.1s steps(1) infinite}
@keyframes ty-blink{50%{opacity:0}}
.ty-win{animation:ty-win 1s ${EASE} both}
@keyframes ty-win{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:translateY(0) scale(1)}}
.ty-glowpulse{animation:ty-glow 7s ease-in-out infinite alternate}
@keyframes ty-glow{from{opacity:.5}to{opacity:.9}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.ty-line{opacity:1}}
</style>`;
}

function defs() {
  return `<defs>
${sharedDefs}
${styleBlock()}
<linearGradient id="ty-sheen" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#FFFFFF" stop-opacity=".07"/><stop offset=".35" stop-color="#FFFFFF" stop-opacity="0"/>
</linearGradient>
<linearGradient id="ty-winbg" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#150838" stop-opacity=".92"/><stop offset="1" stop-color="${P.bg}" stop-opacity=".94"/>
</linearGradient>
<radialGradient id="ty-ambient" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="${P.violet}" stop-opacity=".4"/><stop offset="1" stop-color="${P.violet}" stop-opacity="0"/>
</radialGradient>
<filter id="ty-glow" x="-40%" y="-40%" width="180%" height="180%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="b"/>
  <feFlood flood-color="${P.mint}" flood-opacity=".75"/>
  <feComposite in2="b" operator="in" result="g"/>
  <feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="ty-blur" x="-40%" y="-40%" width="180%" height="180%">
  <feGaussianBlur stdDeviation="26"/>
</filter>
</defs>`;
}

function prompt(cmd) {
  // `$` in pink, command in mint.
  return `<tspan fill="${P.pink}" font-weight="700">${esc('$')}</tspan><tspan fill="${P.mint}"> ${esc(cmd)}</tspan>`;
}

function desktop() {
  const x = 210, y = 30, w = 780, h = 240;
  const tx = x + 40;
  const lines = [
    { d: '0.45s', y: 88, body: prompt('whoami') },
    { d: '1.35s', y: 116, body: `<tspan fill="${P.pink}" font-weight="700">${esc('dunedev')}</tspan><tspan fill="${P.text}"> ${esc('— Junior Backend Developer')}</tspan>` },
    { d: '2.25s', y: 144, body: prompt('cat stack.txt') },
    { d: '3.15s', y: 172, body: `<tspan fill="${P.text}">${esc('Java')}</tspan><tspan fill="${P.muted}"> ${esc('·')} </tspan><tspan fill="${P.text}">${esc('Spring Boot')}</tspan><tspan fill="${P.muted}"> ${esc('·')} </tspan><tspan fill="${P.text}">${esc('MongoDB')}</tspan><tspan fill="${P.muted}"> ${esc('·')} </tspan><tspan fill="${P.text}">${esc('React')}</tspan>` },
    { d: '4.05s', y: 200, body: prompt('./status --now') },
    { d: '4.95s', y: 228, body: `<tspan fill="${P.pink}" filter="url(#ty-glow)">${esc('●')}</tspan><tspan fill="${P.mint}" font-weight="700"> ${esc('OPEN TO COLLABORATE')}</tspan>`, cursor: true },
  ];
  const body = lines.map((L) => {
    const cursor = L.cursor
      ? `<rect class="ty-cursor" x="${tx + 300}" y="${L.y - 15}" width="11" height="19" fill="${P.mint}"/>`
      : '';
    return `<text class="ty-line" x="${tx}" y="${L.y}" font-family="${MONO}" font-size="19" style="--d:${L.d}">${L.body}</text>${cursor}`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-label="Terminal: whoami — dunedev">
${defs()}
<rect width="1200" height="300" fill="${P.bg}"/>
<ellipse class="ty-glowpulse" cx="600" cy="150" rx="470" ry="130" fill="url(#ty-ambient)" filter="url(#ty-blur)"/>
<g class="ty-win">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="url(#ty-winbg)" stroke="${P.deepViolet}" stroke-opacity=".8" stroke-width="1.5"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="url(#ty-sheen)"/>
  <line x1="${x + 14}" y1="${y + 44}" x2="${x + w - 14}" y2="${y + 44}" stroke="${P.deepViolet}" stroke-opacity=".6" stroke-width="1"/>
  <circle cx="${x + 32}" cy="${y + 22}" r="7" fill="${P.pink}" opacity=".9"/>
  <circle cx="${x + 56}" cy="${y + 22}" r="7" fill="${P.violet}" opacity=".9"/>
  <circle cx="${x + 80}" cy="${y + 22}" r="7" fill="${P.mint}" opacity=".9"/>
  <text x="${x + w / 2}" y="${y + 29}" text-anchor="middle" font-family="${MONO}" font-size="15" fill="${P.muted}" letter-spacing="1">${esc('dunedev@github:~')}</text>
  ${body}
  <rect x="${x + w - 30}" y="${y + 60}" width="1.5" height="${h - 80}" fill="${P.violet}" opacity=".25"/>
</g>
</svg>`;
}

function mobile() {
  const x = 40, y = 35, w = 560, h = 190;
  const tx = x + 32;
  const lines = [
    { d: '0.45s', y: 100, body: prompt('whoami') },
    { d: '1.35s', y: 130, body: `<tspan fill="${P.pink}" font-weight="700">${esc('dunedev')}</tspan>` },
    { d: '2.1s', y: 160, body: `<tspan fill="${P.text}">${esc('Junior Backend Developer')}</tspan>`, cursor: true },
  ];
  const body = lines.map((L) => {
    const cursor = L.cursor
      ? `<rect class="ty-cursor" x="${tx + 268}" y="${L.y - 14}" width="10" height="18" fill="${P.mint}"/>`
      : '';
    return `<text class="ty-line" x="${tx}" y="${L.y}" font-family="${MONO}" font-size="18" style="--d:${L.d}">${L.body}</text>${cursor}`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="260" viewBox="0 0 640 260" role="img" aria-label="Terminal: whoami — dunedev">
${defs()}
<rect width="640" height="260" fill="${P.bg}"/>
<g class="ty-win">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="url(#ty-winbg)" stroke="${P.deepViolet}" stroke-opacity=".8" stroke-width="1.5"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="url(#ty-sheen)"/>
  <line x1="${x + 12}" y1="${y + 42}" x2="${x + w - 12}" y2="${y + 42}" stroke="${P.deepViolet}" stroke-opacity=".6" stroke-width="1"/>
  <circle cx="${x + 30}" cy="${y + 21}" r="6.5" fill="${P.pink}" opacity=".9"/>
  <circle cx="${x + 52}" cy="${y + 21}" r="6.5" fill="${P.violet}" opacity=".9"/>
  <circle cx="${x + 74}" cy="${y + 21}" r="6.5" fill="${P.mint}" opacity=".9"/>
  <text x="${x + w / 2}" y="${y + 27}" text-anchor="middle" font-family="${MONO}" font-size="14" fill="${P.muted}">${esc('dunedev@github:~')}</text>
  ${body}
</g>
</svg>`;
}

export function render() {
  return { desktop: desktop(), mobile: mobile() };
}
