import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, bypassCSP: true });
const page = await context.newPage();

await page.goto(`http://localhost:5175/?_t=${Date.now()}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => { el.style.display = 'none'; });
});

await page.evaluate(() => {
  const cam = window.__game && window.__game.scene && window.__game.scene.camera;
  if (!cam) return;
  cam.position.set(32, 8.62, 36);
  cam.lookAt(32, 8.0, 18);
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/after_interior.png' });

await page.evaluate(() => {
  const cam = window.__game && window.__game.scene && window.__game.scene.camera;
  if (!cam) return;
  cam.position.set(60, 14, 10);
  cam.lookAt(32, 6, 32);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/after_exterior.png' });

await page.evaluate(() => {
  const cam = window.__game && window.__game.scene && window.__game.scene.camera;
  if (!cam) return;
  cam.position.set(5, 10, 15);
  cam.lookAt(20, 8, 35);
});
await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/after_trees.png' });

await browser.close();
console.log('Screenshots done');
