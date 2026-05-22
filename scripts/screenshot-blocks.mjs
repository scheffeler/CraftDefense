import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-web-security', '--disable-cache']
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, bypassCSP: true });
const page = await context.newPage();

await page.goto(`http://localhost:5177/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);
await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => el.style.display = 'none');
});

// Aerial view showing the whole world
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(32, 25, 32);
  cam.lookAt(32, 6, 50);
});
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/aerial.png' });

// Find and look at the spawn area near player start (inside fortress)  
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  // Inside fortress looking at the ground blocks
  cam.position.set(30, 7.5, 30);
  cam.lookAt(34, 6.5, 24);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/fortress-inside.png' });

// Look at ground-level blocks from near the surface  
await page.evaluate(() => {
  const cam = window.__game?.scene?.camera;
  if (!cam) return;
  cam.position.set(20, 7.5, 20);
  cam.lookAt(32, 6.5, 32);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/surface-blocks.png' });

await browser.close();
console.log('Done');
