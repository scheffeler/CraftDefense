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
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  const scene = window.__game?.scene;
  if (!scene) return;
  Object.defineProperty(scene, 'isPointerLocked', { get: () => true, configurable: true });
});
await page.waitForTimeout(100);

// Very close to furnace block (39, G+1, 30) = (39, 7, 30)
// G = 6, so block at y=7. Camera should be at eye level looking at the block front face
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  // Position camera RIGHT IN FRONT of the furnace
  scene.camera.position.set(38.5, 7.5, 32);
  scene.camera.lookAt(39, 7.5, 30);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/furnace-closeup.png' });

// Very close to chest (38, 7, 30)
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(36.5, 7.5, 30);
  scene.camera.lookAt(38, 7.5, 30);
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/chest-closeup.png' });

// Close to crafting table (39, 7, 29)
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(36.5, 7.5, 29);
  scene.camera.lookAt(39, 7.5, 29);
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/crafting-closeup.png' });

await browser.close();
console.log('Done');
