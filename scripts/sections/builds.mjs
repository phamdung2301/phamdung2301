import { C, esc, MONO, DISPLAY, sharedDefs } from '../lib/theme.mjs';
import { readFileSync } from 'node:fs';

/* ------------------------------------------------------------------
 * Theme fallbacks. lib/theme.mjs is authored by a sibling worker, so
 * every import is guarded; the mandated dunedev palette is the hard
 * fallback (never #00F5FF / #FF00FF / #D7FF37).
 * ------------------------------------------------------------------ */
const P = {
  bg: C?.bg ?? '#0D0221',
  violet: C?.violet ?? '#7209B7',
  violetDeep: C?.violetDeep ?? C?.deepViolet ?? '#3A0CA3',
  pink: C?.pink ?? '#F72585',
  mint: C?.mint ?? '#00F5D4',
  text: C?.text ?? '#E6E6FA',
  muted: C?.muted ?? '#8A8AA3',
};
const escH = typeof esc === 'function'
  ? esc
  : (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MONO_F = MONO || 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
const DISPLAY_F = DISPLAY || "'Segoe UI', system-ui, -apple-system, sans-serif";
const SHARED = typeof sharedDefs === 'function' ? sharedDefs() : '';

/* ------------------------------------------------------------------
 * Data. Read from data/builds.json (4 projects). The fallback below
 * mirrors the documented sample and is used ONLY if the JSON file is
 * missing at render time — real renders always read the JSON.
 * ------------------------------------------------------------------ */
function loadJson(rel, fallback) {
  try {
    return JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
  } catch {
    return fallback;
  }
}
const FALLBACK_BUILDS = [
  { name: 'masterjp', desc: 'Japanese learning platform — Minna no Nihongo N5–N4: vocab decks, flashcards and quizzes.', tags: ['Spring Boot', 'MongoDB', 'React'], repo: 'phamdung2301/masterjp', live: null },
  { name: 'furniture', desc: 'Full-stack furniture e-commerce with cart, checkout flow and an admin dashboard.', tags: ['Spring Boot', 'MongoDB', 'React'], repo: 'phamdung2301/furniture', live: null },
  { name: 'insuren', desc: 'Insurance management platform — policy lifecycle, claims and admin console.', tags: ['Spring Boot', 'React', 'Docker'], repo: 'phamdung2301/insuren', live: null },
  { name: 'portfolio', desc: 'Personal developer portfolio — projects, skills and contact in one place.', tags: ['Next.js', 'Vercel'], repo: 'phamdung2301/phamdung2301', live: 'https://portfolio-one-rust-99.vercel.app/' },
];
const raw = loadJson('../../data/builds.json', FALLBACK_BUILDS);
const builds = (Array.isArray(raw) ? raw : []).slice(0, 4).map((p = {}) => ({
  name: String(p.name || p.title || p.slug || 'project'),
  desc: String(p.desc || p.description || ''),
  tags: Array.isArray(p.tags ?? p.tech) ? (p.tags ?? p.tech).slice(0, 4).map(String) : [],
  repo: String(p.repo || '').replace(/^https?:\/\//, ''),
  live: p.live || p.url || p.demo || null,
}));

/* Manual word wrap to ~N chars per line (no JS text measuring in SVG). */
function wrap(text, max) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    if (cur && (cur + ' ' + w).length > max) { lines.push(cur); cur = w; }
    else cur = cur ? cur + ' ' + w : w;
  }
  if (cur) lines.push(cur);
  return lines.slice(0, 2);
}

const css = `<style>
.rise{animation:rise .7s cubic-bezier(.2,.8,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.pulse{animation:pulse 2.6s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@media (prefers-reduced-motion:reduce){.rise,.pulse{animation:none}}
</style>`;

