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

// Open clearing: look across the grass surface from just above it
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(10, 8.5, 10);
  scene.camera.lookAt(20, 7.5, 20);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/grass-surface.png' });

// Looking at trees in NW area from outside
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(4, 12, 4);
  scene.camera.lookAt(10, 10, 10);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/trees-nw.png' });

await browser.close();
console.log('Done');
