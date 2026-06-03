import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ args: ['--disable-web-security'] });
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  // Top-down view of grass terrain to see texture quality
  cam.position.set(32, 12, 35);
  cam.lookAt(32, 6, 32);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/topdown.png' });
// Side view of fortress wall (cobblestone)
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(28, 8, 20); 
  cam.lookAt(18, 8, 20);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/cobblestone-wall.png' });
await browser.close();
console.log('Texture screenshots done');
