import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-web-security']
});
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx2.newPage();

await page.goto(`http://localhost:5177/`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

// Hide overlay
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Freeze title orbit and position camera to see craft blocks
await page.evaluate(() => {
  const game = window.__game;
  if (!game) return;
  const scene = game.scene;
  // Override isPointerLocked getter temporarily to stop title orbit
  Object.defineProperty(scene, 'isPointerLocked', { get: () => true, configurable: true, enumerable: true });
  // Position camera to look at the crafting area (39, 7, 30)
  scene.camera.position.set(34, 8.5, 34);
  scene.camera.lookAt(39, 7, 29);
});

// Wait 2 frames for camera to settle
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/blocks-crafting.png' });

// Position to see a village and bookshelf/chest area
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(6, 8.5, 10);
  scene.camera.lookAt(12, 7, 15);
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/blocks-village.png' });

await browser.close();
console.log('Done');
