import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--disable-cache', '--no-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, bypassCSP: true });
const page = await context.newPage();

page.on('console', msg => {
  if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text().slice(0, 100));
});

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(5000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

// Check campfire lights exist
const campfireCount = await page.evaluate(() => {
  const game = window.__game;
  if (!game) return -1;
  return game.campfireLights?.size ?? 0;
});
console.log('Campfire lights count:', campfireCount);

// Daytime view of campfires from north
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  const cam = game.scene.camera;
  cam.position.set(32, 9.5, 28);
  cam.lookAt(32, 7.5, 37);
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/campfire-day.png' });
console.log('Day view saved');

// Night view of campfires — glowing warm light
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.02;
  const cam = game.scene.camera;
  cam.position.set(32, 9.0, 28);
  cam.lookAt(32, 7.5, 37);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: 'screenshots/campfire-night.png' });
console.log('Night view saved');

// Close-up of left campfire (26, 7, 36)
await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  game.scene._dayTime = 0.02;
  const cam = game.scene.camera;
  cam.position.set(24, 8.5, 34);
  cam.lookAt(26.5, 7.5, 36.5);
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/campfire-closeup.png' });
console.log('Closeup saved');

await browser.close();
console.log('Done — screenshots saved to screenshots/campfire-*.png');
