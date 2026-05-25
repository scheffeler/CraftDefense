import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--use-gl=swiftshader', '--enable-webgl'],
  headless: true,
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
page.on('pageerror', e => console.log('[error]', e.message));

await page.goto('http://localhost:5175/', { waitUntil: 'networkidle' });
await page.waitForTimeout(5000);

// Hide title screen
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Set to nighttime and check torch light count
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  // Set to midnight
  game.scene._dayTime = 0.05;
});
await page.waitForTimeout(1500);
await page.screenshot({ path: 'screenshots/night-torches.png' });

// Reset to day for daytime overview
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.45;
});
await page.waitForTimeout(1000);
await page.screenshot({ path: 'screenshots/day-overview.png' });

await browser.close();
console.log('Torch screenshots done!');
