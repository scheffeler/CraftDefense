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
  if (cam) { cam.position.set(32, 7.5, 28); cam.lookAt(28, 7.5, 21); }
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'screenshots/closeup.png' });
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (cam) { cam.position.set(20, 9, 28); cam.lookAt(20, 7, 20); }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/wall-closeup.png' });
await browser.close();
console.log('Done');
