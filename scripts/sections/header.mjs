// Cinematic banner for dunedev — terminal/circuit style, deep-navy neon.
// Desktop 1200x360 / mobile 640x220 (re-laid-out, not scaled).
import { C, esc, MONO, DISPLAY, sharedDefs } from '../lib/theme.mjs';

// Resolve palette defensively: use W1's C keys when present,
// fall back to the mandated dunedev palette so the SVG is never broken.
const P = {
  bg: C.bg ?? C.navy ?? '#0D0221',
  violet: C.violet ?? '#7209B7',
  deepViolet: C.deepViolet ?? C.violetDeep ?? '#3A0CA3',
  pink: C.pink ?? '#F72585',
  mint: C.mint ?? '#00F5D4',
  text: C.text ?? '#E6E6FA',
  muted: C.muted ?? '#8A8AA3',
};

// Deterministic PRNG so the composition is stable between builds.
function mulberry32(a) {
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const EASE = 'cubic-bezier(.2,.8,.2,1)';

function styleBlock() {
  return `<style>
.hd-scene{animation:hd-enter 1.4s ${EASE} both}
@keyframes hd-enter{from{opacity:0;transform:translateY(26px)}to{opacity:1;transform:translateY(0)}}
.hd-drift{animation:hd-drift var(--dur,40s) ${EASE} infinite alternate}
@keyframes hd-drift{from{transform:translate(0,0)}to{transform:translate(var(--dx,10px),var(--dy,-46px))}}
.hd-twinkle{animation:hd-twinkle var(--dur2,6s) ease-in-out infinite alternate}
@keyframes hd-twinkle{from{opacity:var(--o0,.25)}to{opacity:var(--o1,.9)}}
.hd-scan{animation:hd-scan 9s ${EASE} infinite}
@keyframes hd-scan{0%{transform:translateY(-90px);opacity:0}12%{opacity:.5}88%{opacity:.5}100%{transform:translateY(430px);opacity:0}}
.hd-orb{animation:hd-orb 14s ease-in-out infinite alternate}
@keyframes hd-orb{from{transform:scale(1);opacity:var(--o0,.3)}to{transform:scale(1.12);opacity:var(--o1,.42)}}
.hd-blink{animation:hd-blink 1.6s steps(1) infinite}
@keyframes hd-blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.hd-scan{display:none}}
</style>`;
}

// Perspective grid floor: converging lines toward a vanishing point.
function gridFloor(vx, top, bottom, w, color, opacity) {
  let s = '';
  // verticals fanning out
  for (let i = -11; i <= 11; i++) {
    const x1 = vx + i * 42, x2 = vx + i * 190;
    s += `<line x1="${x1.toFixed(0)}" y1="${top}" x2="${x2.toFixed(0)}" y2="${bottom}" stroke="${color}" stroke-width="1" opacity="${opacity}"/>`;
  }
  // horizontals with exponential spacing
  const half = (y) => { const t = (y - top) / (bottom - top); return 70 + t * (w / 2 - 70); };
  for (let k = 0; k <= 8; k++) {
    const t = k / 8, y = top + Math.pow(t, 1.7) * (bottom - top);
    const h = half(y);
    s += `<line x1="${(vx - h).toFixed(0)}" y1="${y.toFixed(0)}" x2="${(vx + h).toFixed(0)}" y2="${y.toFixed(0)}" stroke="${color}" stroke-width="1" opacity="${(opacity * (0.5 + t * 0.8)).toFixed(2)}"/>`;
  }
  // horizon glow line
  s += `<line x1="${vx - 70}" y1="${top}" x2="${vx + 70}" y2="${top}" stroke="${color}" stroke-width="1.5" opacity="${(opacity * 2.2).toFixed(2)}"/>`;
  return s;
}

function particles(rnd, w, h, count) {
  const layers = [
    { n: Math.round(count * 0.45), rMin: 0.8, rMax: 1.8, dMin: 45, dMax: 60, o: 0.35 },
    { n: Math.round(count * 0.35), rMin: 1.6, rMax: 2.8, dMin: 30, dMax: 45, o: 0.55 },
    { n: count - Math.round(count * 0.8), rMin: 2.6, rMax: 3.8, dMin: 20, dMax: 30, o: 0.8 },
  ];
  const cols = [P.mint, P.violet, P.pink, P.text];
  let s = '';
  for (const L of layers) {
    for (let i = 0; i < L.n; i++) {
      const cx = (rnd() * w).toFixed(1), cy = (rnd() * h).toFixed(1);
      const r = (L.rMin + rnd() * (L.rMax - L.rMin)).toFixed(1);
      const dur = (L.dMin + rnd() * (L.dMax - L.dMin)).toFixed(1);
      const dx = ((rnd() - 0.5) * 60).toFixed(0), dy = (-20 - rnd() * 70).toFixed(0);
      const col = cols[Math.floor(rnd() * cols.length)];
      const delay = (-rnd() * 40).toFixed(1);
      s += `<circle class="hd-drift" cx="${cx}" cy="${cy}" r="${r}" fill="${col}" opacity="${L.o}" style="--dur:${dur}s;--dx:${dx}px;--dy:${dy}px;animation-delay:${delay}s"/>`;
    }
  }
  return s;
}

function circuitTraces() {
  // Right-angle circuit traces with node pads, low opacity.
  const s = (pts, nodes) =>
    `<polyline points="${pts}" fill="none" stroke="${P.violet}" stroke-width="1.6" opacity=".45"/>` +
    nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="none" stroke="${P.violet}" stroke-width="1.6" opacity=".6"/><circle cx="${x}" cy="${y}" r="1.6" fill="${P.mint}" opacity=".8"/>`).join('');
  return (
    s('40,300 130,300 130,258 210,258', [[40, 300], [210, 258]]) +
    s('1160,64 1070,64 1070,106 1000,106', [[1160, 64], [1000, 106]]) +
    s('60,96 120,96 150,126', [[60, 96]]) +
    s('1140,300 1090,300 1060,270', [[1140, 300]])
  );
}

function defs() {
  return `<defs>
${sharedDefs}
${styleBlock()}
<linearGradient id="hd-bg" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1B0535"/><stop offset=".55" stop-color="${P.bg}"/><stop offset="1" stop-color="#070114"/>
</linearGradient>
<linearGradient id="hd-title" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${P.text}"/><stop offset=".55" stop-color="#BFFBF0"/><stop offset="1" stop-color="${P.mint}"/>
</linearGradient>
<linearGradient id="hd-scan" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${P.mint}" stop-opacity="0"/><stop offset=".5" stop-color="${P.mint}" stop-opacity=".55"/><stop offset="1" stop-color="${P.pink}" stop-opacity="0"/>
</linearGradient>
<radialGradient id="hd-orb-v" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="${P.violet}" stop-opacity=".55"/><stop offset="1" stop-color="${P.violet}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="hd-orb-p" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="${P.pink}" stop-opacity=".5"/><stop offset="1" stop-color="${P.pink}" stop-opacity="0"/>
</radialGradient>
<radialGradient id="hd-orb-m" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="${P.mint}" stop-opacity=".42"/><stop offset="1" stop-color="${P.mint}" stop-opacity="0"/>
</radialGradient>
<filter id="hd-glow" x="-40%" y="-40%" width="180%" height="180%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="b"/>
  <feFlood flood-color="${P.mint}" flood-opacity=".8"/>
  <feComposite in2="b" operator="in" result="g"/>
  <feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
</defs>`;
}

function desktop() {
  const rnd = mulberry32(20261022);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360" role="img" aria-label="dunedev — Junior Backend Developer">
${defs()}
<rect width="1200" height="360" fill="url(#hd-bg)"/>
<g class="hd-scene">
  <circle class="hd-orb" cx="215" cy="118" r="180" fill="url(#hd-orb-v)" style="--o0:.32;--o1:.46"/>
  <circle class="hd-orb" cx="968" cy="246" r="165" fill="url(#hd-orb-p)" style="--o0:.26;--o1:.4;animation-delay:-6s"/>
  <circle class="hd-orb" cx="772" cy="70" r="120" fill="url(#hd-orb-m)" style="--o0:.22;--o1:.36;animation-delay:-3s"/>
  ${gridFloor(600, 218, 360, 1200, P.mint, 0.10)}
  ${particles(rnd, 1200, 360, 64)}
  ${circuitTraces()}
  <text x="1044" y="180" font-family="${MONO}" font-size="30" fill="${P.muted}" opacity=".5" letter-spacing="2">${esc('</>')}</text>
  <text x="96" y="196" font-family="${MONO}" font-size="26" fill="${P.muted}" opacity=".42">{ ; }</text>
  <text x="600" y="172" text-anchor="middle" font-family="${DISPLAY}" font-size="118" font-weight="800" letter-spacing="10" fill="url(#hd-title)" filter="url(#hd-glow)">${esc('dunedev')}</text>
  <text x="600" y="226" text-anchor="middle" font-family="${MONO}" font-size="22" fill="${P.muted}" letter-spacing="3">${esc('Junior Backend Developer | Java & Spring Boot')}</text>
  <text x="600" y="258" text-anchor="middle" font-family="${MONO}" font-size="15" fill="${P.violet}" opacity=".9" letter-spacing="6">${esc('// build · ship · learn')}</text>
  <rect class="hd-scan" x="0" y="0" width="1200" height="70" fill="url(#hd-scan)"/>
  <text class="hd-blink" x="1120" y="330" font-family="${MONO}" font-size="20" fill="${P.mint}" opacity=".8">${esc('▮')}</text>
</g>
</svg>`;
}

function mobile() {
  const rnd = mulberry32(987654);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="220" viewBox="0 0 640 220" role="img" aria-label="dunedev — Junior Backend Developer">
${defs()}
<rect width="640" height="220" fill="url(#hd-bg)"/>
<g class="hd-scene">
  <circle class="hd-orb" cx="120" cy="70" r="110" fill="url(#hd-orb-v)" style="--o0:.3;--o1:.44"/>
  <circle class="hd-orb" cx="520" cy="160" r="100" fill="url(#hd-orb-p)" style="--o0:.26;--o1:.4;animation-delay:-5s"/>
  ${gridFloor(320, 150, 220, 640, P.mint, 0.10)}
  ${particles(rnd, 640, 220, 26)}
  <text x="320" y="104" text-anchor="middle" font-family="${DISPLAY}" font-size="62" font-weight="800" letter-spacing="6" fill="url(#hd-title)" filter="url(#hd-glow)">${esc('dunedev')}</text>
  <text x="320" y="140" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${P.muted}" letter-spacing="2">${esc('Junior Backend Developer')}</text>
  <text x="320" y="162" text-anchor="middle" font-family="${MONO}" font-size="13" fill="${P.muted}" letter-spacing="2">${esc('Java & Spring Boot')}</text>
  <rect class="hd-scan" x="0" y="0" width="640" height="46" fill="url(#hd-scan)"/>
</g>
</svg>`;
}

export function render() {
  return { desktop: desktop(), mobile: mobile() };
}
