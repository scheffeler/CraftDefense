import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

mkdirSync('screenshots', { recursive: true });

const browser = await chromium.launch({ 
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--disable-web-security', '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] 
});
const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await context.newPage();

await page.goto('http://localhost:5174/', { waitUntil: 'load' });
await page.waitForSelector('canvas', { timeout: 10000 });
await page.waitForTimeout(3000);

// Hide ALL overlays for clean screenshot
await page.evaluate(() => {
  const uiRoot = document.querySelector('#ui-root');
  if (uiRoot) uiRoot.style.display = 'none';
  document.querySelectorAll('.fps-lock-prompt, .overlay').forEach(function(el) {
    el.style.display = 'none';
  });
});

await page.waitForTimeout(400);
await page.screenshot({ path: 'screenshots/clean1.png' });

// Move camera close to terrain
await page.evaluate(() => {
  const cam = window.__GAME_CAMERA__;
  if (cam) {
    cam.position.set(32, 9.5, 58);
    cam.rotation.x = -0.25;
    cam.rotation.y = 0;
    cam.rotation.z = 0;
  }
});
await page.waitForTimeout(600);
await page.screenshot({ path: 'screenshots/terrain-low.png' });

await browser.close();
console.log('Done');
