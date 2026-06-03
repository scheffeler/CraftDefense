import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--disable-cache', '--no-sandbox'] 
});
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  bypassCSP: true,
});
const page = await context.newPage();

const ts = Date.now();
await page.goto(`http://localhost:5175/?_t=${ts}`, { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(4000);

await page.evaluate(() => {
  document.querySelectorAll('.fps-lock-prompt').forEach(el => {
    el.style.display = 'none';
  });
});

await page.evaluate(() => {
  const game = window.__game;
  if (!game || !game.scene) return;
  const cam = game.scene.camera;
  cam.position.set(32, 8.62, 36);
  cam.lookAt(32, 8.0, 18);
});

await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/before.png' });
console.log('Screenshot saved: screenshots/before.png');

await browser.close();
