// Generates public/og-image.png (1200x630) and public/favicon-32.png
// Run: node scripts/generate-og.js
// Requires sharp (install with: npm install --no-save sharp)

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OUT_DIR = path.join(__dirname, "..", "public");

const BRAND = {
  nero: "#171717",
  nordic: "#113033",
  lagoon: "#026B75",
  eastern: "#0493A1",
  smoke: "#F2F2F2",
  white: "#FFFFFF",
};

// ---- OG image (1200x630) ----
const squareLabels = [
  ["Circle", "back"],
  ["Lean", "in"],
  ["Take this", "offline"],
  ["Align", "on that"],
  ["Move the", "needle"],
  ["At a high", "level"],
  ["Drill", "down"],
  ["Actionable", "insights"],
  ["Operation-", "alize"],
  ["Best", "practice"],
  ["Own the", "outcome"],
  ["Optimize", "throughput"],
  ["FREE", ""],
  ["Synergy", ""],
  ["Right-size", "staffing"],
  ["Door to", "Doc"],
  ["LOS", ""],
  ["Ownership", ""],
  ["Playbook", ""],
  ["Let's be", "proactive"],
  ["Dynamic", "model"],
  ["Resource", "allocation"],
  ["Throughput", ""],
  ["Standardize", ""],
  ["Accountab-", "ility"],
];

// Grid geometry (right side of the OG image)
const gridCols = 5;
const gridRows = 5;
const cellSize = 78;
const cellGap = 10;
const gridW = gridCols * cellSize + (gridCols - 1) * cellGap;
const gridH = gridRows * cellSize + (gridRows - 1) * cellGap;
const gridX = 1200 - gridW - 80; // right-aligned with 80px right padding
const gridY = (630 - gridH) / 2;

// Marked squares (for visual interest) — indexes excluding FREE (12)
const markedIdxs = new Set([1, 4, 6, 10, 17, 20, 23]);

function cellRects() {
  let out = "";
  for (let r = 0; r < gridRows; r++) {
    for (let c = 0; c < gridCols; c++) {
      const i = r * gridCols + c;
      const x = gridX + c * (cellSize + cellGap);
      const y = gridY + r * (cellSize + cellGap);
      const isFree = i === 12;
      const isMarked = markedIdxs.has(i);
      const fill = isFree ? BRAND.eastern : isMarked ? BRAND.lagoon : "#0a1f21";
      const stroke = isFree
        ? BRAND.eastern
        : isMarked
        ? BRAND.eastern
        : "#1a3033";
      out += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="10" ry="10" fill="${fill}" stroke="${stroke}" stroke-width="1"/>`;

      const [l1, l2] = squareLabels[i];
      const textColor = isFree ? BRAND.nero : isMarked ? BRAND.white : BRAND.smoke;
      const deco = isMarked ? ` text-decoration="line-through"` : "";
      const cx = x + cellSize / 2;
      if (l2) {
        out += `<text x="${cx}" y="${y + cellSize / 2 - 2}" fill="${textColor}" font-family="Inter, system-ui, sans-serif" font-weight="700" font-size="11" text-anchor="middle"${deco}>${l1}</text>`;
        out += `<text x="${cx}" y="${y + cellSize / 2 + 12}" fill="${textColor}" font-family="Inter, system-ui, sans-serif" font-weight="700" font-size="11" text-anchor="middle"${deco}>${l2}</text>`;
      } else {
        out += `<text x="${cx}" y="${y + cellSize / 2 + 4}" fill="${textColor}" font-family="Inter, system-ui, sans-serif" font-weight="${isFree ? 900 : 700}" font-size="${isFree ? 18 : 12}" text-anchor="middle"${deco}>${l1}</text>`;
      }
    }
  }
  return out;
}

const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="bg1" cx="15%" cy="0%" r="60%">
      <stop offset="0%" stop-color="${BRAND.nordic}" stop-opacity="1"/>
      <stop offset="100%" stop-color="${BRAND.nero}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="bg2" cx="85%" cy="100%" r="55%">
      <stop offset="0%" stop-color="${BRAND.eastern}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${BRAND.nero}" stop-opacity="0"/>
    </radialGradient>
    <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <rect width="1200" height="630" fill="${BRAND.nero}"/>
  <rect width="1200" height="630" fill="url(#bg1)"/>
  <rect width="1200" height="630" fill="url(#bg2)"/>

  <!-- Sendit wordmark -->
  <g transform="translate(80, 92)">
    <circle cx="7" cy="-6" r="7" fill="${BRAND.eastern}" filter="url(#dotGlow)"/>
    <text x="24" y="0" fill="${BRAND.eastern}" font-family="Inter, system-ui, sans-serif" font-weight="800" font-size="22" letter-spacing="5">SENDIT</text>
  </g>

  <!-- Headline -->
  <text x="80" y="280" fill="${BRAND.white}" font-family="Inter, system-ui, sans-serif" font-weight="900" font-size="110" letter-spacing="-3">MOR Bingo<tspan fill="${BRAND.eastern}">.</tspan></text>

  <!-- Tagline -->
  <text x="80" y="340" fill="${BRAND.smoke}" font-family="Inter, system-ui, sans-serif" font-weight="500" font-size="28">Because you know they're going to say it.</text>

  <!-- Subline -->
  <text x="80" y="380" fill="#8a9a9c" font-family="Inter, system-ui, sans-serif" font-weight="400" font-size="20">Generate a bingo card for your next operations meeting.</text>

  <!-- Footer mark -->
  <text x="80" y="560" fill="#5a6a6c" font-family="ui-monospace, monospace" font-weight="600" font-size="14" letter-spacing="2">ED OPS · v1</text>
  <text x="80" y="582" fill="${BRAND.eastern}" font-family="ui-monospace, monospace" font-weight="600" font-size="14">senditgigs.com</text>

  <!-- Bingo grid mockup (right) -->
  ${cellRects()}
</svg>`;

// ---- Favicon (32x32) ----
const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <defs>
    <filter id="g" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <rect width="32" height="32" rx="7" ry="7" fill="${BRAND.nero}"/>
  <circle cx="16" cy="16" r="6" fill="${BRAND.eastern}" filter="url(#g)"/>
</svg>`;

// ---- Render ----
async function run() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  // OG image
  await sharp(Buffer.from(ogSvg))
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT_DIR, "og-image.png"));
  console.log("wrote public/og-image.png (1200x630)");

  // Favicon SVG (modern)
  fs.writeFileSync(path.join(OUT_DIR, "favicon.svg"), faviconSvg);
  console.log("wrote public/favicon.svg");

  // Favicon PNG (32x32) — fallback
  await sharp(Buffer.from(faviconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(OUT_DIR, "favicon-32.png"));
  console.log("wrote public/favicon-32.png");

  // favicon.ico fallback — use 32x32 PNG bytes (broad browser support)
  await sharp(Buffer.from(faviconSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(OUT_DIR, "apple-touch-icon.png"));
  console.log("wrote public/apple-touch-icon.png");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
