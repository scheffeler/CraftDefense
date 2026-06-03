import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ args: ['--disable-web-security'] });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();
await page.goto('http://localhost:5175/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
  const cam = window.__game?.scene?.camera;
  if (!cam) { console.log('no cam'); return; }
  // Very close up view of cobblestone fortress wall
  cam.fov = 40; // narrow FOV to see detail
  cam.updateProjectionMatrix();
  cam.position.set(22, 8.5, 22);
  cam.lookAt(18, 8, 22);
});
await page.waitForTimeout(1200);
await page.screenshot({ path: 'screenshots/blocks-wall-detail.png' });
await browser.close();
console.log('Done');
