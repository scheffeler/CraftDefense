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
await page.waitForTimeout(5000);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  const scene = window.__game?.scene;
  if (!scene) return;
  Object.defineProperty(scene, 'isPointerLocked', { get: () => true, configurable: true });
});
await page.waitForTimeout(100);

// Close aerial view of the fortress center and crafting shack area
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(42, 14, 40);
  scene.camera.lookAt(37, 7, 29);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/final-overview.png' });

await browser.close();
console.log('Done');
