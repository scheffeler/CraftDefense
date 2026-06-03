import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(4000);

// Position camera to see terrain with varied blocks
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  // Looking at fortress from outside to see terrain (grass, cobblestone, snow)
  cam.position.set(32, 12, 60);
  cam.lookAt(32, 8, 32);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/terrain-view.png' });

// Interior view with crafting table, furnace, chest
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(32, 8.62, 36);
  cam.lookAt(32, 8.0, 18);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/interior-view.png' });

// Side view toward desert/taiga to show biome textures
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(5, 10, 32);
  cam.lookAt(32, 8, 32);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/biome-view.png' });

await browser.close();
console.log('Screenshots saved');
