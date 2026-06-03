import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-web-security', '--disable-cache']
});
const ctx2 = await browser.newContext({ viewport: { width: 1280, height: 720 }, bypassCSP: true });
const page = await ctx2.newPage();

await page.goto(`http://localhost:5177/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Look at furnace/chest/crafting_table at (38-39, 7, 29-30)
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(36, 7.8, 34);
  cam.lookAt(39, 7, 30);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/crafting-blocks.png' });

// Look at northwest village area (9, G+1, 13) = (9, 7, 13)
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(5, 8.5, 10);
  cam.lookAt(12, 7, 14);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/village-nw.png' });

await browser.close();
console.log('Done');
