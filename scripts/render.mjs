// render.mjs — orchestrator: renders every generative SVG from data/ and writes README.md.
// Pure Node, zero dependencies. Run: node scripts/render.mjs
// Desktop assets are 1200 wide; *-mobile.svg variants are 640 wide,
// picked by <picture media="(max-width: 640px)">.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/theme.mjs";

import { render as header } from "./sections/header.mjs";
import { render as typing } from "./sections/typing.mjs";
import { render as divider } from "./sections/divider.mjs";
import { render as idcard } from "./sections/idcard.mjs";
import { render as skills } from "./sections/skills.mjs";
import { render as builds } from "./sections/builds.mjs";
import { render as stats } from "./sections/stats.mjs";
import { render as footer } from "./sections/footer.mjs";

const SECTIONS = [
  ["header", header],
  ["typing", typing],
  ["divider", divider],
  ["idcard", idcard],
  ["skills", skills],
  ["builds", builds],
  ["stats", stats],
  ["footer", footer],
];

const OUT = join(ROOT, "assets");
mkdirSync(OUT, { recursive: true });

const written = [];

// 1) Render every section: { desktop, mobile } -> assets/<name>.svg, assets/<name>-mobile.svg
for (const [name, render] of SECTIONS) {
  if (typeof render !== "function") throw new Error(`sections/${name}.mjs must export render()`);
  const { desktop, mobile } = render();
  if (!desktop || !mobile) throw new Error(`sections/${name}.mjs render() must return {desktop, mobile}`);
  writeFileSync(join(OUT, `${name}.svg`), desktop);
  writeFileSync(join(OUT, `${name}-mobile.svg`), mobile);
  written.push(`assets/${name}.svg`, `assets/${name}-mobile.svg`);
}

// 2) Remove legacy banner.svg (replaced by header.svg)
const legacy = join(OUT, "banner.svg");
if (existsSync(legacy)) {
  rmSync(legacy);
  console.log("removed assets/banner.svg (legacy, replaced by header.svg)");
}

// 3) Generate README.md from the template
const pic = (name, alt = "") =>
  `<picture><source media="(max-width: 640px)" srcset="assets/${name}-mobile.svg"/><img width="100%" src="assets/${name}.svg" alt="${alt}"/></picture>`;

const readme = `<picture><source media="(max-width: 640px)" srcset="assets/header-mobile.svg"/><img width="100%" src="assets/header.svg" alt="dunedev — Junior Backend Developer"/></picture>

<a href="https://portfolio-one-rust-99.vercel.app/"><picture><source media="(max-width: 640px)" srcset="assets/typing-mobile.svg"/><img width="100%" src="assets/typing.svg" alt=""/></picture></a>

<img width="100%" src="assets/divider.svg" alt=""/>

## 💻 \`> whoami\`

<div align="center">${pic("idcard")}</div>

## ⚡ \`> sudo install --tech-stack\`

<div align="center">${pic("skills")}</div>

## 🚀 \`> featured_builds --live\`

<div align="center">${pic("builds")}</div>

## 📊 \`> system.scan()\`

<div align="center">${pic("stats")}</div>

<h2 align="center">🐍 <code>contribution_snake</code></h2>

<!-- Generate the SVGs with the Platane/snk workflow (https://github.com/Platane/snk)
     in THIS repo (phamdung2301/phamdung2301), output branch — then the animation appears below. -->
<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/phamdung2301/phamdung2301/output/github-contribution-grid-snake-dark.svg"/>
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/phamdung2301/phamdung2301/output/github-contribution-grid-snake.svg"/>
    <img alt="github contribution grid snake animation" src="https://raw.githubusercontent.com/phamdung2301/phamdung2301/output/github-contribution-grid-snake.svg"/>
  </picture>
</div>

<img width="100%" src="assets/divider.svg" alt=""/>

<div align="center"><a href="https://github.com/phamdung2301"><img src="https://img.shields.io/badge/GitHub-0D0221?style=for-the-badge&logo=github&logoColor=00F5D4" alt="GitHub"/></a><p><i>Thanks for stopping by. Have a great day! ✌️</i></p></div>

<div align="center">${pic("footer")}</div>
`;

writeFileSync(join(ROOT, "README.md"), readme);
written.push("README.md");

console.log("wrote:");
for (const f of written) console.log(`  ${f}`);
