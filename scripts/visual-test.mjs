import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto(`http://localhost:3739/?_t=${Date.now()}`, { waitUntil: 'load', timeout: 15000 });
await page.waitForSelector('canvas', { timeout: 15000 });
await page.waitForTimeout(5000);

// Interior fortress view
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(32, 8.62, 36);
  cam.lookAt(32, 8.0, 18);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/interior.png', fullPage: false });

// Look at a torch area
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(20, 8.5, 32);
  cam.lookAt(18, 8.5, 32);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/torch-view.png' });

// Exterior view (taiga biome area for snow)
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(8, 14, 8);
  cam.lookAt(20, 7, 20);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/exterior.png' });

// Aerial view
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(18, 28, 18);
  cam.lookAt(32, 7, 32);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/aerial.png' });

await browser.close();
console.log('Done! Saved interior.png, torch-view.png, exterior.png, aerial.png');