function defs(prefix) {
  return `<defs>${SHARED}${css}
<filter id="${prefix}-glowV" x="-30%" y="-30%" width="160%" height="160%">
<feGaussianBlur in="SourceAlpha" stdDeviation="7" result="b"/>
<feFlood flood-color="${P.violet}" flood-opacity=".6"/>
<feComposite in2="b" operator="in" result="g"/>
<feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<radialGradient id="${prefix}-bgA" cx=".12" cy=".08" r=".9">
<stop offset="0" stop-color="${P.violet}" stop-opacity=".22"/>
<stop offset="1" stop-color="${P.violet}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="${prefix}-bgB" cx=".88" cy=".95" r=".9">
<stop offset="0" stop-color="${P.pink}" stop-opacity=".12"/>
<stop offset="1" stop-color="${P.pink}" stop-opacity="0"/>
</radialGradient>
<pattern id="${prefix}-grid" width="44" height="44" patternUnits="userSpaceOnUse">
<path d="M44 0H0V44" fill="none" stroke="${P.violet}" stroke-opacity=".08"/>
</pattern>
</defs>`;
}

function corners(x, y, w, h, l = 14) {
  return `<g fill="none" stroke="${P.mint}" stroke-opacity=".4" stroke-width="2">`
    + `<path d="M${x} ${y + l}V${y}H${x + l}"/>`
    + `<path d="M${x + w - l} ${y}H${x + w}V${y + l}"/>`
    + `<path d="M${x} ${y + h - l}V${y + h}H${x + l}"/>`
    + `<path d="M${x + w - l} ${y + h}H${x + w}V${y + h - l}"/>`
    + `</g>`;
}

