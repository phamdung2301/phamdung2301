// theme.mjs — design tokens + shared SVG helpers for the dunedev generative profile README.
// Pure Node, zero dependencies. Imported by every section renderer in scripts/sections/.
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/** Repo root (…/profile-build/base), so section renderers can locate data/ and assets/. */
export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** Cyberpunk palette for dunedev. Keep all keys — W2/W3/W4 read from this object. */
export const C = {
  bg: "#0D0221",
  bg2: "#150a33",
  violet: "#7209B7",
  violet2: "#3A0CA3",
  pink: "#F72585",
  mint: "#00F5D4",
  text: "#E6E6FA",
  muted: "#8A8AA3",
  line: "rgba(0,245,212,0.22)",
};

/** Escape XML special chars (& < > ") for text injected into SVG. */
export const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Monospace stack for terminal/code text. */
export const MONO =
  "ui-monospace,'Cascadia Code','Fira Code',Menlo,Consolas,monospace";

/** Display stack for big titles — system-only, weight 800. NOT Orbitron. */
export const DISPLAY =
  "system-ui,'Segoe UI',Inter,Roboto,'Helvetica Neue',Arial,sans-serif";

/** Shared <defs>: glow filters + scanline/grid patterns used by every section. */
export const sharedDefs = `<defs>
<filter id="glowMint" x="-60%" y="-60%" width="220%" height="220%">
<feGaussianBlur stdDeviation="4" result="b"/>
<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="glowPink" x="-60%" y="-60%" width="220%" height="220%">
<feGaussianBlur stdDeviation="4" result="b"/>
<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<filter id="glowViolet" x="-60%" y="-60%" width="220%" height="220%">
<feGaussianBlur stdDeviation="6" result="b"/>
<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
<rect width="4" height="1" fill="rgba(255,255,255,0.045)"/>
</pattern>
<pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
<path d="M28 0H0V28" fill="none" stroke="${C.line}" stroke-width="1"/>
</pattern>
</defs>`;

/* ── additive helpers (optional, do not replace the contract above) ── */

/** Desktop SVG canvas width used across sections. */
export const DW = 1200;
/** Mobile SVG canvas width (picked by <picture media="(max-width: 640px)">). */
export const MW = 640;

/** Wrap CSS in a prefers-reduced-motion guard so animations degrade gracefully. */
export const reducedMotion = (css) =>
  `@media (prefers-reduced-motion: reduce){${css}}`;
