// W3 — "package install" tech-stack: terminal panel + neon icon grid.
// Palette: #0D0221 bg, #7209B7/#3A0CA3 violet, #F72585 pink, #00F5D4 mint,
// #E6E6FA text, #8A8AA3 muted. No Orbitron, no banned neon colors.
import { C, esc, MONO, DISPLAY, sharedDefs } from '../lib/theme.mjs';
import { readFileSync } from 'node:fs';

const {
  bg = '#0D0221',
  violet = '#7209B7',
  violetDeep = '#3A0CA3',
  pink = '#F72585',
  mint = '#00F5D4',
  text = '#E6E6FA',
  muted = '#8A8AA3',
} = C;

const PANEL = '#100A2E';   // terminal / tile body
const PANEL2 = '#170C40';  // title bar

// Read an icon svg: drop every <svg> wrapper, drop the rounded tile
// background some sets ship with, strip colored fills so the caller can
// force a monochrome color via <g fill>. Returns {inner, vb} where vb is
// the viewBox size (24 for simple-icons, 256 for the tile set).
const iconData = (name) => {
  try {
    const raw = readFileSync(new URL(`../../data/icons/${name}.svg`, import.meta.url), 'utf8');
    const m = raw.match(/<svg[^>]*viewBox="0 0 ([\d.]+) ([\d.]+)"/);
    const inner = raw
      .replace(/<\/?svg[^>]*>/g, '')
      .replace(/<rect[^>]*rx="60"[^>]*\/?>/g, '')
      .replace(/<title>[\s\S]*?<\/title>/g, '')
      .replace(/\sfill="(?!none")[^"]*"/g, '');
    return { inner, vb: parseFloat(m && m[1]) || 24 };
  } catch {
    return null;
  }
};

// Place an icon centered at (cx,cy).
// Falls back to a circuit-node glyph when the icon file is missing.
const iconAt = (name, cx, cy, size, color) => {
  const d = iconData(name);
  const s = d ? (size / d.vb).toFixed(4) : 1;
  const body = d
    ? `<g fill="${color}">${d.inner}</g>`
    : `<g fill="none" stroke="${color}" stroke-width="2">` +
      `<path d="M0 -9 L7.8 -4.5 L7.8 4.5 L0 9 L-7.8 4.5 L-7.8 -4.5 Z"/>` +
      `<circle cx="0" cy="0" r="2.2" fill="${color}" stroke="none"/></g>`;
  return `<g transform="translate(${(cx - size / 2).toFixed(1)} ${(cy - size / 2).toFixed(1)}) scale(${s})">${body}</g>`;
};

const PACKAGES = [
  ['java', '@21'],
  ['spring-boot', '@4'],
  ['mongodb', ''],
  ['postgresql', ''],
  ['docker', ''],
  ['react', '@19'],
  ['vite', ''],
];

const TILES = [
  { icon: 'java', label: 'java' },
  { icon: 'springboot', label: 'spring boot' },
  { icon: 'mongodb', label: 'mongodb' },
  { icon: 'postgres', label: 'postgresql' },
  { icon: 'docker', label: 'docker' },
  { icon: 'react', label: 'react' },
  { icon: 'vite', label: 'vite' },
  { icon: null, label: 'and counting', more: true },
];

const ACCENTS = [mint, violet, pink, mint, violet, pink, mint, pink];

const css = `
.f{font-family:${MONO}}
.d{font-family:${DISPLAY}}
.rise{opacity:0;animation:rise .8s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes rise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
.pkg{opacity:0;animation:pkgIn .45s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes pkgIn{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
.tile{opacity:0;animation:tileIn .6s cubic-bezier(.2,.8,.2,1) forwards}
@keyframes tileIn{from{opacity:0;transform:translateY(14px) scale(.96)}to{opacity:1;transform:none}}
.cur{animation:blink 1.1s steps(1,end) infinite}
@keyframes blink{0%,55%{opacity:1}56%,100%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important;transform:none!important}}
`;