/* One project card. o carries the per-breakpoint metrics. */
function card(p, i, x, y, w, h, o, prefix) {
  const nameColor = i % 2 === 0 ? P.mint : P.text;
  const title = `<text x="${x + o.pad}" y="${y + o.titleY}" font-family="${DISPLAY_F}" font-weight="800" font-size="${o.titleSize}" fill="${nameColor}">${escH(p.name)}</text>`;
  const descEls = wrap(p.desc, o.descWrap).map((ln, li) =>
    `<text x="${x + o.pad}" y="${y + o.descY + li * (o.descSize + 7)}" font-family="${MONO_F}" font-size="${o.descSize}" fill="${P.muted}">${escH(ln)}</text>`
  ).join('');
  let cx = x + o.pad;
  const chipEls = p.tags.map((t, ci) => {
    const label = t.toUpperCase();
    const cw = Math.round(label.length * o.chipFont * 0.62 + 26);
    const col = ci % 2 === 0 ? P.pink : P.mint;
    const el = `<g><rect x="${cx}" y="${y + o.chipY}" width="${cw}" height="${o.chipH}" rx="${o.chipH / 2}" fill="none" stroke="${col}" stroke-opacity=".65"/>`
      + `<text x="${(cx + cw / 2).toFixed(1)}" y="${(y + o.chipY + o.chipH / 2 + o.chipFont * 0.36).toFixed(1)}" text-anchor="middle" font-family="${MONO_F}" font-size="${o.chipFont}" fill="${col}">${escH(label)}</text></g>`;
    cx += cw + 10;
    return el;
  }).join('');
  const repoLine = `<text x="${x + o.pad}" y="${y + o.footY}" font-family="${MONO_F}" font-size="${o.footSize}" fill="${P.muted}">github.com/${escH(p.repo)}</text>`;
  const liveBadge = p.live
    ? `<g class="pulse"><text x="${x + w - o.pad}" y="${y + o.footY}" text-anchor="end" font-family="${MONO_F}" font-size="${o.footSize}" font-weight="700" fill="${P.pink}">● LIVE</text></g>`
    : '';
  return `<g class="rise" style="animation-delay:${(0.1 + i * 0.12).toFixed(2)}s">`
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" fill="${P.violetDeep}" fill-opacity=".14" stroke="${P.violet}" stroke-opacity=".55" filter="url(#${prefix}-glowV)"/>`
    + corners(x + 7, y + 7, w - 14, h - 14)
    + title + descEls + chipEls + repoLine + liveBadge
    + `</g>`;
}

function header(count, W) {
  return `<g class="rise">`
    + `<text x="32" y="50" font-family="${MONO_F}" font-size="15"><tspan fill="${P.mint}" font-weight="700">&gt;</tspan>`
    + `<tspan fill="${P.text}"> featured.builds(</tspan><tspan fill="${P.pink}" font-weight="700">${String(count).padStart(2, '0')}</tspan><tspan fill="${P.text}">)</tspan></text>`
    + `<text x="${W - 32}" y="50" text-anchor="end" font-family="${MONO_F}" font-size="11" fill="${P.muted}">src: data/builds.json</text>`
    + `</g>`;
}

function backdrop(prefix, W, H) {
  return `<rect width="${W}" height="${H}" rx="16" fill="${P.bg}"/>`
    + `<rect width="${W}" height="${H}" rx="16" fill="url(#${prefix}-grid)"/>`
    + `<rect width="${W}" height="${H}" rx="16" fill="url(#${prefix}-bgA)"/>`
    + `<rect width="${W}" height="${H}" rx="16" fill="url(#${prefix}-bgB)"/>`;
}

function desktop() {
  const W = 1200, H = 560, pad = 32, gap = 20;
  const cw = (W - pad * 2 - gap) / 2; // 558
  const y0 = 88;
  const ch = (H - y0 - pad - gap) / 2; // 210
  const o = { pad: 22, titleSize: 23, titleY: 42, descSize: 13, descWrap: 54, descY: 70, chipY: 118, chipH: 26, chipFont: 11, footSize: 12, footY: 182 };
  const cx0 = pad + cw / 2, cx1 = pad + cw + gap + cw / 2;
  const cy0 = y0 + ch / 2, cy1 = y0 + ch + gap + ch / 2;
  const circuit = `M${cx0} ${cy0}L${cx1} ${cy0}L${cx1} ${cy1}L${cx0} ${cy1}`;
  const cards = builds.map((p, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    return card(p, i, pad + col * (cw + gap), y0 + row * (ch + gap), cw, ch, o, 'bd');
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="560" viewBox="0 0 1200 560" role="img" aria-label="Featured builds: ${builds.length} projects">`
    + defs('bd')
    + backdrop('bd', W, H)
    + `<path d="${circuit}" fill="none" stroke="${P.violet}" stroke-opacity=".22" stroke-width="2" stroke-dasharray="6 8" stroke-linejoin="round"/>`
    + `<circle r="4" fill="${P.mint}" opacity=".7"><animateMotion dur="8s" repeatCount="indefinite" path="${circuit}"/></circle>`
    + `<circle r="4" fill="${P.pink}" opacity=".7"><animateMotion dur="8s" begin="-4s" repeatCount="indefinite" path="${circuit}"/></circle>`
    + cards
    + header(builds.length, W)
    + `</svg>`;
  return svg;
}

function mobile() {
  const W = 640, pad = 24, gap = 14;
  const cw = W - pad * 2; // 592
  const ch = 150;
  const y0 = 84;
  const H = y0 + builds.length * ch + (builds.length - 1) * gap + pad; // 750
  const o = { pad: 20, titleSize: 20, titleY: 36, descSize: 12, descWrap: 66, descY: 60, chipY: 96, chipH: 24, chipFont: 10, footSize: 11, footY: 134 };
  const cards = builds.map((p, i) => card(p, i, pad, y0 + i * (ch + gap), cw, ch, o, 'bm')).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="${H}" viewBox="0 0 640 ${H}" role="img" aria-label="Featured builds: ${builds.length} projects">`
    + defs('bm')
    + backdrop('bm', W, H)
    + `<line x1="44" y1="${y0}" x2="44" y2="${y0 + builds.length * ch + (builds.length - 1) * gap}" stroke="${P.violet}" stroke-opacity=".18" stroke-width="2" stroke-dasharray="5 7"/>`
    + cards
    + header(builds.length, W)
    + `</svg>`;
  return svg;
}

export function render() {
  return { desktop: desktop(), mobile: mobile() };
}
