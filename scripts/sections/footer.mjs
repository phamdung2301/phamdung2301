// Subdued counterpart to the header — three slow neon waves drift
// horizontally under a fading navy gradient, tiny particles, `dunedev // EOF`.
// Desktop 1200x180 / mobile 640x120 (re-laid-out, not scaled).
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

// One horizontal wave, periodic over 160px so a -160px drift loops seamlessly.
function wavePath(base, amp, w, step = 16) {
  const k = (Math.PI * 2) / 160;
  let d = '';
  for (let x = -160; x <= w + 160; x += step) {
    const y = base + amp * Math.sin(x * k) + amp * 0.45 * Math.sin(x * k * 2.3 + 1.1);
    d += (x === -160 ? 'M' : 'L') + x.toFixed(1) + ' ' + y.toFixed(1);
  }
  return d;
}

function styleBlock() {
  return `<style>
.ft-scene{animation:ft-enter 1.2s ${EASE} both}
@keyframes ft-enter{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.ft-wave{animation:ft-drift var(--dur,30s) linear infinite}
@keyframes ft-drift{from{transform:translateX(0)}to{transform:translateX(-160px)}}
.ft-tw{animation:ft-tw var(--dur2,5s) ease-in-out infinite alternate}
@keyframes ft-tw{from{opacity:.15}to{opacity:.85}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>`;
}

function defs() {
  return `<defs>
${sharedDefs}
${styleBlock()}
<linearGradient id="ft-bg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${P.bg}" stop-opacity="0"/><stop offset="1" stop-color="#070114"/>
</linearGradient>
<filter id="ft-glow" x="-10%" y="-400%" width="120%" height="900%">
  <feGaussianBlur stdDeviation="3" result="b"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
</defs>`;
}

function particleRow(rnd, w, base, n) {
  const cols = [P.mint, P.violet, P.pink];
  let s = '';
  for (let i = 0; i < n; i++) {
    const cx = (rnd() * w).toFixed(1), cy = (base + rnd() * 40).toFixed(1);
    const r = (0.9 + rnd() * 1.6).toFixed(1);
    const dur = (3 + rnd() * 4).toFixed(1);
    s += `<circle class="ft-tw" cx="${cx}" cy="${cy}" r="${r}" fill="${cols[i % 3]}" style="--dur2:${dur}s;animation-delay:${(-rnd() * 5).toFixed(1)}s"/>`;
  }
  return s;
}

function desktop() {
  const rnd = (() => { let a = 424242; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();
  const waves = [
    { d: wavePath(86, 18, 1200), color: P.violet, op: 0.5, w: 2.5, dur: '34s' },
    { d: wavePath(104, 24, 1200), color: P.pink, op: 0.35, w: 2, dur: '26s', delay: '-9s' },
    { d: wavePath(68, 13, 1200), color: P.mint, op: 0.3, w: 1.6, dur: '42s', delay: '-17s' },
  ].map((wv) =>
    `<path class="ft-wave" d="${wv.d}" fill="none" stroke="${wv.color}" stroke-width="${wv.w}" opacity="${wv.op}" filter="url(#ft-glow)" style="--dur:${wv.dur};${wv.delay ? `animation-delay:${wv.delay};` : ''}"/>`
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="180" viewBox="0 0 1200 180" role="img" aria-label="dunedev — end of profile">
${defs()}
<rect width="1200" height="180" fill="url(#ft-bg)"/>
<g class="ft-scene">
  ${waves}
  ${particleRow(rnd, 1200, 96, 18)}
  <line x1="480" y1="146" x2="720" y2="146" stroke="${P.deepViolet}" stroke-width="1" opacity=".6"/>
  <text x="600" y="150" text-anchor="middle" font-family="${MONO}" font-size="16" fill="${P.muted}" letter-spacing="4">${esc('dunedev // EOF')}</text>
  <text x="600" y="172" text-anchor="middle" font-family="${MONO}" font-size="12" fill="${P.violet}" opacity=".8" letter-spacing="2">${esc('</>')}</text>
</g>
</svg>`;
}

function mobile() {
  const rnd = (() => { let a = 777; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; })();
  const waves = [
    { d: wavePath(56, 13, 640), color: P.violet, op: 0.5, w: 2.2, dur: '32s' },
    { d: wavePath(70, 17, 640), color: P.pink, op: 0.35, w: 1.8, dur: '25s', delay: '-8s' },
  ].map((wv) =>
    `<path class="ft-wave" d="${wv.d}" fill="none" stroke="${wv.color}" stroke-width="${wv.w}" opacity="${wv.op}" filter="url(#ft-glow)" style="--dur:${wv.dur};${wv.delay ? `animation-delay:${wv.delay};` : ''}"/>`
  ).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="120" viewBox="0 0 640 120" role="img" aria-label="dunedev — end of profile">
${defs()}
<rect width="640" height="120" fill="url(#ft-bg)"/>
<g class="ft-scene">
  ${waves}
  ${particleRow(rnd, 640, 60, 10)}
  <text x="320" y="102" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${P.muted}" letter-spacing="3">${esc('dunedev // EOF')}</text>
</g>
</svg>`;
}

export function render() {
  return { desktop: desktop(), mobile: mobile() };
}
