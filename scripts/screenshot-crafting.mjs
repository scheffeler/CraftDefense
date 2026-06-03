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

// Inside east shack looking at crafting_table (39,7,29), furnace (39,7,30), chest (38,7,30)
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(36, 7.8, 29.5);
  scene.camera.lookAt(39.5, 7, 29.8);
});
await page.waitForTimeout(300);
await page.screenshot({ path: 'screenshots/crafting-table-chest.png' });

// Obsidian spawn markers (at 32-33, 7-11, z=2)
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  scene.camera.position.set(30, 9, 8);
  scene.camera.lookAt(32.5, 8, 2);
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/obsidian-marker.png' });

// Glass, iron block view if any exist
await page.evaluate(() => {
  const scene = window.__game?.scene;
  if (!scene) return;
  // Look at the world from below surface to see underground blocks
  scene.camera.position.set(32, 5, 32);
  scene.camera.lookAt(35, 3, 35);
});
await page.waitForTimeout(200);
await page.screenshot({ path: 'screenshots/underground.png' });

await browser.close();
console.log('Done');