const defs = `
${sharedDefs}
<linearGradient id="sk-term" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stop-color="${violetDeep}" stop-opacity="0.25"/>
  <stop offset="100%" stop-color="${violetDeep}" stop-opacity="0"/>
</linearGradient>
<filter id="sk-glow" x="-30%" y="-30%" width="160%" height="160%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="b"/>
  <feFlood flood-color="${mint}" flood-opacity="0.7"/>
  <feComposite in2="b" operator="in" result="g"/>
  <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
`;

function pkgLine(x, y, name, ver, delay, size) {
  return `<text x="${x}" y="${y}" class="f pkg" style="animation-delay:${delay}s" font-size="${size}">` +
    `<tspan fill="${muted}">› </tspan><tspan fill="${text}">${esc(name)}</tspan>` +
    (ver ? `<tspan fill="${muted}">${esc(ver)}</tspan>` : '') +
    `<tspan fill="${mint}">  ✓</tspan></text>`;
}

function terminal(x, y, w, h, o) {
  const { fs, lh, pad, barH, delay0, step } = o;
  const dotY = y + barH / 2;
  let s = `
<g class="rise" style="animation-delay:.05s">
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${PANEL}"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="url(#sk-term)"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="none" stroke="${violetDeep}" stroke-width="1.5" opacity="0.9"/>
  <rect x="${x}" y="${y}" width="${w}" height="${barH}" rx="14" fill="${PANEL2}"/>
  <rect x="${x}" y="${y + barH - 14}" width="${w}" height="14" fill="${PANEL2}"/>
  <line x1="${x}" y1="${y + barH}" x2="${x + w}" y2="${y + barH}" stroke="${violetDeep}" stroke-width="1" opacity="0.7"/>
  <circle cx="${x + pad}" cy="${dotY}" r="7" fill="${pink}" opacity="0.9"/>
  <circle cx="${x + pad + 26}" cy="${dotY}" r="7" fill="${violet}" opacity="0.9"/>
  <circle cx="${x + pad + 52}" cy="${dotY}" r="7" fill="${mint}" opacity="0.9"/>
  <text x="${x + pad + 80}" y="${dotY + 5}" class="f" font-size="${fs - 5}" fill="${muted}">${esc('dunedev@profile: ~/tech-stack')}</text>
</g>
<text x="${x + pad}" y="${y + barH + lh + 8}" class="f rise" style="animation-delay:${delay0}s" font-size="${fs}">` +
    `<tspan fill="${mint}" font-weight="bold">$</tspan>` +
    `<tspan fill="${text}"> ${esc('sudo install --tech-stack')}</tspan></text>`;
  PACKAGES.forEach(([name, ver], i) => {
    s += pkgLine(x + pad, y + barH + lh + 8 + (i + 1) * lh, name, ver, (delay0 + 0.15 + i * step).toFixed(2), fs);
  });
  const sumY = y + barH + lh + 8 + PACKAGES.length * lh + lh * 1.3;
  const sumDelay = (delay0 + 0.15 + PACKAGES.length * step + 0.2).toFixed(2);
  s += `<text x="${x + pad}" y="${sumY.toFixed(0)}" class="f pkg" style="animation-delay:${sumDelay}s" font-size="${fs}">` +
    `<tspan fill="${mint}">✓ </tspan><tspan fill="${text}">${esc('7 packages installed in ')}</tspan>` +
    `<tspan fill="${mint}">${esc('0.42s')}</tspan></text>`;
  s += `<rect x="${x + pad + 330}" y="${(sumY - fs + 4).toFixed(0)}" width="11" height="${fs + 2}" fill="${mint}" class="cur" style="animation-delay:${sumDelay}s"/>`;
  return s;
}

