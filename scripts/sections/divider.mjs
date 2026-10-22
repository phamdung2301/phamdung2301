// Thin neon gradient divider — mint → violet → pink with a travelling shimmer.
// Desktop 1200x10 / mobile 640x8.
import { C, esc, MONO, DISPLAY, sharedDefs } from '../lib/theme.mjs';

const P = {
  violet: C.violet ?? '#7209B7',
  pink: C.pink ?? '#F72585',
  mint: C.mint ?? '#00F5D4',
};

const EASE = 'cubic-bezier(.2,.8,.2,1)';

function styleBlock() {
  return `<style>
.dv-shimmer{animation:dv-run 3.8s ${EASE} infinite}
@keyframes dv-run{from{transform:translateX(-220px)}to{transform:translateX(1320px)}}
@media (prefers-reduced-motion:reduce){*{animation:none!important}.dv-shimmer{display:none}}
</style>`;
}

function defs() {
  return `<defs>
${sharedDefs}
${styleBlock()}
<linearGradient id="dv-line" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="${P.mint}"/><stop offset=".5" stop-color="${P.violet}"/><stop offset="1" stop-color="${P.pink}"/>
</linearGradient>
<linearGradient id="dv-shine" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
</linearGradient>
<filter id="dv-glow" x="-5%" y="-600%" width="110%" height="1300%">
  <feGaussianBlur stdDeviation="2.4"/>
</filter>
</defs>`;
}

function desktop() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="10" viewBox="0 0 1200 10" role="img" aria-label="">
${defs()}
<rect x="0" y="4" width="1200" height="2" fill="url(#dv-line)" opacity=".95"/>
<rect x="0" y="4" width="1200" height="2" fill="url(#dv-line)" filter="url(#dv-glow)" opacity=".7"/>
<rect class="dv-shimmer" x="0" y="2.5" width="200" height="5" rx="2.5" fill="url(#dv-shine)"/>
</svg>`;
}

function mobile() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="8" viewBox="0 0 640 8" role="img" aria-label="">
${defs()}
<rect x="0" y="3" width="640" height="2" fill="url(#dv-line)" opacity=".95"/>
<rect x="0" y="3" width="640" height="2" fill="url(#dv-line)" filter="url(#dv-glow)" opacity=".7"/>
<rect class="dv-shimmer" x="0" y="2" width="140" height="4" rx="2" fill="url(#dv-shine)"/>
</svg>`;
}

export function render() {
  return { desktop: desktop(), mobile: mobile() };
}
