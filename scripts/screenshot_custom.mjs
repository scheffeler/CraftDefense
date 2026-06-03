import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--disable-web-security', '--no-sandbox', '--use-gl=swiftshader']
});
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx2.newPage();

await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);

await page.evaluate(() => {
  const app = document.getElementById('app');
  if (app) Array.from(app.children).forEach(child => { if (child.tagName !== 'CANVAS') child.style.display = 'none'; });
});

// Spawn enemies at world center and fix camera to see them from lower altitude
await page.evaluate(() => {
  const g = window.__game;
  if (!g) { console.log("no game"); return; }
  const em = g.enemies;
  if (em && em.spawn) {
    em.spawn("skeleton", 35, 30);
    em.spawn("golem", 29, 30);
    em.spawn("zombie", 32, 26);
    em.spawn("orc", 36, 28);
  }
  // Override title orbit by setting angle AND low height
  g._titleAngle = Math.PI * 0.75; // northwest angle, r=35 h=26
});
await page.waitForTimeout(2000);
await page.screenshot({ path: 'screenshots/world_with_enemies.png' });

await browser.close();
console.log('Done');