function tile(tx, ty, tw, th, t, idx, delayBase, iconSize) {
  const cx = tx + tw / 2;
  const accent = ACCENTS[idx % ACCENTS.length];
  const iconColor = idx % 2 === 0 ? text : mint;
  const iconCy = ty + th * 0.40;
  const labelY = ty + th * 0.82;
  let inner;
  if (t.more) {
    inner = `
<text x="${cx}" y="${iconCy + 10}" text-anchor="middle" class="d" font-size="30" fill="${mint}">+${esc('more')}</text>
<text x="${cx}" y="${labelY}" text-anchor="middle" class="f" font-size="12" fill="${muted}">${esc(t.label)}</text>`;
  } else {
    inner = `
${iconAt(t.icon, cx, iconCy, iconSize, iconColor)}
<text x="${cx}" y="${labelY}" text-anchor="middle" class="f" font-size="13" letter-spacing="1" fill="${muted}">${esc(t.label)}</text>`;
  }
  const stroke = t.more
    ? `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="12" fill="none" stroke="${mint}" stroke-width="1.5" stroke-dasharray="7 6" opacity="0.65"/>`
    : `<rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="12" fill="none" stroke="${violetDeep}" stroke-width="1.5" opacity="0.9"/>` +
      `<line x1="${tx + 18}" y1="${ty + 13}" x2="${tx + tw - 18}" y2="${ty + 13}" stroke="${accent}" stroke-width="2" opacity="0.75" filter="url(#sk-glow)"/>`;
  return `
<g class="tile" style="animation-delay:${(delayBase + idx * 0.1).toFixed(2)}s">
  <rect x="${tx}" y="${ty}" width="${tw}" height="${th}" rx="12" fill="${PANEL}"/>
  ${stroke}
  ${inner}
</g>`;
}

function desktop() {
  const tilesX = 600, tilesY = 92, tw = 124, th = 150, gapX = 18, gapY = 18;
  let tilesSvg = '';
  TILES.forEach((t, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    tilesSvg += tile(tilesX + col * (tw + gapX), tilesY + row * (th + gapY), tw, th, t, i, 0.7, 52);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 520" role="img">
<title>${esc('dunedev — tech stack install')}</title>
<defs>${defs}</defs>
<style>${css}</style>
<rect width="1200" height="520" fill="${bg}"/>
<text x="48" y="28" class="f rise" font-size="15" letter-spacing="2" fill="${muted}">${esc('// tech-stack')}</text>
${terminal(48, 36, 500, 448, { fs: 20, lh: 34, pad: 36, barH: 46, delay0: 0.3, step: 0.38 })}
<text x="600" y="64" class="f rise" style="animation-delay:.5s" font-size="15" letter-spacing="2" fill="${muted}">${esc('// installed — 7 packages')}</text>
${tilesSvg}
</svg>`;
}

function mobile() {
  const tilesX = 24, tilesY = 506, tw = 137, th = 124, gapX = 14, gapY = 20;
  let tilesSvg = '';
  TILES.forEach((t, i) => {
    const col = i % 4, row = Math.floor(i / 4);
    tilesSvg += tile(tilesX + col * (tw + gapX), tilesY + row * (th + gapY), tw, th, t, i, 1.4, 40);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 810" role="img">
<title>${esc('dunedev — tech stack install')}</title>
<defs>${defs}</defs>
<style>${css}</style>
<rect width="640" height="810" fill="${bg}"/>
<text x="24" y="40" class="f rise" font-size="15" letter-spacing="2" fill="${muted}">${esc('// tech-stack')}</text>
${terminal(24, 56, 592, 380, { fs: 19, lh: 30, pad: 30, barH: 44, delay0: 0.3, step: 0.32 })}
<text x="24" y="480" class="f rise" style="animation-delay:1.2s" font-size="15" letter-spacing="2" fill="${muted}">${esc('// installed — 7 packages')}</text>
${tilesSvg}
</svg>`;
}

export function render() {
  return { desktop: desktop(), mobile: mobile() };
}
