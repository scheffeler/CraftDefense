import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-web-security']
});
const page = await (await browser.newContext({ viewport: { width: 1280, height: 720 } })).newPage();
await page.goto(`http://localhost:5178/`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4500);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  const scene = window.__game?.scene;
  if (!scene) return;
  Object.defineProperty(scene, 'isPointerLocked', { get: () => true, configurable: true });
});
await page.waitForTimeout(100);

// High aerial view outside fortress showing open terrain, grass, sand, trees
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(5, 16, 5);
  scene.camera.lookAt(16, 8, 16);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/open-terrain.png' });

// Title-like aerial but closer to show surface textures
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(32, 18, 50);
  scene.camera.lookAt(32, 7, 32);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/aerial-south.png' });

await browser.close();
console.log('Done');
