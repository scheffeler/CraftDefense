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

// Check for console errors
page.on('console', msg => {
  if (msg.type() === 'error') console.log('Browser error:', msg.text());
});

// Crafting table/furnace/chest area inside fortress (east shack at ~38,G,29)
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(42, 8.5, 30);
  cam.lookAt(38, 7.5, 30);
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/crafting-area.png' });

// Close look at fortress walls (cobblestone + torch)
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(24, 9, 32);
  cam.lookAt(18, 9, 32);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/fortress-wall.png' });

// Look toward water pond area
await page.evaluate(() => {
  const game = window.__game;
  if (!game?.scene?.camera) return;
  const cam = game.scene.camera;
  cam.position.set(12, 8, 14);
  cam.lookAt(8, 7, 15);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/water-area.png' });

await browser.close();
console.log('Done!');
