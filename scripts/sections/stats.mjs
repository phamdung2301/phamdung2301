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
 * Data — only REAL numbers, never invented:
 * - PUBLIC REPOS: stats.json → public_repos (15)
 * - FEATURED BUILDS: counted from data/builds.json (4)
 * - YEARS ON GITHUB: derived from stats.json → created_at (2024-12 → 2)
 * - CORE TECH: hardcoded 7 = number of packages in the skills list
 *   (source: skill package list; kept as a constant with this note)
 * followers/following (=0) are deliberately NOT displayed.
 * ------------------------------------------------------------------ */
function loadJson(rel, fallback) {
  try {
    return JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
  } catch {
    return fallback;
  }
}
const FALLBACK_STATS = { login: 'dunedev', public_repos: 15, followers: 0, following: 0, created_at: '2024-12-04T02:46:28Z' };
const stats = loadJson('../../data/stats.json', FALLBACK_STATS) || {};
const rawBuilds = loadJson('../../data/builds.json', []);
const featuredBuilds = Array.isArray(rawBuilds) ? rawBuilds.length : 0;

const createdYear = new Date(stats.created_at).getUTCFullYear();
const yearsOnGithub = Number.isFinite(createdYear)
  ? Math.max(0, new Date().getUTCFullYear() - createdYear)
  : 0;
const CORE_TECH = 7; // hardcoded: number of packages in the skills list (source: skill package list)

const metrics = [
  { label: 'PUBLIC REPOS', value: String(Number(stats.public_repos) || 0), sub: '// public only', color: P.mint, glow: 'glowM' },
  { label: 'FEATURED BUILDS', value: String(featuredBuilds), sub: '// from builds.json', color: P.text, glow: 'glowV' },
  { label: 'YEARS ON GITHUB', value: String(yearsOnGithub), sub: `// since ${Number.isFinite(createdYear) ? createdYear : '—'}`, color: P.mint, glow: 'glowM' },
  { label: 'CORE TECH', value: String(CORE_TECH), sub: '// skill packages', color: P.pink, glow: 'glowP' },
];

function css(scanDist) {
  return `<style>
.rise{animation:rise .7s cubic-bezier(.2,.8,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.blink{animation:blink 1.1s steps(2,start) infinite}
@keyframes blink{to{visibility:hidden}}
.scanx{animation:scanx 3.4s cubic-bezier(.2,.8,.2,1) infinite}
@keyframes scanx{0%{transform:translateX(0);opacity:0}12%{opacity:1}88%{opacity:1}100%{transform:translateX(${scanDist}px);opacity:0}}
.scany{animation:scany 7s linear infinite}
@keyframes scany{from{transform:translateY(-90px)}to{transform:translateY(460px)}}
@media (prefers-reduced-motion:reduce){.rise,.blink,.scanx,.scany{animation:none}}
</style>`;
}

function defs(prefix, scanDist) {
  const glow = (id, color) => `<filter id="${prefix}-${id}" x="-40%" y="-40%" width="180%" height="180%">`
    + `<feGaussianBlur in="SourceAlpha" stdDeviation="7" result="b"/>`
    + `<feFlood flood-color="${color}" flood-opacity=".8"/>`
    + `<feComposite in2="b" operator="in" result="g"/>`
    + `<feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
  return `<defs>${SHARED}${css(scanDist)}`
    + glow('glowM', P.mint) + glow('glowP', P.pink) + glow('glowV', P.violet)
    + `<radialGradient id="${prefix}-bgA" cx=".1" cy="0" r="1"><stop offset="0" stop-color="${P.violet}" stop-opacity=".2"/><stop offset="1" stop-color="${P.violet}" stop-opacity="0"/></radialGradient>`
    + `<radialGradient id="${prefix}-bgB" cx=".9" cy="1" r="1"><stop offset="0" stop-color="${P.pink}" stop-opacity=".1"/><stop offset="1" stop-color="${P.pink}" stop-opacity="0"/></radialGradient>`
    + `<pattern id="${prefix}-grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0V44" fill="none" stroke="${P.violet}" stroke-opacity=".08"/></pattern>`
    + `<linearGradient id="${prefix}-scan" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${P.mint}" stop-opacity="0"/><stop offset=".5" stop-color="${P.mint}" stop-opacity=".95"/><stop offset="1" stop-color="${P.mint}" stop-opacity="0"/></linearGradient>`
    + `<linearGradient id="${prefix}-sweep" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${P.violet}" stop-opacity="0"/><stop offset=".5" stop-color="${P.violet}" stop-opacity=".14"/><stop offset="1" stop-color="${P.violet}" stop-opacity="0"/></linearGradient>`
    + `</defs>`;
}

function corners(x, y, w, h, l = 12) {
  return `<g fill="none" stroke="${P.mint}" stroke-opacity=".4" stroke-width="2">`
    + `<path d="M${x} ${y + l}V${y}H${x + l}"/>`
    + `<path d="M${x + w - l} ${y}H${x + w}V${y + l}"/>`
    + `<path d="M${x} ${y + h - l}V${y + h}H${x + l}"/>`
    + `<path d="M${x + w - l} ${y + h}H${x + w}V${y + h - l}"/>`
    + `</g>`;
}

