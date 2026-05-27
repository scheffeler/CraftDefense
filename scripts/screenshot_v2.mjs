import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

// Move camera to in-game view
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(32, 8.62, 36);
  cam.lookAt(32, 8.0, 18);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/current.png' });

// Aerial view
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  game.scene.camera.position.set(18, 28, 18);
  game.scene.camera.lookAt(32, 7, 32);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/aerial.png' });

await browser.close();
console.log('Screenshots saved!');
