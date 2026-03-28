/**
 * Generates all required Expo image assets:
 *   assets/icon.png          (1024x1024)
 *   assets/splash.png        (1242x2436)
 *   assets/adaptive-icon.png (1024x1024)
 *
 * Run once before building:  node scripts/generate-assets.js
 *
 * Requires: npm install --save-dev sharp
 */

const path = require('path');
const fs = require('fs');

async function run() {
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('❌  sharp not found. Run: npm install --save-dev sharp');
    process.exit(1);
  }

  const assetsDir = path.join(__dirname, '..', 'assets');
  if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

  // ── Icon (dark bg + white calculator symbol) ────────────────────────────────
  const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0A0A1A"/>
      <stop offset="100%" stop-color="#12122A"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="1024" height="1024" rx="220" fill="url(#bg)"/>
  <!-- Calculator body -->
  <rect x="220" y="180" width="584" height="664" rx="56" fill="url(#accent)" opacity="0.15"/>
  <rect x="220" y="180" width="584" height="664" rx="56" fill="none" stroke="url(#accent)" stroke-width="6"/>
  <!-- Display area -->
  <rect x="264" y="224" width="496" height="160" rx="24" fill="rgba(0,212,255,0.1)"/>
  <!-- Expression text on display -->
  <text x="512" y="286" text-anchor="middle" font-family="monospace" font-size="52" font-weight="700" fill="#00D4FF">2x + 5 = 13</text>
  <text x="512" y="348" text-anchor="middle" font-family="monospace" font-size="44" font-weight="800" fill="#00FF88">x = 4</text>
  <!-- Buttons grid -->
  <!-- Row 1 -->
  <rect x="264" y="420" width="100" height="80" rx="16" fill="rgba(124,58,237,0.3)"/>
  <rect x="388" y="420" width="100" height="80" rx="16" fill="rgba(124,58,237,0.3)"/>
  <rect x="512" y="420" width="100" height="80" rx="16" fill="rgba(124,58,237,0.3)"/>
  <rect x="636" y="420" width="124" height="80" rx="16" fill="rgba(6,182,212,0.3)"/>
  <!-- Row 2 -->
  <rect x="264" y="524" width="100" height="80" rx="16" fill="rgba(255,255,255,0.06)"/>
  <rect x="388" y="524" width="100" height="80" rx="16" fill="rgba(255,255,255,0.06)"/>
  <rect x="512" y="524" width="100" height="80" rx="16" fill="rgba(255,255,255,0.06)"/>
  <rect x="636" y="524" width="124" height="80" rx="16" fill="rgba(6,182,212,0.3)"/>
  <!-- Row 3 -->
  <rect x="264" y="628" width="100" height="80" rx="16" fill="rgba(255,255,255,0.06)"/>
  <rect x="388" y="628" width="100" height="80" rx="16" fill="rgba(255,255,255,0.06)"/>
  <rect x="512" y="628" width="100" height="80" rx="16" fill="rgba(255,255,255,0.06)"/>
  <rect x="636" y="628" width="124" height="184" rx="16" fill="rgba(0,255,136,0.4)"/>
  <!-- Row 4 -->
  <rect x="264" y="732" width="224" height="80" rx="16" fill="rgba(255,255,255,0.06)"/>
  <rect x="512" y="732" width="100" height="80" rx="16" fill="rgba(255,255,255,0.06)"/>
  <!-- Button labels -->
  <text x="314" y="470" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">7</text>
  <text x="438" y="470" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">8</text>
  <text x="562" y="470" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">9</text>
  <text x="698" y="470" text-anchor="middle" font-family="sans-serif" font-size="32" fill="#06B6D4">÷</text>
  <text x="314" y="574" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">4</text>
  <text x="438" y="574" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">5</text>
  <text x="562" y="574" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">6</text>
  <text x="698" y="574" text-anchor="middle" font-family="sans-serif" font-size="32" fill="#06B6D4">×</text>
  <text x="314" y="678" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">1</text>
  <text x="438" y="678" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">2</text>
  <text x="562" y="678" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">3</text>
  <text x="698" y="740" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="700" fill="#0A0A1A">=</text>
  <text x="376" y="782" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">0</text>
  <text x="562" y="782" text-anchor="middle" font-family="sans-serif" font-size="32" fill="white">.</text>
  <!-- Scan icon overlay -->
  <circle cx="820" cy="204" r="72" fill="rgba(0,212,255,0.15)" stroke="#00D4FF" stroke-width="4"/>
  <text x="820" y="220" text-anchor="middle" font-family="sans-serif" font-size="52">📷</text>
</svg>`;

  const splashSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1242" height="2436" viewBox="0 0 1242 2436">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0A0A1A"/>
      <stop offset="100%" stop-color="#12122A"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#7C3AED"/>
      <stop offset="100%" stop-color="#06B6D4"/>
    </linearGradient>
  </defs>
  <rect width="1242" height="2436" fill="url(#bg)"/>
  <!-- Glow circle -->
  <circle cx="621" cy="1218" r="300" fill="url(#accent)" opacity="0.08"/>
  <!-- Icon -->
  <rect x="421" y="968" width="400" height="400" rx="88" fill="url(#accent)" opacity="0.2"/>
  <rect x="421" y="968" width="400" height="400" rx="88" fill="none" stroke="url(#accent)" stroke-width="4"/>
  <!-- Camera lens symbol -->
  <circle cx="621" cy="1168" r="80" fill="none" stroke="#00D4FF" stroke-width="8"/>
  <circle cx="621" cy="1168" r="48" fill="rgba(0,212,255,0.2)"/>
  <text x="621" y="1190" text-anchor="middle" font-family="sans-serif" font-size="56">📐</text>
  <!-- App name -->
  <text x="621" y="1450" text-anchor="middle" font-family="sans-serif" font-size="80" font-weight="800" fill="white">Solvix</text>
  <!-- Tagline -->
  <text x="621" y="1510" text-anchor="middle" font-family="sans-serif" font-size="36" fill="#8888AA">Instant Math Solver</text>
</svg>`;

  console.log('🎨 Generating assets...');

  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'icon.png'));
  console.log('  ✅ icon.png');

  await sharp(Buffer.from(iconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(assetsDir, 'adaptive-icon.png'));
  console.log('  ✅ adaptive-icon.png');

  await sharp(Buffer.from(splashSvg))
    .resize(1242, 2436)
    .png()
    .toFile(path.join(assetsDir, 'splash.png'));
  console.log('  ✅ splash.png');

  console.log('\n✨ All assets generated in /assets/');
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