function backdrop(prefix, W, H) {
  return `<rect width="${W}" height="${H}" rx="16" fill="${P.bg}"/>`
    + `<rect width="${W}" height="${H}" rx="16" fill="url(#${prefix}-grid)"/>`
    + `<rect width="${W}" height="${H}" rx="16" fill="url(#${prefix}-bgA)"/>`
    + `<rect width="${W}" height="${H}" rx="16" fill="url(#${prefix}-bgB)"/>`
    + `<rect x="0" y="0" width="${W}" height="70" fill="url(#${prefix}-sweep)" class="scany" opacity=".6"/>`;
}

function header(prefix, W, trackX, trackW, segW) {
  const login = stats.login ? `  // @${escH(stats.login)}` : '';
  return `<g class="rise">`
    + `<text x="32" y="46" font-family="${MONO_F}" font-size="15"><tspan fill="${P.mint}" font-weight="700">&gt;</tspan>`
    + `<tspan fill="${P.text}"> system.scan(performance)</tspan><tspan fill="${P.muted}" font-size="12">${login}</tspan></text>`
    + `<text x="${W - 32}" y="46" text-anchor="end" font-family="${MONO_F}" font-size="12" font-weight="700" fill="${P.mint}" class="blink">● SCAN COMPLETE</text>`
    + `<rect x="${trackX}" y="60" width="${trackW}" height="6" rx="3" fill="${P.violetDeep}" fill-opacity=".35"/>`
    + `<rect x="${trackX}" y="60" width="${segW}" height="6" rx="3" fill="url(#${prefix}-scan)" class="scanx"/>`
    + `</g>`;
}

function cell(m, i, x, y, w, h, prefix, o) {
  return `<g class="rise" style="animation-delay:${(0.15 + i * 0.12).toFixed(2)}s">`
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${P.violetDeep}" fill-opacity=".14" stroke="${P.violet}" stroke-opacity=".5"/>`
    + corners(x + 6, y + 6, w - 12, h - 12)
    + `<text x="${x + 18}" y="${y + o.idxY}" font-family="${MONO_F}" font-size="11" fill="${P.muted}">0${i + 1}</text>`
    + `<text x="${x + 18}" y="${y + o.labelY}" font-family="${MONO_F}" font-size="${o.labelSize}" letter-spacing="2" fill="${P.muted}">${m.label}</text>`
    + `<text x="${x + 18}" y="${y + o.numY}" font-family="${DISPLAY_F}" font-weight="800" font-size="${o.numSize}" fill="${m.color}" filter="url(#${prefix}-${m.glow})">${escH(m.value)}</text>`
    + `<text x="${x + 18}" y="${y + o.subY}" font-family="${MONO_F}" font-size="${o.subSize}" fill="${P.muted}">${escH(m.sub)}</text>`
    + `</g>`;
}

function footer(W, y) {
  return `<g>`
    + `<text x="32" y="${y}" font-family="${MONO_F}" font-size="11" fill="${P.muted}">src: data/stats.json · data/builds.json</text>`
    + `<text x="${W - 32}" y="${y}" text-anchor="end" font-family="${MONO_F}" font-size="11" fill="${P.muted}">css/smil motion · no javascript</text>`
    + `</g>`;
}

function desktop() {
  const W = 1200, H = 360, pad = 32, gap = 20;
  const cw = (W - pad * 2 - gap * 3) / 4; // 269
  const y0 = 96, ch = 190;
  const o = { idxY: 28, labelY: 56, labelSize: 12, numY: 128, numSize: 60, subY: 162, subSize: 11 };
  const trackX = 32, trackW = W - 64, segW = 150;
  const cells = metrics.map((m, i) => cell(m, i, pad + i * (cw + gap), y0, cw, ch, 'sd', o)).join('');
  const aria = `GitHub stats: ${metrics[0].value} public repos, ${metrics[1].value} featured builds, ${metrics[2].value} years on GitHub, ${metrics[3].value} core tech`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360" role="img" aria-label="${aria}">`
    + defs('sd', trackW - segW)
    + backdrop('sd', W, H)
    + header('sd', W, trackX, trackW, segW)
    + cells
    + footer(W, 330)
    + `</svg>`;
}

function mobile() {
  const W = 640, pad = 24, gap = 16;
  const cw = (W - pad * 2 - gap) / 2; // 288
  const ch = 150;
  const y0 = 88;
  const H = y0 + 2 * ch + gap + 56; // 460
  const o = { idxY: 26, labelY: 52, labelSize: 11, numY: 118, numSize: 44, subY: 140, subSize: 10 };
  const trackX = 24, trackW = W - 48, segW = 120;
  const cells = metrics.map((m, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    return cell(m, i, pad + col * (cw + gap), y0 + row * (ch + gap), cw, ch, 'sm', o);
  }).join('');
  const aria = `GitHub stats: ${metrics[0].value} public repos, ${metrics[1].value} featured builds, ${metrics[2].value} years on GitHub, ${metrics[3].value} core tech`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="${H}" viewBox="0 0 640 ${H}" role="img" aria-label="${aria}">`
    + defs('sm', trackW - segW)
    + backdrop('sm', W, H)
    + header('sm', W, trackX, trackW, segW)
    + cells
    + footer(W, H - 24)
    + `</svg>`;
}

export function render() {
  return { desktop: desktop(), mobile: mobile() };
}
